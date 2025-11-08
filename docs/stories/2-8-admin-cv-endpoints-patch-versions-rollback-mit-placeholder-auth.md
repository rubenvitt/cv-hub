# Story 2.8: Admin CV Endpoints (PATCH, Versions, Rollback) mit Placeholder Auth

Status: drafted

## Story

Als Entwickler,
möchte ich Admin-Endpoints für CV-Management implementieren,
damit der Admin (Epic 5) CVs updaten, Versionshistorie einsehen und Rollbacks durchführen kann.

## Acceptance Criteria

1. **Placeholder AdminAuthGuard erstellt** (Epic 5 ersetzt durch Session-Auth):
   - Guard existiert in `apps/backend/src/modules/cv/guards/admin-auth.guard.ts`
   - Logged Warning: "Placeholder Guard - Epic 5 implements real admin auth"
   - Returns 501 Not Implemented oder Bypass für Epic 2 Testing
   - Kommentar: "TODO Epic 5: Implement real AdminAuthGuard with session validation"

2. **PATCH /api/admin/cv implementiert**:
   - Endpoint unter `@Patch('/admin/cv')` in CVController
   - Validiert Request Body mit Zod: `UpdateCVDto` (Partial CV Schema)
   - Ruft `CVService.updateCV(updateDto.cv)` auf
   - Returns updated CV mit Response Format: `{ success: true, data: CV, message: string }`
   - Fehler-Handling: 400 Bad Request bei Validation Error, 401 bei fehlendem Auth (Placeholder)
   - Integration-Test validiert Update + Versionierung

3. **GET /api/admin/cv/versions implementiert**:
   - Endpoint unter `@Get('/admin/cv/versions')` mit Query Params: `limit` (default: 10), `offset` (default: 0)
   - `CVService.getVersions(limit, offset)` method implementiert
   - Returns Array von `CVVersionResponseDto` mit Feldern: `id`, `status`, `source`, `createdAt`, `data`
   - Response enthält Pagination Object: `{ total, limit, offset, hasNext }`
   - Versionen sortiert nach `createdAt DESC` (neueste zuerst)
   - Integration-Test validiert Pagination-Logic

4. **POST /api/admin/cv/rollback/:versionId implementiert**:
   - Endpoint unter `@Post('/admin/cv/rollback/:versionId')`
   - `CVService.rollback(versionId)` method implementiert mit Transaction:
     - Archiviert aktuelle CV als Version mit `source: 'rollback'`, `status: 'archived'`
     - Restored versionId Daten zu aktueller CV (UPDATE cv SET data = version_data)
     - Committed Transaction oder Rollback bei Fehler
   - Returns restored CV: `{ success: true, data: CV, message: 'Successfully rolled back to version X' }`
   - Fehler-Handling: 404 Not Found bei nicht-existenter Version, 500 bei Transaction-Fehler
   - Integration-Test validiert Rollback-Transaction

5. **DTOs erstellt**:
   - `UpdateCVDto` in `apps/backend/src/modules/cv/dto/update-cv.dto.ts`: `{ cv: Partial<CV> }`
   - `CVVersionResponseDto` in `apps/backend/src/modules/cv/dto/cv-version-response.dto.ts`
   - Swagger Decorators (`@ApiProperty()`) für alle DTO-Felder

6. **Integration-Tests** für alle 3 Endpoints in `apps/backend/test/cv.e2e-spec.ts`:
   - PATCH /api/admin/cv: Update erstellt Version, CV wird aktualisiert
   - GET /api/admin/cv/versions: Pagination funktioniert, Sortierung korrekt
   - POST /api/admin/cv/rollback: Rollback stellt vorherige Version wieder her

## Tasks / Subtasks

