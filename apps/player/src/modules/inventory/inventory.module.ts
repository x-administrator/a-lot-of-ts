import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryStorage } from './redis_storage/inventory.storage';
import { BackpackModule } from '../backpack/backpack.module';

@Module({
  providers: [InventoryService, InventoryStorage],
  controllers: [InventoryController],
  imports: [BackpackModule],
})
export class InventoryModule {}
