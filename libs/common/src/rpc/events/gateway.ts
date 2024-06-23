import { RoomReadyType } from 'apps/matchmaking/src/modules/game_process/types';
import { Version_V1 } from '../base/types';

export type GatewayEvents = {
  backpack: {
    updated: {
      [Version_V1]: boolean;
    };
  };
  room: {
    ready: {
      [Version_V1]: RoomReadyType;
    };
  };
};
