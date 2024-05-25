import * as path from 'path';
import { DATABASE_URL } from './config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const options: DataSourceOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/../**/*.migration{.ts,.js}')],
  connectTimeoutMS: 60000,
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

export const dataSource: DataSource = new DataSource(options);
