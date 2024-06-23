import { ItemForSellInfo } from 'apps/settings/src/modules/items-for-sell/items-for-sell.interface';

export class StorageState {
  private static instance: StorageState | null = null;
  itemsForSell: Map<ItemForSellInfo['itemId'], ItemForSellInfo> = new Map();
  private constructor() {}

  static setIFS(boxes: ItemForSellInfo[]) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    this.instance.setIFS(boxes);
  }

  static getAllIFS() {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    return [...this.instance.itemsForSell.values()];
  }

  static findIFSById(id: string) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    return this.instance.itemsForSell.get(id) ?? null;
  }

  static findManyIFSByIds(id: string[]) {
    if (!this.instance) {
      this.instance = new StorageState();
    }
    return id.map((id) => this.findIFSById(id)).filter((item) => item !== null) as ItemForSellInfo[];
  }

  private setIFS(boxes: ItemForSellInfo[]) {
    this.itemsForSell = boxes.reduce(
      (acc, record) => acc.set(record.itemId, record),
      new Map<ItemForSellInfo['itemId'], ItemForSellInfo>(),
    );
  }
}
