import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameLegalForm.validator';

export class UpdateLegalFormDto {
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
