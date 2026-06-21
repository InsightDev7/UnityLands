import { AuthService } from '@app/auth/application/service';
import {
  AuthLoginDtoRequest,
  AuthRegisterDtoRequest,
  Public,
} from '@app/auth/presentation';
import { User } from '@app/user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthBasicController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(200)
  @Public()
  @Post('login')
  async loginUser(
    @Body() login: AuthLoginDtoRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(login);
    this.setAuthCookies(res, accessToken, refreshToken);
  }

  @HttpCode(201)
  @Public()
  @Post('register')
  async registerUser(
    @Body() register: AuthRegisterDtoRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.authService.registerUser(register);
    this.setAuthCookies(res, accessToken, refreshToken);
  }

  @HttpCode(200)
  @Public()
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = req.cookies?.refresh_token as string;
    if (!token) throw new UnauthorizedException('Токен оновлення відсутній');
    const { accessToken, refreshToken } =
      await this.authService.generateNewTokens(token);
    this.setAuthCookies(res, accessToken, refreshToken);
  }

  @Get('me')
  getMe(@Req() req: Request): User {
    return req['user'] as User;
  }

  @HttpCode(200)
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: this.refreshCookiePath });
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.secureCookies,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.secureCookies,
      path: this.refreshCookiePath,
    });
  }

  private get secureCookies(): boolean {
    return this.configService.get<string>('AUTH_COOKIE_SECURE') === 'true';
  }

  private get refreshCookiePath(): string {
    return (
      this.configService.get<string>('AUTH_REFRESH_COOKIE_PATH') ??
      '/auth/refresh'
    );
  }
}
