import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueriesService } from '../queries/queries.service';
import {
  FilterDto,
  PaginationDto,
  PaginationMetaDataDto,
  PaginationResultDto,
  SortDto,
} from '../common/dto';
import { Rooms } from './entities';
import { Repository } from 'typeorm';
import {
  ApiResponse,
  HandleError,
  HandleSuccess,
} from '../common/response/response';

@Injectable()
export class RoomsService {
  constructor(
    private readonly queriesService: QueriesService,
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
  ) {}

  /**
   * Retrieves a list of rooms based on pagination, filters, and sorting options.
   *
   * @param paginationDto - Pagination options.
   * @param filters - Array of filter options.
   * @param sortD - Array of sorting options.
   * @returns A Promise that resolves to an ApiResponse containing the paginated list of rooms.
   */
  async getRooms(
    paginationDto: PaginationDto,
    filters?: FilterDto[],
    sortD?: SortDto[],
  ): Promise<ApiResponse<PaginationResultDto<Rooms>>> {
    try {
      let query = this.roomsRepository.createQueryBuilder('rooms');
      if (filters) {
        query = this.queriesService.applyFilters(query, filters);
      }
      if (sortD) {
        query = this.queriesService.applySorting(query, sortD);
      }
      query = this.queriesService.applyPagination(query, paginationDto);

      const [rooms, itemCount] = await query.getManyAndCount();
      const meta = new PaginationMetaDataDto({
        pageOptionsDto: paginationDto,
        itemCount,
      });

      const roomsQuery = new PaginationResultDto(rooms, meta);

      const message =
        rooms.length === 0 ? 'No rooms found' : 'Rooms retrieved successfully';

      return HandleSuccess(roomsQuery, 200, message);
    } catch (error) {
      return HandleError(error);
    }
  }
}
