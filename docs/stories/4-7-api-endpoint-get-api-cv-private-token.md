# Story 4.7: API-Endpoint GET /api/cv/private/:token

Status: drafted

## Story

Als Besucher mit gültigem Token,
möchte ich den vollständigen CV über einen geschützten API-Endpoint abrufen können,
damit die personalisierte Ansicht alle relevanten Daten inklusive Kontaktinformationen und echter Firmennamen anzeigen kann.

## Acceptance Criteria

1. Endpoint `GET /api/cv/private/:token` existiert in `InviteController` und ist über die definierte Route erreichbar
2. Token-Validierung erfolgt via `TokenValidationGuard` (NestJS Guard):
   - Guard ruft `InviteService.validateToken()` auf um Token zu prüfen
   - Bei ungültigem, abgelaufenem oder inaktivem Token: 403 Forbidden Response mit strukturiertem Error-Body
   - Bei gültigem Token: Request.user = InviteEntity (für Logging und Tracking)
3. Response liefert vollständiges CV-Objekt (`PrivateCV`) via `CVService.getCV('authenticated')` ohne Privacy-Filterung
4. Besuchsstatistik wird automatisch getrackt (visitCount++, lastVisitAt update) via Guard oder Controller-Logic
5. Rate-Limiting aktiv: 100 requests/minute pro Token (ThrottlerGuard)
6. Error-Handling implementiert:
   - 403 Forbidden bei ungültigem/abgelaufenem/inaktivem Token mit reason field
   - 404 Not Found wenn CV-Daten nicht existieren
   - Strukturierte Error-Responses mit statusCode, message, error
7. Integration-Tests vollständig:
   - Test Case 1: Gültiger Token → 200 OK + vollständiger CV (PrivateCV)
   - Test Case 2: Ungültiger Token → 403 Forbidden
   - Test Case 3: Abgelaufener Token → 403 Forbidden
   - Test Case 4: Inaktiver Link → 403 Forbidden
   - Test Case 5: Nicht-existierende CV-Daten → 404 Not Found
   - Test Case 6: Rate-Limit überschritten → 429 Too Many Requests

## Tasks / Subtasks

