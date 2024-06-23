import { IDailyBonusConfig } from 'apps/settings/src/modules/daily-bonus/daily-bonus.types';
import { Version_V1 } from '../base/types';

export type DailyBonusFetch = {
  'claim-bonus': {
    one: {
      [Version_V1]: {
        args: { playerId: string };
        return: boolean;
      };
    };
  };
  find: {
    active: {
      [Version_V1]: {
        args: { playerId: string };
        return: IDailyBonusConfig[];
      };
    };
  };
};
