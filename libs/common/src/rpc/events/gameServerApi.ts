import { RoomCreatedFail, RoomCreatedResponse } from 'apps/game_server_api/src/modules/types/gameServers.type';
import { Version_V1 } from '../base/types';

export type GameServerApiEvents = {
  room: {
    created: {
      [Version_V1]: RoomCreatedResponse;
    };
    failed: {
      [Version_V1]: RoomCreatedFail;
    };
  };
};
