export class BackpackFindResponse {
  backpackId: string;
  userId: string;
  name: string;
  items: BackpackFindItem[];
}

class BackpackFindItem {
  backpackId: string;
  item: string;
  amount: number;
  data: string;
}

export type BackpackItemPublicInfo = {
  i18n: string | undefined;
  backpackId: string;
  itemId: string;
  amount: number;
  data: any;
};

export type BackpackPublicInfo = {
  items: BackpackItemPublicInfo[];
  backpackId: string;
  userId: string;
  name: string;
};
