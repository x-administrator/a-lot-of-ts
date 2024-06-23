import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GameServersService {
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}

  async getGameServers() {
    const gameServers = await this.rpc.fetch('gameServerApi.find.active.1', null);
    return gameServers;
  }
}
