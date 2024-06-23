import { RedisIO } from '@app/common/redis/redis-io';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_DB } from '../../../../../libs/common/src/redis/redis.constants';
import { ConfigService } from '../../modules/config/config.service';

export const RedisProvider = {
  provide: REDIS_DB,
  useFactory: async (configService: ConfigService): Promise<Redis> => {
    const redisConfig: RedisOptions = {
      host: configService.redisOptions.host,
      password: configService.redisOptions.passphrase,
      port: configService.redisOptions.port,
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
