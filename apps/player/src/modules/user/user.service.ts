import { PrismaInitTransaction_Decorator, PrismaTransaction } from '@app/common/prisma/transaction.decorator';
import { ClientProxyBase, RPC_PROVIDER } from '@app/common/rpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { UserFindOneDTO } from './models/dto/user-find-one.dto';
import { UserRegisterDTO } from './models/dto/user-register.dto';
import { UserRepository } from './user.repository';
import { PlayerStateUpdatedResponse } from './user.types';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
    @Inject('MAIN') readonly clientProxy: ClientProxy,
    @Inject(RPC_PROVIDER) readonly rpc: ClientProxyBase,
  ) {}

  async findOne(payload: Partial<UserFindOneDTO>) {
    if (Object.keys(payload).length === 0) {
      return null;
    }
    return this.prisma.user.findUnique({
      where: {
        userId: payload.playerId,
        nikName: payload.nikName,
      },
    });
  }

  @PrismaInitTransaction_Decorator(PrismaService)
  async create(payload: UserRegisterDTO, @PrismaTransaction() prisma?: PrismaService) {
    const player = await this.userRepository.createUser(payload.nikName, prisma);
    const secretKey = payload.password;
    await this.userRepository.createUserAuthLocal(player.userId, secretKey, prisma);
    await this.userRepository.createBackpack(player.userId, 'Initial');
    return payload;
  }

  async shareStateUpdated(payload: PlayerStateUpdatedResponse) {}
}
