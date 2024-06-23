import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { RedisIO } from './redis-io';
import { REDIS_DB } from './redis.constants';

export const RedisProvider: Provider = {
  provide: REDIS_DB,
  useFactory: async (configService: ConfigService): Promise<Redis> => {
    const redisConfig: RedisOptions = {
      host: configService.getOrThrow('REDIS_HOST'),
      password: configService.get('REDIS_PASSWORD'),
      port: configService.getOrThrow('REDIS_PORT'),
    };
    try {
      const redis = new RedisIO(redisConfig);
      return redis;
    } catch (error) {
      throw error;
    }
  },
  inject: [ConfigService],
};
