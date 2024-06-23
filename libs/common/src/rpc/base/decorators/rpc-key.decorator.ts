import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NatsContext } from '@nestjs/microservices';
import { RpcKeyType } from '../types/helper.types';

export function RpcKey(key?: keyof RpcKeyType) {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const args = ctx.getArgs();
    const natsContext = args[1] as NatsContext;
    const natsArgs = natsContext.getArgs();
    const rpcKeySplitted = natsArgs[0].split('.') as any[];
    const [type, service, domain, action, version, userId] = rpcKeySplitted;
    const keyData: RpcKeyType = { type, service, domain, action, version, userId };
    if (!key) return keyData;
    return keyData[key];
  })();
}

export function RpcKeyString() {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const args = ctx.getArgs();
    const natsContext = args[1] as NatsContext;
    const natsArgs = natsContext.getArgs();
    const key = natsArgs[0];
    return key;
  })();
}
