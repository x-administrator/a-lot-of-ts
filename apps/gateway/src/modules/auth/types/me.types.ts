export type MeNotificationType = {
  title: string;
};

export type ConvertItemsPayload = {
  logNotification: boolean;
  title: string;
  items: ConvertItem[];
};

type ConvertItem = {
  itemId: string;
  amount: number;
};
