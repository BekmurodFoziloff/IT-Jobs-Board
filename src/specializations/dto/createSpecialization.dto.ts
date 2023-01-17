import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameSpecialization.validator';

export class CreateSpecializationDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUniqueName()
  name: string;

  @IsArray()
  @IsNotEmpty()
  specializationCategory: Array<string>;
}
