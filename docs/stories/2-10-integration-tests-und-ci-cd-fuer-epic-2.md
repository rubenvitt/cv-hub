# Story 2.10: Integration Tests und CI/CD für Epic 2

Status: drafted

## Story

Als Entwickler,
möchte ich vollständige Integration-Tests für die CV-API,
damit Epic 2 stabil, regression-frei und produktionsbereit ist.

## Acceptance Criteria

**AC-1: Integration-Tests für CV-API-Endpoints**
- ✅ Test-Suite in `apps/backend/test/cv.e2e-spec.ts` existiert
- ✅ GET /api/cv/public testet Privacy-Filtering (email, phone, address entfernt)
- ✅ GET /api/cv/public testet Caching (ETag-Header vorhanden)
- ✅ PATCH /api/admin/cv testet Update + automatische Versionierung
- ✅ GET /api/admin/cv/versions testet Pagination (limit, offset)
- ✅ POST /api/admin/cv/rollback testet Rollback-Transaction
- ✅ Alle Tests passing lokal: `npm run test:e2e`

**AC-2: Test-Coverage >= 90% für CV-Module**
- ✅ CV Controller: >= 90% Coverage
- ✅ CV Service: >= 95% Coverage (Business Logic kritisch)
- ✅ Privacy Filter Service: 100% Coverage (Security-kritisch)
- ✅ Coverage-Report generiert: `npm run test:cov`
- ✅ Coverage-Report zeigt >= 90% Overall für `src/modules/cv/`

**AC-3: Unit-Tests für kritische Module**
- ✅ Shared Types: Zod-Schema-Validierung getestet
- ✅ Privacy Filter: Alle Private Fields validiert
- ✅ CV Service: Transaktions-Logik getestet (Rollback bei Fehler)

**AC-4: CI/CD-Pipeline integriert Epic 2 Tests**
- ✅ GitHub Actions Workflow `.github/workflows/ci.yml` erweitert
- ✅ Pipeline-Job für Epic 2 Tests existiert
- ✅ Pipeline läuft:
  - Unit-Tests (Shared Types + Backend)
  - Integration-Tests (CV API)
  - Migration-Tests (Schema-Validierung)
- ✅ Alle Tests passing in CI (grüner Build)
- ✅ Code-Coverage-Report in CI generiert

**AC-5: Migration-Tests**
- ✅ Test validiert `cv` Tabelle existiert
- ✅ Test validiert `cv_versions` Tabelle existiert
- ✅ Test validiert Indexes angelegt sind
- ✅ Test validiert Foreign Key Constraint funktioniert
- ✅ Test validiert Status Check Constraint enforced wird

## Tasks / Subtasks

