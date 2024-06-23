import { applyDecorators } from '@nestjs/common';
import { ReturnTypeFunc, Subscription, SubscriptionOptions } from '@nestjs/graphql';

export const AuthorizedSubscription = (typeFunc: ReturnTypeFunc, options?: SubscriptionOptions) =>
  applyDecorators(
    Subscription(typeFunc, {
      ...options,
      filter: async (payload, vars, context) => {
        const extraFilter = options && options.filter ? await options.filter(payload, vars, context) : true;
        return extraFilter && payload.userId === context.request.user.userId;
      },
    }),
  );
