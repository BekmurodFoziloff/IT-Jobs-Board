import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, IsEmail, IsBoolean, IsNumber } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../utils/validators/IsUniqueNameCompany.validator';

export class UpdateCompanyDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsUniqueName()
    name: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    legalForm: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    establishedYear: number;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    taxPayerId: string;

    @IsOptional()
    @IsArray()
    industries: Array<string>;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    specializations: Array<string>;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    location: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    geoLocation: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    region: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    aboutCompany: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    logo: string;
}

export default UpdateCompanyDto;

export class UpdateContactsDto {
    @IsString()
    @IsOptional()
    id: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsUrl()
    website: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsEmail()
    email: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    phone: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    additionalPhone: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsUrl()
    facebook: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsUrl()
    twitter: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsUrl()
    linkedLn: string;
}

export class UpdateBPODto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsBoolean()
    isCompanyBPO: boolean;

    @IsOptional()
    @IsArray()
    specializationsBPO: Array<string>;
}

export class UpdateCompanyPortfolioDto {
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
    customer: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    completionDateMonth: string;
    
    @IsOptional()
    @IsNumber()
    completionDateYear: number;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsUrl()
    link: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    image: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    image1: string;
    
    @IsOptional()
    @IsString()
    @Trim()
    image2: string;
}

export class UpdateCompanyTeamDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    title: string;

    @IsOptional()
    @IsString()
    @Trim()
    level: string;

    @IsOptional()
    @IsString()
    @Trim()
    experience: string;
}