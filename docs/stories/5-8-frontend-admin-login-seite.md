# Story 5.8: Frontend Admin-Login-Seite

Status: drafted

## Story

Als Admin,
möchte ich mich über eine Login-Seite einloggen,
damit ich Zugriff auf das Dashboard erhalte.

## Acceptance Criteria

1. ✅ Route `/admin/login` in `apps/frontend/src/routes/admin/login.tsx`
2. ✅ Login-Formular mit shadcn/ui Components (Input, Button, Card)
3. ✅ Form-Validierung mit TanStack Form und Zod LoginDtoSchema
4. ✅ Bei Submit: POST /api/admin/auth/login mit TanStack Query
5. ✅ Bei Erfolg: Redirect zu `/admin/dashboard`
6. ✅ Bei Fehler: Error-Message anzeigen (Toast-Notification)
7. ✅ Loading-State während Login-Request (Spinner im Button)
8. ✅ beforeLoad-Hook: Redirect zu `/admin/dashboard` wenn bereits eingeloggt
9. ✅ E2E-Test mit Playwright (Login-Flow Success + Failure)

## Tasks / Subtasks

- [ ] Task 1: Route und Layout erstellen (AC: 1)
  - [ ] Subtask 1.1: Route-Datei `apps/frontend/src/routes/admin/login.tsx` erstellen
  - [ ] Subtask 1.2: TanStack Router Route mit `@tanstack/react-router` konfigurieren
  - [ ] Subtask 1.3: beforeLoad-Hook implementieren (Check Session via GET /api/admin/auth/status)
  - [ ] Subtask 1.4: Redirect zu `/admin/dashboard` wenn bereits eingeloggt (Session vorhanden)
  - [ ] Subtask 1.5: Layout-Container mit zentrierter Card (max-width: 400px)

- [ ] Task 2: LoginForm-Component mit TanStack Form erstellen (AC: 2, 3, 4)
  - [ ] Subtask 2.1: Component-Datei `apps/frontend/src/components/admin/LoginForm.tsx` erstellen
  - [ ] Subtask 2.2: TanStack Form initialisieren mit `useForm()` Hook
  - [ ] Subtask 2.3: Zod Schema importieren: `LoginDtoSchema` aus `packages/shared-types/src/admin.schemas.ts`
  - [ ] Subtask 2.4: Form-Fields: Username (Input), Password (Input type="password")
  - [ ] Subtask 2.5: shadcn/ui Components verwenden: `<Card>`, `<Input>`, `<Label>`, `<Button>`
  - [ ] Subtask 2.6: Field-Validierung mit Zod (min 3 chars für username, min 8 chars für password)
  - [ ] Subtask 2.7: Error-Messages inline anzeigen (via TanStack Form field errors)

- [ ] Task 3: TanStack Query Hook für Login-API erstellen (AC: 4, 5, 6, 7)
  - [ ] Subtask 3.1: API-Client-Datei `apps/frontend/src/lib/api/admin-auth.ts` erstellen
  - [ ] Subtask 3.2: `useLoginMutation` Hook mit `useMutation` (TanStack Query) implementieren
  - [ ] Subtask 3.3: Mutation Function: POST /api/admin/auth/login mit fetch (credentials: 'include')
  - [ ] Subtask 3.4: onSuccess: Redirect zu `/admin/dashboard` mit `useNavigate()`
  - [ ] Subtask 3.5: onError: Toast-Notification mit Fehlermeldung (shadcn/ui Toast)
  - [ ] Subtask 3.6: Loading-State: `isLoading` Flag an Button-Component übergeben
  - [ ] Subtask 3.7: Button disabled während Loading, Spinner-Icon anzeigen (`<Loader2 className="animate-spin" />`)

- [ ] Task 4: Session-Check-Hook für beforeLoad erstellen (AC: 8)
  - [ ] Subtask 4.1: `useSessionStatus` Hook in `admin-auth.ts` implementieren
  - [ ] Subtask 4.2: useQuery Hook mit GET /api/admin/auth/status (optional fetch - kein Error bei 401)
  - [ ] Subtask 4.3: Response-Format: `{ authenticated: boolean, user?: { id, username } }`
  - [ ] Subtask 4.4: In beforeLoad-Hook: Falls `authenticated === true` → throw redirect({ to: '/admin/dashboard' })
  - [ ] Subtask 4.5: Stale-Time: 5 Minuten (Session-Cache)

- [ ] Task 5: UI-Polish und Error-Handling (AC: 2, 6)
  - [ ] Subtask 5.1: Card-Design: Header mit Title "Admin Login", Footer mit Copyright
  - [ ] Subtask 5.2: Input-Styling: Focus States, Placeholder Texts ("Benutzername", "Passwort")
  - [ ] Subtask 5.3: Button-Styling: Primary Color, Full-Width, Hover-State
  - [ ] Subtask 5.4: Toast-Notification konfigurieren (shadcn/ui Toaster Component)
  - [ ] Subtask 5.5: Error-Handling: Network Errors, 401 Unauthorized, 429 Rate Limit
  - [ ] Subtask 5.6: Error-Messages: Deutsch, benutzerfreundlich ("Ungültige Anmeldedaten", "Zu viele Versuche, bitte später erneut versuchen")

