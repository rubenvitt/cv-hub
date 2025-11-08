# Story 5.2: Session-Management mit express-session

Status: drafted

## Story

Als Entwickler,
möchte ich Session-Management mit SQLite-Storage und HTTP-only Cookies implementieren,
so dass Admin-Sessions sicher persistiert werden und über Backend-Restarts hinweg erhalten bleiben.

## Acceptance Criteria

1. **AC-1:** `express-session` und `connect-sqlite3` Dependencies sind installiert und in `package.json` dokumentiert
2. **AC-2:** SessionModule ist konfiguriert in `apps/backend/src/admin/session.module.ts` mit SQLite-Store
3. **AC-3:** Sessions werden in SQLite-Tabelle `sessions` gespeichert und persistieren über Backend-Restarts hinweg
4. **AC-4:** Session-Cookie hat korrekte Sicherheits-Flags:
   - `HttpOnly: true` (verhindert JavaScript-Zugriff)
   - `Secure: true` (nur in Production mit HTTPS)
   - `SameSite: Lax` (CSRF-Schutz)
   - `Max-Age: 7 days` (604800 Sekunden)
5. **AC-5:** Session-Secret wird aus Environment-Variable `SESSION_SECRET` geladen (mindestens 32 Bytes, generiert mit `openssl rand -hex 32`)
6. **AC-6:** Expired Sessions werden automatisch bereinigt (Cron-Job oder cleanup-on-access Strategie)
7. **AC-7:** Health-Check-Endpoint (`/api/health`) zeigt Session-Store-Status an (verbunden/nicht verbunden)

## Tasks / Subtasks

