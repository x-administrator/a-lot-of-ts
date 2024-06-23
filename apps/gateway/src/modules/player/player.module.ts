import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './services/player.service';
import { RewardNotificationService } from './services/reward-notification.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'Player',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: ({ communicationOptions }: ConfigService) => communicationOptions,
      },
    ]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService, RewardNotificationService],
  exports: [PlayerService, RewardNotificationService],
})
export class PlayerModule {}
