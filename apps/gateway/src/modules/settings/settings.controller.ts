import { AppContextInterceptor } from '@app/common/als/app-context.interceptor';
import { OnEvent } from '@app/common/rpc';
import { RpcKey } from '@app/common/rpc/base/decorators/rpc-key.decorator';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlPubSubToken } from '../../graphql/graphql.pubsub';
import { SettingsApiGql_EventNames } from './settings.pubsub.types';
import { SourceType } from './storage/settings.storage-state';
import { SettingsStorageWriter } from './storage/settings.storage-writer';

@UseInterceptors(AppContextInterceptor)
@Controller()
export class SettingsController {
  constructor(
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
    private readonly settingsStorageWriter: SettingsStorageWriter,
  ) {}

  @OnEvent('settings.common.started.1', { queue: 'gateway' })
  async onSettingsStarted() {
    this.settingsStorageWriter.settingsStarted();
  }

  @OnEvent('settings.*.updated.1', { queue: 'gateway' })
  async onSettingsUpdated(@RpcKey('domain') sourceName: SourceType) {
    const payload = { dataSourceUpdated: { sourceName } };
    await this.pubSub.publish(SettingsApiGql_EventNames.STATE_UPDATE, payload);
    this.settingsStorageWriter.settingsUpdated(sourceName);
    return true;
  }
}
