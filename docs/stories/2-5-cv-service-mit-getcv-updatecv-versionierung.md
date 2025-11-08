# Story 2.5: CV Service mit getCV, updateCV, Versionierung

Status: drafted

## Story

Als Entwickler,
möchte ich einen CV Service für Business-Logic,
damit CV-Daten konsistent verwaltet und versioniert werden können.

## Acceptance Criteria

1. `CVService` existiert in `apps/backend/src/modules/cv/services/cv.service.ts`
2. Method `getCV(context: 'public' | 'authenticated')` implementiert:
   - Lädt CV aus Database über TypeORM Repository
   - Validiert Daten gegen `CVSchema` (Zod)
   - Ruft `PrivacyFilterService.filterPublicSubset()` bei `context: 'public'`
   - Returns vollständigen CV bei `context: 'authenticated'`
   - Wirft `NotFoundException` wenn kein CV existiert
3. Method `updateCV(updateDto: Partial<CV>)` implementiert:
   - Startet TypeORM Transaction (`QueryRunner`)
   - Archiviert aktuelle Version: INSERT in `cv_versions` mit `status: 'archived'`, `source: 'api-update'`
   - Updated CV: UPDATE `cv.data` mit neuen Daten (merge mit bestehendem CV)
   - Committed Transaction bei Erfolg
   - Rollback bei Fehler
   - Returns aktualisiertes CV
4. Method `getVersions(limit: number, offset: number)` implementiert:
   - Lädt CV-Versionen aus `cv_versions` Tabelle
   - Sortierung nach `createdAt DESC` (neueste zuerst)
   - Pagination mit LIMIT/OFFSET
   - Returns Array von `CVVersionEntity` mit Metadata
5. Method `rollback(versionId: number)` implementiert:
   - Lädt spezifische Version aus `cv_versions`
   - Wirft `NotFoundException` bei nicht-existenter Version
   - Startet Transaction
   - Archiviert aktuelle Version mit `source: 'rollback'`
   - Restored Version-Daten in `cv` Tabelle
   - Committed Transaction
   - Returns restored CV
6. Error Handling:
   - Database-Fehler → `InternalServerErrorException`
   - Validation-Fehler (Zod) → `BadRequestException` mit Details
   - Not Found → `NotFoundException` mit klarer Message
   - Transaction-Fehler → Rollback + Error-Logging
7. Structured Logging (Pino):
   - CV-Load-Operations geloggt (INFO-Level)
   - CV-Updates geloggt mit Version-ID (INFO)
   - Errors geloggt mit Stack Trace (ERROR)
8. Unit-Tests für alle Service-Methoden:
   - Happy Path für `getCV` (public + authenticated)
   - Happy Path für `updateCV` mit Versionierung
   - Transaction-Rollback bei DB-Fehler
   - Error Cases (Not Found, Validation Error)
   - Mock PrivacyFilterService, TypeORM Repository

## Tasks / Subtasks

- [ ] Task 1: CV Service Basis erstellen (AC: 1)
  - [ ] Subtask 1.1: `CVService` Class in `apps/backend/src/modules/cv/services/cv.service.ts` erstellen
  - [ ] Subtask 1.2: Constructor mit Dependencies: `CVRepository`, `PrivacyFilterService`, `Logger`, `DataSource` (für Transactions)
  - [ ] Subtask 1.3: Service in `CVModule` registrieren

- [ ] Task 2: getCV Method implementieren (AC: 2)
  - [ ] Subtask 2.1: Method-Signature: `async getCV(context: 'public' | 'authenticated'): Promise<CV>`
  - [ ] Subtask 2.2: CV aus Database laden (`cvRepository.findOne({ where: { id: 1 } })`)
  - [ ] Subtask 2.3: NotFoundException werfen wenn CV nicht existiert
  - [ ] Subtask 2.4: JSON-String parsen und Zod-Validation (`CVSchema.parse()`)
  - [ ] Subtask 2.5: Conditional Logic: Bei `context: 'public'` → PrivacyFilter aufrufen
  - [ ] Subtask 2.6: Return filtered oder full CV
  - [ ] Subtask 2.7: Try-Catch-Block für Error Handling

- [ ] Task 3: updateCV Method implementieren (AC: 3)
  - [ ] Subtask 3.1: Method-Signature: `async updateCV(updateDto: Partial<CV>): Promise<CV>`
  - [ ] Subtask 3.2: Aktuelle CV laden (via `getCV('authenticated')`)
  - [ ] Subtask 3.3: Deep-Merge: Partial Update mit bestehendem CV
  - [ ] Subtask 3.4: Zod-Validation des gemergten CVs
  - [ ] Subtask 3.5: Transaction starten (`this.dataSource.createQueryRunner()`)
  - [ ] Subtask 3.6: Archive Step: INSERT `CVVersionEntity` mit current CV, `status: 'archived'`, `source: 'api-update'`
  - [ ] Subtask 3.7: Update Step: UPDATE `cv` mit neuen Daten
  - [ ] Subtask 3.8: Commit Transaction
  - [ ] Subtask 3.9: Catch-Block: Rollback Transaction + Log Error + Throw
  - [ ] Subtask 3.10: Finally-Block: Release QueryRunner

