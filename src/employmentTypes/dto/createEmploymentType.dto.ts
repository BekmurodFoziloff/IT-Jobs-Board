import { IsString, IsNotEmpty } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameEmploymentType.validator';

export class CreateEmploymentTypeDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUniqueName()
  name: string;
}
