import { describe, it, expect } from 'vitest';
import { HealthCheckResponseSchema, HealthCheckResponse } from './health.types';
import { ZodError } from 'zod';

describe('HealthCheckResponseSchema', () => {
  describe('Valid Data', () => {
    it('should parse valid health check response', () => {
      const validData = {
        status: 'ok' as const,
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 3600,
        database: {
          status: 'connected' as const,
          type: 'sqlite' as const,
        },
      };

      const result = HealthCheckResponseSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should parse error status', () => {
      const validData = {
        status: 'error' as const,
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 3600,
        database: {
          status: 'disconnected' as const,
          type: 'sqlite' as const,
        },
      };

      expect(() => HealthCheckResponseSchema.parse(validData)).not.toThrow();
    });

    it('should allow zero uptime', () => {
      const validData = {
        status: 'ok' as const,
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 0,
        database: {
          status: 'connected' as const,
          type: 'sqlite' as const,
        },
      };

      expect(() => HealthCheckResponseSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Invalid Data', () => {
    it('should reject invalid status enum', () => {
      const invalidData = {
        status: 'invalid',
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 3600,
        database: { status: 'connected', type: 'sqlite' },
      };

      expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject non-string timestamp', () => {
      const invalidData = {
        status: 'ok',
        timestamp: 123456789,
        uptime: 3600,
        database: { status: 'connected', type: 'sqlite' },
      };

      expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject non-number uptime', () => {
      const invalidData = {
        status: 'ok',
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 'not-a-number',
        database: { status: 'connected', type: 'sqlite' },
      };

      expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject invalid database status', () => {
      const invalidData = {
        status: 'ok',
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 3600,
        database: { status: 'invalid', type: 'sqlite' },
      };

      expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject non-sqlite database type', () => {
      const invalidData = {
        status: 'ok',
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 3600,
        database: { status: 'connected', type: 'postgres' },
      };

      expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject missing fields', () => {
      const invalidData = {
        status: 'ok',
        timestamp: '2025-11-08T10:00:00.000Z',
      };

      expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
    });
  });

  describe('Type Inference', () => {
    it('should infer correct TypeScript type', () => {
      // This is a compile-time test
      const response: HealthCheckResponse = {
        status: 'ok',
        timestamp: '2025-11-08T10:00:00.000Z',
        uptime: 3600,
        database: {
          status: 'connected',
          type: 'sqlite',
        },
      };

      expect(response).toBeDefined();
    });
  });
});
