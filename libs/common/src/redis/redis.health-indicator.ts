import { RedisIO } from '@app/common/redis/redis-io';
import { REDIS_DB } from '@app/common/redis/redis.constants';
import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthIndicator } from '../health-check/health-indicator.base';
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject(REDIS_DB) private redisDb: RedisIO) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const result = await this.redisDb.ping();
      return this.getStatus(key, result === 'PONG', { code: 0 });
    } catch (e) {
      return this.getStatus(key, false, { message: e.message, code: 500 });
    }
  }
}
