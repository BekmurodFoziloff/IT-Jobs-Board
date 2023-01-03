import { IsEmail, IsString, IsNotEmpty, MinLength, IsAlpha, MaxLength, Matches, IsLowercase } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsMatch } from '../../utils/validators/IsMatchPasswordConfirmation.validator';

export class RegisterDto {
    @IsString()
    @IsEmail({ unique: true })
    @Trim()
    @IsNotEmpty()
    @IsLowercase()
    @Matches('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
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
    @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
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