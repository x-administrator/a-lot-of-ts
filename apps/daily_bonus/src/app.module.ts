import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AppContextModule } from '@app/common/als/app-context.module';
import { ConfigModule } from './modules/config/config.module';
import { DailyItemsModule } from './modules/daily-bonus/daily-bonus.module';
import { SettingsModule } from './modules/settings/settings.module';
import { DailyBonusController } from 'apps/daily_bonus/src/daily-bonus.controller';
import { PrismaModule } from './utils/prisma/prisma.module';
import { RPCModule } from './utils/rpc/prc.module';

@Module({
  imports: [RPCModule, ConfigModule, PrismaModule, LoggerModule, DailyItemsModule, AppContextModule, SettingsModule],
  controllers: [DailyBonusController],
})
export class AppModule {}
