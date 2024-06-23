import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';

export class AuthGuard extends AuthGuardPassport('jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.request ? ctx.request : ctx.req;
    return request;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
