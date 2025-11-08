import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { SystemConfig } from '../src/entities/system-config.entity';
import { SystemConfigService } from '../src/system-config/system-config.service';

describe('SystemConfig CRUD Operations (e2e)', () => {
  let app: INestApplication;
  let systemConfigService: SystemConfigService;
  let systemConfigRepository: Repository<SystemConfig>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    systemConfigService = app.get(SystemConfigService);
    systemConfigRepository = app.get(getRepositoryToken(SystemConfig));
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up SystemConfig table before each test (except seed data)
    await systemConfigRepository.query('DELETE FROM system_config WHERE key != ?', ['app.version']);
  });

  describe('Database Connection', () => {
    it('should have an initialized database connection', () => {
      expect(dataSource.isInitialized).toBe(true);
    });

    it('should have systemconfig table created', async () => {
      const tables = await dataSource.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='system_config'"
      );
      expect(tables).toHaveLength(1);
      expect(tables[0].name).toBe('system_config');
    });
  });

  describe('Seed Data', () => {
    it('should have seed data "app.version" created on startup', async () => {
      const config = await systemConfigService.findByKey('app.version');
      expect(config).toBeDefined();
      expect(config?.key).toBe('app.version');
      expect(config?.value).toBe('0.1.0');
    });
  });

  describe('Create Operation', () => {
    it('should create a new SystemConfig entry', async () => {
      const config = await systemConfigService.create('test.key', 'test-value');

      expect(config).toBeDefined();
      expect(config.key).toBe('test.key');
      expect(config.value).toBe('test-value');
      expect(config.id).toBeDefined();
      expect(config.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist the created SystemConfig to database', async () => {
      await systemConfigService.create('persist.test', 'persist-value');

      const persisted = await systemConfigRepository.findOne({
        where: { key: 'persist.test' },
      });

      expect(persisted).toBeDefined();
      expect(persisted?.value).toBe('persist-value');
    });
  });

  describe('Read Operation (findByKey)', () => {
    beforeEach(async () => {
      await systemConfigService.create('read.test', 'read-value');
    });

    it('should find an existing SystemConfig by key', async () => {
      const config = await systemConfigService.findByKey('read.test');

      expect(config).toBeDefined();
      expect(config?.key).toBe('read.test');
      expect(config?.value).toBe('read-value');
    });

    it('should return null for non-existent key', async () => {
      const config = await systemConfigService.findByKey('non.existent');
      expect(config).toBeNull();
    });
  });

  describe('Update Operation', () => {
    beforeEach(async () => {
      await systemConfigService.create('update.test', 'initial-value');
    });

    it('should update an existing SystemConfig', async () => {
      const updated = await systemConfigService.update('update.test', 'updated-value');

      expect(updated).toBeDefined();
      expect(updated?.value).toBe('updated-value');
    });

    it('should update the updatedAt timestamp', async () => {
      const before = await systemConfigService.findByKey('update.test');
      const beforeTimestamp = before?.updatedAt;

      // Wait 1000ms to ensure timestamp changes (SQLite has second-level precision)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const after = await systemConfigService.update('update.test', 'new-value');
      const afterTimestamp = after?.updatedAt;

      expect(afterTimestamp).not.toEqual(beforeTimestamp);
      expect(afterTimestamp!.getTime()).toBeGreaterThan(beforeTimestamp!.getTime());
    });

    it('should return null when updating non-existent key', async () => {
      const result = await systemConfigService.update('non.existent', 'value');
      expect(result).toBeNull();
    });
  });

  describe('Delete Operation', () => {
    beforeEach(async () => {
      await systemConfigService.create('delete.test', 'delete-value');
    });

    it('should delete an existing SystemConfig', async () => {
      const result = await systemConfigService.delete('delete.test');
      expect(result).toBe(true);

      // Verify deletion
      const deleted = await systemConfigService.findByKey('delete.test');
      expect(deleted).toBeNull();
    });

    it('should return false when deleting non-existent key', async () => {
      const result = await systemConfigService.delete('non.existent');
      expect(result).toBe(false);
    });
  });

  describe('Entity Constraints', () => {
    it('should enforce unique key constraint', async () => {
      await systemConfigService.create('unique.test', 'value1');

      // Attempt to create duplicate key should fail
      await expect(systemConfigService.create('unique.test', 'value2')).rejects.toThrow();
    });

    it('should automatically set updatedAt on creation', async () => {
      const before = new Date();
      const config = await systemConfigService.create('timestamp.test', 'value');
      const after = new Date();

      // SQLite datetime has second-level precision, so we check within a 2-second window
      expect(config.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
      expect(config.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as value', async () => {
      const config = await systemConfigService.create('empty.test', '');
      expect(config.value).toBe('');
    });

    it('should handle long values', async () => {
      const longValue = 'a'.repeat(1000);
      const config = await systemConfigService.create('long.test', longValue);
      expect(config.value).toBe(longValue);
    });

    it('should handle special characters in key', async () => {
      const config = await systemConfigService.create('special-key.test_123', 'value');
      expect(config.key).toBe('special-key.test_123');
    });

    it('should handle JSON as value', async () => {
      const jsonValue = JSON.stringify({ foo: 'bar', nested: { key: 'value' } });
      const config = await systemConfigService.create('json.test', jsonValue);
      expect(JSON.parse(config.value)).toEqual({ foo: 'bar', nested: { key: 'value' } });
    });
  });
});

describe('Migration Validation (against real database)', () => {
  let migrationDataSource: DataSource;
  const tempDbPath = './test-migration-validation.db';

  beforeAll(async () => {
    // Create DataSource with real SQLite file (not :memory:)
    migrationDataSource = new DataSource({
      type: 'sqlite',
      database: tempDbPath,
      entities: [SystemConfig],
      migrations: ['src/database/migrations/*.ts'],
      synchronize: false, // IMPORTANT: Don't auto-sync, use migrations only
    });

    await migrationDataSource.initialize();
    await migrationDataSource.runMigrations(); // Execute migrations
  });

  afterAll(async () => {
    await migrationDataSource.destroy();

    // Clean up temp database file
    try {
      const fs = require('fs');
      if (fs.existsSync(tempDbPath)) {
        fs.unlinkSync(tempDbPath);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it('should execute migration and create system_config table', async () => {
    const result = await migrationDataSource.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='system_config'"
    );

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('system_config');
  });

  it('should verify table structure matches Entity', async () => {
    // Use PRAGMA table_info to inspect table structure
    const columns = await migrationDataSource.query('PRAGMA table_info(system_config)');

    // Extract column names
    const columnNames = columns.map((col: any) => col.name);

    // Verify all required columns exist
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('key');
    expect(columnNames).toContain('value');
    expect(columnNames).toContain('updatedAt');

    // Verify column details
    const idColumn = columns.find((col: any) => col.name === 'id');
    const keyColumn = columns.find((col: any) => col.name === 'key');
    const valueColumn = columns.find((col: any) => col.name === 'value');
    const updatedAtColumn = columns.find((col: any) => col.name === 'updatedAt');

    // Validate id column (PRIMARY KEY, AUTOINCREMENT)
    expect(idColumn.pk).toBe(1); // Primary key
    expect(idColumn.type.toLowerCase()).toBe('integer');

    // Validate key column (UNIQUE, varchar(255))
    expect(keyColumn.type.toLowerCase()).toBe('varchar(255)');
    expect(keyColumn.notnull).toBe(1); // NOT NULL

    // Validate value column (text)
    expect(valueColumn.type.toLowerCase()).toBe('text');
    expect(valueColumn.notnull).toBe(1); // NOT NULL

    // Validate updatedAt column (datetime)
    expect(updatedAtColumn.type.toLowerCase()).toBe('datetime');
    expect(updatedAtColumn.notnull).toBe(1); // NOT NULL
  });

  it('should verify UNIQUE constraint on key column', async () => {
    // Query sqlite_master for the table definition
    const tableInfo = await migrationDataSource.query(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='system_config'"
    );

    expect(tableInfo).toHaveLength(1);
    const createTableSql = tableInfo[0].sql;

    // Verify UNIQUE constraint is defined on key column
    expect(createTableSql).toContain('UNIQUE');
    expect(createTableSql).toMatch(/CONSTRAINT.*UNIQUE.*"key"/i);
  });

  it('should verify table can store and retrieve data', async () => {
    // Insert test data
    await migrationDataSource.query(
      "INSERT INTO system_config (key, value, updatedAt) VALUES (?, ?, ?)",
      ['migration.test', 'test-value', new Date().toISOString()]
    );

    // Query data back
    const result = await migrationDataSource.query(
      "SELECT * FROM system_config WHERE key = ?",
      ['migration.test']
    );

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('migration.test');
    expect(result[0].value).toBe('test-value');
    expect(result[0].id).toBeDefined();
    expect(result[0].updatedAt).toBeDefined();
  });

  it('should enforce UNIQUE constraint on key', async () => {
    // Insert first record
    await migrationDataSource.query(
      "INSERT INTO system_config (key, value, updatedAt) VALUES (?, ?, ?)",
      ['unique.constraint.test', 'value1', new Date().toISOString()]
    );

    // Attempt to insert duplicate key should fail
    await expect(
      migrationDataSource.query(
        "INSERT INTO system_config (key, value, updatedAt) VALUES (?, ?, ?)",
        ['unique.constraint.test', 'value2', new Date().toISOString()]
      )
    ).rejects.toThrow();
  });
});
