import { Expand } from '@app/common';
import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PlayerModel } from '../../player/player.model';

// ---------------------------------------------------------------------------------------------------

export type CurrentUserPayload = Expand<PlayerModel & { sessionId: string }>;
export type CurrentUserPick<K extends keyof PlayerModel> = Expand<Pick<CurrentUserPayload, K>>;

// ---------------------------------------------------------------------------------------------------

/**
 * A parameter decorator that retrieves the current user information from the execution context.
 *
 * Can be used with query, mutation and subscription
 *
 * @param {(keyof PlayerModel)[]} keys Optional keys to extract from the user object.
 */
export function CurrentUser(...keys: (keyof PlayerModel)[]) {
  return createParamDecorator((_k, executionContext: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(executionContext).getContext();

    const request = ctx.request ? ctx.request : ctx.req;

    const user: CurrentUserPayload = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!keys.length) {
      return user;
    }

    if (Array.isArray(keys)) {
      const obj = {};
      for (const key of keys) {
        obj[key] = user[key];
      }
      return obj;
    }
  })();
}
