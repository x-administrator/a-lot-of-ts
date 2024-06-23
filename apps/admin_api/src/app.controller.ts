import { Controller, Get } from '@nestjs/common';

@Controller()
export class AdminApiController {
  authenticated = false;
  pollingCount = 0;
  @Get('/')
  root() {
    return 'admin_api';
  }

  @Get('/ping')
  ping() {
    return 'pong';
  }

  @Get('/health')
  health() {
    return new Date();
  }
}
