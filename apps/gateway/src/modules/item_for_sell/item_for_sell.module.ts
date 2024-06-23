import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { ItemForSellQueryResolver } from './item_for_sell.query.resolver';
import { ItemForSellService } from './item_for_sell.service';

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
  providers: [ItemForSellService, ItemForSellQueryResolver],
  exports: [ItemForSellService],
})
export class ItemForSellModule {}
