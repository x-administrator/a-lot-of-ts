import { Resolver, Subscription } from '@nestjs/graphql';
import { GoogleApiGql_EventNames } from '../../utils/graphql/pubsub/graphql.pubsub.types';
import { Inject } from '@nestjs/common';
import { GraphqlPubSubToken } from '../../utils/graphql/pubsub/graphql.pubsub';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class SettingsSubscription_Resolver {
  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSub) {}

  @Subscription('settingsStateUpdate')
  async settingsStateUpdate() {
    return this.pubSub.asyncIterator(GoogleApiGql_EventNames.STATE_UPDATE);
  }
}
