# Story 3.4: Public CV Route mit SSR Loader implementieren

Status: drafted

## Story

Als Entwickler,
möchte ich die Root-Route (`/`) mit TanStack Router Loader SSR-fähig machen,
damit CV-Daten server-side geladen und als vollständiges HTML gerendert werden.

## Acceptance Criteria

1. Route `/` nutzt TanStack Router Loader für Server-Side Data-Fetching
2. `fetchPublicCV()` wird server-side aufgerufen (kein Client-Request)
3. HTML-Response enthält vollständige CV-Daten (kein Loading-State initial)
4. Client-Side Hydration funktioniert (TanStack Query übernimmt State)
5. First Contentful Paint <1.5s (messbar via Lighthouse)
6. Keine Hydration-Mismatch-Errors in Console
7. Error-Boundary fängt Loader-Errors ab

## Tasks / Subtasks

- [ ] TanStack Router Loader in Root-Route implementieren (AC: #1, #2)
  - [ ] `createFileRoute('/')` mit Loader-Function konfigurieren
  - [ ] `fetchPublicCV()` im Loader server-side aufrufen
  - [ ] Loader-Data über `Route.useLoaderData()` in Component bereitstellen
  - [ ] SSR-Flag (`ssr: true`) aktivieren

- [ ] Client-Side Hydration konfigurieren (AC: #3, #4)
  - [ ] TanStack Query initial State aus SSR-Daten hydratieren
  - [ ] Hydration-Match zwischen Server und Client sicherstellen
  - [ ] React StrictMode für Hydration-Testing aktivieren
  - [ ] Keine conditional rendering basierend auf `window` ohne SSR-Check

- [ ] Error-Handling implementieren (AC: #7)
  - [ ] Error-Boundary Component für Route erstellen
  - [ ] Loader-Errors abfangen und Error-State rendern
  - [ ] Fallback-UI für API-Fehler designen
  - [ ] Retry-Button in Error-State einbauen

- [ ] Performance-Optimierung und Validierung (AC: #5, #6)
  - [ ] Lighthouse-Test durchführen (FCP <1.5s)
  - [ ] Hydration-Mismatch-Warnings in Console prüfen
  - [ ] Network-Tab prüfen (kein doppelter API-Call nach SSR)
  - [ ] Server Response Time messen (TTFB <600ms)

- [ ] Testing (AC: alle)
  - [ ] Unit-Test für Loader-Function schreiben
  - [ ] E2E-Test für SSR-Page-Load schreiben (Playwright)
  - [ ] Hydration-Test (HTML-Content vor/nach Hydration identisch)
  - [ ] Error-Boundary-Test (API-Fehler simulieren)

## Dev Notes

### Requirements Context

**Story Ziel:** Diese Story implementiert die SSR-fähige Root-Route für die öffentliche CV-Seite. Der kritische Aspekt ist Server-Side Rendering mit TanStack Start, um optimale SEO und Performance (FCP <1.5s) zu erreichen.

**Technischer Kontext aus Tech-Spec:**
- TanStack Start nutzt File-based Routing mit TanStack Router v1
- SSR erfolgt via Vite SSR mit anschließender Client-Side Hydration
- API-Endpoint `/api/cv/public` (Epic 2) liefert Public CV-Daten als JSON
- Performance-Target: First Contentful Paint <1.5s (Lighthouse >90)

**Datenfluss:**
1. Request an `/` trifft TanStack Start Server
2. Server-Side Loader ruft `fetchPublicCV()` auf → Backend `/api/cv/public`
3. Backend liefert gefilterte Public CV-Daten (ohne sensible Infos)
4. React rendert Component server-side mit CV-Daten zu HTML
5. HTML wird an Browser gesendet (FCP erfolgt)
6. Browser lädt JS-Bundle und hydratiert React-Component
7. TanStack Query übernimmt State (keine weiteren API-Calls)

[Source: docs/tech-spec-epic-3.md#Workflows → Initial Page Load]

### Architecture & Constraints

**TanStack Router v1 SSR-Pattern:**
```typescript
// app/routes/index.tsx
export const Route = createFileRoute('/')({
  loader: async () => {
    // Server-side data fetch
    const cv = await fetchPublicCV();
    return { cv };
  },
  ssr: true,  // Enable SSR
  component: PublicCVPage,
});
```

**Hydration-Strategie:**
- Server rendert vollständiges HTML mit CV-Daten
- Client hydratiert ohne Mismatch (identisches Markup)
- TanStack Query initial State wird aus Loader-Data gesetzt
- Keine `useState` für initial CV-Data (kommt von Loader)

**Performance-Constraints:**
- Server Response Time (TTFB): <600ms
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle Size: <200KB gzipped

[Source: docs/tech-spec-epic-3.md#Non-Functional Requirements → Performance]

**Error-Boundary-Pattern:**
React Error-Boundary fängt Loader-Errors und Render-Errors ab. Fallback-UI zeigt benutzerfreundliche Fehlermeldung mit Retry-Option.

### Project Structure Notes

**Dateipfade (basierend auf TanStack Start Conventions):**
- Route-Definition: `apps/frontend/app/routes/index.tsx`
- Layout-Component: `apps/frontend/components/layouts/public-layout.tsx`
- Error-Boundary: `apps/frontend/components/error-boundary.tsx`
- API-Client: `apps/frontend/lib/api.ts` (bereits in Story 3.3)

**Component-Hierarchie:**
```
index.tsx (Route + Loader)
└── PublicCVPage
    └── PublicLayout
        ├── HeroSection (Story 3.5)
        ├── SkillsSection (Story 3.6)
        ├── ProjectsSection (Story 3.7)
        ├── ExperienceSection (Story 3.8)
        └── EducationSection (Story 3.9)
```

In dieser Story: Root-Route und Layout-Struktur, Section-Components kommen in nachfolgenden Stories.

### Learnings from Previous Story

**From Story 3-3 (Status: drafted)**

Vorherige Story (3-3: TanStack Query API-Integration aufsetzen) wurde noch nicht implementiert. Daher sind folgende Abhängigkeiten zu beachten:

- Diese Story (3.4) hängt direkt von Story 3.3 ab
- `fetchPublicCV()` Funktion muss in Story 3.3 implementiert worden sein
- TanStack Query Provider muss in App-Root integriert sein
- `usePublicCV()` Hook sollte vorhanden sein (wird hier im Loader genutzt)

**Empfehlung:** Erst Story 3.3 vollständig implementieren und testen, bevor mit Story 3.4 begonnen wird. Falls Story 3.3 noch nicht abgeschlossen ist, sollte sie zuerst fertiggestellt werden.

[Source: docs/sprint-status.yaml#development_status]

### References

- **Tech Spec:** [docs/tech-spec-epic-3.md#Workflows → Initial Page Load]
- **Tech Spec:** [docs/tech-spec-epic-3.md#APIs and Interfaces → TanStack Router Loader (SSR)]
- **Tech Spec:** [docs/tech-spec-epic-3.md#Non-Functional Requirements → Performance]
- **Epic Definition:** [docs/epics.md#Story 3.4]
- **PRD:** [docs/PRD.md#FR-1: CV-Präsentation (Öffentlich)]
- **Backend API:** Epic 2 - GET /api/cv/public

### Testing Strategy

**Unit Tests:**
- Loader-Function isoliert testen (Mock `fetchPublicCV`)
- Error-Handling im Loader testen
- Component-Rendering mit Mock-Loader-Data

**Integration Tests:**
- API-Integration mit echtem Backend-Endpoint testen
- Zod-Validation der API-Response testen

**E2E Tests (Playwright):**
```typescript
test('Public CV loads with SSR', async ({ page }) => {
  await page.goto('/');

  // Assert: SSR-Content sichtbar vor JS-Hydration
  const html = await page.content();
  expect(html).toContain('<!-- CV-Data rendered server-side -->');

  // Assert: No loading state initially
  await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

  // Assert: CV content visible
  await expect(page.locator('h1')).toBeVisible();

  // Assert: Performance
  const fcp = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    return paint.find(p => p.name === 'first-contentful-paint')?.startTime;
  });
  expect(fcp).toBeLessThan(1500);
});
```

**Performance Tests:**
- Lighthouse CI: Performance Score >90, FCP <1.5s
- Chrome DevTools: Network-Tab (kein doppelter API-Call)
- TTFB-Messung: Server Response Time <600ms

### Implementation Notes

**Kritische Aspekte:**
1. **Hydration Mismatch vermeiden:** Server und Client müssen identisches Markup rendern. Keine `window`-abhängige Logic im Initial Render.
2. **TanStack Query Hydration:** Initial State aus Loader setzen, damit kein doppelter API-Call erfolgt.
3. **Error-Boundary Placement:** Error-Boundary muss Route wrappen, um Loader-Errors zu catchen.
4. **Performance-Budget:** FCP <1.5s ist critical - SSR ist Schlüssel dazu.

**Dependencies Checklist:**
- ✅ Story 3.1: TanStack Start SSR-Architektur steht
- ✅ Story 3.2: Tailwind CSS und shadcn/ui verfügbar
- ⚠️ Story 3.3: TanStack Query und `fetchPublicCV()` MÜSSEN vorhanden sein
- ✅ Epic 2: Backend API `/api/cv/public` ist implementiert

**Next Stories:**
Nach Completion dieser Story können Section-Components implementiert werden (Stories 3.5-3.9), da die Route-Basis dann steht.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Agent model name and version will be recorded here -->

### Debug Log References

<!-- Debug logs and issue tracking will be recorded here during implementation -->

### Completion Notes List

<!-- Implementation notes, patterns established, and deviations will be recorded here -->

### File List

<!-- Files created, modified, or deleted during implementation will be listed here -->

---

**Change Log:**
- 2025-11-07: Story drafted (Status: drafted)
