import { IsString, IsNumber, IsNotEmpty, IsOptional, Max, Min, IsArray, IsEmail, IsUrl, IsDateString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../utils/validators/IsFutureDate.validate';

export class UpdateJobDto {
    @IsString()
    @IsOptional()
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
    @IsArray()
    @IsNotEmpty()
    employmentTypes: Array<string>;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    workStyles: Array<string>;

    @IsOptional()
    @IsNumber()
    minSalary: number;

    @IsOptional()
    @IsNumber()
    maxSalary: number;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    currency: string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    specializationCategories: Array<string>;

    @IsOptional()
    @IsDateString()
    @IsFutureDate()
    toDate: Date;
}

export default UpdateJobDto;

export class UpdateJobRequirementsDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsNumber()
    @Min(16)
    minAge: number;

    @IsOptional()
    @IsNumber()
    @Max(99)
    maxAge: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    workExperience: string;

    @IsOptional()
    @IsString()
    @Trim()
    additationRequirements: string;

    @IsOptional()
    @IsArray()
    requiredSkills: Array<string>;
}

export class UpdateGeneralInformationAboutTheEmployerDto {
    @IsString()
    @IsOptional()
    id: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    companyName: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    legalForm: string;

    @IsOptional()
    @IsUrl()
    @IsString()
    @Trim()
    companyWebsite: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    companyContactPerson: string;

    @IsOptional()
    @IsEmail()
    @IsString()
    @Trim()
    @IsNotEmpty()
    companyContactEmail: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    companyContactPhoneNumber: string;

    @IsOptional()
    @IsString()
    @Trim()
    companyContactAddress: string;

    @IsOptional()
    @IsString()
    @Trim()
    comments: string;
}