import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LootboxQuery } from 'apps/gateway/src/utils/graphql/types/graphql';
import { Authorized } from '../../auth/decorator/authorized.decorator';
import { CurrentUser, CurrentUserPayload } from '../../auth/decorator/current-user.decorator';
import { LootboxService } from '../lootbox.service';

@Authorized()
@Resolver(() => LootboxQuery)
export class LootboxQueryResolver {
  constructor(private service: LootboxService) {}

  @Query()
  async Lootbox() {
    return {};
  }

  @ResolveField()
  async boxFindMany(@CurrentUser() player: CurrentUserPayload) {
    return await this.service.boxFindMany(player.userId);
  }
}
