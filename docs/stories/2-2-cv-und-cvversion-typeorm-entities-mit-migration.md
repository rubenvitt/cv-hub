# Story 2.2: CV und CVVersion TypeORM Entities mit Migration

Status: drafted

## Story

Als Entwickler,
möchte ich TypeORM-Entities für CV-Daten und Versionierung,
damit CV-Daten persistent in SQLite gespeichert werden können.

## Acceptance Criteria

1. ✅ `CVEntity` existiert in `apps/backend/src/modules/cv/entities/cv.entity.ts`
   - Felder: `id` (primary key), `data` (text, JSON string), `updatedAt` (datetime)
2. ✅ `CVVersionEntity` existiert in `apps/backend/src/modules/cv/entities/cv-version.entity.ts`
   - Felder: `id`, `cvId`, `data`, `status`, `source`, `fileHash`, `createdAt`
   - Status Constraint: `'draft' | 'active' | 'archived'`
   - Foreign Key: `cvId` → `cv.id`
3. ✅ Migration `CreateCVTables` erstellt Tabellen `cv` und `cv_versions`
4. ✅ Indexes angelegt: `idx_cv_versions_cv_id`, `idx_cv_versions_status`, `idx_cv_versions_created_at`
5. ✅ Migration läuft erfolgreich: `npm run migration:run`
6. ✅ SQLite-Schema validiert: Tabellen existieren in `data/cv-hub.db`

## Tasks / Subtasks

