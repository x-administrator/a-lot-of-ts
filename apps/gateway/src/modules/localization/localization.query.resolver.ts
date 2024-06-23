import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LocalizationQuery } from '../../utils/graphql/types/graphql';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { LocalizationService } from './localization.service';

@Authorized()
@Resolver(() => LocalizationQuery)
export class LocalizationQueryResolver {
  constructor(private service: LocalizationService) {}

  @Query('Localization')
  async query() {
    return {};
  }

  @ResolveField('findMany')
  async findMany() {
    return this.service.findMany();
  }
}
