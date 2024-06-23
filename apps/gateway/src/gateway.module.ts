import { AppContextModule } from '@app/common/als/app-context.module';
import { LoggerModule } from '@app/common/logger/logger.module';
import { RedisModule } from '@app/common/redis/redis.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GatewayController } from './gateway.controller';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevModule } from './modules/dev/dev.module';
import { GameServersModule } from './modules/game_servers/game_servers.module';
import { HeroModule } from './modules/hero/hero.module';
import { ItemForSellModule } from './modules/item_for_sell/item_for_sell.module';
import { LocalizationModule } from './modules/localization/localization.module';
import { LootboxModule } from './modules/lootbox/lootbox.module';
import { MatchmakingModule } from './modules/matchmaking/matchmaking.module';
import { NpcModule } from './modules/npc/npc.module';
import { PlayerModule } from './modules/player/player.module';
import { RequestEventModule } from './modules/request_event/request_event.module';
import { SessionModule } from './modules/session/session.module';
import { SettingsModule } from './modules/settings/settings.module';
import { WeaponModule } from './modules/weapon/weapon.module';
import { ConfigModule } from './utils/config/config.module';
import { RPCModule } from './utils/rpc/prc.module';
import { DailyBonusModule } from './modules/daily-bonus/daily-bonus.module';

@Module({
  imports: [
    AppContextModule,
    AuthModule,
    ConfigModule,
    DevModule,
    EventEmitterModule.forRoot(),
    GraphqlModule,
    HeroModule,
    GameServersModule,
    ItemForSellModule,
    LocalizationModule,
    LoggerModule,
    NpcModule,
    PlayerModule,
    RequestEventModule,
    RPCModule,
    SessionModule,
    SettingsModule,
    WeaponModule,
    LootboxModule,
    DailyBonusModule,
    RedisModule,
    MatchmakingModule,
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
