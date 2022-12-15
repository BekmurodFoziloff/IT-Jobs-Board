import { IsEmail, IsString, IsNotEmpty, MinLength, IsAlpha, MaxLength } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { Match } from '../../utils/validators/MatchPasswordConfirmation.validate';

export class RegisterDto {
    @IsString()
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
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @Match('password')
    passwordConfirm: string;
}

export default RegisterDto;