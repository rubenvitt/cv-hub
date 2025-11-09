# Story 5.7: Admin Invite CRUD API-Endpoints

Status: drafted

## Story

Als Admin,
möchte ich Invites über REST API-Endpoints verwalten (GET, POST, PATCH, DELETE),
damit ich personalisierte Links komfortabel erstellen, bearbeiten, filtern und löschen kann.

## Acceptance Criteria

1. ✅ AdminInviteController existiert in `apps/backend/src/admin/controllers/admin-invite.controller.ts`
2. ✅ Endpoints implementiert:
   - GET /api/admin/invites (Liste mit Pagination, Sortierung, Filterung)
   - GET /api/admin/invites/:id (Single Invite Details)
   - POST /api/admin/invites (Neuen Link erstellen)
   - PATCH /api/admin/invites/:id (Link aktualisieren)
   - DELETE /api/admin/invites/:id (Soft Delete - isActive=false)
3. ✅ Alle Endpoints geschützt mit AdminAuthGuard
4. ✅ DTOs validiert mit Zod (CreateInviteDto, UpdateInviteDto, InviteQueryDto)
5. ✅ InviteService erweitert mit Admin-Query-Methoden (Filterung, Sortierung)
6. ✅ Response-Format: Paginierte Liste mit total/limit/offset/hasNext
7. ✅ Integration-Tests für alle CRUD-Operations

## Tasks / Subtasks

- [ ] Task 1: AdminInviteController erstellen mit Routing (AC: 1, 2, 3)
  - [ ] Subtask 1.1: Controller-Klasse erstellen in `apps/backend/src/admin/controllers/admin-invite.controller.ts`
  - [ ] Subtask 1.2: Controller in AdminModule registrieren
  - [ ] Subtask 1.3: Route-Prefix `/api/admin/invites` konfigurieren
  - [ ] Subtask 1.4: AdminAuthGuard auf Controller-Ebene anwenden (`@UseGuards(AdminAuthGuard)`)
  - [ ] Subtask 1.5: InviteService als Dependency injizieren

- [ ] Task 2: Zod DTOs und Shared Types definieren (AC: 4)
  - [ ] Subtask 2.1: CreateInviteDto Schema in `packages/shared-types/src/invite.schemas.ts` erstellen
  - [ ] Subtask 2.2: UpdateInviteDto Schema (partial update - alle Felder optional)
  - [ ] Subtask 2.3: InviteQueryDto Schema (status, search, limit, offset, sortBy, sortOrder)
  - [ ] Subtask 2.4: Backend DTOs in `apps/backend/src/admin/dto/` erstellen (verwenden shared schemas)
  - [ ] Subtask 2.5: ValidationPipe für Zod-Schema-Validierung konfigurieren

- [ ] Task 3: GET /api/admin/invites (Liste mit Pagination, Filterung, Sortierung) (AC: 2, 5, 6)
  - [ ] Subtask 3.1: Controller-Method `findAll()` mit InviteQueryDto als Query-Parameter
  - [ ] Subtask 3.2: InviteService.findAllForAdmin() Methode implementieren
  - [ ] Subtask 3.3: Filterung nach Status (active/inactive/expired/all) mit TypeORM QueryBuilder
  - [ ] Subtask 3.4: Search-Filterung nach recipientName (LIKE-Query, case-insensitive)
  - [ ] Subtask 3.5: Sortierung nach createdAt/visitCount/expiresAt (ASC/DESC)
  - [ ] Subtask 3.6: Pagination mit limit/offset (default: limit=10, max=100)
  - [ ] Subtask 3.7: Response-Format: `{ data: [...], pagination: { total, limit, offset, hasNext } }`

- [ ] Task 4: GET /api/admin/invites/:id (Single Invite Details) (AC: 2)
  - [ ] Subtask 4.1: Controller-Method `findOne(:id)` implementieren
  - [ ] Subtask 4.2: InviteService.findOneById() verwenden
  - [ ] Subtask 4.3: 404 Not Found wenn Invite nicht existiert
  - [ ] Subtask 4.4: Vollständiges Invite-Object zurückgeben (inkl. Statistics)

