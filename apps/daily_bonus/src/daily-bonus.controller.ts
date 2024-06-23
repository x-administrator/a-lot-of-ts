import { Controller } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { ConfigService } from './modules/config/config.service';

@Controller()
export class DailyBonusController {
  client: ClientNats;

  constructor(readonly configService: ConfigService) {
    this.client = new ClientNats(this.configService.communicationOptions);
  }
}
