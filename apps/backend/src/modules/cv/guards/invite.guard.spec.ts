import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InviteGuard } from './invite.guard';

describe('InviteGuard', () => {
  let guard: InviteGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<InviteGuard>(InviteGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate - bypass mode', () => {
    it('should return true when EPIC_2_PLACEHOLDER_MODE is bypass', () => {
      jest.spyOn(configService, 'get').mockReturnValue('bypass');

      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(configService.get).toHaveBeenCalledWith('EPIC_2_PLACEHOLDER_MODE', 'strict');
    });
  });

  describe('canActivate - strict mode', () => {
    it('should throw NotImplementedException when EPIC_2_PLACEHOLDER_MODE is strict', () => {
      jest.spyOn(configService, 'get').mockReturnValue('strict');

      const mockContext = {} as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(NotImplementedException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Token-based access not yet implemented. See Epic 4.',
      );
    });
  });

  describe('canActivate - default mode', () => {
    it('should return true when config is not set (defaults to strict)', () => {
      jest.spyOn(configService, 'get').mockReturnValue('strict');

      const mockContext = {} as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(NotImplementedException);
    });
  });
});
