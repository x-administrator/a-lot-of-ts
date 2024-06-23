import { LootboxActiveListPerUser } from 'apps/lootbox/src/modules/processing/processing.types';
import { Version_V1 } from '../base/types';
import { NodeState } from '@app/common/health-check/health-check.type';

export type LootboxFetch = {
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
        args: { playerId: string };
        return: LootboxActiveListPerUser[];
      };
    };
  };
};
