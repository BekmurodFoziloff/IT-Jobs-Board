import { IsString, IsOptional, IsUrl, IsEmail } from 'class-validator';
import { Trim } from 'class-sanitizer';

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

export default UpdateContactsDto;
