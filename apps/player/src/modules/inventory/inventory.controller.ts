import { CommandPayload, FetchFlatArgs, FetchFlatReturning, OnCommand, OnFetch } from '@app/common/rpc';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(readonly service: InventoryService) {}

  @OnFetch('player.inventory.currentOne.1')
  currentInventory(
    @Payload() playerId: FetchFlatArgs['player.inventory.currentOne.1'],
  ): Promise<FetchFlatReturning['player.inventory.currentOne.1']> {
    return this.service.getPlayerInventory(playerId);
  }

  @OnFetch('player.inventory.checkCollection.1')
  checkCollection(
    @Payload() playerId: FetchFlatArgs['player.inventory.checkCollection.1'],
  ): Promise<FetchFlatReturning['player.inventory.checkCollection.1']> {
    return this.service.checkCompleteInventory(playerId);
  }

  @OnCommand('player.inventory.setItems.1')
  async setItems(@Payload() payload: CommandPayload<'player.inventory.setItems.1'>) {
    const playerId = payload.userId;
    const trId = payload.trId;
    if (!playerId || !trId) {
      return null;
    }
    await this.service.setInventoryItem(playerId, trId, payload.payload);

    return true;
  }
}
