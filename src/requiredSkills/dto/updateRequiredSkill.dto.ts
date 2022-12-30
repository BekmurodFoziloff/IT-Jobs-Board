import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../utils/validators/IsUniqueNameRequiredSkill.validate';

export class UpdateRequiredSkillDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsOptional()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsUniqueName()
    name: string;
}