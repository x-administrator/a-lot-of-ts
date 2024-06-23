import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { GraphqlPubSubToken } from '../../../graphql/graphql.pubsub';
import { ConvertTransactions_DEV, PushFakeNotifyInput, SetItemDto } from '../../../utils/graphql/types/graphql';
import { Authorized } from '../../auth/decorator/authorized.decorator';
import { DevService } from '../services/dev.service';
import { TrId } from '@app/common/decorators/transaction-id.decorator';
import { CurrentUser } from '../../auth/decorator/current-user.decorator';
import { PlayerModel } from '../../player/player.model';
import { DevTransactionService } from '../services/dev.transactions.service';

@Resolver(() => ConvertTransactions_DEV)
export class DevTransactionsMutationResolver {
  constructor(
    readonly service: DevService,
    private readonly devTransactionService: DevTransactionService,
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
  ) {}

  @ResolveField('pushFakeNotify')
  @Authorized()
  async pushFakeNotify(@TrId() trId: string, @CurrentUser() currentUser: PlayerModel, @Args('data') data: PushFakeNotifyInput) {
    this.devTransactionService.pushFakeNotify(trId, currentUser.userId, data?.errorChance || 0);
    return trId;
  }

  @ResolveField('addItemsForce')
  @Authorized()
  async setBackpackItem(@Args('payload') payload: SetItemDto, @TrId() trId: string) {
    this.service.setBackpackItem(payload);
    return trId;
  }
}
