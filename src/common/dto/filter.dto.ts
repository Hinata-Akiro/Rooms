import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsObject,
} from 'class-validator';
import { Filters } from '../enum';

export class FilterDto {
  @ApiProperty({
    description: 'The field to filter by',
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiPropertyOptional({
    description: 'The value to filter by',
    example: 'Conference Room A',
  })
  @IsOptional()
  @ValidateIf((obj) => typeof obj.value === 'object')
  @IsObject()
  value: any | Record<string, any>;

  @ApiProperty({
    description: 'The operator to use for filtering',
    enum: Filters,
    example: Filters.EQUALS,
  })
  @IsString()
  @IsEnum(Filters)
  operator: Filters;
}
