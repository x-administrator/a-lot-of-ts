import { GoogleTable, GoogleTableDataPreSave } from 'apps/admin_api/src/settings/settings.types';
import { SettingsSyncStateType } from 'apps/admin_api/src/utils/graphql/types/graphql';
import { IHeroInfo } from 'apps/settings/src/modules/hero/hero.interface';
import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';
import { ILocalizationPublic } from 'apps/settings/src/modules/localization/localization.interface';
import { ILootboxBox } from 'apps/settings/src/modules/lootbox/lootbox.interface';
import { INpcInfo } from 'apps/settings/src/modules/npc/npc.interface';
import { IWeaponInfo } from 'apps/settings/src/modules/weapon/weapon.interface';
import { IDailyBonusConfig } from 'apps/settings/src/modules/daily-bonus/daily-bonus.types';
import { IWeaponSettings } from 'apps/settings/src/modules/weapone_v2/types/weapon.interface';
import { Version_V1 } from '../base/types/base.types';
import { NodeState } from '@app/common/health-check/health-check.type';

export type SettingsFetch = {
  common: {
    ping: {
      [Version_V1]: {
        args: string;
        return: NodeState;
      };
    };
  };
  weapon: {
    getList: {
      [Version_V1]: {
        args: null;
        return: IWeaponSettings[];
      };
    };
    findOne: {
      [Version_V1]: {
        args: { weaponId: string };
        return: IWeaponInfo;
      };
    };
    findMany: {
      [Version_V1]: {
        args: null;
        return: IWeaponInfo[];
      };
    };
  };
  'items-for-sell': {
    findOne: {
      [Version_V1]: {
        args: { itemId: string };
        return: ItemForSellInfo;
      };
    };
    findMany: {
      [Version_V1]: {
        args: null;
        return: ItemForSellInfo[];
      };
    };
  };
  'items-for-sell-currency': {
    findMany: {
      [Version_V1]: {
        args: null;
        return: ItemForSellInfo[];
      };
    };
  };
  lootbox: {
    boxFindMany: {
      [Version_V1]: {
        args: null;
        return: ILootboxBox[];
      };
    };
  };
  hero: {
    findMany: {
      [Version_V1]: {
        args: null;
        return: IHeroInfo[];
      };
    };
    findOne: {
      [Version_V1]: {
        args: { heroId: string };
        return: IHeroInfo;
      };
    };
  };
  npc: {
    findMany: {
      [Version_V1]: {
        args: null;
        return: INpcInfo[];
      };
    };
    findOne: {
      [Version_V1]: {
        args: { npcId: string };
        return: INpcInfo;
      };
    };
  };
  localization: {
    findMany: {
      [Version_V1]: {
        args: null;
        return: ILocalizationPublic[];
      };
    };
  };
  'google-api': {
    'get-last-modify': {
      [Version_V1]: {
        args: null;
        return: GoogleTable[];
      };
    };
    'get-data-pre-save-by-file': {
      [Version_V1]: {
        args: string;
        return: GoogleTableDataPreSave[];
      };
    };
    'get-sync-state': {
      [Version_V1]: {
        args: null;
        return: SettingsSyncStateType;
      };
    };
    'update-files': {
      [Version_V1]: {
        args: null;
        return: void;
      };
    };
    'save-pre-save-data': {
      [Version_V1]: {
        args: string[];
        return: void;
      };
    };
    'delete-saved-data': {
      [Version_V1]: {
        args: string;
        return: void;
      };
    };
  };
  'daily-bonus': {
    findMany: {
      [Version_V1]: {
        args: null;
        return: IDailyBonusConfig[];
      };
    };
  };
};
