import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { EnvConfig } from './config/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Get services
  const logger = app.get(Logger);
  const configService = app.get(ConfigService<EnvConfig>);

  // Use Pino Logger
  app.useLogger(logger);

  // Security: Helmet
  app.use(helmet());

  // Security: CORS
  const corsOrigin = configService.get('CORS_ORIGIN', { infer: true });
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Global API prefix
  app.setGlobalPrefix('api');

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Start server
  const port = configService.get('PORT', { infer: true }) || 3000;
  await app.listen(port);

  // Log startup message
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`CORS enabled for: ${corsOrigin}`);
}

bootstrap();
