import { Permission } from '../enum';

export interface RoleUpdate {
  roleId: number;
  roleName?: string;
  permissions?: Permission[];
  updatedAt?: Date;
}
