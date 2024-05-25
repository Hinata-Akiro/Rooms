import { BaseTable } from '../../base';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Rooms' })
export class Rooms extends BaseTable {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('int')
  capacity: number;

  @Column('int')
  userId: number;
}
