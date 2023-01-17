import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUrl } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateUserPortfolioDto {
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
  @IsDateString()
  @Trim()
  completionDate: Date;

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

export default UpdateUserPortfolioDto;
