import { IsOptional, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateRequirementsDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @Trim()
  @IsOptional()
  transactionType: string;

  @IsString()
  @Trim()
  @IsOptional()
  requirementsToTheExecutor: string;

  @IsString()
  @Trim()
  @IsOptional()
  comments: string;
}

export default UpdateRequirementsDto;
