import { ConfigsUtils } from '@app/common/config/configs.utils';
import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { SchemaType } from './config.type';

@Injectable()
export class ConfigService extends ConfigsUtils {
  protected schema = {
    ...this.baseSchemaFields,
    PORT: Joi.number().required(),
    SERVER_PUBLIC_URL: Joi.string().required(),
    SETTINGS_SERVICE_GQL_URL: Joi.string().required(),
    SETTINGS_SERVICE_SERVER_URL: Joi.string().required(),
  };

  protected confs: SchemaType<typeof this.schema>;

  constructor() {
    super();
    this.confs = ConfigsUtils.validateAndExtractEnv(this.schema);
  }

  get port() {
    return this.confs.PORT;
  }

  get serverPublicUrl() {
    return this.confs.SERVER_PUBLIC_URL;
  }

  get settingsServiceServerUrl() {
    return this.confs.SETTINGS_SERVICE_SERVER_URL;
  }

  get settingsServiceGqlUrl() {
    return this.confs.SETTINGS_SERVICE_GQL_URL;
  }

  get communicationOptions() {
    return {
      transport: Transport.NATS as number,
      options: {
        servers: [this.confs.NATS_SERVER_URL],
        queue: 'MAIN',
      },
    };
  }
}
