import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../entities/system-config.entity';

@Injectable()
export class SystemConfigService {
  private readonly logger = new Logger(SystemConfigService.name);

  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}

  async create(key: string, value: string): Promise<SystemConfig> {
    const config = this.systemConfigRepository.create({ key, value });
    const saved = await this.systemConfigRepository.save(config);
    this.logger.log(`Created system config: ${key} = ${value}`);
    return saved;
  }

  async findByKey(key: string): Promise<SystemConfig | null> {
    return this.systemConfigRepository.findOne({ where: { key } });
  }

  async update(key: string, value: string): Promise<SystemConfig | null> {
    const config = await this.findByKey(key);
    if (!config) {
      return null;
    }
    config.value = value;
    const updated = await this.systemConfigRepository.save(config);
    this.logger.log(`Updated system config: ${key} = ${value}`);
    return updated;
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.systemConfigRepository.delete({ key });
    const deleted = (result.affected ?? 0) > 0;
    if (deleted) {
      this.logger.log(`Deleted system config: ${key}`);
    }
    return deleted;
  }

  async seedDefaultData(): Promise<void> {
    const appVersionKey = 'app.version';
    const existing = await this.findByKey(appVersionKey);
    if (!existing) {
      await this.create(appVersionKey, '0.1.0');
      this.logger.log('Seeded default system config data');
    }
  }
}
