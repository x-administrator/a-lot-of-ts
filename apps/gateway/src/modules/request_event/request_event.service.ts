import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, from, of, switchMap } from 'rxjs';
import { BaseCacheService } from '../../../../../libs/common/src/base-cache/base-cache.service';
import { RedisIO } from '../../../../../libs/common/src/redis/redis-io';
import { REDIS_DB } from '../../../../../libs/common/src/redis/redis.constants';
import { ConfigService } from '../../utils/config/config.service';
import { RequestEventPayload, RequestEventStatus, RequestEventType } from './request_event.type';

@Injectable()
export class RequestEventService extends BaseCacheService<RequestEventType> {
  constructor(
    @Inject(REDIS_DB) readonly redis: RedisIO,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {
    super(redis, {
      expireTimeS: configService.cacheResponseTTL,
      prefix: 'request-event',
      onlyUniqueKeys: true,
    });
  }

  async getEventStatus(payload: RequestEventPayload): Promise<RequestEventStatus | null> {
    const key = this.eventKey(payload);
    const event = await this.getOne(key);
    if (!event) {
      return null;
    }
    return event.status;
  }

  subscribeToEvent(payload: RequestEventPayload) {
    const key = this.eventKey(payload);

    return from(this.getOne(key)).pipe(
      switchMap((event: RequestEventType) => {
        if (!event) {
          throw new Error('Event not found');
        }
        if (event.status === RequestEventStatus.DONE) {
          return of(event.res_body);
        }

        return new Observable((obs) => {
          const eventListener = async (event: RequestEventType) => {
            await this.decreaseWaitCount(payload);
            obs.next(event.res_body);
            obs.complete();
          };

          this.increaceWaitCount(payload).then(() => {
            this.eventEmitter.addListener(key, eventListener);
          });

          return () => {
            this.eventEmitter.removeListener(key, eventListener);
          };
        });
      }),
    );
  }

  async createEvent(payload: RequestEventPayload) {
    const key = this.eventKey(payload);
    const eventBody: RequestEventType = {
      userId: payload.userId,
      req_tr_id: payload.transactionId,
      status: RequestEventStatus.RUN,
      res_body: null,
      res_headers: null,
      wait_count: 1,
    };
    await this.create(key, eventBody);
  }

  async fulFillEvent(payload: RequestEventPayload, headers: object | null, body: object | null) {
    const key = this.eventKey(payload);
    let event = await this.getOne(key);

    if (!event) {
      throw new Error('Event not found');
    }

    event = {
      ...event,
      status: RequestEventStatus.DONE,
      wait_count: event.wait_count - 1,
      res_body: body,
      res_headers: headers,
    };

    await this.replaceOne(key, event);
    this.eventEmitter.emit(key, event);
  }

  async increaceWaitCount(payload: RequestEventPayload) {
    const key = this.eventKey(payload);
    const event = await this.getOne(key);
    if (!event) {
      throw new Error('Event not found');
    }
    event.wait_count += 1;
    await this.replaceOne(key, event);
  }

  async decreaseWaitCount(payload: RequestEventPayload) {
    const key = this.eventKey(payload);
    const event = await this.getOne(key);
    if (!event) {
      throw new Error('Event not found');
    }
    event.wait_count -= 1;
    await this.replaceOne(key, event);
  }

  private eventKey(payload: RequestEventPayload) {
    return payload.userId + '.' + payload.transactionId;
  }
}
