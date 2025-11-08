# Story 5.1: Admin User Entity und Seed-Daten

Status: drafted

## Story

Als Entwickler,
möchte ich eine AdminUser-Entity mit Argon2-gehashten Credentials und initialen Seed-Daten,
damit die Authentifizierungs-Basis für das Admin-Dashboard steht.

## Acceptance Criteria

1. TypeORM Entity `AdminUser` existiert in `apps/backend/src/admin/entities/admin-user.entity.ts`
2. Felder: `id`, `username` (unique), `passwordHash` (Argon2), `createdAt`, `updatedAt`
3. Migration erstellt Admin-Users-Tabelle in SQLite
4. Seed-Script erstellt initialen Admin-User (username aus ENV: `ADMIN_USERNAME`, password gehashed aus `ADMIN_PASSWORD`)
5. Argon2-Hashing funktioniert korrekt (argon2id, 64MB memory, 3 iterations)
6. Unit-Test für Password-Hashing und Verification

## Tasks / Subtasks

- [ ] Task 1: AdminUser Entity erstellen (AC: #1, #2)
  - [ ] Entity-Datei anlegen in `apps/backend/src/admin/entities/admin-user.entity.ts`
  - [ ] TypeORM Decorators konfigurieren (@Entity, @Column, @PrimaryGeneratedColumn)
  - [ ] Felder definieren: id, username (unique constraint), passwordHash, createdAt, updatedAt
  - [ ] Entity in Admin-Module registrieren

- [ ] Task 2: Database Migration erstellen (AC: #3)
  - [ ] Migration generieren mit TypeORM CLI
  - [ ] Migration-File überprüfen in `apps/backend/src/database/migrations/*-CreateAdminUser.ts`
  - [ ] Migration lokal testen (up/down)
  - [ ] Sicherstellen dass SQLite-Tabelle korrekt erstellt wird

- [ ] Task 3: Argon2 Password-Hashing Service implementieren (AC: #5)
  - [ ] Argon2-Dependency installieren (`argon2` package)
  - [ ] AdminService erstellen in `apps/backend/src/admin/admin.service.ts`
  - [ ] hashPassword() Methode implementieren (argon2id, 64MB memory, 3 iterations, 4 threads)
  - [ ] verifyPassword() Methode implementieren
  - [ ] Error-Handling für Hashing-Failures

- [ ] Task 4: Seed-Script für initialen Admin-User (AC: #4)
  - [ ] Seed-Script erstellen in `apps/backend/src/database/seeds/admin-user.seed.ts`
  - [ ] ENV-Variablen auslesen: ADMIN_USERNAME, ADMIN_PASSWORD
  - [ ] Check ob Admin-User bereits existiert (Idempotenz)
  - [ ] Admin-User anlegen mit gehashtem Password
  - [ ] Seed-Script in DB-Setup integrieren (z.B. package.json Script)
  - [ ] .env.example mit ADMIN_USERNAME und ADMIN_PASSWORD dokumentieren

- [ ] Task 5: Unit-Tests (AC: #6)
  - [ ] Test für AdminService.hashPassword() (korrektes Argon2-Format)
  - [ ] Test für AdminService.verifyPassword() (Success-Case)
  - [ ] Test für AdminService.verifyPassword() (Failure-Case: falsches Password)
  - [ ] Test für Password-Hashing-Parameter (memory, iterations korrekt)
  - [ ] Test Coverage >80% für AdminService

## Dev Notes

### Architecture Patterns

**Entity Design:**
- TypeORM Entity mit Standard-Decorators
- Felder folgen JSON Resume Standard-Konvention (camelCase)
- `createdAt` und `updatedAt` automatisch via @CreateDateColumn/@UpdateDateColumn

**Security:**
- **Argon2id** (Hybrid-Mode) statt bcrypt (siehe [Architecture.md#Technical Stack Decisions](docs/architecture.md))
  - Memory-hard design (GPU/ASIC resistant)
  - Parameters: 64MB memory, 3 iterations, 4 threads
  - ~150ms hashing time (akzeptabel für Login-Flow)
- Passwords NIEMALS im Klartext speichern
- Hash-Verification via `argon2.verify()` (constant-time comparison)

**Database:**
- SQLite mit TypeORM
- Migration-basiertes Schema-Management
- Unique-Constraint auf `username` (DB-Level Enforcement)

### Project Structure Notes

**Expected File Locations:**
```
apps/backend/src/
├── admin/
│   ├── entities/
│   │   └── admin-user.entity.ts   (NEU)
│   ├── admin.service.ts           (NEU)
│   └── admin.module.ts            (NEU - wenn noch nicht existiert)
├── database/
│   ├── migrations/
│   │   └── *-CreateAdminUser.ts   (GENERIERT)
│   └── seeds/
│       └── admin-user.seed.ts     (NEU)
└── main.ts
```

**Module Structure:**
- AdminModule importiert TypeOrmModule.forFeature([AdminUser])
- AdminService als Provider in AdminModule
- Seed-Script als standalone (nicht in Module-DI-Container)

### Testing Standards Summary

**Unit Tests (Jest):**
- Test-File: `apps/backend/src/admin/admin.service.spec.ts`
- Mock TypeORM Repository (falls nötig)
- Test Argon2-Hashing mit realen Calls (nicht mocken - wichtig für Security!)
- Assertions:
  - Hash-Format: Beginnt mit `$argon2id$v=19$m=65536,t=3,p=4$`
  - Verify Success: `await verifyPassword(password, hash)` → true
  - Verify Failure: `await verifyPassword('wrong', hash)` → false

**Coverage Target:** >80% für AdminService

### References

**Technical Specification:**
- [Tech Spec Epic 5](docs/tech-spec-epic-5.md#Data Models and Contracts)
  - AdminUser Entity Definition (lines 94-112)
  - Security Requirements (Argon2 parameters, lines 69, 502-507)

**Epic Details:**
- [Epics.md - Epic 5, Story 5.1](docs/epics.md#Story-5.1)
  - Acceptance Criteria (lines 1390-1396)
  - Affected Files (lines 1400-1404)

**Architecture:**
- [Architecture.md](docs/architecture.md#Technical Stack Decisions)
  - Backend Stack: Argon2 Rationale (lines 161, 185-189)
  - Monorepo Structure (lines 222-233)
  - TypeScript Everywhere (lines 216-219)

**Prerequisites:**
- Epic 1 Stories (NestJS + TypeORM Setup) müssen completed sein
- Database-Verbindung funktionsfähig
- TypeORM CLI verfügbar für Migration-Generierung

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
