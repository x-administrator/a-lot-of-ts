import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DailyBonusService {
  logger = new Logger(DailyBonusService.name);
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}

  async claimBonus(userId: string): Promise<boolean> {
    return await this.rpc.fetch('dailyBonus.claim-bonus.one.1', { playerId: userId });
  }
}
