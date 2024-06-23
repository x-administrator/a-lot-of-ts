import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NatsContext } from '@nestjs/microservices';
import { CurrentUserPayload } from 'apps/gateway/src/modules/auth/decorator/current-user.decorator';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { MsgHdrsImpl } from 'nats';
import { FastifyReply } from 'fastify/types/reply';
import { Observable } from 'rxjs';
import { IRequestContext, SystemHeaders } from '../request-context';

@Injectable()
export class AppContextInterceptor implements NestInterceptor {
  constructor(readonly als: AsyncLocalStorage<IRequestContext>) {}
  intercept(execContext: ExecutionContext, next: CallHandler): Observable<any> {
    const existStore: Partial<IRequestContext> = this.als?.getStore() ?? {};
    if (existStore?.isInit) {
      return next.handle();
    }
    const context = execContext.getArgs()[1];
    const contextType = execContext.getType() as string;

    let requestId = existStore?.[SystemHeaders.xRequestId] ?? '';
    let userId: string = '';
    let sessionId: string = '';
    let transactionId: string = '';

    if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(execContext);
      const request = ctx.getContext().req ?? ctx.getContext().reply.request;
      const userData = request.user as CurrentUserPayload;
      const headers = request.headers;
      requestId = headers[SystemHeaders.xRequestId];
      userId = userData?.userId;
      sessionId = userData?.sessionId;
    }
    if (contextType === 'http') {
      const reply = context as FastifyReply;
      const headers = reply.getHeaders();
      requestId = headers[SystemHeaders.xRequestId] as string;
    }
    if (contextType === 'rpc' && context instanceof NatsContext) {
      const headers = context.getHeaders() as MsgHdrsImpl;
      if(headers){
        requestId = headers.get(SystemHeaders.xRequestId);
        userId = headers.get(SystemHeaders.userId);
        sessionId = headers.get(SystemHeaders.sessionId);
        transactionId = headers.get(SystemHeaders.trId);
      }
    }

    if (!requestId || requestId! === '') {
      requestId = randomUUID();
    }
    const store: IRequestContext = {
      ...existStore,
      [SystemHeaders.xRequestId]: requestId,
      [SystemHeaders.userId]: userId,
      [SystemHeaders.sessionId]: sessionId,
      [SystemHeaders.trId]: transactionId === '' ? undefined : transactionId,
      isInit: true,
    };

    return this.als.run(store, () => next.handle());
  }
}
