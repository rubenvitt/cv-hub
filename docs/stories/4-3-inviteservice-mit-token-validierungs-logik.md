# Story 4.3: InviteService mit Token-Validierungs-Logik

Status: drafted

## Story

Als Backend-Entwickler,
möchte ich einen InviteService für Link-CRUD und Token-Validierung,
damit die Business-Logik zentral und testbar ist.

## Acceptance Criteria

1. `InviteService` existiert in `apps/backend/src/modules/invite/invite.service.ts`
2. Methoden implementiert:
   - `createInvite(dto: CreateInviteDto): Promise<InviteEntity>` - Generiert Token, persistiert Link
   - `validateToken(token: string): Promise<InviteValidationResponse>` - Prüft: existiert && isActive && nicht abgelaufen
   - `trackVisit(token: string): Promise<void>` - Inkrement visitCount, update lastVisitAt
   - `findByToken(token: string): Promise<InviteEntity | null>` - Repository-Wrapper
3. Token-Validierungs-Logik korrekt:
   - `isValid = true` wenn: Token existiert UND isActive=true UND (expiresAt=null ODER expiresAt>now())
   - `reason` gesetzt: 'not_found', 'inactive', 'expired' bei Fehlschlägen
4. `trackVisit()` ist idempotent (mehrfache Calls pro Minute zählen nur einmal)
5. Unit-Tests: Alle Validierungs-Edge-Cases abgedeckt (nicht existent, deaktiviert, abgelaufen, gültig)

## Tasks / Subtasks

