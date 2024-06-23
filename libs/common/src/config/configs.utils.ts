import { SchemaType } from 'apps/gateway/src/utils/config/config.type';
import * as Joi from 'joi';
import { RedisConnectionOptions } from '../types';
import { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';

export type SchemaTypeConfs = { [n in string]: Joi.Schema };

export class ConfigsUtils {
  protected baseSchemaFields = {
    TRACER_ENABLE: Joi.boolean().default(false),
    TRACER_URL: Joi.string().default(''),
    TRACER_SECRET_KET: Joi.string().default(''),
    NATS_SERVER_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().default(''),
  };

  protected confs: SchemaType<typeof this.schema>;

  protected schema = this.baseSchemaFields;
  static validateAndExtractEnv<EnvT extends SchemaTypeConfs>(envSchema: EnvT) {
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

  get otlpTransporterOptions(): OTLPExporterNodeConfigBase {
    const exporterOptions: OTLPExporterNodeConfigBase = {
      url: this.confs.TRACER_URL,
      headers: {
        Authorization: this.confs.TRACER_SECRET_KET,
      },
    };
    return exporterOptions;
  }
}
