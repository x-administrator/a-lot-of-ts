import { AddItemsPayload, ConvertItemsPayload } from '@app/common/utils/types';
import { Version_V1 } from '../base/types';
import { InventoryItem } from 'apps/player/src/modules/inventory/redis_storage/inventory.storage.types';

export type PlayerCommands = {
  transactions: {
    addItems: {
      [Version_V1]: AddItemsPayload;
    };
    test: {
      [Version_V1]: ConvertItemsPayload;
    };
    setItems: {
      [Version_V1]: ConvertItemsPayload;
    };
  };
  convertedItems: {
    addItems: {
      [Version_V1]: ConvertItemsPayload;
    };
  };
  inventory: {
    setItems: {
      [Version_V1]: InventoryItem[];
    };
  };
};
