# Story 4.8: Frontend-Route /invite/:token mit SSR-Loader

Status: drafted

## Story

Als Besucher mit personalem Einladungslink,
möchte ich eine SSR-optimierte Route unter /invite/:token aufrufen können,
damit ich den vollständigen CV inkl. Kontaktdaten und personalisierter Nachricht sehe.

## Acceptance Criteria

1. **TanStack Router Route** `apps/frontend/src/routes/invite/$token.tsx` existiert und ist über `/invite/:token` URL erreichbar
2. **SSR-Loader implementiert**:
   - Parallele API-Fetches: `GET /api/invite/:token` (Validierung) + `GET /api/cv/private/:token` (CV-Daten)
   - Server-Side Rendering für initiales HTML (SEO, Performance)
   - Client-Side Hydration für Interaktivität (wie Epic 3 Public Route)
3. **Error-States vollständig behandelt**:
   - Ungültiger/abgelaufener Token → Redirect zu `/invite/error` mit Reason-Parameter
   - Deaktivierter Link (`isActive=false`) → `/invite/error` mit "Link wurde deaktiviert" Message
   - Netzwerk-Fehler/API-Fehler → Generische Error-Page mit Retry-Option
4. **Loading-State**: Skeleton UI während SSR-Phase (Server-Side, keine Spinner)
5. **Meta-Tags**: `<meta name="robots" content="noindex,nofollow">` für Privacy (verhindert Suchmaschinen-Indexierung)
6. **Performance**: First Contentful Paint <1.5s (wie Epic 3), gemessen via Lighthouse CI

## Tasks / Subtasks

