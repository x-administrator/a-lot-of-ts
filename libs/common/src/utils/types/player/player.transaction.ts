import { ConvertItem } from 'apps/player/src/modules/transaction/transaction.type';

export type ConvertItemsPayload = {
  logNotification: boolean;
  title: string;
  items: ConvertItem[];
};

export type AddItemsPayload = {
  transactionId: string;
  logNotification: boolean;
  playerId: string;
  title: string;
  items: AddItem[];
};

export type AddItem = {
  itemId: string;
  type: ItemTransactionType;
  amount: number;
};

export type PlayerTransactionItem = {
  itemId: string;
  amount: number;
  type: ItemTransactionType;
};

export type PlayerTransactionAddItems = {
  playerId: string;
  title: string;
  items: Array<{
    name: string;
    amount: number;
  }>;
};

export enum PlayerTransactionType {
  ADD = 'add',
  WITHDRAW = 'withdraw',
}

export enum ItemTransactionType {
  ADD = 'add',
  WITHDRAW = 'withdraw',
}
