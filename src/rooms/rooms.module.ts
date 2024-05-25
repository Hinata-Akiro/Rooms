import { Module } from '@nestjs/common';
import { Rooms } from './entities';
import { QueriesModule } from 'src/queries/queries.module';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rooms]), QueriesModule],
  providers: [RoomsService, RoomsRepository],
  controllers: [RoomsController],
})
export class RoomsModule {}
