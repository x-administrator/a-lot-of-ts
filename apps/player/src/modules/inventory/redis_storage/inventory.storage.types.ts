export type InventoryItem = {
  itemId: string;
  group: string;
};

export type InventoryState = {
  [key: InventoryItem['group']]: InventoryItem['itemId'];
};
