# Story 5.3: Passport.js Local Strategy für Admin-Login

Status: drafted

## Story

Als Entwickler,
möchte ich Passport.js Local Strategy mit Username/Password-Authentifizierung implementieren,
so dass Admins sich über `/api/admin/auth/login` einloggen können und Sessions erstellt werden.

## Acceptance Criteria

1. **AC-1:** `@nestjs/passport`, `passport`, `passport-local`, und `@types/passport-local` Dependencies sind installiert und in `package.json` dokumentiert
2. **AC-2:** LocalStrategy ist implementiert in `apps/backend/src/admin/strategies/local.strategy.ts` und validiert Username/Password
3. **AC-3:** AdminService.validateUser() Methode ist implementiert in `apps/backend/src/admin/admin.service.ts`
4. **AC-4:** validateUser() lädt AdminUser-Entity aus Datenbank und verifiziert Password mit Argon2.verify()
5. **AC-5:** Bei erfolgreicher Validierung wird User-Object (ohne passwordHash) zurückgegeben: `{ id, username }`
6. **AC-6:** Bei fehlgeschlagener Validierung wird `null` zurückgegeben (Passport-Konvention, keine Exception)
7. **AC-7:** LocalStrategy ist als Provider in AdminModule registriert
8. **AC-8:** Unit-Tests für LocalStrategy und AdminService.validateUser() mit >80% Coverage

## Tasks / Subtasks

