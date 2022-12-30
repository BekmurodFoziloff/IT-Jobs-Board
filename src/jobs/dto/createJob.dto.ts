import { IsString, IsNumber, IsNotEmpty, IsArray, IsDateString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../utils/validators/IsFutureDate.validate';

export class CreateJobDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    title: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    description: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    tasks: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    schedule: string;

    @IsArray()
    @IsNotEmpty()
    employmentTypes: Array<string>;

    @IsArray()
    @IsNotEmpty()
    workStyles: Array<string>;

    @IsNumber()
     IsArraynSalary: number;

    @IsNumber()
     IsArrayxSalary: number;

    @IsString()
    @Trim()
    @IsNotEmpty()
    currency: string;

    @IsArray()
    @IsNotEmpty()
    specializationCategories: Array<string>;

    @IsDateString()
    @IsFutureDate()
    @IsArray()
    @IsNotEmpty()
    toDate: Date;
}

export default CreateJobDto;