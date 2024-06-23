import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { LootboxActiveListPerUser } from 'apps/lootbox/src/modules/processing/processing.types';

@Injectable()
export class LootboxService {
  logger = new Logger(LootboxService.name);
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}

  async boxFindMany(userId: string): Promise<LootboxActiveListPerUser[]> {
    const items = await this.rpc.fetch('lootbox.find.active.1', { playerId: userId });
    return items;
  }

  openBox(boxId: string): boolean {
    this.rpc.sendCommand('lootbox.processing.openBox.1', { boxId });
    return true;
  }
}
