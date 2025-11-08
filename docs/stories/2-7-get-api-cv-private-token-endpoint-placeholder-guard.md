# Story 2.7: GET /api/cv/private/:token Endpoint (Placeholder Guard)

Status: drafted

## Story

Als Entwickler,
möchte ich einen Token-basierten API-Endpoint für den vollständigen CV,
damit personalisierte Links (Epic 4) vollständige CV-Daten abrufen können.

## Acceptance Criteria

1. ✅ `GET /api/cv/private/:token` Endpoint ist implementiert
2. ✅ Placeholder `InviteGuard` existiert mit zwei Modi:
   - **Option A (Recommended)**: Returns HTTP 501 Not Implemented mit klarer Message
   - **Option B (Testing)**: Bypass-Modus für Epic 2 Integration-Tests
3. ✅ Guard logged Warning-Message: "Placeholder Guard - Epic 4 will implement real token validation"
4. ✅ Endpoint ruft `CVService.getCV('authenticated')` auf
5. ✅ Response enthält VOLLSTÄNDIGEN CV (keine Privacy-Filterung)
6. ✅ Response Format: `{ success: true, data: CV }`
7. ✅ Code-Kommentar vorhanden: "TODO Epic 4: Implement real InviteGuard with database token validation"
8. ✅ Integration-Test mit Mock-Token validiert:
   - HTTP 501 (Option A) ODER HTTP 200 mit Full CV (Option B)
   - Response enthält private Felder (email, phone, address, skill levels, private projects)
   - Kein Privacy-Filtering aktiv

## Tasks / Subtasks

- [ ] **Task 1:** Placeholder InviteGuard erstellen (AC: 2, 3, 7)
  - [ ] 1.1: Guard-Datei erstellen: `apps/backend/src/modules/cv/guards/invite.guard.ts`
  - [ ] 1.2: NestJS CanActivate Interface implementieren
  - [ ] 1.3: Environment-Variable `EPIC_2_PLACEHOLDER_MODE` hinzufügen (.env):
        - `'strict'` → Returns 501 Not Implemented
        - `'bypass'` → Allows all requests (für Testing)
  - [ ] 1.4: Logger-Warning implementieren: "⚠️ Placeholder Guard active - Epic 4 implements real validation"
  - [ ] 1.5: Option A: 501 Response mit Message: "Token-based access not yet implemented. See Epic 4."
  - [ ] 1.6: Option B: Return `true` (bypass) für Testing
  - [ ] 1.7: TODO-Kommentar hinzufügen mit Epic 4 Referenz

- [ ] **Task 2:** GET /api/cv/private/:token Endpoint implementieren (AC: 1, 4, 5, 6)
  - [ ] 2.1: In `cv.controller.ts` neuen Endpoint hinzufügen: `@Get('private/:token')`
  - [ ] 2.2: `@UseGuards(InviteGuard)` Decorator anbringen
  - [ ] 2.3: Route-Parameter extrahieren: `@Param('token') token: string`
  - [ ] 2.4: `CVService.getCV('authenticated')` aufrufen
  - [ ] 2.5: Response-DTO verwenden: `GetCVResponseDto`
  - [ ] 2.6: Error-Handling: 404 wenn CV nicht existiert, 500 bei internen Fehlern
  - [ ] 2.7: Swagger-Decorators hinzufügen (@ApiOperation, @ApiParam, @ApiResponse)

- [ ] **Task 3:** CVModule aktualisieren (Infrastructure)
  - [ ] 3.1: InviteGuard in `cv.module.ts` als Provider hinzufügen
  - [ ] 3.2: Logger in InviteGuard injizieren via Constructor
  - [ ] 3.3: ConfigService für Environment-Variable injizieren (falls Option A/B configurierbar)

