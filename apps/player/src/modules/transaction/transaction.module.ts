import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BackpackModule } from '../backpack/backpack.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UserModule } from '../user/user.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

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
    UserModule,
    BackpackModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
