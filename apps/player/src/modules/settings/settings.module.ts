import { Global, Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsStorageReader } from './settings.storage-reader';
import { SettingsStorageWriter } from './settings.storage-writer';

@Global()
@Module({
  controllers: [SettingsController],
  providers: [SettingsStorageReader, SettingsStorageWriter],
  exports: [SettingsStorageReader],
})
export class SettingsModule {}
