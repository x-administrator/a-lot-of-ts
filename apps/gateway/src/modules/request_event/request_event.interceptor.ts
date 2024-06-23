import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { tap } from 'rxjs';
import { CurrentUserPayload } from '../auth/decorator/current-user.decorator';
import { RequestEventService } from './request_event.service';
import { RequestEventHeaders, RequestEventPayload } from './request_event.type';

@Injectable()
export class RequestEventInterceptor implements NestInterceptor {
  constructor(readonly service: RequestEventService) {}

  async intercept(execContext: ExecutionContext, next: CallHandler) {
    const contextType = execContext.getType() as string;

    if (contextType !== 'graphql') {
      return next.handle();
    }

    const ctx = GqlExecutionContext.create(execContext);
    const req: Request = ctx.getContext().req;
    const headers = req.headers;
    const user = req.user as CurrentUserPayload;
    const transactionId = headers[RequestEventHeaders.xReqTrId] as string;

    if (!transactionId) {
      return next.handle();
    }

    if (!user) {
      throw new Error('Check: do you use Authorized decorator to this resolver');
    }

    const payload: RequestEventPayload = {
      transactionId,
      userId: user.userId,
    };

    const eventStatus = await this.service.getEventStatus(payload);

    if (eventStatus) {
      return this.service.subscribeToEvent(payload);
    }

    await this.service.createEvent(payload);

    return next.handle().pipe(
      tap((body) => {
        const headers = {}; //TODO: Specify headers here
        this.service.fulFillEvent(payload, headers, body);
      }),
    );
  }
}

export const TransactionRequest = () => UseInterceptors(RequestEventInterceptor);
