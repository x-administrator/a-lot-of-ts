import { MutationResolver } from '@app/common/decorators/mutation-resolver.decorator';
import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { ErrorType } from '@app/common/rpc/base/types/errors.types';
import { Inject } from '@nestjs/common';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { SetItemDto } from 'apps/player/src/modules/backpack/backpack.types';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../../graphql/graphql.pubsub';
import { DevMutation } from '../../../utils/graphql/types/graphql';
import { Authorized } from '../../auth/decorator/authorized.decorator';
import { DevService } from '../services/dev.service';

@Resolver(() => DevMutation)
export class DevMutationResolver {
  constructor(
    readonly service: DevService,
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {}

  @Mutation()
  async Dev() {
    return {};
  }

  @Authorized()
  @MutationResolver()
  @ResolveField()
  async testErrorHandler() {
    setTimeout(() => {
      this.rpc.sendError('base.transaction.1', { message: 'TEst', type: ErrorType.TRANSACTION, details: {} });
    }, 3000);
  }

  @ResolveField('setBackpackItem')
  @Authorized()
  @MutationResolver()
  async setBackpackItem(@Args('payload') payload: SetItemDto) {
    this.service.setBackpackItem(payload);
  }
}
