import { IsString, IsNotEmpty } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../utils/validators/IsUniqueNameRequiredSkill.validate';

export class CreateRequiredSkillDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsUniqueName()
    name: string;
}