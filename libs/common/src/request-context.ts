export enum SystemHeaders {
  xRequestId = 'x-request-id',
  userId = 'x-user-id',
  sessionId = 'x-session-id',
  trId = 'transaction-id',
}

export interface IRequestContext {
  [SystemHeaders.xRequestId]: string;
  [SystemHeaders.userId]: string;
  [SystemHeaders.sessionId]: string;
  [SystemHeaders.trId]?: string;
  isInit: boolean;
}
