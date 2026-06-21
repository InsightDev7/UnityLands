import { Role, RoleCreate, RoleRepository, RoleUpdate } from '@app/role/domain';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoleEntity } from '../entity/role.entity';
import { DATABASE_SOURCE } from '@app/database';

@Injectable()
export class RoleTypeormRepository implements RoleRepository {
  private readonly repository: Repository<RoleEntity>;
  constructor(@Inject(DATABASE_SOURCE) dataSource: DataSource) {
    this.repository = dataSource.getRepository(RoleEntity);
  }
  async create(role: RoleCreate): Promise<Role> {
    return await this.repository.save({
      roleName: role.roleName,
      createdBy: role.createdBy,
      permissions: role.permissions,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }
  async findById(roleId: number): Promise<Role | null> {
    return await this.repository.findOneBy({ id: roleId });
  }
  async update(role: RoleUpdate): Promise<Role> {
    await this.repository.update(
      { id: role.roleId },
      { roleName: role.roleName, permissions: role.permissions },
    );
    return await this.getById(role.roleId);
  }
  async delete(roleId: number): Promise<void> {
    await this.repository.softDelete({ id: roleId });
  }
  async findByName(roleName: string): Promise<Role | null> {
    return await this.repository.findOneBy({ roleName: roleName });
  }
  async getById(roleId: number): Promise<Role> {
    const role = await this.repository.findOneBy({ id: roleId });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findAll(): Promise<Role[]> {
    return await this.repository.find();
  }
}
