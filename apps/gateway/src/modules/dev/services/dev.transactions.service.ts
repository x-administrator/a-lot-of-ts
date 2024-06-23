import { ErrorPayloadFull, ErrorType } from '@app/common/rpc/base/types/errors.types';
import { ItemTransactionType } from '@app/common/utils/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GraphqlPubSubToken } from 'apps/gateway/src/graphql/graphql.pubsub';
import { UpdateBackpackItemPayload } from 'apps/player/src/modules/transaction/transaction.type';
import { PubSub } from 'graphql-subscriptions';
import { MeApiGql_EventNames } from '../../auth/me.pubsub.types';
import { PlayerService } from '../../player/services/player.service';

@Injectable()
export class DevTransactionService {
  private logger = new Logger(DevTransactionService.name);

  constructor(
    private readonly playerService: PlayerService,
    @Inject(GraphqlPubSubToken) readonly pubSub: PubSub,
  ) {}

  pushFakeNotify(trId: string, userId: string, errorChance: number = 0) {
    const chance = Math.random() * 100;
    if (chance > errorChance) {
      this.fakeNotify(trId, userId);
    } else {
      this.fakeError(trId);
    }
  }

  private fakeNotify(trId: string, userId: string) {
    const data: UpdateBackpackItemPayload = {
      logNotification: true,
      transactionId: trId,
      playerId: userId,
      title: 'dev-test',
      items: [
        {
          itemId: 'hard',
          amount: 30,
          type: ItemTransactionType.ADD,
          convertedFrom: null,
        },
        {
          itemId: 'soft',
          amount: 100,
          type: ItemTransactionType.ADD,
          convertedFrom: 'bluster',
        },
      ],
    };
    this.playerService.onTransactionProcess(data);
  }

  private async fakeError(trId: string) {
    const errorData: ErrorPayloadFull = {
      type: ErrorType.TRANSACTION,
      message: 'fake error',
      details: JSON.stringify({
        fake: 'fake',
      }),
      transactionId: trId,
    };
    await this.pubSub.publish(MeApiGql_EventNames.ERROR_NOTIFICATION, { errorNotification: errorData });
  }
}
