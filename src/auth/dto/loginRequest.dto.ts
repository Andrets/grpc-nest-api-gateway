import { IsNotEmpty, IsString } from 'class-validator';
import { LoginRequest } from '../auth.pb';

export class LoginRequestDto implements Partial<LoginRequest> {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
