import { RoomReadyEvent } from 'apps/matchmaking/src/modules/game_process/types';
import { Version_V1 } from '../base/types';

export type MatchMakingEvents = {
  room: {
    created: {
      [Version_V1]: RoomReadyEvent;
    };
  };
};
