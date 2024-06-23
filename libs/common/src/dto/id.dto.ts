import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class IdDTO {
  @Field(() => String)
  id: string;
}
