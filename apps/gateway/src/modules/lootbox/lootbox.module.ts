import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { LootboxService } from './lootbox.service';
import { LootboxMutationResolver } from './resolvers/lootbox.mutation.resolver';
import { LootboxQueryResolver } from './resolvers/lootbox.query.resolver';

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
  providers: [LootboxService, LootboxMutationResolver, LootboxQueryResolver],
  exports: [LootboxService],
})
export class LootboxModule {}
