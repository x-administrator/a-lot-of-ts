import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { SettingsMutation } from '../../utils/graphql/types/graphql';
import { SettingsService } from '../settings.service';

@Resolver(() => SettingsMutation)
export class SettingsMutation_Resolver {
  constructor(private readonly settingService: SettingsService) {}

  @Mutation('Settings')
  async mutation() {
    return {};
  }

  @ResolveField('updateFiles')
  async updateFiles(): Promise<boolean> {
    await this.settingService.rpc.fetch('settings.google-api.update-files.1', null);
    return true;
  }

  @ResolveField('savePreSavedData')
  async savePreSaveData(@Args('data') ids: string[]): Promise<boolean> {
    await this.settingService.rpc.fetch('settings.google-api.save-pre-save-data.1', ids);
    return true;
  }

  @ResolveField('deleteSavedData')
  async deleteSavedData(@Args('data') ids: string): Promise<boolean> {
    await this.settingService.rpc.fetch('settings.google-api.delete-saved-data.1', ids);
    return true;
  }
}
