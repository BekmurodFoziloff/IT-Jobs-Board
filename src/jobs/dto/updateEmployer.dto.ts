import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateEmployerDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  companyName: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  legalForm: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  @Trim()
  companyWebsite: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  companyContactPerson: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  @Trim()
  @IsNotEmpty()
  companyContactEmail: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  companyContactPhoneNumber: string;

  @IsOptional()
  @IsString()
  @Trim()
  companyContactAddress: string;

  @IsOptional()
  @IsString()
  @Trim()
  comments: string;
}

export default UpdateEmployerDto;
