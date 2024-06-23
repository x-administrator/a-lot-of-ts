import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../utils/config/config.service';
import { PlayerService } from '../../player/services/player.service';
import { SessionService } from '../../session/session.service';
import { AuthError } from '../auth.common';
import { JWTPayload, JWTStrategyValidatePayload, LoginPayload, RegisterPayload, TokenResponse } from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    readonly playerService: PlayerService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async register(data: RegisterPayload): Promise<boolean> {
    let player = await this.playerService.rpc.fetch('player.find.one.1', { nikName: data.nikName });

    if (player) {
      throw new HttpException(AuthError.USER_ALREADY_REGISTERED, HttpStatus.FOUND);
    }

    player = await this.playerService.rpc.fetch('player.register.local.1', data);

    if (!player) {
      throw new HttpException(AuthError.CANNOT_REGISTER, HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async login(data: LoginPayload): Promise<TokenResponse> {
    const loginLocalPayload = { nikName: data.nikName, password: data.password };
    const player = await this.playerService.rpc.fetch('player.login.local.1', loginLocalPayload);

    if (!player) {
      throw new NotFoundException();
    }

    const sessionId = await this.sessionService.refreshSession(player.userId);
    if (!sessionId) {
      throw new UnauthorizedException();
    }

    const accessToken = this.generateJWT({
      id: player.userId,
      sessionId,
    });

    return {
      accessToken,
    };
  }

  invalidateSession(playerId: string) {
    this.sessionService.delete(playerId);
  }

  async verifyToken(token: string): Promise<JWTStrategyValidatePayload> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.jwtConfig.secret,
    });

    return payload;
  }

  private generateJWT(payload: JWTPayload): string {
    return this.jwtService.sign(payload, this.configService.jwtConfig);
  }
}