- [ ] Task 5: POST /api/admin/invites (Neuen Link erstellen) (AC: 2, 4)
  - [ ] Subtask 5.1: Controller-Method `create(@Body() dto: CreateInviteDto)` implementieren
  - [ ] Subtask 5.2: InviteService.create() mit DTO aufrufen
  - [ ] Subtask 5.3: CUID2-Token-Generierung (aus Epic 4 wiederverwendet)
  - [ ] Subtask 5.4: Response: 201 Created mit Invite-Object + generierter URL
  - [ ] Subtask 5.5: URL-Format: `https://${domain}/invite/${token}` (domain aus ENV)

- [ ] Task 6: PATCH /api/admin/invites/:id (Link aktualisieren) (AC: 2, 4)
  - [ ] Subtask 6.1: Controller-Method `update(:id, @Body() dto: UpdateInviteDto)` implementieren
  - [ ] Subtask 6.2: InviteService.update() mit partial DTO (nur geänderte Felder)
  - [ ] Subtask 6.3: 404 Not Found wenn Invite nicht existiert
  - [ ] Subtask 6.4: Response: 200 OK mit aktualisiertem Invite-Object
  - [ ] Subtask 6.5: UpdatedAt Timestamp automatisch setzen (TypeORM @UpdateDateColumn)

- [ ] Task 7: DELETE /api/admin/invites/:id (Soft Delete) (AC: 2)
  - [ ] Subtask 7.1: Controller-Method `remove(:id)` implementieren
  - [ ] Subtask 7.2: InviteService.softDelete() - setzt isActive=false (kein Hard Delete)
  - [ ] Subtask 7.3: 404 Not Found wenn Invite nicht existiert
  - [ ] Subtask 7.4: Response: 200 OK mit Success-Message
  - [ ] Subtask 7.5: Besuchsstatistiken bleiben erhalten (History für Analytics)

- [ ] Task 8: Integration-Tests schreiben (AC: 7)
  - [ ] Subtask 8.1: Test-Setup: Admin-Login + Session-Cookie für Auth
  - [ ] Subtask 8.2: Test GET /api/admin/invites: Filterung, Sortierung, Pagination testen
  - [ ] Subtask 8.3: Test GET /api/admin/invites/:id: Valid ID + 404 Case
  - [ ] Subtask 8.4: Test POST /api/admin/invites: Erfolgreiche Erstellung + Validation Errors
  - [ ] Subtask 8.5: Test PATCH /api/admin/invites/:id: Partial Update + 404 Case
  - [ ] Subtask 8.6: Test DELETE /api/admin/invites/:id: Soft Delete + 404 Case
  - [ ] Subtask 8.7: Test AdminAuthGuard: Requests ohne Session → 401 Unauthorized
  - [ ] Subtask 8.8: Test CSRF-Protection: Requests ohne CSRF-Token → 403 Forbidden

- [ ] Task 9: Dokumentation und Error-Handling (AC: alle)
  - [ ] Subtask 9.1: Swagger/OpenAPI Decorators für alle Endpoints (`@ApiOperation`, `@ApiResponse`)
  - [ ] Subtask 9.2: Error-Handling: Strukturierte Error-Responses (NestJS HttpException)
  - [ ] Subtask 9.3: Logging mit Pino für alle CRUD-Operations (Info-Level)
  - [ ] Subtask 9.4: README/Docs: API-Endpoints dokumentieren mit Beispielen

## Dev Notes

### Architektur-Constraints

