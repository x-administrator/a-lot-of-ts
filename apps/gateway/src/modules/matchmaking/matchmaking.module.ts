import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { MatchMakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { GameServersMutationResolver } from './resolvers/game_servers.mutation.resolver';
import { MatchMakingSubscriptionResolver } from './resolvers/match_making.subscription';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MAIN',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: ({ communicationOptions }: ConfigService) => communicationOptions,
      },
    ]),
  ],
  controllers: [MatchMakingController],
  providers: [MatchmakingService, GameServersMutationResolver, MatchMakingSubscriptionResolver],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
