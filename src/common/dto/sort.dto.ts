import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { filterField } from '../enum';

export class SortDto {
  @ApiPropertyOptional()
  @IsEnum(filterField)
  @IsNotEmpty()
  sortField: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
