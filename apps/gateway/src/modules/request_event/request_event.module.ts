import { Global, Module } from '@nestjs/common';
import { RequestEventInterceptor } from './request_event.interceptor';
import { RequestEventService } from './request_event.service';

@Global()
@Module({
  providers: [RequestEventService, RequestEventInterceptor],
  exports: [RequestEventService, RequestEventInterceptor],
})
export class RequestEventModule {}