- [ ] Task 6: E2E-Tests mit Playwright erstellen (AC: 9)
  - [ ] Subtask 6.1: Test-Datei `apps/frontend/tests/e2e/admin-login.spec.ts` erstellen
  - [ ] Subtask 6.2: Test "Login Flow Success": Navigiere zu /admin/login → Fülle Formular aus → Submit → Redirect zu /admin/dashboard
  - [ ] Subtask 6.3: Test "Login Flow Failure": Falsche Credentials → Error-Toast angezeigt
  - [ ] Subtask 6.4: Test "Already Logged In": Session vorhanden → beforeLoad redirected zu /admin/dashboard
  - [ ] Subtask 6.5: Test "Loading State": Button disabled während Request, Spinner sichtbar
  - [ ] Subtask 6.6: Test "Form Validation": Leere Felder → Inline Errors angezeigt
  - [ ] Subtask 6.7: Playwright Fixtures: Admin-Seed-Daten (username: admin, password: test123)

## Dev Notes

### Architektur-Constraints

**Frontend-Stack:**
- **TanStack Start**: Server-Side Rendering (SSR) + Client-Side Rendering (CSR)
- **TanStack Router**: File-based Routing, beforeLoad Hooks für Auth-Checks
- **TanStack Query**: API State Management, Caching, Optimistic Updates
- **TanStack Form**: Type-safe Form-Management mit Zod-Integration
- **shadcn/ui**: Accessible, Customizable React Components (Radix UI + Tailwind CSS)
- [Source: docs/tech-spec-epic-5.md#System-Architecture-Alignment]

**Session-Management:**
- Backend setzt HttpOnly Cookie bei erfolgreichem Login (Session-ID)
- Cookie-Flags: HttpOnly (kein JS-Zugriff), Secure (HTTPS-only), SameSite=Lax
- Session-Expiry: 7 Tage Inaktivität
- Frontend sendet Cookie automatisch bei jedem Request (credentials: 'include')
- [Source: docs/tech-spec-epic-5.md#Security-Constraints]

**API-Integration:**
```typescript
// Login-Request
POST /api/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "SecurePassword123!"
}

// Success Response (200)
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
// + Set-Cookie: connect.sid=...; HttpOnly; Secure; SameSite=Lax

// Error Response (401)
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials"
  }
}
```
- [Source: docs/tech-spec-epic-5.md#APIs-and-Interfaces]

**Rate-Limiting:**
- Login-Endpoint: Max 5 Versuche pro 15 Minuten pro IP
- Bei Überschreitung: 429 Too Many Requests
- Error-Message: "Zu viele Anmeldeversuche. Bitte versuchen Sie es in 15 Minuten erneut."
- [Source: docs/tech-spec-epic-5.md#Security]

### Source Tree Components

**Neue Dateien:**

1. `apps/frontend/src/routes/admin/login.tsx`:
   - TanStack Router Route-Component
   - beforeLoad Hook für Session-Check (redirect wenn bereits eingeloggt)
   - Layout: Zentrierte Card mit LoginForm
   - Responsive Design (Mobile-First)

2. `apps/frontend/src/components/admin/LoginForm.tsx`:
   - LoginForm Component (TanStack Form + shadcn/ui)
   - Form-Fields: Username, Password
   - Validation: Zod Schema (LoginDtoSchema)
   - Submit Handler: useLoginMutation Hook
   - Loading State: Disabled Button + Spinner

3. `apps/frontend/src/lib/api/admin-auth.ts`:
   - TanStack Query Hooks:
     - `useLoginMutation`: POST /api/admin/auth/login
     - `useLogoutMutation`: POST /api/admin/auth/logout
     - `useSessionStatus`: GET /api/admin/auth/status
   - Fetch Configuration: credentials: 'include' (für Cookies)
   - Error-Handling: Network Errors, HTTP Status Codes

4. `apps/frontend/tests/e2e/admin-login.spec.ts`:
   - Playwright E2E-Tests
   - Test Cases: Success Flow, Failure Flow, Already Logged In, Validation

**Wiederverwendete Components (shadcn/ui):**
- `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`: Login-Card-Layout
- `<Input>`: Username + Password Fields
- `<Label>`: Field Labels
- `<Button>`: Submit Button (mit Loading-State)
- `<Toast>`, `<Toaster>`: Error-Notifications
- Alle Components bereits installiert in Epic 3

**Shared Types Package:**
- `packages/shared-types/src/admin.schemas.ts`:
  - `LoginDtoSchema` (Zod): Username (min 3, max 50), Password (min 8, max 128)
  - Type-Export: `export type LoginDto = z.infer<typeof LoginDtoSchema>`
  - Wird von Frontend UND Backend verwendet (End-to-End Type Safety)

### Testing-Standards

**E2E-Tests (Playwright):**
- **Test-Setup:**
  - Admin-User Seed-Daten: username=admin, password=test123 (Argon2-gehashed in DB)
  - Backend läuft auf http://localhost:3000 (Docker Compose)
  - Frontend läuft auf http://localhost:5173 (TanStack Start Dev Server)

- **Test-Coverage-Ziele:**
  - Login Success Flow: Credentials eingeben → Submit → Redirect zu /admin/dashboard → Session Cookie gesetzt
  - Login Failure Flow: Falsche Credentials → 401 Error → Toast-Message angezeigt
  - Already Logged In: Session vorhanden → beforeLoad redirected zu /admin/dashboard (kein Login-Formular sichtbar)
  - Form Validation: Leere Felder → Inline Errors ("Benutzername erforderlich", "Passwort erforderlich")
  - Loading State: Button disabled während Request, Spinner sichtbar
  - Rate Limiting: 6+ Login-Versuche → 429 Error → Toast-Message
  - [Source: docs/tech-spec-epic-5.md#Test-Strategy]

**Unit-Tests (optional für diese Story, Fokus auf E2E):**
- LoginForm Component: Form-Validierung, Error-Handling
- useLoginMutation Hook: API-Call, onSuccess/onError-Callbacks

**Playwright Fixtures:**
```typescript
// tests/fixtures/admin.ts
export const adminCredentials = {
  valid: { username: 'admin', password: 'test123' },
  invalid: { username: 'admin', password: 'wrongpassword' },
};
```

### Project Structure Notes

**Alignment mit TanStack Start File-Based Routing:**
- Route-Datei: `apps/frontend/src/routes/admin/login.tsx`
- URL-Path: `/admin/login` (automatisch aus File-Path abgeleitet)
- Layout: `apps/frontend/src/routes/admin/_layout.tsx` (optional - für shared Admin-Layout)

**Integration mit bestehender Frontend-Architektur:**
- shadcn/ui Components aus Epic 3 wiederverwendet (bereits konfiguriert)
- TanStack Query Client global konfiguriert (in `apps/frontend/src/root.tsx`)
- Toast-Provider bereits in `apps/frontend/src/components/ui/toaster.tsx` vorhanden

**Potenzielle Konflikte:**
- KEINE - Login-Seite ist neue Route, keine Überschneidungen mit Public Routes (`/`, `/invite/:token`)

**CSS/Styling:**
- Tailwind CSS v4 (aus Epic 3)
- shadcn/ui Theme (bereits konfiguriert)
- Dark Mode Support optional (Growth Feature)

### Learnings from Previous Story

**Von Story 5-7-admin-invite-crud-api-endpoints (Status: drafted):**

Story 5.7 wurde noch nicht implementiert (nur drafted). Keine Implementierungs-Learnings verfügbar.

**Relevante Kontext-Informationen aus vorherigen Stories:**

**CSRF-Integration (aus Story 5.6 Dev Notes):**
- CSRF-Middleware wird in `main.ts` registriert (nach Session, vor Guards)
- CSRF-Token als Cookie (`XSRF-TOKEN`) gesetzt
- Frontend muss Token im Header `X-XSRF-TOKEN` mitsenden (automatisch bei fetch mit credentials: 'include')
- **Wichtig für Story 5.8:** GET-Requests (wie /api/admin/auth/login via GET-Check oder /api/admin/auth/status) sind CSRF-exempt
- POST /api/admin/auth/login benötigt CSRF-Token (automatisch von Browser mitgesendet als Cookie)
- [Source: stories/5-6-csrf-protection-mit-csurf-middleware.md#Dev-Notes]

**Session-Management (aus Story 5.2):**
- express-session + connect-sqlite3 konfiguriert
- Session-Cookie-Name: `connect.sid`
- Session-Storage: SQLite `sessions` Table
- Session-Secret aus ENV-Variable (`SESSION_SECRET`)
- [Source: tech-spec-epic-5.md#Session-Storage]

**AdminAuthGuard (aus Story 5.5):**
- Geschützte Admin-Routen verwenden `@UseGuards(AdminAuthGuard)`
- Guard prüft Session-Cookie und validiert Session in DB
- Bei ungültiger Session: 401 Unauthorized
- Frontend: Bei 401 → Redirect zu `/admin/login`
- [Source: tech-spec-epic-5.md#Authorization]

### References

- [Source: docs/tech-spec-epic-5.md#System-Architecture-Alignment] - Frontend-Stack, TanStack Ecosystem
- [Source: docs/tech-spec-epic-5.md#APIs-and-Interfaces] - Login-API Spezifikation, Request/Response-Formate
- [Source: docs/tech-spec-epic-5.md#Security-Constraints] - Session-Management, Cookie-Flags, Rate-Limiting
- [Source: docs/tech-spec-epic-5.md#Test-Strategy] - E2E-Test-Anforderungen, Playwright Setup
- [Source: docs/epics.md#Story-5.8] - Original Story-Definition, Acceptance Criteria, Affected Files
- [Source: docs/architecture.md#Executive-Summary] - TanStack Start, React 19, Privacy-First Design

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

(Wird vom Dev Agent ergänzt)

### Debug Log References

### Completion Notes List

### File List
