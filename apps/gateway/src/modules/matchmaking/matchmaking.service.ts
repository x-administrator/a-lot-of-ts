import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable } from '@nestjs/common';
import { InitGameInput, StoreStatusesInput } from '../../utils/graphql/types/graphql';

@Injectable()
export class MatchmakingService {
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}

  async storeStatuses(dto: StoreStatusesInput[], userId: string) {
    await this.rpc.sendCommand('matchmaking.gameServers.storeStatuses.1', dto, { userId });
  }

  async initGame(userId: string, payload: InitGameInput) {
    await this.rpc.sendCommand('matchmaking.gameProcess.initiate.1', payload, { userId });
  }
}
