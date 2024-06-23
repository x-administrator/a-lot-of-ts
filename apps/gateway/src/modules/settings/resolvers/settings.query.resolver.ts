import { Query, Resolver } from '@nestjs/graphql';
import { SettingsQuery } from 'apps/gateway/src/utils/graphql/types/graphql';
import { SettingsStorageReader } from '../storage/settings.storage-reader';

@Resolver(() => SettingsQuery)
export class SettingsQueryResolver {
  constructor(readonly settingStorageReader: SettingsStorageReader) {}

  @Query('Settings')
  async query() {
    return {
      Weapon: {},
    };
  }
}
