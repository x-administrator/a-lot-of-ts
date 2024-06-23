import { Injectable, Logger } from '@nestjs/common';
import { SettingsStorageReader } from '../settings/storage/settings.storage-reader';

@Injectable()
export class ItemForSellService {
  logger = new Logger(ItemForSellService.name);
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  async findMany() {
    return this.settingStorageReader.findAll('items-for-sell');
  }

  async findOne(itemId: string) {
    return this.settingStorageReader.findById('items-for-sell', itemId);
  }

  async currenciesFindMany() {
    const all = await this.findMany();
    return all.filter((ifs) => ifs.group === 'currency');
  }
}