- [ ] **Task 1: Placeholder AdminAuthGuard erstellen** (AC: 1)
  - [ ] Subtask 1.1: Guard-Datei erstellen in `guards/admin-auth.guard.ts`
  - [ ] Subtask 1.2: Implement `canActivate()` mit Placeholder-Logic (Log Warning, Return true/false)
  - [ ] Subtask 1.3: TODO-Kommentar hinzufügen für Epic 5 Integration

- [ ] **Task 2: UpdateCVDto und CVVersionResponseDto erstellen** (AC: 5)
  - [ ] Subtask 2.1: `update-cv.dto.ts` mit Zod-Validation (Partial CVSchema)
  - [ ] Subtask 2.2: `cv-version-response.dto.ts` mit Swagger Decorators
  - [ ] Subtask 2.3: DTOs in cv.module.ts registrieren

- [ ] **Task 3: PATCH /api/admin/cv Endpoint implementieren** (AC: 2)
  - [ ] Subtask 3.1: Controller-Method `@Patch('/admin/cv')` mit AdminAuthGuard
  - [ ] Subtask 3.2: Zod-Validation-Pipe für UpdateCVDto
  - [ ] Subtask 3.3: `CVService.updateCV()` aufrufen
  - [ ] Subtask 3.4: Response-Mapping: `{ success, data, message }`
  - [ ] Subtask 3.5: Error-Handling: 400 Validation, 401 Unauthorized (Placeholder), 500 Server Error

- [ ] **Task 4: CVService.getVersions() method implementieren** (AC: 3)
  - [ ] Subtask 4.1: Method `getVersions(limit, offset)` in cv.service.ts
  - [ ] Subtask 4.2: TypeORM Query mit Pagination: `LIMIT` und `OFFSET`
  - [ ] Subtask 4.3: Sortierung: `ORDER BY createdAt DESC`
  - [ ] Subtask 4.4: Count-Query für `total` und `hasNext` Berechnung
  - [ ] Subtask 4.5: Response-Mapping zu CVVersionResponseDto

- [ ] **Task 5: GET /api/admin/cv/versions Endpoint implementieren** (AC: 3)
  - [ ] Subtask 5.1: Controller-Method `@Get('/admin/cv/versions')` mit Query Params
  - [ ] Subtask 5.2: Default-Values setzen: `limit=10`, `offset=0`
  - [ ] Subtask 5.3: `CVService.getVersions()` aufrufen
  - [ ] Subtask 5.4: Pagination-Object hinzufügen: `{ total, limit, offset, hasNext }`

- [ ] **Task 6: CVService.rollback() method implementieren** (AC: 4)
  - [ ] Subtask 6.1: Method `rollback(versionId)` in cv.service.ts
  - [ ] Subtask 6.2: Version laden: TypeORM `findOne({ where: { id: versionId } })`
  - [ ] Subtask 6.3: Check if version exists → 404 NotFoundException
  - [ ] Subtask 6.4: Transaction starten: `queryRunner.startTransaction()`
  - [ ] Subtask 6.5: Aktuelle CV archivieren: INSERT cv_versions (status='archived', source='rollback')
  - [ ] Subtask 6.6: CV restoren: UPDATE cv SET data = version.data
  - [ ] Subtask 6.7: Transaction committen oder Rollback bei Fehler
  - [ ] Subtask 6.8: Restored CV zurückgeben

- [ ] **Task 7: POST /api/admin/cv/rollback/:versionId Endpoint implementieren** (AC: 4)
  - [ ] Subtask 7.1: Controller-Method `@Post('/admin/cv/rollback/:versionId')` mit AdminAuthGuard
  - [ ] Subtask 7.2: Param Validation: `versionId` als Number
  - [ ] Subtask 7.3: `CVService.rollback()` aufrufen
  - [ ] Subtask 7.4: Response-Mapping: `{ success, data, message }`
  - [ ] Subtask 7.5: Error-Handling: 404 Version nicht gefunden, 500 Transaction-Fehler

