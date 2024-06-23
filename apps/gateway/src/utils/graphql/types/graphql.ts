
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum GoogleSyncStatus {
    READY = "READY",
    FETCH_DRIVE = "FETCH_DRIVE",
    FETCH_TABLE = "FETCH_TABLE",
    SAVE_TABLE = "SAVE_TABLE",
    ERROR_COMMON = "ERROR_COMMON",
    DONE = "DONE"
}

export enum RoomCreatedStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
}

export enum ErrorType {
    transaction = "transaction",
    matchmaking = "matchmaking"
}

export enum BroadcastNotificationType {
    UPDATE_SETTINGS = "UPDATE_SETTINGS"
}

export enum MatchMakingNotificationStatus {
    TEAM_WAIT = "TEAM_WAIT",
    TEAM_UPDATE = "TEAM_UPDATE",
    CREATE_ROOM = "CREATE_ROOM",
    TIMEOUT = "TIMEOUT",
    READY_TO_CONNECT = "READY_TO_CONNECT"
}

export class GameServerUpInput {
    serverName: string;
    maxRoomAmount: number;
    callBackHost: string;
    gameServerHost: string;
    gameServerPort: number;
    location: string;
    version: string;
}

export class GameServerDownInput {
    serverName: string;
    callBackHost: string;
    ip: string;
}

export class RoomCreatedInput {
    teamId: string;
    roomId: string;
    status: RoomCreatedStatus;
}

export class RegisterDto {
    nikName: string;
    password: string;
}

export class LoginDto {
    nikName: string;
    password: string;
}

export class InventorySetItemInput {
    itemId: string;
    group: string;
}

export class ConvertItem {
    itemId: string;
    amount: number;
}

export class ConvertItemsPayload {
    logNotification: boolean;
    title: string;
    items: ConvertItem[];
}

export class SetItemDto {
    userId: string;
    itemId: string;
    amount: number;
}

export class PushFakeNotifyInput {
    errorChance?: Nullable<number>;
}

export class StoreStatusesInput {
    gameServerId: string;
    serverName: string;
    time: number;
    ip: string;
}

export class InitGameInput {
    gameModeId: number;
    mapId: number;
}

export abstract class IMutation {
    abstract Settings(): Nullable<SettingsMutation> | Promise<Nullable<SettingsMutation>>;

    abstract GameServers(): Nullable<GameServersMutation> | Promise<Nullable<GameServersMutation>>;

    abstract Room(): Nullable<RoomMutation> | Promise<Nullable<RoomMutation>>;

    abstract Auth(): Nullable<AuthMutation> | Promise<Nullable<AuthMutation>>;

    abstract Me(): Nullable<MeMutation> | Promise<Nullable<MeMutation>>;

    abstract dailyBonus(): Nullable<DailyBonusMutation> | Promise<Nullable<DailyBonusMutation>>;

    abstract Dev(): Nullable<DevMutation> | Promise<Nullable<DevMutation>>;

    abstract Lootbox(): Nullable<LootboxMutation> | Promise<Nullable<LootboxMutation>>;
}

export class SettingsMutation {
    updateFiles?: Nullable<boolean>;
    savePreSavedData?: Nullable<boolean>;
    deleteSavedData?: Nullable<boolean>;
}

export class SettingsSyncStateType {
    activeEntity?: Nullable<string>;
    currentReaded?: Nullable<number>;
    targetReadAmount?: Nullable<number>;
    status?: Nullable<GoogleSyncStatus>;
}

export class SettingsType {
    externalId?: Nullable<string>;
    name?: Nullable<string>;
    modifiedTime?: Nullable<string>;
    markToRemove?: Nullable<boolean>;
}

export class SettingDataPreSave {
    googleTableDataPreSaveId?: Nullable<string>;
    googleTableId?: Nullable<number>;
    data?: Nullable<JSON>;
    title?: Nullable<string>;
}

export class SettingsQuery {
    getLastModify?: Nullable<Nullable<SettingsType>[]>;
    getDataPreSaveByFile?: Nullable<Nullable<SettingDataPreSave>[]>;
    getSyncState?: Nullable<SettingsSyncStateType>;
    Weapon?: Nullable<WeaponQuery>;
    Npc?: Nullable<NpcQuery>;
}

