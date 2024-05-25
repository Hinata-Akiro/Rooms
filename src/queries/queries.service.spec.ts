import { Test, TestingModule } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { QueriesService } from './queries.service';
import { FilterDto, PaginationDto, SortDto } from '../common/dto';
import { Filters } from '../common/enum';

describe('QueriesService', () => {
  let service: QueriesService;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<any>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueriesService],
    }).compile();

    service = module.get<QueriesService>(QueriesService);

    queryBuilder = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      alias: 'alias',
    } as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('applyPagination', () => {
    it('should apply pagination to the query', () => {
      const paginationDto: PaginationDto = { page: 2, limit: 10 };

      service.applyPagination(queryBuilder, paginationDto);

      expect(queryBuilder.skip).toHaveBeenCalledWith(10);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('applyFilters', () => {
    it('should apply filters to the query', () => {
      const filters: FilterDto[] = [
        { field: 'name', operator: Filters.LIKE, value: 'test' },
        { field: 'capacity', operator: Filters.GTE, value: '10' },
      ];

      const addFilterConditionSpy = jest.spyOn<any, any>(
        service,
        'addFilterCondition',
      );

      service.applyFilters(queryBuilder, filters);

      expect(addFilterConditionSpy).toHaveBeenCalledTimes(2);
      expect(addFilterConditionSpy).toHaveBeenCalledWith(
        queryBuilder,
        'name',
        Filters.LIKE,
        'test',
      );
      expect(addFilterConditionSpy).toHaveBeenCalledWith(
        queryBuilder,
        'capacity',
        Filters.GTE,
        '10',
      );
    });
  });

  describe('applySorting', () => {
    it('should apply sorting to the query', () => {
      const sort: SortDto[] = [
        { field: 'name', order: 'ASC' },
        { field: 'capacity', order: 'DESC' },
      ];

      service.applySorting(queryBuilder, sort);

      expect(queryBuilder.addOrderBy).toHaveBeenCalledTimes(2);
      expect(queryBuilder.addOrderBy).toHaveBeenCalledWith(
        '"alias"."name"',
        'ASC',
      );
      expect(queryBuilder.addOrderBy).toHaveBeenCalledWith(
        '"alias"."capacity"',
        'DESC',
      );
    });
  });

  describe('private methods', () => {
    describe('addFilterCondition', () => {
      it('should add filter conditions to the query', () => {
        const field = 'name';
        const operator = Filters.LIKE;
        const value = 'test';

        jest
          .spyOn(service as any, 'getConditionString')
          .mockReturnValue('"name" LIKE :name');
        jest
          .spyOn(service as any, 'getConditionParameters')
          .mockReturnValue({ name: '%test%' });

        (service as any).addFilterCondition(
          queryBuilder,
          field,
          operator,
          value,
        );

        expect(queryBuilder.andWhere).toHaveBeenCalledWith(
          '"name" LIKE :name',
          { name: '%test%' },
        );
      });
    });

    describe('getConditionString', () => {
      it('should return correct condition string for EQUALS operator', () => {
        const field = 'name';
        const operator = Filters.EQUALS;

        const result = (service as any).getConditionString(field, operator);
        expect(result).toBe('"name" = :name');
      });

      it('should return correct condition string for LIKE operator', () => {
        const field = 'name';
        const operator = Filters.LIKE;

        const result = (service as any).getConditionString(field, operator);
        expect(result).toBe('"name" LIKE :name');
      });
    });

    describe('getConditionParameters', () => {
      it('should return correct parameters for LIKE operator', () => {
        const field = 'name';
        const operator = Filters.LIKE;
        const value = 'test';

        const result = (service as any).getConditionParameters(
          field,
          operator,
          value,
        );
        expect(result).toEqual({ name: '%test%' });
      });

      it('should return correct parameters for EQUALS operator', () => {
        const field = 'name';
        const operator = Filters.EQUALS;
        const value = 'test';

        const result = (service as any).getConditionParameters(
          field,
          operator,
          value,
        );
        expect(result).toEqual({ name: 'test' });
      });
    });
  });
});
