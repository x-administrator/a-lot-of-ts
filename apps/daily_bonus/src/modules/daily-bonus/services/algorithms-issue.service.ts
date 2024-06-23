import { Injectable } from '@nestjs/common';
import { Item } from '../daily-bonus.types';
import { DailyItemsRepository } from '../daily-bonus.repository';
import { SettingsStorageReader } from '../../settings/settings.storage-reader';

@Injectable()
export class AlgorithmsIssue {
  constructor(
    private readonly dailyItemsRepository: DailyItemsRepository,
    private readonly settingsStorageReader: SettingsStorageReader,
  ) {}

  isDayAvailableToClaimBonus(nextAt: Date): boolean {
    const now = new Date();
    const config = this.settingsStorageReader.findDailyBonusConfig();
    const timeStart = +config[0].timeStart.toString().slice(0, 1);

    return now.getHours() >= timeStart && now.getDate() >= nextAt.getDate();
  }

  async getAvailablePlayerWave(playerId: string, playerWaveId: number, playerDay: number): Promise<string> {
    const config = this.settingsStorageReader.findDailyBonusConfig();
    const playerWave = config.find((wave) => +wave.wave === playerWaveId);
    const lowestSortWave = config.sort((a, b) => a.sort - b.sort)[0].wave;

    if (!playerWave) {
      return lowestSortWave;
    }

    if (playerWave.isRepeat && playerWave.days === playerDay) {
      await this.dailyItemsRepository.resetWaveDays(playerId);
      return playerWave.wave;
    }

    if (!playerWave.isRepeat && playerWave.days === playerDay) {
      const nextWave = config.find((wave) => +wave.wave > +playerWave.wave && wave.isAllow);

      if (!nextWave) {
        return lowestSortWave;
      }

      return nextWave.wave;
    }

    return lowestSortWave;
  }

  getCurrentItem(waveId: string, day: number): Item {
    const config = this.settingsStorageReader.findDailyBonusConfig();
    const currentWave = config.find((wave: { wave: string }) => wave.wave === waveId);
    const lowestReward = {
      name: config[0].rewards[0].name,
      amount: config[0].rewards[0].amount,
    };

    if (!currentWave) {
      return lowestReward;
    }

    const reward = currentWave.rewards.find((reward) => +reward.day === day);

    if (!reward) {
      return lowestReward;
    }

    return {
      name: reward.name,
      amount: reward.amount,
    };
  }

  findNextDayForBonus(nextAt: Date): Date {
    const now = new Date(nextAt);
    if (now >= nextAt) {
      now.setDate(now.getDate() + 1);
    }
    return now;
  }
}
