import { DailyBonusTransactionStateBody } from '@app/common/utils/types/daily-bonus';
import { Version_V1 } from '../base/types';

export type DailyBonusEvents = {
  list: {
    updated: {
      [Version_V1]: null;
    };
  };
  state: {
    updated: {
      [Version_V1]: DailyBonusTransactionStateBody;
    };
  };
};
