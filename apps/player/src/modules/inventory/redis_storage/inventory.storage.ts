import { REDIS_DB, RedisIO } from '@app/common/redis';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryItem } from './inventory.storage.types';

@Injectable()
export class InventoryStorage {
  static readonly KEY_INVENTORY = 'player-inventory';
  constructor(@Inject(REDIS_DB) readonly redis: RedisIO) {}

  async setItems(playerId: string, inventory: Record<string, string>) {
    const key = InventoryStorage.makeKeyInventory(playerId);
    const saveDataFlat = this.redis.convertObject_ToFlatten(inventory);
    await this.redis.hset(key, saveDataFlat);
  }

  async getItemsAll(playerId: string): Promise<InventoryItem[]> {
    const key = InventoryStorage.makeKeyInventory(playerId);
    const flatData = await this.redis.hgetall(key);
    if (!flatData) {
      return [];
    }
    const data = this.redis.convertFlattenObject_ToDeep(flatData);
    return Object.entries(data).map(([group, itemId]) => ({ group, itemId }));
  }

  static makeKeyInventory(playerId: string) {
    return `${this.KEY_INVENTORY}:${playerId}`;
  }
}
