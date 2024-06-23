import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { SchemaType } from './config.type';
import { ConfigsUtils } from '@app/common/config/configs.utils';

@Injectable()
export class ConfigService extends ConfigsUtils {
  protected schema = {
    ...this.baseSchemaFields,
    PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRE: Joi.number().required(),
    NATS_SERVER_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().default(''),
    CACHE_RESPONSE_TTL: Joi.number().default(90),
  };

  protected confs: SchemaType<typeof this.schema>;

  constructor() {
    super();
    this.confs = ConfigsUtils.validateAndExtractEnv(this.schema);
  }

  get cacheResponseTTL() {
    return this.confs.CACHE_RESPONSE_TTL;
  }

  get port() {
    return this.confs.PORT;
  }

  get jwtConfig() {
    return {
      secret: this.confs.JWT_SECRET,
      expiresIn: this.confs.JWT_EXPIRE,
    };
  }

  // -----------------------------------------------------------------
  // Communication
  // -----------------------------------------------------------------

  get communicationOptions() {
    return {
      transport: Transport.NATS as number,
      options: {
        servers: [this.confs.NATS_SERVER_URL],
        queue: 'gateway',
      },
    };
  }
}