- [ ] **Task 1: Route-Datei und SSR-Loader erstellen** (AC: #1, #2)
  - [ ] Subtask 1.1: Datei `apps/frontend/src/routes/invite/$token.tsx` erstellen mit TanStack Router File-Based Routing
  - [ ] Subtask 1.2: SSR-Loader-Funktion implementieren mit `createFileRoute` und `loader` Property
  - [ ] Subtask 1.3: Token-Parameter aus URL extrahieren via `params.token`
  - [ ] Subtask 1.4: Parallel-Fetch implementieren: `Promise.all([fetch('/api/invite/:token'), fetch('/api/cv/private/:token')])`
  - [ ] Subtask 1.5: Response-Validation mit Zod-Schemas (`InviteValidationResponseSchema`, `PrivateCVSchema`)
  - [ ] Subtask 1.6: Loader-Return: `{ inviteData, cvData }` für Component-Zugriff via `useLoaderData()`

- [ ] **Task 2: Error-Handling im Loader** (AC: #3)
  - [ ] Subtask 2.1: Token-Validierung-Check: Wenn `inviteData.isValid === false` → Redirect zu `/invite/error?reason=${inviteData.reason}`
  - [ ] Subtask 2.2: HTTP-Error-Handling: Catch 403 Forbidden, 404 Not Found, 429 Rate-Limit
  - [ ] Subtask 2.3: Redirect-Logic mit TanStack Router `redirect()` Helper im Loader
  - [ ] Subtask 2.4: Error-Page `/invite/error.tsx` erstellen mit Dynamic Reason-Display

- [ ] **Task 3: Component-Rendering mit CV-Daten** (AC: #2, #4)
  - [ ] Subtask 3.1: Loader-Daten konsumieren via `useLoaderData<typeof Route.loader>()`
  - [ ] Subtask 3.2: Skeleton UI während SSR-Phase (CSS-only Loading-States, kein JavaScript)
  - [ ] Subtask 3.3: Basis-Layout mit Header "Personalisierte Ansicht" (visuell differenziert zu Public Route)
  - [ ] Subtask 3.4: CV-Sections rendern (vorläufig: Basic JSON-Display, Component-Integration in Story 4.11+)
  - [ ] Subtask 3.5: Client-Side Hydration testen (Interaktivität nach SSR funktioniert)

- [ ] **Task 4: Meta-Tags und SEO** (AC: #5)
  - [ ] Subtask 4.1: `<Head>` Component von TanStack Start nutzen für Meta-Tags
  - [ ] Subtask 4.2: `<meta name="robots" content="noindex,nofollow">` hinzufügen
  - [ ] Subtask 4.3: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (Responsive)
  - [ ] Subtask 4.4: Dynamic `<title>` Tag: "Personalisierte CV-Ansicht - {Name}" aus CV-Daten

- [ ] **Task 5: Performance-Optimierung** (AC: #6)
  - [ ] Subtask 5.1: Parallel API-Fetches sicherstellen (Promise.all, nicht sequenziell)
  - [ ] Subtask 5.2: Code-Splitting: Separate Chunk für `/invite` Route (TanStack Router automatisch)
  - [ ] Subtask 5.3: CSS-Skeleton-UI (keine schweren JS-Abhängigkeiten für Loading-State)
  - [ ] Subtask 5.4: Lighthouse CI Test: FCP <1.5s, Performance Score >90

- [ ] **Task 6: Integration-Tests** (AC: #1-#6)
  - [ ] Subtask 6.1: E2E-Test: Gültiger Token → Page rendert, CV-Daten sichtbar
  - [ ] Subtask 6.2: E2E-Test: Ungültiger Token → Redirect zu `/invite/error?reason=not_found`
  - [ ] Subtask 6.3: E2E-Test: Abgelaufener Token → Redirect zu `/invite/error?reason=expired`
  - [ ] Subtask 6.4: E2E-Test: Inaktiver Link → Redirect zu `/invite/error?reason=inactive`
  - [ ] Subtask 6.5: E2E-Test: Meta-Tags korrekt (`noindex,nofollow`)
  - [ ] Subtask 6.6: Performance-Test: Lighthouse CI Report zeigt FCP <1.5s

## Dev Notes

### Architektur-Kontext

**Epic 4 Kontext**: Diese Story ist der Frontend-Entry-Point für das Privacy-First Sharing-System. Sie verbindet Token-Validierung (Story 4.5) mit vollständigem CV-Zugriff (Story 4.7) in einer performanten SSR-Route.

**SSR-Pattern (TanStack Start)**:
- **Server-Side**: Loader fetched Daten (Token-Validation + CV) parallel, rendert initiales HTML
- **Client-Side**: React Hydration aktiviert Interaktivität (wie Epic 3 Public Route)
- **Performance-Vorteil**: Erste Inhalte sofort sichtbar (SSR), dann interaktiv (Hydration)

**Parallele API-Fetches**:
```typescript
// Loader implementiert Promise.all für minimale Latenz
const [inviteResponse, cvResponse] = await Promise.all([
  fetch(`/api/invite/${token}`),
  fetch(`/api/cv/private/${token}`)
]);
```
→ Total Time = max(Invite-API, CV-API) statt sum(Invite-API + CV-API)
→ Typisch: 50-100ms Validation + 100-150ms CV = ~150ms parallel (vs. 250ms sequenziell)

**Error-Handling-Strategie**:
- **Token-Validation-Failure**: `isValid: false` → Redirect zu `/invite/error?reason=...`
- **HTTP-Errors**: 403/404/429 → Redirect zu `/invite/error` mit Error-Message
- **Network-Errors**: Catch-Block → Generic Error-Page mit "Bitte später erneut versuchen"

**Abhängigkeiten**:
- **Story 4.5**: `GET /api/invite/:token` (Token-Validierung, liefert `InviteValidationResponse`)
- **Story 4.7**: `GET /api/cv/private/:token` (Vollständiger CV, `PrivateCV` Type)
- **Epic 3**: TanStack Router SSR-Setup, shadcn/ui Foundation

### Project Structure Notes

**Betroffene Module**:
```
apps/frontend/src/
├── routes/
│   ├── index.tsx                    # (EXISTING) Public Route - Epic 3
│   └── invite/
│       ├── $token.tsx               # (NEW) Personalized Route mit SSR-Loader
│       └── error.tsx                # (NEW) Error-Page für Invalid/Expired Tokens
├── lib/
│   └── api/
│       ├── cv.ts                    # (EXISTING) Epic 3 - usePublicCV Hook
│       └── invite.ts                # (FUTURE) Story 4.9 - Hooks-Abstraktion
```

**File-Based Routing Convention (TanStack Router)**:
- `routes/invite/$token.tsx` → Route-Path: `/invite/:token`
- `$token` = Dynamic Parameter, zugänglich via `params.token` im Loader
- `error.tsx` = Statische Route für Error-Cases

**API-Integration (Temporary Direct Fetch)**:
In dieser Story werden API-Calls direkt im Loader gemacht:
```typescript
// Temporary: Direct fetch in loader
const inviteResponse = await fetch(`/api/invite/${token}`);
```
→ **Story 4.9** wird dies in TanStack Query Hooks (`useInviteValidation`, `usePrivateCV`) abstrahieren
→ **Story 4.8** fokussiert auf Route-Setup, SSR, Error-Handling

**Component-Reuse aus Epic 3**:
- Epic 3 Components (`SkillsSection`, `ProjectsSection`, etc.) sind bereits verfügbar
- **In dieser Story**: Basic JSON-Display oder einfache Komponenten-Einbindung
- **Story 4.11**: Erweitert diese Components mit Variants (`public` vs `authenticated` Props)

### Implementierungs-Details

**TanStack Router SSR-Loader Implementierung**:

```typescript
// apps/frontend/src/routes/invite/$token.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Head } from '@tanstack/react-start';
import { InviteValidationResponseSchema, PrivateCVSchema } from '@repo/shared-types';

export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => {
    const { token } = params;

    try {
      // Parallel Fetches für minimale Latenz
      const [inviteResponse, cvResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/invite/${token}`),
        fetch(`${import.meta.env.VITE_API_URL}/api/cv/private/${token}`)
      ]);

      // Response-Validation
      if (!inviteResponse.ok) {
        throw redirect({
          to: '/invite/error',
          search: { reason: 'not_found' }
        });
      }

      const inviteData = InviteValidationResponseSchema.parse(await inviteResponse.json());

      // Token-Validation-Check
      if (!inviteData.isValid) {
        throw redirect({
          to: '/invite/error',
          search: { reason: inviteData.reason || 'invalid' }
        });
      }

      // CV-Daten laden
      if (!cvResponse.ok) {
        if (cvResponse.status === 403) {
          throw redirect({
            to: '/invite/error',
            search: { reason: 'forbidden' }
          });
        }
        throw new Error('Failed to load CV data');
      }

      const cvData = PrivateCVSchema.parse(await cvResponse.json());

      return {
        inviteData,
        cvData,
        token
      };

    } catch (error) {
      // Redirect-Errors werden durchgereicht
      if (error instanceof Response) throw error;

      // Network-Errors → Generic Error
      throw redirect({
        to: '/invite/error',
        search: { reason: 'network_error' }
      });
    }
  },

  component: InviteTokenPage
});

