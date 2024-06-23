import { NodeState } from '@app/common/health-check/health-check.type';
import { PlayerFindOneDTO } from 'apps/gateway/src/modules/player/dto/player-find-one.dto';
import { PlayerModel } from 'apps/gateway/src/modules/player/player.model';
import {
  BackpackItem,
  BackpackPublicInfo,
  IWeaponInfo,
  LoginPayload,
  RegisterPayload,
  SetItemDto,
} from 'apps/player/src/modules/backpack/backpack.types';
import { BackpackFindDTO } from 'apps/player/src/modules/backpack/dto/backpack-find.dto';
import { InventoryItem } from 'apps/player/src/modules/inventory/redis_storage/inventory.storage.types';
import { Version_V1 } from '../base/types';

export type PlayerFetch = {
  common: {
    ping: {
      [Version_V1]: {
        args: string;
        return: NodeState;
      };
    };
  };
  find: {
    one: {
      [Version_V1]: {
        args: Partial<PlayerFindOneDTO>;
        return: PlayerModel;
      };
    };
  };
  register: {
    local: {
      [Version_V1]: {
        args: RegisterPayload;
        return: PlayerModel;
      };
    };
  };
  login: {
    local: {
      [Version_V1]: {
        args: LoginPayload;
        return: PlayerModel;
      };
    };
  };
  inventory: {
    currentOne: {
      [Version_V1]: {
        args: string; // playerId
        return: InventoryItem[];
      };
    };

    checkCollection: {
      [Version_V1]: {
        args: string; // playerId
        return: boolean;
      };
    };
    currentMany: {
      [Version_V1]: {
        args: string[]; // playersId
        return: {
          playerId: string;
          items: BackpackItem[];
        }[];
      };
    };
  };
  backpack: {
    findOne: {
      [Version_V1]: {
        args: Partial<BackpackFindDTO>;
        return: BackpackPublicInfo | null;
      };
    };
    itemCreate: {
      [Version_V1]: {
        args: SetItemDto;
        return: boolean;
      };
    };
    weaponFindMany: {
      [Version_V1]: {
        args: void;
        return: IWeaponInfo[];
      };
    };
    weaponFindOne: {
      [Version_V1]: {
        args: void;
        return: IWeaponInfo | null;
      };
    };
  };
  transactions: {
    addItems: {
      [Version_V1]: {
        args: void;
        return: boolean;
      };
    };
  };
};
