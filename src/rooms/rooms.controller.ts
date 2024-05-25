import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { PaginationDto } from 'src/common/dto';

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
  async getRooms(@Query() paginationDto: PaginationDto) {
    return this.roomsService.getRooms(paginationDto);
  }

  @Get('seed')
  async seedRoom() {
    return this.roomsService.seed();
  }
}
