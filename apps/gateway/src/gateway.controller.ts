import { HealthCheck } from '@app/common/health-check/health-check.base';
import { RedisHealthIndicator } from '@app/common/redis/redis.health-indicator';
import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller()
export class GatewayController {
  healthChecker: HealthCheck;

  constructor(
    private redisHealth: RedisHealthIndicator,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {
    this.healthChecker = new HealthCheck('gateway', rpc, { redis: this.redisHealth });
  }

  @Get('/ping')
  ping() {
    return 'pong';
  }

  @Get('/health')
  async healthCheck() {
    return this.healthChecker.check(null, true);
  }
}
