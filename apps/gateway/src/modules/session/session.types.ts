import { BackpackItem } from "apps/player/src/modules/backpack/backpack.types";

export type SessionPayload = {
  playerId: string;
  backpackItems: BackpackItem[];
};

export type Session = {
  sessionId: string;
  lastUpdatedAt: number;
} & SessionPayload;