- [ ] Task 4: getVersions Method implementieren (AC: 4)
  - [ ] Subtask 4.1: Method-Signature: `async getVersions(limit: number = 10, offset: number = 0): Promise<CVVersionEntity[]>`
  - [ ] Subtask 4.2: TypeORM Query: `cvVersionRepository.find({ order: { createdAt: 'DESC' }, take: limit, skip: offset })`
  - [ ] Subtask 4.3: Return Versions-Array

- [ ] Task 5: rollback Method implementieren (AC: 5)
  - [ ] Subtask 5.1: Method-Signature: `async rollback(versionId: number): Promise<CV>`
  - [ ] Subtask 5.2: Version laden: `cvVersionRepository.findOne({ where: { id: versionId } })`
  - [ ] Subtask 5.3: NotFoundException werfen bei nicht-existenter Version
  - [ ] Subtask 5.4: Transaction starten
  - [ ] Subtask 5.5: Archive Step: INSERT current CV mit `source: 'rollback'`
  - [ ] Subtask 5.6: Restore Step: UPDATE `cv` mit Version-Daten
  - [ ] Subtask 5.7: Commit Transaction
  - [ ] Subtask 5.8: Catch-Block: Rollback + Error
  - [ ] Subtask 5.9: Return restored CV

- [ ] Task 6: Error Handling und Logging (AC: 6, 7)
  - [ ] Subtask 6.1: Pino Logger in Constructor injizieren
  - [ ] Subtask 6.2: Log CV-Load: `this.logger.info('CV loaded', { context })`
  - [ ] Subtask 6.3: Log CV-Update: `this.logger.info('CV updated', { versionId })`
  - [ ] Subtask 6.4: Log Errors mit Stack Trace: `this.logger.error('Operation failed', error)`
  - [ ] Subtask 6.5: Structured Error-Messages für alle Exceptions

- [ ] Task 7: Unit Tests schreiben (AC: 8)
  - [ ] Subtask 7.1: Test-File: `apps/backend/src/modules/cv/services/cv.service.spec.ts` erstellen
  - [ ] Subtask 7.2: Mock Setup: CVRepository, PrivacyFilterService, DataSource, QueryRunner
  - [ ] Subtask 7.3: Test: `getCV('public')` calls PrivacyFilter
  - [ ] Subtask 7.4: Test: `getCV('authenticated')` returns full CV
  - [ ] Subtask 7.5: Test: `getCV` throws NotFoundException when CV missing
  - [ ] Subtask 7.6: Test: `updateCV` creates version and updates CV
  - [ ] Subtask 7.7: Test: `updateCV` rolls back transaction on error
  - [ ] Subtask 7.8: Test: `getVersions` returns paginated list
  - [ ] Subtask 7.9: Test: `rollback` restores previous version
  - [ ] Subtask 7.10: Test: `rollback` throws NotFoundException for invalid versionId
  - [ ] Subtask 7.11: Coverage-Check: Mindestens 90% für CVService

## Dev Notes

### Architecture Patterns & Constraints

**Service Layer Pattern (Tech Spec: Services and Modules)**
- CVService ist die zentrale Business-Logic-Komponente für CV-Verwaltung
- Trennt Controller-Layer (HTTP) von Data-Layer (Repository)
- Dependency Injection über NestJS für Testability

**Privacy-by-Design (Tech Spec: Privacy-Filtering Logic)**
- `getCV(context)` entscheidet automatisch über Filterung
- Public Context → PrivacyFilterService entfernt sensible Daten
- Authenticated Context → Vollständiger CV ohne Filterung
- Fail-Closed: Bei Filter-Fehler → Exception (kein ungefilterter CV)

**Transactional Integrity (Tech Spec: Workflows → CV Update Flow)**
- Versionierung IMMER vor CV-Update (atomic operation)
- Bei Fehler: Rollback → Kein CV-Verlust
- QueryRunner-Pattern für explizite Transaction-Control

**TypeORM Patterns:**
- Repository-Pattern für DB-Zugriff
- Entities repräsentieren Tabellen (`CVEntity`, `CVVersionEntity`)
- Migrations verwalten Schema-Änderungen

**Error Handling Strategy:**
- DB-Fehler → InternalServerErrorException (500)
- Validation-Fehler → BadRequestException (400)
- Not Found → NotFoundException (404)
- Alle Errors geloggt mit Pino (strukturiert)

### Source Tree Components

