# Story 5.5: AdminAuthGuard für geschützte Routen

Status: drafted

## Story

Als Entwickler,
möchte ich einen AdminAuthGuard der alle Admin-Routen schützt,
damit nur authentifizierte Admins Zugriff auf geschützte Endpoints haben.

## Acceptance Criteria

1. **AC-1:** AdminAuthGuard ist implementiert in `apps/backend/src/admin/guards/admin-auth.guard.ts`
2. **AC-2:** Guard prüft `request.isAuthenticated()` (Passport Session-Validierung)
3. **AC-3:** Bei nicht-authentifizierten Requests: Guard wirft UnauthorizedException, Response gibt 401 Unauthorized
4. **AC-4:** Guard kann via `@UseGuards(AdminAuthGuard)` Decorator auf Controllern/Endpoints verwendet werden
5. **AC-5:** GET /api/admin/auth/status Endpoint ist implementiert und mit AdminAuthGuard geschützt
6. **AC-6:** Status-Endpoint liefert aktuellen Auth-Status: `{ authenticated: true/false, user: { id, username } | null }`
7. **AC-7:** POST /api/admin/auth/logout Endpoint ist implementiert und mit AdminAuthGuard geschützt
8. **AC-8:** Logout-Endpoint zerstört Session (req.logout() + req.session.destroy()) und liefert Success-Response
9. **AC-9:** Unit-Tests für AdminAuthGuard (Mock Request mit/ohne Session, Success/Failure Cases)
10. **AC-10:** Integration-Tests für Status- und Logout-Endpoints (mit/ohne gültige Session)

## Tasks / Subtasks

