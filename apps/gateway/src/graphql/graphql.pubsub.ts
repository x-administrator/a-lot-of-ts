import { SystemHeaders } from '@app/common/request-context';
import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { RequestContext } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'async_hooks';
import { PubSub } from 'graphql-subscriptions';
import { ISubscription } from '../utils/graphql/types/graphql';

export const GraphqlPubSubToken = 'PUB_SUB';

@Injectable()
export class PubSubInst extends PubSub {
  private readonly logger = new Logger(PubSubInst.name);

  constructor(readonly als: AsyncLocalStorage<RequestContext>) {
    super();
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T, any, undefined> {
    return super.asyncIterator(triggers);
  }

  publish(triggerName: string, payload: any): Promise<void> {
    const store = this.als.getStore() || {};
    const userId = payload.userId ?? store[SystemHeaders.userId];
    return super.publish(triggerName, { ...payload, userId });
  }

  asyncIterator2<Subs extends keyof ISubscription>(triggers: Subs) {
    return super.asyncIterator('subs_' + triggers);
  }

  publish2<Subs extends keyof ISubscription>(data: {
    method: Subs;
    payload: Awaited<NonNullable<ReturnType<ISubscription[Subs]>>>;
    userId?: string;
  }) {
    const store = this.als.getStore() || {};
    const userId = data.userId ?? store[SystemHeaders.userId];
    return super.publish('subs_' + data.method, { [data.method]: data.payload, userId });
  }
}

@Global()
@Module({
  providers: [
    {
      provide: GraphqlPubSubToken,
      useClass: PubSubInst,
    },
  ],
  exports: [GraphqlPubSubToken],
})
export class PubSubModule {}
