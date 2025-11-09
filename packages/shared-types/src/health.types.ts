import { z } from 'zod';

/**
 * Health Check Response Schema
 *
 * Validates API health check responses with runtime type safety.
 * Used by both backend (NestJS) and frontend (TanStack Start).
 *
 * @example
 * const response = HealthCheckResponseSchema.parse(data);
 */
export const HealthCheckResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(), // ISO 8601 DateTime
  uptime: z.number(), // Seconds since server start
  database: z.object({
    status: z.enum(['connected', 'disconnected']),
    type: z.literal('sqlite'),
  }),
});

/**
 * TypeScript type inferred from Zod schema
 * Ensures compile-time type safety matches runtime validation
 */
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

// Legacy export for backward compatibility
export type HealthCheck = HealthCheckResponse;
