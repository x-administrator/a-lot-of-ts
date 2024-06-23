import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { PlayerService } from '../player/services/player.service';
import { Session, SessionPayload } from './session.types';

@Injectable()
export class SessionService {
  private sessions = new Map<string, Session>();
  private storeDelayS = 1800; // 30 min

  constructor(private playerService: PlayerService) {}

  async refreshSession(userId: string) {
    //TODO: продумать функционал
    const response = await this.playerService.rpc.fetch('player.backpack.findOne.1', { userId });
    return this.create({ playerId: userId, backpackItems: response?.items ?? [] });
  }

  create(payload: SessionPayload) {
    const sessionId = uuid.v4();
    const item: Session = {
      ...payload,
      sessionId,
      lastUpdatedAt: Date.now(),
    };

    this.sessions.set(payload.playerId, item);
    return sessionId;
  }

  delete(playerId: string) {
    this.sessions.delete(playerId);
  }

  get(playerId: string): Session | undefined {
    return this.sessions.get(playerId);
  }

  isValid(playerId: string) {
    const session = this.get(playerId);
    if (!session) {
      return;
    }
    return Date.now() - session.lastUpdatedAt < this.storeDelayS;
  }
}
