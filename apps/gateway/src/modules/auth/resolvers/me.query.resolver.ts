import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MeQuery } from 'apps/gateway/src/utils/graphql/types/graphql';
import { PlayerModel } from '../../player/player.model';
import { Authorized } from '../decorator/authorized.decorator';
import { CurrentUser } from '../decorator/current-user.decorator';
import { MeService } from '../services/me.service';

@Authorized()
@Resolver(() => MeQuery)
export class MeQueryResolver {
  constructor(private service: MeService) {}

  @Query()
  async Me() {
    return {};
  }
  @ResolveField('profile')
  async profile(@CurrentUser() currentUser: PlayerModel) {
    return this.service.myProfile(currentUser);
  }

  @ResolveField()
  async rewardNotifications(@CurrentUser() currentUser: PlayerModel) {
    return this.service.rewardNotifications(currentUser.userId);
  }

  @ResolveField()
  async Inventory() {
    return {};
  }
}
