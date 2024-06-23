import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { WeaponQuery } from '../../utils/graphql/types/graphql';
import { WeaponService } from './weapon.service';

// @Authorized()
@Resolver(() => WeaponQuery)
export class WeaponQueryResolver {
  constructor(private service: WeaponService) {}

  @Query('Weapon')
  async query() {
    return {};
  }

  @ResolveField()
  async findMany() {
    const records = await this.service.findMany();
    return records.map((r) => JSON.stringify(r));
  }

  @ResolveField()
  async findOne(@Args('weaponId') weaponId: string) {
    const record = await this.service.findOne(weaponId);
    if (!record) {
      return null;
    }
    return JSON.stringify(record);
  }
}
