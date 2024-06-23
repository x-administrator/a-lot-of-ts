import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { SchemaType, SchemaTypeConfs } from './config.type';
import { RedisConnectionOptions } from '@app/common';

@Injectable()
export class ConfigService {
  private schema = {
    NATS_SERVER_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PASSWORD: Joi.string(),
    REDIS_PORT: Joi.number().required(),
  };

  private confs: SchemaType<typeof this.schema>;

  constructor() {
    this.confs = this.validateAndExtractEnv(this.schema);
  }

  get redisOptions(): RedisConnectionOptions {
    let url = `redis://:@${this.confs.REDIS_HOST}:${this.confs.REDIS_PORT}/1`;

    if (process.env.NODE_ENV === 'production') {
      url = `redis://:${this.confs.REDIS_PASSWORD}@${this.confs.REDIS_HOST}:${this.confs.REDIS_PORT}/1`;
    }

    return {
      url,
      host: this.confs.REDIS_HOST,
      port: this.confs.REDIS_PORT,
      passphrase: this.confs.REDIS_PASSWORD,
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
        queue: 'MAIN',
      },
    };
  }

  // ------------------------------------------------------------------

  private validateAndExtractEnv<EnvT extends SchemaTypeConfs>(envSchema: EnvT) {
    const validationSchema = Joi.object(envSchema);
    const { error, value } = validationSchema.validate(process.env, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    const result = {} as SchemaType<EnvT>;

    for (const key in envSchema) {
      result[key as any] = value[key] as any;
    }

    return result;
  }
}
