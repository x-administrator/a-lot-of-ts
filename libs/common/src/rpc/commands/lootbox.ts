import { LootboxOpenBox } from 'apps/lootbox/src/modules/processing/processing.types';
import { Version_V1 } from '../base/types';

export type LootboxCommands = {
  processing: {
    openBox: {
      [Version_V1]: LootboxOpenBox;
    };
    superWin: {
      [Version_V1]: null;
    };
  };
};
