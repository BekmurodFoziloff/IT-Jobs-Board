import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../validators/IsFutureDate.validator';
import { IsEndDateGreatThanStartDate } from '../../validators/IsEndDateGreatThanStartDate.validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  customer: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  customerType: string;

  @IsDateString()
  @IsNotEmpty()
  @IsFutureDate()
  @IsOptional()
  applicationsOpen: Date;

  @IsDateString()
  @IsNotEmpty()
  @IsFutureDate()
  @IsEndDateGreatThanStartDate('applicationsOpen')
  @IsOptional()
  applicationsClose: Date;

  @IsNumber()
  @IsOptional()
  minBudget: number;

  @IsNumber()
  @IsOptional()
  maxBudget: number;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  currency: string;

  @IsString()
  @Trim()
  @IsOptional()
  negotiable: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  filingConditions: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  specializations: Array<string>;
}

export default UpdateOrderDto;
