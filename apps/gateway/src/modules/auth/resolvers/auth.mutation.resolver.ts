import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';

import { Logger } from '@nestjs/common';
import { AuthMutation, LoginDto, RegisterDto } from 'apps/gateway/src/utils/graphql/types/graphql';
import { AuthService } from '../services/auth.service';
import { TokenResponse } from '../types/auth.types';

@Resolver(() => AuthMutation)
export class AuthMutationResolver {
  private readonly logger = new Logger(AuthMutationResolver.name);

  constructor(private authService: AuthService) {}

  @Mutation('Auth')
  async mutation() {
    return {};
  }

  @ResolveField('register')
  async register(@Args('data') data: RegisterDto): Promise<boolean> {
    return this.authService.register(data);
  }

  @ResolveField('login')
  async login(@Args('data') data: LoginDto): Promise<TokenResponse> {
    return this.authService.login(data);
  }
}
