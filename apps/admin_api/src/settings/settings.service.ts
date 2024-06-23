import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SettingsService {
  logger = new Logger(SettingsService.name);
  constructor(@Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase) {}
}
