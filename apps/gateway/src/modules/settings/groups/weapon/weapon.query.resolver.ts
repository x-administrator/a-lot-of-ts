import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { WeaponQuery, WeaponSettings } from 'apps/gateway/src/utils/graphql/types/graphql';
import { SettingsStorageReader } from '../../storage/settings.storage-reader';

// @Authorized()
@Resolver(() => WeaponQuery)
export class WeaponQueryResolver {
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  @Query('Weapon')
  async query() {
    return {};
  }

  @ResolveField('getList')
  findMany(@Args('versionBefore') versionBefore: number): WeaponSettings[] {
    const records = this.settingStorageReader.findAll('weaponV2');
    return records;
  }
}
