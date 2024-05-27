import { Injectable } from '@nestjs/common';
import { FilterDto, PaginationDto, SortDto } from 'src/common/dto';
import { Filters } from '../common/enum';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueriesService {
  /**
   * Applies pagination to a TypeORM SelectQueryBuilder.
   *
   * @template T - The type of the entities being queried.
   * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to apply pagination to.
   * @param {PaginationDto} paginationDto - The pagination parameters.
   * @returns {SelectQueryBuilder<T>} - The updated query builder with pagination applied.
   *
   * @throws Will throw an error if the paginationDto is missing required properties.
   *
   * @example
   * ```typescript
   * const queryBuilder = connection.getRepository(User).createQueryBuilder('user');
   * const paginationDto = { page: 1, limit: 10 };
   * const paginatedQueryBuilder = queriesService.applyPagination(queryBuilder, paginationDto);
   * ```
   */
  public applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { page, limit } = paginationDto;
    queryBuilder.skip((page - 1) * limit).take(limit);
    return queryBuilder;
  }

  /**
   * Applies filters to a TypeORM SelectQueryBuilder.
   *
   * @template T - The type of the entities being queried.
   * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to apply filters to.
   * @param {FilterDto[]} filters - The filter parameters.
   * @returns {SelectQueryBuilder<T>} - The updated query builder with filters applied.
   *
   * @throws Will throw an error if the filterDto is missing required properties.
   *
   * @example
   * ```typescript
   * const queryBuilder = connection.getRepository(User).createQueryBuilder('user');
   * const filters = [
   *   { field: 'name', operator: Filters.LIKE, value: 'John' },
   *   { field: 'age', operator: Filters.GT, value: 30 },
   * ];
   * const filteredQueryBuilder = queriesService.applyFilters(queryBuilder, filters);
   * ```
   */
  public applyFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    filters: FilterDto[],
  ): SelectQueryBuilder<T> {
    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      this.addFilterCondition(queryBuilder, field, operator, value);
    });
    return queryBuilder;
  }

  /**
   * Applies sorting to a TypeORM SelectQueryBuilder.
   *
   * @template T - The type of the entities being queried.
   * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to apply sorting to.
   * @param {SortDto[]} sort - The sorting parameters.
   * @returns {SelectQueryBuilder<T>} - The updated query builder with sorting applied.
   *
   * @throws Will throw an error if the sortDto is missing required properties.
   *
   * @example
   * ```typescript
   * const queryBuilder = connection.getRepository(User).createQueryBuilder('user');
   * const sort = [
   *   { field: 'name', order: 'ASC' },
   *   { field: 'age', order: 'DESC' },
   * ];
   * const sortedQueryBuilder = queriesService.applySorting(queryBuilder, sort);
   * ```
   */
  public applySorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    sort: SortDto[],
  ): SelectQueryBuilder<T> {
    sort.forEach((s) => {
      queryBuilder.addOrderBy(`"${queryBuilder.alias}"."${s.field}"`, s.order);
    });
    return queryBuilder;
  }

  /**
   * Adds a filter condition to a TypeORM SelectQueryBuilder.
   *
   * @template T - The type of the entities being queried.
   * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to apply the filter condition to.
   * @param {string} field - The field to apply the filter condition on.
   * @param {Filters} operator - The filter operator.
   * @param {any} value - The value to compare against.
   *
   * @throws Will throw an error if the operator is not supported.
   *
   * @example
   * ```typescript
   * const queryBuilder = connection.getRepository(User).createQueryBuilder('user');
   * const field = 'name';
   * const operator = Filters.LIKE;
   * const value = 'John';
   * queriesService.addFilterCondition(queryBuilder, field, operator, value);
   * ```
   */
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

  /**
   * Generates a condition string for a TypeORM SelectQueryBuilder based on the given field and operator.
   *
   * @param {string} field - The field to apply the filter condition on.
   * @param {Filters} operator - The filter operator.
   * @returns {string} - The condition string for the SelectQueryBuilder.
   *
   * @throws Will throw an error if the operator is not supported.
   *
   * @example
   * ```typescript
   * const field = 'name';
   * const operator = Filters.LIKE;
   * const condition = queriesService.getConditionString(field, operator);
   * // condition = `"name" LIKE :name`
   * ```
   */
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

  /**
   * Generates condition parameters for a TypeORM SelectQueryBuilder based on the given field, operator, and value.
   *
   * @param {string} field - The field to apply the filter condition on.
   * @param {Filters} operator - The filter operator.
   * @param {any} value - The value to compare against.
   * @returns {Record<string, any>} - The condition parameters for the SelectQueryBuilder.
   *
   * @throws Will throw an error if the operator is not supported.
   *
   * @example
   * ```typescript
   * const field = 'name';
   * const operator = Filters.LIKE;
   * const value = 'John';
   * const parameters = queriesService.getConditionParameters(field, operator, value);
   * // parameters = { name: '%John%' }
   * ```
   */
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
