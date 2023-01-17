import { IsString, IsNotEmpty, IsArray, IsDateString, IsOptional, IsAlpha } from 'class-validator';
import { Trim } from 'class-sanitizer';

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
  skills: Array<object>;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  specializationCategories: Array<object>;
}

export default UpdateProfileDto;
