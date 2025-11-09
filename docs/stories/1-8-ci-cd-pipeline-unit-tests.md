# Story 1.8: CI/CD-Pipeline Unit-Tests

Status: ready-for-dev

## Story

Als Entwickler,
möchte ich automatische Unit-Tests in der CI-Pipeline,
damit Regressionen früh erkannt werden.

## Acceptance Criteria

1. **Vitest für Frontend konfiguriert** (in `apps/frontend`)
   - Vitest v2.1.8+ installiert
   - Test-Setup mit `@testing-library/react` und `@testing-library/jest-dom`
   - Vitest-Config in `apps/frontend/vitest.config.ts`
   - Test-Script in `apps/frontend/package.json`: `"test": "vitest run"`

2. **Jest für Backend konfiguriert** (in `apps/backend`)
   - Jest v29.7.0+ installiert
   - Jest-Config in `apps/backend/jest.config.js`
   - Supertest für HTTP-Assertions installiert
   - Test-Script in `apps/backend/package.json`: `"test": "jest"`

3. **Mindestens 1 Dummy-Test pro App**
   - Backend: Health-Check Integration-Test (`GET /api/health` liefert 200)
   - Frontend: Smoke-Test (z.B. Root-Component rendert ohne Fehler)
   - Beide Tests laufen erfolgreich lokal

4. **GitHub Actions Workflow führt Tests aus**
   - `.github/workflows/ci.yml` erweitert um Test-Job
   - Tests laufen parallel zu Linting/Type-Checking
   - Backend-Tests: `cd apps/backend && pnpm test`
   - Frontend-Tests: `cd apps/frontend && pnpm test`
   - Job schlägt fehl wenn Tests fehlschlagen (Exit Code != 0)

5. **Test-Coverage-Report wird generiert**
   - Coverage-Report wird generiert (Terminal-Output)
   - Optional: Coverage-Report als Artifact hochladen
   - Optional: Coverage-Badge für README

6. **Workflow schlägt fehl bei fehlgeschlagenen Tests**
   - PR kann nicht gemerged werden wenn Tests fehlschlagen
   - Status-Check blockiert Merge
   - Klare Fehlermeldung in GitHub Actions Log

## Tasks / Subtasks

