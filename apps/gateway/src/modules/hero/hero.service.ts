import { Injectable, Logger } from '@nestjs/common';
import { SettingsStorageReader } from '../settings/storage/settings.storage-reader';

@Injectable()
export class HeroService {
  logger = new Logger(HeroService.name);
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  async findMany() {
    return this.settingStorageReader.findAll('hero');
  }

  async findOne(heroId: string) {
    return this.settingStorageReader.findById('hero', heroId);
  }
}
