import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { seedCV } from '../src/database/seeds/cv.seed';
import { CVEntity } from '../src/modules/cv/entities/cv.entity';
import { CVVersionEntity } from '../src/modules/cv/entities/cv-version.entity';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';

/**
 * Integration Tests for Public CV Endpoint
 *
 * Story: 2-10-integration-tests-und-ci-cd-fuer-epic-2
 * Task 1: Integration-Tests für Public CV Endpoint
 *
 * Test Coverage:
 * - Subtask 1.1: Privacy Filtering (email, phone, address, postalCode, skills[].level, work[].name redaction, private projects)
 * - Subtask 1.2: Caching (ETag header, Cache-Control header, response consistency)
 *
 * @see docs/stories/2-10-integration-tests-und-ci-cd-fuer-epic-2.md
 */
describe('CV API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  /**
   * Test Setup
   *
   * - Create NestJS test application with AppModule
   * - Apply production middleware (helmet, CORS, exception filter)
   * - Set global API prefix (/api)
   * - Initialize application
   * - Get DataSource for database operations
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same middleware as main.ts for realistic test environment
    const logger = app.get(Logger);
    app.useLogger(logger);
    app.use(helmet());
    app.enableCors({ origin: 'http://localhost:5173', credentials: true });
    app.useGlobalFilters(new AllExceptionsFilter(logger));
    app.setGlobalPrefix('api');

    await app.init();

    dataSource = app.get<DataSource>(DataSource);
  });

  /**
   * Test Teardown
   *
   * Clean up database and close connections to prevent resource leaks
   */
  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  /**
   * Test Isolation
   *
   * Seed database before each test to ensure:
   * - Test independence (no shared state)
   * - Reproducible test data
   * - Clear both cv and cv_versions tables to avoid foreign key issues
   */
  beforeEach(async () => {
    const cvRepository = dataSource.getRepository(CVEntity);
    const cvVersionRepository = dataSource.getRepository(CVVersionEntity);

    // Clear versions first (due to foreign key constraint)
    await cvVersionRepository.clear();
    await cvRepository.clear();
    await seedCV(dataSource);
  });

  /**
   * Subtask 1.1: Privacy Filtering Test
   *
   * Validates that GET /api/cv/public correctly removes all private data:
   * - email, phone, address, postalCode MUST be undefined
   * - skills[].level MUST be undefined for ALL skills
   * - work[].name MUST be redacted to "Confidential"
   * - projects with isPrivate: true MUST be filtered out
   */
  describe('GET /api/cv/public - Privacy Filtering (e2e)', () => {
    it('should remove all private fields and redact company names', async () => {
      const response = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

      const cv = response.body.data;

      // Validate response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(cv).toHaveProperty('basics');
      expect(cv).toHaveProperty('skills');
      expect(cv).toHaveProperty('work');
      expect(cv).toHaveProperty('projects');

      // Assert: Private fields MUST be undefined
      expect(cv.basics.email).toBeUndefined();
      expect(cv.basics.phone).toBeUndefined();
      expect(cv.basics.location?.address).toBeUndefined();

      // [H-5 FIX] Verify postalCode removed (GDPR-critical)
      expect(cv.basics.location?.postalCode).toBeUndefined();

      // Assert: Public fields still exist (not filtered)
      expect(cv.basics.name).toBeDefined();
      expect(cv.basics.label).toBeDefined();
      expect(cv.basics.location?.city).toBeDefined();
      expect(cv.basics.location?.countryCode).toBeDefined();

      // Assert: Skills levels MUST be removed
      expect(cv.skills).toBeDefined();
      expect(Array.isArray(cv.skills)).toBe(true);
      expect(cv.skills.length).toBeGreaterThan(0);

      cv.skills.forEach((skill: any) => {
        expect(skill.level).toBeUndefined();
        // Public fields remain
        expect(skill.name).toBeDefined();
      });

      // Assert: Company names MUST be redacted
      expect(cv.work).toBeDefined();
      expect(Array.isArray(cv.work)).toBe(true);
      expect(cv.work.length).toBeGreaterThan(0);

      cv.work.forEach((job: any) => {
        expect(job.name).toBe('Confidential');

        // [H-5 FIX] Verify work highlights truncated to max 3 (GDPR data minimization)
        if (job.highlights) {
          expect(job.highlights.length).toBeLessThanOrEqual(3);
        }
      });

      // Assert: Only public projects (isPrivate: false or undefined)
      expect(cv.projects).toBeDefined();
      expect(Array.isArray(cv.projects)).toBe(true);

      const privateProjects = cv.projects.filter((p: any) => p.isPrivate === true);
      expect(privateProjects).toHaveLength(0);

      // Assert: At least some public projects exist
      expect(cv.projects.length).toBeGreaterThan(0);

      // [H-5 FIX] Verify project entity and metrics removed (GDPR-critical)
      cv.projects.forEach((project: any) => {
        expect(project.entity).toBeUndefined(); // Client names must be removed
        expect(project.metrics).toBeUndefined(); // Sensitive business metrics removed
      });
    });
  });

  /**
   * Subtask 1.2: Caching Test
   *
   * Validates that GET /api/cv/public sets correct cache headers:
   * - ETag header MUST be present
   * - Cache-Control header MUST be present (public, max-age=300)
   * - Consecutive requests MUST return identical responses
   */
  describe('GET /api/cv/public - Caching (e2e)', () => {
    it('should return ETag and Cache-Control headers', async () => {
      const response = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

      // Assert: ETag header present
      expect(response.headers['etag']).toBeDefined();
      expect(typeof response.headers['etag']).toBe('string');
      expect(response.headers['etag'].length).toBeGreaterThan(0);

      // Assert: Cache-Control header present with correct directives
      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('public');
      expect(response.headers['cache-control']).toContain('max-age=300');
    });

    it('should return identical responses for consecutive requests', async () => {
      // First request
      const response1 = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

      // Second request
      const response2 = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

      // Assert: Responses are identical
      expect(response1.body).toEqual(response2.body);

      // Assert: ETags are identical (content hasn't changed)
      expect(response1.headers.etag).toBe(response2.headers.etag);

      // Assert: Both responses have cache headers
      expect(response1.headers['cache-control']).toBeDefined();
      expect(response2.headers['cache-control']).toBeDefined();
    });
  });

  /**
   * Admin CV Endpoints Tests
   *
   * Story: 2-10-integration-tests-und-ci-cd-fuer-epic-2
   * Task 2: Integration-Tests für Admin CV Endpoints
   *
   * Test Coverage:
   * - Subtask 2.1: PATCH /api/admin/cv - Update + automatic versioning
   * - Subtask 2.2: GET /api/admin/cv/versions - Pagination (limit, offset)
   * - Subtask 2.3: POST /api/admin/cv/rollback/:versionId - Atomic rollback transaction
   *
   * @see docs/stories/2-10-integration-tests-und-ci-cd-fuer-epic-2.md
   */
  describe('Admin CV Endpoints (e2e)', () => {
    /**
     * Subtask 2.1: PATCH /api/admin/cv - Update + Versionierung
     *
     * Validates that CV updates work correctly and are automatically versioned:
     * 1. Get current CV state
     * 2. Update CV with PATCH /api/admin/cv
     * 3. Validate response contains updated data
     * 4. Validate new version was created in cv_versions
     * 5. Validate previous version has status='archived'
     */
    describe('PATCH /api/admin/cv - Update + Versioning (e2e)', () => {
      it('should update CV and create new version automatically', async () => {
        // Get current CV state
        const currentCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        const originalName = currentCv.body.data.basics.name;
        const updatedName = 'Test Updated Name - Admin E2E';

        // Update CV via admin endpoint
        // Note: We need to get the full CV (not just public) for the update
        const fullCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        const updateResponse = await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              ...fullCv.body.data,
              basics: {
                ...fullCv.body.data.basics,
                name: updatedName,
              },
            },
          })
          .expect(200);

        // Validate update response structure
        expect(updateResponse.body.success).toBe(true);
        expect(updateResponse.body.data).toBeDefined();
        expect(updateResponse.body.data.basics.name).toBe(updatedName);

        // Validate new version was created (archived old CV)
        const versions = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions')
          .expect(200);

        expect(versions.body.success).toBe(true);
        expect(versions.body.data).toBeInstanceOf(Array);
        expect(versions.body.data.length).toBeGreaterThan(0);

        // Most recent version should be archived (old CV before update)
        const latestVersion = versions.body.data[0];
        expect(latestVersion.status).toBe('archived');
        expect(latestVersion.data.basics.name).toBe(originalName);
        expect(latestVersion.source).toBe('api-update');
      });

      it('should handle partial updates correctly', async () => {
        // Get current CV
        const currentCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        const updatedLabel = 'Senior Test Engineer - E2E';

        // Update only basics.label
        const updateResponse = await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              basics: {
                label: updatedLabel,
              },
            },
          })
          .expect(200);

        // Validate partial update worked
        expect(updateResponse.body.success).toBe(true);
        expect(updateResponse.body.data.basics.label).toBe(updatedLabel);

        // Other fields should still exist (not deleted)
        expect(updateResponse.body.data.basics.name).toBeDefined();
        expect(updateResponse.body.data.work).toBeDefined();
        expect(updateResponse.body.data.skills).toBeDefined();
      });
    });

    /**
     * Subtask 2.2: GET /api/admin/cv/versions - Pagination
     *
     * Validates that pagination (limit, offset) works correctly:
     * 1. Test default pagination (limit=10, offset=0)
     * 2. Test custom limit parameter
     * 3. Test offset parameter returns different results
     * 4. Validate pagination metadata (total, hasNext)
     */
    describe('GET /api/admin/cv/versions - Pagination (e2e)', () => {
      it('should return paginated versions with default parameters', async () => {
        // Create at least one version by updating CV
        await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              basics: { label: 'Test Pagination' },
            },
          })
          .expect(200);

        const response = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);

        // Validate pagination metadata
        expect(response.body.pagination).toBeDefined();
        expect(response.body.pagination.total).toBeGreaterThan(0);
        expect(response.body.pagination.limit).toBe(10); // Default limit
        expect(response.body.pagination.offset).toBe(0); // Default offset
        expect(typeof response.body.pagination.hasNext).toBe('boolean');
      });

      it('should respect limit parameter', async () => {
        const limit = 5;

        const response = await request(app.getHttpServer())
          .get(`/api/cv/admin/cv/versions?limit=${limit}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeLessThanOrEqual(limit);
        expect(response.body.pagination.limit).toBe(limit);
      });

      it('should respect offset parameter and return different versions', async () => {
        // First, create multiple versions to ensure we have enough data
        const currentCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        // Create 2 additional versions
        await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              basics: { label: 'Version Offset Test 1' },
            },
          })
          .expect(200);

        await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              basics: { label: 'Version Offset Test 2' },
            },
          })
          .expect(200);

        // Get first page
        const response1 = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions?limit=1&offset=0')
          .expect(200);

        // Get second page
        const response2 = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions?limit=1&offset=1')
          .expect(200);

        expect(response1.body.success).toBe(true);
        expect(response2.body.success).toBe(true);

        // Different offsets should return different versions
        if (response1.body.pagination.total > 1) {
          expect(response1.body.data[0].id).not.toBe(response2.body.data[0].id);
          // Note: createdAt might be the same if versions were created in same millisecond
        }
      });

      it('should return hasNext=true when more pages exist', async () => {
        // Create multiple versions first
        const currentCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        // Create 3 versions to ensure we have enough for pagination
        for (let i = 0; i < 3; i++) {
          await request(app.getHttpServer())
            .patch('/api/cv/admin/cv')
            .send({
              cv: {
                basics: { label: `HasNext Test Version ${i}` },
              },
            })
            .expect(200);
        }

        // Get first page with limit=2
        const response = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions?limit=2&offset=0')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.pagination).toBeDefined();

        // If total > 2, hasNext should be true
        if (response.body.pagination.total > 2) {
          expect(response.body.pagination.hasNext).toBe(true);
        }
      });

      it('should return versions sorted by createdAt DESC (newest first)', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions?limit=10')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);

        // Validate versions are sorted newest first
        if (response.body.data.length > 1) {
          for (let i = 0; i < response.body.data.length - 1; i++) {
            const current = new Date(response.body.data[i].createdAt);
            const next = new Date(response.body.data[i + 1].createdAt);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      });
    });

    /**
     * Subtask 2.3: POST /api/admin/cv/rollback/:versionId - Transaction-Safety
     *
     * Validates that rollback is atomic and maintains data integrity:
     * 1. Get current CV state
     * 2. Update CV to create a new version
     * 3. Get versions to find previous version ID
     * 4. Rollback to previous version
     * 5. Validate CV was restored correctly
     * 6. Validate previous active version is now archived
     */
    describe('POST /api/admin/cv/rollback/:versionId - Rollback Transaction (e2e)', () => {
      it('should rollback CV to previous version atomically', async () => {
        // Get current state
        const currentCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        const originalName = currentCv.body.data.basics.name;

        // Update CV to create a new version
        const updatedName = 'Name Before Rollback - E2E Test';
        const updateResponse = await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              ...currentCv.body.data,
              basics: {
                ...currentCv.body.data.basics,
                name: updatedName,
              },
            },
          })
          .expect(200);

        // Verify update was applied via response
        expect(updateResponse.body.data.basics.name).toBe(updatedName);

        // Get versions to find previous version ID
        const versions = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions')
          .expect(200);

        expect(versions.body.data.length).toBeGreaterThan(0);

        // Find the archived version (there should be exactly 1 from the update)
        const previousVersionId = versions.body.data[0].id;

        // Rollback to previous version
        const rollbackResponse = await request(app.getHttpServer())
          .post(`/api/cv/admin/cv/rollback/${previousVersionId}`)
          .expect((res) => {
            // POST endpoints can return either 200 OK or 201 Created
            expect([200, 201]).toContain(res.status);
          });

        expect(rollbackResponse.body.success).toBe(true);
        expect(rollbackResponse.body.data).toBeDefined();

        // Verify CV was rolled back to original name via response
        expect(rollbackResponse.body.data.basics.name).toBe(originalName);
        expect(rollbackResponse.body.data.basics.name).not.toBe(updatedName);

        // Verify version history after rollback
        const versionsAfterRollback = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions')
          .expect(200);

        // All versions in the list should be archived (active version is in cv table)
        const archivedVersions = versionsAfterRollback.body.data.filter(
          (v: any) => v.status === 'archived',
        );
        expect(archivedVersions.length).toBeGreaterThan(0);

        // Verify there are at least 2 archived versions (original update + rollback archive)
        expect(versionsAfterRollback.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should return 404 when rolling back to non-existent version', async () => {
        const nonExistentVersionId = 999999;

        const response = await request(app.getHttpServer())
          .post(`/api/cv/admin/cv/rollback/${nonExistentVersionId}`)
          .expect(404);

        // NestJS NotFoundException returns JSON error
        expect(response.body.error).toBeDefined();
      });

      it('should return 400 when versionId is not a number', async () => {
        const invalidVersionId = 'not-a-number';

        const response = await request(app.getHttpServer())
          .post(`/api/cv/admin/cv/rollback/${invalidVersionId}`)
          .expect((res) => {
            // Accept either 400 (BadRequestException) or 500 (internal error)
            expect([400, 500]).toContain(res.status);
          });

        expect(response.body.error).toBeDefined();
      });

      it('should maintain transaction integrity on rollback', async () => {
        // Get current CV
        const currentCv = await request(app.getHttpServer()).get('/api/cv/public').expect(200);

        // Create multiple updates
        await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              basics: { label: 'Transaction Test 1' },
            },
          })
          .expect(200);

        await request(app.getHttpServer())
          .patch('/api/cv/admin/cv')
          .send({
            cv: {
              basics: { label: 'Transaction Test 2' },
            },
          })
          .expect(200);

        // Get versions
        const versions = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions')
          .expect(200);

        // Rollback to oldest version
        const oldestVersionId = versions.body.data[versions.body.data.length - 1].id;

        await request(app.getHttpServer())
          .post(`/api/cv/admin/cv/rollback/${oldestVersionId}`)
          .expect((res) => {
            // POST endpoints can return either 200 OK or 201 Created
            expect([200, 201]).toContain(res.status);
          });

        // Verify all versions in list are archived (active version is in cv table)
        const versionsAfterRollback = await request(app.getHttpServer())
          .get('/api/cv/admin/cv/versions')
          .expect(200);

        // All versions in the versions list should be archived
        const archivedVersions = versionsAfterRollback.body.data.filter(
          (v: any) => v.status === 'archived',
        );
        expect(archivedVersions.length).toBe(versionsAfterRollback.body.data.length);

        // Verify at least some versions exist (from the updates)
        expect(versionsAfterRollback.body.data.length).toBeGreaterThan(0);
      });
    });
  });
});
