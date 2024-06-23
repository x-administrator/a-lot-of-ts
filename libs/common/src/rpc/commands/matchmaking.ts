import { StoreStatusesType } from 'apps/game_server_api/src/modules/game_servers/dto/putGameServers.dto';
import { InitGameInput } from 'apps/matchmaking/src/modules/game_process/types';
import { Version_V1 } from '../base/types';

export type MatchmakingCommands = {
  gameServers: {
    storeStatuses: {
      [Version_V1]: StoreStatusesType[];
    };
  };
  gameProcess: {
    initiate: {
      [Version_V1]: InitGameInput;
    };
  };
};
