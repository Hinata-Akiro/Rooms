import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { QueriesService } from '../queries/queries.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rooms } from './entities';
import { Repository } from 'typeorm';
import {
  FilterDto,
  PaginationDto,
  PaginationResultDto,
  SortDto,
} from '../common/dto';
import { ApiResponse } from '../common/response/response';
import { Filters } from '../common/enum';

describe('RoomsService', () => {
  let service: RoomsService;
  let queriesService: QueriesService;
  let roomsRepository: Repository<Rooms>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        QueriesService,
        {
          provide: getRepositoryToken(Rooms),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    queriesService = module.get<QueriesService>(QueriesService);
    roomsRepository = module.get<Repository<Rooms>>(getRepositoryToken(Rooms));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRooms', () => {
    it('should return rooms with pagination metadata', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters: FilterDto[] = [];
      const sortD: SortDto[] = [];
      const rooms: Rooms[] = [
        {
          id: 1,
          name: 'Room A',
          capacity: 10,
          userId: 1,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      ];
      const itemCount = 1;

      jest.spyOn(roomsRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applyFilters').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applySorting').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applyPagination').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);

      const result: ApiResponse<PaginationResultDto<Rooms>> =
        await service.getRooms(paginationDto, filters, sortD);

      expect(result.data.data).toEqual(rooms);
      expect(result.data.meta.itemCount).toEqual(itemCount);
      expect(result.message).toEqual('Rooms retrieved successfully');
      expect(result.statusCode).toEqual(200);
    });

    it('should return an empty result set with appropriate message', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters: FilterDto[] = [];
      const sortD: SortDto[] = [];
      const rooms: Rooms[] = [];
      const itemCount = 0;

      jest.spyOn(roomsRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applyFilters').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applySorting').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applyPagination').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);

      const result: ApiResponse<PaginationResultDto<Rooms>> =
        await service.getRooms(paginationDto, filters, sortD);

      expect(result.data.data).toEqual(rooms);
      expect(result.data.meta.itemCount).toEqual(itemCount);
      expect(result.message).toEqual('No rooms found');
      expect(result.statusCode).toEqual(200);
    });

    it('should handle errors gracefully', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters: FilterDto[] = [];
      const sortD: SortDto[] = [];

      jest
        .spyOn(roomsRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          throw new Error('Something went wrong');
        });

      const result: ApiResponse<PaginationResultDto<Rooms>> =
        await service.getRooms(paginationDto, filters, sortD);

      expect(result.message).toEqual('Something went wrong');
      expect(result.statusCode).toEqual(500);
    });

    it('should return rooms with applied filters and sorting', async () => {
      const paginationDto: PaginationDto = { page: 0, limit: 10 };
      const filters: FilterDto[] = [
        { field: 'userId', value: '1', operator: Filters.EQUALS },
      ];
      const sortD: SortDto[] = [{ field: 'capacity', order: 'DESC' }];
      const rooms: Rooms[] = [
        {
          id: 3,
          name: 'Workshop Room C',
          capacity: 20,
          userId: 1,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
        {
          id: 1,
          name: 'Room A',
          capacity: 10,
          userId: 1,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      ];
      const itemCount = rooms.length;

      jest.spyOn(roomsRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest
        .spyOn(queriesService, 'applyFilters')
        .mockImplementation((query, filters) => {
          expect(filters).toEqual([
            { field: 'userId', value: '1', operator: Filters.EQUALS },
          ]);
          return query;
        });
      jest
        .spyOn(queriesService, 'applySorting')
        .mockImplementation((query, sortD) => {
          expect(sortD).toEqual([{ field: 'capacity', order: 'DESC' }]);
          return query;
        });
      jest.spyOn(queriesService, 'applyPagination').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);

      const result: ApiResponse<PaginationResultDto<Rooms>> =
        await service.getRooms(paginationDto, filters, sortD);

      expect(result.data.data).toEqual(rooms);
      expect(result.data.meta.itemCount).toEqual(itemCount);
      expect(result.message).toEqual('Rooms retrieved successfully');
      expect(result.statusCode).toEqual(200);
    });

    it('should return rooms with applied sorting', async () => {
      const paginationDto: PaginationDto = { page: 0, limit: 10 };
      const filters: FilterDto[] = [];
      const sortD: SortDto[] = [{ field: 'name', order: 'ASC' }];
      const rooms: Rooms[] = [
        {
          id: 3,
          name: 'Workshop Room C',
          capacity: 20,
          userId: 1,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
        {
          id: 2,
          name: 'Meeting Room B',
          capacity: 8,
          userId: 2,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
        {
          id: 1,
          name: 'Room A',
          capacity: 10,
          userId: 1,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      ];
      const itemCount = rooms.length;

      jest.spyOn(roomsRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest.spyOn(queriesService, 'applyFilters').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);
      jest
        .spyOn(queriesService, 'applySorting')
        .mockImplementation((query, sortD) => {
          expect(sortD).toEqual([{ field: 'name', order: 'ASC' }]);
          return query;
        });
      jest.spyOn(queriesService, 'applyPagination').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      } as any);

      const result: ApiResponse<PaginationResultDto<Rooms>> =
        await service.getRooms(paginationDto, filters, sortD);

      expect(result.data.data).toEqual(rooms);
      expect(result.data.meta.itemCount).toEqual(itemCount);
      expect(result.message).toEqual('Rooms retrieved successfully');
      expect(result.statusCode).toEqual(200);
    });
  });
});
