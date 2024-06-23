import { Injectable } from '@nestjs/common';
import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';
import { SourceType, StorageState } from './settings.storage-state';

@Injectable()
export class SettingsStorageReader {
  findById(sourceName: SourceType, id: string): ItemForSellInfo | null {
    return StorageState.findById(sourceName, id);
  }

  findAll(sourceName: SourceType) {
    return StorageState.findAll(sourceName);
  }
}
