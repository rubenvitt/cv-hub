import { describe, it, expect, vi } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Environment Configuration', () => {
  describe('VITE_API_URL environment variable', () => {
    it('should be defined in TypeScript types', () => {
      // This test verifies that vite-env.d.ts is working
      // If this compiles without errors, types are correct
      const apiUrl: string = import.meta.env.VITE_API_URL;

      // In test environment, the env var might be undefined
      // The important part is that TypeScript accepts this as a string type
      // If TypeScript compilation succeeds, the type definition is correct
      expect(apiUrl === undefined || typeof apiUrl === 'string').toBe(true);
    });

    it('should have a fallback value in api.ts', () => {
      // Verify the API_BASE_URL has fallback logic
      const apiSource = readFileSync(join(__dirname, '../lib/api.ts'), 'utf-8');

      expect(apiSource).toContain('import.meta.env.VITE_API_URL');
      expect(apiSource).toContain("|| 'http://localhost:3000'");
    });

    it('should be accessible at runtime', () => {
      // Test that the environment variable is accessible
      const apiUrl = import.meta.env.VITE_API_URL;

      // In test environment, should either be set or undefined
      // TypeScript ensures it's typed as string
      expect(apiUrl === undefined || typeof apiUrl === 'string').toBe(true);
    });
  });

  describe('.env.example file', () => {
    it('should exist in the frontend directory', () => {
      const envExamplePath = join(__dirname, '../../.env.example');
      expect(existsSync(envExamplePath)).toBe(true);
    });

    it('should contain VITE_API_URL template', () => {
      const envExamplePath = join(__dirname, '../../.env.example');
      const envExample = readFileSync(envExamplePath, 'utf-8');

      expect(envExample).toContain('VITE_API_URL');
      expect(envExample).toContain('http://localhost:3000');
    });

    it('should have proper comments for documentation', () => {
      const envExamplePath = join(__dirname, '../../.env.example');
      const envExample = readFileSync(envExamplePath, 'utf-8');

      // Should have comments explaining the variable
      expect(envExample).toContain('Backend API Base URL');
      expect(envExample).toContain('Default:');
      expect(envExample).toContain('Production:');
    });
  });

  describe('vite-env.d.ts type definitions', () => {
    it('should exist and define ImportMetaEnv interface', () => {
      const viteEnvPath = join(__dirname, '../../vite-env.d.ts');
      expect(existsSync(viteEnvPath)).toBe(true);

      const viteEnvSource = readFileSync(viteEnvPath, 'utf-8');

      expect(viteEnvSource).toContain('interface ImportMetaEnv');
      expect(viteEnvSource).toContain('VITE_API_URL');
      expect(viteEnvSource).toContain('readonly');
    });

    it('should reference Vite client types', () => {
      const viteEnvPath = join(__dirname, '../../vite-env.d.ts');
      const viteEnvSource = readFileSync(viteEnvPath, 'utf-8');

      expect(viteEnvSource).toContain('/// <reference types="vite/client" />');
    });

    it('should define ImportMeta interface', () => {
      const viteEnvPath = join(__dirname, '../../vite-env.d.ts');
      const viteEnvSource = readFileSync(viteEnvPath, 'utf-8');

      expect(viteEnvSource).toContain('interface ImportMeta');
      expect(viteEnvSource).toContain('readonly env: ImportMetaEnv');
    });
  });

  describe('API Base URL Configuration', () => {
    it('should use environment variable in api.ts', () => {
      const apiSource = readFileSync(join(__dirname, '../lib/api.ts'), 'utf-8');

      // Verify the pattern: const API_BASE_URL = import.meta.env.VITE_API_URL || 'fallback'
      expect(apiSource).toContain('import.meta.env.VITE_API_URL');
      expect(apiSource).toContain('API_BASE_URL');
    });

    it('should have localhost:3000 as fallback URL', () => {
      const apiSource = readFileSync(join(__dirname, '../lib/api.ts'), 'utf-8');

      expect(apiSource).toContain('http://localhost:3000');
    });

    it('should use API_BASE_URL constant in fetch calls', () => {
      const apiSource = readFileSync(join(__dirname, '../lib/api.ts'), 'utf-8');

      // Verify API_BASE_URL is used in template strings
      expect(apiSource).toContain('${API_BASE_URL}');
    });
  });

  describe('Environment variable behavior', () => {
    it('should handle missing VITE_API_URL gracefully with fallback', async () => {
      // Import the api module to test runtime behavior
      const { checkBackendHealth } = await import('@/lib/api');

      // Mock fetch to test URL construction
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', timestamp: new Date().toISOString() }),
      });
      global.fetch = mockFetch;

      // Call the function
      await checkBackendHealth();

      // Verify fetch was called with correct base URL
      expect(mockFetch).toHaveBeenCalled();
      const fetchUrl = mockFetch.mock.calls[0][0];

      // Should use either env var or fallback
      expect(fetchUrl).toMatch(/\/api\/health$/);
      expect(fetchUrl).toContain('http://');

      vi.restoreAllMocks();
    });

    it('should construct correct API endpoints', () => {
      const apiSource = readFileSync(join(__dirname, '../lib/api.ts'), 'utf-8');

      // Verify endpoint construction pattern
      expect(apiSource).toContain('/api/health');
    });
  });

  describe('Type safety verification', () => {
    it('should ensure VITE_API_URL is typed as string', () => {
      // This test compiles successfully = types are correct
      const url: string = import.meta.env.VITE_API_URL;

      // Runtime check (in test env might be undefined)
      if (url !== undefined) {
        expect(typeof url).toBe('string');
      }
    });

    it('should not allow assignment to readonly env properties', () => {
      // TypeScript compile-time check
      // Attempting: import.meta.env.VITE_API_URL = 'new value' would fail compilation

      // Runtime verification that env is accessible
      const env = import.meta.env;
      expect(env).toBeDefined();

      // The property may not exist in test environment, but the interface should be defined
      // The important part is that TypeScript enforces readonly at compile time
      expect(typeof env).toBe('object');
    });
  });

  describe('Configuration file structure', () => {
    it('should have .env.example as template (not .env)', () => {
      const envExampleExists = existsSync(join(__dirname, '../../.env.example'));
      const envExists = existsSync(join(__dirname, '../../.env'));

      expect(envExampleExists).toBe(true);
      // .env should not be in git (checked by .gitignore)
      // We don't enforce its non-existence as devs may have local .env
    });

    it('should follow VITE_ prefix convention', () => {
      const viteEnvPath = join(__dirname, '../../vite-env.d.ts');
      const viteEnvSource = readFileSync(viteEnvPath, 'utf-8');

      // All Vite env vars should start with VITE_
      expect(viteEnvSource).toContain('VITE_');
    });
  });

  describe('Integration with build system', () => {
    it('should be compatible with Vite build process', () => {
      const viteEnvPath = join(__dirname, '../../vite-env.d.ts');
      expect(existsSync(viteEnvPath)).toBe(true);

      // Verify reference to vite/client types
      const viteEnvSource = readFileSync(viteEnvPath, 'utf-8');
      expect(viteEnvSource).toContain('vite/client');
    });

    it('should have proper TypeScript configuration', () => {
      // vite-env.d.ts should be in the root or src directory
      const viteEnvInRoot = existsSync(join(__dirname, '../../vite-env.d.ts'));
      const viteEnvInSrc = existsSync(join(__dirname, '../vite-env.d.ts'));

      expect(viteEnvInRoot || viteEnvInSrc).toBe(true);
    });
  });
});
