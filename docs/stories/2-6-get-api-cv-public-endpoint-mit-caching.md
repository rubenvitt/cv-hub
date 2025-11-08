# Story 2.6: GET /api/cv/public Endpoint mit Caching

Status: drafted

## Story

Als Entwickler,
möchte ich einen Public-API-Endpoint für gefilterte CV-Daten,
damit die öffentliche Website CV-Daten abrufen kann.

## Acceptance Criteria

1. ✅ `CVController` existiert mit `GET /api/cv/public` Endpoint
2. ✅ Endpoint ruft `CVService.getCV('public')` auf
3. ✅ Response Format: `{ success: true, data: CV }`
4. ✅ Caching aktiviert: 5 Minuten TTL
5. ✅ ETag Header gesetzt für Cache-Validation
6. ✅ Rate-Limiting: 100 requests/15min pro IP
7. ✅ Response Time <100ms (p95)
8. ✅ Integration-Test validiert:
   - HTTP 200 Status
   - Filtered CV (keine private Felder)
   - Cache-Headers vorhanden (Cache-Control, ETag)

## Tasks / Subtasks

- [ ] **Task 1:** CVController mit GET /api/cv/public Endpoint erstellen (AC: 1, 2, 3)
  - [ ] 1.1: CVController-Klasse in `apps/backend/src/modules/cv/cv.controller.ts` erstellen/erweitern
  - [ ] 1.2: GET-Endpoint mit `@Get('public')` Decorator und Route `/api/cv/public`
  - [ ] 1.3: CVService über Dependency Injection injizieren
  - [ ] 1.4: `CVService.getCV('public')` aufrufen für gefilterte Daten
  - [ ] 1.5: Response-DTO implementieren mit Format `{ success: boolean, data: CV }`
  - [ ] 1.6: Error-Handling: 404 wenn CV nicht existiert, 500 bei internen Fehlern
  - [ ] 1.7: Swagger-Decorators hinzufügen (@ApiOperation, @ApiResponse)

- [ ] **Task 2:** Caching-Integration mit NestJS Cache Manager (AC: 4, 5)
  - [ ] 2.1: `@nestjs/cache-manager` als Dependency prüfen (sollte aus Epic 1 vorhanden sein)
  - [ ] 2.2: CacheModule in CVModule importieren (global oder lokal)
  - [ ] 2.3: `@UseInterceptors(CacheInterceptor)` auf GET /api/cv/public Endpoint
  - [ ] 2.4: `@CacheTTL(300)` Decorator für 5 Minuten Cache-Dauer
  - [ ] 2.5: ETag-Header automatisch generieren (NestJS Standard oder via Interceptor)
  - [ ] 2.6: Cache-Control Header setzen: `public, max-age=300`

- [ ] **Task 3:** Rate-Limiting konfigurieren (AC: 6)
  - [ ] 3.1: `@nestjs/throttler` in CVModule oder global konfigurieren
  - [ ] 3.2: `@Throttle({ default: { limit: 100, ttl: 900000 } })` für 100 requests/15min (900000ms)
  - [ ] 3.3: Rate-Limit-Response-Headers hinzufügen (X-RateLimit-Limit, X-RateLimit-Remaining)
  - [ ] 3.4: 429 Too Many Requests Status bei Überschreitung

- [ ] **Task 4:** Integration-Tests mit Supertest schreiben (AC: 8)
  - [ ] 4.1: Test-File erstellen: `apps/backend/test/cv/cv-public-endpoint.e2e-spec.ts`
  - [ ] 4.2: Test-Setup: NestJS TestingModule mit InMemory-DB und Seed-Data
  - [ ] 4.3: **Test:** `GET /api/cv/public` returns HTTP 200
  - [ ] 4.4: **Test:** Response hat korrektes Format `{ success: true, data: { ... } }`
  - [ ] 4.5: **Test:** Private Felder sind gefiltert (keine `email`, `phone`, `location.address`)
  - [ ] 4.6: **Test:** `skills[].level` ist undefined (gefiltert)
  - [ ] 4.7: **Test:** Nur Projekte mit `isPrivate: false` sind enthalten
  - [ ] 4.8: **Test:** Cache-Headers vorhanden (`Cache-Control`, `ETag`)
  - [ ] 4.9: **Test:** Zweiter Request mit ETag returns 304 Not Modified
  - [ ] 4.10: **Test:** Rate-Limiting: 101. Request returns 429

- [ ] **Task 5:** Performance-Validierung und Monitoring (AC: 7)
  - [ ] 5.1: Response Time in Tests messen (Durchschnitt, p95, p99)
  - [ ] 5.2: Performance-Benchmark: 100 Requests simulieren und Statistiken sammeln
  - [ ] 5.3: Validation: p95 Response Time <100ms
  - [ ] 5.4: Falls >100ms: Cache warm-up oder Query-Optimierung (sollte nicht nötig sein bei SQLite Single Row)
  - [ ] 5.5: Logging für Slow Queries (>50ms) aktivieren

## Dev Notes

### Architecture Patterns und Constraints

**API-First Architecture (aus Tech Spec Epic 2):**
- RESTful API mit klarer Trennung Public/Private
- NestJS Controller/Service/Repository Pattern
- Swagger/OpenAPI Auto-Documentation

