import { ErrorType } from '../../utils/graphql/types/graphql';
import { MeNotificationType } from './types/me.types';

export class ErrorNotification {
  type: ErrorType;
  message: string;
  details: JSON;
  requestId: string;
  transactionId: string;
}

export type MePubSub_Event<T extends MeApiGql_EventsList> = {
  topic: T;
  payload: MeApiGql_EventPayload[T];
};

const prefix = 'me_';

export enum MeApiGql_EventNames {
  ME_NOTIFICATION = prefix + 'notification',
  //new
  BACK_PACK_NOTIFICATIONS = prefix + 'back_pack_notifications',
  MATCH_MAKING_NOTIFICATIONS = prefix + 'match_making_notifications',
  ERROR_NOTIFICATION = prefix + 'error_notification',
}

export interface MeApiGql_EventPayload {
  [MeApiGql_EventNames.ERROR_NOTIFICATION]: ErrorNotification;
  [MeApiGql_EventNames.ME_NOTIFICATION]: MeNotificationType;
}

export type MeApiGql_EventsList = keyof MeApiGql_EventPayload;
