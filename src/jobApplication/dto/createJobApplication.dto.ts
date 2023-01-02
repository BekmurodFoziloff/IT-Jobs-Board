import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
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
    @IsNotEmpty()
    @Trim()
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