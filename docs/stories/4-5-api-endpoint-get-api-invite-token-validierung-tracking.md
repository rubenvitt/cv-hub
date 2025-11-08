# Story 4.5: API-Endpoint GET /api/invite/:token (Validierung & Tracking)

Status: drafted

## Story

Als Besucher,
möchte ich via Token-Aufruf validieren und Metadaten abrufen können,
damit die Frontend-Route prüfen kann, ob der Link gültig ist.

## Acceptance Criteria

1. Endpoint `GET /api/invite/:token` existiert in `InviteController`
2. Token-Validierung via `InviteService.validateToken()`
3. Response bei gültigem Token: `{ isValid: true, personalizedMessage: "...", reason: 'valid' }` (Status 200)
4. Response bei ungültigem Token: `{ isValid: false, personalizedMessage: null, reason: 'not_found' | 'inactive' | 'expired' }` (Status 200, kein 404!)
5. Besuchsstatistik wird aktualisiert: `InviteService.trackVisit()` bei gültigem Token
6. Rate-Limiting: 100 requests/minute pro IP (Epic 1 Foundation)
7. Integration-Test: Gültiger Token → isValid=true, visitCount incremented; Abgelaufener Token → isValid=false, reason='expired'

## Tasks / Subtasks

- [ ] Task 1: GET-Endpoint-Route in InviteController implementieren (AC: #1)
  - [ ] 1.1: Route-Handler mit `@Get('invite/:token')` Decorator erstellen
  - [ ] 1.2: Token-Parameter mit `@Param('token')` Decorator extrahieren
  - [ ] 1.3: InviteService.validateToken() aufrufen
  - [ ] 1.4: Response-Objekt basierend auf Validierung konstruieren
  - [ ] 1.5: HTTP Status 200 OK für alle Responses (auch bei ungültig) zurückgeben

- [ ] Task 2: Token-Validierungs-Logik implementieren (AC: #2, #3, #4)
  - [ ] 2.1: InviteService.validateToken(token: string) Methode erstellen
  - [ ] 2.2: Token in DB suchen via InviteRepository.findOne({ where: { token } })
  - [ ] 2.3: IF token nicht gefunden → Return { isValid: false, personalizedMessage: null, reason: 'not_found' }
  - [ ] 2.4: IF token.isActive === false → Return { isValid: false, personalizedMessage: null, reason: 'inactive' }
  - [ ] 2.5: IF token.expiresAt !== null AND expiresAt < new Date() → Return { isValid: false, personalizedMessage: null, reason: 'expired' }
  - [ ] 2.6: IF alle Checks bestanden → Return { isValid: true, personalizedMessage: token.message, reason: 'valid' }

- [ ] Task 3: Besuchsstatistik-Tracking implementieren (AC: #5)
  - [ ] 3.1: InviteService.trackVisit(inviteId: string) Methode erstellen
  - [ ] 3.2: Increment visitCount: `UPDATE invite SET visitCount = visitCount + 1`
  - [ ] 3.3: Update lastVisitAt: `UPDATE invite SET lastVisitAt = NOW()`
  - [ ] 3.4: Query: `inviteRepository.update(inviteId, { visitCount: () => 'visitCount + 1', lastVisitAt: new Date() })`
  - [ ] 3.5: Tracking asynchron ausführen (nicht blockierend): `trackVisit().catch(err => logger.error(err))`
  - [ ] 3.6: Controller ruft trackVisit() nur bei gültigem Token auf

- [ ] Task 4: Response-DTOs und Types definieren (AC: #3, #4)
  - [ ] 4.1: InviteValidationResponse Type in shared-types Package erstellen
  - [ ] 4.2: Type-Definition: `{ isValid: boolean; personalizedMessage: string | null; reason: 'valid' | 'not_found' | 'inactive' | 'expired' }`
  - [ ] 4.3: Zod-Schema InviteValidationResponseSchema erstellen
  - [ ] 4.4: InviteController Response-Type annotieren
  - [ ] 4.5: Swagger @ApiResponse Decorator für 200 OK Response

- [ ] Task 5: Rate-Limiting konfigurieren (AC: #6)
  - [ ] 5.1: @Throttle(100, 60) Decorator auf GET-Route anwenden (100 requests/minute)
  - [ ] 5.2: Verify ThrottlerModule in AppModule importiert (aus Epic 1)
  - [ ] 5.3: Rate-Limit-Error-Response: 429 Too Many Requests mit strukturierter Message

- [ ] Task 6: Integration-Tests für GET /api/invite/:token (AC: #7)
  - [ ] 6.1: Test-Suite `apps/backend/test/invite-validation.e2e-spec.ts` anlegen
  - [ ] 6.2: Test: GET mit gültigem Token → 200 OK, isValid=true, personalizedMessage vorhanden
  - [ ] 6.3: Test: GET mit gültigem Token → visitCount in DB incremented (vor: 0, nach: 1)
  - [ ] 6.4: Test: GET mit ungültigem Token (not_found) → 200 OK, isValid=false, reason='not_found'
  - [ ] 6.5: Test: GET mit deaktiviertem Token (isActive=false) → 200 OK, isValid=false, reason='inactive'
  - [ ] 6.6: Test: GET mit abgelaufenem Token (expiresAt in past) → 200 OK, isValid=false, reason='expired'
  - [ ] 6.7: Test: GET mit gültigem Token ohne Message → 200 OK, personalizedMessage=null
  - [ ] 6.8: Test: Rate-Limiting → 101. Request innerhalb 60s → 429 Too Many Requests
  - [ ] 6.9: Test: lastVisitAt wird aktualisiert nach GET Request

- [ ] Task 7: Swagger/OpenAPI-Dokumentation (AC: optional, Best Practice)
  - [ ] 7.1: @ApiOperation({ summary: 'Validate invite token and get metadata' }) auf GET-Route
  - [ ] 7.2: @ApiParam({ name: 'token', description: 'Invite token (CUID2)', example: 'ckl8x9y2v0000qzrmn8zg9q3c' })
  - [ ] 7.3: @ApiResponse({ status: 200, type: InviteValidationResponse, description: 'Token validation result (always 200, check isValid field)' })
  - [ ] 7.4: @ApiResponse({ status: 429, description: 'Too Many Requests - Rate limit exceeded' })
  - [ ] 7.5: Verify: Endpoint erscheint in Swagger-UI (`/api/docs`)

## Dev Notes

### Architektur-Kontext

**Epic 4 Kontext:**
Diese Story implementiert den Token-Validierungs-Endpoint, der die Frontend-Route `/invite/:token` (Story 4.8) mit kritischen Metadaten versorgt. Der Endpoint ermöglicht frühes Token-Validation **vor** dem Laden des vollständigen CVs, was Performance und UX verbessert (keine unnötigen API-Calls für ungültige Tokens).

**Architektur-Entscheidung: 200 OK statt 404 für ungültige Tokens**

Dieser Endpoint gibt **immer 200 OK** zurück, auch bei ungültigen Tokens. Die Validierung wird über das `isValid` Feld im Response-Body kommuniziert.

**Rationale:**
1. **Frontend-UX:** Ermöglicht elegantes Error-Handling im Frontend ohne HTTP-Error-States
2. **Differentiation:** `reason` Feld liefert spezifischen Grund für Ungültigkeit (not_found, expired, inactive)
3. **Security:** 404 würde Token-Existenz leaken; 200 mit isValid=false bleibt neutral
4. **Pattern-Consistency:** Standard-Validierung-API-Pattern (vgl. OAuth Token Introspection RFC 7662)

**Request-Flow:**
```
HTTP Request: GET /api/invite/ckl8x9y2v0000qzrmn8zg9q3c
        ↓
Rate-Limiting Check (@Throttle - 100/minute)
        ↓ (Pass)
InviteController.validateToken(@Param token)
        ↓
InviteService.validateToken(token)
        ↓
1. InviteRepository.findOne({ where: { token } })
        ↓
2. Check Existence: IF null → { isValid: false, reason: 'not_found' }
        ↓
3. Check Active: IF !isActive → { isValid: false, reason: 'inactive' }
        ↓
4. Check Expiry: IF expiresAt < now() → { isValid: false, reason: 'expired' }
        ↓
5. All Checks Passed → { isValid: true, personalizedMessage, reason: 'valid' }
        ↓ (Async, non-blocking)
InviteService.trackVisit(invite.id)
   - visitCount += 1
   - lastVisitAt = now()
        ↓
HTTP Response: 200 OK + JSON Body
{
  "isValid": true,
  "personalizedMessage": "Hi! Ich freue mich, dass du dir Zeit nimmst.",
  "reason": "valid"
}
```

**Besuchsstatistik-Tracking:**

Visit-Tracking erfolgt **nur bei gültigem Token** und **asynchron** (nicht blockierend):

```typescript
// Controller-Pseudocode
@Get('invite/:token')
async validateToken(@Param('token') token: string) {
  const validation = await this.inviteService.validateToken(token);

  // Nur bei gültigem Token tracken
  if (validation.isValid) {
    // Async, non-blocking - Fehler werden geloggt, aber Request nicht blockiert
    this.inviteService.trackVisit(validation.inviteId).catch(err => {
      this.logger.error('Failed to track visit', err);
    });
  }

  return validation;
}
```

**DSGVO-Konformität:**
- Keine IP-Adressen gespeichert
- Keine User-Agent-Persistierung
- Nur anonyme Counter: visitCount, lastVisitAt
- Rate-Limiting: User-Agent temporär in Memory (Redis/In-Memory-Cache), nicht persistiert

### Project Structure Notes

**Alignment mit Projekt-Struktur (aus Epic 1-4):**

```
apps/backend/src/modules/invite/
├── entities/
│   └── invite.entity.ts       # Story 4.1 (bestehend)
├── dto/
│   └── (shared-types package)  # Story 4.2 (bestehend)
├── invite.service.ts          # Story 4.3 (bestehend, Update nötig)
├── invite.service.spec.ts     # Story 4.3 (bestehend)
├── invite.controller.ts       # Story 4.4 (bestehend, Update nötig)
└── invite.module.ts           # Story 4.1 (bestehend)

packages/shared-types/src/
└── invite.schema.ts           # Story 4.2 (bestehend, Update nötig)
    - InviteValidationResponse Type (NEU)
    - InviteValidationResponseSchema (NEU)

apps/backend/test/
├── invite.e2e-spec.ts         # Story 4.4 (bestehend)
└── invite-validation.e2e-spec.ts  # Diese Story (NEU)
```

**InviteService Extension:**

Story 4.3 hat `InviteService` mit `createInvite()` Methode implementiert. Diese Story erweitert den Service um zwei Methoden:

```typescript
// apps/backend/src/modules/invite/invite.service.ts
export class InviteService {
  // Existing (Story 4.3)
  async createInvite(dto: CreateInviteDto): Promise<InviteEntity> { ... }

  // NEW (Diese Story)
  async validateToken(token: string): Promise<InviteValidationResult> {
    const invite = await this.repository.findOne({ where: { token } });

    if (!invite) {
      return { isValid: false, personalizedMessage: null, reason: 'not_found', inviteId: null };
    }

    if (!invite.isActive) {
      return { isValid: false, personalizedMessage: null, reason: 'inactive', inviteId: invite.id };
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return { isValid: false, personalizedMessage: null, reason: 'expired', inviteId: invite.id };
    }

    return {
      isValid: true,
      personalizedMessage: invite.message || null,
      reason: 'valid',
      inviteId: invite.id,
    };
  }

  // NEW (Diese Story)
  async trackVisit(inviteId: string): Promise<void> {
    await this.repository.update(inviteId, {
      visitCount: () => 'visitCount + 1', // SQL increment
      lastVisitAt: new Date(),
    });
  }
}
```

**InviteController Extension:**

Story 4.4 hat `InviteController` mit `POST /api/admin/invite` implementiert. Diese Story erweitert den Controller um GET-Route:

```typescript
// apps/backend/src/modules/invite/invite.controller.ts
@Controller('invite')
export class InviteController {
  // Existing (Story 4.4)
  @Post('admin/invite')
  @UseGuards(AdminAuthGuard)
  async createInvite(@Body() dto: CreateInviteDto) { ... }

  // NEW (Diese Story)
  @Get('invite/:token')
  @Throttle(100, 60) // 100 requests/minute
  @ApiOperation({ summary: 'Validate invite token and get metadata' })
  @ApiResponse({ status: 200, type: InviteValidationResponse })
  async validateToken(@Param('token') token: string): Promise<InviteValidationResponse> {
    const validation = await this.inviteService.validateToken(token);

    // Track visit asynchronously (only if valid)
    if (validation.isValid) {
      this.inviteService.trackVisit(validation.inviteId).catch(err => {
        this.logger.error('Failed to track visit', err);
      });
    }

    // Omit inviteId from response (internal use only)
    const { inviteId, ...response } = validation;
    return response;
  }
}
```

**Shared Types Extension:**

Story 4.2 hat Shared Types Package mit `CreateInviteDto` und `InviteResponse` erstellt. Diese Story fügt neuen Response-Type hinzu:

```typescript
// packages/shared-types/src/invite.schema.ts
import { z } from 'zod';

// Existing (Story 4.2)
export const CreateInviteDtoSchema = z.object({ ... });
export const InviteResponseSchema = z.object({ ... });

// NEW (Diese Story)
export const InviteValidationResponseSchema = z.object({
  isValid: z.boolean(),
  personalizedMessage: z.string().nullable(),
  reason: z.enum(['valid', 'not_found', 'inactive', 'expired']),
});

export type InviteValidationResponse = z.infer<typeof InviteValidationResponseSchema>;
```

**Route-Struktur:**

```
POST /api/admin/invite          - Link erstellen (Story 4.4)
GET  /api/invite/:token         - Token validieren (Diese Story)
GET  /api/cv/private/:token     - Vollständigen CV abrufen (Story 4.7)
```

**Wichtig:** Diese Story ist Prerequisite für Story 4.8 (Frontend `/invite/:token` Route), da Frontend Token-Validierung vor CV-Load benötigt.

### Testing Strategy

**Integration-Tests (E2E mit NestJS Testing):**

Neue Test-Suite: `apps/backend/test/invite-validation.e2e-spec.ts`

**Test-Setup:**
- In-Memory-SQLite-DB mit Seed-Data (diverse Token-States)
- Test-Data-Factory für verschiedene Token-Szenarien

**Test-Daten-Setup:**
```typescript
// Seed Test Tokens
const validToken = {
  id: '1',
  token: 'valid-token-123',
  message: 'Welcome!',
  isActive: true,
  expiresAt: new Date('2099-12-31'), // Zukunft
  visitCount: 0,
  lastVisitAt: null,
};

const expiredToken = {
  id: '2',
  token: 'expired-token-456',
  isActive: true,
  expiresAt: new Date('2020-01-01'), // Vergangenheit
  visitCount: 5,
};

const inactiveToken = {
  id: '3',
  token: 'inactive-token-789',
  isActive: false, // Deaktiviert
  expiresAt: null,
  visitCount: 10,
};
```

**Test-Cases:**

1. **Happy Path: Gültiger Token**
   - Request: `GET /api/invite/valid-token-123`
   - Expected: 200 OK, `{ isValid: true, personalizedMessage: 'Welcome!', reason: 'valid' }`
   - Side-Effect: visitCount = 1, lastVisitAt updated in DB

2. **Token Not Found**
   - Request: `GET /api/invite/nonexistent-token`
   - Expected: 200 OK, `{ isValid: false, personalizedMessage: null, reason: 'not_found' }`
   - Side-Effect: Keine DB-Änderung

3. **Token Expired**
   - Request: `GET /api/invite/expired-token-456`
   - Expected: 200 OK, `{ isValid: false, personalizedMessage: null, reason: 'expired' }`
   - Side-Effect: Keine visitCount-Inkrementierung

4. **Token Inactive**
   - Request: `GET /api/invite/inactive-token-789`
   - Expected: 200 OK, `{ isValid: false, personalizedMessage: null, reason: 'inactive' }`
   - Side-Effect: Keine visitCount-Inkrementierung

5. **Token ohne Message**
   - Request: `GET /api/invite/token-no-message`
   - Expected: 200 OK, `{ isValid: true, personalizedMessage: null, reason: 'valid' }`

6. **Visit Tracking (Repeat Visits)**
   - Setup: Token mit visitCount=2, lastVisitAt='2025-11-05'
   - Request: `GET /api/invite/token-repeat`
   - Expected: 200 OK, isValid=true
   - Verify DB: visitCount=3, lastVisitAt > '2025-11-05'

7. **Rate-Limiting**
   - Setup: 101 Requests innerhalb 60s vom gleichen IP
   - Expected: Erste 100 → 200 OK, 101. Request → 429 Too Many Requests

**Test-Beispiel:**
```typescript
// apps/backend/test/invite-validation.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('InviteController - Token Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/invite/:token with valid token returns isValid=true', async () => {
    // Arrange: Seed valid token (via DB seeding in beforeAll)

    // Act
    const response = await request(app.getHttpServer())
      .get('/api/invite/valid-token-123')
      .expect(200);

    // Assert
    expect(response.body).toEqual({
      isValid: true,
      personalizedMessage: 'Welcome!',
      reason: 'valid',
    });
  });

  it('GET /api/invite/:token increments visitCount in DB', async () => {
    // Arrange: Token with visitCount=0

    // Act
    await request(app.getHttpServer())
      .get('/api/invite/valid-token-123')
      .expect(200);

    // Assert: Query DB
    const inviteRepo = app.get(InviteRepository);
    const invite = await inviteRepo.findOne({ where: { token: 'valid-token-123' } });
    expect(invite.visitCount).toBe(1);
    expect(invite.lastVisitAt).toBeDefined();
  });

  it('GET /api/invite/:token with expired token returns reason=expired', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/invite/expired-token-456')
      .expect(200);

    expect(response.body).toEqual({
      isValid: false,
      personalizedMessage: null,
      reason: 'expired',
    });
  });
});
```

**Unit-Tests vs. Integration-Tests:**
- **Unit-Tests** (InviteService): Testen `validateToken()` und `trackVisit()` isoliert mit Mock-Repository
- **Integration-Tests** (Diese Story): Testen vollständigen HTTP-Request-Flow mit echter DB

### Learnings from Previous Story

**From Story 4-4-api-endpoint-post-api-admin-invite (Status: drafted)**

Previous story not yet implemented - no predecessor learnings available yet.

**Wichtige Dependencies für diese Story:**
- Story 4.1 (CUID2 Token-Generierung und Link-Entity) muss abgeschlossen sein → InviteEntity mit visitCount, lastVisitAt, expiresAt, isActive Feldern verfügbar
- Story 4.2 (Invite Zod-Schemas und Shared Types) muss abgeschlossen sein → InviteValidationResponse Type muss hinzugefügt werden
- Story 4.3 (InviteService mit Token-Validierungs-Logik) muss abgeschlossen sein → InviteService.validateToken() und trackVisit() müssen implementiert werden
- Story 4.4 (API-Endpoint POST /api/admin/invite) muss abgeschlossen sein → InviteController existiert, kann erweitert werden

**Alignment-Check vor Start:**
1. Verify InviteEntity hat Felder: visitCount (number), lastVisitAt (Date), expiresAt (Date), isActive (boolean)
2. Verify InviteService existiert: `apps/backend/src/modules/invite/invite.service.ts`
3. Verify InviteController existiert: `apps/backend/src/modules/invite/invite.controller.ts`
4. Verify InviteRepository verfügbar (TypeORM Repository für InviteEntity)
5. Verify ThrottlerModule in AppModule registriert (Epic 1 - Rate-Limiting)

Wenn diese Prerequisites fehlen, müssen Stories 4.1-4.4 zuerst implementiert werden.

### References

**Primäre Quellen:**
- [Source: docs/epics.md#Epic-4-Story-4.5 - Story Requirements und Acceptance Criteria]
- [Source: docs/tech-spec-epic-4.md#Workflow-2-Personalized-Link-Access - Token-Validierungs-Flow und Error-Handling]
- [Source: docs/tech-spec-epic-4.md#Services-and-Modules - InviteService.validateToken() und trackVisit() Spezifikation]
- [Source: docs/architecture.md#Token-Based-Access-Control - Token-Validierungs-Pattern und DSGVO-Konformität]

**Technische Referenzen:**
- NestJS Route Params: https://docs.nestjs.com/controllers#route-parameters
- NestJS Rate Limiting (@nestjs/throttler): https://docs.nestjs.com/security/rate-limiting
- TypeORM Raw SQL Expressions: https://typeorm.io/select-query-builder#using-raw-sql
- Zod Schema Validation: https://zod.dev
- RFC 7662 OAuth Token Introspection: https://datatracker.ietf.org/doc/html/rfc7662 (Inspiration für 200-OK-Pattern)

**Verwandte Stories:**
- Story 4.1 (CUID2-Token-Generierung und Link-Entity) - Dependency: InviteEntity mit tracking-Feldern
- Story 4.2 (Invite Zod-Schemas und Shared Types) - Dependency: InviteValidationResponse Type
- Story 4.3 (InviteService mit Token-Validierungs-Logik) - Dependency: validateToken() und trackVisit() Methoden
- Story 4.4 (API-Endpoint POST /api/admin/invite) - Dependency: InviteController existiert
- Story 4.7 (GET /api/cv/private/:token) - Sibling: Verwendet ähnliche Token-Validierung via Guard
- Story 4.8 (Frontend-Route /invite/:token mit SSR-Loader) - Konsument: Frontend ruft diesen Endpoint auf vor CV-Load

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-07: Story created (drafted) - Ready for implementation after Stories 4.1, 4.2, 4.3, and 4.4 are completed
