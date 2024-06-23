import { IRequestContext } from '@app/common/request-context';
import { Global, Injectable, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { PubSub } from 'graphql-subscriptions';

export const GraphqlPubSubToken = Symbol('PUB_SUB');

@Injectable()
export class PubSubInst extends PubSub {
  constructor(readonly als: AsyncLocalStorage<IRequestContext>) {
    super();
  }
  publish(triggerName: string, payload: any): Promise<void> {
    return super.publish(triggerName, { ...payload });
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T, any, undefined> {
    return super.asyncIterator(triggers);
  }
}

export const PubSubProvider = {
  provide: GraphqlPubSubToken,
  instance: null,
  useFactory: (als: AsyncLocalStorage<IRequestContext>) => {
    const thet = this as any;
    if (thet?.instance) {
      return thet.instance;
    }
    const pubSubInst = new PubSubInst(als);
    thet.instance = pubSubInst;
    return pubSubInst;
  },
  inject: [AsyncLocalStorage],
};

@Global()
@Module({
  providers: [PubSubProvider],
  exports: [GraphqlPubSubToken],
})
export class PubSubModule {}
