import { Injectable, Logger } from '@nestjs/common';
import { SettingsStorageReader } from '../settings/storage/settings.storage-reader';

@Injectable()
export class LocalizationService {
  logger = new Logger(LocalizationService.name);
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  async findMany() {
    return this.settingStorageReader.findAll('localization');
  }
}
