import { Global, Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsStorageReader } from './storage/settings.storage-reader';
import { SettingsStorageWriter } from './storage/settings.storage-writer';
import { SettingsSubscriptionResolver } from './resolvers/settings.subscription.resolver';
import { SettingsQueryResolver } from './resolvers/settings.query.resolver';
import { WeaponQueryResolver } from './groups/weapon/weapon.query.resolver';

@Global()
@Module({
  providers: [SettingsSubscriptionResolver, SettingsQueryResolver, WeaponQueryResolver, SettingsStorageReader, SettingsStorageWriter],
  controllers: [SettingsController],
  exports: [SettingsStorageReader],
})
export class SettingsModule {}
