# Story 5.4: Admin Auth Controller und Login-Endpoint

Status: drafted

## Story

Als Admin,
möchte ich mich über POST /api/admin/auth/login einloggen,
damit ich Zugriff auf das Dashboard erhalte und Links verwalten kann.

## Acceptance Criteria

1. **AC-1:** AdminAuthController ist implementiert in `apps/backend/src/admin/controllers/admin-auth.controller.ts`
2. **AC-2:** POST /api/admin/auth/login Endpoint ist implementiert und verwendet LocalAuthGuard
3. **AC-3:** Request Body validiert mit Zod LoginDtoSchema: `{ username: string, password: string }`
4. **AC-4:** Bei erfolgreicher Authentifizierung: Session wird erstellt, User-Object zurückgegeben (ohne passwordHash): `{ success: true, user: { id, username } }`
5. **AC-5:** Bei fehlgeschlagener Authentifizierung: 401 Unauthorized mit Error-Message: `{ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }`
6. **AC-6:** Rate-Limiting ist aktiv: 5 Login-Versuche pro 15 Minuten pro IP (ThrottlerGuard)
7. **AC-7:** Integration-Tests für Login-Flow: Success Case (valid credentials), Failure Case (invalid credentials), Rate-Limit Case

## Tasks / Subtasks

