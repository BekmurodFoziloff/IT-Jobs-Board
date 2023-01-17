import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameSpecializationBPO.validator';

export class UpdateSpecializationBPODto {
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
