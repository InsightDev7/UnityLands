import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { RoleService } from './application/service';
import { rolesRepositoryToken } from './domain';
import { RoleTypeormRepository } from './infrastructure';

@Module({
  imports: [DatabaseModule],
  providers: [
    RoleService,
    {
      provide: rolesRepositoryToken,
      useClass: RoleTypeormRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
