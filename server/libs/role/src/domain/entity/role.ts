import { Permission } from '../enum';

export interface Role {
  id: number;
  roleName: string;
  createdBy: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
