import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateCompanyPortfolioDto {
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
  customer: string;

  @IsOptional()
  @IsString()
  @Trim()
  completionDateMonth: string;

  @IsOptional()
  @IsNumber()
  completionDateYear: number;

  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  image: string;

  @IsOptional()
  @IsString()
  @Trim()
  image1: string;

  @IsOptional()
  @IsString()
  @Trim()
  image2: string;
}

export default UpdateCompanyPortfolioDto;
