import { flatten, unflatten } from 'flat';
import Redis, { RedisOptions } from 'ioredis';

export class RedisIO extends Redis {
  convertObject_ToStreamItem(obj: Record<string, any>) {
    return Object.entries(flatten(obj) as any).flat(2) as string[];
  }

  convertStreamItem_ToObject(streamItem: string[]) {
    const result: string[][] = [];
    for (let i = 0; i < streamItem.length; i += 2) {
      result.push([streamItem[i], streamItem[i + 1]]);
    }
    return unflatten(Object.fromEntries(result));
  }

  convertObject_ToFlatten(obj: Record<string, any>) {
    return flatten(obj) as Record<string, any>;
  }

  convertFlattenObject_ToDeep(obj: Record<string, any>) {
    return unflatten(obj) as Record<string, any>;
  }

  private initConfig: RedisOptions;

  constructor(redisConfig: RedisOptions) {
    super(redisConfig);
    this.initConfig = redisConfig;
  }

  init() {
    return new RedisIO(this.initConfig);
  }
}
