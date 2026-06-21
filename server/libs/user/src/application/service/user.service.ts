import {
  User,
  UserRepository,
  userRepositoryToken,
  UserRoles,
} from '@app/user/domain';
import { UserCreateDtoRequest } from '@app/user/presentation';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(userRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}
  async createUser(userDto: UserCreateDtoRequest): Promise<User> {
    const existingByEmail = await this.userRepository.findByEmail(
      userDto.email,
    );
    if (existingByEmail) {
      throw new ConflictException('Email вже зареєстрований');
    }

    const existingByUserName = await this.userRepository.findByUserName(
      userDto.userName,
    );
    if (existingByUserName) {
      throw new ConflictException('Нікнейм вже зайнятий');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userDto.password, saltRounds);
    const now = new Date();
    return await this.userRepository.create({
      userName: userDto.userName,
      email: userDto.email,
      passwordHash: passwordHash,
      role: UserRoles.USER,
      isBanned: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  async getByLogin(userLogin: string): Promise<User> {
    const user = await this.userRepository.findByUserName(userLogin);
    if (!user) throw new NotFoundException();
    return user;
  }

  async validationPassword(
    user: User,
    loginPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(loginPassword, user.passwordHash);
  }

  public async getById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Користувача не знайдено');
    return user;
  }
}
