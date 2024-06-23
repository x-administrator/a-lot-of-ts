import { ClientProxyBase, RPC_MODULE, RPC_PROVIDER } from '@app/common/rpc';
import { AsyncLocalStorage } from 'async_hooks';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { IRequestContext } from '@app/common/request-context';
import { RedisIO } from '@app/common/redis/redis-io';
import { REDIS_DB } from '@app/common/redis/redis.constants';

export const RpcProvider = {
  provide: RPC_PROVIDER,
  useFactory: async (clientProxy: ClientProxy, als: AsyncLocalStorage<IRequestContext>, redis: RedisIO): Promise<ClientProxyBase> => {
    try {
      const prcClient = new ClientProxyBase(clientProxy, als, new Logger('RPC_PROVIDE'), redis);
      return prcClient;
    } catch (error) {
      throw error;
    }
  },
  inject: [{ token: RPC_MODULE, optional: true }, AsyncLocalStorage<IRequestContext>, REDIS_DB],
};
