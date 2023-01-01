import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../utils/validators/IsUniqueNameIndustry.validate';

export class UpdateIndustryDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsUniqueName()
    name: string;
}