export abstract class IQuery {
    abstract Settings(): Nullable<SettingsQuery> | Promise<Nullable<SettingsQuery>>;

    abstract Room(): Nullable<RoomQuery> | Promise<Nullable<RoomQuery>>;

    abstract test(): Nullable<string> | Promise<Nullable<string>>;

    abstract Me(): Nullable<MeQuery> | Promise<Nullable<MeQuery>>;

    abstract getGameServers(): GameServer[] | Promise<GameServer[]>;

    abstract Hero(): Nullable<HeroQuery> | Promise<Nullable<HeroQuery>>;

    abstract ItemForSell(): Nullable<ItemForSellQuery> | Promise<Nullable<ItemForSellQuery>>;

    abstract Localization(): Nullable<LocalizationQuery> | Promise<Nullable<LocalizationQuery>>;

    abstract Lootbox(): Nullable<LootboxQuery> | Promise<Nullable<LootboxQuery>>;

    abstract Npc(): Nullable<NpcQuery> | Promise<Nullable<NpcQuery>>;

    abstract Weapon(): Nullable<WeaponQuery> | Promise<Nullable<WeaponQuery>>;
}

export abstract class ISubscription {
    abstract settingsStateUpdate(): Nullable<SettingsSyncStateType> | Promise<Nullable<SettingsSyncStateType>>;

    abstract dataSourceUpdated(): Nullable<DatasourceStateUpdatedResponse> | Promise<Nullable<DatasourceStateUpdatedResponse>>;

    abstract meNotification(): Nullable<MeNotification> | Promise<Nullable<MeNotification>>;

    abstract errorNotification(): Nullable<ErrorNotification> | Promise<Nullable<ErrorNotification>>;

    abstract backPackNotifications(): Nullable<BackPackNotification> | Promise<Nullable<BackPackNotification>>;

    abstract matchMakingNotifications(): Nullable<MatchMakingNotification> | Promise<Nullable<MatchMakingNotification>>;

    abstract roomReady(): Nullable<RoomReady> | Promise<Nullable<RoomReady>>;

    abstract stateUpdated(): Nullable<PlayerStateUpdatedResponse> | Promise<Nullable<PlayerStateUpdatedResponse>>;

    abstract playerNotification(): Nullable<PlayerNotification> | Promise<Nullable<PlayerNotification>>;
}

export class GameServersMutation {
    up?: Nullable<string>;
    down?: Nullable<string>;
    storeStates?: Nullable<string>;
    initGame?: Nullable<string>;
}

export class RoomMutation {
    roomCreated?: Nullable<string>;
}

export class PlayerConnectionInfo {
    playerId: string;
    roomId: string;
    isReadyTeam: boolean;
    Inventory: InventoryItem[];
}

export class RoomQuery {
    config?: string;
    connectionInfo?: Nullable<PlayerConnectionInfo>;
}

export class InventoryItem {
    itemId: string;
    group: string;
}

export class DatasourceStateUpdatedResponse {
    sourceName?: Nullable<string>;
}

export class TokenResponse {
    accessToken: string;
}

export class AuthMutation {
    register?: boolean;
    login?: TokenResponse;
}

export class MeQuery {
    Inventory?: Nullable<InventoryQuery>;
    profile: PlayerModel;
    rewardNotifications: RewardNotificationPayload[];
}

export class MeMutation {
    Inventory?: Nullable<InventoryMutation>;
    convertItems?: string;
    readNotification?: boolean;
}

export class InventoryQuery {
    items: InventoryItem[];
}

export class InventoryMutation {
    setItems?: Nullable<string>;
}

export class BackpackPublicInfo {
    backpackId: string;
    userId: string;
    name: string;
    items: BackpackItem[];
}

export class BackpackItem {
    i18n?: Nullable<string>;
    itemId: string;
    amount: number;
    data?: Nullable<string>;
}

