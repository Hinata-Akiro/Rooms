import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const DATABASE_URL = configService.get('DATABASE_URL');
const DB_HOST = configService.get('DB_HOST');
const DB_USER = configService.get('DB_USER');
const DB_NAME = configService.get('DB_NAME');
const DB_PORT = configService.get('DB_PORT');

export { DATABASE_URL, DB_HOST, DB_USER, DB_NAME, DB_PORT };
