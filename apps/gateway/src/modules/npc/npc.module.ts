import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { NpcQueryResolver } from './npc.query.resolver';
import { NpcService } from './npc.service';

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
  providers: [NpcService, NpcQueryResolver],
  exports: [NpcService],
})
export class NpcModule {}
