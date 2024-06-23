export type SetItemDto = {
  userId: string;
  itemId: string;
  amount: number;
};

export type BackpackPublicInfo = {
  backpackId: string;
  userId: string;
  name: string;
  items: BackpackItem[];
};

export type BackpackItem = {
  i18n?: string;
  backpackId: string;
  itemId: string;
  amount: number;
  data?: JSON;
};

export type IWeaponInfo = {
  ammo: AmmoData;
  pusher: PusherData;
  scaler: ScalerData;
  version: number;
  hitPower: HitPowerData;
  ricochet: RicochetData;
  upgradeId: string;
  weaponeId: string;
  lifeStealer: LifeStealerData;
  weaponeI18n: string;
  baseSettings: BaseSettingsData;
  chargePusher: ChargePusherData;
  healthChanger: HealthChangerData;
  chargeHealthChanger: ChargeHealthChangerData;
};

export type AmmoData = {
  enabled: boolean;
  maxAmmo: number;
  ammoPerSec: number;
  reloadTime: number;
  isRegeneratingAmmo: boolean;
};

export type PusherData = {
  enabled: boolean;
  duration: number;
  pushValue: number;
};

export type ScalerData = {
  enabled: boolean;
  duration: number;
  defaultScale: number;
  scaleMultiply: number;
};

export type HitPowerData = {
  enabled: boolean;
  powerOnKill: number;
  powerOnTouch: number;
};

export type RicochetData = {
  enabled: boolean;
  maxTimes: number;
  isWallInclude: boolean;
  isEnemyInclude: boolean;
};

export type LifeStealerData = {
  enabled: boolean;
  multiply: number;
  healthAmount: number;
  isHealthChangerMultiply: boolean;
};

export type BaseSettingsData = {
  power: number;
  enabled: boolean;
  lifeDelay: number;
  shootDelay: number;
  projectileScale: number;
  projectileSpeed: number;
  isDestroyableOnWall: boolean;
  touchAmountToDelete: number;
};

export type ChargePusherData = {
  enabled: boolean;
  duration: number;
  multiply: number;
  pushValue: number;
  timeToActivate: number;
  isPusherMultiply: boolean;
};

export type HealthChangerData = {
  enabled: boolean;
  healthAmount: number;
};

export type ChargeHealthChangerData = {
  enabled: boolean;
  multiply: number;
  healthAmount: number;
  timeToActivate: number;
  isHealthChangerMultiply: boolean;
};

// --------------------------------

export type RegisterPayload = {
  nikName: string;
  password: string;
};

export type LoginPayload = {
  nikName: string;
  password: string;
};
