export type PlayerState = {
  playerId: string;
  wave: number;
  day: number;
  version: number;
  isDoneWave: boolean;
  nextAt: Date;
};

export type Item = {
  name: string;
  amount: number;
};
