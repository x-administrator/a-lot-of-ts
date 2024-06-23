import { HealthCheck } from '@app/common/health-check/health-check.base';
import { RedisHealthIndicator } from '@app/common/redis/redis.health-indicator';
import { ClientProxyBase, OnFetch, RPC_PROVIDER } from '@app/common/rpc';
import { Controller, Inject } from '@nestjs/common';
import { ClientNats, Payload } from '@nestjs/microservices';
import { PrismaHealthIndicator } from './utils/prisma/prisma.health-indicator';

@Controller()
export class PlayerController {
  client: ClientNats;
  healthChecker: HealthCheck;

  constructor(
    private redisHealth: RedisHealthIndicator,
    private dbHealth: PrismaHealthIndicator,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {
    this.healthChecker = new HealthCheck('player', this.rpc, { redis: this.redisHealth, db: this.dbHealth });
  }

  @OnFetch('player.common.ping.1')
  async healthCheck(@Payload() parentService: string) {
    return this.healthChecker.check(parentService);
  }
}

