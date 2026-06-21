import { Module } from '@nestjs/common';
import { AuthBasicController } from './controller/auth.controller';
import { AuthCoreModule } from '@app/auth';

@Module({
  imports: [AuthCoreModule],
  controllers: [AuthBasicController],
  exports: [],
})
export class AuthModule {}