- [ ] **Task 4:** Integration-Tests schreiben (AC: 8)
  - [ ] 4.1: Test-File erweitern: `apps/backend/test/cv/cv-private-endpoint.e2e-spec.ts`
  - [ ] 4.2: Test-Setup: NestJS TestingModule mit InMemory-DB
  - [ ] 4.3: **Test (Option A):** `GET /api/cv/private/any-token` returns HTTP 501
  - [ ] 4.4: **Test (Option A):** Response Message enthält "not yet implemented"
  - [ ] 4.5: **Test (Option B):** `GET /api/cv/private/mock-token` returns HTTP 200
  - [ ] 4.6: **Test (Option B):** Response hat korrektes Format `{ success: true, data: { ... } }`
  - [ ] 4.7: **Test (Option B):** Private Felder sind vorhanden:
        - `basics.email` ist definiert
        - `basics.phone` ist definiert
        - `basics.location.address` ist definiert
        - `skills[].level` ist definiert
        - Projekte mit `isPrivate: true` sind enthalten
  - [ ] 4.8: **Test:** Logger-Warning wird ausgegeben (Log-Assertion)

## Dev Notes

### Architecture Patterns und Constraints

**API-First Architecture (aus Tech Spec Epic 2):**
- RESTful API mit klarer Trennung Public/Private
- NestJS Controller/Service/Repository Pattern
- Endpoint folgt Konvention: `/api/cv/private/:token`
- Guards enforced auf Route-Level für Security

**Privacy-by-Design (aus Tech Spec Epic 2):**
- Server-Side Filtering via `CVService.getCV(context)`
- Context 'authenticated' → KEIN Filtering, vollständige Daten
- Context 'public' → Privacy Filter Service wird aufgerufen (Story 2.4)
- Diese Story verwendet 'authenticated' → Full CV

**Forward Compatibility mit Epic 4 (aus Tech Spec Epic 2):**
- Placeholder Guard-Pattern ermöglicht Epic 2 Abschluss OHNE Epic 4 Dependency
- Endpoint-Struktur identisch mit finaler Epic 4 Implementation
- Epic 4 ersetzt nur den Guard, Endpoint-Logic bleibt unverändert
- Clear TODO-Kommentare verhindern Missverständnisse

**Guard-Pattern (aus Architecture):**
- NestJS Guards implementieren `CanActivate` Interface
- Dependency Injection für Logger, ConfigService
- Return `true` = Request allowed, `false` = 403 Forbidden
- HTTP Exceptions können geworfen werden (z.B. 501 Not Implemented)
- Guards sind wiederverwendbar und testbar

### Source Tree Components

**Dateien zu erstellen:**
- `apps/backend/src/modules/cv/guards/invite.guard.ts` - **NEU** Placeholder Guard
- `apps/backend/test/cv/cv-private-endpoint.e2e-spec.ts` - **NEU** Integration Tests

**Dateien zu ändern:**
- `apps/backend/src/modules/cv/cv.controller.ts` - **ERWEITERN** mit GET /api/cv/private/:token
- `apps/backend/src/modules/cv/cv.module.ts` - **ERWEITERN** (InviteGuard als Provider)
- `apps/backend/.env` - **ERWEITERN** (Optional: EPIC_2_PLACEHOLDER_MODE)

**Existierende Dependencies (aus Story 2.5 - drafted):**
- `CVService` mit `getCV(context: 'public' | 'authenticated')` Methode
- `PrivacyFilterService` für Public-Filtering (wird in dieser Story NICHT verwendet)
- `CVEntity` und `CVRepository` für DB-Zugriff
- `GetCVResponseDto` für standardisierte Response

**NestJS Modules/Packages:**
- `@nestjs/common` - Guards, Decorators, HTTP Exceptions
- `@nestjs/config` - ConfigService für Environment-Variablen (optional)
- `@nestjs/swagger` - API-Dokumentation Decorators

### Testing Strategy

**Integration Test Focus:**
- API-Endpoint-Verhalten (HTTP Status, Response Format)
- Guard-Verhalten (501 vs Bypass, basierend auf Config)
- KEINE Privacy-Filtering (vollständiger CV)
- Logger-Warning-Assertion (Placeholder Guard aktiv)

