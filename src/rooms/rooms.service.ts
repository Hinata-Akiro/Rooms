import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueriesService } from 'src/queries/queries.service';
import {
  PaginationDto,
  PaginationMetaDataDto,
  PaginationResultDto,
} from 'src/common/dto';
import { Rooms } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    private readonly queriesService: QueriesService,
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
  ) {}

  async getRooms(
    paginationDto: PaginationDto,
  ): Promise<PaginationResultDto<Rooms>> {
    let query = this.roomsRepository.createQueryBuilder('room');

    query = this.queriesService.applyFilters(query, paginationDto);
    query = this.queriesService.applySorting(query, paginationDto);
    query = this.queriesService.applyPagination(query, paginationDto);

    const [rooms, itemCount] = await query.getManyAndCount();
    const meta = new PaginationMetaDataDto({
      pageOptionsDto: paginationDto,
      itemCount,
    });

    return new PaginationResultDto(rooms, meta);
  }

  async seed() {
    const rooms = [
      { name: 'Conference Room A', capacity: 10, userId: 1 },
      { name: 'Meeting Room B', capacity: 8, userId: 2 },
      { name: 'Workshop Room C', capacity: 20, userId: 1 },
      { name: 'Training Room D', capacity: 15, userId: 3 },
      { name: 'Seminar Room E', capacity: 25, userId: 2 },
      { name: 'Discussion Room F', capacity: 5, userId: 4 },
      { name: 'Board Room G', capacity: 12, userId: 1 },
      { name: 'Conference Room H', capacity: 10, userId: 3 },
      { name: 'Small Meeting Room I', capacity: 4, userId: 2 },
      { name: 'Large Conference Room J', capacity: 30, userId: 4 },
      { name: 'Project Room K', capacity: 6, userId: 1 },
      { name: 'Collaboration Room L', capacity: 10, userId: 3 },
      { name: 'Focus Room M', capacity: 2, userId: 2 },
      { name: 'Presentation Room N', capacity: 18, userId: 1 },
      { name: 'Lecture Room O', capacity: 22, userId: 3 },
      { name: 'Briefing Room P', capacity: 14, userId: 4 },
      { name: 'Strategy Room Q', capacity: 10, userId: 1 },
      { name: 'Consultation Room R', capacity: 5, userId: 3 },
      { name: 'Interview Room S', capacity: 3, userId: 2 },
      { name: 'Brainstorming Room T', capacity: 12, userId: 4 },
    ];

    const result = await this.roomsRepository.save(rooms);
    console.log(result);
  }
}
