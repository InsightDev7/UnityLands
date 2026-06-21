import { UserRoles } from '../enum';

export interface UserUpdate {
  id: string;
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: UserRoles;
  isBanned?: boolean;
}
