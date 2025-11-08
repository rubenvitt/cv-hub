import { Module, OnModuleDestroy, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { EnvConfig } from '../config/env.schema';
import { SystemConfig } from '../entities/system-config.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => {
        // Read NODE_ENV from process.env directly (not ConfigService) to support test environment
        const nodeEnv = process.env.NODE_ENV || configService.get('NODE_ENV', { infer: true });
        const isTest = nodeEnv === 'test';

        return {
          type: 'sqlite' as const,
          database: isTest
            ? ':memory:'
            : (configService.get('DATABASE_PATH', { infer: true }) as string),
          entities: [SystemConfig],
          migrations: [],
          synchronize: isTest, // Auto-sync schema in tests only
          dropSchema: isTest, // Drop schema before each test run
          logging: nodeEnv === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private dataSource: DataSource) {}

  async onModuleDestroy() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.logger.log('Database connection closed gracefully');
    }
  }
}
