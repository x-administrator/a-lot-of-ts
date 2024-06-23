import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { IRequestContext, SystemHeaders } from '@app/common/request-context';
import { CommandPayload, EventsAny, OnCommand } from '@app/common/rpc';
import { RpcKeyString } from '@app/common/rpc/base/decorators/rpc-key.decorator';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'async_hooks';
import { TransactionService } from './transaction.service';

@UseInterceptors(AppContextInterceptor)
@Controller()
export class TransactionController {
  logger: Logger = new Logger(TransactionController.name);

  constructor(
    readonly service: TransactionService,
    readonly als: AsyncLocalStorage<IRequestContext>,
  ) {}

  @OnCommand('player.convertedItems.addItems.1')
  async convertedItems(
    @Payload() { payload }: CommandPayload<'player.convertedItems.addItems.1'>,
    @RpcKeyString() parentCommand: EventsAny,
  ) {
    const store = this.als.getStore();
    const playerId = store![SystemHeaders.userId]!;
    const transactionId = store![SystemHeaders.trId]!;
    const items = await this.service.itemConvert({ ...payload, playerId });
    if (!items || !items.length) {
      return;
    }
    this.service.callEventItemsUpdated(
      {
        transactionId,
        playerId,
        logNotification: payload.logNotification,
        title: payload.title,
        items,
      },
      parentCommand,
    );
  }

  @OnCommand('player.transactions.addItems.1')
  async addItems(@Payload() { payload }: CommandPayload<'player.transactions.addItems.1'>, @RpcKeyString() parentCommand: EventsAny) {
    const items = await this.service.addItems(payload);
    if (!items || !items.length) {
      return;
    }
    this.service.callEventItemsUpdated(
      {
        transactionId: payload.transactionId,
        logNotification: payload.logNotification,
        playerId: payload.playerId,
        title: payload.title,
        items,
      },
      parentCommand,
    );
  }
}
