import { ResolveField, Resolver, Root } from '@nestjs/graphql';
import { BackpackItem } from 'apps/gateway/src/utils/graphql/types/graphql';

@Resolver(() => BackpackItem)
export class BackpackItemResolver {
  @ResolveField('data')
  data(@Root() backpackItem: BackpackItem) {
    return backpackItem?.data ? JSON.stringify(backpackItem.data) : null;
  }
}
