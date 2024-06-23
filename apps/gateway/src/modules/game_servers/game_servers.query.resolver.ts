import { Query, Resolver } from '@nestjs/graphql';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { GameServersService } from './game_servers.service';
import { GameServer } from '../../utils/graphql/types/graphql';

@Authorized()
@Resolver()
export class GameServerQueryResolver {
  constructor(private readonly serversService: GameServersService) {}

  @Query()
  async getGameServers(): Promise<GameServer[]> {
    return await this.serversService.getGameServers();
  }
}
