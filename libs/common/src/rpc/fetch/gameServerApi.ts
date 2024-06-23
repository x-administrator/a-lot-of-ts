import { NodeState } from '@app/common/health-check/health-check.type';
import { IGameServer } from 'apps/game_server_api/src/modules/types/gameServers.type';
import { Version_V1 } from '../base/types';

export type GameServerApiFetch = {
  common: {
    ping: {
      [Version_V1]: {
        args: string;
        return: NodeState;
      };
    };
  };
  find: {
    active: {
      [Version_V1]: {
        args: null;
        return: IGameServer[];
      };
    };
    byUserId: {
      [Version_V1]: {
        args: string;
        return: IGameServer[];
      };
    };
  };
};
