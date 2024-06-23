import { MessagePattern } from '@nestjs/microservices';
import { FetchPrefix } from '../types';
import { FetchKeysList } from '../types/fetch.types';

export function OnFetch(commandKey: FetchKeysList, userTargetPattern = '*'): MethodDecorator {
  const command = FetchPrefix + '.' + commandKey + '.' + userTargetPattern;
  return MessagePattern(command);
}
