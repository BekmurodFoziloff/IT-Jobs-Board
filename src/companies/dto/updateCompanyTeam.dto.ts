import { IsString, IsOptional } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class UpdateCompanyTeamDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsString()
  @Trim()
  title: string;

  @IsOptional()
  @IsString()
  @Trim()
  level: string;

  @IsOptional()
  @IsString()
  @Trim()
  experience: string;
}

export default UpdateCompanyTeamDto;
