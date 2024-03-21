import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterRequestDto implements Partial<RegisterRequestDto> {
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
