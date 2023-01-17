import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameCompany.validator';

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
