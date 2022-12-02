import { IsEmail, IsString, IsNotEmpty, MinLength, IsAlpha } from 'class-validator';
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
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export default CreateUserDto;