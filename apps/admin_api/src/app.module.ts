import { AppContextModule } from '@app/common/als/app-context.module';
import { LoggerModule } from '@app/common/logger/logger.module';
import { RedisModule } from '@app/common/redis/redis.module';
import { Module } from '@nestjs/common';
import { AdminApiController } from './app.controller';
import { SettingsModule } from './settings/settings.module';
import { ConfigModule } from './utils/config/config.module';
import { GraphqlModule } from './utils/graphql/graphql.module';
import { RPCModule } from './utils/rpc/rpc.module';

@Module({
  imports: [GraphqlModule, ConfigModule, RPCModule, LoggerModule, AppContextModule, SettingsModule, RedisModule],
  controllers: [AdminApiController],
})
export class AdminApiModule {}
