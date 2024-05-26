import { Injectable } from '@nestjs/common';
import { FilterDto, PaginationDto, SortDto } from 'src/common/dto';
import { Filters } from '../common/enum';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueriesService {
  public applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { page, limit } = paginationDto;
    queryBuilder.skip((page - 1) * limit).take(limit);
    return queryBuilder;
  }

  public applyFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    filters: FilterDto[],
  ): SelectQueryBuilder<T> {
    filters.forEach((filter) => {
      const { filterField, operator, value } = filter;
      this.addFilterCondition(queryBuilder, filterField, operator, value);
    });
    return queryBuilder;
  }

  public applySorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    sort: SortDto[],
  ): SelectQueryBuilder<T> {
    sort.forEach((s) => {
      queryBuilder.addOrderBy(
        `"${queryBuilder.alias}"."${s.sortField}"`,
        s.order,
      );
    });
    return queryBuilder;
  }

  private addFilterCondition<T>(
    queryBuilder: SelectQueryBuilder<T>,
    field: string,
    operator: Filters,
    value: any,
  ): void {
    const condition = this.getConditionString(field, operator);
    const parameters = this.getConditionParameters(field, operator, value);

    queryBuilder.andWhere(condition, parameters);
  }

  private getConditionString(field: string, operator: Filters): string {
    switch (operator) {
      case Filters.EQUALS:
        return `"${field}" = :${field}`;
      case Filters.NOT:
        return `"${field}" != :${field}`;
      case Filters.GT:
        return `"${field}" > :${field}`;
      case Filters.GTE:
        return `"${field}" >= :${field}`;
      case Filters.LT:
        return `"${field}" < :${field}`;
      case Filters.LTE:
        return `"${field}" <= :${field}`;
      case Filters.LIKE:
        return `"${field}" LIKE :${field}`;
      case Filters.IN:
        return `"${field}" IN (:...${field})`;
      case Filters.NOT_IN:
        return `"${field}" NOT IN (:...${field})`;
      case Filters.IS_NULL:
        return `"${field}" IS NULL`;
      case Filters.IS_NOT_NULL:
        return `"${field}" IS NOT NULL`;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  private getConditionParameters(
    field: string,
    operator: Filters,
    value: any,
  ): Record<string, any> {
    switch (operator) {
      case Filters.LIKE:
        return { [field]: `%${value}%` };
      case Filters.IN:
      case Filters.NOT_IN:
        return { [field]: value };
      case Filters.IS_NULL:
      case Filters.IS_NOT_NULL:
        return {};
      default:
        return { [field]: value };
    }
  }
}