- [ ] **Task 1: AdminAuthGuard implementieren** (AC: #1, #2, #3, #4)
  - [ ] 1.1: Datei erstellen: `apps/backend/src/admin/guards/admin-auth.guard.ts`
  - [ ] 1.2: Guard-Klasse erstellen, implementiert `CanActivate` Interface von `@nestjs/common`
  - [ ] 1.3: `canActivate()` Method implementieren:
    - Prüft `context.switchToHttp().getRequest()`
    - Ruft `request.isAuthenticated()` auf (Passport Session Helper)
    - Return `true` wenn authenticated, sonst `false`
  - [ ] 1.4: Exception-Handling: Bei `false` → throw `new UnauthorizedException('Not authenticated')`
  - [ ] 1.5: Guard als `@Injectable()` markieren und in AdminModule als Provider registrieren
  - [ ] 1.6: TSDoc-Kommentare: Beschreibung, Usage-Beispiel mit `@UseGuards(AdminAuthGuard)`

- [ ] **Task 2: GET /api/admin/auth/status Endpoint implementieren** (AC: #5, #6)
  - [ ] 2.1: `apps/backend/src/admin/controllers/admin-auth.controller.ts` öffnen (existiert aus Story 5.4)
  - [ ] 2.2: GET /status Endpoint hinzufügen:
    - @Get('status') Decorator
    - @UseGuards(AdminAuthGuard) - Guard schützt Endpoint
  - [ ] 2.3: Status-Handler implementieren:
    - Extrahiert User aus `req.user` (Passport Session Payload)
    - Return `{ authenticated: true, user: { id: user.id, username: user.username } }`
  - [ ] 2.4: Öffentliche Variante: Status-Endpoint OHNE Guard für Client-seitige Auth-Checks
    - GET /status/public Endpoint (KEIN Guard)
    - Return `{ authenticated: req.isAuthenticated(), user: req.isAuthenticated() ? {...} : null }`
  - [ ] 2.5: Swagger-Dokumentation:
    - @ApiOperation() für beide Endpoints
    - @ApiResponse() für 200 (Success) und 401 (Unauthorized)

- [ ] **Task 3: POST /api/admin/auth/logout Endpoint implementieren** (AC: #7, #8)
  - [ ] 3.1: POST /logout Endpoint in AdminAuthController hinzufügen:
    - @Post('logout') Decorator
    - @UseGuards(AdminAuthGuard) - Guard schützt Endpoint
  - [ ] 3.2: Logout-Handler implementieren:
    - Ruft `req.logout()` auf (Passport Helper - entfernt User aus Session)
    - Ruft `req.session.destroy()` auf (express-session - löscht Session komplett)
    - Callback-Handling für async session.destroy()
    - Return `{ success: true, message: 'Logged out successfully' }`
  - [ ] 3.3: Error-Handling: Catch session.destroy() Errors, log via Pino, return 500 bei Fehler
  - [ ] 3.4: Response clearts Session-Cookie: Backend sendet `Set-Cookie` Header mit expired Cookie
  - [ ] 3.5: Swagger-Dokumentation:
    - @ApiOperation() beschreibt Logout-Flow
    - @ApiResponse() für 200 (Success), 401 (Unauthorized), 500 (Internal Error)

- [ ] **Task 4: Unit-Tests für AdminAuthGuard schreiben** (AC: #9)
  - [ ] 4.1: Test-Datei erstellen: `apps/backend/src/admin/guards/admin-auth.guard.spec.ts`
  - [ ] 4.2: Test-Setup: Mock ExecutionContext mit switchToHttp().getRequest()
  - [ ] 4.3: Test: "canActivate() returns true if user is authenticated"
    - Mock Request: `{ isAuthenticated: () => true }`
    - Expect: `canActivate()` returns `true`
  - [ ] 4.4: Test: "canActivate() throws UnauthorizedException if user NOT authenticated"
    - Mock Request: `{ isAuthenticated: () => false }`
    - Expect: `canActivate()` throws `UnauthorizedException`
    - Expect: Error message = "Not authenticated"
  - [ ] 4.5: Test: "canActivate() throws if request.isAuthenticated() is undefined"
    - Mock Request ohne `isAuthenticated` Method
    - Expect: Guard throws Error (Passport Session nicht konfiguriert)

- [ ] **Task 5: Integration-Tests für Status- und Logout-Endpoints** (AC: #10)
  - [ ] 5.1: Test-Datei: `apps/backend/src/admin/controllers/admin-auth.controller.spec.ts` erweitern (existiert aus Story 5.4)
  - [ ] 5.2: Test: "GET /admin/auth/status - Authenticated User"
    - Setup: Login User (POST /login mit valid credentials)
    - Request: GET /admin/auth/status mit Session-Cookie
    - Expect: 200 Status, `{ authenticated: true, user: { id, username } }`
  - [ ] 5.3: Test: "GET /admin/auth/status - NOT Authenticated"
    - Request: GET /admin/auth/status OHNE Session-Cookie
    - Expect: 401 Unauthorized
  - [ ] 5.4: Test: "GET /admin/auth/status/public - Returns auth state for unauthenticated"
    - Request: GET /admin/auth/status/public OHNE Session
    - Expect: 200 Status, `{ authenticated: false, user: null }`
  - [ ] 5.5: Test: "GET /admin/auth/status/public - Returns auth state for authenticated"
    - Setup: Login User
    - Request: GET /admin/auth/status/public mit Session-Cookie
    - Expect: 200 Status, `{ authenticated: true, user: { id, username } }`
  - [ ] 5.6: Test: "POST /admin/auth/logout - Success Case"
    - Setup: Login User (valid session exists)
    - Request: POST /admin/auth/logout mit Session-Cookie
    - Expect: 200 Status, `{ success: true, message: 'Logged out successfully' }`
    - Expect: Session-Cookie cleared (expired or deleted)
    - Verify: Subsequent request to /status gives 401 (Session destroyed)
  - [ ] 5.7: Test: "POST /admin/auth/logout - NOT Authenticated"
    - Request: POST /admin/auth/logout OHNE Session-Cookie
    - Expect: 401 Unauthorized (AdminAuthGuard blockt Request)

- [ ] **Task 6: AdminAuthGuard auf bestehenden Admin-Endpoints aktivieren** (AC: #4)
  - [ ] 6.1: Placeholder Admin-Endpoints aus Epic 2 identifizieren:
    - `apps/backend/src/modules/cv/controllers/cv.controller.ts` - Admin CV Endpoints (PATCH /admin/cv, etc.)
  - [ ] 6.2: AdminAuthGuard importieren und auf Admin-Endpoints anwenden:
    - Import `AdminAuthGuard` from admin module
    - `@UseGuards(AdminAuthGuard)` Decorator auf Admin-Methods
  - [ ] 6.3: Placeholder AdminAuthGuard aus Epic 2 ENTFERNEN (falls vorhanden)
    - Epic 2 Story 2.8 hatte Placeholder Guard (501 Not Implemented)
    - Ersetzen durch echten AdminAuthGuard
  - [ ] 6.4: Verifizieren: Admin-Endpoints jetzt mit Session-Auth geschützt (via Integration-Tests)

- [ ] **Task 7: Swagger/OpenAPI-Dokumentation vervollständigen** (AC: #5, #7)
  - [ ] 7.1: @ApiTags('admin-auth') für AdminAuthController (falls nicht bereits vorhanden aus Story 5.4)
  - [ ] 7.2: Status-Endpoint dokumentieren:
    - @ApiOperation({ summary: 'Get current authentication status' })
    - @ApiResponse({ status: 200, description: 'Auth status returned', schema: {...} })
    - @ApiResponse({ status: 401, description: 'Not authenticated' })
  - [ ] 7.3: Logout-Endpoint dokumentieren:
    - @ApiOperation({ summary: 'Logout admin user and destroy session' })
    - @ApiResponse({ status: 200, description: 'Logout successful' })
    - @ApiResponse({ status: 401, description: 'Not authenticated' })
    - @ApiResponse({ status: 500, description: 'Session destroy failed' })
  - [ ] 7.4: Verifizieren in Swagger UI (`/api/docs`): Status und Logout Endpoints sichtbar

## Dev Notes

### Architecture Context

**Guard Execution Flow:**
- **Request Flow:** Client → Request → AdminAuthGuard.canActivate() → Passport Session Check (`req.isAuthenticated()`) → Controller Handler
- **Session Validation:** Passport's `req.isAuthenticated()` prüft ob `req.session.passport.user` existiert (User-ID wurde bei Login serialisiert)
- **Unauthorized Flow:** Guard wirft UnauthorizedException → NestJS Exception Filter → HTTP 401 Response

**AdminAuthGuard vs. LocalAuthGuard (Story 5.4):**
- **LocalAuthGuard:** Für Login-Endpoint, ruft LocalStrategy auf, führt Username/Password-Validierung durch
- **AdminAuthGuard:** Für geschützte Endpoints, prüft NUR ob Session existiert (KEINE Credentials-Validation)
- **Unterschied:** LocalAuthGuard = Authentifizierung, AdminAuthGuard = Autorisierung (Session-Prüfung)

**Passport Session Integration:**
- **Session Persistence (Story 5.2):** express-session speichert Session in SQLite (`sessions` table)
- **Session Serialization (Story 5.3):** Passport serialisiert `user.id` in Session nach Login
- **isAuthenticated() Helper:** Passport-Methode, prüft `req.session.passport.user` !== undefined
- **Logout Flow:** `req.logout()` entfernt User aus Passport-Kontext, `req.session.destroy()` löscht Session komplett

**Status-Endpoint Varianten:**
- **GET /api/admin/auth/status (geschützt):** Für Admin-Dashboard, garantiert authentifizierter User
- **GET /api/admin/auth/status/public (ungeschützt):** Für Frontend Client-Side Auth-Checks (z.B. bevor zu /admin navigiert wird)
- **Unterschied:** Public-Variante gibt `{ authenticated: false }` zurück statt 401 → Frontend kann conditional rendering ohne Error-Handling

**Logout Best Practices:**
- **Dual Cleanup:** `req.logout()` (Passport) UND `req.session.destroy()` (express-session) - beide erforderlich
- **Cookie Clearing:** express-session sendet `Set-Cookie` mit `Max-Age=0` → Browser löscht Cookie
- **Async Handling:** `session.destroy()` ist async mit Callback → Promise-Wrapper oder async/await erforderlich
- **Error Handling:** Session-DB-Errors können auftreten → Logging wichtig, Return 500 nur bei kritischem Fehler

[Source: docs/tech-spec-epic-5.md#Services and Modules > AdminAuthGuard]
[Source: docs/tech-spec-epic-5.md#APIs and Interfaces > Authentication Endpoints]

### Project Structure Notes

**Neue Dateien:**
- `apps/backend/src/admin/guards/admin-auth.guard.ts` - Session-based Guard für Admin-Routen
- `apps/backend/src/admin/guards/admin-auth.guard.spec.ts` - Unit-Tests für Guard

**Zu modifizierende Dateien:**
- `apps/backend/src/admin/controllers/admin-auth.controller.ts` - Status + Logout Endpoints hinzufügen
- `apps/backend/src/admin/controllers/admin-auth.controller.spec.ts` - Integration-Tests erweitern
- `apps/backend/src/admin/admin.module.ts` - AdminAuthGuard in Providers registrieren (Export für andere Module)
- `apps/backend/src/modules/cv/controllers/cv.controller.ts` - AdminAuthGuard auf Admin-CV-Endpoints anwenden (Epic 2 Placeholder ersetzen)

**Alignment mit unified-project-structure:**
- Guards unter `apps/backend/src/admin/guards/` (co-located mit Admin-Modul)
- AuthController erweitert (bestehende Datei aus Story 5.4)
- AdminModule exportiert AdminAuthGuard (andere Module können importieren)

**Integration Points:**
- **Passport Session (Story 5.2 + 5.3):** `req.isAuthenticated()` Methode wird von Passport bereitgestellt
- **LocalAuthGuard (Story 5.4):** Verwendet für Login, AdminAuthGuard für alle nachfolgenden Requests
- **Epic 2 Admin Endpoints:** PATCH /admin/cv, GET /admin/cv/versions, etc. werden mit AdminAuthGuard geschützt
- **Frontend (Story 5.8):** Status-Endpoint wird für Client-Side Auth-State-Management verwendet

[Source: docs/architecture.md#Component Architecture]

### Testing Strategy

**Unit Tests (Jest):**
- **AdminAuthGuard:**
  - Request mit `isAuthenticated() = true` → canActivate() returns true
  - Request mit `isAuthenticated() = false` → throws UnauthorizedException
  - Request ohne `isAuthenticated` Method → throws Error (Passport nicht konfiguriert)
- **Target Coverage:** >80%

**Integration Tests (Jest + Supertest):**
- **Status-Endpoint (Authenticated):**
  - Login User → GET /admin/auth/status
  - Expect: 200, `{ authenticated: true, user: {...} }`
- **Status-Endpoint (NOT Authenticated):**
  - GET /admin/auth/status OHNE Session
  - Expect: 401 Unauthorized
- **Status-Public-Endpoint (Authenticated + Unauthenticated):**
  - Test beide Fälle: mit/ohne Session
  - Expect: 200 in beiden Fällen, unterschiedliche `authenticated` Flag
- **Logout-Endpoint (Success):**
  - Login User → POST /admin/auth/logout
  - Expect: 200, Session-Cookie cleared
  - Verify: GET /admin/auth/status nach Logout gibt 401
- **Logout-Endpoint (NOT Authenticated):**
  - POST /admin/auth/logout OHNE Session
  - Expect: 401 (AdminAuthGuard blockt)
- **Protected Admin-Endpoints (Epic 2):**
  - PATCH /admin/cv OHNE Session → 401
  - PATCH /admin/cv mit Session → 200 oder entsprechende Response
- **Target Coverage:** >60%

**E2E Tests (Playwright - Story 5.8):**
- Status-Check und Logout-Flow werden im Frontend E2E-Test abgedeckt

**Test-Daten:**
- Admin-User in Test-DB geseedet: `username=admin, password=test123` (aus Story 5.1)
- Session-Cookie nach Login-Request für authenticated Tests

[Source: docs/tech-spec-epic-5.md#Test Strategy Summary]

### Security Considerations

**Session Hijacking Prevention:**
- **HttpOnly Cookie:** Session-Cookie kann nicht via JavaScript zugegriffen werden (XSS-Protection, aus Story 5.2)
- **Secure Flag:** Production: Cookie nur über HTTPS (MITM-Protection)
- **SameSite=Lax:** CSRF-Protection auf Cookie-Level
- **Session Expiry:** 7 Tage inactivity → auto-logout (Session-Config aus Story 5.2)

**Guard Security:**
- **Stateless Guard:** AdminAuthGuard hat keinen eigenen State, verlässt sich auf Passport Session
- **Early Return:** Unauthorized Requests werden sofort abgelehnt (kein Controller-Code ausgeführt)
- **No Timing Attack:** `isAuthenticated()` check ist konstante Zeit (bool check, kein Vergleich)

**Logout Security:**
- **Complete Cleanup:** `req.logout()` UND `req.session.destroy()` - verhindert Session-Reuse
- **Cookie Clearing:** Browser löscht Cookie nach Logout (kein residual Cookie)
- **CSRF-Safe:** Logout ist POST (nicht GET) → verhindert CSRF via Image-Tag (z.B. `<img src="/logout">`)

**Error Messages:**
- **Generic Unauthorized:** AdminAuthGuard gibt "Not authenticated" (NICHT "Session expired" vs "No session")
- **Information Leak Prevention:** Kein Hint ob User existiert oder Session invalid

**Rate Limiting (Optional, nicht in MVP):**
- **Growth Feature:** Rate-Limiting für /status Endpoint (verhindert Session-Enumeration)
- **Current State:** Keine Rate-Limiting auf /status oder /logout (nur Login aus Story 5.4 hat ThrottlerGuard)

[Source: docs/tech-spec-epic-5.md#Security > Authentication & Sessions]
[Source: docs/PRD.md#Security > Authentication]

### References

- **Tech-Spec:** docs/tech-spec-epic-5.md#Services and Modules > AdminAuthGuard
- **Architecture:** docs/architecture.md#Security Architecture > Authentication & Authorization > Admin Authentication: Session-Based
- **PRD:** docs/PRD.md#FR-4: Admin-Dashboard (Session-based Auth with Passport.js)
- **Epic Breakdown:** docs/epics.md > Epic 5 > Story 5.5
- **Dependencies:**
  - @nestjs/common: https://docs.nestjs.com/guards
  - @nestjs/passport: https://docs.nestjs.com/recipes/passport#implementing-passport-strategies
  - passport: http://www.passportjs.org/concepts/authentication/logout/
  - express-session: https://github.com/expressjs/session#sessiondestroyc callback
- **Security Best Practices:**
  - OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
  - NestJS Guards: https://docs.nestjs.com/guards

### Prerequisites

**Story 5.4 (Admin Auth Controller und Login-Endpoint):**
- AdminAuthController MUSS existieren (wird in dieser Story erweitert)
- POST /api/admin/auth/login MUSS funktionieren (Login erstellt Session)
- LocalAuthGuard MUSS existieren (unterscheidet sich von AdminAuthGuard)

**Story 5.3 (Passport.js Local Strategy):**
- Passport Session Serialization MUSS funktionieren (user.id in Session)
- `req.isAuthenticated()` Helper MUSS verfügbar sein (Passport-Methode)

**Story 5.2 (Session-Management):**
- express-session MUSS konfiguriert sein (Session-Cookie-Handling)
- Session-Store MUSS funktionieren (SQLite-backed Sessions)

**Empfehlung:**
- Story 5.1-5.4 MÜSSEN komplett abgeschlossen sein
- AdminAuthGuard ist Voraussetzung für alle folgenden Stories (5.6-5.12)

### Learnings from Previous Story

**From Story 5.4: Admin Auth Controller und Login-Endpoint (Status: drafted)**

Da Story 5.4 noch nicht implementiert ist, gibt es keine spezifischen Code-Learnings. Jedoch wichtige Kontext-Informationen:

**LocalAuthGuard vs. AdminAuthGuard (Unterscheidung):**
- **LocalAuthGuard (Story 5.4):** Für Login-Endpoint, führt Username/Password-Validation durch, ruft LocalStrategy auf
- **AdminAuthGuard (diese Story):** Für geschützte Endpoints, prüft NUR ob Session existiert
- **Gemeinsam:** Beide sind NestJS Guards, beide nutzen Passport (aber unterschiedliche Strategien/Methoden)
- **Wichtig:** AdminAuthGuard ist EINFACHER als LocalAuthGuard (nur Session-Check, kein Credentials-Handling)

**Session-Flow nach Login (Story 5.4):**
- Login erfolgreich → LocalStrategy.validate() returns User → Passport serialisiert `user.id` in Session → Session-Cookie gesetzt
- Nach Login: Alle Requests mit Session-Cookie enthalten `req.user` (automatisch deserialisiert von Passport)
- AdminAuthGuard nutzt `req.isAuthenticated()` um zu prüfen ob `req.user` existiert

**AdminAuthController Erweiterung (diese Story):**
- Story 5.4 erstellt AdminAuthController mit POST /login
- Diese Story ERWEITERT Controller mit GET /status und POST /logout
- **Pattern:** Beide Stories arbeiten an derselben Datei → Integration-Tests müssen erweitert werden (nicht neu erstellt)

**Testing-Patterns (aus Epic 5 Tech-Spec):**
- Jest + Supertest für Integration-Tests etabliert
- Mock-Factories für TypeORM-Repositories vorhanden (falls Admin-Endpoints DB-Zugriff brauchen)
- Test-Coverage-Target: >80% Unit-Tests, >60% Integration-Tests

**Security-Patterns (aus früheren Stories):**
- Generic Error Messages (prevent info leak) - AdminAuthGuard gibt "Not authenticated" (keine Details)
- ThrottlerGuard für Rate-Limiting (Login hat 5 req/15min aus Story 5.4, Status/Logout haben KEIN Rate-Limiting in MVP)
- HttpOnly + Secure Cookies (aus Story 5.2)
- Session Expiry (7 Tage aus Story 5.2)

**Swagger-Integration (aus Story 5.4):**
- AdminAuthController hat bereits @ApiTags('admin-auth') (falls Story 5.4 komplett)
- Diese Story erweitert Swagger-Docs mit Status/Logout-Endpoints
- Pattern: @ApiOperation(), @ApiResponse() Decorators für jedes Endpoint

**Placeholder AdminAuthGuard aus Epic 2 (Story 2.8):**
- Epic 2 hatte "TODO Epic 5: Implement real AdminAuthGuard" Kommentar
- Admin CV Endpoints (PATCH /admin/cv, etc.) hatten Placeholder Guard (501 Not Implemented oder Bypass)
- **Diese Story ersetzt Placeholder:** AdminAuthGuard wird auf Epic 2 Admin-Endpoints angewendet
- **Testing:** Integration-Tests für Epic 2 Admin-Endpoints müssen angepasst werden (Session-Cookie erforderlich)

[Source: docs/stories/5-4-admin-auth-controller-und-login-endpoint.md#Dev-Notes]
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
- 2025-11-08: Story drafted by Scrum Master (Bob) based on Epic 5 Tech-Spec, Epics, PRD, Architecture, and previous story learnings from 5-4
