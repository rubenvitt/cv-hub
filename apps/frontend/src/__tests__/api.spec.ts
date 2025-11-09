import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { checkBackendHealth } from '@/lib/api';

describe('API Client', () => {
  describe('checkBackendHealth', () => {
    beforeAll(() => {
      // Mock fetch globally
      global.fetch = vi.fn();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('returns success status when backend is healthy', async () => {
      const mockHealthData = {
        status: 'ok',
        timestamp: '2025-11-07T19:00:00.000Z',
        uptime: 12345,
        database: {
          status: 'connected',
          type: 'sqlite',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealthData,
      });

      const result = await checkBackendHealth();

      expect(result.status).toBe('ok');
      expect(result.data).toEqual(mockHealthData);
      expect(result.error).toBeUndefined();
    });

    it('returns error status when backend returns non-200', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await checkBackendHealth();

      expect(result.status).toBe('error');
      expect(result.error).toBe('HTTP 500: Internal Server Error');
      expect(result.data).toBeUndefined();
    });

    it('returns error status when network error occurs', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network request failed'));

      const result = await checkBackendHealth();

      expect(result.status).toBe('error');
      expect(result.error).toContain('Network error');
    });

    it('returns error status when timeout occurs', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      (global.fetch as any).mockRejectedValueOnce(abortError);

      const result = await checkBackendHealth();

      expect(result.status).toBe('error');
      expect(result.error).toBe('Backend timeout (5s exceeded)');
    });

    it('calls correct API endpoint with proper headers', async () => {
      const mockFetch = global.fetch as any;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok', timestamp: '2025-11-07T19:00:00.000Z' }),
      });

      await checkBackendHealth();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/health',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('includes timeout signal in fetch call', async () => {
      const mockFetch = global.fetch as any;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok', timestamp: '2025-11-07T19:00:00.000Z' }),
      });

      await checkBackendHealth();

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[1]).toHaveProperty('signal');
      expect(fetchCall[1].signal).toBeInstanceOf(AbortSignal);
    });
  });
});
