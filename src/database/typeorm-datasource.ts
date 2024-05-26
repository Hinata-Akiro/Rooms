import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DATABASE_URL } from './config';
import { Rooms } from '../rooms/entities';

export const options: DataSourceOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [Rooms],
  migrations: [path.join(__dirname, '/../**/migrations/*{.ts,.js}')],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
};

export const dataSource: DataSource = new DataSource(options);
