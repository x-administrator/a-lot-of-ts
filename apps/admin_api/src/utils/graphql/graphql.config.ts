import { SystemHeaders } from '@app/common/request-context';
import { Inject, Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { MercuriusDriverConfig } from '@nestjs/mercurius';
import { RequestContext } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'async_hooks';
import { ExecutionResult } from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { PubSub } from 'graphql-subscriptions';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { defaultErrorFormatter, MercuriusContext } from 'mercurius';
import { join } from 'path';
import { GraphqlPubSubToken } from './pubsub/graphql.pubsub';

export interface IWsParams {
  readonly Authorization?: string;
}

@Injectable()
export class GraphqlConfig implements GqlOptionsFactory<MercuriusDriverConfig> {
  constructor(
    @Inject(GraphqlPubSubToken) readonly pubsub: PubSub,
    readonly als: AsyncLocalStorage<RequestContext>,
  ) {}

  createGqlOptions(): Omit<MercuriusDriverConfig, 'driver'> | Promise<Omit<MercuriusDriverConfig, 'driver'>> {
    const typePathsBase = process.env.GQL_FILES_PATH || './**/*.gql';
    const definitionsPath = join(process.cwd(), 'apps/admin_api/src/utils/graphql/types/graphql.ts');
    return {
      typePaths: [typePathsBase],
      graphiql: true,
      fieldResolverEnhancers: ['guards', 'interceptors', 'filters'],
      definitions: {
        path: definitionsPath,
        outputAs: 'class',
      },
      context: ({ req, connectionParams, extra }) => ({
        req,
        connectionParams,
        extra,
      }),
      resolvers: { JSON: GraphQLJSON },
      errorFormatter: (result, context) => this.errorFormatter(result, context),
      subscription: {
        pubsub: this.pubsub,
      },
    };
  }

  errorFormatter(
    result: ExecutionResult<ObjMap<unknown>, ObjMap<unknown>> & Required<Pick<ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>, 'errors'>>,
    context: MercuriusContext,
  ) {
    const formatter = defaultErrorFormatter(result, context);
    const store = this.als.getStore();
    if (!store) {
      return {
        statusCode: formatter.statusCode || 500,
        response: formatter.response,
      };
    }
    formatter.response.data = {
      ...formatter.response.data,
      requestId: store[SystemHeaders.xRequestId],
    };
    return {
      statusCode: formatter.statusCode || 500,
      response: formatter.response,
    };
  }
}
