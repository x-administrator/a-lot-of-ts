import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CommandPayload, EventPayload, RpcKeyType } from '../types/helper.types';

export function RpcTrId(...keys: (keyof RpcKeyType)[]) {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const args = ctx.getArgs();
    const messagePayload = args[0] as EventPayload<any> | CommandPayload<any>;
    return messagePayload.trId;
  })();
}
