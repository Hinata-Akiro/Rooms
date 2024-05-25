import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { Filters } from 'src/common/enum';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueriesService {
  applyPagination<T>(
    qb: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { page, limit } = paginationDto;
    qb.skip((page - 1) * limit).take(limit);
    return qb;
  }

  applyFilters<T>(
    qb: SelectQueryBuilder<T>,
    paginationData: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { filters } = paginationData;
    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      this.addFilterCondition(qb, field, operator, value);
    });
    return qb;
  }

  private addFilterCondition<T>(
    qb: SelectQueryBuilder<T>,
    field: string,
    operator: Filters,
    value: any,
  ): void {
    const condition = this.getConditionString(field, operator);
    const parameters = this.getConditionParameters(field, operator, value);

    qb.andWhere(condition, parameters);
  }

  private getConditionString(field: string, operator: Filters): string {
    switch (operator) {
      case Filters.EQUALS:
        return `${field} = :${field}`;
      case Filters.NOT:
        return `${field} != :${field}`;
      case Filters.GT:
        return `${field} > :${field}`;
      case Filters.GTE:
        return `${field} >= :${field}`;
      case Filters.LT:
        return `${field} < :${field}`;
      case Filters.LTE:
        return `${field} <= :${field}`;
      case Filters.LIKE:
        return `${field} LIKE :${field}`;
      case Filters.IN:
        return `${field} IN (:...${field})`;
      case Filters.NOT_IN:
        return `${field} NOT IN (:...${field})`;
      case Filters.IS_NULL:
        return `${field} IS NULL`;
      case Filters.IS_NOT_NULL:
        return `${field} IS NOT NULL`;
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

  applySorting<T>(
    qb: SelectQueryBuilder<T>,
    paginationData: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { sort } = paginationData;
    sort.forEach((s) => {
      qb.addOrderBy(`${qb.alias}.${s.field}`, s.order);
    });
    return qb;
  }
}
