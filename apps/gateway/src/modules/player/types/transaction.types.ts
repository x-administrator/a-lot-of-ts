import { ItemTransactionType } from 'apps/player/src/modules/transaction/transaction.type';

export type UpdateItemsEvent = {
  itemId: string;
  amount: number;
  type: ItemTransactionType;
  // название предмета из ItemForSell из которго случилась конвертация
  convertedFrom: string | null;
};

export type UpdateItemPayload = {
  logNotification: boolean;
  playerId: string;
  title: string;
  items: UpdateItemsEvent[];
};
