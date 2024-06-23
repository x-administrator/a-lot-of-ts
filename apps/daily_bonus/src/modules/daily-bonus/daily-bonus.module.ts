import { Module } from '@nestjs/common';
import { DailyItemsService } from './services/daily-bonus.service';
import { DailyItemsController } from './daily-bonus.controller';
import { DailyItemsRepository } from './daily-bonus.repository';
import { SettingsModule } from '../settings/settings.module';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { AlgorithmsIssue } from './services/algorithms-issue.service';

@Module({
  imports: [SettingsModule],
  controllers: [DailyItemsController],
  providers: [DailyItemsService, DailyItemsRepository, PrismaService, AlgorithmsIssue],
})
export class DailyItemsModule {}