- [ ] **Task 1: Vitest für Frontend konfigurieren** (AC: #1)
  - [ ] 1.1 Installiere Vitest-Dependencies: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`
  - [ ] 1.2 Erstelle `apps/frontend/vitest.config.ts` mit Vite-Plugin und Test-Environment (`jsdom`)
  - [ ] 1.3 Füge Test-Scripts zu `apps/frontend/package.json` hinzu: `test`, `test:watch`, `test:coverage`
  - [ ] 1.4 Erstelle Test-Setup-File: `apps/frontend/test/setup.ts` (importiere `@testing-library/jest-dom`)

- [ ] **Task 2: Jest für Backend konfigurieren** (AC: #2)
  - [ ] 2.1 Installiere Jest-Dependencies (sollten bereits vorhanden sein via `@nestjs/testing`)
  - [ ] 2.2 Überprüfe/erstelle `apps/backend/jest.config.js` (NestJS preset)
  - [ ] 2.3 Installiere Supertest für HTTP-Tests: `pnpm add -D supertest @types/supertest`
  - [ ] 2.4 Füge Test-Scripts zu `apps/backend/package.json` hinzu: `test`, `test:watch`, `test:cov`

- [ ] **Task 3: Backend Health-Check Test schreiben** (AC: #3)
  - [ ] 3.1 Erstelle `apps/backend/test/health.e2e-spec.ts`
  - [ ] 3.2 Schreibe Integration-Test: `GET /api/health` → Status 200, Body-Schema-Validation
  - [ ] 3.3 Führe Test lokal aus: `cd apps/backend && pnpm test`
  - [ ] 3.4 Verifiziere: Test passed

- [ ] **Task 4: Frontend Smoke-Test schreiben** (AC: #3)
  - [ ] 4.1 Erstelle `apps/frontend/test/App.test.tsx` (oder Root-Component-Test)
  - [ ] 4.2 Schreibe Smoke-Test: Root-Component rendert ohne Errors, erwarteter Text vorhanden
  - [ ] 4.3 Führe Test lokal aus: `cd apps/frontend && pnpm test`
  - [ ] 4.4 Verifiziere: Test passed

- [ ] **Task 5: GitHub Actions Workflow um Test-Jobs erweitern** (AC: #4, #6)
  - [ ] 5.1 Öffne `.github/workflows/ci.yml`
  - [ ] 5.2 Füge neuen Job `test` hinzu (parallel zu `lint`, `type-check`)
  - [ ] 5.3 Job-Steps:
    - Setup Node.js 20 LTS
    - Install Dependencies: `pnpm install`
    - Run Backend Tests: `cd apps/backend && pnpm test`
    - Run Frontend Tests: `cd apps/frontend && pnpm test`
  - [ ] 5.4 Committe Workflow-Änderung und pushe zu GitHub
  - [ ] 5.5 Verifiziere: GitHub Actions läuft, Test-Job ist grün

- [ ] **Task 6: Coverage-Report konfigurieren** (AC: #5)
  - [ ] 6.1 Backend: Füge `test:cov` Script hinzu (Jest Coverage)
  - [ ] 6.2 Frontend: Füge `test:coverage` Script hinzu (Vitest Coverage)
  - [ ] 6.3 Optional: Generiere Coverage-Report als Artifact in GitHub Actions
  - [ ] 6.4 Optional: Füge Coverage-Badge zu README hinzu

## Dev Notes

### Testing-Strategie aus Tech Spec Epic 1

**Test Pyramid:**
- **Unit Tests:** 70%+ Coverage für kritische Logic
- **Integration Tests:** 90%+ für API-Endpoints (Backend Health-Check)
- **Build Verification:** 100% (alle Workspaces müssen builden)

**Tools:**
- Backend: Jest v29.7.0 + Supertest (HTTP-Assertions)
- Frontend: Vitest v2.1.8 + React Testing Library

**Performance-Ziele:**
- Test Suite Execution: <30 Sekunden (alle Unit Tests)
- CI/CD Pipeline (Total): <5 Minuten

### Architektur-Constraints

**Test-Isolation:**
- Jeder Test ist unabhängig (keine shared state)
- Database: In-Memory SQLite für Backend-Tests (schneller als File-based)
- Frontend: jsdom Environment (Browser-Simulation)

**Naming Convention:**
```typescript
describe('HealthController', () => {
  describe('GET /api/health', () => {
    it('should return 200 when database is connected', ...);
    it('should return 503 when database is disconnected', ...);
  });
});
```

**Arrange-Act-Assert (AAA) Pattern:**
```typescript
it('should return health status', async () => {
  // Arrange
  const app = await createTestApp();

  // Act
  const response = await request(app.getHttpServer())
    .get('/api/health');

  // Assert
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('ok');
});
```

### Project Structure Notes

**Test-File-Locations:**
- Backend Unit Tests: `apps/backend/src/**/*.spec.ts` (co-located mit Source)
- Backend Integration Tests: `apps/backend/test/**/*.e2e-spec.ts`
- Frontend Tests: `apps/frontend/test/**/*.test.tsx` oder co-located `src/**/*.test.tsx`

**Coverage-Reporting:**
- Backend: `apps/backend/coverage/` (generiert von Jest)
- Frontend: `apps/frontend/coverage/` (generiert von Vitest)
- Reports sind in `.gitignore` (nicht committen)

### References

- [Source: docs/tech-spec-epic-1.md#Test-Strategy-Summary]
- [Source: docs/tech-spec-epic-1.md#Dependencies-and-Integrations (Testing Section)]
- [Source: docs/tech-spec-epic-1.md#Workflows-and-Sequencing (CI/CD Pipeline Sequence)]
- [Source: docs/epics.md#Story-1.8]

### Learnings from Previous Story

Story 1.7 (CI/CD-Pipeline mit GitHub Actions - Linting & Type-Check) ist noch im Status "drafted" und wurde noch nicht implementiert. Daher gibt es keine Learnings aus der vorherigen Story.

**Wichtige Kontextinformationen:**
- Story 1.8 baut auf Story 1.7 auf (CI-Pipeline-Basis muss existieren)
- `.github/workflows/ci.yml` sollte bereits existieren (aus Story 1.7)
- Falls Story 1.7 noch nicht abgeschlossen ist: Zuerst Story 1.7 implementieren

## Dev Agent Record

### Context Reference

- `docs/stories/1-8-ci-cd-pipeline-unit-tests.context.xml` (Generated: 2025-11-08)

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
