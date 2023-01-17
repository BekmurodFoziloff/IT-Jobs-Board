import { IsString, IsNumber, IsNotEmpty, IsOptional, Max, Min, IsArray } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateRequirementsDto {
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
  additionalRequirements: string;

  @IsOptional()
  @IsArray()
  skills: Array<string>;
}

export default UpdateRequirementsDto;