export class PlayerModel {
    userId: string;
    nikName: string;
    backpack?: Nullable<BackpackPublicInfo>;
    unReadNotificationCount: number;
}

export class RewardNotificationDataItem {
    itemId: string;
    amount: number;
    type: string;
}

export class RewardNotificationPayload {
    id: string;
    transactionId: string;
    title: string;
    items: RewardNotificationDataItem[];
}

export class ErrorNotification {
    type: ErrorType;
    message: string;
    details: string;
    requestId?: Nullable<string>;
    transactionId: string;
}

export class MeNotification {
    title: string;
}

export class BackPackNotification {
    transactionId: string;
    title?: Nullable<string>;
    i18n?: Nullable<string>;
    items: BackpackItem[];
}

export class BroadcastNotification {
    type?: Nullable<BroadcastNotificationType>;
    resource?: Nullable<string>;
}

export class MatchMakingNotification {
    transactionId?: Nullable<string>;
    status: MatchMakingNotificationStatus;
    capacity: number;
    playersAmount: number;
}

export class DailyBonusMutation {
    claim: boolean;
}

export class DevMutation {
    setBackpackItem?: string;
    testErrorHandler?: Nullable<string>;
    Transactions?: Nullable<ConvertTransactions_DEV>;
}

export class ConvertTransactions_DEV {
    pushFakeNotify?: Nullable<string>;
    addItemsForce?: Nullable<string>;
}

export class GameServer {
    gameServerId: string;
    callBackHost: string;
}

export class HeroInfo {
    power: Power;
    health?: Nullable<Health>;
    heroId: string;
    hunter?: Nullable<Hunter>;
    berserk?: Nullable<Berserk>;
    movable?: Nullable<Movable>;
    version: number;
    heroI18n: string;
    heroGameID: number;
    invisibility: Invisibility;
    summonerOnKill: SummonerOnKill;
    tempWeaponCreator: TempWeaponCreator;
    summonerOnWeaponUlt: SummonerOnWeaponUlt;
    summonerOnCharacterUlt: SummonerOnCharacterUlt;
}

export class Power {
    value: number;
    enabled: boolean;
    showPower: boolean;
}

export class Health {
    enabled: boolean;
    maxValue: number;
}

export class Hunter {
    enabled: boolean;
    powerGrowAmount?: Nullable<number>;
}

export class Berserk {
    enabled: boolean;
    powerGrowAmount?: Nullable<number>;
}

export class Movable {
    enabled: boolean;
    moveSpeed: number;
}

export class Invisibility {
    enabled: boolean;
    duration: number;
    canAttack: boolean;
    onWeaponUlt: boolean;
    removeOnHit: boolean;
    onCharacterUlt: boolean;
}

export class SummonerOnKill {
    chance: number;
    enabled: boolean;
    summonNpc: number;
    summonType: number;
    SummonPoint?: Nullable<number>;
    summonInteractable?: Nullable<number>;
}

export class TempWeaponCreator {
    enabled: boolean;
    lockPower: boolean;
    durability: number;
    weapon_game_id: number;
    corruptedPerShoot?: Nullable<number>;
    corruptedPerSecond?: Nullable<number>;
}

export class SummonerOnWeaponUlt {
    chance: number;
    enabled: boolean;
    summonNpc: number;
    summonType: number;
    summonInteractable?: Nullable<number>;
}

export class SummonerOnCharacterUlt {
    chance: number;
    enabled: boolean;
    summonNpc: number;
    summonType: number;
    summonInteractable?: Nullable<number>;
}

export class HeroQuery {
    findOne?: Nullable<string>;
    findMany?: Nullable<string[]>;
}

export class ItemForSellInfo {
    i18n: string;
    type: string;
    group: string;
    price?: Nullable<Nullable<Price>[]>;
    itemId: string;
    alternative_reward?: Nullable<Nullable<AlternativeReward>[]>;
}

export class Price {
    item: string;
    value: string;
}

export class AlternativeReward {
    item?: Nullable<string>;
    min?: Nullable<number>;
    max?: Nullable<number>;
}

