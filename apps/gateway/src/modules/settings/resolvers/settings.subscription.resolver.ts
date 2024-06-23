import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { GraphqlPubSubToken } from 'apps/gateway/src/graphql/graphql.pubsub';
import { DatasourceStateUpdatedResponse } from 'apps/gateway/src/utils/graphql/types/graphql';
import { PubSub } from 'graphql-subscriptions';
import { SettingsApiGql_EventNames } from '../settings.pubsub.types';

@Resolver()
export class SettingsSubscriptionResolver {
  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSub) {}

  @Subscription(() => DatasourceStateUpdatedResponse)
  dataSourceUpdated() {
    return this.pubSub.asyncIterator(SettingsApiGql_EventNames.STATE_UPDATE);
  }
}
