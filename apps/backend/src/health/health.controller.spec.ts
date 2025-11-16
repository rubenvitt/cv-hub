import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            getHealthStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status from service', () => {
      const mockHealth = {
        status: 'ok' as const,
        timestamp: '2025-11-13T12:00:00.000Z',
        uptime: 42,
        database: {
          status: 'connected' as const,
          type: 'sqlite' as const,
        },
      };

      jest.spyOn(healthService, 'getHealthStatus').mockReturnValue(mockHealth);

      const result = controller.getHealth();

      expect(result).toEqual(mockHealth);
      expect(healthService.getHealthStatus).toHaveBeenCalledTimes(1);
    });
  });
});
