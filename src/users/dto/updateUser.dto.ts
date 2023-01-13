import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsDateString,
    IsOptional,
    IsUrl,
    IsEmail,
    IsNumber,
    IsAlpha,
    MinLength,
    MaxLength,
    Matches
} from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsMatch } from '../../utils/validators/IsMatchPasswordConfirmation.validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @Trim()
    avatar: string;

    @IsOptional()
    @IsString()
    @IsAlpha()
    @Trim()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsString()
    @IsAlpha()
    @Trim()
    middleName: string;

    @IsOptional()
    @IsString()
    @IsAlpha()
    @Trim()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    gender: string;

    @IsOptional()
    @IsDateString()
    @Trim()
    @IsNotEmpty()
    birthDate: Date;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    position: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    region: string;

    @IsOptional()
    @IsString()
    @Trim()
    aboutMe: string;

    @IsOptional()
    @IsArray()
    skills: Array<string>;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    specializationCategories: Array<string>;
}

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

export class UpdateUserWorkExperienceDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    employmentTypes: Array<string>;

    @IsOptional()
    @IsString()
    @Trim()
    company: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    startDateMonth: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    startDateYear: number;

    @IsString()
    @Trim()
    endDateMonth: string;

    @IsOptional()
    @IsNumber()
    endDateYear: number;
}

export class UpdateUserEducationDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    school: string;

    @IsOptional()
    @IsString()
    @Trim()
    dagree: string;

    @IsOptional()
    @IsString()
    @Trim()
    fieldOfStudy: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    startDateMonth: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    startDateYear: number;

    @IsString()
    @Trim()
    endDateMonth: string;

    @IsOptional()
    @IsNumber()
    endDateYear: number;

    @IsOptional()
    @IsString()
    @Trim()
    comments: string;
}

export class UpdateUserAchievementDto {
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
    issuedBy: string;

    @IsOptional()
    @IsDateString()
    @Trim()
    issuedDate: Date;

    @IsOptional()
    @IsString()
    @Trim()
    description: string;
}

export class UpdateUserPortfolioDto {
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
    @IsDateString()
    @Trim()
    completionDate: Date;

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

export class ChangePassword {
    @IsString()
    @Trim()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
    newPassword: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @IsMatch('newPassword')
    newPasswordConfirm: string;
}
export class ResetPassword {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
    newPassword: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @IsMatch('newPassword')
    newPasswordConfirm: string;
}