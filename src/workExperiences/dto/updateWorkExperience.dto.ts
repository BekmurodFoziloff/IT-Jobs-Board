import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameWorkExperience.validator';

export class UpdateWorkExperienceDto {
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
