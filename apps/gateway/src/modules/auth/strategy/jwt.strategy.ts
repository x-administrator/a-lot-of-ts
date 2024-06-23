import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../utils/config/config.service';
import { PlayerService } from '../../player/services/player.service';
import { JWTStrategyValidatePayload } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    readonly playerService: PlayerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JWTStrategyValidatePayload) {
    const user = await this.playerService.rpc.fetch('player.find.one.1', { playerId: payload.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...user, sessionId: payload.sessionId };
  }
}
