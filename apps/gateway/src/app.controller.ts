import { Controller, Get, HttpException } from '@nestjs/common';
import { ClientNats, MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './utils/config/config.service';
import { RedisHealthIndicator } from '@app/common/redis';

@Controller()
export class AppController {
  client: ClientNats;

  constructor(
    private redisHealth: RedisHealthIndicator,
    readonly configService: ConfigService,
  ) {
    this.client = new ClientNats(this.configService.communicationOptions);
  }

  @Get('/ping')
  ping() {
    return 'pong';
  }

  @Get('/health')
  async healthCheck() {
    try {
      const responses = await Promise.all([
        this.redisHealth.isHealthy('Prisma'),
        firstValueFrom(this.client.send('gateway.system.ping', 'ping')),
        firstValueFrom(this.client.send('settings.system.ping', 'ping')),
        firstValueFrom(this.client.send('matchmaking.system.ping', 'ping')),
        firstValueFrom(this.client.send('daily-bonus.system.ping', 'ping')),
        // firstValueFrom(this.client.send('player.system.ping', 'ping')),
      ]);

      const isHealthy = responses.every((v) => v);

      if (!isHealthy) {
        throw new HttpException('check services', 500);
      }
      return new Date().getTime();
    } catch (e) {
      throw new HttpException('check services', 500);
    }
  }

  @MessagePattern('gateway.system.ping')
  queueCheck() {
    return true;
  }
}
