import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class CreateJobApplicationDto {
    @IsString()
    @IsNotEmpty()
    @Trim()
    fullName: string
    
    @IsString()
    @IsNotEmpty()
    @Trim()
    phoneNumber: string
    
    @IsDateString()
    @IsNotEmpty()
    birthDate: Date
    
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    resume: string
    
    @IsString()
    @IsNotEmpty()
    @Trim()
    experience: string
    
    @IsString()
    @IsNotEmpty()
    @Trim()
    gender: string;
}

export default CreateJobApplicationDto;