import { IsEmail, IsString, IsNotEmpty, MinLength, IsAlpha, MaxLength } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class CreateUserDto {
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
    @MinLength(8)
    @MaxLength(64)
    @IsNotEmpty()
    password: string;
}

export default CreateUserDto;