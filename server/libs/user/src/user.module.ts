import { DatabaseModule } from '@app/database/database.module';
import { Module } from '@nestjs/common';
import { UserTypeormRepository } from './infrastructure/persistence/typeorm/repository/user.typeorm.repository';
import { userRepositoryToken } from './domain';
import { UserService } from './application/service';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserService,
    {
      provide: userRepositoryToken,
      useClass: UserTypeormRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
