import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ItemForSellQuery } from '../../utils/graphql/types/graphql';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { ItemForSellService } from './item_for_sell.service';

@Authorized()
@Resolver(() => ItemForSellQuery)
export class ItemForSellQueryResolver {
  constructor(private service: ItemForSellService) {}

  @Query()
  async ItemForSell() {
    return {};
  }

  @ResolveField()
  async findMany() {
    return this.service.findMany();
  }

  @ResolveField()
  async findOne(@Args('itemId') itemId: string) {
    return this.service.findOne(itemId);
  }

  @ResolveField()
  async currenciesFindMany() {
    return this.service.currenciesFindMany();
  }
}