- [ ] **Task 1: Dependencies installieren und konfigurieren** (AC: #1, #5)
  - [ ] 1.1: `express-session` und `connect-sqlite3` via pnpm installieren
  - [ ] 1.2: Environment-Variable `SESSION_SECRET` zu `.env.example` hinzufügen mit Kommentar zur Generierung
  - [ ] 1.3: Produktions-Secret generieren und in `.env` setzen (nicht committen)
  - [ ] 1.4: TypeScript-Typen für express-session (`@types/express-session`) installieren

- [ ] **Task 2: SessionModule erstellen und konfigurieren** (AC: #2, #3, #4)
  - [ ] 2.1: `apps/backend/src/admin/session.module.ts` erstellen mit NestJS Module
  - [ ] 2.2: SQLite-Store konfigurieren mit `connect-sqlite3`:
    - Database-Path: `data/sessions.db` (persistent volume)
    - Table name: `sessions`
    - Cleanup-Intervall: 24h
  - [ ] 2.3: Session-Middleware konfigurieren:
    - Secret aus `process.env.SESSION_SECRET`
    - Cookie-Optionen gemäß AC-4
    - Store: SQLiteStore-Instanz
    - `resave: false`, `saveUninitialized: false`
  - [ ] 2.4: SessionModule in `admin.module.ts` importieren und registrieren
  - [ ] 2.5: Environment-Check implementieren (Session-Secret muss gesetzt sein, sonst Error beim Start)

- [ ] **Task 3: Session-Persistenz testen** (AC: #3)
  - [ ] 3.1: Integration-Test: Session erstellen → Backend-Restart → Session noch vorhanden
  - [ ] 3.2: Verifizieren dass `sessions`-Tabelle in SQLite erstellt wird
  - [ ] 3.3: Testen dass Session-Daten korrekt serialisiert/deserialisiert werden

- [ ] **Task 4: Cookie-Sicherheit validieren** (AC: #4)
  - [ ] 4.1: Unit-Test: Cookie-Flags werden korrekt gesetzt
  - [ ] 4.2: Testen in Development: `Secure: false` (kein HTTPS)
  - [ ] 4.3: Testen in Production-Mode: `Secure: true` (HTTPS required)
  - [ ] 4.4: Verifizieren dass Cookie HttpOnly ist (nicht von JavaScript lesbar)

- [ ] **Task 5: Session-Cleanup implementieren** (AC: #6)
  - [ ] 5.1: `connect-sqlite3` automatisches Cleanup konfigurieren (täglich expired Sessions löschen)
  - [ ] 5.2: Optional: Cleanup-Cron-Job mit `@nestjs/schedule` implementieren falls nötig
  - [ ] 5.3: Testen dass abgelaufene Sessions nach 7 Tagen automatisch gelöscht werden

- [ ] **Task 6: Health-Check erweitern** (AC: #7)
  - [ ] 6.1: Health-Check-Endpoint in `apps/backend/src/health/health.controller.ts` erweitern
  - [ ] 6.2: Session-Store-Status checken (DB-Connection zu `sessions.db` funktioniert)
  - [ ] 6.3: Response-Format: `{ "session_store": "healthy" | "unhealthy" }`
  - [ ] 6.4: Integration-Test für Health-Check mit Session-Store

- [ ] **Task 7: Dokumentation und Migration** (AC: #2, #3)
  - [ ] 7.1: Inline-Code-Dokumentation für SessionModule (TSDoc-Comments)
  - [ ] 7.2: README-Abschnitt für Session-Konfiguration aktualisieren
  - [ ] 7.3: Migrations-Check: `sessions`-Tabelle wird automatisch von `connect-sqlite3` erstellt (kein manuelles TypeORM-Migration nötig)

## Dev Notes

### Architecture Context

**Session-Management-Strategie:**
- **Backend:** express-session mit SQLite-Storage via connect-sqlite3
- **Persistenz:** SQLite-Datei unter `data/sessions.db` (Docker-Volume-Mount erforderlich)
- **Security:** HttpOnly + Secure Cookies, 7-Tage-Expiry, SameSite=Lax für CSRF-Schutz
- **Lifecycle:** Sessions persistieren über Restarts, automatisches Cleanup nach Ablauf

**Integration mit Admin-Authentication (Story 5.3):**
- Diese Story legt die Session-Infrastruktur an
- Story 5.3 (Passport.js Local Strategy) wird Sessions für Admin-Login nutzen
- Sessions werden von AdminAuthGuard (Story 5.5) validiert

**Technische Constraints:**
- Session-Secret MUSS mindestens 32 Bytes sein (kryptografisch sicher)
- In Production: HTTPS-only (Nginx SSL-Termination in Epic 7)
- SQLite-DB muss persistent gemountet werden (Docker Volume)
- Session-Tabelle wird automatisch von `connect-sqlite3` erstellt (kein TypeORM-Entity nötig)

[Source: docs/tech-spec-epic-5.md#System Architecture Alignment]
[Source: docs/architecture.md#Security Architecture]

### Project Structure Notes

**Neue Dateien:**
- `apps/backend/src/admin/session.module.ts` - NestJS SessionModule
- `data/sessions.db` - SQLite-Datenbank für Sessions (auto-created)
- `.env.example` - SESSION_SECRET Environment-Variable dokumentieren

**Zu modifizierende Dateien:**
- `apps/backend/src/admin/admin.module.ts` - SessionModule importieren
- `apps/backend/src/health/health.controller.ts` - Health-Check erweitern
- `apps/backend/package.json` - Dependencies hinzufügen
- `README.md` - Session-Konfiguration dokumentieren

**Alignment mit unified-project-structure:**
- Admin-Module unter `apps/backend/src/admin/` (konsistent mit Epic-5-Struktur)
- Shared types (falls nötig) unter `packages/shared-types/src/admin/`
- Session-DB unter `data/` (persistent storage location)

[Source: docs/architecture.md#Component Architecture]

### Testing Strategy

**Unit Tests:**
- SessionModule-Konfiguration (Cookie-Flags, Store-Setup)
- Environment-Variable-Validation (SESSION_SECRET required)
- Health-Check Session-Store-Status-Logic

**Integration Tests:**
- Session-Persistenz über Backend-Restart
- Session-Erstellung und Abruf via express-session
- Expired-Session-Cleanup (7 Tage + 1 Tag simulieren)
- Health-Check-Endpoint gibt korrekten Session-Store-Status

**E2E Tests (später in Story 5.8):**
- Login-Flow erstellt Session
- Session-Cookie wird korrekt gesetzt und persistiert
- Logout löscht Session

**Test-Framework:**
- Jest für Unit/Integration Tests
- Supertest für HTTP-Tests

[Source: docs/tech-spec-epic-5.md#Test Strategy Summary]

### Security Considerations

**Session-Secret:**
- Generierung: `openssl rand -hex 32` (32 Bytes = 64 Hex-Zeichen)
- Speicherung: Environment-Variable (NICHT in Git committen)
- Rotation: Bei Kompromittierung Secret rotieren und alle Sessions invalidieren

**Cookie-Flags:**
- **HttpOnly:** Verhindert XSS-Angriffe via JavaScript-Zugriff
- **Secure:** Nur HTTPS (Production), verhindert Man-in-the-Middle
- **SameSite=Lax:** CSRF-Protection (Cookie nur bei same-site requests)
- **Max-Age:** 7 Tage (604800s), auto-logout nach Inaktivität

**Session-Store-Security:**
- SQLite-DB muss geschützt sein (Dateisystem-Permissions)
- Keine Session-Daten in Logs (Privacy)
- Session-IDs sind kryptografisch sicher (express-session default)

**Rate Limiting (für Login-Endpoint in Story 5.4):**
- 5 Login-Versuche pro 15 Minuten pro IP
- Session-Creation wird NICHT rate-limited (nur Login-Endpoint)

[Source: docs/tech-spec-epic-5.md#Security]
[Source: docs/architecture.md#Password Security]

### References

- **Tech-Spec:** docs/tech-spec-epic-5.md#Services and Modules (SessionModule, AdminAuthGuard)
- **Architecture:** docs/architecture.md#Security Architecture > Authentication & Authorization > Admin Authentication: Session-Based
- **PRD:** docs/PRD.md#FR-4: Admin-Dashboard (Session-based Auth with HTTP-only Cookies)
- **Epic Breakdown:** docs/epics.md > Epic 5 > Story 5.2
- **Dependencies:**
  - express-session: https://www.npmjs.com/package/express-session
  - connect-sqlite3: https://www.npmjs.com/package/connect-sqlite3
- **Security Best Practices:**
  - OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

### Prerequisites

**Story 5.1 (Admin User Entity und Seed Daten):**
- Admin-User-Entity sollte existieren für Passport-Integration (Story 5.3)
- ABER: Diese Story (5.2) hat keine harte Abhängigkeit zu 5.1
- Sessions können unabhängig konfiguriert werden
- Passport-Integration erfolgt erst in Story 5.3

**Empfehlung:**
- Story 5.2 kann parallel zu 5.1 entwickelt werden
- Final Testing erst nach Story 5.3 (Login-Flow komplett)

### Learnings from Previous Story

**First story in Epic 5 - no predecessor context**

Keine vorherige Story in Epic 5 vorhanden. Dies ist die erste technische Implementation für das Admin-Dashboard.

**Context aus Epic 4 (Privacy-First Sharing System):**
- Invite-System nutzt CUID2-Tokens für Link-Generierung
- TypeORM-Entities und Migrations sind etabliert
- Testing-Framework (Jest + Supertest) ist aufgesetzt
- SQLite-Datenbank läuft unter `data/cv.db`

**Wichtige Patterns aus früheren Epics:**
- Environment-Variablen für Secrets (aus Epic 1-3)
- TypeORM-Migration-Workflow (aus Epic 2)
- Integration-Tests mit Supertest (aus Epic 2-4)
- Health-Check-Pattern (aus Epic 1)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Will be filled by Dev Agent -->

### Debug Log References

<!-- Will be filled by Dev Agent during implementation -->

### Completion Notes List

<!-- Will be filled by Dev Agent after story completion -->

### File List

<!-- Will be filled by Dev Agent - files created, modified, deleted -->

---

**Change Log:**
- 2025-11-08: Story drafted by Scrum Master (Bob) based on Epic 5 Tech-Spec and Architecture
