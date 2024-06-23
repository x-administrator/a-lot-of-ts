import { IHeroInfo } from 'apps/settings/src/modules/hero/hero.interface';
import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';
import { ILocalization } from 'apps/settings/src/modules/localization/localization.interface';
import { INpcInfo } from 'apps/settings/src/modules/npc/npc.interface';
import { IWeaponInfo } from '../../../utils/graphql/types/graphql';
import { IWeaponSettings } from 'apps/settings/src/modules/weapone_v2/types/weapon.interface';

export type SourceType = 'items-for-sell' | 'weapone' | 'weaponV2' | 'localization' | 'hero' | 'npc';

export class StorageState {
  private static instance: StorageState | null = null;
  data: Record<SourceType, Map<string, any>> = {
    'items-for-sell': new Map<ItemForSellInfo['itemId'], ItemForSellInfo>(),
    weapone: new Map<IWeaponInfo['weaponeId'], IWeaponInfo>(),
    localization: new Map<ILocalization['EN'], ILocalization>(),
    hero: new Map<IHeroInfo['heroId'], IHeroInfo>(),
    npc: new Map<INpcInfo['npcId'], INpcInfo>(),
    weaponV2: new Map<IWeaponSettings['weaponId'], IWeaponSettings>(),
  };

  static setData(data: Partial<Record<SourceType, any[]>>) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    this.instance.setData(data);
  }

  static findAll(sourceName: SourceType) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    return [...this.instance.data[sourceName].values()];
  }

  static findById(sourceName: SourceType, id: string) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    return this.instance.data[sourceName].get(id) ?? null;
  }

  private setData(data: Partial<Record<SourceType, any[]>>) {
    const sourceMappings: Record<SourceType, string> = {
      'items-for-sell': 'itemId',
      weapone: 'weaponeId',
      localization: 'EN',
      hero: 'heroId',
      npc: 'npcId',
      weaponV2: 'weaponId',
    };

    for (const [sourceKey, keyField] of Object.entries(sourceMappings)) {
      this.data[sourceKey] = data[sourceKey]?.reduce((m, r) => m.set(r[keyField], r), new Map<string, any>());
    }
  }
}
