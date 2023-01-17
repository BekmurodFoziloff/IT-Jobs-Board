import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { IsFutureDate } from '../../validators/IsFutureDate.validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsFutureDate()
  @IsOptional()
  deadline: Date;

  @IsString()
  @Trim()
  @IsOptional()
  comments: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsOptional()
  attachedFile: string;
}

export default UpdateProjectDto;
