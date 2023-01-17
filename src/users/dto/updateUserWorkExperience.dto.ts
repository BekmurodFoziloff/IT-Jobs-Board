import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';
import { Trim } from 'class-sanitizer';

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

export default UpdateUserWorkExperienceDto;
