import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { DevMutationResolver } from './resolvers/dev.mutation.resolver';
import { DevService } from './services/dev.service';
import { DevTransactionsMutationResolver } from './resolvers/dev.transactions.mutation.resolver';
import { DevTransactionService } from './services/dev.transactions.service';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    PlayerModule,
    ClientsModule.registerAsync([
      {
        name: 'MAIN',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: ({ communicationOptions }: ConfigService) => communicationOptions,
      },
    ]),
  ],
  providers: [DevService, DevMutationResolver, DevTransactionsMutationResolver, DevTransactionService],
})
export class DevModule {}
