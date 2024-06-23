import { LoggerModule } from '@app/common/logger/logger.module';
import { RedisModule } from '@app/common/redis/redis.module';
import { Module } from '@nestjs/common';
import { AppContextModule } from '../../../libs/common/src/als/app-context.module';
import { BackpackModule } from './modules/backpack/backpack.module';
import { ConfigModule } from './modules/config/config.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { PlayerController } from './player.controller';
import { PrismaModule } from './utils/prisma/prisma.module';
import { RPCModule } from './utils/rpc/prc.module';

@Module({
  imports: [
    AppContextModule,
    BackpackModule,
    ConfigModule,
    LoggerModule,
    PrismaModule,
    RPCModule,
    SettingsModule,
    TransactionModule,
    UserModule,
    RedisModule,
    InventoryModule,
  ],
  controllers: [PlayerController],
})
export class AppModule {}
