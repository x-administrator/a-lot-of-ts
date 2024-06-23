import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { PubSub } from 'graphql-subscriptions';
import { AuthModule } from '../modules/auth/auth.module';
import { GraphqlConfig } from './graphql.config';
import { GraphqlPubSubToken, PubSubModule } from './graphql.pubsub';

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [PubSubModule, AuthModule],
      useClass: GraphqlConfig,
    }),
  ],
  providers: [
    {
      provide: GraphqlPubSubToken,
      useClass: PubSub,
    },
  ],
  exports: [GraphqlPubSubToken],
})
export class GraphqlModule {}