- [ ] Task 1: CVEntity erstellen (AC: #1)
  - [ ] Subtask 1.1: Modul-Ordner erstellen: `apps/backend/src/modules/cv/entities/`
  - [ ] Subtask 1.2: `cv.entity.ts` erstellen mit TypeORM Decorators
  - [ ] Subtask 1.3: Felder definieren: `id` (PrimaryGeneratedColumn), `data` (Column text), `updatedAt` (UpdateDateColumn)
  - [ ] Subtask 1.4: Entity in `cv.module.ts` registrieren (TypeOrmModule.forFeature)

- [ ] Task 2: CVVersionEntity erstellen (AC: #2)
  - [ ] Subtask 2.1: `cv-version.entity.ts` erstellen
  - [ ] Subtask 2.2: Felder definieren: `id` (PrimaryGeneratedColumn), `cvId` (Column), `data` (Column text), `status` (Column varchar mit Check Constraint), `source` (Column varchar nullable), `fileHash` (Column varchar nullable), `createdAt` (CreateDateColumn)
  - [ ] Subtask 2.3: Foreign Key Relation zu CVEntity definieren: `@ManyToOne(() => CVEntity)` + `@JoinColumn({ name: 'cvId' })`
  - [ ] Subtask 2.4: Entity in `cv.module.ts` registrieren

- [ ] Task 3: TypeORM Migration erstellen (AC: #3, #4)
  - [ ] Subtask 3.1: Migration generieren: `npm run migration:generate -- -n CreateCVTables`
  - [ ] Subtask 3.2: Migration-File anpassen in `apps/backend/src/database/migrations/`
  - [ ] Subtask 3.3: `up()` Method implementieren:
    - CREATE TABLE cv (id, data, updated_at)
    - CREATE TABLE cv_versions (id, cv_id, data, status, source, file_hash, created_at)
    - CHECK Constraint für status IN ('draft', 'active', 'archived')
    - FOREIGN KEY (cv_id) REFERENCES cv(id)
  - [ ] Subtask 3.4: Indexes hinzufügen:
    - CREATE INDEX idx_cv_versions_cv_id ON cv_versions(cv_id)
    - CREATE INDEX idx_cv_versions_status ON cv_versions(status)
    - CREATE INDEX idx_cv_versions_created_at ON cv_versions(created_at DESC)
  - [ ] Subtask 3.5: `down()` Method implementieren: DROP TABLE cv_versions, DROP TABLE cv

- [ ] Task 4: Migration ausführen und validieren (AC: #5, #6)
  - [ ] Subtask 4.1: Migration ausführen: `npm run migration:run` in backend
  - [ ] Subtask 4.2: SQLite-Schema prüfen: `sqlite3 data/cv-hub.db ".schema cv"`
  - [ ] Subtask 4.3: SQLite-Schema prüfen: `sqlite3 data/cv-hub.db ".schema cv_versions"`
  - [ ] Subtask 4.4: Indexes verifizieren: `sqlite3 data/cv-hub.db ".indexes cv_versions"`
  - [ ] Subtask 4.5: Foreign Key Constraint testen: Versuche INSERT mit ungültiger cv_id

## Dev Notes

### Kontext: TypeORM Entities als Persistence-Layer

Diese Story implementiert die Datenbank-Ebene für cv-hub's CV-Management. Die Entities folgen dem **JSON-Document-Pattern**: CV-Daten werden als JSON-String in einer TEXT-Column gespeichert, nicht als relationale Tabellen. Das hat mehrere strategische Vorteile:

**Warum JSON-Column statt relational?**
1. **Schema-Flexibilität:** JSON Resume Standard kann sich entwickeln, keine Breaking Changes in DB
2. **Versionierung einfach:** Ganzer CV-Snapshot in einer Row, nicht über 10 Tabellen verteilt
3. **Zod-Validierung zentral:** Runtime-Validation im Code, nicht DB-Constraints
4. **SQLite-Vorteile:** JSON1-Extension ermöglicht json_extract() für Queries wenn nötig
5. **Einfache Backups:** Ganze CV als JSON exportierbar

**Architektur-Pattern: Immutable Versioning**

Jede CV-Änderung erstellt eine neue Version in `cv_versions`. Die `cv` Tabelle enthält immer den aktuellen Stand. Versions sind **append-only**: Niemals Updates oder Deletes, nur Status-Changes. Das garantiert:
- Audit Trail (wer hat wann was geändert?)
- Rollback-Support (jederzeit zu vorheriger Version zurück)
- Debugging (Fehlerhafte KI-Extraktionen nachvollziehbar)
- DSGVO-Compliance (Data-Access-History)

**Source-Tracking:**
- `manual`: Admin hat direkt im Dashboard editiert
- `api-update`: CV via PATCH /api/admin/cv aktualisiert
- `ai-extraction`: Gemini hat CV aus PDF extrahiert (Epic 6)
- `rollback`: Restore zu vorheriger Version

**fileHash-Feld:**
- SHA-256 Hash von Input-Files (PDF/Text) für Epic 6
- Verhindert Duplikate: Gleiche PDF → keine neue Version
- Ermöglicht Diff-Ansicht: "Welche PDF führte zu diesem CV?"

### Project Structure Notes

**Monorepo-Integration:**
```
cv-hub/
├── apps/
│   └── backend/
│       ├── src/
│       │   ├── modules/
│       │   │   └── cv/                # Neues CV-Modul (diese Story)
│       │   │       ├── entities/
│       │   │       │   ├── cv.entity.ts
│       │   │       │   └── cv-version.entity.ts
│       │   │       └── cv.module.ts
│       │   ├── database/
│       │   │   └── migrations/
│       │   │       └── TIMESTAMP-CreateCVTables.ts
│       └── data/                      # SQLite DB (gitignored)
│           └── cv-hub.db
├── packages/
│   └── shared-types/                  # Bereits existiert (Story 2.1)
│       └── src/cv-schema.ts
```

**TypeORM Module Registration:**
```typescript
// apps/backend/src/modules/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CVEntity } from './entities/cv.entity';
import { CVVersionEntity } from './entities/cv-version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CVEntity, CVVersionEntity])
  ],
  // Controllers und Services kommen in späteren Stories
})
export class CVModule {}
```

**App-Module Integration:**
```typescript
// apps/backend/src/app.module.ts
import { CVModule } from './modules/cv/cv.module';

@Module({
  imports: [
    // ... Epic 1 Module (TypeOrmModule.forRoot)
    CVModule, // Neu hinzufügen
  ],
})
export class AppModule {}
```

### Implementierungs-Details aus Tech-Spec

**1. CV Entity (Tech-Spec Lines 164-178):**
```typescript
// apps/backend/src/modules/cv/entities/cv.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

**Wichtige Details:**
- `id`: Immer 1 im MVP (Single-User-System)
- `data`: TEXT column für JSON-String (SQLite unterstützt bis 1GB)
- `updatedAt`: Automatisch von TypeORM aktualisiert bei Änderungen
- Kein `createdAt` auf CV (da nur 1 Row, Timestamps in Versions)

**2. CV Version Entity (Tech-Spec Lines 183-211):**
```typescript
// apps/backend/src/modules/cv/entities/cv-version.entity.ts
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { CVEntity } from './cv.entity';

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

  @Column({ type: 'varchar', length: 64, nullable: true })
  fileHash: string | null; // SHA-256 (für Deduplication bei KI-Extraktion)

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CVEntity)
  @JoinColumn({ name: 'cvId' })
  cv: CVEntity;
}
```

**Wichtige Details:**
- `id`: Auto-Increment (jede Version bekommt neue ID)
- `cvId`: Immer 1 im MVP (alle Versions gehören zu CV id=1)
- `status`: TypeScript Union Type wird zu VARCHAR(20) in SQLite
- `source`: Nullable für backwards-compatibility (alte Versions ohne Source)
- `fileHash`: SHA-256 = 64 Hex-Zeichen
- `@ManyToOne`: TypeORM Relation (nicht in DB-Schema, nur TypeScript)

**3. Migration SQL (Tech-Spec Lines 1218-1244):**
```typescript
// apps/backend/src/database/migrations/TIMESTAMP-CreateCVTables.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCVTables1699012345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // CV Main Table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cv (
        id INTEGER PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // CV Versions Table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cv_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cv_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        status VARCHAR(20) NOT NULL CHECK(status IN ('draft', 'active', 'archived')),
        source VARCHAR(50),
        file_hash VARCHAR(64),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cv_id) REFERENCES cv(id)
      )
    `);

    // Indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_cv_versions_cv_id ON cv_versions(cv_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_cv_versions_status ON cv_versions(status)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_cv_versions_created_at ON cv_versions(created_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cv_versions`);
    await queryRunner.query(`DROP TABLE IF EXISTS cv`);
  }
}
```

**SQLite-Spezifika:**
- `INTEGER PRIMARY KEY`: Implizit AUTOINCREMENT für cv_versions.id
- `CHECK` Constraint: SQLite unterstützt CHECK constraints nativ
- `FOREIGN KEY`: Muss aktiviert sein: `PRAGMA foreign_keys = ON;` (in TypeORM Config)
- `IF NOT EXISTS`: Idempotent, mehrfaches Ausführen sicher
- Index `DESC`: Versions absteigend sortiert (neueste zuerst)

### Testing Strategy

**Migration Testing:**
```bash
# 1. Migration ausführen
cd apps/backend
npm run migration:run

