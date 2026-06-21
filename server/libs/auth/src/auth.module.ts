import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './application/service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGlobalGuard } from './presentation';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRED') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGlobalGuard }],
  exports: [AuthService],
})
export class AuthCoreModule {}
