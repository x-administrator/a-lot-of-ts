import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SessionPayload } from '../session.types';

// ---------------------------------------------------------------------------------------------------

export function CurrentSession(...keys: (keyof SessionPayload)[]) {
  return createParamDecorator((_k, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const session = ctx.getContext().req.session as SessionPayload;

    if (!session) {
      throw new UnauthorizedException();
    }

    if (!keys.length) {
      return session;
    }

    if (Array.isArray(keys)) {
      const obj = {};
      for (const key of keys) {
        obj[key] = session[key];
      }
      return obj;
    }
  })();
}
