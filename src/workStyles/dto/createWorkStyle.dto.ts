import { IsString, IsNotEmpty } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsUniqueName } from '../../validators/IsUniqueNameWorkStyle.validator';

export class CreateWorkStyleDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUniqueName()
  name: string;
}
