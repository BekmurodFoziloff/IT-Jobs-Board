import { IsEmail, IsString, IsNotEmpty, MinLength, IsAlpha, MaxLength } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsMatch } from '../../utils/validators/IsMatchPasswordConfirmation.validator';

export class RegisterDto {
    @IsString()
    @IsEmail({ unique: true })
    @Trim()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsAlpha()
    @Trim()
    firstName: string;

    @IsString()
    @IsAlpha()
    @Trim()
    lastName: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @IsMatch('password')
    passwordConfirm: string;
}

export default RegisterDto;