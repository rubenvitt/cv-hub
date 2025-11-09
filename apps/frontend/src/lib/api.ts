/**
 * API Client for Backend Communication
 * Type-safe API calls using shared types
 */

import type { HealthCheck } from '@cv-hub/shared-types';

const API_BASE_URL = 'http://localhost:3000';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  data?: HealthCheck;
  error?: string;
}

/**
 * Check backend health status
 * Non-blocking call with comprehensive error handling
 */
export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        status: 'error',
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data: HealthCheck = await response.json();

    return {
      status: 'ok',
      data,
    };
  } catch (error) {
    // Handle network errors, timeouts, CORS issues
    if (error instanceof Error) {
      return {
        status: 'error',
        error:
          error.name === 'AbortError'
            ? 'Backend timeout (5s exceeded)'
            : `Network error: ${error.message}`,
      };
    }

    return {
      status: 'error',
      error: 'Unknown error occurred',
    };
  }
}
