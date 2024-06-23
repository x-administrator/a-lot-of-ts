import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage();

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: asyncLocalStorage,
    },
  ],
  exports: [AsyncLocalStorage],
})
export class AppContextModule {}
