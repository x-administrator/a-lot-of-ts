export type RequestEventType = {
  userId: string; // id игрока от которого пришел запрос.
  req_tr_id: string; // id запроса со стороны клиента игры
  status: RequestEventStatus; // Состояние запроса. run -  запрос в обработке. done - запрос выполнен.
  res_body: object | null; // результат запроса.
  res_headers: object | null; // заголовки для ответа
  wait_count: number; // количество ожидающих ответ запросов. Нужно добавить warn log если больше одного
};

export enum RequestEventStatus {
  DONE = 'done',
  ERROR = 'error',
  RUN = 'run',
}

export enum RequestEventHeaders {
  xReqTrId = 'req_tr_id',
}

export type RequestEventPayload = {
  transactionId: string;
  userId: string;
};
