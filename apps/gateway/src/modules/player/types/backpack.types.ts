export class BackpackFindResponse {
  backpackId: string;
  userId: string;
  name: string;
  items: BackpackFindItem[];
}

export class BackpackFindItem {
  backpackId: string;
  item: string;
  amount: number;
  data: any;
}
