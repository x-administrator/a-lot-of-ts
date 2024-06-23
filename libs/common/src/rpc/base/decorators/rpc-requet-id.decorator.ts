import { SystemHeaders } from '@app/common/request-context';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NatsContext } from '@nestjs/microservices';
import { MsgHdrsImpl } from 'nats';

export function RpcRequestId() {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const args = ctx.getArgs();
    const natsContext = args[1] as NatsContext;
    const natsArgs = natsContext.getArgs();
    const msgHdrsImpl = natsArgs[1] as MsgHdrsImpl;
    const value = msgHdrsImpl.headers.get(SystemHeaders.xRequestId) ?? [];
    return value[0] === '' ? undefined : value[0];
  })();
}
