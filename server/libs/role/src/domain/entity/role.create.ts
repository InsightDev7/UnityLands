import { Permission } from '../enum';

export interface RoleCreate {
  roleName: string;
  createdBy: string;
  permissions: Permission[];
  updatedAt: Date;
  createdAt: Date;
}
