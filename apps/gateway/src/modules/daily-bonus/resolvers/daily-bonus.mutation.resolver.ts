import { Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { DailyBonusService } from '../daily-bonus.service';
import { DailyBonusMutation } from '../../../utils/graphql/types/graphql';
import { CurrentUser, CurrentUserPayload } from '../../auth/decorator/current-user.decorator';
import { Authorized } from '../../auth/decorator/authorized.decorator';

@Authorized()
@Resolver(() => DailyBonusMutation)
export class DailyBonusMutationResolver {
  constructor(private readonly dailyBonusService: DailyBonusService) {}

  @Mutation()
  async dailyBonus() {
    return {};
  }

  @ResolveField('claim')
  async claim(@CurrentUser() player: CurrentUserPayload): Promise<boolean> {
    return await this.dailyBonusService.claimBonus(player.userId);
  }
}
