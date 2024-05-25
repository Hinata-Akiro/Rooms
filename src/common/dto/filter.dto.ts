import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Filters } from '../enum';

export class FilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(Filters)
  operator: Filters;
}
