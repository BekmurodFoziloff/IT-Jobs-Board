import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateJobDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    tasks: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    schedule: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    minAge: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    maxAge: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    additationRequirements: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    workStyle: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    minSalary: number;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    maxSalary: number;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    experience: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    employmentType: string;

}

export default UpdateJobDto;