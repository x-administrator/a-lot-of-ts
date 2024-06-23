import { ClientProxyBase, EventsAny, RPC_PROVIDER } from '@app/common/rpc';
import { ErrorType } from '@app/common/rpc/base/types/errors.types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DevService } from 'apps/gateway/src/modules/dev/services/dev.service';
import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';
import { BackpackService } from '../backpack/backpack.service';
import { BackpackPublicInfo } from '../backpack/dto/backpack-find.response';
import { SettingsStorageReader } from '../settings/settings.storage-reader';
import { UserService } from '../user/user.service';
import { AddItemsPayload, ConvertItemsPayload, UpdateBackpackItemPayload, UpdateItemsEvent } from './transaction.type';

@Injectable()
export class TransactionService {
  logger = new Logger(DevService.name);
  constructor(
    readonly userService: UserService,
    readonly backpackService: BackpackService,
    readonly settingStorageReader: SettingsStorageReader,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {}

  async itemConvert(payload: ConvertItemsPayload): Promise<UpdateItemsEvent[] | undefined> {
    const userBackpack = await this.backpackService.findOne({ userId: payload.playerId });

    if (!userBackpack) {
      this.rpc.sendError('base.transaction.1', {
        message: 'Backpack not found',
        type: ErrorType.TRANSACTION,
        details: {},
      });
      return;
    }

    const currencyMap = this.settingStorageReader.findAllCurrenciesMap();
    const userCurrencies = userBackpack?.items.filter((item) => currencyMap.has(item.itemId));

    const result: UpdateItemsEvent[] = [];
    for (const item of payload.items) {
      const resp = await this.backpackService.itemConvert(userBackpack, userCurrencies, item.itemId, item.amount, payload.playerId);
      if (!resp) {
        continue;
      }
      result.push(resp);
    }
    return result;
  }

  async addItems(payload: AddItemsPayload) {
    const userBackpack = await this.backpackService.findOne({ userId: payload.playerId });
    if (!userBackpack) {
      this.rpc.sendError('base.transaction.1', {
        message: 'Backpack not found',
        type: ErrorType.TRANSACTION,
        details: {},
      });
      return;
    }
    const result: UpdateItemsEvent[] = [];
    for (const item of payload.items) {
      const resp = await this.backpackService.itemTransaction(userBackpack, item.type, item.itemId, item.amount, payload.playerId);
      if (!resp) {
        continue;
      }
      result.push(resp);
    }
    return result;
  }

  async addOrIncreaseItem(backpack: BackpackPublicInfo, item: ItemForSellInfo, amount: number) {
    await this.backpackService.itemCreate({
      amount: amount,
      itemId: item.itemId,
      userId: backpack.userId,
    });
  }

  callEventItemsUpdated(payload: UpdateBackpackItemPayload, parentCommand: EventsAny) {
    return this.rpc.sendEvent('player.transactions.updateItems.1', payload, {
      parentCommand: parentCommand as any,
    });
  }
}
