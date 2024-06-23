import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
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
    this.reloadStorage();
  }

  settingsUpdated() {
    this.logger.debug('start reload settings, after updated event');
    this.reloadStorage();
  }

  private onApplicationBootstrap() {
    this.logger.debug('start reload settings, after player started event');
    this.reloadStorage();
  }

  private async reloadStorage() {
    try {
      const records = await this.fetchAllData();
      if (!records) {
        return;
      }
      StorageState.setIFS(records);
    } catch (error) {
      this.logger.warn('settings service return error, message %s', error.message);
    }
  }

  async fetchAllData() {
    const ping = await this.ping();
    if (!ping) {
      return;
    }
    return this.rpc.fetch('settings.items-for-sell.findMany.1', null);
  }

  private async ping() {
    try {
      return await this.rpc.fetch('settings.common.ping.1', 'player');
    } catch (error) {
      this.logger.warn('settings service not available, error %s', error.message);
      return false;
    }
  }
}
