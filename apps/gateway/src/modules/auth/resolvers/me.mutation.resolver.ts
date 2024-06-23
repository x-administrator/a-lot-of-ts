import { Inject } from '@nestjs/common';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { MeMutation } from 'apps/gateway/src/utils/graphql/types/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../../graphql/graphql.pubsub';
import { PlayerService } from '../../player/services/player.service';
import { Authorized } from '../decorator/authorized.decorator';
import { CurrentUser, CurrentUserPayload } from '../decorator/current-user.decorator';
import { ConvertItemsPayload } from '../types/me.types';
import { TrId } from '@app/common/decorators/transaction-id.decorator';

@Authorized()
@Resolver(() => MeMutation)
export class MeMutationResolver {
  constructor(
    readonly playerService: PlayerService,
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
  ) {}

  @Mutation()
  async Me() {
    return {};
  }

  @ResolveField()
  async convertItems(@Args('payload') payload: ConvertItemsPayload, @TrId() trId: string) {
    this.playerService.convertItems(payload);
    return trId;
  }

  @ResolveField()
  async readNotification(@Args('id') id: string, @CurrentUser() currentUser: CurrentUserPayload, @TrId() trId: string) {
    this.playerService.rewardNotification.delete(currentUser.userId, id);
    return trId;
  }

  @ResolveField()
  Inventory() {
    return {};
  }
}
