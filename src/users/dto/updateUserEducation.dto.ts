import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Trim } from 'class-sanitizer';

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

export default UpdateUserEducationDto;
