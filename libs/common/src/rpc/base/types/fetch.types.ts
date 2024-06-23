import { FlatMap, MoveKeyToParent, Prettify } from '@app/common/utils/types';
import { GameServerApiFetch } from '../../fetch/gameServerApi';
import { GatewayFetch } from '../../fetch/gateway';
import { LootboxFetch } from '../../fetch/lootbox';
import { MatchMakingFetch } from '../../fetch/matchmaking';
import { PlayerFetch } from '../../fetch/player';
import { SettingsFetch } from '../../fetch/settings';
import { DailyBonusFetch } from '../../fetch/daily-bonus';

export type FetchFull = {
  gateway: GatewayFetch;
  player: PlayerFetch;
  settings: SettingsFetch;
  lootbox: LootboxFetch;
  dailyBonus: DailyBonusFetch;
  gameServerApi: GameServerApiFetch;
  matchmaking: MatchMakingFetch;
};

export type FetchFlat = Prettify<FlatMap<FlatMap<FlatMap<FetchFull>>>>;
export type FetchKeysList = keyof FetchFlat;
export type FetchFlatArgs = MoveKeyToParent<FetchFlat, 'args', void>;
export type FetchFlatReturning = MoveKeyToParent<FetchFlat, 'return', void>;
