import { UserRoles } from '../enum/user-roles.enum';

export interface User {
  id: string;
  userName: string;
  email: string;
  role: UserRoles;
  passwordHash: string;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
