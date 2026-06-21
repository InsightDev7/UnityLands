import { AuthLoginRequest, AuthRegisterRequest } from '@app/auth/domain';
import { User, UserRoles } from '@app/user';
import { UserService } from '@app/user/application/service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface TokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(newUser: AuthRegisterRequest): Promise<AuthResult> {
    const user = await this.userService.createUser(newUser);
    return this.issueTokens(user);
  }

  async loginUser(userLogin: AuthLoginRequest): Promise<AuthResult> {
    const user = await this.userService.getByLogin(userLogin.login);
    const validate = await this.userService.validationPassword(
      user,
      userLogin.password,
    );
    if (!validate) throw new ForbiddenException();
    return this.issueTokens(user);
  }

  async generateNewTokens(oldToken: string): Promise<AuthResult> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        oldToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );
      const user = await this.userService.getById(payload.sub);
      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Недійсний токен оновлення');
    }
  }

  async validationAccessToken(accessToken: string): Promise<User> {
    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch {
      // Expired/invalid token → 401 so the client can refresh and retry.
      throw new UnauthorizedException('Недійсний або прострочений токен доступу');
    }
    return this.userService.getById(payload.sub);
  }

  // Single source of truth — every token's `sub` is the user id.
  private async issueTokens(user: User): Promise<AuthResult> {
    const accessToken = await this.generateAccessToken(
      user.id,
      user.userName,
      user.role,
    );
    const refreshToken = await this.generateRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  }

  private async generateAccessToken(
    userId: string,
    userName: string,
    userRole: UserRoles,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, userName, userRole },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRED'),
      },
    );
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRED'),
      },
    );
  }
}
