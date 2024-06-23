import { ClientProxyBase, FetchKeysList, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SourceType, StorageState } from './settings.storage-state';

@Injectable()
export class SettingsStorageWriter {
  private logger = new Logger(SettingsStorageWriter.name);

  sources: { [n in SourceType]: FetchKeysList } = {
    'items-for-sell': 'settings.items-for-sell.findMany.1',
    weapone: 'settings.weapon.findMany.1',
    weaponV2: 'settings.weapon.getList.1',
    localization: 'settings.localization.findMany.1',
    hero: 'settings.hero.findMany.1',
    npc: 'settings.npc.findMany.1',
  };

  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {
    rpc.clientProxy.connect();
  }

  settingsStarted() {
    this.logger.debug('start reload settings, after settings started event');
    this.reloadStorage();
  }

  settingsUpdated(sourceName: SourceType) {
    this.logger.debug('start reload settings, after updated event, source %s', sourceName);
    this.reloadStorage(sourceName);
  }

  private onApplicationBootstrap() {
    this.logger.debug('start reload settings, after service started event');
    this.reloadStorage();
  }

  private async reloadStorage(sourceName?: SourceType) {
    try {
      const ping = await this.ping();
      if (!ping) {
        return;
      }
      const data = await this.fetchData(sourceName);
      if (!data) {
        return;
      }
      StorageState.setData(data);
    } catch (error) {
      this.logger.warn('settings service return error, message %s', error.message);
    }
  }

  async fetchData(sourceName?: SourceType): Promise<Partial<{ [n in SourceType]: any }> | undefined> {
    if (sourceName && !Object.keys(this.sources).includes(sourceName)) {
      return;
    }
    const ping = await this.ping();
    if (!ping) {
      return;
    }
    if (!sourceName) {
      const result: { [n in SourceType]: any }[] = [];
      for (const sourceKey in this.sources) {
        const data = await this.rpc.fetch(this.sources[sourceKey], null);
        result[sourceKey] = data;
      }
      return result as any;
    }
    return {
      [sourceName]: await this.rpc.fetch(this.sources[sourceName], null),
    };
  }

  private async ping() {
    try {
      return await this.rpc.fetch('settings.common.ping.1', 'gateway');
    } catch (error) {
      this.logger.warn('settings service not available, error %s', error.message);
      return false;
    }
  }
}
