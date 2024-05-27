/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto, FilterDto, SortDto } from '../common/dto';
import { ApiResponse } from '../common/response/response';

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
      const filters = '[{"field":"capacity","operator":"gte","value":10}]';
      const sort = '[{"field":"name","order":"ASC"}]';
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

    it('should throw a BadRequestException for invalid JSON in filters', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters = 'invalid-json';
      const sort = '[{"field":"name","order":"ASC"}]';

      await expect(
        controller.getRooms(paginationDto, filters, sort),
      ).rejects.toThrow(
        new BadRequestException('Invalid JSON format for filters or sort'),
      );
    });

    it('should throw a BadRequestException for invalid JSON in sort', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters = '[{"field":"capacity","operator":"gte","value":10}]';
      const sort = 'invalid-json';

      await expect(
        controller.getRooms(paginationDto, filters, sort),
      ).rejects.toThrow(
        new BadRequestException('Invalid JSON format for filters or sort'),
      );
    });

    it('should return an empty list when no filters and sort are provided', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const filters = '';
      const sort = '';
      const result: ApiResponse<any> = {
        statusCode: 200,
        message: 'Rooms retrieved successfully',
        data: {
          items: [],
          meta: {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: 10,
            totalPages: 0,
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
