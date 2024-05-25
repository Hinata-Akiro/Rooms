import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DATABASE_URL } from './config';

export const options: DataSourceOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/../**/*.migration{.ts,.js}')],
  synchronize: false,
  // logging: true,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

export const dataSource: DataSource = new DataSource(options);