**Test-Setup:**
- NestJS TestingModule mit CVModule
- In-Memory-SQLite-DB mit Seed-Data (Full CV mit privaten Feldern)
- Supertest für HTTP-Requests
- Mock-Token: "test-token-12345" (beliebiger String, da keine echte Validierung)

**Guard Testing:**
- **Option A (strict):** Test erwartet HTTP 501, Message "not yet implemented"
- **Option B (bypass):** Test erwartet HTTP 200, Full CV Data

**Acceptance:**
- Alle Tests passing
- Guard-Modus konfigurierbar via Environment-Variable
- Warning-Log erscheint bei Guard-Execution

### Project Structure Notes

**NestJS Convention Alignment:**
- Guard: `guards/invite.guard.ts` in CV-Module-Ordner
- Endpoint-Methode: `getPrivate(@Param('token') token: string)`
- Guard wird via `@UseGuards(InviteGuard)` auf Endpoint angewendet
- Tests: `test/cv/` Ordner für E2E-Tests (parallel zu `src/`)

**Module-Organisation:**
- CVModule importiert: ConfigModule (für Environment-Variablen)
- CVModule providers: [...existing, InviteGuard]
- InviteGuard ist scoped to CV-Module (kein global Guard)

**Naming Conventions:**
- Guard-Klasse: `InviteGuard` (nicht `InviteTokenGuard` - zu verbose)
- Test-File: `cv-private-endpoint.e2e-spec.ts`
- Environment-Variable: `EPIC_2_PLACEHOLDER_MODE`

**Epic 4 Forward Compatibility:**
- Guard-Dateiname bleibt gleich: `invite.guard.ts`
- Epic 4 überschreibt Implementierung, Interface bleibt identisch
- Keine Breaking Changes für Controller oder Tests

### References

**Technische Spezifikationen:**
- [Source: docs/tech-spec-epic-2.md#APIs-and-Interfaces] - GET /api/cv/private/:token API Specification
- [Source: docs/tech-spec-epic-2.md#Authenticated-CV-Request-Flow] - Sequenzdiagramm des Token-Validierungs-Flows (Epic 4)
- [Source: docs/tech-spec-epic-2.md#Dependencies-and-Integrations] - Epic 4 Soft Dependency (Forward Compatibility)

**Requirements:**
- [Source: docs/PRD.md#FR-3-Personalisierte-CV-Ansicht] - Functional Requirements für Token-basierten Zugriff
- [Source: docs/epics.md#Story-2.7] - Story Acceptance Criteria

**Architecture:**
- [Source: docs/architecture.md#Token-Based-Access-Control] - Guard-Pattern und Token-Validierung (Epic 4 Detail)
- [Source: docs/architecture.md#Backend-Stack] - NestJS Guards, Passport.js (Epic 5)

**Prerequisites:**
- Story 2.5: CV Service mit getCV('authenticated') Methode (drafted)
- Story 2.4: Privacy Filter Service (drafted, wird in dieser Story nicht verwendet)
- Story 2.1-2.3: CV Schema, Entities, Seed Data (drafted)

**Forward Dependencies:**
- **Epic 4 (Story 4.5):** Wird InviteGuard mit echter Token-Validierung implementieren
  - Database-Lookup für Token-Existenz
  - Validierung: isActive, expiresAt
  - Visit-Tracking (visitCount, lastVisitAt)
  - Epic 4 ersetzt Placeholder-Implementierung

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

_Will be filled by Dev Agent during implementation_

### Debug Log References

_Dev Agent will add references to debug logs here during implementation_

### Completion Notes List

_Dev Agent will document:_
- Which Guard-Mode wurde gewählt (Option A or B) und warum
- Environment-Variable Configuration (falls implementiert)
- Test-Ergebnisse (501 vs 200 Response)
- Swagger-Dokumentation Status
- Challenges mit Placeholder-Pattern (falls vorhanden)

### File List

_Dev Agent will list:_
- NEW: Files created during implementation
- MODIFIED: Files changed during implementation
- DELETED: Files removed (if any)
