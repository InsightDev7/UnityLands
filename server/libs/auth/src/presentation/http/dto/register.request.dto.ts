import { AuthRegisterRequest } from '@app/auth/domain';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class AuthRegisterDtoRequest implements AuthRegisterRequest {
  @IsString()
  @Length(3, 20)
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