function InviteTokenPage() {
  const { inviteData, cvData } = Route.useLoaderData();

  return (
    <>
      <Head>
        <title>Personalisierte CV-Ansicht - {cvData.basics.name}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Visuelle Differenzierung zur Public Route */}
        <div className="mb-6 border-l-4 border-blue-500 bg-blue-50 p-4">
          <h1 className="text-sm font-medium text-blue-900">
            Personalisierte Ansicht
          </h1>
          <p className="text-xs text-blue-700">
            Sie sehen den vollständigen CV mit allen Kontaktdaten
          </p>
        </div>

        {/* Personalisierte Nachricht */}
        {inviteData.personalizedMessage && (
          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Persönliche Nachricht</h2>
            <p className="whitespace-pre-wrap text-gray-700">
              {inviteData.personalizedMessage}
            </p>
          </div>
        )}

        {/* CV-Sections - Vorläufig: Basic Display */}
        <div className="space-y-8">
          {/* Basics Section */}
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">{cvData.basics.name}</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {cvData.basics.email}</p>
              <p><strong>Phone:</strong> {cvData.basics.phone}</p>
              <p><strong>Location:</strong> {cvData.basics.location?.city}, {cvData.basics.location?.countryCode}</p>
            </div>
          </section>

          {/* Work Experience */}
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Work Experience</h2>
            {cvData.work?.map((job, idx) => (
              <div key={idx} className="mb-4 border-l-2 border-gray-300 pl-4">
                <h3 className="font-medium">{job.position} @ {job.name}</h3>
                <p className="text-sm text-gray-600">
                  {job.startDate} - {job.endDate || 'Present'}
                </p>
                <p className="mt-2">{job.summary}</p>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Skills</h2>
            {cvData.skills?.map((skill, idx) => (
              <div key={idx} className="mb-2">
                <strong>{skill.name}:</strong> {skill.keywords?.join(', ')}
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Projects</h2>
            {cvData.projects?.map((project, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-600">
                  {project.entity && `Client: ${project.entity}`}
                </p>
                <p className="mt-2">{project.description}</p>
                {project.highlights && (
                  <ul className="mt-2 list-inside list-disc text-sm">
                    {project.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
```

**Error-Page Implementierung**:

```typescript
// apps/frontend/src/routes/invite/error.tsx
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Head } from '@tanstack/react-start';

export const Route = createFileRoute('/invite/error')({
  component: InviteErrorPage
});

const ERROR_MESSAGES = {
  not_found: 'Dieser Einladungslink wurde nicht gefunden.',
  expired: 'Dieser Einladungslink ist abgelaufen.',
  inactive: 'Dieser Einladungslink wurde deaktiviert.',
  forbidden: 'Sie haben keine Berechtigung, diese Seite zu sehen.',
  network_error: 'Ein Netzwerkfehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
} as const;

function InviteErrorPage() {
  const search = useSearch({ from: '/invite/error' });
  const reason = search.reason as keyof typeof ERROR_MESSAGES || 'not_found';
  const message = ERROR_MESSAGES[reason] || ERROR_MESSAGES.not_found;

  return (
    <>
      <Head>
        <title>Fehler - Einladungslink</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="mb-2 text-2xl font-bold text-red-900">
            Zugriff nicht möglich
          </h1>
          <p className="mb-6 text-red-700">{message}</p>
          <a
            href="/"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </>
  );
}
```

**Skeleton UI (CSS-Only, SSR-Safe)**:

```css
/* Skeleton während SSR-Phase - kein JavaScript nötig */
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Testing-Strategie

**E2E-Tests (Playwright)**:

```typescript
// apps/frontend/tests/e2e/invite-route.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Invite Route - /invite/:token', () => {
  test('should render personalized CV for valid token', async ({ page }) => {
    const validToken = 'ckl8x9y2v0000qzrmn8zg9q3c'; // Seed DB mit gültigem Token

    await page.goto(`/invite/${validToken}`);

    // Check: Page loaded, no redirect
    await expect(page).toHaveURL(`/invite/${validToken}`);

    // Check: "Personalisierte Ansicht" Header sichtbar
    await expect(page.locator('text=Personalisierte Ansicht')).toBeVisible();

    // Check: CV-Daten sichtbar (Email = Private Field)
    await expect(page.locator('text=Email:')).toBeVisible();

    // Check: Meta-Tags korrekt
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toBe('noindex,nofollow');
  });

  test('should redirect to error page for invalid token', async ({ page }) => {
    await page.goto('/invite/invalid-token-xxx');

    // Check: Redirected zu /invite/error
    await expect(page).toHaveURL(/\/invite\/error\?reason=not_found/);

    // Check: Error-Message sichtbar
    await expect(page.locator('text=nicht gefunden')).toBeVisible();
  });

  test('should redirect to error page for expired token', async ({ page }) => {
    const expiredToken = 'expired-token-abc'; // Seed DB mit abgelaufenem Token

    await page.goto(`/invite/${expiredToken}`);

    // Check: Redirected zu /invite/error mit reason=expired
    await expect(page).toHaveURL(/\/invite\/error\?reason=expired/);
    await expect(page.locator('text=abgelaufen')).toBeVisible();
  });

  test('should redirect to error page for inactive link', async ({ page }) => {
    const inactiveToken = 'inactive-token-def'; // Seed DB mit isActive=false

    await page.goto(`/invite/${inactiveToken}`);

    await expect(page).toHaveURL(/\/invite\/error\?reason=inactive/);
    await expect(page.locator('text=deaktiviert')).toBeVisible();
  });
});
```

**Performance-Tests (Lighthouse CI)**:

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/invite/test-token-valid' // Seed DB für CI
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop'
      }
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }], // <1.5s
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'categories:performance': ['error', { minScore: 0.9 }] // >90
      }
    }
  }
};
```

### Security & Privacy

**Privacy-Maßnahmen**:
- **Meta-Tags**: `noindex,nofollow` verhindert Suchmaschinen-Indexierung (Invite-Links bleiben privat)
- **Token-Validation**: Server-Side im Loader (kein Client-Side Token-Leak möglich)
- **Error-Messages**: Generisch (keine Leak von internen Details wie DB-IDs)

**DSGVO-Konformität**:
- **Keine IP-Speicherung**: Besuchsstatistik nur Counter + Timestamp (Story 4.7 Backend)
- **Kein Third-Party-Tracking**: Keine Analytics auf Invite-Routes
- **Server-Side Data-Fetching**: Tokens nie im Client-Side localStorage gespeichert

**Security Best Practices**:
- **SSR-Loader**: Tokens werden server-side validiert (kein Client-Side Token-Check)
- **HTTPS-Only**: Nginx (Epic 7) enforced HTTPS für Token-Sicherheit
- **Rate-Limiting**: ThrottlerGuard (Story 4.7) verhindert Brute-Force auf Tokens

### Alignment mit Architecture

**Architecture Pattern: SSR + Hydration (Epic 3 Foundation)**:
- ✅ TanStack Start SSR für initiales HTML (SEO, Performance)
- ✅ Client-Side Hydration für Interaktivität
- ✅ Parallel API-Fetches im Loader (minimale Latenz)

**Architecture Pattern: Token-Based Access Control**:
- ✅ Token aus URL-Param extrahiert
- ✅ Server-Side Validation (Loader fetched `/api/invite/:token`)
- ✅ Privacy-First: Meta-Tags `noindex,nofollow`

**Tech Stack Adherence**:
- ✅ TanStack Router (File-Based Routing)
- ✅ TanStack Start (SSR)
- ✅ Zod Validation (Shared Types)
- ✅ shadcn/ui Components (Epic 3 Foundation)

### Learnings from Previous Story

**From Story 4-7** (Status: drafted - noch nicht implementiert):

Da die vorherige Story (4-7) noch nicht implementiert ist, gibt es keine Code-Patterns oder etablierten Services zu übernehmen. Wichtige Erwartungen für diese Story:

**Expected from Story 4.7**:
- API-Endpoint `GET /api/cv/private/:token` existiert und liefert vollständige CV-Daten (`PrivateCV`)
- Token-Validation erfolgt im Backend (TokenValidationGuard)
- Error-Responses sind strukturiert: `{ statusCode, message, error, reason }`
- Rate-Limiting ist aktiv (100 req/min per Token)

**Critical Dependency**:
Wenn Story 4.7 nicht abgeschlossen ist, kann diese Story (4.8) NICHT vollständig implementiert werden, da der API-Endpoint benötigt wird. Empfehlung: Dependency-Check im Sprint-Planning.

**Expected from Story 4.5**:
- API-Endpoint `GET /api/invite/:token` existiert und liefert `InviteValidationResponse`
- Response-Format: `{ isValid: boolean, personalizedMessage: string | null, reason?: string }`

**Testing ohne fertige Dependencies**:
- Mock API-Responses für lokale Entwicklung
- E2E-Tests mit Seed-Daten (simulierte Tokens)
- Integration-Tests erst nach Story 4.5 und 4.7 completion

### References

- [Tech-Spec Epic 4: Frontend Architecture - SSR Pattern] docs/tech-spec-epic-4.md#Frontend-Architektur-TanStack-Start-SSR
- [Tech-Spec Epic 4: User Workflows - Personalized CV View] docs/tech-spec-epic-4.md#User-Workflows
- [Tech-Spec Epic 4: Performance Requirements] docs/tech-spec-epic-4.md#Non-Functional-Requirements
- [Architecture: System Overview - TanStack Start SSR] docs/architecture.md#System-Overview
- [PRD: FR-3 Personalisierte CV-Ansicht] docs/PRD.md#FR-3
- [UX-Spec: Invite Route Journey] docs/ux-design-specification.md#Invited-View
- [Story 4.5: GET /api/invite/:token Endpoint] docs/epics.md#Story-4-5
- [Story 4.7: GET /api/cv/private/:token Endpoint] docs/epics.md#Story-4-7
- [Epic 3: TanStack Start Frontend Foundation] docs/epics.md#Epic-3

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
