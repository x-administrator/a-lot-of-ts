import { FlatMap, Prettify } from '@app/common/utils/types';
import { GameServerApiCommands } from '../../commands/gameServerApi';
import { LootboxCommands } from '../../commands/lootbox';
import { MatchmakingCommands } from '../../commands/matchmaking';
import { PlayerCommands } from '../../commands/player';
import { SetPatternKeys } from './helper.types';

type CommandsFull = {
  player: PlayerCommands;
  lootbox: LootboxCommands;
  matchmaking: MatchmakingCommands;
  gameServerApi: GameServerApiCommands;
};

export type CommandsFlat = Prettify<FlatMap<FlatMap<FlatMap<CommandsFull>>>>;

export type CommandsWithPatterns = SetPatternKeys<CommandsFlat>;

export type CommandsKeysList = keyof CommandsFlat;

export type CommandsKeysWithPatternsList = keyof CommandsWithPatterns;

export type CommandOptions = {
  userId?: string;
  trId?: string;
  callbackCommandSuccess?: CommandsKeysList;
  callbackCommandSuccessArgs?: any;
  callbackCommandError?: CommandsKeysList;
};

export type CommandPayload<T extends CommandsKeysList> = {
  userId?: string;
  trId?: string;
  callbackCommandSuccess?: CommandsKeysList;
  callbackCommandError?: CommandsKeysList;
  payload: CommandsFlat[T];
};
