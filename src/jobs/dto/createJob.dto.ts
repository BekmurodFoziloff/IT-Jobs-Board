import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class CreateJobDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    title: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    description: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    tasks: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    schedule: string;

    @IsNumber()
    @IsOptional()
    minAge: number;

    @IsNumber()
    @IsOptional()
    maxAge: number;

    @IsString()
    @Trim()
    @IsOptional()
    additationRequirements: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    workStyle: string;

    @IsNumber()
    @IsOptional()
    minSalary: number;

    @IsNumber()
    @IsOptional()
    maxSalary: number;

    @IsString()
    @Trim()
    @IsNotEmpty()
    experience: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    employmentType: string;

}

export default CreateJobDto;