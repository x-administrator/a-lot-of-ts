import { IDailyBonusConfig } from 'apps/settings/src/modules/daily-bonus/daily-bonus.types';

export class StorageState {
  private static instance: StorageState | null = null;
  private active = false;
  private configs: Map<IDailyBonusConfig['wave'], IDailyBonusConfig> = new Map();

  static findConfig() {
    if (!this.instance) {
      this.instance = new StorageState();
    }

    if (!this.instance.active) {
      throw new Error('StorageState not active');
    }

    return [...this.instance.configs.values()];
  }

  static setConfig(config: IDailyBonusConfig[]) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    this.instance.setConfigs(config);
    this.instance.active = true;
  }

  static isActive() {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    return this.instance.active;
  }

  private setConfigs(configs: IDailyBonusConfig[]) {
    this.configs = configs.reduce((acc, config) => acc.set(config.wave, config), new Map<IDailyBonusConfig['wave'], IDailyBonusConfig>());
  }
}
