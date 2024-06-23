import { Module } from '@nestjs/common';
import { SettingsStorageReader } from './settings.storage-reader';
import { SettingsStorageWriter } from './settings.storage-writer';
import { SettingsController } from './settings.controller';

@Module({
  controllers: [SettingsController],
  providers: [SettingsStorageReader, SettingsStorageWriter],
  exports: [SettingsStorageReader],
})
export class SettingsModule {}
