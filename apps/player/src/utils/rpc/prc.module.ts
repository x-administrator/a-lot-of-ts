import { RPC_MODULE, RPC_PROVIDER } from '@app/common/rpc';
import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '../../modules/config/config.service';

import { RpcProvider } from './rpc.provider';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RPC_MODULE,
        imports: [],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => configService.communicationOptions,
      },
    ]),
  ],
  providers: [RpcProvider],
  exports: [RpcProvider, RPC_PROVIDER],
})
export class RPCModule {}
