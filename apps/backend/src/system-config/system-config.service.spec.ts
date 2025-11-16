import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigService } from './system-config.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SystemConfig } from '../entities/system-config.entity';

describe('SystemConfigService', () => {
  let service: SystemConfigService;
  let repository: Repository<SystemConfig>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigService,
        {
          provide: getRepositoryToken(SystemConfig),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SystemConfigService>(SystemConfigService);
    repository = module.get<Repository<SystemConfig>>(getRepositoryToken(SystemConfig));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByKey', () => {
    it('should return config when key exists', async () => {
      const mockConfig = {
        id: 1,
        key: 'test.key',
        value: 'test-value',
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.findByKey('test.key');

      expect(result).toEqual(mockConfig);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { key: 'test.key' },
      });
    });

    it('should return null when key does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findByKey('nonexistent.key');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new config', async () => {
      const newConfig = {
        id: 1,
        key: 'new.key',
        value: 'new-value',
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(newConfig as any);
      jest.spyOn(repository, 'save').mockResolvedValue(newConfig as any);

      const result = await service.create('new.key', 'new-value');

      expect(repository.create).toHaveBeenCalledWith({
        key: 'new.key',
        value: 'new-value',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(newConfig);
    });
  });

  describe('update', () => {
    it('should update existing config when key exists', async () => {
      const existingConfig = {
        id: 1,
        key: 'existing.key',
        value: 'old-value',
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingConfig as SystemConfig);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...existingConfig,
        value: 'new-value',
      } as SystemConfig);

      const result = await service.update('existing.key', 'new-value');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { key: 'existing.key' },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingConfig,
        value: 'new-value',
      });
      expect(result?.value).toBe('new-value');
    });

    it('should return null when key does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.update('nonexistent.key', 'new-value');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true when config is deleted', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.delete('test.key');

      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith({ key: 'test.key' });
    });

    it('should return false when config does not exist', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      const result = await service.delete('nonexistent.key');

      expect(result).toBe(false);
    });

    it('should handle affected as undefined', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: undefined, raw: {} });

      const result = await service.delete('test.key');

      expect(result).toBe(false);
    });
  });

  describe('seedDefaultData', () => {
    it('should seed default data when not exists', async () => {
      const newConfig = {
        id: 1,
        key: 'app.version',
        value: '0.1.0',
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(newConfig as any);
      jest.spyOn(repository, 'save').mockResolvedValue(newConfig as any);

      await service.seedDefaultData();

      expect(repository.findOne).toHaveBeenCalledWith({ where: { key: 'app.version' } });
      expect(repository.create).toHaveBeenCalledWith({ key: 'app.version', value: '0.1.0' });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should not seed when data already exists', async () => {
      const existingConfig = {
        id: 1,
        key: 'app.version',
        value: '0.1.0',
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingConfig as SystemConfig);
      jest.spyOn(repository, 'create');
      jest.spyOn(repository, 'save');

      await service.seedDefaultData();

      expect(repository.findOne).toHaveBeenCalledWith({ where: { key: 'app.version' } });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
