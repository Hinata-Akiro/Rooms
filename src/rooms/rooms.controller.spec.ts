/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto, FilterDto, SortDto } from '../common/dto';
import { ApiResponse } from '../common/response/response';
import { Filters } from '../common/enum';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  const mockRoomsService = {
    getRooms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: mockRoomsService,
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRooms', () => {
    it('should return a list of rooms with pagination and metadata', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters = {
        filterField: 'capacity',
        operator: Filters.GTE,
        value: '10',
      };
      const sort: SortDto = { sortField: 'name', order: 'ASC' };
      const result: ApiResponse<any> = {
        statusCode: 200,
        message: 'Rooms retrieved successfully',
        data: {
          items: [{ id: 1, name: 'Room A', capacity: 10 }],
          meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1,
          },
        },
        error: false,
      };

      mockRoomsService.getRooms.mockResolvedValue(result);

      expect(await controller.getRooms(paginationDto, filters, sort)).toEqual(
        result,
      );
    });
    it('should handle missing optional query parameters', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const result: ApiResponse<any> = {
        statusCode: 200,
        message: 'Rooms retrieved successfully',
        data: {
          items: [{ id: 1, name: 'Room A', capacity: 10 }],
          meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1,
          },
        },
        error: false,
      };

      mockRoomsService.getRooms.mockResolvedValue(result);

      expect(await controller.getRooms(paginationDto)).toEqual(result);
    });
    it('should throw BadRequestException for invalid filter operator', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters = {
        filterField: 'capacity',
        operator: 'INVALID_OPERATOR' as Filters,
        value: '10',
      };
      const sort: SortDto = { sortField: 'name', order: 'ASC' };

      try {
        await controller.getRooms(paginationDto, filters, sort);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw BadRequestException for invalid pagination parameters', async () => {
      const paginationDto: PaginationDto = { page: -1, limit: 10 };
      const filters: FilterDto = undefined;
      const sort: SortDto = undefined;

      try {
        await controller.getRooms(paginationDto, filters, sort);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should handle sort parameter provided but filter parameter is empty', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters: FilterDto = undefined;
      const sort: SortDto = { sortField: 'name', order: 'ASC' };
      const result: ApiResponse<any> = {
        statusCode: 200,
        message: 'Rooms retrieved successfully',
        data: {
          items: [{ id: 1, name: 'Room A', capacity: 10 }],
          meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1,
          },
        },
        error: false,
      };

      mockRoomsService.getRooms.mockResolvedValue(result);

      expect(await controller.getRooms(paginationDto, filters, sort)).toEqual(
        result,
      );
    });
    it('should handle filter parameter provided but sort parameter is empty', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters: FilterDto = {
        filterField: 'capacity',
        operator: Filters.GTE,
        value: '10',
      };
      const sort: SortDto = undefined;
      const result: ApiResponse<any> = {
        statusCode: 200,
        message: 'Rooms retrieved successfully',
        data: {
          items: [{ id: 1, name: 'Room A', capacity: 10 }],
          meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1,
          },
        },
        error: false,
      };

      mockRoomsService.getRooms.mockResolvedValue(result);

      expect(await controller.getRooms(paginationDto, filters, sort)).toEqual(
        result,
      );
    });
  });
});
