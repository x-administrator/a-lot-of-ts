import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { EventPayload, OnEvent } from '@app/common/rpc';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../graphql/graphql.pubsub';
import { PlayerService } from './services/player.service';

@Controller()
@UseInterceptors(AppContextInterceptor)
export class PlayerController {
  constructor(
    readonly service: PlayerService,
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
  ) {}

  @OnEvent('player.transactions.updateItems.1')
  async onTransactionProcess(@Payload() { payload }: EventPayload<'player.transactions.updateItems.1'>) {
    await this.service.onTransactionProcess(payload);
    return true;
  }
}
