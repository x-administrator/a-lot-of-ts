import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateBackpackItemPayload as BackpackItemUpdatedPayload } from 'apps/player/src/modules/transaction/transaction.type';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../../graphql/graphql.pubsub';
import { MeApiGql_EventNames } from '../../auth/me.pubsub.types';
import { ConvertItemsPayload, MeNotificationType } from '../../auth/types/me.types';
import { RewardNotificationService } from './reward-notification.service';
import { BackPackNotification } from 'apps/gateway/src/utils/graphql/types/graphql';

@Injectable()
export class PlayerService {
  logger = new Logger(PlayerService.name);
  constructor(
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
    readonly rewardNotification: RewardNotificationService,
  ) {}

  async convertItems(data: ConvertItemsPayload) {
    this.rpc.sendCommand('player.convertedItems.addItems.1', data);
  }

  async onTransactionProcess(payload: BackpackItemUpdatedPayload) {
    if (!payload.logNotification) {
      return;
    }
    await this.saveNotification(payload);
    await this.emitMeNotifications(payload);
    await this.emitBackPackUpdateNotification(payload);
    this.logger.debug(payload);
    return true;
  }

  async saveNotification(payload: BackpackItemUpdatedPayload) {
    await this.rewardNotification.add(payload.playerId, {
      title: payload.title,
      transactionId: payload.transactionId,
      items: payload.items,
    });
  }

  async emitBackPackUpdateNotification(payload: BackpackItemUpdatedPayload) {
    const backPackNotifications: BackPackNotification = {
      title: payload.title,
      items: payload.items,
      transactionId: payload.transactionId,
    };
    await this.pubSub.publish(MeApiGql_EventNames.BACK_PACK_NOTIFICATIONS, { backPackNotifications });
  }

  async emitMeNotifications(payload: BackpackItemUpdatedPayload) {
    const meNotification: MeNotificationType = {
      title: payload.title,
    };
    await this.pubSub.publish(MeApiGql_EventNames.ME_NOTIFICATION, { meNotification });
  }
}
