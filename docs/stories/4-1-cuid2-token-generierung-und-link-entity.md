# Story 4.1: CUID2-Token-Generierung und Link-Entity

Status: drafted

## Story

Als Backend-Entwickler,
möchte ich eine sichere Token-Generierung und Link-Datenbank-Entity,
damit personalisierte Links eindeutig und kollisionsfrei erstellt werden können.

## Acceptance Criteria

1. CUID2-Library (`@paralleldrive/cuid2`) ist installiert und konfiguriert
2. `InviteEntity` (TypeORM) existiert mit allen Feldern:
   - `id` (Primary Key, Auto-Increment)
   - `token` (TEXT, UNIQUE, 25 Zeichen)
   - `personalizedMessage` (TEXT, nullable)
   - `expiresAt` (DATETIME, nullable)
   - `isActive` (BOOLEAN, default: true)
   - `visitCount` (INTEGER, default: 0)
   - `lastVisitAt` (DATETIME, nullable)
   - `createdAt`, `updatedAt` (Timestamps)
3. Indizes existieren: `idx_invite_token` (unique), `idx_invite_active` (isActive, expiresAt)
4. TypeORM Migration generiert und erfolgreich ausgeführt
5. Token-Generierung liefert 25-Zeichen CUID2-Strings (URL-safe)
6. Unit-Test: 10.000 generierte Tokens sind eindeutig (keine Kollisionen)

## Tasks / Subtasks

