import { InternalServerErrorException, createParamDecorator } from '@nestjs/common';
import { asyncLocalStorage } from '../als/app-context.module';
import { IRequestContext, SystemHeaders } from '../request-context';
import { randomUUID } from 'crypto';

export const TrId = createParamDecorator(() => {
  const store = asyncLocalStorage.getStore() || ({} as IRequestContext);
  if (!store) {
    throw new InternalServerErrorException(`error init internal context`);
  }
  const transactionId = store[SystemHeaders.trId] || randomUUID();
  store[SystemHeaders.trId] = transactionId;
  asyncLocalStorage.enterWith(store);
  return transactionId;
});
