// Set NODE_ENV to 'test' for E2E tests
process.env.NODE_ENV = 'test';

// Use in-memory SQLite database for test isolation
process.env.DATABASE_PATH = ':memory:';
