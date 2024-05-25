import { Repository } from 'typeorm';
import { Rooms } from './entities';
import { CustomRepository } from '../typeorm-extension';

@CustomRepository(Rooms)
export class RoomsRepository extends Repository<Rooms> {
  async saveRooms(roomData: Partial<Rooms>[]): Promise<Rooms[]> {
    const rooms = this.create(roomData);
    return await this.save(rooms);
  }
}