export class ItemForSellQuery {
    findOne?: Nullable<ItemForSellInfo>;
    findMany?: Nullable<Nullable<ItemForSellInfo>[]>;
    currenciesFindMany?: Nullable<Nullable<ItemForSellInfo>[]>;
}

export class ILocalizationQuery {
    key: string;
    lang: string;
    value: string;
}

export class LocalizationQuery {
    findMany?: Nullable<Nullable<ILocalizationQuery>[]>;
}

export class LootboxMutation {
    openBox?: string;
}

export class LootboxBox {
    boxId: string;
    name: string;
    group: string;
    price: Price[];
    enabled: boolean;
    endDate: string;
    startAt: string;
    maxGroupBuy: number;
    superWin?: Nullable<LootboxBoxSuperWin>;
}

export class LootboxBoxSuperWin {
    target?: Nullable<number>;
    current?: Nullable<number>;
    reward?: Nullable<Nullable<Reward>[]>;
}

export class LootboxQuery {
    boxFindMany?: Nullable<Nullable<LootboxBox>[]>;
}

export class Reward {
    item: string;
}

export class RoomReady {
    connectionId: string;
    gameServerHost: string;
    gameServerPort: number;
    transactionId?: Nullable<string>;
}

export class NpcInfo {
    npcId: string;
    health: Health;
    movable: Movable;
    npcI18n: string;
    version: number;
    aggressable: Aggressable;
    npc_game_id: number;
}

export class Aggressable {
    enabled: boolean;
    attackDistance: number;
    aggressiveDistance: number;
}

export class NpcQuery {
    findOne?: Nullable<string>;
    findMany?: Nullable<Nullable<string>[]>;
}

export class PlayerStateUpdatedResponse {
    userId: string;
    backpackItems?: Nullable<Nullable<BackpackFindItem>[]>;
}

export class BackpackFindItem {
    backpackId?: Nullable<string>;
    item?: Nullable<string>;
    amount?: Nullable<number>;
    data?: Nullable<JSON>;
}

export class PlayerNotification {
    type: string;
}

export class WeaponSettings {
    power?: Nullable<string>;
    weaponId?: Nullable<string>;
    shootDelay?: Nullable<string>;
    Modifications?: Nullable<Nullable<WeaponModificationsSettings>[]>;
}

export class WeaponModificationsSettings {
    name?: Nullable<string>;
}

export class WeaponQuery {
    getList?: Nullable<Nullable<WeaponSettings>[]>;
    findOne?: Nullable<string>;
    findMany?: Nullable<Nullable<string>[]>;
}

export class IWeaponInfo {
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
}

export class AmmoData {
    enabled: boolean;
    maxAmmo: number;
    ammoPerSec: number;
    reloadTime: number;
    isRegeneratingAmmo: boolean;
}

export class PusherData {
    enabled: boolean;
    duration: number;
    pushValue: number;
}

export class ScalerData {
    enabled: boolean;
    duration: number;
    defaultScale: number;
    scaleMultiply: number;
}

export class HitPowerData {
    enabled: boolean;
    powerOnKill: number;
    powerOnTouch: number;
}

export class RicochetData {
    enabled: boolean;
    maxTimes: number;
    isWallInclude: boolean;
    isEnemyInclude: boolean;
}

export class LifeStealerData {
    enabled: boolean;
    multiply: number;
    healthAmount: number;
    isHealthChangerMultiply: boolean;
}

export class BaseSettingsData {
    power: number;
    enabled: boolean;
    lifeDelay: number;
    shootDelay: number;
    projectileScale: number;
    projectileSpeed: number;
    isDestroyableOnWall: boolean;
    touchAmountToDelete: number;
}

export class ChargePusherData {
    enabled: boolean;
    duration: number;
    multiply: number;
    pushValue: number;
    timeToActivate: number;
    isPusherMultiply: boolean;
}

export class HealthChangerData {
    enabled: boolean;
    healthAmount: number;
}

export class ChargeHealthChangerData {
    enabled: boolean;
    multiply: number;
    healthAmount: number;
    timeToActivate: number;
    isHealthChangerMultiply: boolean;
}

export type JSON = any;
type Nullable<T> = T | null;
