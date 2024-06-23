export enum ItemTransactionType {
  ADD = 'add',
  WITHDRAW = 'withdraw',
}

export type AddItem = {
  itemId: string;
  type: ItemTransactionType;
  amount: number;
};

export type AddItemsPayload = {
  playerId: string;
  title: string;
  logNotification: boolean;
  items: AddItem[];
};

// ---------------------------------------

export type ConvertItem = {
  itemId: string;
  amount: number;
};

export type ConvertItemsPayload = {
  logNotification: boolean;
  playerId: string;
  title: string;
  items: ConvertItem[];
};

// ---------------------------------------

export type UpdateItemsEvent = {
  itemId: string;
  amount: number;
  type: ItemTransactionType;
  // название предмета из ItemForSell из которго случилась конвертация
  convertedFrom: string | null;
};

export type UpdateBackpackItemPayload = {
  transactionId: string;
  logNotification: boolean;
  playerId: string;
  title: string;
  items: UpdateItemsEvent[];
};