- [ ] **Task 8: Swagger-Dokumentation für Admin-Endpoints** (AC: 5)
  - [ ] Subtask 8.1: `@ApiTags('Admin CV')` auf Admin-Endpoints setzen
  - [ ] Subtask 8.2: `@ApiOperation()` mit Summary und Description für alle 3 Endpoints
  - [ ] Subtask 8.3: `@ApiResponse()` Decorators für Status Codes: 200, 400, 401, 404, 500
  - [ ] Subtask 8.4: `@ApiProperty()` auf DTOs für Auto-Generated Schemas
  - [ ] Subtask 8.5: Swagger UI manuell testen: `/api/docs` zeigt Admin-Endpoints

- [ ] **Task 9: Integration-Tests für Admin-Endpoints** (AC: 6)
  - [ ] Subtask 9.1: Test `PATCH /api/admin/cv` erstellt Version bei Update
  - [ ] Subtask 9.2: Test `PATCH /api/admin/cv` mit Invalid Data → 400 Bad Request
  - [ ] Subtask 9.3: Test `GET /api/admin/cv/versions` mit Pagination
  - [ ] Subtask 9.4: Test `GET /api/admin/cv/versions` Sortierung DESC
  - [ ] Subtask 9.5: Test `POST /api/admin/cv/rollback/:versionId` restored CV
  - [ ] Subtask 9.6: Test `POST /api/admin/cv/rollback` mit nicht-existenter Version → 404

## Dev Notes

### Context aus Tech Spec Epic 2

**Architektur-Kontext:**
- Epic 2 implementiert die CV Data Foundation mit JSON Resume Schema als Single Source of Truth
- Privacy-First Data Filtering: Public/Private Subsets basierend auf Zugriffs-Context
- Versionierung ist core Feature: Jedes CV-Update erstellt automatisch Backup (CVVersion Entity)
- Admin-Endpoints sind für Epic 5 (Link Management Dashboard) vorbereitet, benötigen aber vorerst nur Placeholder-Auth

**Service-Layer Pattern:**
- `CVService` ist Business Logic Layer zwischen Controller und Repository
- Transaktionen für atomare Operations (Update + Version creation, Rollback)
- Error-Handling: NotFoundException, InternalServerErrorException
- Zod-Validation in Service Layer via `CVSchema.partial().parse()`

**API-Design:**
Admin-Endpoints folgen RESTful Patterns:
- `PATCH /api/admin/cv` - Partial Update (nur geänderte Felder)
- `GET /api/admin/cv/versions` - Collection Resource mit Pagination
- `POST /api/admin/cv/rollback/:versionId` - Action Resource (nicht idempotent)

### Datenbank-Schema

