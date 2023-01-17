import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateBPODto {
  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsBoolean()
  isCompanyBPO: boolean;

  @IsOptional()
  @IsArray()
  specializationsBPO: Array<string>;
}

export default UpdateBPODto;
