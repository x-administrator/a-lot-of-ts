import { BaseCacheService } from '@app/common/base-cache/base-cache.service';
import { RedisIO } from '@app/common/redis/redis-io';
import { IRequestContext, SystemHeaders } from '@app/common/request-context';
import { Logger } from '@nestjs/common';
import { ClientProxy, NatsRecordBuilder } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'async_hooks';
import * as nats from 'nats';
import { lastValueFrom } from 'rxjs';
import {
  CommandOptions,
  CommandPayload,
  CommandPrefix,
  CommandsFlat,
  CommandsKeysList,
  ErrorPrefix,
  EventOptions,
  EventPayload,
  EventPrefix,
  EventsFlat,
  EventsKeysList,
  FetchFlatArgs,
  FetchFlatReturning,
  FetchKeysList,
  FetchPrefix,
} from './types';
import { ErrorPayload, ErrorPayloadFull, ErrorsKeysList, ErrorType } from './types/errors.types';

export class ClientProxyBase {
  private cache: BaseCacheService;

  constructor(
    readonly clientProxy: ClientProxy,
    readonly als: AsyncLocalStorage<IRequestContext>,
    readonly logger: Logger,
    redis: RedisIO,
  ) {
    clientProxy.connect();
    this.cache = new BaseCacheService(redis, {
      expireTimeS: 60,
      prefix: 'transaction_temp_data',
      onlyUniqueKeys: true,
    });
  }

  async sendCommand<T extends CommandsKeysList>(commandName: T, payload: CommandsFlat[T], options: CommandOptions = {}) {
    const store = this.getStoreData();
    const commandPayload = this.makeCommandPayload<T>(payload, options, store);
    const commandPath = this.makeCommandPath(commandName, commandPayload.userId);
    const headers = this.makeHeaders(store);
    const message = new NatsRecordBuilder(commandPayload).setHeaders(headers).build();
    if (commandPayload.userId && commandPayload.trId && options.callbackCommandSuccessArgs) {
      await this.setCallbackSuccessArgs(options.callbackCommandSuccessArgs, commandPayload.trId);
    }
    this.clientProxy.emit(commandPath, message);
  }

  sendEvent<T extends EventsKeysList>(eventName: T, payload: EventsFlat[T], options: EventOptions = {}) {
    const store = this.getStoreData();
    const commandPayload = this.makeEventPayload(payload, options, store);
    const commandPath = this.makeEventPath(eventName, commandPayload.userId);
    const headers = this.makeHeaders(store);
    const message = new NatsRecordBuilder(commandPayload).setHeaders(headers).build();
    this.clientProxy.emit(commandPath, message);
  }

  sendError<T extends ErrorsKeysList>(eventName: T, payload: ErrorPayload) {
    const store = this.getStoreData();
    const commandPayload = this.makeErrorPayload(payload, store);
    const errorPath = this.makeErrorPath(eventName, store[SystemHeaders.userId]);
    const headers = this.makeHeaders(store);
    const message = new NatsRecordBuilder(commandPayload).setHeaders(headers).build();
    this.clientProxy.emit(errorPath, message);
  }

  fetch<T extends FetchKeysList>(fetchName: T, payload: FetchFlatArgs[T]): Promise<FetchFlatReturning[T]> {
    const store = this.getStoreData();
    const commandPath = this.makeFetchPath(fetchName, store[SystemHeaders.userId]);
    const headers = this.makeHeaders(store);
    const message = new NatsRecordBuilder(payload).setHeaders(headers).build();
    const result = this.clientProxy.send<FetchFlatReturning[T]>(commandPath, message);
    return lastValueFrom(result);
  }

  async sendCallBackSuccess(commandName: CommandsKeysList, transactionId: any) {
    const args = await this.cache.getOne(transactionId);
    await this.cache.deleteOne(transactionId);
    this.sendCommand(commandName, args ?? null);
  }

  sendCallBackError(commandName: string, payload: any) {
    console.log({ sendCallBackError: { commandName, payload } });
  }

  private getStoreData(): IRequestContext {
    const store = this.als.getStore();
    return store ? store : ({} as IRequestContext);
  }

  private makeCommandPayload<T extends CommandsKeysList>(
    payload: CommandsFlat[T],
    options: CommandOptions,
    storeData: IRequestContext,
  ): CommandPayload<T> {
    return {
      userId: options.userId || storeData[SystemHeaders.userId],
      trId: options.trId || storeData[SystemHeaders.trId],
      callbackCommandSuccess: options.callbackCommandSuccess,
      callbackCommandError: options.callbackCommandError,
      payload: payload,
    };
  }

  private makeEventPayload<T extends EventsKeysList>(
    payload: EventsFlat[T],
    options: EventOptions,
    storeData: IRequestContext,
  ): EventPayload<T> {
    return {
      userId: options.userId || storeData[SystemHeaders.userId],
      trId: options.trId || storeData[SystemHeaders.trId],
      parentCommand: options.parentCommand,
      payload: payload,
    };
  }

  private makeErrorPayload(payload: ErrorPayload, storeData: IRequestContext): ErrorPayloadFull {
    return {
      type: ErrorType.TRANSACTION,
      message: payload.message,
      details: JSON.stringify(payload.details),
      requestId: storeData[SystemHeaders.xRequestId],
      transactionId: storeData[SystemHeaders.trId]!,
    };
  }

  private makeHeaders(store: IRequestContext) {
    const headers = nats.headers();
    headers.set(SystemHeaders.xRequestId, store?.[SystemHeaders.xRequestId] ?? '');
    headers.set(SystemHeaders.userId, store?.[SystemHeaders.userId] ?? '');
    headers.set(SystemHeaders.sessionId, store?.[SystemHeaders.sessionId] ?? '');
    headers.set(SystemHeaders.trId, store?.[SystemHeaders.trId] ?? '');
    return headers;
  }

  private makeCommandPath(commandName: CommandsKeysList, userId?: string) {
    return CommandPrefix + '.' + commandName + '.' + (userId || '0');
  }

  private makeEventPath(eventName: EventsKeysList, userId?: string) {
    return EventPrefix + '.' + eventName + '.' + (userId || '0');
  }

  private makeErrorPath(errorName: ErrorsKeysList, userId?: string) {
    return ErrorPrefix + '.' + errorName + '.' + (userId || '0');
  }

  private makeFetchPath(fetchName: FetchKeysList, userId?: string) {
    return FetchPrefix + '.' + fetchName + '.' + (userId || '0');
  }

  private setCallbackSuccessArgs(data: any, transactionId: string) {
    return this.cache.create(transactionId, data);
  }

  // --------------------------------------------------------------------------------

  isConnected(): Promise<boolean> {
    return this.clientProxy
      .connect()
      .then(() => true)
      .catch(() => false);
  }
}
