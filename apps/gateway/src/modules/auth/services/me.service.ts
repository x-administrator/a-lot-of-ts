import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerModel } from '../../player/player.model';
import { PlayerService } from '../../player/services/player.service';
import { SessionService } from '../../session/session.service';

@Injectable()
export class MeService {
  constructor(
    readonly playerService: PlayerService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async myProfile(currentUser: PlayerModel) {
    const backpack = await this.playerService.rpc.fetch('player.backpack.findOne.1', { userId: currentUser.userId });
    const unReadNotificationCount = await this.playerService.rewardNotification.size(currentUser.userId);
    return { ...currentUser, backpack, unReadNotificationCount };
  }

  async rewardNotifications(userId: string) {
    return this.playerService.rewardNotification.getAll(userId);
  }
}
