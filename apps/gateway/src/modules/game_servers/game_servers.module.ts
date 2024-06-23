import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { GameServerQueryResolver } from './game_servers.query.resolver';
import { GameServersService } from './game_servers.service';

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
  providers: [GameServersService, GameServerQueryResolver],
  exports: [],
})
export class GameServersModule {}
