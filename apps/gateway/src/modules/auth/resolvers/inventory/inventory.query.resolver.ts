import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';
import { InventoryQuery } from 'apps/gateway/src/utils/graphql/types/graphql';
import { Authorized } from '../../decorator/authorized.decorator';
import { CurrentUser, CurrentUserPayload } from '../../decorator/current-user.decorator';

@Authorized()
@Resolver(() => InventoryQuery)
export class InventoryQueryResolver {
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}

  @ResolveField()
  async items(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.rpc.fetch('player.inventory.currentOne.1', currentUser.userId);
  }
}
