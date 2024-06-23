import { HealthIndicator as HealthIndicatorBase, HealthIndicatorResult } from '@nestjs/terminus';

export abstract class HealthIndicator extends HealthIndicatorBase {
  abstract isHealthy(key: string): Promise<HealthIndicatorResult>;
}