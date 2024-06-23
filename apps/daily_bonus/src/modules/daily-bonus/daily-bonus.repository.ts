import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { PlayerState } from './daily-bonus.types';

@Injectable()
export class DailyItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPlayerById(playerId: string): Promise<PlayerState | null> {
    return this.prisma.playerState.findUnique({ where: { playerId } });
  }

  async createPlayer(playerId: string): Promise<PlayerState> {
    return this.prisma.playerState.create({
      data: {
        playerId,
        wave: 1,
        day: 1,
      },
    });
  }

  async findPlayerWaveId(playerId: string): Promise<number> {
    const player = await this.findPlayerById(playerId);
    return player ? player.wave : 1;
  }

  async updatePlayerState(playerId: string, newState: Partial<PlayerState>): Promise<void> {
    await this.prisma.playerState.update({
      where: { playerId },
      data: newState,
    });
  }

  async resetWaveDays(playerId: string): Promise<void> {
    await this.updatePlayerState(playerId, {
      day: 1,
      isDoneWave: false,
    });
  }
}
