import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { InventoryMutation, InventorySetItemInput } from 'apps/gateway/src/utils/graphql/types/graphql';
import { RPC_PROVIDER, ClientProxyBase } from '@app/common/rpc';
import { Inject } from '@nestjs/common';
import { Authorized } from '../../decorator/authorized.decorator';
import { TrId } from '@app/common/decorators/transaction-id.decorator';

@Authorized()
@Resolver(() => InventoryMutation)
export class InventoryMutationResolver {
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}

  @ResolveField()
  async setItems(@Args('data') data: InventorySetItemInput[], @TrId() trId: string) {
    await this.rpc.sendCommand('player.inventory.setItems.1', data);
    return trId;
  }
}
