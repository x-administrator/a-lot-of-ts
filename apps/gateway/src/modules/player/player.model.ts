import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlayerModel {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  nikName: string;
}
