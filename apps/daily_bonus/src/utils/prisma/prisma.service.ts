import startTransaction from '@app/common/prisma/prisma.transaction-wrap';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './types';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  startTransaction(maxWait = 15000, timeout = 10000) {
    return startTransaction(this, maxWait, timeout);
  }
}
