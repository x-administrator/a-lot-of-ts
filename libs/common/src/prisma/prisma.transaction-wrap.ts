import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_NAMES } from './event.names';

export default function startTransaction(prisma: any, maxWait = 15000, timeout = 10000) {
  const trEventer = new EventEmitter2();
  const waitingEnd = prisma.$transaction(
    async (prisma) => {
      trEventer.emit(EVENT_NAMES.TRANSITION_BEGIN, prisma);
      return new Promise(async (resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new prisma.Prisma.PrismaClientKnownRequestError(`transaction timeout`, { code: 'P2024', clientVersion: '' }));
          trEventer.emit(EVENT_NAMES.TRANSITION_DONE);
        }, timeout);
        trEventer.once(EVENT_NAMES.TRANSITION_COMMIT, (r) => {
          clearTimeout(timer);
          resolve(r);
          trEventer.emit(EVENT_NAMES.TRANSITION_DONE);
        });
        trEventer.once(EVENT_NAMES.TRANSITION_ROLLBACK, (r) => {
          clearTimeout(timer);
          reject(r);
          trEventer.emit(EVENT_NAMES.TRANSITION_DONE);
        });
      });
    },
    {
      maxWait,
      timeout,
    },
  );

  return { trEventer, waitingEnd };
}
