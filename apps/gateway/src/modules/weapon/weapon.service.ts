import { Injectable } from '@nestjs/common';
import { SettingsStorageReader } from '../settings/storage/settings.storage-reader';

@Injectable()
export class WeaponService {
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  async findMany() {
    return this.settingStorageReader.findAll('weapone');
  }

  async findOne(weaponId: string) {
    return this.settingStorageReader.findById('weapone', weaponId);
  }
}
