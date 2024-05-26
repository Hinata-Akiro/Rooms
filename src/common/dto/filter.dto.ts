import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { filterField, Filters } from '../enum';

export class FilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(filterField)
  @IsNotEmpty()
  filterField: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Filters)
  @IsNotEmpty()
  operator: Filters;
}
