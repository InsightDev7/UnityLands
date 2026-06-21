import { Permission } from '@app/role/domain';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class RoleUpdateRequestDto {
  roleId: number;
  @IsString()
  @Length(2, 30)
  @IsOptional()
  roleName?: string;

  @IsOptional()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];
}
