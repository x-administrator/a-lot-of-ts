import { MutationResolver } from '@app/common/decorators/mutation-resolver.decorator';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { Authorized } from 'apps/gateway/src/modules/auth/decorator/authorized.decorator';
import { CurrentUser, CurrentUserPayload } from 'apps/gateway/src/modules/auth/decorator/current-user.decorator';
import { GameServersMutation, InitGameInput, StoreStatusesInput } from 'apps/gateway/src/utils/graphql/types/graphql';
import { MatchmakingService } from '../matchmaking.service';

@Authorized()
@Resolver(() => GameServersMutation)
export class GameServersMutationResolver {
  constructor(private service: MatchmakingService) {}

  @Mutation()
  async GameServers() {
    return {};
  }

  @ResolveField()
  @MutationResolver()
  async initGame(@Args('input') input: InitGameInput, @CurrentUser() currentUser: CurrentUserPayload) {
    await this.service.initGame(currentUser.userId, input);
  }

  @ResolveField()
  @MutationResolver()
  async storeStates(@Args('data') gameServersPing: StoreStatusesInput[], @CurrentUser() currentUser: CurrentUserPayload) {
    await this.service.storeStatuses(gameServersPing, currentUser.userId);
  }
}
