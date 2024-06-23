import { PrismaInitTransaction_Decorator, PrismaTransaction } from '@app/common/prisma/transaction.decorator';
import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { AddItemsPayload, ItemTransactionType, PlayerTransactionItem } from '@app/common/utils/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { UserRegisterDTO } from './models/dto/user-register.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserAuthService {
  private logger = new Logger(UserAuthService.name);
  constructor(
    private userRepository: UserRepository,
    @Inject(RPC_PROVIDER) private rpc: ClientProxyBase,
  ) {}

  @PrismaInitTransaction_Decorator(PrismaService)
  async registerPlayerLocal(payload: UserRegisterDTO, @PrismaTransaction() prisma?: PrismaService) {
    const player = await this.userRepository.createUser(payload.nikName, prisma);
    const secretKey = await this.createSecret(payload.password);
    await this.userRepository.createUserAuthLocal(player.userId, secretKey, prisma);
    await this.userRepository.createBackpack(player.userId, 'Initial', prisma);
    this.rpc.sendEvent('player.auth.registeredSuccessfully.1', { userId: player.userId });
    this.addDefaultItemsPerRegistered(player.userId);
    return payload;
  }

  async loginPlayer(nikName: string, password: string) {
    const player = await this.userRepository.findPlayerByNikName(nikName);
    if (!player) {
      this.logger.log('loginPlayer: player nikName: %s, not found', nikName);
      return null;
    }
    const userAuth = await this.userRepository.findUserAuthLocalByUserId(player.userId);
    if (!userAuth) {
      this.logger.log('loginPlayer: UserAuth for userId: %s, not found', player.userId);
      return null;
    }
    const isPasswordValid = await this.checkSecret(password, userAuth.secretKey);
    if (!isPasswordValid) {
      this.logger.log('loginPlayer: check password for userId: %s, invalid', player.userId);
      return null;
    }
    return player;
  }

  private async checkSecret(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  private async createSecret(password: string) {
    return await hash(password, 12);
  }

  private addDefaultItemsPerRegistered(userId: string) {
    // TODO перенести в конфиг
    const items: PlayerTransactionItem[] = [
      {
        itemId: 'soft',
        amount: 100_000,
        type: ItemTransactionType.ADD,
      },
      {
        itemId: 'hard',
        amount: 100_000,
        type: ItemTransactionType.ADD,
      },
    ];
    const payload: AddItemsPayload = {
      transactionId: randomUUID(),
      items: items,
      logNotification: false,
      playerId: userId,
      title: 'Initial',
    };
    this.rpc.sendCommand('player.transactions.addItems.1', payload);
  }
}
