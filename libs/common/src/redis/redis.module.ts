import { Global, Module } from '@nestjs/common';
import { RedisHealthIndicator } from './redis.health-indicator';
import { RedisProvider } from './redis.provider';

@Global()
@Module({
  providers: [RedisProvider, RedisHealthIndicator],
  exports: [RedisProvider, RedisHealthIndicator],
})
export class RedisModule {}
