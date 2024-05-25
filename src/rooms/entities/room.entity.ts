import { BaseTable } from 'src/base';
import { Column } from 'typeorm';

export class Rooms extends BaseTable {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('int')
  capacity: number;

  @Column('int')
  userId: number;
}
