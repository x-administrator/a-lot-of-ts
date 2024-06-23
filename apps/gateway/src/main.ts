import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { AppContextMiddleware } from '@app/common/als/app-context.middleware';
import { IRequestContext } from '@app/common/request-context';
import { Logger as BaseLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AsyncLocalStorage } from 'async_hooks';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { tracer } from '../../../libs/common/src/telemetry/tracer';
import { GatewayModule } from './gateway.module';
import { ConfigService } from './utils/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(GatewayModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  tracer(configService).start();
  const logger = new BaseLogger('Gateway');
  app.enableCors({ credentials: true, origin: true });
  const als = app.get(AsyncLocalStorage) as AsyncLocalStorage<IRequestContext>;
  app.use(AppContextMiddleware(als));
  app.useGlobalInterceptors(new AppContextInterceptor(als));
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(configService.communicationOptions);
  await app.startAllMicroservices();
  await app.listen(configService.port, '0.0.0.0');
  logger.log(`Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
