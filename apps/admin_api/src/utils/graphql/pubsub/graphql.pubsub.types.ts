export type GraphqlPubSub_Event<T extends GoogleApiGql_EventsList> = {
  topic: T;
  payload: GoogleApiGql_EventPayload[T];
};

export enum GoogleApiGql_EventNames {
  STATE_UPDATE = 'state_update',
}

export interface GoogleApiGql_EventPayload {
  [GoogleApiGql_EventNames.STATE_UPDATE]: any;
}

export type GoogleApiGql_EventsList = keyof GoogleApiGql_EventPayload;
