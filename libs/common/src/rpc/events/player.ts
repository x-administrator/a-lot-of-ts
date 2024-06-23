import { UpdateBackpackItemPayload } from 'apps/player/src/modules/transaction/transaction.type';
import { Version_V1 } from '../base/types';
import { PlayerTransactionAddItems } from '@app/common/utils/types';

export type PlayerEvents = {
  transactions: {
    updateItems: {
      [Version_V1]: UpdateBackpackItemPayload;
    };
    addItems: {
      [Version_V1]: PlayerTransactionAddItems;
    };
  };
  backpack: {
    updated: {
      [Version_V1]: boolean;
    };
  };
  auth: {
    registeredSuccessfully: {
      [Version_V1]: {
        userId: string;
      };
    };
  };
  inventory: {
    updated: {
      [Version_V1]: boolean;
    };
  };
};
