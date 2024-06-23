import { Injectable } from '@nestjs/common';
import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';
import { StorageState } from './settings.storage-state';

@Injectable()
export class SettingsStorageReader {
  findIFSById(id: string): ItemForSellInfo | null {
    return StorageState.findIFSById(id);
  }

  findManyIFSByIds(ids: string[]): ItemForSellInfo[] {
    return StorageState.findManyIFSByIds(ids);
  }

  getAllIFS(): ItemForSellInfo[] {
    return StorageState.getAllIFS();
  }

  findAllCurrenciesMap() {
    return StorageState.getAllIFS()
      .filter((r) => r.group === 'currency')
      .reduce((acc, r) => acc.set(r.itemId, r), new Map<ItemForSellInfo['itemId'], ItemForSellInfo>());
  }
}
