import { FlatMap, Prettify } from '@app/common/utils/types';
import { BaseErrors } from '../../errors/base';
import { CommandsKeysList } from './commands.types';
import { SetPatternKeys } from './helper.types';

export enum ErrorType {
  TRANSACTION = 'transaction',
  MATCHMAKING = 'matchmaking',
}

type ErrorsFull = {
  base: BaseErrors;
};

export type ErrorsFlat = Prettify<FlatMap<FlatMap<ErrorsFull>>>;

export type ErrorsAny = keyof ErrorsFlat;

export type ErrorsKeysList = keyof ErrorsFlat;

export type ErrorsWithPatterns = SetPatternKeys<ErrorsFlat>;

export type ErrorsKeysWithPatternsList = keyof ErrorsWithPatterns;

export type ErrorOptions = {
  userId?: string;
  trId?: string;
  parentCommand?: CommandsKeysList;
};

export type ErrorPayload = {
  type: ErrorType;
  message: string;
  details: Record<string, any>;
};

export type ErrorPayloadFull = {
  type: ErrorType;
  message: string;
  details: string;
  requestId?: string;
  transactionId: string;
};
