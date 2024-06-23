import { Injectable, Logger } from '@nestjs/common';
import { SettingsStorageReader } from '../settings/storage/settings.storage-reader';

@Injectable()
export class NpcService {
  logger = new Logger(NpcService.name);
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  async findMany() {
    return this.settingStorageReader.findAll('npc');
  }

  async findOne(npcId: string) {
    return this.settingStorageReader.findById('npc', npcId);
  }
}
