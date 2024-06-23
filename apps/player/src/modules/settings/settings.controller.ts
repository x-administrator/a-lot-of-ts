import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { OnEvent } from '@app/common/rpc';
import { Controller, UseInterceptors } from '@nestjs/common';
import { SettingsStorageWriter } from './settings.storage-writer';

@UseInterceptors(AppContextInterceptor)
@Controller()
export class SettingsController {
  constructor(private readonly settingsStorageWriter: SettingsStorageWriter) {}

  @OnEvent('settings.common.started.1', { queue: 'player' })
  async onSettingsStarted() {
    this.settingsStorageWriter.settingsStarted();
  }

  @OnEvent('settings.*.updated.1', { queue: 'player' })
  async onSettingsUpdated() {
    this.settingsStorageWriter.settingsUpdated();
  }
}
