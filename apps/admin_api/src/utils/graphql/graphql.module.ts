import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { GraphqlPubSubToken, PubSubInst, PubSubModule, PubSubProvider } from './pubsub/graphql.pubsub';
import { GraphqlConfig } from './graphql.config';

@Global()
@Module({
  imports: [
    PubSubModule,
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [PubSubModule],
      useClass: GraphqlConfig,
    }),
  ],
  providers: [PubSubProvider],
  exports: [GraphqlPubSubToken],
})
export class GraphqlModule {}
