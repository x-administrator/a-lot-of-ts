import { RPC_PROVIDER, ClientProxyBase } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageState } from './settings.storage-state';

@Injectable()
export class SettingsStorageWriter {
  private logger = new Logger(SettingsStorageWriter.name);
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {
    rpc.clientProxy.connect();
  }

  settingsStarted() {
    this.logger.debug('start reload settings, after settings started event');
    this.reloadStorageDailyBonusConfig();
  }

  settingsUpdated() {
    this.logger.debug('start reload settings, after updated event');
    this.reloadStorageDailyBonusConfig();
  }

  private onApplicationBootstrap() {
    this.logger.debug('start reload settings, after daily_bonus started event');
    this.reloadStorageDailyBonusConfig();
  }

  private async reloadStorageDailyBonusConfig() {
    try {
      const config = await this.fetchConfig();

      if (!config) {
        return;
      }

      StorageState.setConfig(config);
    } catch (error) {
      this.logger.warn('settings service return error, message %s', error.message);
    }
  }

  async fetchConfig() {
    const ping = await this.ping();

    if (!ping) {
      return;
    }

    const config = await this.rpc.fetch('settings.daily-bonus.findMany.1', null);

    return config;
  }

  private async ping() {
    try {
      return await this.rpc.fetch('settings.common.ping.1', 'daily_bonus');
    } catch (error) {
      this.logger.warn('settings service not available, error %s', error.message);
      return false;
    }
  }
}
