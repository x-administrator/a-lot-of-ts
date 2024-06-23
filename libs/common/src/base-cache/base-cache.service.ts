import { RedisKey } from 'ioredis';
import { RedisIO } from '../redis/redis-io';
import { BaseCacheServiceOptions } from './base-cache.types';

export class BaseCacheService<OType = any> {
  constructor(
    readonly redis: RedisIO,
    readonly options: BaseCacheServiceOptions,
  ) {}

  async create(id: string, object: OType): Promise<void> {
    const key = this.makeKey(id);
    if (this.options.onlyUniqueKeys) {
      const keys = await this.redis.keys(key);
      if (keys.length) {
        throw Error(`Dublicate key: ${id}`);
      }
    }
    await this.redis.lpush(key, JSON.stringify(object));
    if (this.options.expireTimeS) {
      await this.redis.expire(key, this.options.expireTimeS);
    }
  }

  async createMany<Id extends keyof OType>(objects: OType[], identifierField: Id): Promise<void> {
    if (this.options.onlyUniqueKeys) {
      const sUniq = new Set<string>();
      for (const obj of objects) {
        const key = this.makeKey(obj[identifierField] as string);
        if (sUniq.has(key)) {
          throw Error(`Dublicate key: ${obj[identifierField]}`);
        }
        const existKeys = await this.redis.keys(key);
        if (existKeys.length) {
          throw Error(`Dublicate key: ${obj[identifierField]}`);
        }
        sUniq.add(key);
      }
    }
    const pipeline = this.redis.pipeline();
    for (const object of objects) {
      const key = this.makeKey(object[identifierField] as string);
      pipeline.lpush(key, JSON.stringify(object));
      if (this.options.expireTimeS) {
        pipeline.expire(key, this.options.expireTimeS);
      }
    }
    await pipeline.exec();
  }

  async upsert(id: string, object: OType) {
    const key = this.makeKey(id);
    const isRecordExist = (await this.redis.keys(key)).length !== 0;
    const promises: Promise<any>[] = [];
    if (isRecordExist) {
      promises.push(this.redis.del(key));
    }
    promises.push(this.redis.lpush(key, JSON.stringify(object)));
    if (this.options.expireTimeS) {
      promises.push(this.redis.expire(key, this.options.expireTimeS));
    }
    await Promise.all(promises);
  }

  async replaceOne(id: string, object: OType): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }
      const key = this.makeKey(id);
      const promises: Promise<any>[] = [this.redis.del(key), this.redis.lpush(key, JSON.stringify(object))];
      if (this.options.expireTimeS) {
        promises.push(this.redis.expire(key, this.options.expireTimeS));
      }
      await Promise.all(promises);
      return true;
    } catch {
      return false;
    }
  }

  async getOne(id: string): Promise<OType | null> {
    if (!id) {
      return null;
    }
    const key: RedisKey = this.makeKey(id);
    const [object] = await this.redis.lrange(key, 0, 1);
    if (object) {
      return JSON.parse(object);
    }
    return null;
  }

  async getMany(..._ids: string[]): Promise<OType[]> {
    const ids = _ids ? _ids : [];
    const keys = await this.getKeys(...ids);
    const objects: any[] = [];
    for (const key of keys) {
      const cachedObjects = await this.redis.lrange(key, 0, -1);
      objects.push(...cachedObjects.map((v) => JSON.parse(v)));
    }
    return objects;
  }

  async getIdentifiers(): Promise<string[]> {
    const keys = await this.getKeys();
    const parcedKeys = keys.map((r) => r.split(':').at(-1)) as string[];
    return parcedKeys;
  }

  async getLastIdentifier(): Promise<string | undefined> {
    const keys = await this.getKeys();
    return keys.at(-1)?.split(':').at(-1);
  }

  async getFirstIdentifier(): Promise<string | undefined> {
    const keys = await this.getKeys();
    return keys.at(0)?.split(':').at(-1);
  }

  async getLastById(id?: string): Promise<OType | null> {
    const ids = id ? [id] : [];
    const keys = await this.getKeys(...ids);
    let lastRecord: OType | null = null;

    for (const key of keys) {
      const cachedObjects = await this.redis.lrange(key, -1, -1);
      if (cachedObjects.length > 0) {
        lastRecord = JSON.parse(cachedObjects[0]);
        break;
      }
    }

    return lastRecord;
  }

  async deleteOne(id: string): Promise<void> {
    await this.redis.del(this.makeKey(id));
  }

  async drop(): Promise<void> {
    const keys = await this.getKeys();
    if (!keys.length) {
      return;
    }
    await this.redis.del(keys);
  }

  // ------------------------------------------------------------

  private makeKey(id: string): string {
    return `${this.options.prefix}:${id}`;
  }

  private async getKeys(...ids: string[]): Promise<string[]> {
    let keys: string[];
    if (!ids.length) {
      keys = await this.redis.keys(`${this.options.prefix}:*`);
    } else {
      keys = ids.map((id) => this.makeKey(id));
    }
    return keys;
  }
}
