import { AuthLoginRequest } from '@app/auth/domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDtoRequest implements AuthLoginRequest {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
