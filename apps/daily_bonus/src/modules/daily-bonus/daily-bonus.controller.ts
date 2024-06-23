import { Controller, UseInterceptors } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { DailyItemsService } from './services/daily-bonus.service';
import { FetchFlatArgs, OnFetch } from '@app/common/rpc';
import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';

@UseInterceptors(AppContextInterceptor)
@Controller()
export class DailyItemsController {
  constructor(private readonly dailyItemsService: DailyItemsService) {}

  @OnFetch('dailyBonus.claim-bonus.one.1')
  async claimDailyBonus(@Payload() payload: FetchFlatArgs['dailyBonus.claim-bonus.one.1']): Promise<boolean> {
    await this.dailyItemsService.claimBonus(payload.playerId);
    return true;
  }
}
