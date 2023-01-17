import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateUserAchievementDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @Trim()
  issuedBy: string;

  @IsOptional()
  @IsDateString()
  @Trim()
  issuedDate: Date;

  @IsOptional()
  @IsString()
  @Trim()
  description: string;
}

export default UpdateUserAchievementDto;