**Relevante Dateien/Module:**
```
apps/backend/src/modules/cv/
├── services/
│   ├── cv.service.ts               # Diese Story: CV Business Logic
│   ├── cv.service.spec.ts          # Unit Tests
│   └── privacy-filter.service.ts   # Story 2.4: Filterung
├── entities/
│   ├── cv.entity.ts                # Story 2.2: CV-Daten
│   └── cv-version.entity.ts        # Story 2.2: Versionen
└── cv.module.ts                    # NestJS Module Config
```

**Dependencies:**
- `@nestjs/typeorm` - TypeORM Integration
- `typeorm` - ORM mit Transaction-Support
- `@cv-hub/shared-types` - CVSchema (Zod)
- `nestjs-pino` - Structured Logging

### Testing Standards

**Unit Tests (Jest):**
- Mock alle Dependencies (Repository, DataSource, PrivacyFilter)
- Test Happy Paths UND Error Cases
- Transaction-Rollback-Tests wichtig (schwierig ohne echte DB)
- Coverage-Target: 90%+

**Mock-Pattern für TypeORM:**
```typescript
const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    save: jest.fn(),
    update: jest.fn(),
  },
};
```

**Test-Coverage-Bereiche:**
- Alle Public Methods (getCV, updateCV, getVersions, rollback)
- Error Handling (DB-Fehler, Validation-Fehler, Not Found)
- Transaction-Rollback (wichtiger Edge-Case)
- Privacy-Filter-Integration

### Lessons from Previous Story

**From Story 2-4-privacy-filter-service-fuer-public-private-data-filtering (Status: drafted)**

⚠️ **Note:** Die vorherige Story wurde erst gedraftet, noch nicht implementiert. Daher keine Implementation-Learnings verfügbar.

**Expected Integration:**
- CVService wird PrivacyFilterService konsumieren
- Integration über Constructor Injection (NestJS DI)
- Filter-Call nur bei Public-Context
- Immutable Pattern: Filter gibt neues CV-Objekt zurück (Original bleibt unverändert)

**Wichtig für diese Story:**
- Sicherstellen dass PrivacyFilterService korrekt injected wird
- Error Handling wenn Filter fehlschlägt (fail-closed)
- Unit Tests müssen PrivacyFilter mocken

### Implementation Guidance

**Merge-Strategie für Partial Updates:**
```typescript
// Deep-Merge-Beispiel
const currentCV = await this.getCV('authenticated');
const updatedCV = {
  ...currentCV,
  ...updateDto,
  basics: {
    ...currentCV.basics,
    ...updateDto.basics,
  },
  // etc. für nested objects
};
```

**Transaction-Pattern (TypeORM):**
```typescript
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  // Archive current
  await queryRunner.manager.save(CVVersionEntity, { ... });

  // Update CV
  await queryRunner.manager.update(CVEntity, { id: 1 }, { ... });

  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  this.logger.error('Transaction failed', error);
  throw new InternalServerErrorException('Failed to update CV');
} finally {
  await queryRunner.release();
}
```

**Zod Validation:**
- Prefer `CVSchema.safeParse()` für kontrolliertes Error-Handling
- Bei Fehlern: ZodError in BadRequestException umwandeln
- Field-Level-Errors für bessere API-Responses

### References

**Tech Spec Sections:**
- [Services and Modules → CV Service](../tech-spec-epic-2.md#services-and-modules) - Service-Responsibilities und Methoden
- [Data Models and Contracts → CV Entity](../tech-spec-epic-2.md#data-models-and-contracts) - Entity-Strukturen
- [Workflows and Sequencing → CV Update Flow](../tech-spec-epic-2.md#workflows-and-sequencing) - Transaction-Flow
- [Non-Functional Requirements → Reliability](../tech-spec-epic-2.md#reliabilityavailability) - Error Handling, Transaktionen

**Epic Breakdown:**
- [Story 2.5: CV Service mit getCV, updateCV, Versionierung](../epics.md#story-25-cv-service-mit-getcv-updatecv-versionierung) - User Story und AC

**PRD Sections:**
- [FR-6: CV-Daten-Management](../PRD.md#fr-6-cv-daten-management) - Versionierung und Wartung
- [Non-Functional Requirements → Reliability](../PRD.md#reliabilityavailability) - Error Handling

**Previous Stories:**
- [Story 2.2: CV und CVVersion TypeORM Entities mit Migration](../stories/2-2-cv-und-cvversion-typeorm-entities-mit-migration.md) - Entities für DB-Zugriff
- [Story 2.4: Privacy Filter Service](../stories/2-4-privacy-filter-service-fuer-public-private-data-filtering.md) - Filterung für Public-Context

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be added during development_

### Completion Notes List

_To be added after implementation_

### File List

_Files created/modified during implementation will be tracked here_
