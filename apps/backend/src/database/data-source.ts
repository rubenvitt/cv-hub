import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SystemConfig } from '../entities/system-config.entity';

// Load .env for CLI usage (NestJS ConfigModule not available)
config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './data/cv-hub.db',
  entities: [SystemConfig],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Schema changes ONLY via migrations
  logging: process.env.NODE_ENV === 'development',
});
