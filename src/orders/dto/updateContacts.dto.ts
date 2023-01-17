import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateContactsDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @Trim()
  @IsOptional()
  customerWebsite: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  customerEmail: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  customerAddress: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  customerPhoneNumber: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  customerAddPhoneNumber: string;

  @IsString()
  @Trim()
  @IsOptional()
  contactPerson: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  personEmail: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  personAddress: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  personPhoneNumber: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  personAddPhoneNumber: string;
}

export default UpdateContactsDto;
