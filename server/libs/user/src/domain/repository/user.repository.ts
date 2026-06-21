import { User, UserCreate, UserUpdate } from '../entity';

export const userRepositoryToken = 'UserRepository';

export interface UserRepository {
  create(user: UserCreate): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
  update(user: UserUpdate): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<void>;
}