**API-Design-Prinzipien:**
- RESTful API-Conventions (GET für Read, POST für Create, PATCH für Update, DELETE für Delete)
- Soft Delete Pattern: isActive=false statt Hard Delete (Statistik-History bleibt erhalten)
- Pagination: Standard limit=10, max=100 (verhindert Performance-Probleme bei großen Datensets)
- Response-Format: Konsistent mit bestehenden Endpoints (Success/Error-Structure)
- [Source: docs/tech-spec-epic-5.md#APIs-and-Interfaces]

**Security-Layers:**
- AdminAuthGuard: Session-basierte Authentifizierung (aus Story 5.5)
- CSRF-Protection: csurf Middleware für POST/PATCH/DELETE (aus Story 5.6)
- Rate-Limiting: ThrottlerGuard (50 req/15min für Admin-API)
- Input Validation: Zod Schemas verhindern SQL Injection und XSS
- Execution Order: ThrottlerGuard → AdminAuthGuard → CSRF Guard
- [Source: docs/tech-spec-epic-5.md#Security-Constraints]

**DTO-Design (Zod Schemas):**
```typescript
// CreateInviteDto
{
  recipientName?: string;        // Optional
  message?: string;              // Optional, Markdown, max 1000 chars
  expiresAt?: string;            // Optional, ISO 8601 DateTime
  isActive?: boolean;            // Default: true
}

// UpdateInviteDto (Partial - alle Felder optional)
{
  recipientName?: string;
  message?: string;
  expiresAt?: string | null;    // Nullable für "Ablauf entfernen"
  isActive?: boolean;
}

// InviteQueryDto
{
  status: 'active' | 'expired' | 'inactive' | 'all';  // Default: 'all'
  search?: string;               // Search in recipientName
  limit: number;                 // Default: 10, Max: 100
  offset: number;                // Default: 0
  sortBy: 'createdAt' | 'visitCount' | 'expiresAt';  // Default: 'createdAt'
  sortOrder: 'asc' | 'desc';     // Default: 'desc'
}
```
- [Source: docs/tech-spec-epic-5.md#Data-Models-and-Contracts]

**Pagination Response-Structure:**
```typescript
{
  data: Invite[];              // Array of invite objects
  pagination: {
    total: number;             // Total count (vor Pagination)
    limit: number;             // Requested limit
    offset: number;            // Requested offset
    hasNext: boolean;          // offset + limit < total
  }
}
```

### Source Tree Components

**Backend-Dateien (neu):**
- `apps/backend/src/admin/controllers/admin-invite.controller.ts`:
  - AdminInviteController mit CRUD-Endpoints
  - @Controller('admin/invites') Decorator
  - @UseGuards(AdminAuthGuard) auf Controller-Ebene
  - Swagger @ApiTags('Admin - Invites')

- `apps/backend/src/admin/dto/create-invite.dto.ts`:
  - CreateInviteDto mit Zod Schema Validation
  - Import shared schema from `packages/shared-types`

- `apps/backend/src/admin/dto/update-invite.dto.ts`:
  - UpdateInviteDto (partial - alle Felder optional)

- `apps/backend/src/admin/dto/invite-query.dto.ts`:
  - InviteQueryDto für GET /api/admin/invites Query-Params

**Backend-Dateien (erweitert):**
- `apps/backend/src/invite/invite.service.ts`:
  - Neue Methoden:
    - `findAllForAdmin(query: InviteQueryDto)`: Filterung, Sortierung, Pagination
    - `softDelete(id: string)`: isActive=false setzen statt Hard Delete
  - Wiederverwendet aus Epic 4:
    - `create(dto)`: Token-Generierung mit CUID2
    - `findOneById(id)`: Single Invite abrufen
    - `update(id, dto)`: Partial Update

**Shared Types Package:**
- `packages/shared-types/src/invite.schemas.ts`:
  - CreateInviteDtoSchema (Zod)
  - UpdateInviteDtoSchema (Zod)
  - InviteQueryDtoSchema (Zod)
  - Export TypeScript Types via `z.infer<>`

**Test-Dateien (neu):**
- `apps/backend/test/admin/invite-crud.e2e-spec.ts`:
  - Integration-Tests für alle CRUD-Endpoints
  - Test-Setup: Admin-Login-Session + CSRF-Token
  - Test-Cases: Success, Failure, Validation Errors, Auth Guards

### Testing-Standards

**Integration-Tests (Jest + Supertest):**
- **Test-Setup:**
  - Admin-User einloggen via POST /api/admin/auth/login
  - Session-Cookie aus Response extrahieren
  - CSRF-Token aus Cookie extrahieren (für POST/PATCH/DELETE)
  - Seed-Daten: 10 Beispiel-Invites (verschiedene Stati)

- **Test-Coverage-Ziele:**
  - GET /api/admin/invites: Filterung (alle Stati), Sortierung (alle Felder), Pagination
  - GET /api/admin/invites/:id: Valid ID, 404 Case
  - POST /api/admin/invites: Erfolgreiche Erstellung, Validation Errors (fehlende Felder, ungültige Formate)
  - PATCH /api/admin/invites/:id: Partial Update, 404 Case
  - DELETE /api/admin/invites/:id: Soft Delete (isActive=false), 404 Case
  - Auth Guards: Requests ohne Session → 401, Requests ohne CSRF → 403
  - [Source: docs/tech-spec-epic-5.md#Test-Strategy]

**Unit-Tests (optional für diese Story, Fokus auf Integration):**
- InviteService.findAllForAdmin(): Query-Logic-Korrektheit
- DTO-Validation: Zod Schema Edge-Cases

### Learnings from Previous Story

**Von Story 5-6-csrf-protection-mit-csurf-middleware (Status: drafted, noch nicht implementiert):**

Keine vorherigen Implementierungs-Learnings verfügbar, da Story 5.6 noch nicht entwickelt wurde. Jedoch wichtige Kontext-Informationen aus der Story-Dokumentation:

**CSRF-Integration (aus Story 5.6 Dev Notes):**
- CSRF-Middleware wird in `main.ts` registriert (nach Session, vor Guards)
- Execution Order: Helmet → Session → CSRF → Routes
- CSRF-Token als Cookie (`XSRF-TOKEN`) gesetzt
- Frontend muss Token im Header `X-CSRF-Token` mitsenden
- Alle Admin POST/PATCH/DELETE-Requests benötigen gültigen Token
- [Source: stories/5-6-csrf-protection-mit-csurf-middleware.md#Dev-Notes]

**Wichtig für Story 5.7:**
- POST, PATCH, DELETE-Endpoints in dieser Story werden automatisch durch CSRF-Middleware geschützt
- Integration-Tests müssen CSRF-Token aus Cookie extrahieren und in Header setzen
- GET-Requests sind CSRF-exempt (nur lesende Operationen)

### Project Structure Notes

**Alignment mit NestJS Best Practices:**
- Controller-DTO-Service-Pattern: Klare Separation of Concerns
- Zod für Runtime-Validation (Alternative zu class-validator - moderner, type-safe)
- Shared Types Package: End-to-End Type Safety zwischen Frontend und Backend
- Soft Delete Pattern: Daten-History für Analytics und Rollback-Möglichkeit

**Integration mit bestehender Architektur:**
- InviteService aus Epic 4 wird erweitert (nicht neu erstellt)
- AdminAuthGuard aus Story 5.5 wird wiederverwendet
- CSRF-Protection aus Story 5.6 greift automatisch
- Session-Management aus Story 5.2 für Authentifizierung

**Potenzielle Konflikte:**
- KEINE - Epic 4 Invite-Entity bleibt unverändert, nur Service-Erweiterung
- Public Invite-Endpoints (`/api/invite/:token`) bleiben unberührt
- Admin-Endpoints (`/api/admin/invites`) sind komplett getrennt

### References

- [Source: docs/tech-spec-epic-5.md#APIs-and-Interfaces] - Detaillierte API-Spezifikationen, Request/Response-Formate
- [Source: docs/tech-spec-epic-5.md#Data-Models-and-Contracts] - DTO-Schemas, Invite-Entity-Structure
- [Source: docs/tech-spec-epic-5.md#Services-and-Modules] - Service-Responsibilities, Module-Architecture
- [Source: docs/tech-spec-epic-5.md#Security-Constraints] - AdminAuthGuard, CSRF, Rate-Limiting
- [Source: docs/tech-spec-epic-5.md#Test-Strategy] - Integration-Test-Anforderungen
- [Source: docs/epics.md#Story-5.7] - Original Story-Definition, Acceptance Criteria, Affected Files
- [Source: docs/architecture.md#API-Design] - RESTful API-Conventions, Error-Handling-Standards
- [Source: stories/5-6-csrf-protection-mit-csurf-middleware.md] - CSRF-Integration-Details

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

(Wird vom Dev Agent ergänzt)

### Debug Log References

### Completion Notes List

### File List
