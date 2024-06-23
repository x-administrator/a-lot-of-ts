export type PlayerStateUpdatedResponse = {
  userId: string;
  backpackItems?: BackpackFindItem[]
}

export class BackpackFindItem {
  backpackId?: string
  item?: string
  amount?: number
  data?: JSON
}