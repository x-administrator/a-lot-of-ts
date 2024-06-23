import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { BaseUtils } from '@app/common/utils/base.utils';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { SettingsStorageReader } from '../settings/settings.storage-reader';
import { BackpackFindDTO } from './dto/backpack-find.dto';
import { BackpackPublicInfo } from './dto/backpack-find.response';
import { Prisma } from '../../utils/prisma/types';

@Injectable()
export class BackpackRepository {
  constructor(
    private prisma: PrismaService,
    readonly settingStorageReader: SettingsStorageReader,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {}

  findOneIFS(itemId: string) {
    return this.settingStorageReader.findIFSById(itemId);
  }

  async findOwnItemsByIds(userId: string, itemIds: string[]) {
    const where: Prisma.BackpackItemWhereInput = {
      backpack: {
        userId,
      },
      itemId: {
        in: itemIds,
      },
    };
    const record = await this.prisma.backpackItem.findMany({ where });
    return record;
  }

  async findOneBackpackUserId(backpackId: string) {
    await BaseUtils.wait(1000);
    const record = await this.prisma.backpack.findFirst({
      where: {
        backpackId,
      },
      select: {
        userId: true,
      },
    });

    if (!record) {
      return null;
    }

    return record?.userId;
  }

  async findOneBackpack(payload: Partial<BackpackFindDTO>): Promise<BackpackPublicInfo | null> {
    if (Object.keys(payload).length === 0) {
      return null;
    }

    const record = await this.prisma.backpack.findUnique({
      where: {
        userId: payload.userId,
      },
      include: {
        items: {
          select: {
            backpackId: true,
            itemId: true,
            amount: true,
            data: true,
          },
        },
      },
    });

    if (!record) {
      return null;
    }

    return {
      ...record,
      items: record.items.map((item) => ({
        ...item,
        i18n: this.settingStorageReader.findIFSById(item.itemId)?.i18n,
      })),
    };
  }

  async findManyBackpackItems(backpackId: string) {
    return this.prisma.backpackItem.findMany({
      where: {
        backpackId,
      },
      select: {
        backpackId: true,
        itemId: true,
        amount: true,
        data: true,
      },
    });
  }

  async findOneBackpackItem(itemId: string, userId: string) {
    return this.prisma.backpackItem.findFirst({
      where: {
        itemId,
        backpack: {
          userId,
        },
      },
      select: {
        backpackId: true,
        backpackItemId: true,
        amount: true,
      },
    });
  }

  async findBackpackByUserId(userId: string) {
    return this.prisma.backpack.findFirst({
      where: {
        userId,
      },
    });
  }

  async updateBackpackItemAmount(backpackItemId: string, newAmount: number) {
    if (newAmount === 0) {
      await this.prisma.backpackItem.delete({
        where: {
          backpackItemId: backpackItemId,
        },
      });
      return;
    }
    await this.prisma.backpackItem.update({
      where: {
        backpackItemId: backpackItemId,
      },
      data: {
        amount: newAmount,
      },
    });
  }

  async createBackpackItem(amount: number, itemId: string, backpackId: string) {
    return this.prisma.backpackItem.create({
      data: {
        amount: amount,
        itemId: itemId,
        backpackId: backpackId,
      },
    });
  }

  async deleteItem(itemId: string, backpackId: string) {
    const result: number = await this.prisma.$executeRaw`
      DELETE FROM backpack_item
      WHERE backpack_id = ${backpackId} AND item_id = ${itemId}
    `;
    return result > 0;
  }
}
