import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { validateEnv } from './config/env.schema';

@Module({
  imports: [
    // Environment Configuration with Zod Validation
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: '.env',
    }),

    // Pino Logger Configuration
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                  singleLine: false,
                },
              }
            : undefined,
        customProps: () => ({
          context: 'HTTP',
        }),
        autoLogging: true,
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),

    // Database Module with TypeORM + SQLite
    DatabaseModule,

    // System Configuration Module (demonstrates Repository Pattern)
    SystemConfigModule,

    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
