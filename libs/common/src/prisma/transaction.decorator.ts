import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { EVENT_NAMES } from './event.names';
import { PrismaClient } from '@prisma/client';

const PRISMA_TR_KEY = Symbol('prisma_transaction');

export function PrismaInitTransaction_Decorator<PrismaService = PrismaClient>(PrismaService: PrismaService) {
  const prismaInject = Inject(PrismaService);
  return (target, key: string, propertyDescriptor: PropertyDescriptor) => {
    prismaInject(target, 'prismaService');
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
      const indexParameter = Reflect.getOwnMetadata(PRISMA_TR_KEY, target, key);
      if (typeof indexParameter !== 'number') {
        return await originalMethod.apply(this, args);
      }

      const prismaService: any = this.prismaService;
      const { trEventer, waitingEnd } = prismaService.startTransaction();
      const callTr = new Promise((resolve) => {
        trEventer.on(EVENT_NAMES.TRANSITION_BEGIN, async (prismaTrx) => {
          try {
            args.splice(indexParameter, 0, prismaTrx);
            const result = await originalMethod.apply(this, args);
            trEventer.emit(EVENT_NAMES.TRANSITION_COMMIT, result);
          } catch (error) {
            trEventer.emit(EVENT_NAMES.TRANSITION_ROLLBACK, error);
          } finally {
            trEventer.once(EVENT_NAMES.TRANSITION_DONE, resolve);
          }
        });
      });
      return Promise.race([waitingEnd, callTr]);
    };
  };
}

export function PrismaTransaction() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(PRISMA_TR_KEY, parameterIndex, target, propertyKey);
  };
}
