import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { OnError } from '@app/common/rpc/base/decorators/error.decorator';
import { Controller, Inject, Logger, UseInterceptors } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../graphql/graphql.pubsub';
import { MeApiGql_EventNames } from './me.pubsub.types';

@Controller()
@UseInterceptors(AppContextInterceptor)
export class MeController {
  private logger = new Logger(MeController.name);
  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSub) {}

  @OnError('base.transaction.1')
  async onError(@Payload() payload: any) {
    this.logger.error(payload);
    await this.pubSub.publish(MeApiGql_EventNames.ERROR_NOTIFICATION, { errorNotification: payload });
  }
}