**Privacy-by-Design (aus Tech Spec Epic 2):**
- Server-Side Filtering via `CVService.getCV('public')`
- Privacy Filter Service wird im Service-Layer aufgerufen (Story 2.4)
- Fail-Closed: Bei Filter-Fehler → Error, keine ungefilter
ten Daten

**Caching-Strategie (aus Tech Spec Epic 2):**
- NestJS Cache Manager mit In-Memory Store (MVP)
- TTL: 5 Minuten für Public Endpoint
- Cache-Invalidierung bei CV-Update (PATCH /api/admin/cv)
- ETag für Browser-Caching

**Rate-Limiting (aus Tech Spec Epic 2):**
- @nestjs/throttler global oder per Endpoint
- Public Endpoints: 100 requests/15min pro IP
- Admin Endpoints: 50 requests/15min (nicht relevant für diese Story)

**Testing Standards (aus Tech Spec Epic 2):**
- Integration Tests mit Supertest (Primary für API Endpoints)
- In-Memory-DB für Tests (keine externe DB-Dependency)
- Test Coverage >95% für API Endpoints
- Performance Assertions in Tests

### Source Tree Components

**Dateien zu erstellen/ändern:**
- `apps/backend/src/modules/cv/cv.controller.ts` - **NEU oder ERWEITERN** (falls bereits aus Story 2.5 vorhanden)
- `apps/backend/src/modules/cv/dto/get-cv-response.dto.ts` - **NEU** Response DTO
- `apps/backend/src/modules/cv/cv.module.ts` - **ÄNDERN** (CacheModule importieren)
- `apps/backend/test/cv/cv-public-endpoint.e2e-spec.ts` - **NEU** Integration Tests

**Existierende Dependencies (aus Story 2.5 - drafted):**
- `CVService` mit `getCV(context: 'public' | 'authenticated')` Methode
- `PrivacyFilterService` für Public-Filtering
- `CVEntity` und `CVRepository` für DB-Zugriff

**NestJS Modules/Packages:**
- `@nestjs/cache-manager` - Caching (sollte aus Epic 1 verfügbar sein)
- `cache-manager` - Cache Manager Core
- `@nestjs/throttler` - Rate-Limiting (sollte aus Epic 1 verfügbar sein)
- `@nestjs/swagger` - API-Dokumentation

### Testing Strategy

**Integration Test Focus:**
- API-Endpoint-Verhalten (HTTP Status, Response Format)
- Privacy-Filtering-Korrektheit (alle private Felder abwesend)
- Caching-Funktionalität (Cache-Headers, 304 Not Modified)
- Rate-Limiting-Enforcement (429 nach Limit)
- Performance-Validierung (Response Time <100ms p95)

**Test-Setup:**
- NestJS TestingModule mit CVModule
- In-Memory-SQLite-DB mit Seed-Data (Full CV mit privaten Feldern)
- Supertest für HTTP-Requests
- Assertions für Response-Body, Headers, Status-Codes

### Project Structure Notes

**NestJS Convention Alignment:**
- Controller: `cv.controller.ts` in `modules/cv/` Ordner
- DTO: `dto/get-cv-response.dto.ts` für Response-Typing
- Tests: `test/cv/` Ordner für E2E-Tests (parallel zu `src/`)

**Module-Organisation:**
- CVModule importiert: CacheModule, ThrottlerModule (falls nicht global)
- CVController deklariert in CVModule controllers array
- CVService als Provider in CVModule

**Naming Conventions:**
- Endpoint-Methode: `getPublicCV()` oder `getPublic()`
- DTO-Klasse: `GetCVResponseDto`
- Test-File: `cv-public-endpoint.e2e-spec.ts`

### References

**Technische Spezifikationen:**
- [Source: docs/tech-spec-epic-2.md#APIs-and-Interfaces] - GET /api/cv/public Detailed API Specification
- [Source: docs/tech-spec-epic-2.md#Caching-Strategy] - 5min TTL, Cache-Control headers
- [Source: docs/tech-spec-epic-2.md#Rate-Limiting] - 100 requests/15min per IP
- [Source: docs/tech-spec-epic-2.md#Public-CV-Request-Flow] - Sequenzdiagramm des Datenflows
- [Source: docs/tech-spec-epic-2.md#Test-Strategy-Summary] - Integration Test Requirements

**Requirements:**
- [Source: docs/PRD.md#FR-1-CV-Präsentation-Öffentlich] - Public CV Functional Requirements
- [Source: docs/epics.md#Story-2.6] - Story Acceptance Criteria

**Architecture:**
- [Source: docs/architecture.md#Backend-Stack] - NestJS, TypeORM, Guards/Interceptors Pattern
- [Source: docs/architecture.md#API-Design] - RESTful Conventions, Error Handling

**Prerequisites:**
- Story 2.5: CV Service mit getCV() Methode (drafted)
- Story 2.4: Privacy Filter Service (drafted)
- Story 2.1-2.3: CV Schema, Entities, Seed Data (drafted)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

_Will be filled by Dev Agent during implementation_

### Debug Log References

_Dev Agent will add references to debug logs here during implementation_

### Completion Notes List

_Dev Agent will document:_
- Implementation approach taken
- Any deviations from spec (with rationale)
- Performance optimization applied
- Test coverage achieved
- Known issues or technical debt

### File List

_Dev Agent will list:_
- NEW: Files created during implementation
- MODIFIED: Files changed during implementation
- DELETED: Files removed (if any)
