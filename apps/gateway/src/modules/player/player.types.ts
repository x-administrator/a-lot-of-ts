import { UpdateItemsEvent } from "./types/transaction.types";

export type RewardNotificationPayload = {
  title: string;
  transactionId: string;
  items: UpdateItemsEvent[];
};