- [ ] Task 1: CUID2-Library installieren und konfigurieren (AC: #1)
  - [ ] 1.1: `@paralleldrive/cuid2` via pnpm im Backend-Workspace installieren
  - [ ] 1.2: Token-Generierung-Helper-Function erstellen (z.B. `generateInviteToken()`)
  - [ ] 1.3: Unit-Test: Generierte Tokens sind 25 Zeichen lang und URL-safe

- [ ] Task 2: InviteEntity mit TypeORM erstellen (AC: #2, #3)
  - [ ] 2.1: Entity-Datei `apps/backend/src/modules/invite/entities/invite.entity.ts` anlegen
  - [ ] 2.2: Alle Felder mit TypeORM-Decorators definieren (`@Column`, `@PrimaryGeneratedColumn`, etc.)
  - [ ] 2.3: Indizes hinzufügen: `@Index('idx_invite_token')` auf token, Composite-Index auf (isActive, expiresAt)
  - [ ] 2.4: Entity im InviteModule registrieren (TypeORM `imports: [TypeOrmModule.forFeature([InviteEntity])]`)

- [ ] Task 3: TypeORM-Migration für invite-Tabelle erstellen (AC: #4)
  - [ ] 3.1: Migration generieren: `pnpm run typeorm:migration:generate --name=CreateInviteTable`
  - [ ] 3.2: Migration-File überprüfen (SQL für CREATE TABLE, Indexes, Constraints)
  - [ ] 3.3: Migration ausführen: `pnpm run typeorm:migration:run`
  - [ ] 3.4: SQLite-Datenbank verifizieren: `invite` Tabelle existiert mit korrektem Schema

- [ ] Task 4: Unit-Tests für Token-Generierung und Entity (AC: #5, #6)
  - [ ] 4.1: Test-Suite `invite.entity.spec.ts` erstellen
  - [ ] 4.2: Test: 10.000 Token-Generierungen → keine Duplikate (Set.size === 10000)
  - [ ] 4.3: Test: Token-Format validieren (Regex für URL-safe Zeichen)
  - [ ] 4.4: Test: InviteEntity-Instanz erstellen und validieren (alle Default-Werte korrekt)

- [ ] Task 5: Integration-Test für Database-Persistierung (AC: #4)
  - [ ] 5.1: Test-Datenbank-Setup für Integration-Tests (in-memory SQLite oder Test-DB)
  - [ ] 5.2: Integration-Test: InviteEntity speichern und laden (Repository-Test)
  - [ ] 5.3: Integration-Test: Unique-Constraint auf token testen (duplicate insert → error)

## Dev Notes

### Architektur-Kontext

**Epic 4 Kontext:**
Diese Story legt das Fundament für das Token-Based Access Control Pattern (Architecture Pattern 2). Die `InviteEntity` ist die zentrale Datenstruktur für personalisierte Links und muss robust, performant und sicher sein.

**CUID2 vs. NanoID vs. UUID:**
- **CUID2** (gewählt): 25 Zeichen, URL-safe, kryptografisch sicher, collision-resistant (4 quadrillion IDs), multiple entropy sources
- Alternativ: NanoID (21 Zeichen, ähnliche Properties)
- **Nicht UUID:** Zu lang (36 Zeichen mit Bindestrichen), weniger leserlich

**Database-Schema-Design:**
- **Composite Index** auf (isActive, expiresAt): Optimiert Token-Validierungs-Queries (`WHERE isActive=true AND (expiresAt IS NULL OR expiresAt > now())`)
- **Timestamps** (createdAt, updatedAt): Automatisch via TypeORM `@CreateDateColumn`, `@UpdateDateColumn`
- **Nullable Fields**: `personalizedMessage`, `expiresAt`, `lastVisitAt` können NULL sein (optionale Features)

**TypeORM-Migration-Strategy:**
- Generierte Migrations werden committed (nicht ignoriert wie bei manchen ORM-Setups)
- Migrations laufen automatisch beim Start (Production) oder manuell (Development)
- SQLite-spezifisch: Keine ALTER TABLE für manche Operations (siehe TypeORM-Docs)

### Project Structure Notes

**Alignment mit unified-project-structure:**
Keine `unified-project-structure.md` vorhanden, aber folgende Struktur basierend auf Epic 1-3 etabliert:

```
apps/backend/src/
├── modules/
│   ├── invite/                    # Epic 4 (NEU)
│   │   ├── entities/
│   │   │   └── invite.entity.ts   # Diese Story
│   │   ├── invite.module.ts       # Wird in Story 4.3 erstellt
│   │   ├── invite.service.ts      # Story 4.3
│   │   ├── invite.controller.ts   # Story 4.4
│   │   └── dto/                   # Story 4.2 (Shared Types)
│   ├── cv/                        # Epic 2 (bestehend)
│   │   └── ...
│   └── ...
├── migrations/
│   └── {timestamp}-CreateInviteTable.ts  # Diese Story
```

**Hinweis für zukünftige Stories:**
Die hier erstellte `InviteEntity` wird in Story 4.3 (`InviteService`) über TypeORM Repository injiziert und für CRUD-Operations genutzt.

### Testing Strategy

**Unit-Tests (Vitest):**
- **Token-Generierung:** Eindeutigkeit, Format, Länge
- **Entity-Instanzierung:** Default-Werte, Field-Validierung

**Integration-Tests:**
- **Database-Persistierung:** Save, Find, Update via TypeORM Repository
- **Constraints:** Unique-Constraint auf token, Foreign Keys (falls später hinzugefügt)

**Test-Database-Setup:**
- In-Memory SQLite für schnelle Tests (`database: ':memory:'`)
- Alternativ: Separate Test-DB-File (wird nach Tests gelöscht)

### Learnings from Previous Story

**From Story 3-12-performance-optimierung-und-lighthouse-ci (Status: drafted)**

Previous story not yet implemented - no predecessor learnings available yet. This is the first story in a new epic (Epic 4) building on the foundation laid in Epics 1-3.

### References

**Primäre Quellen:**
- [Source: docs/tech-spec-epic-4.md#Data-Models-and-Contracts - InviteEntity Definition]
- [Source: docs/tech-spec-epic-4.md#System-Architecture-Alignment - Token-Based Access Control Pattern]
- [Source: docs/epics.md#Epic-4-Story-4.1 - Story Requirements]
- [Source: docs/architecture.md#Architecture-Patterns - Token-Based Access Control]

**Technische Referenzen:**
- CUID2 Library: https://github.com/paralleldrive/cuid2
- TypeORM Entity Documentation: https://typeorm.io/entities
- SQLite Index Best Practices: https://www.sqlite.org/optoverview.html

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-07: Story created (drafted) - Ready for implementation
