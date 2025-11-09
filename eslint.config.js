import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.output/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: [
          './apps/backend/tsconfig.json',
          './apps/frontend/tsconfig.json',
          './packages/shared-types/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      ...eslintPluginTypescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  // Separate rules for test files
  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.e2e-spec.ts',
      '**/__tests__/**/*.ts',
      '**/__tests__/**/*.tsx',
      '**/test/**/*.ts',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: [
          './apps/backend/tsconfig.json',
          './apps/frontend/tsconfig.json',
          './packages/shared-types/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      // Relaxed rules for test files
      '@typescript-eslint/no-explicit-any': 'off', // Mocks often need any
      '@typescript-eslint/no-unused-vars': 'warn', // Test helpers may appear unused
      // SECURITY RULES BLEIBEN AKTIV (keine weiteren Overrides)
    },
  },
  eslintConfigPrettier,
];
