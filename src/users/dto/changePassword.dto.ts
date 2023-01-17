import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsMatch } from '../../validators/IsMatchPasswordConfirmation.validator';

export class ChangePassword {
  @IsString()
  @Trim()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  newPassword: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @IsMatch('newPassword')
  newPasswordConfirm: string;
}

export default ChangePassword;
