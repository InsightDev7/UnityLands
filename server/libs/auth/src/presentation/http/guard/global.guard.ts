import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthService } from '@app/auth/application';
import { Request } from 'express';

@Injectable()
export class AuthGlobalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = (request.cookies?.access_token as string) || null;
    if (!token) {
      throw new UnauthorizedException('Токен доступу відсутній');
    }
    const user = await this.authService.validationAccessToken(token);
    request['user'] = user;
    return true;
  }
}
