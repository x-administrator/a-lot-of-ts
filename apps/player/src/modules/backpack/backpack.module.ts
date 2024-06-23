import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BackpackController } from '../backpack/backpack.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { BackpackRepository } from './backpack.repository';
import { BackpackService } from './backpack.service';

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
  controllers: [BackpackController],
  providers: [BackpackService, BackpackRepository],
  exports: [BackpackService, BackpackRepository],
})
export class BackpackModule {}
