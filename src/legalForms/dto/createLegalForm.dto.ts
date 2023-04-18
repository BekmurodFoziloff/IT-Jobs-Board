import { IsString, IsNotEmpty } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameLegalForm.validator';

export class CreateLegalFormDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUniqueName()
  name: string;
}
