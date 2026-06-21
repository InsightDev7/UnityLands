import { Permission, Role } from '@app/role/domain';
import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class RoleEntity implements Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  roleName: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ type: 'jsonb' })
  permissions: Permission[];

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;
}
