import { Injectable } from '@nestjs/common';
import { StorageState } from './settings.storage-state';

@Injectable()
export class SettingsStorageReader {
  findDailyBonusConfig() {
    const config = StorageState.findConfig();
    return config;
  }
}
