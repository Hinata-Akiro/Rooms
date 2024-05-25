import { IsArray } from 'class-validator';
import { PaginationMetaDataDto } from './page-meta.dto';

export class PaginationResultDto<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PaginationMetaDataDto;

  constructor(data: T[], meta: PaginationMetaDataDto) {
    this.data = data;
    this.meta = meta;
  }
}
