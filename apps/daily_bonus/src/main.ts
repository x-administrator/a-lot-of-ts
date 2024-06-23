import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { IRequestContext } from '@app/common/request-context';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'async_hooks';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, configService.communicationOptions);
  const als = app.get(AsyncLocalStorage) as AsyncLocalStorage<IRequestContext>;
  const logger = app.get(Logger);
  app.useGlobalInterceptors(new AppContextInterceptor(als));
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  logger.log(`DailyBonus is running on: with NATS communication`);
}
bootstrap();
