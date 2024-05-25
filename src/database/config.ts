import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const DATABASE_URL = configService.get('DATABASE_URL');

export { DATABASE_URL };
