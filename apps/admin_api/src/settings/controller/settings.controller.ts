import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { EventsFlat, OnEvent } from '@app/common/rpc';
import { UseInterceptors, Controller, Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { GraphqlPubSubToken } from '../../utils/graphql/pubsub/graphql.pubsub';
import { GoogleApiGql_EventNames } from '../../utils/graphql/pubsub/graphql.pubsub.types';
import { PubSub } from 'graphql-subscriptions';

@UseInterceptors(AppContextInterceptor)
@Controller()
export class SettingsController {
  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSub) {}

  @OnEvent('settings.google-api.syncProcessed.1')
  async getAllActiveBoxes(@Payload('payload') payload: EventsFlat['settings.google-api.syncProcessed.1']) {
    await this.pubSub.publish(GoogleApiGql_EventNames.STATE_UPDATE, { settingsStateUpdate: payload });
  }
}
