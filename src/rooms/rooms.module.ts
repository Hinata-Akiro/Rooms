import { Module } from '@nestjs/common';
import { Rooms } from './entities';
import { QueriesModule } from 'src/queries/queries.module';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { TypeOrmExModule } from 'src/typeorm-extension';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([Rooms]), QueriesModule],
  providers: [RoomsService, RoomsRepository],
  controllers: [RoomsController],
})
export class RoomsModule {}
