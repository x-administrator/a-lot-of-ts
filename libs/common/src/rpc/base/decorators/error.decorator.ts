import { EventPattern } from '@nestjs/microservices';
import { ErrorPrefix } from '../types';
import { ErrorsKeysWithPatternsList } from '../types/errors.types';

export function OnError(commandKey: ErrorsKeysWithPatternsList, extras?: Record<string, any>, userTargetPattern = '*'): MethodDecorator {
  const command = ErrorPrefix + '.' + commandKey + '.' + userTargetPattern;
  return EventPattern(command, extras);
}
