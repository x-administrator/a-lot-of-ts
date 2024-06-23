import { EventPayload, OnEvent } from '@app/common/rpc';
import { Controller, Inject, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { GraphqlPubSubToken, PubSubInst } from '../../graphql/graphql.pubsub';

@Controller()
export class MatchMakingController {
  logger = new Logger(MatchMakingController.name);

  constructor(@Inject(GraphqlPubSubToken) readonly pubSub: PubSubInst) {}

  @OnEvent('matchMaking.room.created.1')
  async onRoomReady(@Payload() payload: EventPayload<'matchMaking.room.created.1'>) {
    const data = payload.payload;
    this.pubSub.publish2({
      method: 'roomReady',
      userId: data.playerId,
      payload: {
        connectionId: data.connectionId,
        gameServerHost: data.gameServerHost,
        gameServerPort: data.gameServerPort,
        transactionId: data.trId,
      },
    });
  }
}
