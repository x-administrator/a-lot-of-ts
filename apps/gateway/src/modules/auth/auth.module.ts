import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../../utils/config/config.module';
import { ConfigService } from '../../utils/config/config.service';
import { AuthGuard } from './decorator/auth.guard';
import { MeController } from './me.controller';
import { AuthMutationResolver } from './resolvers/auth.mutation.resolver';
import { BackpackItemResolver } from './resolvers/backpack_item.resolver';
import { InventoryMutationResolver } from './resolvers/inventory/inventory.mutation.resolver';
import { InventoryQueryResolver } from './resolvers/inventory/inventory.query.resolver';
import { MeMutationResolver } from './resolvers/me.mutation.resolver';
import { MeQueryResolver } from './resolvers/me.query.resolver';
import { MeSubscriptionResolver } from './resolvers/me.subscription.resolver';
import { AuthService } from './services/auth.service';
import { MeService } from './services/me.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ({ jwtConfig }: ConfigService) => ({
        secret: jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.expiresIn,
        },
      }),
    }),
  ],
  controllers: [MeController],
  providers: [
    AuthGuard,
    AuthMutationResolver,
    AuthService,
    InventoryMutationResolver,
    InventoryQueryResolver,
    BackpackItemResolver,
    JwtStrategy,
    MeMutationResolver,
    MeQueryResolver,
    MeService,
    MeSubscriptionResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
