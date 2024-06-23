import { Inject } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { EventPattern } from '@nestjs/microservices';
import { ClientProxyBase } from '../client-proxy-base';
import { CommandPayload, CommandPrefix, CommandsKeysList, CommandsKeysWithPatternsList, RPC_PROVIDER } from '../types';
import { RpcParamtype } from '../types/rpc-paramtype.enum';

export function OnCommand(
  commandKey: CommandsKeysWithPatternsList,
  extras?: Record<string, any>,
  userTargetPattern = '*',
): MethodDecorator {
  const command = CommandPrefix + '.' + commandKey + '.' + userTargetPattern;
  const injectRpc = Inject(RPC_PROVIDER);
  const decorator = EventPattern(command, extras);
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    injectRpc(target, '$$_rpc');
    const method = descriptor.value;
    const indexesPayload = findPayloadIndexes(target, propertyKey);
    descriptor.value =
      method.constructor.name === 'AsyncFunction' ? asyncWrapper(method, indexesPayload) : syncWrapper(method, indexesPayload);
    return decorator(target, propertyKey, descriptor);
  };
}

function findPayloadIndexes(target: any, propertyKey: string): number {
  const fields = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, propertyKey);
  if (!fields) {
    return 0;
  }
  const result = Object.entries(fields)
    .filter(([key, value]: any[]) => {
      const targetKey = RpcParamtype.PAYLOAD + ':' + value.index;
      return targetKey == key;
    })
    .map((f: any) => f[1].index);
  return result[0];
}

function asyncWrapper<T extends CommandsKeysList>(method: any, indexesPayload: number) {
  return async function (...args) {
    const payload = args[indexesPayload] as CommandPayload<T>;
    if (!isAllowCallback(payload)) {
      return method.apply(this, args);
    }

    const rpc = this.$$_rpc as ClientProxyBase;
    try {
      const data = await method.apply(this, args);
      await rpc.sendCallBackSuccess(payload.callbackCommandSuccess!, payload.trId!);
      return data;
    } catch (error) {
      rpc.sendCallBackError(payload.callbackCommandError!, payload.trId!);
      throw error;
    }
  };
}

function syncWrapper<T extends CommandsKeysList>(method: any, indexesPayload: number) {
  return function (...args) {
    const payload = args[indexesPayload] as CommandPayload<T>;
    if (!isAllowCallback(payload)) {
      return method.apply(this, args);
    }

    const rpc = this.$$_rpc as ClientProxyBase;
    try {
      const data = method.apply(this, args);
      rpc.sendCallBackSuccess(payload.callbackCommandSuccess!, payload.trId!);
      return data;
    } catch (error) {
      rpc.sendCallBackError(payload.callbackCommandError!, payload.trId!);
      throw error;
    }
  };
}

function isAllowCallback<T extends CommandsKeysList>(payload: CommandPayload<T>) {
  if (!payload.trId) {
    return false;
  }
  if (!payload.callbackCommandSuccess && !payload.callbackCommandError) {
    return false;
  }
  return true;
}
