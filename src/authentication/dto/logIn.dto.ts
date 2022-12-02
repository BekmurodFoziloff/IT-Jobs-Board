import { IsString, IsNotEmpty } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class LogInDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    password: string;
}

export default LogInDto;