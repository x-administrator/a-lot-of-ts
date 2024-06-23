import { CommandPrefix, EventPrefix } from './base.types';

export type MarkWords<S extends string | number | symbol, K extends string = '*'> = S extends `${infer A}.${infer Rest}`
  ? `${A}.${MarkWords<Rest, K>}` | `${K}.${MarkWords<Rest, K>}`
  : S | K;

export type SetPatternKeys<T, P extends string = '*'> = {
  [K in keyof T as MarkWords<K, P>]: T[K];
};

export type BasePatternType = `${string}.${string}.${string}.${number}.${string}`;
export type CommandPatternType = `${CommandPrefix}.${BasePatternType}`;
export type EventPatternType = `${EventPrefix}.${BasePatternType}`;
export type EventOrCommandPatternType = CommandPatternType | EventPatternType;
export type CommunicationKeyData = [
  type: CommandPrefix | EventPrefix,
  service: string,
  domain: string,
  action: string,
  version: number,
  userId: string,
];

export type RpcKeyType = {
  type: CommandPrefix | EventPrefix;
  service: string;
  domain: string;
  action: string;
  version: number;
  userId: string;
};

export type CommandPayload<T> = {
  trId: string;
  payload: T;
  userId: string;
  callbackCommandSuccess?: EventOrCommandPatternType;
  callbackCommandError?: EventOrCommandPatternType;
};

export type EventPayload<T> = {
  trId?: string;
  payload: T;
  parentCommand?: EventOrCommandPatternType;
};
