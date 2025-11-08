import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck } from '@cv-hub/shared-types';
import { EnvConfig } from '../config/env.schema';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  private readonly startTime: number = Date.now();

  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly dataSource: DataSource,
  ) {}

  getHealthStatus(): HealthCheck {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      database: {
        status: this.dataSource.isInitialized ? 'connected' : 'disconnected',
        type: 'sqlite',
      },
    };
  }
}
