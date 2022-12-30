import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class LogInDto {
    @IsString()
    @IsEmail({ unique: true })
    @Trim()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password: string;
}

export default LogInDto;