# 2. Schema validieren
sqlite3 data/cv-hub.db ".schema cv"
# Expected Output:
# CREATE TABLE cv (
#   id INTEGER PRIMARY KEY,
#   data TEXT NOT NULL,
#   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
# );

sqlite3 data/cv-hub.db ".schema cv_versions"
# Expected Output:
# CREATE TABLE cv_versions (...) mit CHECK constraint

# 3. Indexes prüfen
sqlite3 data/cv-hub.db ".indexes cv_versions"
# Expected Output: idx_cv_versions_cv_id, idx_cv_versions_status, idx_cv_versions_created_at

# 4. Foreign Key Constraint testen
sqlite3 data/cv-hub.db "INSERT INTO cv_versions (cv_id, data, status) VALUES (999, '{}', 'draft')"
# Expected: FOREIGN KEY constraint failed (cv_id=999 existiert nicht)

# 5. Check Constraint testen
sqlite3 data/cv-hub.db "INSERT INTO cv_versions (cv_id, data, status) VALUES (1, '{}', 'invalid')"
# Expected: CHECK constraint failed (status nicht in Enum)
```

**Integration Test (Future Story):**
```typescript
// apps/backend/test/cv-entities.e2e-spec.ts
describe('CV Entities', () => {
  it('should create CV and Version', async () => {
    const cv = await cvRepository.save({ id: 1, data: '{}' });
    const version = await versionRepository.save({
      cvId: 1,
      data: '{}',
      status: 'active',
      source: 'manual'
    });

    expect(cv.id).toBe(1);
    expect(version.cvId).toBe(1);
  });

  it('should enforce Foreign Key constraint', async () => {
    await expect(
      versionRepository.save({ cvId: 999, data: '{}', status: 'draft' })
    ).rejects.toThrow(); // FK violation
  });

  it('should enforce Status Check constraint', async () => {
    await expect(
      versionRepository.save({ cvId: 1, data: '{}', status: 'invalid' })
    ).rejects.toThrow(); // CHECK constraint
  });
});
```

### Learnings from Previous Story

**From Story 2.1: JSON Resume Schema mit Zod (Status: drafted)**

Die vorherige Story hat das CVSchema-Package in shared-types erstellt. Wichtige Erkenntnisse:

- **Zod-Schema vorhanden:** `packages/shared-types/src/cv-schema.ts` exportiert CVSchema
- **TypeScript Types inferiert:** `type CV = z.infer<typeof CVSchema>` verfügbar
- **Package baut erfolgreich:** `pnpm build` funktioniert in shared-types
- **Keine Implementation-Learnings:** Story 2.1 ist noch drafted (nicht implementiert)

**Expected Foundation aus Epic 1:**
- ✅ TypeORM ist konfiguriert in `apps/backend/src/database/typeorm.config.ts`
- ✅ SQLite-Datenbank initialisiert: `data/cv-hub.db`
- ✅ Migration-Commands verfügbar: `npm run migration:generate`, `npm run migration:run`
- ✅ Foreign Keys aktiviert: `PRAGMA foreign_keys = ON;` in TypeORM Config

**Hinweise für diese Story:**
- Kein Code aus vorherigen Stories zu wiederverwenden (erste DB-Story)
- Nutze Epic 1 TypeORM-Setup für Migrations
- Verifiziere Foreign Keys aktiviert (PRAGMA check)
- Teste Constraints manuell (SQLite CLI)

**Integration mit Story 2.1:**
- Diese Story (2.2) erstellt DB-Schema
- Story 2.1 (CVSchema) definiert JSON-Structure
- Verbindung: `cv.data` Column enthält JSON-serialisierten CVSchema
- Service-Layer (Story 2.5) wird JSON.parse(cv.data) + CVSchema.parse() machen

### References

**Primäre Quellen:**
- [Tech Spec Epic 2: Lines 162-211](../tech-spec-epic-2.md#data-models-and-contracts) - Entity Definitionen
- [Tech Spec Epic 2: Lines 1218-1284](../tech-spec-epic-2.md#dependencies-and-integrations) - Migration SQL
- [Epics: Lines 312-336](../epics.md#story-22-cv-und-cvversion-typeorm-entities-mit-migration) - Story 2.2 ACs
- [Architecture: Lines 153-171](../architecture.md#backend-stack) - TypeORM + SQLite Stack Decision

**TypeORM Dokumentation:**
- Entity Decorators: https://typeorm.io/entities
- Migrations: https://typeorm.io/migrations
- Relations: https://typeorm.io/many-to-one-one-to-many-relations

**SQLite Dokumentation:**
- CHECK Constraints: https://www.sqlite.org/lang_createtable.html#check_constraints
- Foreign Keys: https://www.sqlite.org/foreignkeys.html
- Indexes: https://www.sqlite.org/lang_createindex.html

**Traceability:**
- **PRD Requirement FR-2:** CV-Daten-Management (JSON Resume Schema)
- **Architecture Decision:** SQLite als Persistence Layer (Architecture Lines 158)
- **Epic 2 Objective:** CV Data Foundation mit Versionierung

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Agent model name and version will be added during implementation -->

### Debug Log References

<!-- Links to debug logs will be added during implementation -->

### Completion Notes List

<!-- Completion notes will be added by Dev Agent after implementation -->

### File List

<!-- Created/Modified/Deleted files will be tracked here by Dev Agent -->
