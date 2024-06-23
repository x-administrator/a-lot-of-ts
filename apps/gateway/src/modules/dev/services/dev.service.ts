import { IRequestContext } from '@app/common/request-context';
import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AsyncLocalStorage } from 'async_hooks';
import { PlayerService } from '../../player/services/player.service';
import { SetItemPayload } from '../dev.types';

@Injectable()
export class DevService {
  logger = new Logger(DevService.name);

  constructor(
    @Inject('MAIN') readonly clientProxy: ClientProxy,
    readonly als: AsyncLocalStorage<IRequestContext>,
    readonly playerService: PlayerService,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {}

  async setBackpackItem(payload: SetItemPayload) {
    return this.rpc.fetch('player.backpack.itemCreate.1', payload);
  }
}
