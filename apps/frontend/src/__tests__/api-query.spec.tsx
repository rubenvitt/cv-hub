import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cvQueryKeys, fetchPublicCV, usePublicCV } from '~/lib/api';
import type { CV } from '@cv-hub/shared-types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test wrapper component that uses the hook
function TestComponent() {
  const { data, isLoading, isError, error } = usePublicCV();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (data) return <div data-testid="cv-data">CV: {data.basics.name}</div>;
  return <div>No data</div>;
}

// Helper to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retry for tests (faster)
        gcTime: 0, // Disable garbage collection
      },
    },
  });
}

// Helper to render component with QueryClientProvider
function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
}

// Mock CV data matching the CV type from shared-types
const mockCVData: CV = {
  basics: {
    name: 'John Doe',
    label: 'Software Engineer',
    email: 'john@example.com',
    phone: '+1234567890',
    url: 'https://johndoe.com',
    summary: 'Experienced software engineer',
    location: {
      city: 'San Francisco',
      countryCode: 'US',
      region: 'CA',
    },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
};

describe('TanStack Query Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('cvQueryKeys', () => {
    it('should have correct structure for public CV query key (AC#3)', () => {
      expect(cvQueryKeys.public).toEqual(['cv', 'public']);
    });

    it('should generate correct authenticated key with token (AC#3)', () => {
      const token = 'test-token-123';
      expect(cvQueryKeys.authenticated(token)).toEqual(['cv', 'authenticated', 'test-token-123']);
    });
  });

  describe('fetchPublicCV', () => {
    it('should fetch and validate CV data successfully (AC#2, AC#4)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCVData }),
      });

      const result = await fetchPublicCV();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/cv/public'),
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      expect(result).toEqual(mockCVData);
    });

    it('should throw error on HTTP 4xx/5xx status (AC#5)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(fetchPublicCV()).rejects.toThrow('HTTP 404: Failed to fetch CV data');
    });

    it('should throw error when backend returns success=false (AC#5)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { code: 'CV_NOT_FOUND', message: 'CV not found' },
        }),
      });

      await expect(fetchPublicCV()).rejects.toThrow('Backend error [CV_NOT_FOUND]: CV not found');
    });

    it('should throw error on validation failure (AC#4)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { invalid: 'data' }, // Invalid CV schema
        }),
      });

      await expect(fetchPublicCV()).rejects.toThrow('Invalid CV data received from server');
    });

    it('should throw error on network timeout (AC#5)', async () => {
      mockFetch.mockRejectedValueOnce(Object.assign(new Error('Timeout'), { name: 'AbortError' }));

      await expect(fetchPublicCV()).rejects.toThrow('CV fetch timeout (10s exceeded)');
    });
  });

  describe('usePublicCV Hook', () => {
    it('should show loading state initially (AC#6)', () => {
      mockFetch.mockImplementation(
        () =>
          new Promise(() => {
            /* never resolves */
          }),
      );

      renderWithQueryClient(<TestComponent />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display CV data on successful fetch (AC#6, AC#7)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCVData }),
      });

      renderWithQueryClient(<TestComponent />);

      // Initially loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByTestId('cv-data')).toBeInTheDocument();
      });

      expect(screen.getByTestId('cv-data')).toHaveTextContent('CV: John Doe');
    });

    it('should display error message on fetch failure (AC#6)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      });

      renderWithQueryClient(<TestComponent />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });

      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });

    it('should return correct data structure from hook (AC#6)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCVData }),
      });

      let hookResult: ReturnType<typeof usePublicCV> | undefined;

      function TestHookResult() {
        hookResult = usePublicCV();
        return null;
      }

      renderWithQueryClient(<TestHookResult />);

      // First verify hook has the correct properties
      expect(hookResult).toBeTruthy();
      expect(hookResult).toHaveProperty('data');
      expect(hookResult).toHaveProperty('isLoading');
      expect(hookResult).toHaveProperty('isError');
      expect(hookResult).toHaveProperty('error');

      // Wait for loading to complete and verify final state
      await waitFor(() => {
        expect(hookResult?.isLoading).toBe(false);
      });

      expect(hookResult?.isError).toBe(false);
      expect(hookResult?.data).toEqual(mockCVData);
    });
  });

  describe('TypeScript Type Safety (AC#7)', () => {
    it('should use CV type from @cv-hub/shared-types', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCVData }),
      });

      const result = await fetchPublicCV();

      // TypeScript should infer correct type
      expect(result.basics.name).toBe('John Doe');
      expect(result.work).toBeDefined();
      expect(result.education).toBeDefined();
      expect(result.skills).toBeDefined();
    });
  });
});