- [ ] **Task 1: Integration-Tests für Public CV Endpoint** (AC: #1)
  - [ ] Subtask 1.1: Test erstellen für GET /api/cv/public - Privacy-Filtering
    - Assertions: email, phone, address sind undefined
    - Assertions: work[].name ist "Confidential"
    - Assertions: nur public projects enthalten
  - [ ] Subtask 1.2: Test erstellen für GET /api/cv/public - Caching
    - ETag-Header vorhanden
    - Cache-Control Header gesetzt
    - Response identisch bei erneutem Request

- [ ] **Task 2: Integration-Tests für Admin CV Endpoints** (AC: #1)
  - [ ] Subtask 2.1: Test für PATCH /api/admin/cv - Update + Versionierung
    - CV wird aktualisiert
    - Neue Version in cv_versions erstellt
    - Status der alten Version ist 'archived'
  - [ ] Subtask 2.2: Test für GET /api/admin/cv/versions - Pagination
    - Limit/Offset Query-Params funktionieren
    - Response enthält pagination Object
  - [ ] Subtask 2.3: Test für POST /api/admin/cv/rollback - Rollback
    - CV wird auf alte Version zurückgesetzt
    - Aktuelle Version wird archiviert
    - Transaction ist atomar

- [ ] **Task 3: Unit-Tests für kritische Services** (AC: #2, #3)
  - [ ] Subtask 3.1: Privacy Filter Service Unit-Tests
    - Test alle Private Fields entfernt werden
    - Test Company-Namen redacted werden
    - Test Projects gefiltert werden (isPrivate)
    - 100% Coverage sicherstellen
  - [ ] Subtask 3.2: CV Service Unit-Tests
    - Test getCV mit 'public' Context
    - Test getCV mit 'authenticated' Context
    - Test updateCV Transaction (Rollback bei Fehler)

- [ ] **Task 4: Migration-Tests** (AC: #5)
  - [ ] Subtask 4.1: Test-Suite in apps/backend/test/migrations.spec.ts
    - Test cv Tabelle existiert
    - Test cv_versions Tabelle existiert
    - Test Indexes existieren
    - Test Constraints funktionieren

- [ ] **Task 5: CI/CD-Pipeline erweitern** (AC: #4)
  - [ ] Subtask 5.1: GitHub Actions Workflow erweitern
    - Epic 2 Test-Job hinzufügen
    - Unit-Tests laufen
    - Integration-Tests laufen
    - Migration-Tests laufen
  - [ ] Subtask 5.2: Code-Coverage-Report in CI
    - Jest Coverage aktivieren
    - Report in CI-Logs anzeigen
    - Optional: Coverage zu GitHub hochladen

- [ ] **Task 6: Test-Coverage-Validierung** (AC: #2)
  - [ ] Subtask 6.1: Coverage lokal generieren: npm run test:cov
    - Prüfen: CV Module >= 90%
    - Prüfen: Privacy Filter = 100%
    - Screenshots/Logs für Dokumentation

## Dev Notes

### Testing Strategy

**Test-Pyramide für Epic 2:**
```
         /\
        /  \      E2E Tests (Optional - Frontend)
       /    \
      /------\
     /        \
    /  Integ.  \  Integration Tests (Primary Focus)
   /   Tests    \ - API Endpoints (Supertest)
  /--------------\- Database operations (TypeORM)
 /                \- Privacy Filter Service
/  Unit Tests      \ Unit Tests (Foundation)
--------------------\- Zod Schema validation
                     - Privacy Filter Logic
                     - Utility functions
```

**Testing-Stack:**
- **Unit Tests:** Jest (Backend), Vitest (Shared Types)
- **Integration Tests:** Jest + Supertest für HTTP-Assertions
- **Database Tests:** TypeORM Test-Setup mit In-Memory SQLite
- **CI/CD:** GitHub Actions (bereits in Epic 1 etabliert)

**Coverage-Ziele:**
- Privacy Filter Service: **100%** (Security-kritisch, DSGVO-relevant)
- CV Service: **95%** (Business Logic, Transaktionen)
- CV Controller: **90%** (HTTP-Layer)
- Overall CV Module: **>= 90%**

### Architecture Constraints

**Aus Tech-Spec Epic 2:**
- Integration-Tests MÜSSEN Privacy-Filtering vollständig validieren
- Alle Admin-Endpoints benötigen Transaction-Tests (Rollback-Sicherheit)
- Migration-Tests sichern DB-Schema-Integrität

**Aus Architecture:**
- Testing folgt Epic 1 Patterns (Jest-Config, Test-Setup)
- CI/CD nutzt existierenden GitHub Actions Workflow
- Test-Datenbank: SQLite In-Memory für schnelle Tests

**Performance-Anforderungen:**
- Integration-Tests: < 10 Sekunden Gesamtlaufzeit
- Unit-Tests: < 2 Sekunden
- CI/CD-Pipeline: Epic 2 Tests < 30 Sekunden

### Project Structure Notes

**Test-Dateien:**
```
apps/backend/
├── src/modules/cv/
│   ├── services/
│   │   ├── cv.service.spec.ts (Unit-Tests)
│   │   └── privacy-filter.service.spec.ts (Unit-Tests)
│   └── controllers/
│       └── cv.controller.spec.ts (Unit-Tests)
├── test/
│   ├── cv.e2e-spec.ts (Integration-Tests)
│   └── migrations.spec.ts (Migration-Tests)
└── package.json (test scripts)

packages/shared-types/
└── src/
    └── cv-schema.spec.ts (Zod-Validation-Tests)
```

**CI/CD-Workflow-Struktur:**
```yaml
# .github/workflows/ci.yml
jobs:
  test-epic-2:
    runs-on: ubuntu-latest
    steps:
      - Shared Types Unit-Tests
      - Backend Unit-Tests
      - Backend Integration-Tests
      - Migration-Tests
      - Coverage-Report generieren
```

### Testing Patterns

**Privacy-Filtering-Tests (Kritisch!):**
```typescript
// apps/backend/test/cv.e2e-spec.ts
describe('GET /api/cv/public', () => {
  it('should remove all private fields', () => {
    return request(app.getHttpServer())
      .get('/api/cv/public')
      .expect(200)
      .expect((res) => {
        // Private fields MÜSSEN undefined sein
        expect(res.body.data.basics.email).toBeUndefined();
        expect(res.body.data.basics.phone).toBeUndefined();
        expect(res.body.data.basics.location?.address).toBeUndefined();
        expect(res.body.data.skills?.[0].level).toBeUndefined();

        // Redacted fields
        expect(res.body.data.work?.[0].name).toBe('Confidential');

        // Only public projects
        const privateProjects = res.body.data.projects?.filter(
          (p: Project) => p.isPrivate === true
        );
        expect(privateProjects).toHaveLength(0);
      });
  });
});
```

**Transaction-Tests:**
```typescript
// apps/backend/src/modules/cv/services/cv.service.spec.ts
describe('CVService.updateCV', () => {
  it('should rollback transaction on error', async () => {
    // Mock database error
    jest.spyOn(cvRepository, 'save').mockRejectedValueOnce(new Error('DB Error'));

    await expect(service.updateCV({ basics: { name: 'Fail' } }))
      .rejects.toThrow();

    // Verify CV not updated (transaction rolled back)
    const cv = await service.getCV('public');
    expect(cv.basics.name).not.toBe('Fail');
  });
});
```

**Migration-Tests:**
```typescript
// apps/backend/test/migrations.spec.ts
describe('CV Migrations', () => {
  it('should create cv and cv_versions tables', async () => {
    await dataSource.runMigrations();

    const tables = await dataSource.query(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );

    expect(tables).toContainEqual({ name: 'cv' });
    expect(tables).toContainEqual({ name: 'cv_versions' });
  });
});
```

### References

**Source Documents:**
- [Tech-Spec Epic 2](/Users/rubeen/dev/personal/lebenslauf/docs/tech-spec-epic-2.md) - Section: Test Strategy Summary, AC-10
- [Epics](/Users/rubeen/dev/personal/lebenslauf/docs/epics.md) - Epic 2, Story 2.10
- [Architecture](/Users/rubeen/dev/personal/lebenslauf/docs/architecture.md) - Section: Testing Stack
- [PRD](/Users/rubeen/dev/personal/lebenslauf/docs/PRD.md) - Success Criteria: Code-Qualität, Wartbarkeit

**Related Stories:**
- Story 2.1-2.9: Alle Epic 2 Features (Prerequisites für Tests)
- Story 1.7-1.8: CI/CD-Pipeline-Grundlagen

**External References:**
- Jest Documentation: https://jestjs.io/docs/getting-started
- Supertest: https://github.com/ladjs/supertest
- TypeORM Testing: https://typeorm.io/testing

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Developer agent will fill this in during implementation -->

### Debug Log References

<!-- Links to debug logs will be added during implementation -->

### Completion Notes List

<!-- Developer will add completion notes here -->

### File List

<!-- Files created/modified will be listed here -->
