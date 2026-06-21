import { Role, RoleCreate, RoleUpdate } from '../entity';

export const rolesRepositoryToken = 'RolesRepository';

export interface RoleRepository {
  create(role: RoleCreate): Promise<Role>;
  findById(roleId: number): Promise<Role | null>;
  update(role: RoleUpdate): Promise<Role>;
  delete(roleId: number): Promise<void>;
  findByName(roleName: string): Promise<Role | null>;
  getById(roleId: number): Promise<Role>;
  findAll(): Promise<Role[]>;
}
