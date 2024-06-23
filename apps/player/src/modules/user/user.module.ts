import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UserAuthService } from './user.auth.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
@Global()
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
  controllers: [UserController],
  providers: [UserService, UserRepository, UserAuthService],
  exports: [UserService],
})
export class UserModule {}
