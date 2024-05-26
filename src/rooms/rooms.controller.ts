import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { PaginationDto, FilterDto, SortDto } from '../common/dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of rooms' })
  @ApiResponse({
    status: 200,
    description: 'List of rooms returned successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getRooms(
    @Query() paginationDto: PaginationDto,
    @Query() filters?: FilterDto,
    @Query() sort?: SortDto,
  ) {
    const filterArray = filters
      ? Object.keys(filters).length === 0
        ? []
        : [filters]
      : [];

    const sortArray = sort
      ? Object.keys(sort).length === 0
        ? []
        : [sort]
      : [];
    return this.roomsService.getRooms(paginationDto, filterArray, sortArray);
  }
}
