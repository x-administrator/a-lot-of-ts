import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { ErrorType } from '@app/common/rpc/base/types/errors.types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BackpackFindItem } from 'apps/gateway/src/modules/player/types/backpack.types';
import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';
import * as lodash from 'lodash';
import { ItemTransactionType, UpdateItemsEvent } from '../transaction/transaction.type';
import { UserService } from '../user/user.service';
import { BackpackRepository } from './backpack.repository';
import { SetItemDto } from './backpack.types';
import { BackpackFindDTO } from './dto/backpack-find.dto';
import { BackpackItemPublicInfo, BackpackPublicInfo } from './dto/backpack-find.response';

@Injectable()
export class BackpackService {
  readonly logger = new Logger(BackpackService.name);

  constructor(
    private userService: UserService,
    readonly repo: BackpackRepository,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {}

  async findOne(payload: Partial<BackpackFindDTO>) {
    if (Object.values(payload).length === 0) {
      return null;
    }

    return this.repo.findOneBackpack(payload);
  }

  async itemConvert(
    backpack: BackpackPublicInfo,
    userCurrencies: BackpackItemPublicInfo[],
    itemId: string,
    amount: number,
    userId: string,
  ): Promise<UpdateItemsEvent | undefined> {
    const itemInfo = this.repo.findOneIFS(itemId);
    if (!itemInfo || !itemInfo.price) {
      this.rpc.sendError('base.transaction.1', {
        message: 'Item not found',
        type: ErrorType.TRANSACTION,
        details: {
          itemId,
        },
      });
      return;
    }
    const transactionItems: { type: ItemTransactionType; itemId: string; amount: number; userId: string }[] = [];
    for (const itemPriceEl of itemInfo.price) {
      if (!itemPriceEl || !itemPriceEl.value || !itemPriceEl.item) {
        continue;
      }
      const userCurrencyItem = userCurrencies.find((c) => c.itemId === itemPriceEl.item);
      const itemPrice = +itemPriceEl.value;
      const totalPrice = amount * itemPrice;

      if (!userCurrencyItem || userCurrencyItem.amount < totalPrice) {
        this.rpc.sendError('base.transaction.1', {
          message: 'Not enough currency',
          type: ErrorType.TRANSACTION,
          details: {
            itemId: userCurrencyItem,
          },
        });
        return;
      }
      transactionItems.push({
        amount: totalPrice,
        itemId: itemPriceEl.item,
        type: ItemTransactionType.WITHDRAW,
        userId: userId,
      });
    }

    transactionItems.push({
      amount: amount,
      itemId: itemId,
      type: ItemTransactionType.ADD,
      userId: userId,
    });

    const result = await Promise.all(
      transactionItems.map((item) => this.itemTransaction(backpack, item.type, item.itemId, item.amount, userId)),
    );

    return result.at(-1);
  }

  async itemTransaction(
    backpack: BackpackPublicInfo,
    type: ItemTransactionType,
    itemId: string,
    amount: number,
    userId: string,
  ): Promise<UpdateItemsEvent | undefined> {
    const itemInfo = this.repo.findOneIFS(itemId);
    if (!itemInfo) {
      return;
    }

    const existItem = await this.repo.findOneBackpackItem(itemId, userId);
    if (existItem) {
      if (itemInfo.type === 'many') {
        await this.transferExistManyTypeItem(existItem, type, amount);
      }
      if (itemInfo.type === 'uniq') {
        await this.transferExistUniqTypeItem(itemInfo, type, userId, backpack);
      }
    } else {
      if (itemInfo.type === 'many') {
        await this.repo.createBackpackItem(amount, itemId, backpack.backpackId);
      }
      if (itemInfo.type === 'uniq') {
        await this.repo.createBackpackItem(1, itemId, backpack.backpackId);
      }
    }
    return {
      amount,
      convertedFrom: null,
      itemId: itemId,
      type,
    };
  }

  private async transferExistManyTypeItem(
    existItem: { backpackItemId: string; backpackId: string; amount: number },
    type: ItemTransactionType,
    amount: number,
  ) {
    let newAmount = existItem.amount;
    if (type === ItemTransactionType.ADD) {
      newAmount += amount;
    } else {
      newAmount -= amount;
      if (newAmount < 0) {
        this.rpc.sendError('base.transaction.1', {
          message: 'Not enough currency',
          type: ErrorType.TRANSACTION,
          details: {
            itemId: existItem.backpackItemId,
            amountNeeded: newAmount,
          },
        });
        return;
      }
    }
    await this.repo.updateBackpackItemAmount(existItem.backpackItemId, newAmount);
  }

  private async transferExistUniqTypeItem(
    itemInfo: ItemForSellInfo,
    type: ItemTransactionType,
    userId: string,
    backpack: BackpackPublicInfo,
  ) {
    if (type === ItemTransactionType.ADD) {
      const alternativeRewards = itemInfo.alternative_reward;
      if (!alternativeRewards?.length) {
        return;
      }
      const alternativeReward = alternativeRewards[Math.floor(Math.random() * alternativeRewards.length)];
      const amount = lodash.random(alternativeReward!.min, alternativeReward!.max);
      if (!alternativeReward || !alternativeReward.item) {
        return;
      }
      const alternativeItem = this.repo.findOneIFS(alternativeReward.item);
      if (!alternativeItem) {
        return;
      }
      const existAlternativeItem = await this.repo.findOneBackpackItem(alternativeReward.item, userId);
      if (!existAlternativeItem) {
        await this.repo.createBackpackItem(amount, alternativeReward.item, backpack.backpackId);
        return;
      }
      const newAmount = existAlternativeItem.amount + amount;
      await this.repo.updateBackpackItemAmount(existAlternativeItem.backpackItemId, newAmount);
    } else {
      return this.repo.deleteItem(itemInfo.itemId, backpack.backpackId);
    }
  }

  async itemCreate(payload: SetItemDto) {
    try {
      const existItem = await this.repo.findOneBackpackItem(payload.itemId, payload.userId);
      if (existItem) {
        await this.repo.updateBackpackItemAmount(existItem.backpackItemId, existItem.amount + payload.amount);
        await this.shareState(existItem.backpackId);
        return true;
      }

      const item = this.repo.findOneIFS(payload.itemId);
      if (!item) {
        this.logger.error('Item not found');
        return false;
      }

      const backpack = await this.repo.findBackpackByUserId(payload.userId);

      if (!backpack) {
        this.logger.error('Backpack not found');
        return false;
      }

      await this.repo.createBackpackItem(payload.amount, item.itemId, backpack.backpackId);
      await this.shareState(backpack.backpackId);

      return true;
    } catch (e) {
      Logger.error('Cannot create item');
      return false;
    }
  }

  private async shareState(backpackId: string) {
    const records = await this.repo.findManyBackpackItems(backpackId);
    const userId = await this.repo.findOneBackpackUserId(backpackId);
    if (!userId) {
      this.rpc.sendError('base.transaction.1', {
        message: 'Backpack not found',
        type: ErrorType.TRANSACTION,
        details: {
          backpackId,
        },
      });
      return;
    }
    const itemsMap = this.repo.settingStorageReader.getAllIFS().reduce((res, v) => res.set(v.itemId, v.i18n), new Map<string, string>());
    const items: BackpackFindItem[] = records
      .filter((record) => itemsMap.has(record.itemId))
      .map((record) => ({
        backpackId: record.backpackId,
        amount: record.amount,
        data: record.data ?? null,
        item: itemsMap.get(record.itemId) || '',
      }));

    await this.userService.shareStateUpdated({
      userId,
      backpackItems: items,
    });
  }
}
