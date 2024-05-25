import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { FilterDto } from './filter.dto';
import { SortDto } from './sort.dto';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (minimum value is 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description:
      'Number of items per page (minimum value is 1, maximum value is 50)',
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filters to apply',
    type: [FilterDto],
    example: [{ field: 'name', operator: 'like', value: 'Room' }],
  })
  @IsOptional()
  filters: FilterDto[];

  @ApiPropertyOptional({
    description: 'Sorting criteria',
    type: [SortDto],
    example: [{ field: 'name', order: 'ASC' }],
  })
  @IsOptional()
  sort: SortDto[];

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
