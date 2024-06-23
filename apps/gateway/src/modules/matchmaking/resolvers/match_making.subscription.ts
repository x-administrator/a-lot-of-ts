import { Inject, Logger } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { RoomReady } from 'apps/gateway/src/utils/graphql/types/graphql';
import { GraphqlPubSubToken, PubSubInst } from '../../../graphql/graphql.pubsub';
import { AuthorizedSubscription } from '../../auth/decorator/authorized-subscription.decorator';
import { Authorized } from '../../auth/decorator/authorized.decorator';

@Resolver()
export class MatchMakingSubscriptionResolver {
  private readonly logger = new Logger(MatchMakingSubscriptionResolver.name);

  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSubInst) {}

  @Authorized()
  @AuthorizedSubscription(() => RoomReady)
  roomReady() {
    return this.pubSub.asyncIterator2('roomReady');
  }
}
