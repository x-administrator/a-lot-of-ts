import { AppContextModule } from '@app/common/als/app-context.module';
import { Global, Module, RequestMethod } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import * as Joi from 'joi';
import { Params, LoggerModule as PinoLogger } from 'nestjs-pino';
import { pino } from 'pino';
import { SystemHeaders } from '../request-context';
import { ConfigsUtils } from '../config/configs.utils';

function readConfigs() {
  const schema = {
    LOGGER_LEVEL: Joi.string().default('info'),
    LOGGER_FORMAT: Joi.boolean().default('false'),
    LOGGER_SQL: Joi.boolean().default('false'),
  };
  return ConfigsUtils.validateAndExtractEnv(schema);
}

@Global()
@Module({
  imports: [
    AppContextModule,
    PinoLogger.forRootAsync({
      imports: [AppContextModule],
      inject: [AsyncLocalStorage],
      useFactory: async (als: AsyncLocalStorage<any>): Promise<Params> => {
        const congifs = readConfigs();

        const transportFormatted = { target: 'pino-pretty', options: { colorize: true } };
        const useLevel = congifs.LOGGER_LEVEL as pino.LevelWithSilent;
        const transport = congifs.LOGGER_FORMAT ? transportFormatted : (null as any);
        return {
          exclude: [
            { path: '/graphql', method: RequestMethod.POST },
            { path: '/graphiql', method: RequestMethod.GET },
            { path: '/graphiql/config.js', method: RequestMethod.GET },
            { path: '/graphiql/main.js', method: RequestMethod.GET },
            { path: '/favicon.ico', method: RequestMethod.GET },
          ],
          pinoHttp: {
            level: useLevel,
            transport,
            mixin() {
              const store = als.getStore();

              return {
                request_id: store?.[SystemHeaders.xRequestId],
              };
            },
            customProps: function () {
              const store = als.getStore();

              return {
                request_id: store?.[SystemHeaders.xRequestId],
              };
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
