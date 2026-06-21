import { UserRoles } from '../enum';

export interface UserCreate {
  userName: string;
  email: string;
  passwordHash: string;
  role: UserRoles;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
