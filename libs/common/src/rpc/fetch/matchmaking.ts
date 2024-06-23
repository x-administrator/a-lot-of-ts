import { NodeState } from '@app/common/health-check/health-check.type';
import { PlayerTeamInfo, PlayerIdInTeam } from 'apps/matchmaking/src/modules/game_process/types';
import { Version_V1 } from '../base/types';

export type MatchMakingFetch = {
  common: {
    ping: {
      [Version_V1]: {
        args: string;
        return: NodeState;
      };
    };
  };
  connection: {
    available: {
      [Version_V1]: {
        args: string;
        return: PlayerTeamInfo;
      };
    };
    getPlayerTeam: {
      [Version_V1]: {
        args: { connectionId: string };
        return: PlayerIdInTeam | null;
      };
    };
  };
};
