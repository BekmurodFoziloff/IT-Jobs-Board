import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../utils/validators/IsFutureDate.validator';
import { IsEndDateGreatThanStartDate } from '../../utils/validators/IsEndDateGreatThanStartDate.validator';

export class CreateOrderDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    customer: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    customerType: string;

    @IsDateString()
    @IsFutureDate()
    @IsNotEmpty()
    applicationsOpen: Date;

    @IsDateString()
    @IsFutureDate()
    @IsEndDateGreatThanStartDate('applicationsOpen')
    @IsNotEmpty()
    applicationsClose: Date;

    @IsNumber()
    minBudget: number;

    @IsNumber()
    maxBudget: number;

    @IsString()
    @Trim()
    currency: string;

    @IsString()
    @Trim()
    negotiable: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    filingConditions: string;

    @IsArray()
    @IsNotEmpty()
    specializations: Array<string>;
}

export default CreateOrderDto;