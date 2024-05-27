import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'filters',
    type: String,
    required: false,
    description: 'Filter criteria for querying rooms',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Sort criteria for querying rooms',
  })
  async getRooms(
    @Query() paginationDto: PaginationDto,
    @Query('filters') filters: string,
    @Query('sort') sort: string,
  ) {
    let parsedFilters: FilterDto[];
    let parsedSort: SortDto[];

    try {
      parsedFilters = filters ? JSON.parse(filters) : [];
      parsedSort = sort ? JSON.parse(sort) : [];
    } catch (error) {
      throw new BadRequestException('Invalid JSON format for filters or sort');
    }

    return this.roomsService.getRooms(paginationDto, parsedFilters, parsedSort);
  }
}
