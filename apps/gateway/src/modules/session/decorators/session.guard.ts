import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SessionService } from '../session.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(readonly sessionStorageService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const { sessionId, userId } = req.user;
    const activeSession = this.sessionStorageService.get(userId);

    if (!activeSession) {
      throw new UnauthorizedException('No activeSession');
    }

    if (activeSession.sessionId !== sessionId) {
      return false;
    }

    req.session = activeSession;

    return true;
  }
}
