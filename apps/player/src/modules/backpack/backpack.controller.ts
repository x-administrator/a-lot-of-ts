import { OnFetch } from '@app/common/rpc';
import { Controller, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { SetItemDto } from 'apps/gateway/src/utils/graphql/types/graphql';
import { BackpackService } from '../backpack/backpack.service';
import { BackpackFindDTO } from './dto/backpack-find.dto';
import { BackpackPublicInfo } from './dto/backpack-find.response';

@Controller()
export class BackpackController {
  logger: Logger;
  constructor(readonly service: BackpackService) {
    this.logger = new Logger(BackpackController.name);
  }

  @OnFetch('player.backpack.findOne.1')
  find(@Payload() payload: Partial<BackpackFindDTO>): Promise<BackpackPublicInfo | null> {
    return this.service.findOne(payload);
  }

  @OnFetch('player.backpack.itemCreate.1')
  itemCreate(@Payload() payload: SetItemDto) {
    return this.service.itemCreate(payload);
  }
}
