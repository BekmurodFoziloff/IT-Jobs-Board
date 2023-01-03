import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../utils/validators/IsUniqueNameSpecialization.validator';

export class UpdateSpecializationDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsUniqueName()
    name: string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    specializationCategory: Array<string>;
}