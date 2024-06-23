import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { map } from 'rxjs';
import { IRequestContext, SystemHeaders } from '../request-context';

@Injectable()
class MutationResolverInterceptor implements NestInterceptor {
  constructor(readonly als: AsyncLocalStorage<IRequestContext>) {}

  intercept(execContext: ExecutionContext, next: CallHandler) {
    const store = this.als.getStore() || ({} as IRequestContext);
    const transactionId = store[SystemHeaders.trId] || randomUUID();
    store[SystemHeaders.trId] = transactionId;
    this.als.enterWith(store);
    return next.handle().pipe(map(() => transactionId));
  }
}

export const MutationResolver = () => UseInterceptors(MutationResolverInterceptor);
