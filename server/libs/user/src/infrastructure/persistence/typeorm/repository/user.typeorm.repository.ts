import { User, UserCreate, UserRepository, UserUpdate } from '@app/user/domain';
import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../entity';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '@app/database';

@Injectable()
export class UserTypeormRepository implements UserRepository {
  private readonly repository: Repository<UserEntity>;
  constructor(@Inject(DATABASE_SOURCE) dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async create(user: UserCreate): Promise<User> {
    return await this.repository.save(user);
  }
  async findById(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }
  async update(user: UserUpdate): Promise<void> {
    await this.repository.update({ id: user.id }, user);
  }
  async delete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }
  async getById(id: string): Promise<void> {
    await this.findById(id);
  }
  async findByUserName(userName: string): Promise<User | null> {
    return await this.repository.findOneBy({ userName });
  }
}
