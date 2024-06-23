import { ClientProxyBase, FetchFlatReturning, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable } from '@nestjs/common';
import { BackpackRepository } from '../backpack/backpack.repository';
import { BackpackItem } from '../backpack/backpack.types';
import { SettingsStorageReader } from '../settings/settings.storage-reader';
import { InventoryStorage } from './redis_storage/inventory.storage';
import { InventoryItem } from './redis_storage/inventory.storage.types';

@Injectable()
export class InventoryService {
  static requiredGroups = ['weapone', 'hero', 'skin'];
  constructor(
    @Inject(RPC_PROVIDER) private readonly rpc: ClientProxyBase,
    private readonly inventoryStorage: InventoryStorage,
    private readonly backpackRepository: BackpackRepository,
    private readonly settingsStorageReader: SettingsStorageReader,
  ) {}

  async checkCompleteInventory(playerId: string): Promise<boolean> {
    const inventory = await this.getPlayerInventory(playerId);
    if (inventory.length == 0 || inventory.length < InventoryService.requiredGroups.length) {
      return false;
    }
    const inventoryIds = inventory.map((i) => i.itemId);
    const ifsItems = this.settingsStorageReader.findManyIFSByIds(inventoryIds);
    const inventoryGroups = new Set(ifsItems.map((i) => i.group));
    const result = InventoryService.requiredGroups.some((group) => inventoryGroups.has(group));
    return result;
  }

  async getPlayerInventory(playerId: string): Promise<InventoryItem[]> {
    const inventory = await this.inventoryStorage.getItemsAll(playerId);
    return inventory;
  }

  async setInventoryItem(playerId: string, trId: string, items: InventoryItem[]) {
    const itemsIds = items.map((i) => i.itemId);
    const ownIfsItems = await this.getOwnItems(playerId, itemsIds);
    const inventory = ownIfsItems.reduce((acc, item) => {
      acc[item.group] = item.itemId;
      return acc;
    }, {});
    await this.inventoryStorage.setItems(playerId, inventory);
    this.rpc.sendEvent('player.inventory.updated.1', true);
    return true;
  }

  async getOwnItems(playerId: string, itemsIds: string[]) {
    const ownItems = await this.backpackRepository.findOwnItemsByIds(playerId, itemsIds);
    const itemsIdsOwn = ownItems.map((i) => i.itemId);
    const ifsItems = this.settingsStorageReader.findManyIFSByIds(itemsIdsOwn);
    return ifsItems;
  }

  async currentInventoryMany(playersId: string[]): Promise<FetchFlatReturning['player.inventory.currentMany.1']> {
    return playersId.map((playerId) => ({
      playerId,
      items: [] as BackpackItem[],
    }));
  }
}
