import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminAuthGuard } from './admin-auth.guard';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AdminAuthGuard>(AdminAuthGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate - bypass mode', () => {
    it('should return true when EPIC_2_ADMIN_PLACEHOLDER_MODE is bypass', () => {
      jest.spyOn(configService, 'get').mockReturnValue('bypass');

      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(configService.get).toHaveBeenCalledWith('EPIC_2_ADMIN_PLACEHOLDER_MODE', 'bypass');
    });
  });

  describe('canActivate - strict mode', () => {
    it('should throw NotImplementedException when EPIC_2_ADMIN_PLACEHOLDER_MODE is strict', () => {
      jest.spyOn(configService, 'get').mockReturnValue('strict');

      const mockContext = {} as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(NotImplementedException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Admin authentication not yet implemented. See Epic 5.',
      );
    });
  });

  describe('canActivate - default mode', () => {
    it('should return true when config is not set (defaults to bypass)', () => {
      jest.spyOn(configService, 'get').mockReturnValue('bypass');

      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});
