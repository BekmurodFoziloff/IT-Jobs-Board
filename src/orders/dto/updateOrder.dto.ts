import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateOrderDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    customer: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    customerType: string;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    applicationsOpen: Date;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    applicationsClose: Date;

    @IsNumber()
    @IsOptional()
    minBudget: number;

    @IsNumber()
    @IsOptional()
    maxBudget: number;

    @IsString()
    @Trim()
    @IsOptional()
    currency: string;

    @IsString()
    @Trim()
    @IsOptional()
    negotiable: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    filingConditions: string;

    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    specializations: Array<string>;
}

export default UpdateOrderDto;

export class UpdateGeneralInformationAboutTheProjecttDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    title: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    deadline: Date;

    @IsString()
    @Trim()
    @IsOptional()
    comments: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    attachedFile: string;
}

export class UpdateGeneralRequirementsToTheExecutorDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @Trim()
    @IsOptional()
    expectedTransactionType: string;

    @IsString()
    @Trim()
    @IsOptional()
    requirementsToTheExecutor: string;

    @IsString()
    @Trim()
    @IsOptional()
    commentsToTheRequirements: string;
}

export class UpdateContactInformationDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @Trim()
    @IsOptional()
    customerWebsite: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    customerEmail: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    customerAddress: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    customerPhoneNumber: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    customerAddPhoneNumber: string;

    @IsString()
    @Trim()
    @IsOptional()
    contactPerson: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    personEmail: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    personAddress: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    personPhoneNumber: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsOptional()
    personAddPhoneNumber: string;
}