import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameCompany.validator';

export class CreateCompanyDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUniqueName()
  name: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  legalForm: string;

  @IsNumber()
  @IsNotEmpty()
  establishedYear: number;

  @IsString()
  @Trim()
  @IsNotEmpty()
  taxPayerId: string;

  @IsArray()
  industries: Array<string>;

  @IsArray()
  @IsNotEmpty()
  specializations: Array<string>;

  @IsString()
  @Trim()
  @IsNotEmpty()
  location: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  geoLocation: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  region: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  aboutCompany: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  logo: string;
}

export default CreateCompanyDto;