- [ ] **Task 1: Dependencies installieren** (AC: #1)
  - [ ] 1.1: `pnpm add @nestjs/passport passport passport-local` installieren
  - [ ] 1.2: `pnpm add -D @types/passport-local` installieren (TypeScript Types)
  - [ ] 1.3: Verifizieren dass Dependencies in `apps/backend/package.json` erscheinen

- [ ] **Task 2: AdminService.validateUser() Methode implementieren** (AC: #3, #4, #5, #6)
  - [ ] 2.1: `apps/backend/src/admin/admin.service.ts` öffnen (aus Story 5.1)
  - [ ] 2.2: validateUser() Methode hinzufügen mit Signatur: `async validateUser(username: string, password: string): Promise<{ id: number; username: string } | null>`
  - [ ] 2.3: AdminUser-Entity per Username laden: `this.adminUserRepository.findOne({ where: { username } })`
  - [ ] 2.4: Falls User nicht gefunden → return `null`
  - [ ] 2.5: Password verifizieren mit `await argon2.verify(user.passwordHash, password)`
  - [ ] 2.6: Falls Passwort falsch → return `null`
  - [ ] 2.7: Falls Passwort korrekt → return `{ id: user.id, username: user.username }` (OHNE passwordHash)
  - [ ] 2.8: Error-Handling: DB-Fehler loggen und `null` zurückgeben (keine Exceptions, Passport-Konvention)

- [ ] **Task 3: LocalStrategy implementieren** (AC: #2, #5)
  - [ ] 3.1: Datei erstellen: `apps/backend/src/admin/strategies/local.strategy.ts`
  - [ ] 3.2: LocalStrategy-Klasse erstellen, erweitert `PassportStrategy(Strategy)`
  - [ ] 3.3: Constructor: `super({ usernameField: 'username' })` konfigurieren
  - [ ] 3.4: Constructor: AdminService injizieren via Dependency Injection
  - [ ] 3.5: `async validate(username: string, password: string)` Methode implementieren
  - [ ] 3.6: In validate(): `await this.adminService.validateUser(username, password)` aufrufen
  - [ ] 3.7: Falls User null → `throw new UnauthorizedException('Invalid credentials')`
  - [ ] 3.8: Falls User valid → return user (wird von Passport in Session geschrieben)
  - [ ] 3.9: TSDoc-Kommentare hinzufügen (Beschreibung, Parameter, Return)

- [ ] **Task 4: LocalStrategy in AdminModule registrieren** (AC: #7)
  - [ ] 4.1: `apps/backend/src/admin/admin.module.ts` öffnen
  - [ ] 4.2: PassportModule importieren: `PassportModule.register({ session: true })`
  - [ ] 4.3: LocalStrategy als Provider hinzufügen in `providers: [LocalStrategy, ...]`
  - [ ] 4.4: Verifizieren dass AdminService bereits als Provider vorhanden ist (aus Story 5.1)

- [ ] **Task 5: Unit-Tests für validateUser() schreiben** (AC: #8)
  - [ ] 5.1: Test-Datei erstellen: `apps/backend/src/admin/admin.service.spec.ts`
  - [ ] 5.2: Test: "should return user object when credentials are valid"
    - Mock AdminUser-Entity mit valid username und Argon2-gehashtem Passwort
    - Expect: `{ id, username }` zurückgegeben
  - [ ] 5.3: Test: "should return null when username not found"
    - Mock repository.findOne() → null
    - Expect: validateUser() returns null
  - [ ] 5.4: Test: "should return null when password is incorrect"
    - Mock AdminUser mit falschem Passwort
    - Expect: validateUser() returns null
  - [ ] 5.5: Test: "should not return passwordHash in response"
    - Verify passwordHash nicht im return-Objekt enthalten

- [ ] **Task 6: Unit-Tests für LocalStrategy schreiben** (AC: #8)
  - [ ] 6.1: Test-Datei erstellen: `apps/backend/src/admin/strategies/local.strategy.spec.ts`
  - [ ] 6.2: Test: "should return user when AdminService.validateUser succeeds"
    - Mock AdminService.validateUser() → valid user object
    - Expect: validate() returns user
  - [ ] 6.3: Test: "should throw UnauthorizedException when AdminService.validateUser returns null"
    - Mock AdminService.validateUser() → null
    - Expect: validate() throws UnauthorizedException
  - [ ] 6.4: Test: "should pass username and password to AdminService"
    - Spy auf AdminService.validateUser()
    - Verify: Method called with correct arguments

- [ ] **Task 7: Integration-Test vorbereiten (für Story 5.4)** (AC: #2, #7)
  - [ ] 7.1: Hinweis in README: Integration-Tests für Login-Flow erfolgen in Story 5.4 (AdminAuthController)
  - [ ] 7.2: Verifizieren dass LocalStrategy korrekt in Passport registriert ist (Debug-Log oder Test-Setup)

## Dev Notes

### Architecture Context

**Passport.js Local Strategy:**
- **Pattern:** Username/Password-Authentifizierung via Passport.js Local Strategy
- **Flow:** User sendet credentials → LocalStrategy.validate() → AdminService.validateUser() → Argon2 verify → User-Object oder null
- **Session-Integration:** Erfolgreicher Login → Passport serialisiert User in Session (Story 5.2 Session-Infrastruktur)
- **Security:** Argon2 für Password-Hashing (statt bcrypt), timing-attack-resistent

**Passport.js in NestJS:**
- **Guards:** LocalAuthGuard (in Story 5.4) verwendet LocalStrategy für Login-Endpoint
- **Session Strategy:** `PassportModule.register({ session: true })` aktiviert Session-Serialisierung
- **User Serialization:** Passport speichert user.id in Session-Cookie, lädt User bei jedem Request

**Technische Constraints:**
- Username case-insensitive (Datenbank: COLLATE NOCASE oder `.toLowerCase()` in validateUser)
- Password nie im Klartext loggen (Security)
- validateUser() MUSS `null` zurückgeben bei Fehler (Passport-Konvention, keine Exception werfen)
- LocalStrategy.validate() wirft UnauthorizedException bei null (für HTTP 401 Response)

[Source: docs/tech-spec-epic-5.md#Services and Modules > LocalStrategy]
[Source: docs/architecture.md#Technical Stack Decisions > Backend Stack > Auth: Passport.js]

### Project Structure Notes

**Neue Dateien:**
- `apps/backend/src/admin/strategies/local.strategy.ts` - Passport LocalStrategy Implementation
- `apps/backend/src/admin/strategies/` - Neuer Ordner für Auth-Strategies
- `apps/backend/src/admin/admin.service.spec.ts` - Unit-Tests für AdminService
- `apps/backend/src/admin/strategies/local.strategy.spec.ts` - Unit-Tests für LocalStrategy

**Zu modifizierende Dateien:**
- `apps/backend/src/admin/admin.service.ts` - validateUser() Methode hinzufügen
- `apps/backend/src/admin/admin.module.ts` - PassportModule + LocalStrategy registrieren
- `apps/backend/package.json` - Dependencies hinzufügen

**Alignment mit unified-project-structure:**
- Admin-Strategies unter `apps/backend/src/admin/strategies/` (konsistent mit Admin-Module-Struktur)
- Shared types (falls nötig) unter `packages/shared-types/src/admin/` (in zukünftigen Stories)
- Tests co-located mit Source-Code (.spec.ts neben .ts)

[Source: docs/architecture.md#Component Architecture]

### Testing Strategy

**Unit Tests (Jest):**
- **AdminService.validateUser():**
  - Valid credentials → User-Object zurückgegeben
  - Invalid username → null
  - Invalid password → null
  - passwordHash nicht im Response
  - DB-Fehler → null (graceful degradation)
- **LocalStrategy.validate():**
  - AdminService returns User → validate() returns User
  - AdminService returns null → validate() throws UnauthorizedException
  - Correct parameters passed to AdminService
- **Target Coverage:** >80%

**Integration Tests (Story 5.4):**
- Login-Endpoint (`POST /api/admin/auth/login`) verwendet LocalAuthGuard und LocalStrategy
- Erfolgreicher Login → Session-Cookie gesetzt
- Fehlgeschlagener Login → 401 Unauthorized
- Rate-Limiting greift (Story 5.4)

**Test-Framework:**
- Jest für Unit-Tests
- Supertest für Integration-Tests (Story 5.4)

**Mocking:**
- AdminUserRepository: Mock mit `jest.fn()` oder Repository-Mock-Factory
- Argon2.verify(): Mock mit `jest.spyOn(argon2, 'verify')`

[Source: docs/tech-spec-epic-5.md#Test Strategy Summary]

### Security Considerations

**Password Verification:**
- **Argon2:** Memory-hard algorithm, GPU/ASIC-resistent
- **Timing Attack Protection:** argon2.verify() ist timing-safe (konstante Ausführungszeit)
- **No Password Logging:** NIEMALS Passwort in Klartext loggen (auch nicht bei Fehler)
- **Hash Storage:** passwordHash NIEMALS im API-Response zurückgeben

**Passport Best Practices:**
- **validateUser() returns null:** Bei Fehlschlag, KEINE Exception werfen (Passport-Konvention)
- **validate() throws UnauthorizedException:** Damit HTTP 401 Status zurückgegeben wird
- **Session Serialization:** User.id in Session speichern (nicht ganzes User-Objekt)

**Username Handling:**
- **Case-Insensitive:** `username.toLowerCase()` vor DB-Query (verhindert duplicate accounts)
- **Sanitization:** Whitespace trimmen mit `.trim()`
- **Validation:** Zod-Schema validiert Username-Format (min 3, max 50 chars in Story 5.4)

**Error Handling:**
- **Generic Error Messages:** "Invalid credentials" (NICHT "Username not found" oder "Wrong password" - Info-Leak)
- **Rate Limiting:** In Story 5.4 via ThrottlerGuard (5 attempts per 15 min)

[Source: docs/tech-spec-epic-5.md#Security > Authentication & Sessions]
[Source: docs/architecture.md#Technical Stack Decisions > Why Argon2 over bcrypt?]

### References

- **Tech-Spec:** docs/tech-spec-epic-5.md#Services and Modules (LocalStrategy, AdminService)
- **Architecture:** docs/architecture.md#Security Architecture > Authentication & Authorization > Admin Authentication: Session-Based
- **PRD:** docs/PRD.md#FR-4: Admin-Dashboard (Session-based Auth with Passport.js)
- **Epic Breakdown:** docs/epics.md > Epic 5 > Story 5.3
- **Dependencies:**
  - @nestjs/passport: https://docs.nestjs.com/recipes/passport
  - passport: http://www.passportjs.org/
  - passport-local: http://www.passportjs.org/packages/passport-local/
  - argon2: https://github.com/ranisalt/node-argon2
- **Security Best Practices:**
  - OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
  - Argon2 Password Hashing: https://www.password-hashing.net/

### Prerequisites

**Story 5.1 (Admin User Entity und Seed Daten):**
- AdminUser-Entity MUSS existieren (benötigt für Repository-Injection)
- AdminService MUSS existieren (erweitert um validateUser() in dieser Story)
- Argon2-gehashte Passwörter in DB vorhanden (für Testing)

**Story 5.2 (Session-Management):**
- express-session konfiguriert (Session-Infrastruktur)
- PassportModule wird in dieser Story registriert (session: true)
- Session-Serialization erfolgt in Story 5.4 (SessionSerializer)

**Empfehlung:**
- Story 5.1 MUSS abgeschlossen sein (AdminService und Entity erforderlich)
- Story 5.2 kann parallel entwickelt werden (keine harte Abhängigkeit für Unit-Tests)
- Integration-Tests benötigen Story 5.2 + 5.4 komplett

### Learnings from Previous Story

**From Story 5.2: Session-Management mit express-session (Status: drafted)**

Da Story 5.2 noch nicht implementiert ist, gibt es keine spezifischen Code-Learnings. Jedoch wichtige Kontext-Informationen:

**Session-Infrastruktur-Vorbereitung:**
- express-session wird mit SQLite-Store konfiguriert
- Session-Cookie-Flags: HttpOnly, Secure (Production), SameSite=Lax, Max-Age=7 days
- SESSION_SECRET Environment-Variable erforderlich (mindestens 32 Bytes)

**Integration Points für Story 5.3:**
- **PassportModule.register({ session: true }):** Aktiviert Session-basierte Auth (diese Story setzt das um)
- **Session-Serialization:** Nach erfolgreichem Login wird user.id in Session geschrieben (erfolgt automatisch durch Passport + express-session)
- **AdminAuthGuard (Story 5.5):** Wird LocalStrategy + Session validieren

**Wichtige Patterns aus Epic 5 Tech-Spec:**
- Argon2 für Password-Hashing (bereits in Story 5.1 verwendet)
- AdminService als zentrale Business-Logic-Schicht
- TypeORM-Repository-Pattern für DB-Zugriffe
- NestJS Guards für Auth-Validierung

**Testing-Setup:**
- Jest + Supertest sind etabliert (aus Epic 2-4)
- Unit-Test-Coverage-Target: >80%
- Mock-Factories für TypeORM-Repositories vorhanden (aus früheren Epics)

**Security-Patterns:**
- Keine Passwörter in Logs (aus Security Best Practices)
- Generic Error Messages (prevent info leak)
- Rate-Limiting wird in Story 5.4 hinzugefügt

[Source: docs/stories/5-2-session-management-mit-express-session.md#Dev-Notes]
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
- 2025-11-08: Story drafted by Scrum Master (Bob) based on Epic 5 Tech-Spec, Epics, and Architecture