**CV Entity:**
```typescript
@Entity('cv')
export class CVEntity {
  @PrimaryGeneratedColumn()
  id: number; // Always 1 for MVP (single user)

  @Column({ type: 'text' })
  data: string; // JSON string (CVSchema serialized)

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**CVVersion Entity:**
```typescript
@Entity('cv_versions')
export class CVVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cvId: number; // Foreign key to cv.id (always 1)

  @Column({ type: 'text' })
  data: string; // JSON string (snapshot)

  @Column({ type: 'varchar', length: 20 })
  status: 'draft' | 'active' | 'archived';

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: 'manual' | 'api-update' | 'ai-extraction' | 'rollback' | null;

  @CreateDateColumn()
  createdAt: Date;
}
```

### CVService Methods (Tech Spec Reference)

**updateCV(updateDto: Partial<CV>):**
```typescript
async updateCV(updateDto: Partial<CV>): Promise<CV> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // 1. Load current CV
    const currentCV = await this.cvRepository.findOne({ where: { id: 1 } });

    // 2. Archive current version
    await queryRunner.manager.save(CVVersionEntity, {
      cvId: 1,
      data: currentCV.data,
      status: 'archived',
      source: 'api-update'
    });

    // 3. Merge update with current CV
    const currentData = JSON.parse(currentCV.data);
    const mergedData = { ...currentData, ...updateDto };

    // 4. Validate merged data
    const validatedCV = CVSchema.parse(mergedData);

    // 5. Update CV
    await queryRunner.manager.update(CVEntity, { id: 1 }, {
      data: JSON.stringify(validatedCV)
    });

    await queryRunner.commitTransaction();
    return validatedCV;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new InternalServerErrorException('Failed to update CV');
  } finally {
    await queryRunner.release();
  }
}
```

**getVersions(limit, offset):**
```typescript
async getVersions(limit: number, offset: number) {
  const [versions, total] = await this.cvVersionRepository.findAndCount({
    where: { cvId: 1 },
    order: { createdAt: 'DESC' },
    take: limit,
    skip: offset
  });

  return {
    data: versions.map(v => ({
      id: v.id,
      status: v.status,
      source: v.source,
      createdAt: v.createdAt.toISOString(),
      data: JSON.parse(v.data)
    })),
    pagination: {
      total,
      limit,
      offset,
      hasNext: offset + limit < total
    }
  };
}
```

**rollback(versionId):**
```typescript
async rollback(versionId: number): Promise<CV> {
  const version = await this.cvVersionRepository.findOne({
    where: { id: versionId }
  });

  if (!version) {
    throw new NotFoundException(`Version ${versionId} does not exist`);
  }

  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // 1. Archive current CV
    const currentCV = await this.cvRepository.findOne({ where: { id: 1 } });
    await queryRunner.manager.save(CVVersionEntity, {
      cvId: 1,
      data: currentCV.data,
      status: 'archived',
      source: 'rollback'
    });

    // 2. Restore version data to current CV
    await queryRunner.manager.update(CVEntity, { id: 1 }, {
      data: version.data
    });

    await queryRunner.commitTransaction();

    const restoredCV = JSON.parse(version.data);
    return CVSchema.parse(restoredCV);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new InternalServerErrorException('Failed to rollback CV');
  } finally {
    await queryRunner.release();
  }
}
```

### Testing Strategy (Tech Spec AC-5, AC-6, AC-7)

**Integration Tests (apps/backend/test/cv.e2e-spec.ts):**

1. **PATCH /api/admin/cv** (AC-5):
   - Valid Update → 200 OK, CV updated, Version archived
   - Invalid Data → 400 Bad Request mit Zod Validation Errors
   - Transaction Rollback bei Database-Error

2. **GET /api/admin/cv/versions** (AC-6):
   - Pagination funktioniert: limit=5 returns max 5 versions
   - Sortierung DESC: Neueste Version zuerst
   - Pagination-Object korrekt: total, limit, offset, hasNext

3. **POST /api/admin/cv/rollback/:versionId** (AC-7):
   - Valid Rollback → 200 OK, CV restored, alte CV archived
   - Nicht-existente Version → 404 Not Found
   - Transaction-Safety: Bei Fehler kein Datenverlust

### Project Structure Notes

**Module Structure:**
```
apps/backend/src/modules/cv/
├── controllers/
│   └── cv.controller.ts (Public + Admin Endpoints)
├── services/
│   ├── cv.service.ts (Business Logic)
│   └── privacy-filter.service.ts (Public Filtering)
├── entities/
│   ├── cv.entity.ts
│   └── cv-version.entity.ts
├── guards/
│   ├── admin-auth.guard.ts (Placeholder für Epic 5)
│   └── invite.guard.ts (Placeholder für Epic 4)
├── dto/
│   ├── update-cv.dto.ts (neu in dieser Story)
│   ├── cv-version-response.dto.ts (neu)
│   └── get-cv-response.dto.ts (existiert bereits)
└── cv.module.ts
```

**Dependencies:**
- Story 2.5 (CVService steht) - **CRITICAL**: CVService muss existieren und getCV() method implementiert haben
- Story 2.2 (Entities + Migration) - CVEntity und CVVersionEntity müssen existieren
- Epic 1 (NestJS Backend, TypeORM, Zod) - Foundation muss stehen

### Placeholder Guard Pattern

**AdminAuthGuard (apps/backend/src/modules/cv/guards/admin-auth.guard.ts):**
```typescript
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO Epic 5: Implement real AdminAuthGuard with session validation
    // For now: Log warning and bypass for Epic 2 testing

    console.warn('⚠️  Placeholder AdminAuthGuard - Epic 5 implements real admin auth');

    // Option A: Return 501 Not Implemented (strict)
    // throw new HttpException('Admin authentication not yet implemented. See Epic 5.', HttpStatus.NOT_IMPLEMENTED);

    // Option B: Bypass for Epic 2 testing (permissive)
    return true;
  }
}
```

**Rationale für Bypass (Option B):**
- Epic 2 kann Admin-Endpoints testen ohne Epic 5 Dependency
- Integration-Tests können Admin-Funktionalität validieren
- Epic 5 ersetzt Guard mit echter Session-Validation
- Developer-Kommentar macht Placeholder transparent

### Security Notes (aus Tech Spec)

**Input Validation:**
- Zod Schema Validation für alle Admin-Inputs (UpdateCVDto)
- TypeORM Parameterized Queries (kein SQL Injection Risk)
- VersionId als Number validiert (NestJS Pipe)

**Transaction Safety:**
- Atomare Operations: Update + Version creation in Transaction
- Rollback bei Fehler → Keine Partial Updates
- Error-Logging mit Pino

**DSGVO-Compliance:**
- Versionierung ermöglicht Audit-Trail
- Rollback-Funktionalität für "Right to Erasure" vorbereitet
- Admin-Actions werden geloggt (Epic 5 fügt User-Context hinzu)

### References

**Tech Spec Sections:**
- [AC-5: PATCH /api/admin/cv aktualisiert CV mit Versionierung](docs/tech-spec-epic-2.md#AC-5)
- [AC-6: GET /api/admin/cv/versions liefert Versionshistorie](docs/tech-spec-epic-2.md#AC-6)
- [AC-7: POST /api/admin/cv/rollback/:versionId stellt vorherige Version wieder her](docs/tech-spec-epic-2.md#AC-7)
- [Workflows and Sequencing → CV Update Flow](docs/tech-spec-epic-2.md#workflows-and-sequencing)
- [Workflows and Sequencing → Rollback Flow](docs/tech-spec-epic-2.md#workflows-and-sequencing)

**Architecture References:**
- [API Design → Admin API](docs/architecture.md#api-design)
- [Backend Stack → NestJS + TypeORM](docs/architecture.md#backend-stack)
- [Security → Transaction Safety](docs/architecture.md#security)

**PRD References:**
- [FR-5: Admin CV Management](docs/PRD.md#functional-requirements)

### Learnings from Previous Story

**Previous Story Status:** Story 2-7-get-api-cv-private-token-endpoint-placeholder-guard (Status: drafted)

Da die vorherige Story noch nicht implementiert wurde, gibt es keine Implementation Learnings. Story 2.8 kann unabhängig entwickelt werden, da sie primär Admin-Endpoints betrifft, während Story 2.7 den Token-basierten Private-Endpoint implementiert.

**Hinweis:** Falls Story 2.7 parallel oder vor Story 2.8 implementiert wird, ist auf folgende Punkte zu achten:
- Beide Stories erweitern `cv.controller.ts` → Merge-Konflikte vermeiden
- Beide Stories nutzen `CVService.getCV()` → Ensure Method ist vollständig implementiert (aus Story 2.5)
- Placeholder Guards (InviteGuard, AdminAuthGuard) sollten konsistent implementiert sein (gleiche Log-Messages, gleiches Pattern)

## Change Log

- **2025-11-06**: Story erstellt von Bob (SM Agent) via *create-story workflow - Status: drafted
