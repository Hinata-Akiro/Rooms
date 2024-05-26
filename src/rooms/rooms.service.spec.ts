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
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const itemCount = 1;

      const createQueryBuilderMock = {
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
      };

      jest
        .spyOn(roomsRepository, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilderMock as any);

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

      const createQueryBuilderMock = {
        getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
      };

      jest
        .spyOn(roomsRepository, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilderMock as any);

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
  });
  it('should apply pagination logic correctly', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const filters: FilterDto[] = [];
    const sortD: SortDto[] = [];
    const rooms: Rooms[] = [
      {
        id: 1,
        name: 'Room A',
        capacity: 10,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    const itemCount = 1;

    const createQueryBuilderMock = {
      getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(roomsRepository, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilderMock as any);

    jest
      .spyOn(queriesService, 'applyPagination')
      .mockReturnValue(createQueryBuilderMock as any);

    const result: ApiResponse<PaginationResultDto<Rooms>> =
      await service.getRooms(paginationDto, filters, sortD);

    expect(result.data.data).toEqual(rooms);
    expect(result.data.meta.itemCount).toEqual(itemCount);
    expect(result.message).toEqual('Rooms retrieved successfully');
    expect(result.statusCode).toEqual(200);
    expect(queriesService.applyPagination).toHaveBeenCalledWith(
      createQueryBuilderMock,
      paginationDto,
    );
  });
  it('should apply filters and sorting correctly together', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const filters: FilterDto[] = [
      { filterField: 'name', operator: Filters.EQUALS, value: 'Room A' },
    ];
    const sortD: SortDto[] = [{ sortField: 'name', order: 'ASC' }];
    const rooms: Rooms[] = [
      {
        id: 1,
        name: 'Room A',
        capacity: 10,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    const itemCount = 1;

    const createQueryBuilderMock = {
      getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(roomsRepository, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilderMock as any);

    jest
      .spyOn(queriesService, 'applyFilters')
      .mockReturnValue(createQueryBuilderMock as any);

    jest
      .spyOn(queriesService, 'applySorting')
      .mockReturnValue(createQueryBuilderMock as any);

    const result: ApiResponse<PaginationResultDto<Rooms>> =
      await service.getRooms(paginationDto, filters, sortD);

    expect(result.data.data).toEqual(rooms);
    expect(result.data.meta.itemCount).toEqual(itemCount);
    expect(result.message).toEqual('Rooms retrieved successfully');
    expect(result.statusCode).toEqual(200);
    expect(queriesService.applyFilters).toHaveBeenCalledWith(
      createQueryBuilderMock,
      filters,
    );
    expect(queriesService.applySorting).toHaveBeenCalledWith(
      createQueryBuilderMock,
      sortD,
    );
  });
  it('should apply sorting correctly', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const filters: FilterDto[] = [];
    const sortD: SortDto[] = [{ sortField: 'name', order: 'ASC' }];
    const rooms: Rooms[] = [
      {
        id: 1,
        name: 'Room A',
        capacity: 10,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    const itemCount = 1;

    const createQueryBuilderMock = {
      getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(roomsRepository, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilderMock as any);

    jest
      .spyOn(queriesService, 'applySorting')
      .mockReturnValue(createQueryBuilderMock as any);

    const result: ApiResponse<PaginationResultDto<Rooms>> =
      await service.getRooms(paginationDto, filters, sortD);

    expect(result.data.data).toEqual(rooms);
    expect(result.data.meta.itemCount).toEqual(itemCount);
    expect(result.message).toEqual('Rooms retrieved successfully');
    expect(result.statusCode).toEqual(200);
    expect(queriesService.applySorting).toHaveBeenCalledWith(
      createQueryBuilderMock,
      sortD,
    );
  });
  it('should apply filters correctly', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const filters: FilterDto[] = [
      { filterField: 'name', operator: Filters.EQUALS, value: 'Room A' },
    ];
    const sortD: SortDto[] = [];
    const rooms: Rooms[] = [
      {
        id: 1,
        name: 'Room A',
        capacity: 10,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    const itemCount = 1;

    const createQueryBuilderMock = {
      getManyAndCount: jest.fn().mockResolvedValue([rooms, itemCount]),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(roomsRepository, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilderMock as any);

    jest
      .spyOn(queriesService, 'applyFilters')
      .mockReturnValue(createQueryBuilderMock as any);

    const result: ApiResponse<PaginationResultDto<Rooms>> =
      await service.getRooms(paginationDto, filters, sortD);

    expect(result.data.data).toEqual(rooms);
    expect(result.data.meta.itemCount).toEqual(itemCount);
    expect(result.message).toEqual('Rooms retrieved successfully');
    expect(result.statusCode).toEqual(200);
    expect(queriesService.applyFilters).toHaveBeenCalledWith(
      createQueryBuilderMock,
      filters,
    );
  });
});
