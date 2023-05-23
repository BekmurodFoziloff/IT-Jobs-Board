import { IsEmail, IsString, IsNumber, IsNotEmpty, MinLength, IsAlpha, MaxLength } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class CreateUserDto {
  @IsEmail({ unique: true })
  @Trim()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsAlpha()
  @Trim()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsAlpha()
  @Trim()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @Trim()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  password: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  emailConfirmationToken: string;

  @IsNumber()
  @Trim()
  @IsNotEmpty()
  emailConfirmationTokenExpire: number;
}

export default CreateUserDto;
