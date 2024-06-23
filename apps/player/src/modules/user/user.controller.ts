import { OnFetch } from '@app/common/rpc';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { UserFindOneDTO } from './models/dto/user-find-one.dto';
import { UserLoginDTO } from './models/dto/user-login.dto';
import { UserRegisterDTO } from './models/dto/user-register.dto';
import { UserAuthService } from './user.auth.service';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    readonly service: UserService,
    private readonly userAuthService: UserAuthService,
  ) {}

  @OnFetch('player.find.one.1')
  find(@Payload() payload: Partial<UserFindOneDTO>) {
    return this.service.findOne(payload);
  }

  @OnFetch('player.login.local.1')
  loginLocal(@Payload() payload: UserLoginDTO) {
    return this.userAuthService.loginPlayer(payload.nikName, payload.password);
  }

  @OnFetch('player.register.local.1')
  create(@Payload() payload: UserRegisterDTO) {
    return this.userAuthService.registerPlayerLocal(payload);
  }
}