- [ ] Task 1: TokenValidationGuard implementieren (AC: #2)
  - [ ] Subtask 1.1: Guard-Klasse erstellen in `apps/backend/src/modules/invite/guards/token-validation.guard.ts`
  - [ ] Subtask 1.2: `canActivate()` Methode implementieren mit `InviteService.validateToken()` Integration
  - [ ] Subtask 1.3: Token aus Request-Params extrahieren und validieren
  - [ ] Subtask 1.4: Bei gültigem Token: InviteEntity an `request.user` anhängen
  - [ ] Subtask 1.5: Bei ungültigem Token: ForbiddenException mit reason field werfen
  - [ ] Subtask 1.6: Unit-Tests für Guard (Mock InviteService, Test Success/Failure Cases)

- [ ] Task 2: GET /api/cv/private/:token Endpoint implementieren (AC: #1, #3)
  - [ ] Subtask 2.1: Endpoint-Method `getPrivateCV()` in `InviteController` hinzufügen
  - [ ] Subtask 2.2: Route-Decorator `@Get('cv/private/:token')` konfigurieren
  - [ ] Subtask 2.3: `TokenValidationGuard` auf Endpoint anwenden via `@UseGuards()`
  - [ ] Subtask 2.4: `CVService.getCV('authenticated')` aufrufen und Response returnen
  - [ ] Subtask 2.5: Zod-Schema-Validation für Response-DTO (PrivateCVSchema)
  - [ ] Subtask 2.6: OpenAPI/Swagger-Decorators hinzufügen (@ApiOperation, @ApiResponse)

- [ ] Task 3: Besuchsstatistik-Tracking integrieren (AC: #4)
  - [ ] Subtask 3.1: `InviteService.trackVisit(inviteEntity)` Methode nutzen
  - [ ] Subtask 3.2: Tracking im Guard NACH erfolgreicher Validierung aufrufen
  - [ ] Subtask 3.3: Sicherstellen: visitCount++ und lastVisitAt=now() werden persistiert
  - [ ] Subtask 3.4: Test: Statistik wird bei jedem erfolgreichen Request aktualisiert

- [ ] Task 4: Rate-Limiting konfigurieren (AC: #5)
  - [ ] Subtask 4.1: `@UseGuards(ThrottlerGuard)` auf Endpoint anwenden
  - [ ] Subtask 4.2: Custom Throttler-Config: 100 requests/minute per token (nicht per IP)
  - [ ] Subtask 4.3: ThrottlerGuard-Strategie anpassen für token-based limiting
  - [ ] Subtask 4.4: Test: Nach 100 Requests innerhalb 1 Minute → 429 Too Many Requests

- [ ] Task 5: Error-Handling implementieren (AC: #6)
  - [ ] Subtask 5.1: 403 Forbidden Exception mit strukturiertem Body { statusCode, message, error, reason }
  - [ ] Subtask 5.2: 404 Not Found Exception wenn CVService null/undefined returnt
  - [ ] Subtask 5.3: NestJS Global Exception Filter nutzen für konsistente Error-Responses
  - [ ] Subtask 5.4: Error-Logging mit structlog Context (token-ID, timestamp, reason)

- [ ] Task 6: Integration-Tests schreiben (AC: #7)
  - [ ] Subtask 6.1: Test-Setup: Seed DB mit Test-CV und Test-Invites (gültig, abgelaufen, inaktiv)
  - [ ] Subtask 6.2: Test Case 1: Gültiger Token → 200 + vollständiger CV + visitCount incremented
  - [ ] Subtask 6.3: Test Case 2: Ungültiger Token (not_found) → 403 Forbidden
  - [ ] Subtask 6.4: Test Case 3: Abgelaufener Token (expired) → 403 Forbidden
  - [ ] Subtask 6.5: Test Case 4: Inaktiver Link (isActive=false) → 403 Forbidden
  - [ ] Subtask 6.6: Test Case 5: CV existiert nicht → 404 Not Found
  - [ ] Subtask 6.7: Test Case 6: Rate-Limit (100+ Requests/min) → 429 Too Many Requests
  - [ ] Subtask 6.8: Assertions: Response-Body Struktur, Status Codes, DB State (visitCount)

## Dev Notes

### Architektur-Kontext

**Pattern:** Token-Based Access Control (Architecture Pattern 2)
- Stateless Token-Validierung via NestJS Guard
- CUID2-Token aus URL-Param `:token` extrahiert
- Guard validiert Token (exists, isActive, not expired) und attachet InviteEntity an request.user
- CVService Context-Switch: `'authenticated'` bypassed Privacy-Filtering (Epic 2)

**Abhängigkeiten:**
- Story 4.3: `InviteService.validateToken()` Methode existiert und liefert validated InviteEntity oder null
- Story 4.6: `CVService.getCV('authenticated')` Methode existiert und liefert PrivateCV ohne Filterung
- Epic 2: CV-Entity und CVService Foundation vorhanden
- Epic 1: Rate-Limiting Foundation (ThrottlerModule) konfiguriert

**Tech Stack:**
- NestJS v11 Guards (`CanActivate` Interface)
- TypeORM InviteEntity (aus Story 4.1)
- Zod PrivateCVSchema (Shared Types, Story 4.2)
- @nestjs/throttler für Rate-Limiting

### Project Structure Notes

**Betroffene Module:**
```
apps/backend/src/modules/
├── invite/
│   ├── invite.controller.ts           # (UPDATE) + GET /cv/private/:token Endpoint
│   ├── invite.service.ts              # (EXISTING) validateToken(), trackVisit()
│   ├── guards/
│   │   └── token-validation.guard.ts  # (NEW) Token-Check vor CV-Zugriff
│   └── entities/
│       └── invite.entity.ts           # (EXISTING) Story 4.1
├── cv/
│   ├── cv.service.ts                  # (EXISTING) getCV('authenticated') - Story 4.6
│   └── entities/
│       └── cv.entity.ts               # (EXISTING) Epic 2
```

**Shared Types (packages/shared-types):**
```typescript
// cv.schema.ts (Story 4.2)
export const PrivateCVSchema = CVSchema; // Full JSON Resume, no filtering

// invite.schema.ts (Story 4.2)
export const InviteValidationResponseSchema = z.object({
  isValid: z.boolean(),
  personalizedMessage: z.string().nullable(),
  reason: z.enum(['valid', 'not_found', 'inactive', 'expired']).optional(),
});
```

**API Contract:**
```
GET /api/cv/private/:token

Headers:
  Accept: application/json

URL Params:
  token: string (CUID2, 25 chars)

Success Response (200 OK):
{
  // Full JSON Resume (PrivateCV)
  basics: {
    name: string,
    email: string,        // ✅ Included (vs Public: undefined)
    phone: string,        // ✅ Included
    location: { ... },    // ✅ Full address
  },
  work: [{
    name: string,         // ✅ Real company (vs Public: "Confidential")
    position: string,
    ...
  }],
  projects: [{
    name: string,
    entity: string,       // ✅ Company/Client (vs Public: undefined)
    metrics: [...],       // ✅ Business metrics (vs Public: undefined)
    ...
  }],
  skills: [...],
  education: [...],
  volunteer: [...]
}

Error Responses:
403 Forbidden (Invalid/Expired Token):
{
  statusCode: 403,
  message: "Invalid or expired invite token",
  error: "Forbidden",
  reason: "expired" | "inactive" | "not_found"
}

404 Not Found (CV doesn't exist):
{
  statusCode: 404,
  message: "CV data not found",
  error: "Not Found"
}

429 Too Many Requests (Rate-Limit):
{
  statusCode: 429,
  message: "ThrottlerException: Too Many Requests",
  error: "Too Many Requests"
}
```

### Implementierungs-Details

**TokenValidationGuard Implementation:**
```typescript
// guards/token-validation.guard.ts
@Injectable()
export class TokenValidationGuard implements CanActivate {
  constructor(private readonly inviteService: InviteService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    if (!token) {
      throw new ForbiddenException({
        message: 'Token is required',
        reason: 'not_found',
      });
    }

    const invite = await this.inviteService.validateToken(token);

    if (!invite) {
      throw new ForbiddenException({
        message: 'Invalid or expired invite token',
        reason: 'not_found',
      });
    }

    // Check: isActive
    if (!invite.isActive) {
      throw new ForbiddenException({
        message: 'Invite link has been deactivated',
        reason: 'inactive',
      });
    }

    // Check: expiresAt
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      throw new ForbiddenException({
        message: 'Invite link has expired',
        reason: 'expired',
      });
    }

    // Attach invite to request for tracking
    request.user = invite;

    // Track visit (async, don't block request)
    this.inviteService.trackVisit(invite).catch(err => {
      // Log error but don't fail request
      console.error('Failed to track visit:', err);
    });

    return true;
  }
}
```

**Controller Implementation:**
```typescript
// invite.controller.ts
@Controller('api')
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly cvService: CVService,
  ) {}

  @Get('cv/private/:token')
  @UseGuards(TokenValidationGuard, ThrottlerGuard)
  @ApiOperation({ summary: 'Get private CV data via invite token' })
  @ApiResponse({ status: 200, description: 'Full CV data', type: PrivateCVDto })
  @ApiResponse({ status: 403, description: 'Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'CV not found' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async getPrivateCV(@Param('token') token: string): Promise<PrivateCV> {
    const cv = await this.cvService.getCV('authenticated');

    if (!cv) {
      throw new NotFoundException('CV data not found');
    }

    // Validate response with Zod
    return PrivateCVSchema.parse(cv);
  }
}
```

**Rate-Limiting Strategie:**
- Custom ThrottlerGuard-Strategie: Token-based statt IP-based
- Implementierung: ThrottlerGuard mit custom `getTracker()` override
- Limit: 100 requests/minute per unique token
- Storage: In-Memory (NestJS Throttler Default, ausreichend für MVP)

**Testing-Strategie:**
```typescript
// invite.controller.spec.ts (Integration Test)
describe('GET /api/cv/private/:token', () => {
  let app: INestApplication;
  let inviteService: InviteService;
  let cvService: CVService;

  beforeEach(async () => {
    // Setup test module, seed DB
  });

  it('should return 200 and full CV for valid token', async () => {
    const validToken = 'ckl8x9y2v0000qzrmn8zg9q3c';
    const response = await request(app.getHttpServer())
      .get(`/api/cv/private/${validToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('basics.email'); // Private field
    expect(response.body).toHaveProperty('work[0].name'); // Real company
    expect(response.body.work[0].name).not.toBe('Confidential');
  });

  it('should return 403 for invalid token', async () => {
    const invalidToken = 'invalid-token-xxx';
    const response = await request(app.getHttpServer())
      .get(`/api/cv/private/${invalidToken}`)
      .expect(403);

    expect(response.body.reason).toBe('not_found');
  });

  it('should return 403 for expired token', async () => {
    const expiredToken = 'expired-token-abc'; // Seeded with expiresAt in past
    const response = await request(app.getHttpServer())
      .get(`/api/cv/private/${expiredToken}`)
      .expect(403);

    expect(response.body.reason).toBe('expired');
  });

  it('should track visit statistics', async () => {
    const validToken = 'ckl8x9y2v0000qzrmn8zg9q3c';
    const inviteBefore = await inviteService.findByToken(validToken);
    const visitCountBefore = inviteBefore.visitCount;

    await request(app.getHttpServer())
      .get(`/api/cv/private/${validToken}`)
      .expect(200);

    const inviteAfter = await inviteService.findByToken(validToken);
    expect(inviteAfter.visitCount).toBe(visitCountBefore + 1);
    expect(inviteAfter.lastVisitAt).toBeDefined();
  });

  it('should enforce rate limit (100 req/min)', async () => {
    const validToken = 'ckl8x9y2v0000qzrmn8zg9q3c';

    // Send 100 requests (should succeed)
    for (let i = 0; i < 100; i++) {
      await request(app.getHttpServer())
        .get(`/api/cv/private/${validToken}`)
        .expect(200);
    }

    // 101st request should be rate-limited
    await request(app.getHttpServer())
      .get(`/api/cv/private/${validToken}`)
      .expect(429);
  });
});
```

### Security & DSGVO-Konformität

**Security Measures:**
- Token-Validierung via Guard (kein Bypass möglich)
- Rate-Limiting verhindert Brute-Force-Angriffe auf Tokens
- HTTPS-only (Nginx, Epic 7) verhindert Token-Leak via HTTP
- Structured Error-Responses (keine Leak von internen Details)

**DSGVO-Konformität:**
- Besuchsstatistik anonymisiert (nur Counter + Timestamp, keine IP)
- PrivateCV nur via gültigem Token zugänglich (explizite Einladung)
- Logging: Token-ID statt vollem Token (PII-Minimierung)
- Keine Third-Party-Tracking (Google Analytics etc. verboten)

### Alignment mit Architecture

**Architecture Pattern 2: Token-Based Access Control**
- ✅ CUID2-Token (25 chars, URL-safe, kryptografisch sicher)
- ✅ Stateless Validierung (DB-Lookup + Checks)
- ✅ TypeORM Link-Entity mit allen spezifizierten Feldern
- ✅ Besuchsstatistik-Tracking ohne Privacy-Verletzung

**Architecture Pattern 1: Privacy-First Data Filtering (Extension)**
- ✅ CVService.getCV('authenticated') bypassed Filterung
- ✅ Token-Validierung als NestJS Guard (Middleware-Pattern)
- ✅ Server-side Filtering zentral (keine Privacy-Logik im Frontend)

**Tech Stack Adherence:**
- ✅ NestJS v11 Guards
- ✅ TypeORM Entities
- ✅ Zod Validation (Shared Types)
- ✅ Helmet Security Headers (Epic 1 Foundation)

### Learnings from Previous Story

**Previous Story Context:** Story 4-6-cvservice-erweiterung-fuer-authenticated-context (Status: drafted)

Da die vorherige Story noch nicht implementiert wurde, gibt es keine Completion Notes oder etablierte Patterns. Wichtige Annahmen für diese Story:

**Expected from Story 4.6:**
- `CVService.getCV()` akzeptiert Context-Parameter `'public' | 'authenticated'`
- `PrivateCV` Type in Shared Types Package definiert
- Bei `context='authenticated'`: Keine Privacy-Filterung, vollständiges CV-Objekt
- Integration-Test für Privacy-Filtering vorhanden

**Critical Dependency:**
Wenn Story 4.6 nicht abgeschlossen ist, kann diese Story (4.7) NICHT implementiert werden, da `CVService.getCV('authenticated')` benötigt wird. Empfehlung: Dependency-Check im Sprint-Planning durchführen.

### References

- [Architecture: Token-Based Access Control Pattern] docs/architecture.md#Architecture-Patterns
- [Tech Spec Epic 4: APIs and Interfaces] docs/tech-spec-epic-4.md#APIs-and-Interfaces
- [PRD: FR-3 Personalisierte CV-Ansicht] docs/PRD.md#FR-3
- [PRD: Authentication & Authorization] docs/PRD.md#Authentication-Authorization
- [Story 4.3: InviteService mit Token-Validierungs-Logik] docs/epics.md#Story-4-3
- [Story 4.6: CVService-Erweiterung für authenticated Context] docs/epics.md#Story-4-6

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
