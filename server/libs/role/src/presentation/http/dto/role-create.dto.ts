import { Permission } from '@app/role/domain';
import { IsEnum, IsString, Length } from 'class-validator';

export class RoleCreateRequestDto {
  @IsString()
  @Length(2, 30)
  roleName: string;
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
