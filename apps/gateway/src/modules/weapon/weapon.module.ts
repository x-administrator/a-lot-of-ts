import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { WeaponQueryResolver } from './weapon.query.resolver';
import { WeaponService } from './weapon.service';

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
  providers: [WeaponService, WeaponQueryResolver],
  exports: [WeaponService],
})
export class WeaponModule {}
