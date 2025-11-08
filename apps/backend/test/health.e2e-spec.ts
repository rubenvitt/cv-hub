import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';
import { HealthCheck } from '@cv-hub/shared-types';

describe('Health Endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same middleware as main.ts
    const logger = app.get(Logger);
    app.useLogger(logger);
    app.use(helmet());
    app.enableCors({ origin: 'http://localhost:5173', credentials: true });
    app.useGlobalFilters(new AllExceptionsFilter(logger));
    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/health - Basic Response', () => {
    it('should return HTTP 200', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
    });

    it('should return JSON content type', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('GET /api/health - Response Structure', () => {
    it('should include status: "ok"', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('status', 'ok');
        });
    });

    it('should include timestamp as ISO string', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('timestamp');
          expect(typeof response.body.timestamp).toBe('string');
          // Validate ISO 8601 format
          expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
        });
    });

    it('should include uptime as number', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('uptime');
          expect(typeof response.body.uptime).toBe('number');
          expect(response.body.uptime).toBeGreaterThanOrEqual(0);
        });
    });

    it('should include database.status: "connected"', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('database');
          expect(response.body.database).toHaveProperty('status', 'connected');
        });
    });

    it('should include database.type: "sqlite"', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('database');
          expect(response.body.database).toHaveProperty('type', 'sqlite');
        });
    });

    it('should match HealthCheck interface structure', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          const body: HealthCheck = response.body;

          // Validate complete structure
          expect(body).toHaveProperty('status');
          expect(body).toHaveProperty('timestamp');
          expect(body).toHaveProperty('uptime');
          expect(body).toHaveProperty('database');

          // Validate status is valid enum value
          expect(['ok', 'error']).toContain(body.status);

          // Validate timestamp is ISO string
          expect(typeof body.timestamp).toBe('string');

          // Validate uptime is number
          expect(typeof body.uptime).toBe('number');

          // Validate database object structure
          expect(body.database).toHaveProperty('status');
          expect(body.database).toHaveProperty('type');
          expect(['connected', 'disconnected']).toContain(body.database.status);
          expect(body.database.type).toBe('sqlite');
        });
    });
  });

  describe('GET /api/health - Security Headers', () => {
    it('should return security headers from Helmet', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.headers).toHaveProperty('x-frame-options');
          expect(response.headers).toHaveProperty('x-content-type-options');
          expect(response.headers).toHaveProperty('content-security-policy');
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 with structured error for nonexistent endpoint', () => {
      return request(app.getHttpServer())
        .get('/api/nonexistent')
        .expect(404)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toHaveProperty('statusCode', 404);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('timestamp');
          expect(response.body).toHaveProperty('path', '/api/nonexistent');
        });
    });
  });
});
