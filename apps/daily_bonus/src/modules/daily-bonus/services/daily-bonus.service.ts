import { PlayerTransactionAddItems } from '@app/common/utils/types';
import { DailyItemsRepository } from '../daily-bonus.repository';
import { AlgorithmsIssue } from './algorithms-issue.service';
import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DailyItemsService {
  constructor(
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
    private readonly algorithmsIssue: AlgorithmsIssue,
    private readonly dailyItemsRepository: DailyItemsRepository,
  ) {}

  async claimBonus(playerId: string): Promise<void> {
    try {
      let player = await this.dailyItemsRepository.findPlayerById(playerId);
      if (!player) {
        player = await this.dailyItemsRepository.createPlayer(playerId);
      }

      const isAbleToClaim = this.algorithmsIssue.isDayAvailableToClaimBonus(player.nextAt);

      if (!isAbleToClaim) {
        this.rpc.sendEvent('error.player.daily-bonus.1', { message: "Day is not available for claiming new bonus." });
        return;
      }

      const availableWave = await this.algorithmsIssue.getAvailablePlayerWave(playerId, player.wave, player.day);
      const nextDayForBonus = this.algorithmsIssue.findNextDayForBonus(player.nextAt);
      const currentItem = this.algorithmsIssue.getCurrentItem(availableWave, player.day);

      await this.dailyItemsRepository.updatePlayerState(playerId, {
        nextAt: nextDayForBonus,
        version: player.version + 1,
        day: player.day + 1,
        wave: +availableWave,
      });

      const payload: PlayerTransactionAddItems = {
        playerId,
        title: 'dailyBonus.claimed.items',
        items: [currentItem],
      };

      this.rpc.sendEvent('player.transactions.addItems.1', payload);
      this.rpc.sendEvent('daily_bonus.list.updated.1', null);
    } catch (error) {
      this.rpc.sendEvent('error.player.daily-bonus.1', { message: error.message });
    }
  }
}
