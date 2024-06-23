import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HeroQuery } from '../../utils/graphql/types/graphql';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { HeroService } from './hero.service';

@Authorized()
@Resolver(() => HeroQuery)
export class HeroQueryResolver {
  constructor(private service: HeroService) {}

  @Query('Hero')
  async query() {
    return {};
  }

  @ResolveField()
  async findMany() {
    const records = await this.service.findMany();
    return records.map((r) => JSON.stringify(r));
  }

  @ResolveField()
  async findOne(@Args('heroId') heroId: string) {
    const record = await this.service.findOne(heroId);

    if (!record) {
      return null;
    }
    return JSON.stringify(record);
  }
}
