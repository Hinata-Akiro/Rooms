import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class SortDto {
  @ApiProperty({
    description: 'The field to sort by',
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({
    description: 'The sort order',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
