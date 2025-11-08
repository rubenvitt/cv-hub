import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfig } from '../entities/system-config.entity';
import { SystemConfigService } from './system-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class SystemConfigModule implements OnModuleInit {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  async onModuleInit() {
    await this.systemConfigService.seedDefaultData();
  }
}
