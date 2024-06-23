import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { ConfigsUtils } from '@app/common/config/configs.utils';
import { SchemaType } from './config.type';

@Injectable()
export class ConfigService extends ConfigsUtils {
  protected schema = {
    ...this.baseSchemaFields,
    DATABASE_URL: Joi.string().required(),
  };

  constructor() {
    super();
    this.confs = ConfigsUtils.validateAndExtractEnv(this.schema);
  }

  protected confs: SchemaType<typeof this.schema>;

  get databaseUrl() {
    return this.confs.DATABASE_URL;
  }

  // -----------------------------------------------------------------
  // Communication
  // -----------------------------------------------------------------

  get communicationOptions() {
    return {
      transport: Transport.NATS as number,
      options: {
        servers: [this.confs.NATS_SERVER_URL],
        queue: 'player',
      },
    };
  }
}
