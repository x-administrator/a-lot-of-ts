export type DailyBonusTransactionStateBody = {
  version: number;
  activeDay: number;
  nextAt: Date;
  activeWave: number;
  isDone: boolean;
  isClaimed: boolean;
};
