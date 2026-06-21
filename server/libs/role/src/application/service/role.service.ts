import { Role, RoleRepository, rolesRepositoryToken } from '@app/role/domain';
import {
  RoleCreateRequestDto,
  RoleUpdateRequestDto,
} from '@app/role/presentation/http';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(
    @Inject(rolesRepositoryToken)
    private readonly roleRepository: RoleRepository,
  ) {}
  async createRole(userId: string, dto: RoleCreateRequestDto): Promise<Role> {
    const role = await this.findRoleByName(dto.roleName);
    if (role) throw new ConflictException('Роль вже існує');
    const now = new Date();
    return await this.roleRepository.create({
      roleName: dto.roleName,
      createdBy: userId,
      permissions: dto.permissions,
      updatedAt: now,
      createdAt: now,
    });
  }

  async findRoleByName(roleName: string): Promise<Role | null> {
    return await this.roleRepository.findByName(roleName);
  }

  async findRoleById(roleId: number): Promise<Role | null> {
    return await this.roleRepository.findById(roleId);
  }

  async deleteRoleById(roleId: number): Promise<void> {
    const role = await this.findRoleById(roleId);
    if (!role) throw new NotFoundException('Роль не знайдено');
    await this.roleRepository.delete(roleId);
  }

  async roleUpdate(userId: string, dto: RoleUpdateRequestDto): Promise<Role> {
    const role = await this.findRoleById(dto.roleId);
    if (!role) throw new NotFoundException('Роль не знайдено');
    const now = new Date();
    Logger.log(
      `User ${userId} updated role ${dto.roleId} at ${now.toISOString()}`,
      'RoleService',
    );
    return await this.roleRepository.update({
      roleId: dto.roleId,
      roleName: dto.roleName,
      permissions: dto.permissions,
      updatedAt: now,
    });
  }

  async findAllRole(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }
}
