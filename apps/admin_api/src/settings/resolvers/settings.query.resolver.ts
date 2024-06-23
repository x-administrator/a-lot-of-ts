import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
// import { SettingsQuery, SettingsSyncStateType } from '../../utils/graphql/types/graphql';
import { SettingsQuery, SettingsSyncStateType } from '../../utils/graphql/types/graphql';
import { SettingsService } from '../settings.service';
import { GoogleTable, GoogleTableDataPreSave } from '../settings.types';

@Resolver(() => SettingsQuery)
export class SettingsQuery_Resolver {
  constructor(private readonly settingService: SettingsService) {}

  @Query('Settings')
  async query() {
    return {};
  }

  @ResolveField('getLastModify')
  async getLastModify(): Promise<GoogleTable[]> {
    return await this.settingService.rpc.fetch('settings.google-api.get-last-modify.1', null);
  }

  @ResolveField('getDataPreSaveByFile')
  async getDataPreSaveByFile(@Args('externalId') fileId: string): Promise<GoogleTableDataPreSave[]> {
    return await this.settingService.rpc.fetch('settings.google-api.get-data-pre-save-by-file.1', fileId);
  }

  @ResolveField('getSyncState')
  async getSyncState(): Promise<SettingsSyncStateType> {
    return await this.settingService.rpc.fetch('settings.google-api.get-sync-state.1', null);
  }
}
