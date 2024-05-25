import { PageMetaDtoParameters } from '../interface/pagination.interface';

export class PaginationMetaDataDto {
  readonly page: number;
  readonly limit: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;

  constructor(parameters: PageMetaDtoParameters) {
    this.page = parameters.pageOptionsDto.page;
    this.limit = parameters.pageOptionsDto.limit;
    this.itemCount = parameters.itemCount;
    this.pageCount = Math.ceil(
      parameters.itemCount / parameters.pageOptionsDto.limit,
    );
    this.hasNext = this.page < this.pageCount;
    this.hasPrevious = this.page > 1;
  }
}