- [ ] **Task 1: Zod Login-DTO-Schema erstellen** (AC: #3)
  - [ ] 1.1: Shared-Types-Package erweitern: `packages/shared-types/src/admin/auth.schemas.ts` erstellen
  - [ ] 1.2: LoginDtoSchema definieren: `username: z.string().min(3).max(50), password: z.string().min(8).max(128)`
  - [ ] 1.3: TypeScript-Type exportieren: `export type LoginDto = z.infer<typeof LoginDtoSchema>`
  - [ ] 1.4: Schema in Backend-DTO importieren: `apps/backend/src/admin/dto/login.dto.ts`
  - [ ] 1.5: Unit-Test für Schema-Validation (valid + invalid inputs)

- [ ] **Task 2: LocalAuthGuard implementieren** (AC: #2)
  - [ ] 2.1: Datei erstellen: `apps/backend/src/admin/guards/local-auth.guard.ts`
  - [ ] 2.2: Guard-Klasse erstellen, erweitert `@nestjs/passport` AuthGuard('local')
  - [ ] 2.3: Custom Error-Handling: Bei Fehler strukturiertes Error-Object zurückgeben (nicht default Passport Error)
  - [ ] 2.4: Guard in AdminModule als Provider registrieren
  - [ ] 2.5: Unit-Test für LocalAuthGuard (Mock Request, Success/Failure)

- [ ] **Task 3: AdminAuthController mit Login-Endpoint erstellen** (AC: #1, #2, #4, #5)
  - [ ] 3.1: Datei erstellen: `apps/backend/src/admin/controllers/admin-auth.controller.ts`
  - [ ] 3.2: Controller-Klasse mit @Controller('admin/auth') Decorator
  - [ ] 3.3: POST /login Endpoint implementieren:
    - @Post('login') Decorator
    - @UseGuards(LocalAuthGuard) - Passport führt Authentifizierung durch
    - @Body() mit Zod-Validation-Pipe für LoginDto
  - [ ] 3.4: Login-Handler: Nach erfolgreicher Guard-Validierung User aus `req.user` extrahieren
  - [ ] 3.5: Response-Format: `{ success: true, user: { id: user.id, username: user.username } }`
  - [ ] 3.6: Session wird automatisch von Passport erstellt (express-session + LocalStrategy Integration aus Story 5.3)
  - [ ] 3.7: Error-Handling: Catch UnauthorizedException von Guard, return strukturiertes Error-Object
  - [ ] 3.8: TSDoc-Kommentare für Endpoint (Beschreibung, Request/Response-Typen)

- [ ] **Task 4: Rate-Limiting mit ThrottlerGuard konfigurieren** (AC: #6)
  - [ ] 4.1: ThrottlerModule in AdminModule importieren: `ThrottlerModule.forRoot({ ttl: 900000, limit: 5 })` (15 min = 900000ms, 5 requests)
  - [ ] 4.2: ThrottlerGuard auf Login-Endpoint anwenden: `@UseGuards(ThrottlerGuard, LocalAuthGuard)` (Order wichtig: Throttler ZUERST)
  - [ ] 4.3: Custom Throttler-Exception-Handler für 429 Response mit klarer Message
  - [ ] 4.4: Verifizieren: Rate-Limit gilt pro IP (default Throttler-Verhalten)
  - [ ] 4.5: E2E-Test: 6 Login-Requests hintereinander → 6. Request sollte 429 zurückgeben

- [ ] **Task 5: Controller in AdminModule registrieren** (AC: #1)
  - [ ] 5.1: `apps/backend/src/admin/admin.module.ts` öffnen
  - [ ] 5.2: AdminAuthController in `controllers: [...]` Array hinzufügen
  - [ ] 5.3: ThrottlerModule in `imports: [...]` hinzufügen (falls nicht bereits vorhanden)
  - [ ] 5.4: Verifizieren dass LocalStrategy und AdminService als Providers registriert sind (aus Story 5.3)

- [ ] **Task 6: Integration-Tests für Login-Endpoint schreiben** (AC: #7)
  - [ ] 6.1: Test-Datei erstellen: `apps/backend/src/admin/controllers/admin-auth.controller.spec.ts`
  - [ ] 6.2: Test-Setup: Testing-Module mit AdminAuthController, LocalStrategy, AdminService, ThrottlerGuard
  - [ ] 6.3: Test: "POST /admin/auth/login - Success Case (valid credentials)"
    - Seed Admin-User in Test-DB
    - POST Request mit valid username/password
    - Expect: 200 Status, `{ success: true, user: { id, username } }`
    - Expect: Session-Cookie gesetzt (HttpOnly)
    - Expect: passwordHash NICHT im Response
  - [ ] 6.4: Test: "POST /admin/auth/login - Failure Case (invalid credentials)"
    - POST Request mit invalid username oder password
    - Expect: 401 Status, `{ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }`
    - Expect: Kein Session-Cookie gesetzt
  - [ ] 6.5: Test: "POST /admin/auth/login - Validation Error (missing fields)"
    - POST Request ohne username oder password
    - Expect: 400 Bad Request (Zod validation error)
  - [ ] 6.6: Test: "POST /admin/auth/login - Rate Limit Exceeded"
    - 6 POST Requests hintereinander senden
    - Expect: Request 1-5 erfolgen (200 oder 401)
    - Expect: Request 6 gibt 429 Too Many Requests zurück

- [ ] **Task 7: Swagger/OpenAPI-Dokumentation hinzufügen** (AC: #2)
  - [ ] 7.1: @ApiOperation() Decorator für Login-Endpoint: Beschreibung "Admin login with username and password"
  - [ ] 7.2: @ApiBody() Decorator: LoginDto Schema dokumentieren
  - [ ] 7.3: @ApiResponse() Decorators:
    - 200: Success Response mit User-Object
    - 401: Unauthorized (invalid credentials)
    - 429: Too Many Requests (rate limit)
  - [ ] 7.4: @ApiTags('admin-auth') für Controller
  - [ ] 7.5: Verifizieren in Swagger UI unter `/api/docs`

## Dev Notes

### Architecture Context

**Login-Flow mit Passport.js + NestJS:**
- **Request Flow:** Client → POST /api/admin/auth/login → ThrottlerGuard → LocalAuthGuard → LocalStrategy.validate() → AdminService.validateUser() → Session erstellt → User-Object zurückgegeben
- **Guards Execution Order:** ThrottlerGuard (Rate-Limiting) MUSS VOR LocalAuthGuard ausgeführt werden, damit Brute-Force-Versuche BEVOR Passport-Validierung geblockt werden
- **Session-Management:** Nach erfolgreicher Authentifizierung serialisiert Passport User.id in express-session (Cookie wird automatisch gesetzt)
- **Passport Integration:** LocalAuthGuard ruft LocalStrategy (Story 5.3) auf, welche AdminService.validateUser() verwendet

**API-Architektur:**
- **Endpoint:** POST /api/admin/auth/login
- **Request Body:** `{ username: string, password: string }` - validiert mit Zod
- **Success Response (200):** `{ success: true, user: { id: number, username: string } }`
- **Error Response (401):** `{ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }`
- **Rate-Limit Response (429):** Standard NestJS Throttler Error

**Security-Constraints:**
- **Rate-Limiting:** 5 Versuche pro 15 Minuten pro IP (Brute-Force-Protection)
- **Password-Hashing:** Argon2 verify in AdminService.validateUser() (Story 5.3)
- **Session-Cookie:** HttpOnly, Secure (Production), SameSite=Lax (Session-Config aus Story 5.2)
- **Generic Error Messages:** "Invalid credentials" - NICHT "Username not found" oder "Wrong password" (Information Leak Prevention)

[Source: docs/tech-spec-epic-5.md#APIs and Interfaces > Authentication Endpoints]
[Source: docs/tech-spec-epic-5.md#Security > Authentication & Sessions]

### Project Structure Notes

**Neue Dateien:**
- `apps/backend/src/admin/controllers/admin-auth.controller.ts` - Login-Endpoint + Controller
- `apps/backend/src/admin/guards/local-auth.guard.ts` - Passport LocalAuthGuard Wrapper
- `apps/backend/src/admin/dto/login.dto.ts` - Backend DTO (importiert Zod Schema)
- `packages/shared-types/src/admin/auth.schemas.ts` - Shared Zod Schemas für Admin-Auth
- `apps/backend/src/admin/controllers/admin-auth.controller.spec.ts` - Integration-Tests

**Zu modifizierende Dateien:**
- `apps/backend/src/admin/admin.module.ts` - AdminAuthController + ThrottlerModule registrieren
- `packages/shared-types/src/index.ts` - Auth-Schemas exportieren

**Alignment mit unified-project-structure:**
- Admin-Controller unter `apps/backend/src/admin/controllers/` (konsistent mit NestJS Module-Pattern)
- Shared Zod Schemas in `packages/shared-types/src/admin/` (Frontend + Backend nutzen dieselben Schemas)
- DTOs in `apps/backend/src/admin/dto/` (Backend-spezifische Validierung)
- Guards in `apps/backend/src/admin/guards/` (Auth-Guards co-located mit Admin-Modul)

**Integration Points:**
- **LocalStrategy (Story 5.3):** LocalAuthGuard ruft LocalStrategy auf, welche AdminService.validateUser() verwendet
- **Session-Management (Story 5.2):** express-session erstellt Session-Cookie nach erfolgreichem Login
- **Shared Types Package:** Zod-Schemas werden in Frontend (Story 5.8) wiederverwendet

[Source: docs/architecture.md#Component Architecture]

### Testing Strategy

**Unit Tests (Jest):**
- **LoginDto Schema Validation:**
  - Valid username + password → Schema valid
  - Invalid username (< 3 chars) → Validation error
  - Invalid password (< 8 chars) → Validation error
  - Missing fields → Validation error
- **LocalAuthGuard:**
  - Mock Request mit valid user → canActivate() returns true
  - Mock Request mit invalid user → throws UnauthorizedException
- **Target Coverage:** >80%

**Integration Tests (Jest + Supertest):**
- **Success Case:**
  - POST /admin/auth/login mit valid credentials
  - Expect: 200, User-Object zurückgegeben, Session-Cookie gesetzt
  - Verify: passwordHash NICHT im Response
- **Failure Case (Invalid Credentials):**
  - POST /admin/auth/login mit invalid username
  - Expect: 401, Error-Message "Invalid credentials"
  - Expect: Kein Session-Cookie
- **Failure Case (Invalid Password):**
  - POST /admin/auth/login mit invalid password
  - Expect: 401, Error-Message "Invalid credentials"
- **Validation Error:**
  - POST /admin/auth/login ohne username/password
  - Expect: 400 Bad Request
- **Rate-Limit Test:**
  - 6 consecutive POST requests
  - Expect: Request 6 gibt 429 Too Many Requests
- **Target Coverage:** >60%

**E2E Tests (Playwright - Story 5.8):**
- Login-Flow wird im Frontend E2E-Test abgedeckt

**Test-Daten:**
- Admin-User in Test-DB geseedet: `username=admin, password=test123` (Argon2-gehashed)

[Source: docs/tech-spec-epic-5.md#Test Strategy Summary]

### Security Considerations

**Brute-Force Protection:**
- **Rate-Limiting:** ThrottlerGuard limitiert auf 5 Versuche pro 15 Minuten
- **IP-based Throttling:** Standard Throttler-Verhalten nutzt Client-IP
- **Order of Guards:** ThrottlerGuard VOR LocalAuthGuard → Rate-Limit greift BEVOR Passport-Validierung (effizienter)
- **Growth Feature:** CAPTCHA nach 3 fehlgeschlagenen Versuchen (nicht in MVP)

**Generic Error Messages:**
- **Information Leak Prevention:** Error-Message ist IMMER "Invalid credentials"
- **NICHT unterscheiden** zwischen "Username not found" und "Wrong password" → Attackers könnten sonst valide Usernames enumerieren
- **Frontend:** Zeigt generische Fehlermeldung "Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten."

**Session Security:**
- **HttpOnly Cookie:** Session-Cookie kann nicht via JavaScript zugegriffen werden (XSS-Protection)
- **Secure Flag:** In Production nur über HTTPS (Cookie wird nicht über HTTP gesendet)
- **SameSite=Lax:** CSRF-Protection auf Cookie-Level
- **Session-Secret:** 32-byte random string aus Environment-Variable (nie im Code)

**Password Handling:**
- **Argon2 Verification:** AdminService.validateUser() nutzt argon2.verify() (Story 5.3)
- **Timing-Attack-Safe:** Argon2 hat konstante Ausführungszeit
- **Password NIEMALS loggen:** Auch bei Validation-Errors kein Password in Logs

**Input Validation:**
- **Zod Schema:** Validiert Username (min 3, max 50) und Password (min 8, max 128)
- **Max Length für Password:** 128 chars verhindert DoS via extrem lange Inputs
- **Whitespace Trimming:** Username wird getrimmmt (`.trim()` in validateUser)

[Source: docs/tech-spec-epic-5.md#Security > Authentication & Sessions]
[Source: docs/PRD.md#Security > Authentication]

### References

- **Tech-Spec:** docs/tech-spec-epic-5.md#APIs and Interfaces > Authentication Endpoints
- **Architecture:** docs/architecture.md#Security Architecture > Authentication & Authorization > Admin Authentication: Session-Based
- **PRD:** docs/PRD.md#FR-4: Admin-Dashboard (Session-based Auth with Passport.js)
- **Epic Breakdown:** docs/epics.md > Epic 5 > Story 5.4
- **Dependencies:**
  - @nestjs/passport: https://docs.nestjs.com/recipes/passport
  - @nestjs/throttler: https://docs.nestjs.com/security/rate-limiting
  - passport: http://www.passportjs.org/
  - zod: https://zod.dev/
- **Security Best Practices:**
  - OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
  - NestJS Security Best Practices: https://docs.nestjs.com/security/authentication

### Prerequisites

**Story 5.3 (Passport.js Local Strategy):**
- LocalStrategy MUSS existieren (wird von LocalAuthGuard verwendet)
- AdminService.validateUser() MUSS implementiert sein
- PassportModule MUSS im AdminModule registriert sein

**Story 5.2 (Session-Management):**
- express-session MUSS konfiguriert sein (Session-Cookie-Handling)
- SessionModule MUSS in AppModule importiert sein

**Story 5.1 (Admin User Entity):**
- Admin-User MUSS in DB vorhanden sein (für Testing)
- AdminService MUSS existieren

**Empfehlung:**
- Story 5.1, 5.2 und 5.3 MÜSSEN komplett abgeschlossen sein
- Integration-Tests benötigen funktionierende Session-Infrastruktur

### Learnings from Previous Story

**From Story 5.3: Passport.js Local Strategy für Admin-Login (Status: drafted)**

Da Story 5.3 noch nicht implementiert ist, gibt es keine spezifischen Code-Learnings. Jedoch wichtige Kontext-Informationen:

**LocalStrategy Integration Points:**
- **LocalAuthGuard (diese Story)** verwendet die LocalStrategy aus Story 5.3
- **Passport Flow:** LocalAuthGuard → LocalStrategy.validate() → AdminService.validateUser() → Argon2 verify
- **Error-Handling:** LocalStrategy wirft UnauthorizedException bei invalid credentials → LocalAuthGuard fängt diese und gibt 401 zurück

**Session-Serialization (aus Story 5.2 + 5.3 Kontext):**
- Nach erfolgreichem Login serialisiert Passport automatisch user.id in Session
- express-session speichert Session-Daten in SQLite (connect-sqlite3)
- Session-Cookie wird automatisch gesetzt (HttpOnly, Secure, SameSite=Lax)

**AdminService.validateUser() Kontrakt (Story 5.3):**
- **Signatur:** `async validateUser(username: string, password: string): Promise<{ id: number; username: string } | null>`
- **Return:** User-Object (ohne passwordHash) bei Erfolg, `null` bei Fehler
- **WICHTIG:** validateUser() gibt KEINE Exception bei Fehler → LocalStrategy wirft dann UnauthorizedException

**Testing-Patterns (aus Epic 5 Tech-Spec):**
- Jest + Supertest für Integration-Tests etabliert
- Mock-Factories für TypeORM-Repositories vorhanden
- Test-Coverage-Target: >80% Unit-Tests, >60% Integration-Tests

**Security-Patterns (aus früheren Epics):**
- Generic Error Messages (prevent info leak)
- Rate-Limiting via ThrottlerGuard (NestJS Pattern)
- Zod für Input-Validation (konsistent über alle Epics)
- Argon2 für Password-Hashing (aus Story 5.1)

**Shared-Types-Package (aus Epic 1):**
- Zod-Schemas werden in `packages/shared-types` definiert
- Frontend und Backend importieren dieselben Schemas (Single Source of Truth)
- DTO-Pattern: Backend DTO importiert Zod Schema aus shared-types

[Source: docs/stories/5-3-passport-js-local-strategy-fuer-admin-login.md#Dev-Notes]
[Source: docs/tech-spec-epic-5.md#Overview]

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
- 2025-11-08: Story drafted by Scrum Master (Bob) based on Epic 5 Tech-Spec, Epics, PRD, and previous story learnings
