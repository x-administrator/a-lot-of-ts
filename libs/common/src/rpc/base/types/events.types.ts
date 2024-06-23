import { FlatMap, Prettify } from '@app/common/utils/types';
import { GameServerApiEvents } from '../../events/gameServerApi';
import { GatewayEvents } from '../../events/gateway';
import { PlayerEvents } from '../../events/player';
import { SettingsEvents } from '../../events/settings';
import { CommandsKeysList } from './commands.types';
import { SetPatternKeys } from './helper.types';
import { DailyBonusEvents } from '../../events/daily-bonus';
import { ErrorEvents } from '../../events/error';
import { MatchMakingEvents } from '../../events/match_making.events';

type EventsFull = {
  gameServerApi: GameServerApiEvents;
  gateway: GatewayEvents;
  matchMaking: MatchMakingEvents;
  player: PlayerEvents;
  settings: SettingsEvents;
  daily_bonus: DailyBonusEvents;
  error: ErrorEvents;
};

export type EventsFlat = Prettify<FlatMap<FlatMap<FlatMap<EventsFull>>>>;

export type EventsAny = keyof EventsFlat;

export type EventsKeysList = keyof EventsFlat;

export type EventsWithPatterns = SetPatternKeys<EventsFlat>;

export type EventsKeysWithPatternsList = keyof EventsWithPatterns;

export type EventOptions = {
  userId?: string;
  trId?: string;
  parentCommand?: CommandsKeysList;
};

export type EventPayload<T extends EventsKeysList> = {
  userId?: string;
  trId?: string;
  parentCommand?: CommandsKeysList;
  payload: EventsFlat[T];
};
