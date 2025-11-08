import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@cv-hub/shared-types';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthCheck {
    return this.healthService.getHealthStatus();
  }
}
