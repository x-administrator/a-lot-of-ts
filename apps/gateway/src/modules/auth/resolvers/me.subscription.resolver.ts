import { Inject, Logger } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { MeNotification } from 'apps/gateway/src/utils/graphql/types/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../../graphql/graphql.pubsub';
import { AuthorizedSubscription } from '../../auth/decorator/authorized-subscription.decorator';
import { Authorized } from '../decorator/authorized.decorator';
import { ErrorNotification, MeApiGql_EventNames } from '../me.pubsub.types';

@Resolver()
export class MeSubscriptionResolver {
  private readonly logger = new Logger(MeSubscriptionResolver.name);

  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSub) {}

  //TODO: Delete it after testign
  @Authorized()
  @AuthorizedSubscription(() => ErrorNotification)
  errorNotification() {
    this.logger.log('Connected ErrorNotification');
    return this.pubSub.asyncIterator(MeApiGql_EventNames.ERROR_NOTIFICATION);
  }

  @Authorized()
  @AuthorizedSubscription(() => MeNotification)
  meNotification() {
    this.logger.log('Connected meNotification');
    return this.pubSub.asyncIterator(MeApiGql_EventNames.ME_NOTIFICATION);
  }

  @AuthorizedSubscription(() => MeNotification)
  backPackNotifications() {
    this.logger.log('Connected meNotification');
    return this.pubSub.asyncIterator(MeApiGql_EventNames.BACK_PACK_NOTIFICATIONS);
  }
}
