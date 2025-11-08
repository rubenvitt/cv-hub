# Story 5.6: CSRF-Protection mit csurf Middleware

Status: drafted

## Story

Als Entwickler,
möchte ich CSRF-Protection für alle Admin-POST/PATCH/DELETE-Requests implementieren,
damit Cross-Site-Request-Forgery-Attacken verhindert werden und das Admin-Dashboard sicher ist.

## Acceptance Criteria

1. ✅ `csurf` Middleware ist installiert und konfiguriert
2. ✅ CSRF-Token wird als Cookie gesetzt (`XSRF-TOKEN`)
3. ✅ Frontend muss CSRF-Token im Header `X-CSRF-Token` mitsenden
4. ✅ Alle Admin POST/PATCH/DELETE-Requests ohne gültigen Token → 403 Forbidden
5. ✅ GET-Requests sind CSRF-exempt (nur lesende Operationen)
6. ✅ CSRF-Config verwendet Double-Submit-Cookie-Pattern
7. ✅ Integration-Test: Request mit/ohne CSRF-Token

## Tasks / Subtasks

- [ ] Task 1: csurf Middleware installieren und konfigurieren (AC: 1, 2, 6)
  - [ ] Subtask 1.1: `csurf` package als Dependency hinzufügen
  - [ ] Subtask 1.2: CSRF-Middleware in `apps/backend/src/main.ts` registrieren
  - [ ] Subtask 1.3: Middleware nur auf `/api/admin/*` Routes anwenden
  - [ ] Subtask 1.4: Cookie-basierte CSRF-Token-Konfiguration (Double-Submit-Cookie-Pattern)
  - [ ] Subtask 1.5: Cookie-Name auf `XSRF-TOKEN` setzen

- [ ] Task 2: CSRF Guard Logik implementieren (AC: 3, 4, 5)
  - [ ] Subtask 2.1: CSRF-Token-Validierung für POST/PATCH/DELETE-Requests
  - [ ] Subtask 2.2: GET-Requests von CSRF-Validierung ausschließen
  - [ ] Subtask 2.3: 403 Forbidden Response bei fehlendem oder ungültigem Token
  - [ ] Subtask 2.4: Error-Handling mit strukturierter Error-Response

- [ ] Task 3: Integration-Tests schreiben (AC: 7)
  - [ ] Subtask 3.1: Test: POST-Request mit gültigem CSRF-Token → 200/201
  - [ ] Subtask 3.2: Test: POST-Request ohne CSRF-Token → 403 Forbidden
  - [ ] Subtask 3.3: Test: POST-Request mit ungültigem CSRF-Token → 403 Forbidden
  - [ ] Subtask 3.4: Test: GET-Request funktioniert ohne CSRF-Token
  - [ ] Subtask 3.5: Test: PATCH-Request mit CSRF-Token validiert korrekt
  - [ ] Subtask 3.6: Test: DELETE-Request mit CSRF-Token validiert korrekt

- [ ] Task 4: Dokumentation und Testing-Standards (AC: alle)
  - [ ] Subtask 4.1: CSRF-Config in README/Docs dokumentieren
  - [ ] Subtask 4.2: Frontend-Implementierungshinweise dokumentieren (Header `X-CSRF-Token`)
  - [ ] Subtask 4.3: Bestehende Tests prüfen (nicht brechen)
  - [ ] Subtask 4.4: Manuelle Validierung mit Postman/cURL

## Dev Notes

### Architektur-Constraints

**CSRF-Protection-Strategie (Double-Submit-Cookie):**
- CSRF-Token wird als Cookie (`XSRF-TOKEN`) vom Backend gesetzt
- Frontend liest Cookie und sendet Token im Header `X-CSRF-Token` bei mutativen Requests
- Backend vergleicht Cookie-Token mit Header-Token
- Pattern ist sicher für stateless APIs mit session-basierter Auth

**Security Headers:**
- Helmet bereits konfiguriert (siehe architecture.md#Security-Headers)
- CSRF-Protection ergänzt bestehende Security-Maßnahmen
- Keine Konflikte mit Content-Security-Policy (CSP)

**Integration mit bestehender Authentifizierung:**
- CSRF-Middleware wird NACH Session-Middleware angewendet
- AdminAuthGuard läuft NACH CSRF-Validierung
- Execution Order: ThrottlerGuard → CSRF → AdminAuthGuard
- [Source: docs/tech-spec-epic-5.md#Security-Constraints]

### Source Tree Components

**Backend-Dateien (modifiziert):**
- `apps/backend/src/main.ts`:
  - CSRF-Middleware registrieren (nach Session, vor Guards)
  - Middleware-Reihenfolge beachten: Helmet → Session → CSRF → Routes

- `apps/backend/package.json`:
  - `csurf` Dependency hinzufügen (Version: `^1.11.0`)

**Backend-Dateien (optional, falls zusätzliche Config nötig):**
- `apps/backend/src/config/csrf.config.ts`:
  - CSRF-Konfiguration auslagern wenn komplex
  - Cookie-Settings (httpOnly: false für Frontend-Lesbarkeit, sameSite: 'lax')

**Test-Dateien (neu):**
- `apps/backend/test/admin/csrf.e2e-spec.ts`:
  - Integration-Tests für CSRF-Validierung
  - Test-Cases: Mit/ohne Token, gültig/ungültig, GET-Requests

### Testing-Standards

**Integration-Tests (Jest + Supertest):**
- Test-Setup: Admin-User einloggen → Session-Cookie + CSRF-Token extrahieren
- Test-Isolation: Neue Session pro Test-Case (Clean State)
- Error-Assertions: Erwartete Status-Codes (200/201/403), Error-Messages prüfen
- Cookie-Handling: `request.cookies` für Token-Extraktion nutzen
- [Source: docs/tech-spec-epic-5.md#Test-Strategy]

**Manuelle Validierung:**
- Postman Collection für Admin-Endpoints aktualisieren
- CSRF-Token automatisch aus Cookie in Header kopieren (Postman Script)
- Negative Tests: Token weglassen, Token manipulieren

### Learnings from Previous Story

Vorherige Story 5-5-adminauthguard-fuer-geschuetzte-routen wurde drafted, aber noch nicht implementiert. Keine vorherigen Learnings verfügbar.

### Project Structure Notes

**Alignment mit NestJS Best Practices:**
- Middleware-Registration in `main.ts` (zentral, vor Bootstrap)
- Cookie-Settings aligned mit Session-Cookies (HttpOnly für Session, nicht für CSRF-Token)
- Double-Submit-Cookie-Pattern ist NestJS-Standard für CSRF

**Potenzielle Konflikte:**
- KEINE Konflikte erwartet, da CSRF nur Admin-Routes betrifft
- Public Routes (`/api/cv/*`) bleiben unberührt

### References

- [Source: docs/tech-spec-epic-5.md#Security-Constraints] - CSRF-Protection-Anforderungen
- [Source: docs/tech-spec-epic-5.md#Security] - Security-Headers, Rate-Limiting, CSRF-Details
- [Source: docs/architecture.md#CSRF-Protection] - Architektur-Code-Beispiele für csurf-Konfiguration
- [Source: docs/epics.md#Story-5.6] - Original Story-Definition, Acceptance Criteria
- [Source: docs/PRD.md#Authentication-Authorization] - CSRF-Protection als Teil der Admin-Security

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

(Wird vom Dev Agent ergänzt)

### Debug Log References

### Completion Notes List

### File List
