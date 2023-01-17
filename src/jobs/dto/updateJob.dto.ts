import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../validators/IsFutureDate.validator';

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
