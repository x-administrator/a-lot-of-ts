import { Module } from '@nestjs/common';
import { DailyBonusService } from './daily-bonus.service';
import { DailyBonusMutationResolver } from './resolvers/daily-bonus.mutation.resolver';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MAIN',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => configService.communicationOptions,
      },
    ]),
  ],
  providers: [DailyBonusService, DailyBonusMutationResolver],
  exports: [DailyBonusService],
})
export class DailyBonusModule {}
