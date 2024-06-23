import { EventPattern } from '@nestjs/microservices';
import { EventsKeysWithPatternsList } from '../types/events.types';
import { EventPrefix } from '../types';

export function OnEvent(commandKey: EventsKeysWithPatternsList, extras?: Record<string, any>, userTargetPattern = '*'): MethodDecorator {
  const command = EventPrefix + '.' + commandKey + '.' + userTargetPattern;
  return EventPattern(command, extras);
}