- [ ] Task 1: InviteService-Klasse mit Repository-Injection erstellen (AC: #1)
  - [ ] 1.1: Service-Datei `apps/backend/src/modules/invite/invite.service.ts` anlegen
  - [ ] 1.2: InviteService als `@Injectable()` dekorieren
  - [ ] 1.3: InviteEntity Repository via Constructor-Injection einbinden (`@InjectRepository(InviteEntity)`)
  - [ ] 1.4: Service in InviteModule als Provider registrieren

- [ ] Task 2: createInvite() Methode implementieren (AC: #2)
  - [ ] 2.1: CUID2-Token generieren (25 Zeichen, URL-safe)
  - [ ] 2.2: CreateInviteDto aus `@cv-hub/shared-types` importieren
  - [ ] 2.3: InviteEntity mit generierten Token und DTO-Daten erstellen
  - [ ] 2.4: Entity in Datenbank persistieren (`repository.save()`)
  - [ ] 2.5: Gespeicherte Entity zurückgeben (inkl. auto-generated id, timestamps)

- [ ] Task 3: findByToken() Methode implementieren (AC: #2)
  - [ ] 3.1: Repository-Query für Token-Lookup: `repository.findOne({ where: { token } })`
  - [ ] 3.2: Rückgabe: InviteEntity wenn gefunden, null sonst
  - [ ] 3.3: Index auf token-Spalte nutzen (bereits in Entity/Migration vorhanden aus Story 4.1)

- [ ] Task 4: validateToken() Methode mit Business-Logik (AC: #2, #3)
  - [ ] 4.1: findByToken() aufrufen, um Entity zu holen
  - [ ] 4.2: Validierungs-Logik implementieren:
    * Fall 1: Token nicht gefunden → `{ isValid: false, personalizedMessage: null, reason: 'not_found' }`
    * Fall 2: Token existiert aber isActive=false → `{ isValid: false, personalizedMessage: null, reason: 'inactive' }`
    * Fall 3: Token existiert, isActive=true, aber expiresAt<now() → `{ isValid: false, personalizedMessage: null, reason: 'expired' }`
    * Fall 4: Token existiert, isActive=true, (expiresAt=null ODER expiresAt>now()) → `{ isValid: true, personalizedMessage: entity.personalizedMessage, reason: 'valid' }`
  - [ ] 4.3: InviteValidationResponse-Type aus `@cv-hub/shared-types` importieren
  - [ ] 4.4: Response-Objekt gemäß InviteValidationResponseSchema zurückgeben

- [ ] Task 5: trackVisit() Methode mit Idempotenz (AC: #2, #4)
  - [ ] 5.1: findByToken() aufrufen, um Entity zu holen
  - [ ] 5.2: Wenn Token nicht gefunden → NOOP (silent fail, kein Error werfen)
  - [ ] 5.3: Wenn Token gefunden:
    * visitCount inkrementieren (`entity.visitCount++`)
    * lastVisitAt auf aktuellen Timestamp setzen (`entity.lastVisitAt = new Date()`)
  - [ ] 5.4: Idempotenz-Mechanismus implementieren:
    * Prüfe: Ist lastVisitAt weniger als 60 Sekunden alt?
    * Wenn ja → SKIP update (Count nicht erhöhen, mehrfache Calls innerhalb 1 Min zählen nur einmal)
    * Wenn nein → Führe Update durch
  - [ ] 5.5: Entity speichern (`repository.save(entity)`)

- [ ] Task 6: Unit-Tests für Service-Methoden (AC: #5)
  - [ ] 6.1: Test-Suite `apps/backend/src/modules/invite/invite.service.spec.ts` anlegen
  - [ ] 6.2: Mock-Repository erstellen (TypeORM Repository Mock mit jest.fn())
  - [ ] 6.3: Test: createInvite() - Generiert CUID2-Token, speichert Entity, gibt Entity zurück
  - [ ] 6.4: Test: findByToken() - Token existiert → Entity, Token nicht existiert → null
  - [ ] 6.5: Test: validateToken() - Token nicht gefunden → isValid=false, reason='not_found'
  - [ ] 6.6: Test: validateToken() - Token inactive → isValid=false, reason='inactive'
  - [ ] 6.7: Test: validateToken() - Token abgelaufen (expiresAt in Vergangenheit) → isValid=false, reason='expired'
  - [ ] 6.8: Test: validateToken() - Token gültig (active, nicht abgelaufen) → isValid=true, reason='valid', personalizedMessage included
  - [ ] 6.9: Test: validateToken() - Token gültig (active, expiresAt=null) → isValid=true
  - [ ] 6.10: Test: trackVisit() - Token nicht gefunden → NOOP (kein Error)
  - [ ] 6.11: Test: trackVisit() - Erster Visit → visitCount=1, lastVisitAt gesetzt
  - [ ] 6.12: Test: trackVisit() - Idempotenz: Zweiter Call innerhalb 60 Sekunden → visitCount bleibt 1
  - [ ] 6.13: Test: trackVisit() - Zweiter Call nach 60+ Sekunden → visitCount=2

## Dev Notes

### Architektur-Kontext

**Epic 4 Kontext:**
Diese Story implementiert die zentrale Business-Logik für das Token-basierte Invite-System. Der InviteService fungiert als Single Source of Truth für alle Invite-Operationen und wird von mehreren Controllern und Guards konsumiert (Story 4.4+). Die Trennung zwischen Service (Business-Logik) und Controller (HTTP-Layer) folgt dem NestJS-Modular-Pattern und ermöglicht unabhängiges Unit-Testing.

**Service Layer Pattern (NestJS):**
- **Separation of Concerns**: Controller = HTTP-Handling, Service = Business-Logik, Repository = Data Access
- **Dependency Injection**: Service erhält Repository via Constructor-Injection (`@InjectRepository`)
- **Testability**: Service-Logik kann mit Mock-Repository isoliert getestet werden (ohne echte DB)
- **Reusability**: Service-Methoden können von mehreren Controllern/Guards genutzt werden

**Token-Validierungs-Strategie:**
Die validateToken()-Methode implementiert eine hierarchische Validierung mit expliziten Reason-Codes:
1. **Existence Check**: Token muss in DB existieren → reason='not_found'
2. **Activation Check**: Token muss isActive=true sein → reason='inactive' (Admin kann Links deaktivieren)
3. **Expiration Check**: expiresAt muss null (kein Ablauf) ODER in Zukunft liegen → reason='expired'
4. **Success Case**: Alle Checks bestanden → reason='valid', personalizedMessage included

Diese expliziten Reasons ermöglichen differenzierte Error-Handling im Frontend (verschiedene User-Messages für expired vs. inactive).

**Idempotenz-Mechanismus (trackVisit):**
Das Requirements-Doc spezifiziert: "mehrfache Calls pro Minute zählen nur einmal". Dies verhindert inflated Statistiken bei:
- Browser-Refreshes
- Client-Side-Retries (z.B. durch TanStack Query)
- Bot-Traffic (aggressive Crawler)

Implementation: Check `lastVisitAt` vor Update. Wenn < 60 Sekunden alt → Skip. Grund: Die letzte Visit-Aktion war sehr kürzlich, wahrscheinlich derselbe User/Session.

**CUID2 Token-Generierung:**
CUID2 (Collision-Resistant Unique Identifier) wird für Invite-Tokens verwendet:
- **Length**: 25 Zeichen (vs. UUID 36 chars) → kompaktere URLs
- **URL-Safe**: Keine special chars (-, ., /, etc.) → direkt in URL-Path nutzbar
- **Collision-Resistant**: 4 quadrillion IDs before 50% collision probability
- **Multiple Entropy Sources**: Timestamp + Random + Counter + Machine Fingerprint

Package: `@paralleldrive/cuid2` (NPM, bereits in Story 4.1 Dependencies spezifiziert)

### Project Structure Notes

**Alignment mit Projekt-Struktur (aus Epic 1-3):**

```
apps/backend/src/modules/invite/
├── entities/
│   └── invite.entity.ts       # Story 4.1 (bestehend)
├── dto/
│   └── (shared-types package)  # Story 4.2 (bestehend)
├── invite.service.ts          # Diese Story (NEU)
├── invite.service.spec.ts     # Diese Story (NEU)
├── invite.controller.ts       # Story 4.4+ (zukünftig)
├── invite.module.ts           # Story 4.1 (bestehend, Update nötig)
└── guards/
    └── (zukünftig)
```

**NestJS Module-Update:**
Das InviteModule (Story 4.1) muss erweitert werden:
```typescript
// apps/backend/src/modules/invite/invite.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteEntity } from './entities/invite.entity';
import { InviteService } from './invite.service'; // NEU

@Module({
  imports: [TypeOrmModule.forFeature([InviteEntity])],
  providers: [InviteService], // NEU
  exports: [InviteService],    // NEU (für Controller/Guards)
})
export class InviteModule {}
```

**Shared Types Integration:**
Diese Story konsumiert Types aus `@cv-hub/shared-types` (Story 4.2):
```typescript
import {
  CreateInviteDto,
  InviteValidationResponse
} from '@cv-hub/shared-types';
```

Sicherstellen: Shared-types Package ist gebaut (`pnpm --filter @cv-hub/shared-types build`) bevor Backend gebaut wird.

**Hinweis für zukünftige Stories:**
- Story 4.4 (POST /api/admin/invite) nutzt `InviteService.createInvite()`
- Story 4.5 (GET /api/invite/:token) nutzt `InviteService.validateToken()` und `trackVisit()`
- Story 4.7 (GET /api/cv/private/:token) nutzt `validateToken()` via Guard

### Testing Strategy

**Unit-Tests (Vitest für NestJS Services):**
- **Service in Isolation testen**: Mock TypeORM Repository (keine echte DB)
- **Test-Double Pattern**: `jest.fn()` für Repository-Methoden (save, findOne, etc.)
- **Arrange-Act-Assert**: Setup Mock-Daten → Call Service-Methode → Assert Ergebnis + Repository-Calls

**Testing Framework:**
NestJS default: Jest, aber Projekt nutzt Vitest (Epic 1 Foundation)
- Vitest: 3-4x schneller als Jest, Vite-native, bessere Watch-Mode
- API-kompatibel mit Jest (gleiche Syntax: describe, it, expect, jest.fn)
- Test-Command: `pnpm test` (Root) oder `pnpm --filter backend test`

**Mock-Repository Beispiel:**
```typescript
const mockRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  // ... weitere Methoden
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('createInvite generates CUID2 token', async () => {
  // Arrange
  const dto: CreateInviteDto = { personalizedMessage: 'Hi!' };
  mockRepository.save.mockResolvedValue({ id: 1, token: 'xyz...', ...dto });

  // Act
  const result = await service.createInvite(dto);

  // Assert
  expect(result.token).toHaveLength(25); // CUID2 = 25 chars
  expect(mockRepository.save).toHaveBeenCalledWith(
    expect.objectContaining({ token: expect.any(String) })
  );
});
```

**Edge-Cases für validateToken():**
1. Token nicht in DB (findOne returns null)
2. Token existiert, aber isActive=false
3. Token existiert, isActive=true, aber expiresAt ist in Vergangenheit
4. Token existiert, isActive=true, expiresAt=null (kein Ablauf)
5. Token existiert, isActive=true, expiresAt in Zukunft

**Edge-Cases für trackVisit():**
1. Token nicht gefunden → NOOP, kein Error (graceful handling)
2. Erster Visit → visitCount=0→1, lastVisitAt gesetzt
3. Zweiter Visit innerhalb 60 Sekunden → visitCount bleibt gleich (Idempotenz)
4. Zweiter Visit nach 61+ Sekunden → visitCount+1, lastVisitAt updated

**Integration-Tests (später in Epic 4):**
- Story 4.4: E2E-Test POST /api/admin/invite → InviteService.createInvite()
- Story 4.5: E2E-Test GET /api/invite/:token → InviteService.validateToken() + trackVisit()

**Test-Database-Setup:**
Keine DB nötig für diese Story - reine Service-Unit-Tests mit Mocks

### Learnings from Previous Story

**From Story 4-2-invite-zod-schemas-und-shared-types (Status: drafted)**

Previous story not yet implemented - no predecessor learnings available yet.

**Wichtige Dependencies für diese Story:**
- Story 4.1 (CUID2 Token-Generierung und Link-Entity) muss abgeschlossen sein → InviteEntity verfügbar
- Story 4.2 (Invite Zod-Schemas und Shared Types) muss abgeschlossen sein → CreateInviteDto und InviteValidationResponse verfügbar

**Alignment-Check vor Start:**
1. Verify InviteEntity existiert: `apps/backend/src/modules/invite/entities/invite.entity.ts`
2. Verify Shared Types verfügbar: `import { CreateInviteDto } from '@cv-hub/shared-types'` funktioniert
3. Verify Migration ausgeführt: `invite` Tabelle existiert in DB

Wenn diese Prerequisites fehlen, müssen Stories 4.1 und 4.2 zuerst implementiert werden.

### References

**Primäre Quellen:**
- [Source: docs/epics.md#Epic-4-Story-4.3 - Story Requirements und Acceptance Criteria]
- [Source: docs/tech-spec-epic-4.md#Service-Layer-Architecture - InviteService-Spezifikation]
- [Source: docs/tech-spec-epic-4.md#Data-Models-and-Contracts - DTO-Definitionen und Entity-Schema]
- [Source: docs/architecture.md#Architecture-Patterns - Service Layer Pattern, Dependency Injection]

**Technische Referenzen:**
- NestJS Services: https://docs.nestjs.com/providers
- TypeORM Repository Pattern: https://typeorm.io/repository-api
- CUID2 Documentation: https://github.com/paralleldrive/cuid2
- Vitest Mocking: https://vitest.dev/guide/mocking.html
- NestJS Testing: https://docs.nestjs.com/fundamentals/testing

**Verwandte Stories:**
- Story 4.1 (CUID2-Token-Generierung und Link-Entity) - Dependency: InviteEntity
- Story 4.2 (Invite Zod-Schemas und Shared Types) - Dependency: DTOs und Types
- Story 4.4 (API-Endpoint POST /api/admin/invite) - Konsument: createInvite()
- Story 4.5 (API-Endpoint GET /api/invite/:token) - Konsument: validateToken(), trackVisit()
- Story 4.7 (GET /api/cv/private/:token) - Konsument: validateToken() via Guard

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-07: Story created (drafted) - Ready for implementation after Stories 4.1 and 4.2 are completed
