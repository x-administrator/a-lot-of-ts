import { RedisIO } from '@app/common/redis/redis-io';
import { REDIS_DB } from '@app/common/redis/redis.constants';
import { IRequestContext, SystemHeaders } from '@app/common/request-context';
import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { RewardNotificationPayload } from '../player.types';

@Injectable()
export class RewardNotificationService {
  private namespace = 'notification:rewards:';
  private DAY_MS = 24 * 60 * 60 * 1000;

  private get expireTime() {
    return Date.now() + this.DAY_MS;
  }

  constructor(
    @Inject(REDIS_DB) private readonly redis: RedisIO,
    readonly als: AsyncLocalStorage<IRequestContext>,
  ) {}

  async add(userId: string, values: RewardNotificationPayload) {
    const key = this.makeKey(userId);
    const value = {
      title: values.title,
      transactionId: values.transactionId,
      items: values.items,
    };
    const record = this.redis.convertObject_ToStreamItem(value);
    await this.redis.xadd(key, '*', ...record);
    await this.redis.expire(key, this.expireTime);
  }

  async getAll(userId: string) {
    const key = this.makeKey(userId);
    const records = await this.redis.xrange(key, '-', '+');

    return records.map((i) => ({
      id: i[0],
      ...(this.redis.convertStreamItem_ToObject(i[1]) as any),
    }));
  }

  delete(userId: string, id: string) {
    const transactionId = this.als.getStore()![SystemHeaders.trId]!;
    const key = this.makeKey(userId);
    this.redis.xdel(key, id);
    return transactionId;
  }

  async clear(userId: string) {
    const key = this.makeKey(userId);
    return await this.redis.del(key);
  }

  makeKey(userId: string) {
    const key = this.namespace + userId;
    return key;
  }

  async size(userId: string) {
    const key = this.makeKey(userId);
    return this.redis.xlen(key);
  }
}
