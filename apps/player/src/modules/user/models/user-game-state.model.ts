import { BackpackFindItem } from 'apps/gateway/src/modules/player/types/backpack.types';

export type UserGameStateModel = Partial<
  {
    backpackItems?: BackpackFindItem[];
  } & {
    userId: string;
  }
>;
