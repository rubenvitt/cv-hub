import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

describe('HealthService', () => {
  let service: HealthService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            isInitialized: true,
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealthStatus', () => {
    it('should return healthy status when database is connected', () => {
      Object.defineProperty(dataSource, 'isInitialized', {
        get: () => true,
        configurable: true,
      });

      const result = service.getHealthStatus();

      expect(result.status).toBe('ok');
      expect(result.database.status).toBe('connected');
      expect(result.database.type).toBe('sqlite');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return disconnected status when database is not initialized', () => {
      Object.defineProperty(dataSource, 'isInitialized', {
        get: () => false,
        configurable: true,
      });

      const result = service.getHealthStatus();

      expect(result.status).toBe('ok');
      expect(result.database.status).toBe('disconnected');
      expect(result.database.type).toBe('sqlite');
    });

    it('should calculate uptime correctly', () => {
      const result1 = service.getHealthStatus();

      // Small delay
      const start = Date.now();
      while (Date.now() - start < 100) {
        // busy wait
      }

      const result2 = service.getHealthStatus();

      expect(result2.uptime).toBeGreaterThanOrEqual(result1.uptime);
    });

    it('should return ISO timestamp', () => {
      const result = service.getHealthStatus();

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
