/**
 * Shared Types Package - Placeholder
 * This file will later contain Zod schemas and TypeScript types
 */

export interface HealthCheck {
  status: 'ok' | 'error';
  timestamp: string; // ISO8601 string
  uptime: number; // seconds
  database: {
    status: 'connected' | 'disconnected';
    type: 'sqlite';
  };
}

export const WORKSPACE_TEST_MESSAGE = 'Workspace reference test successful!';
