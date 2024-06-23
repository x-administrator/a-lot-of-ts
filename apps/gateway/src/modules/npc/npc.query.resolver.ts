import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NpcQuery } from '../../utils/graphql/types/graphql';
import { NpcService } from './npc.service';

// @Authorized()
@Resolver(() => NpcQuery)
export class NpcQueryResolver {
  constructor(private service: NpcService) {}

  @Query('Npc')
  async query() {
    return {};
  }

  @ResolveField('findMany')
  async findMany() {
    const records = await this.service.findMany();
    return records.map((r) => JSON.stringify(r));
  }

  @ResolveField('findOne')
  async findOne(@Args('npcId') npcId: string) {
    const record = await this.service.findOne(npcId);
    if (!record) {
      return null;
    }
    return JSON.stringify(record);
  }
}
