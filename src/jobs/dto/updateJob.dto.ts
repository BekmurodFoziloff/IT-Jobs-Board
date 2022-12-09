import { IsString, IsNumber, IsNotEmpty, IsOptional, Max, Min, IsArray, IsEmail, IsUrl, IsDateString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../utils/validators/IsFutureDate.validate';

export class UpdateJobDto {
    @IsString()
    @IsNotEmpty()
    id: string;

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

    @IsArray()
    @IsNotEmpty()
    employmentTypes: Array<string>;

    @IsArray()
    @IsNotEmpty()
    workStyles: Array<string>;

    @IsNumber()
    @IsOptional()
    minSalary: number;

    @IsNumber()
    @IsOptional()
    maxSalary: number;

    @IsArray()
    @IsNotEmpty()
    specializationCategories: Array<string>;

    @IsDateString()
    @IsFutureDate()
    @IsOptional()
    toDate: Date;
}

export default UpdateJobDto;

export class UpdateJobRequirementsDto {
    @IsNumber()
    @IsOptional()
    @Min(16)
    minAge: number;

    @IsNumber()
    @IsOptional()
    @Max(99)
    maxAge: number;

    @IsString()
    @IsNotEmpty()
    workExperience: string;

    @IsString()
    @Trim()
    @IsOptional()
    additationRequirements: string;

    @IsArray()
    @IsOptional()
    requiredSkills: Array<string>;
}

export class UpdateGeneralInformationAboutTheEmployerDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    legalForm: string;

    @IsUrl()
    @IsString()
    @Trim()
    @IsOptional()
    companyWebsite: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    companyContactPerson: string;

    @IsEmail()
    @IsString()
    @Trim()
    @IsNotEmpty()
    companyContactEmail: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    companyContactPhoneNumber: string;

    @IsString()
    @Trim()
    @IsOptional()
    companyContactAddress: string;

    @IsString()
    @Trim()
    @IsOptional()
    comments: string;
}