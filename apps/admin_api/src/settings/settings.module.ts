import { Module } from '@nestjs/common';
import { SettingsMutation_Resolver } from './resolvers/settings.mutation.resolver';
import { SettingsQuery_Resolver } from './resolvers/settings.query.resolver';
import { SettingsSubscription_Resolver } from './resolvers/settings.subscriptions.resolver';
import { SettingsService } from './settings.service';
import { SettingsController } from './controller/settings.controller';

@Module({
  controllers: [SettingsController],
  providers: [SettingsMutation_Resolver, SettingsQuery_Resolver, SettingsSubscription_Resolver, SettingsService],
})
export class SettingsModule {}
