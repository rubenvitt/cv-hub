# Story 4.4: API-Endpoint POST /api/admin/invite

Status: drafted

## Story

Als Admin,
möchte ich via API einen personalisierten Link erstellen können,
damit ich Links programmatisch generieren kann (vorbereitet für Epic 5 Dashboard).

## Acceptance Criteria

1. Endpoint `POST /api/admin/invite` existiert in `InviteController`
2. Input-Validierung via Zod (`CreateInviteDtoSchema`)
3. Request-Body: `{ personalizedMessage?: string, expiresAt?: Date }`
4. Response: `{ id, token, url, createdAt }` (Status 201 Created)
5. Generierte `url` ist vollständig: `https://domain.com/invite/{token}`
6. Admin-Auth-Guard ist vorbereitet (Placeholder für Epic 5, aktuell: open endpoint)
7. Error-Handling: 400 Bad Request bei ungültigem Input (z.B. expiresAt in Vergangenheit)
8. Integration-Test: Endpoint erstellt validen Link, Token ist in DB

## Tasks / Subtasks

- [ ] Task 1: InviteController-Klasse mit Service-Injection erstellen (AC: #1)
  - [ ] 1.1: Controller-Datei `apps/backend/src/modules/invite/invite.controller.ts` anlegen
  - [ ] 1.2: InviteController als `@Controller('invite')` dekorieren
  - [ ] 1.3: InviteService via Constructor-Injection einbinden
  - [ ] 1.4: Controller in InviteModule als Controller registrieren

- [ ] Task 2: POST /api/admin/invite Endpoint implementieren (AC: #1, #2, #3, #4)
  - [ ] 2.1: Route-Handler mit `@Post('admin/invite')` Decorator erstellen
  - [ ] 2.2: Request-Body mit `@Body()` Decorator binden
  - [ ] 2.3: Zod-Validation-Pipe für `CreateInviteDtoSchema` einrichten
  - [ ] 2.4: InviteService.createInvite(dto) aufrufen
  - [ ] 2.5: Response-Objekt konstruieren: `{ id, token, url, createdAt }`
  - [ ] 2.6: Vollständige URL generieren: `${BASE_URL}/invite/${token}` (BASE_URL aus Env-Config)
  - [ ] 2.7: HTTP Status 201 Created zurückgeben

- [ ] Task 3: Admin-Auth-Guard-Placeholder vorbereiten (AC: #6)
  - [ ] 3.1: Guard-Datei `apps/backend/src/modules/auth/guards/admin-auth.guard.ts` anlegen (Placeholder)
  - [ ] 3.2: AdminAuthGuard implementiert `CanActivate` Interface
  - [ ] 3.3: canActivate() gibt immer `true` zurück (Placeholder-Logik für Epic 5)
  - [ ] 3.4: TODO-Kommentar: "Epic 5: Implement actual admin authentication"
  - [ ] 3.5: Guard via `@UseGuards(AdminAuthGuard)` auf POST-Route anwenden

- [ ] Task 4: Error-Handling und Validation (AC: #7)
  - [ ] 4.1: NestJS Exception-Filter für Zod-Validation-Errors
  - [ ] 4.2: Zod Parse-Fehler → 400 Bad Request mit strukturierter Error-Response
  - [ ] 4.3: Format: `{ statusCode: 400, message: 'Validation failed', errors: [{field, message}] }`
  - [ ] 4.4: Service-Exception-Handling: Wenn InviteService.createInvite() fehlschlägt → 500 Internal Server Error
  - [ ] 4.5: Logging für alle Errors (NestJS Logger)

- [ ] Task 5: Integration-Tests für POST /api/admin/invite (AC: #8)
  - [ ] 5.1: Test-Suite `apps/backend/test/invite.e2e-spec.ts` anlegen
  - [ ] 5.2: Test-Setup: In-Memory-SQLite-DB, NestJS TestingModule
  - [ ] 5.3: Test: POST mit validem DTO → 201 Created, Response enthält token + url
  - [ ] 5.4: Test: POST mit leerem Body → 201 Created (alle Felder optional)
  - [ ] 5.5: Test: POST mit personalizedMessage (max 5000 chars) → 201 Created
  - [ ] 5.6: Test: POST mit expiresAt (future date) → 201 Created
  - [ ] 5.7: Test: POST mit expiresAt (past date) → 400 Bad Request
  - [ ] 5.8: Test: POST mit zu langer personalizedMessage (>5000 chars) → 400 Bad Request
  - [ ] 5.9: Test: Verify Token existiert in DB nach POST (Repository-Query)
  - [ ] 5.10: Test: Verify generierte URL hat korrektes Format (starts with BASE_URL)

- [ ] Task 6: Swagger/OpenAPI-Dokumentation für Endpoint (AC: optional, aber Best Practice)
  - [ ] 6.1: `@ApiTags('Invite')` auf Controller anwenden
  - [ ] 6.2: `@ApiOperation({ summary: 'Create personalized invite link' })` auf POST-Route
  - [ ] 6.3: `@ApiBody({ type: CreateInviteDto })` für Request-Body-Docs
  - [ ] 6.4: `@ApiResponse({ status: 201, type: InviteResponse })` für Success-Response
  - [ ] 6.5: `@ApiResponse({ status: 400, description: 'Validation failed' })`
  - [ ] 6.6: Verify: Endpoint erscheint in Swagger-UI (`/api/docs`)

## Dev Notes

### Architektur-Kontext

**Epic 4 Kontext:**
Diese Story implementiert den ersten HTTP-Endpoint für das Token-basierte Invite-System. Der Endpoint ermöglicht programmatische Link-Erstellung (Vorbereitung für das Admin-Dashboard in Epic 5) und ist die Brücke zwischen Business-Logik (InviteService, Story 4.3) und HTTP-Layer. Die Controller-Architektur folgt NestJS Best Practices: Controller = HTTP-Handling (Request/Response), Service = Business-Logik (Token-Generierung, Persistierung).

**NestJS Controller Pattern:**
- **Separation of Concerns**: Controller delegiert Business-Logik an Service
- **Dependency Injection**: Service via Constructor-Injection (`constructor(private inviteService: InviteService)`)
- **Validation Pipes**: Zod-Validation am Controller-Level (vor Service-Call)
- **Exception Handling**: HTTP-Status-Codes basierend auf Service-Exceptions

**POST /api/admin/invite Request-Flow:**
```
HTTP Request: POST /api/admin/invite
Body: { personalizedMessage: "Hi!", expiresAt: "2025-12-31T23:59:59Z" }
        ↓
AdminAuthGuard.canActivate() (Placeholder, returns true)
        ↓
Zod Validation Pipe: CreateInviteDtoSchema.parse(body)
        ↓ (Success)
InviteController.createInvite(@Body dto)
        ↓
InviteService.createInvite(dto)
        ↓ (CUID2 Token generiert, Entity persistiert)
        ↓
Controller constructs Response:
{
  id: 1,
  token: "abc123xyz...",  // 25 chars
  url: "https://cv-hub.example.com/invite/abc123xyz...",
  createdAt: "2025-11-07T10:00:00Z"
}
        ↓
HTTP Response: 201 Created + JSON Body
```

**BASE_URL Configuration:**
Die generierte URL (`https://domain.com/invite/:token`) benötigt `BASE_URL` aus Environment-Config:
- Development: `http://localhost:3000`
- Production: `https://cv-hub.yourdomain.com`
- Config: `apps/backend/.env` → `BASE_URL=...`
- NestJS: `ConfigModule` (Epic 1 Foundation) → `ConfigService.get('BASE_URL')`

**Admin-Auth-Guard Placeholder:**
Story 4.4 bereitet Guard vor, aber Authentifizierung erfolgt erst in Epic 5:
- **Aktueller Zustand**: Guard gibt `true` zurück (open endpoint)
- **Epic 5**: Guard prüft Session/JWT, verified Admin-Role
- **Rationale**: Entkoppelt Link-Erstellung von Auth-Implementierung, ermöglicht frühes Testing

**Zod Validation Integration:**
NestJS nutzt Pipes für Input-Validation. Zod-Integration via Custom-Pipe:
```typescript
// apps/backend/src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return result.data;
  }
}

// Usage in Controller:
@Post('admin/invite')
@UsePipes(new ZodValidationPipe(CreateInviteDtoSchema))
createInvite(@Body() dto: CreateInviteDto) { ... }
```

**Error-Response-Format:**
Konsistente Error-Struktur für Frontend-Integration:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "expiresAt",
      "message": "Date must be in the future"
    }
  ]
}
```

### Project Structure Notes

**Alignment mit Projekt-Struktur (aus Epic 1-3):**

```
apps/backend/src/modules/invite/
├── entities/
│   └── invite.entity.ts       # Story 4.1 (bestehend)
├── dto/
│   └── (shared-types package)  # Story 4.2 (bestehend)
├── invite.service.ts          # Story 4.3 (bestehend)
├── invite.service.spec.ts     # Story 4.3 (bestehend)
├── invite.controller.ts       # Diese Story (NEU)
└── invite.module.ts           # Story 4.1 (bestehend, Update nötig)

apps/backend/src/modules/auth/guards/
└── admin-auth.guard.ts        # Diese Story (NEU, Placeholder)

apps/backend/test/
└── invite.e2e-spec.ts         # Diese Story (NEU)
```

**NestJS Module-Update:**
Das InviteModule (Story 4.1) muss erweitert werden:
```typescript
// apps/backend/src/modules/invite/invite.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteEntity } from './entities/invite.entity';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller'; // NEU

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteEntity]),
  ],
  controllers: [InviteController], // NEU
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
```

**Environment-Config-Extension:**
Neue Env-Variable für BASE_URL:
```env
# apps/backend/.env
BASE_URL=http://localhost:3000
```

**Shared Types Integration:**
Diese Story konsumiert Types aus `@cv-hub/shared-types` (Story 4.2):
```typescript
import {
  CreateInviteDto,
  CreateInviteDtoSchema,
  InviteResponse
} from '@cv-hub/shared-types';
```

**Route-Struktur:**
Endpoint-Pfad folgt RESTful-Conventions:
- `POST /api/admin/invite` - Admin-scoped Link-Creation
- `GET /api/invite/:token` - Public Token-Validation (Story 4.5)
- `GET /api/cv/private/:token` - Private CV-Access (Story 4.7)

**Hinweis für zukünftige Stories:**
- Story 4.5 (GET /api/invite/:token) nutzt `InviteService.validateToken()` und `trackVisit()`
- Story 4.7 (GET /api/cv/private/:token) nutzt `validateToken()` via Guard
- Epic 5 (Admin Dashboard) konsumiert diesen Endpoint via Frontend-Form

### Testing Strategy

**Integration-Tests (E2E mit NestJS Testing):**
- **Test-Database-Setup**: In-Memory-SQLite (kein echtes DB-File nötig)
- **TestingModule**: Initialisiert vollständigen App-Context mit Controllern, Services, Repositories
- **Arrange-Act-Assert**: Setup Test-Data → HTTP Request → Assert Response + DB-State

**Testing Framework:**
NestJS default: Jest, aber Projekt nutzt Vitest (Epic 1 Foundation)
- Vitest: 3-4x schneller als Jest, Vite-native
- E2E-Tests: `supertest` für HTTP-Requests
- Test-Command: `pnpm test:e2e` (Root) oder `pnpm --filter backend test:e2e`

**Test-Setup-Beispiel:**
```typescript
// apps/backend/test/invite.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('InviteController (e2e)', () => {
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

  it('POST /api/admin/invite creates invite with token', async () => {
    const dto = {
      personalizedMessage: 'Welcome to my CV!',
      expiresAt: new Date('2025-12-31').toISOString(),
    };

    const response = await request(app.getHttpServer())
      .post('/api/admin/invite')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toHaveLength(25); // CUID2
    expect(response.body).toHaveProperty('url');
    expect(response.body.url).toContain('/invite/');
  });

  it('POST /api/admin/invite rejects past expiresAt', async () => {
    const dto = {
      expiresAt: new Date('2020-01-01').toISOString(), // Past date
    };

    const response = await request(app.getHttpServer())
      .post('/api/admin/invite')
      .send(dto)
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });
});
```

**Edge-Cases für POST /api/admin/invite:**
1. Leerer Body → 201 Created (alle Felder optional)
2. personalizedMessage = 5000 chars → 201 Created (max length)
3. personalizedMessage > 5000 chars → 400 Bad Request
4. expiresAt = null → 201 Created (kein Ablauf)
5. expiresAt = future date → 201 Created
6. expiresAt = past date → 400 Bad Request
7. expiresAt = invalid format → 400 Bad Request
8. Service wirft Exception → 500 Internal Server Error

**Integration-Tests vs. Unit-Tests:**
- **Unit-Tests** (Story 4.3): InviteService isoliert mit Mock-Repository
- **Integration-Tests** (Diese Story): Vollständiger HTTP-Request-Flow (Controller → Service → Repository → DB)

**Test-Database-Isolation:**
Jeder Test sollte mit sauberer DB starten:
```typescript
beforeEach(async () => {
  // Truncate invite table
  await app.get(DataSource).query('DELETE FROM invite');
});
```

### Learnings from Previous Story

**From Story 4-3-inviteservice-mit-token-validierungs-logik (Status: drafted)**

Previous story not yet implemented - no predecessor learnings available yet.

**Wichtige Dependencies für diese Story:**
- Story 4.1 (CUID2 Token-Generierung und Link-Entity) muss abgeschlossen sein → InviteEntity verfügbar
- Story 4.2 (Invite Zod-Schemas und Shared Types) muss abgeschlossen sein → CreateInviteDto und InviteResponse verfügbar
- Story 4.3 (InviteService) muss abgeschlossen sein → InviteService.createInvite() verfügbar

**Alignment-Check vor Start:**
1. Verify InviteEntity existiert: `apps/backend/src/modules/invite/entities/invite.entity.ts`
2. Verify Shared Types verfügbar: `import { CreateInviteDto } from '@cv-hub/shared-types'` funktioniert
3. Verify InviteService existiert: `apps/backend/src/modules/invite/invite.service.ts`
4. Verify InviteService.createInvite() Methode implementiert
5. Verify Migration ausgeführt: `invite` Tabelle existiert in DB

Wenn diese Prerequisites fehlen, müssen Stories 4.1, 4.2 und 4.3 zuerst implementiert werden.

### References

**Primäre Quellen:**
- [Source: docs/epics.md#Epic-4-Story-4.4 - Story Requirements und Acceptance Criteria]
- [Source: docs/tech-spec-epic-4.md#Services-and-Modules - InviteController-Spezifikation]
- [Source: docs/tech-spec-epic-4.md#Data-Models-and-Contracts - DTO-Definitionen und API-Response-Schema]
- [Source: docs/architecture.md#Architecture-Patterns - Controller Pattern, Dependency Injection]

**Technische Referenzen:**
- NestJS Controllers: https://docs.nestjs.com/controllers
- NestJS Guards: https://docs.nestjs.com/guards
- NestJS Testing: https://docs.nestjs.com/fundamentals/testing
- Zod Validation: https://zod.dev
- Supertest Documentation: https://github.com/visionmedia/supertest

**Verwandte Stories:**
- Story 4.1 (CUID2-Token-Generierung und Link-Entity) - Dependency: InviteEntity
- Story 4.2 (Invite Zod-Schemas und Shared Types) - Dependency: DTOs und Types
- Story 4.3 (InviteService) - Dependency: createInvite() Methode
- Story 4.5 (API-Endpoint GET /api/invite/:token) - Sibling: Token-Validierung-Endpoint
- Story 4.7 (GET /api/cv/private/:token) - Konsument: validateToken() via Guard
- Epic 5 (Link Management Dashboard) - Konsument: Admin-UI nutzt diesen Endpoint

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-07: Story created (drafted) - Ready for implementation after Stories 4.1, 4.2, and 4.3 are completed
