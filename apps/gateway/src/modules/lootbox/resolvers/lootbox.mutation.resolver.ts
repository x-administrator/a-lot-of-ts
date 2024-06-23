import { MutationResolver } from '@app/common/decorators/mutation-resolver.decorator';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { LootboxMutation } from 'apps/gateway/src/utils/graphql/types/graphql';
import { Authorized } from '../../auth/decorator/authorized.decorator';
import { LootboxService } from '../lootbox.service';

@Authorized()
@Resolver(() => LootboxMutation)
export class LootboxMutationResolver {
  constructor(private service: LootboxService) {}

  @Mutation()
  async Lootbox() {
    return {};
  }

  @ResolveField()
  @MutationResolver()
  async openBox(@Args('boxId') boxId: string) {
    this.service.openBox(boxId);
  }
}
