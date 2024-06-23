import { RoomReady } from '../../utils/graphql/types/graphql';

export type MatchMakingPubSub_Event<T extends MatchMakingApiGql_EventsList> = {
  topic: T;
  payload: MatchMakingApiGql_EventPayload[T];
};

const prefix = 'me_';

export enum MatchMakingApiGql_EventNames {
  ROOM_READY = prefix + 'room_ready',
}

export interface MatchMakingApiGql_EventPayload {
  [MatchMakingApiGql_EventNames.ROOM_READY]: RoomReady;
}

export type MatchMakingApiGql_EventsList = keyof MatchMakingApiGql_EventPayload;
