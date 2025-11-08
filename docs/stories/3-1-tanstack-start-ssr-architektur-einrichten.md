# Story 3.1: TanStack Start SSR-Architektur einrichten

Status: drafted

## Story

Als Entwickler,
möchte ich eine funktionierende TanStack Start SSR-Infrastruktur mit React 19,
damit die Frontend-Basis für Server-Side Rendering und Client-Hydration steht und Epic 3 (Public Portfolio Experience) implementiert werden kann.

## Acceptance Criteria

1. **TanStack Start-Projekt initialisiert**
   - ✅ Projekt in `apps/frontend` mit TanStack Start RC erstellt
   - ✅ React 19.x als UI Library konfiguriert
   - ✅ TypeScript strict mode aktiviert
   - ✅ Package Scripts für dev, build, preview vorhanden

2. **File-based Routing funktioniert**
   - ✅ TanStack Router v1 integriert
   - ✅ Root-Route `app/routes/index.tsx` existiert
   - ✅ Route rendert "Hello World" oder Placeholder-Content
   - ✅ Routing-Config in `app.config.ts` korrekt

3. **Server-Side Rendering aktiv**
   - ✅ Root-Route ist SSR-enabled (`ssr: true`)
   - ✅ HTML wird server-side generiert (View Source zeigt vollständiges HTML)
   - ✅ Keine leere `<div id="root"></div>` (hydration target hat Content)
   - ✅ First Contentful Paint erfolgt durch SSR (kein Loading-Spinner)

4. **Client-Side Hydration funktioniert**
   - ✅ React hydrated SSR-HTML (keine Hydration Mismatch Errors)
   - ✅ Event-Listener funktionieren nach Hydration (z.B. Button onClick)
   - ✅ Browser Console zeigt keine Hydration-Warnungen
   - ✅ React DevTools erkennt React 19 App

5. **Development-Setup vollständig**
   - ✅ Dev-Server startet auf Port 5173: `pnpm --filter frontend dev`
   - ✅ Hot Module Replacement (HMR) funktioniert
   - ✅ Fast Refresh für React-Components aktiv
   - ✅ Source Maps funktionieren für Debugging

6. **Environment-Configuration**
   - ✅ Environment-Variablen via `import.meta.env` verfügbar
   - ✅ `.env.example` mit API_URL Template vorhanden
   - ✅ Vite-Env-Typings in `vite-env.d.ts` definiert
   - ✅ Backend-URL konfigurierbar (z.B. `VITE_API_URL=http://localhost:3000`)

7. **TypeScript-Konfiguration strict**
   - ✅ `tsconfig.json` mit strict mode
   - ✅ Keine TypeScript-Errors bei `pnpm --filter frontend type-check`
   - ✅ Path aliases konfiguriert (z.B. `@/components`)
   - ✅ TSX-Support für React-Components

## Tasks / Subtasks

- [ ] **Task 1: Monorepo-Integration vorbereiten** (AC: #1, #7)
  - [ ] Subtask 1.1: Frontend-Workspace in `pnpm-workspace.yaml` registrieren
  - [ ] Subtask 1.2: `apps/frontend/package.json` mit Dependencies erstellen
    - `react@19.x`, `react-dom@19.x`
    - `@tanstack/start@rc`, `@tanstack/react-router@v1.x`
    - `typescript@latest`, `vite@latest`
  - [ ] Subtask 1.3: TypeScript-Config mit strict mode erstellen
    - `tsconfig.json` mit `strict: true`
    - Path aliases: `@/*` → `./app/*`
    - TSX-Support aktivieren
  - [ ] Subtask 1.4: Install dependencies: `pnpm install`

- [ ] **Task 2: TanStack Start SSR-Grundgerüst** (AC: #1, #2, #3)
  - [ ] Subtask 2.1: `app.config.ts` mit TanStack Start Config erstellen
    - Vite-Config integrieren
    - SSR aktivieren
    - Router-Config definieren
  - [ ] Subtask 2.2: Root-Route `app/routes/index.tsx` erstellen
    - File-based Route für `/`
    - Loader-Function für SSR (optional placeholder)
    - Component mit "Hello World" Content
    - `ssr: true` flag setzen
  - [ ] Subtask 2.3: App-Entry-Point `app/router.tsx` erstellen
    - TanStack Router initialisieren
    - Route-Tree definieren
  - [ ] Subtask 2.4: SSR-Entry-Point `app/ssr.tsx` erstellen
    - Server-Side Rendering Setup
    - HTML-Template mit React-Root

- [ ] **Task 3: Client-Side Hydration testen** (AC: #4)
  - [ ] Subtask 3.1: Client-Entry-Point `app/client.tsx` erstellen
    - React hydration call (hydrateRoot)
    - Error-Boundaries für Hydration-Fehler
  - [ ] Subtask 3.2: Interaktivitäts-Test implementieren
    - Button-Component mit onClick-Handler
    - State-Update testen (z.B. Counter)
    - Console-Check für Hydration Errors
  - [ ] Subtask 3.3: React DevTools verifizieren
    - React 19 erkannt
    - Component-Tree sichtbar

- [ ] **Task 4: Development-Server und Scripts** (AC: #5)
  - [ ] Subtask 4.1: Package Scripts in `package.json` definieren
    - `dev`: Start Dev-Server (Port 5173)
    - `build`: Production Build
    - `preview`: Preview Production Build
    - `type-check`: TypeScript-Validierung
  - [ ] Subtask 4.2: Dev-Server testen
    - `pnpm --filter frontend dev` startet Server
    - Hot Module Replacement funktioniert
    - Fast Refresh für Components aktiv

- [ ] **Task 5: Environment-Configuration** (AC: #6)
  - [ ] Subtask 5.1: `.env.example` mit Templates erstellen
    ```
    VITE_API_URL=http://localhost:3000
    ```
  - [ ] Subtask 5.2: Vite-Env-Typings in `vite-env.d.ts` definieren
    ```typescript
    interface ImportMetaEnv {
      VITE_API_URL: string;
    }
    ```
  - [ ] Subtask 5.3: Environment-Variable in Component testen
    - Log `import.meta.env.VITE_API_URL`
    - Verify Dev vs. Production Unterschiede

- [ ] **Task 6: Build und Deployment-Readiness** (AC: #1, #7)
  - [ ] Subtask 6.1: Production-Build testen
    - `pnpm --filter frontend build` erfolgreich
    - Output in `.output/` oder `dist/`
    - No TypeScript-Errors
  - [ ] Subtask 6.2: Preview Production-Build
    - `pnpm --filter frontend preview` startet Preview-Server
    - SSR funktioniert in Production-Build
  - [ ] Subtask 6.3: Bundle-Analyse (optional)
    - Initial Bundle Size dokumentieren
    - Baseline für spätere Optimierungen

- [ ] **Task 7: Dokumentation und Cleanup** (AC: #1)
  - [ ] Subtask 7.1: README.md für Frontend-Workspace
    - Setup-Anleitung
    - Available Scripts
    - Environment-Variablen
  - [ ] Subtask 7.2: Code-Cleanup
    - Remove unused Dependencies
    - Remove Demo/Placeholder Code (falls nötig)
  - [ ] Subtask 7.3: Git-Commit vorbereiten
    - Alle neuen Files stagen
    - Commit Message: "feat(frontend): setup TanStack Start SSR architecture"

## Dev Notes

### Architecture Constraints

**Aus Tech-Spec Epic 3:**
- **Framework:** TanStack Start (RC → v1.0) mit Vite-powered Build
- **SSR-Strategie:** Full-document SSR für SEO-kritische Public Page
- **Hydration:** Client-Side Hydration für Interaktivität (Filter, Animations)
- **Router:** TanStack Router v1 mit Type-safe, File-based Routing
- **Performance-Target:** FCP <1.5s (SSR ermöglicht sofortigen Content)

**Aus Architecture:**
- **Tech Stack:** React 19 (latest stable), TypeScript strict mode
- **Monorepo:** pnpm Workspaces, Frontend unter `apps/frontend`
- **Development:** Vite Dev-Server mit HMR, Fast Refresh
- **Deployment:** Docker Compose (Nginx reverse proxy, Port 5173 exposed)

**TanStack Start SSR-Patterns (aus Tech-Spec):**
```typescript
// Route mit SSR-Loader
export const Route = createFileRoute('/')({
  loader: async () => {
    // Server-side data fetch
    return { message: 'Hello from SSR' };
  },
  ssr: true,  // Enable SSR
  component: HomePage,
});

function HomePage() {
  const { message } = Route.useLoaderData();
  return <h1>{message}</h1>;  // Rendered server-side
}
```

**Performance-Relevanz:**
- SSR ist kritisch für Lighthouse FCP <1.5s Target (AC-2 in Epic 3)
- Ohne SSR: Leeres HTML + JS Load + Hydration = >3s FCP
- Mit SSR: Vollständiges HTML sofort = <1.5s FCP möglich

### Project Structure Notes

**Frontend Workspace Structure (nach dieser Story):**
```
apps/frontend/
├── app/
│   ├── routes/
│   │   └── index.tsx          # Root Route (/)
│   ├── router.tsx              # TanStack Router Setup
│   ├── client.tsx              # Client-Entry (Hydration)
│   └── ssr.tsx                 # Server-Entry (SSR)
├── app.config.ts               # TanStack Start + Vite Config
├── package.json                # Frontend Dependencies
├── tsconfig.json               # TypeScript Strict Config
├── vite-env.d.ts               # Vite Environment Typings
├── .env.example                # Environment Template
└── README.md                   # Setup Documentation
```

**Integration mit Monorepo:**
- `pnpm-workspace.yaml` listet `apps/frontend`
- Shared Dependencies via Workspace Protocol (z.B. `@cv-hub/shared-types@workspace:*`)
- Root-Level Scripts: `pnpm --filter frontend <command>`

**Alignment mit bestehenden Stories:**
- **Story 1.1 (Monorepo):** Frontend-Workspace wird in bestehendes Monorepo integriert
- **Story 1.2 (Backend):** Backend läuft bereits auf Port 3000, Frontend kommuniziert via VITE_API_URL
- **Vorbereitung für Story 3.2:** Styling (Tailwind) kommt als nächstes

### Testing Strategy

**Manuelle Validierung (für diese Story):**

1. **SSR-Verifizierung:**
   ```bash
   # Start Dev-Server
   pnpm --filter frontend dev

   # Browser: View Page Source (Ctrl+U)
   # Expect: Vollständiges HTML mit Content (nicht nur <div id="root"></div>)
   ```

2. **Hydration-Test:**
   ```typescript
   // app/routes/index.tsx
   function TestButton() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
   }

   // Click Button im Browser → Count erhöht sich = Hydration funktioniert
   ```

3. **Environment-Test:**
   ```typescript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   // Expect: http://localhost:3000 (from .env)
   ```

4. **Production-Build-Test:**
   ```bash
   pnpm --filter frontend build
   pnpm --filter frontend preview
   # Navigate to http://localhost:4173
   # Verify: SSR works in production mode
   ```

**Automated Tests (optional für Story 3.12 - Performance):**
- Lighthouse CI: FCP Baseline messen (Target: <1.5s)
- E2E Test: Playwright SSR-Validation (spätere Story)

### Technical Decisions

**Warum TanStack Start statt Next.js?**
- **Type-Safety:** TanStack Router bietet bessere TypeScript-Integration
- **Flexibility:** Keine Vendor Lock-in, Vite-native
- **Learning:** Moderne Alternative zu etablierten Frameworks
- **Cons:** RC-Status (Risiko), weniger Community-Support
- **Mitigation:** Pin Version, E2E-Tests als Regression-Protection

**React 19 vs. React 18:**
- React 19 ist latest stable, bietet bessere SSR-Performance
- TanStack Start unterstützt React 19
- Breaking Changes minimal (Concurrent Features stabil)

**Port 5173 (Vite Default):**
- Konsistent mit Vite-Convention
- Backend auf 3000, Frontend auf 5173
- Production: Nginx reverse proxy (Epic 7)

### Learnings from Previous Story

**From Story 2-10-integration-tests-und-ci-cd-fuer-epic-2 (Status: drafted)**

⚠️ **Note:** Previous story has not been implemented yet (status: drafted). No completion notes or new files are available from Story 2.10.

**Expected State:**
- Backend (Epic 2) is theoretically complete with CV API endpoints
- `GET /api/cv/public` should be available for future integration
- Integration tests documented but not yet implemented

**Implications for Story 3.1:**
- Frontend can be developed independently (no hard dependency on Epic 2 implementation)
- Use Mock API or placeholder data for initial SSR testing
- Backend integration will be handled in Story 3.3 (TanStack Query API-Integration)

### Key Risks

**Risk 1: TanStack Start RC Instabilität**
- **Impact:** Breaking Changes, fehlende Features
- **Probability:** Mittel (RC-Phase)
- **Mitigation:**
  - Pin exact version in package.json
  - Monitor TanStack GitHub Releases
  - E2E-Tests schützen vor Regression
  - Fallback-Plan: Migration zu Next.js 15 (ähnliche SSR-Patterns)

**Risk 2: React 19 SSR Hydration Mismatches**
- **Impact:** Console Warnings, schlechte UX
- **Probability:** Mittel (React 19 + SSR ist komplex)
- **Mitigation:**
  - React.StrictMode in Development (double-render detection)
  - No client-only logic in SSR-Components (z.B. `window` usage ohne check)
  - Hydration-Error-Logging in Production

**Risk 3: Performance-Targets verfehlt (FCP >1.5s)**
- **Impact:** Lighthouse Score <90, AC-2 in Epic 3 fails
- **Probability:** Niedrig (SSR reduziert FCP drastisch)
- **Mitigation:**
  - Baseline-Messung nach dieser Story
  - Lighthouse CI in Story 3.12 (Performance-Optimierung)
  - Code-Splitting ab Story 3.4 (Component-Lazy-Loading)

### Open Questions

1. **Welche TanStack Start RC-Version verwenden?**
   - Recommendation: Latest RC bei Story-Start, dann pinnen
   - Alternative: Warten auf v1.0 Stable (Delay-Risiko)

2. **Mock API für Development oder echtes Backend?**
   - Decision: Start mit Mock (MSW oder JSON-File)
   - Reason: Frontend-Development unabhängig von Backend-Status
   - Transition: Story 3.3 integriert echtes Backend via TanStack Query

3. **Vite SSR vs. TanStack Start SSR?**
   - Clarification: TanStack Start nutzt Vite SSR intern
   - TanStack Start = Abstraction-Layer über Vite SSR
   - Best Practice: TanStack Start SSR-Config nutzen (nicht raw Vite)

### References

**Source Documents:**
- [Tech-Spec Epic 3](/Users/rubeen/dev/personal/lebenslauf/docs/tech-spec-epic-3.md) - Section: System Architecture Alignment, Dependencies (Frontend)
- [Epics](/Users/rubeen/dev/personal/lebenslauf/docs/epics.md) - Epic 3, Story 3.1
- [Architecture](/Users/rubeen/dev/personal/lebenslauf/docs/architecture.md) - Section: Frontend Stack, Tech Stack
- [PRD](/Users/rubeen/dev/personal/lebenslauf/docs/PRD.md) - NFR: Performance (Lighthouse >90, FCP <1.5s)

**Related Stories:**
- Story 1.1: Monorepo (Prerequisite - Frontend-Workspace integriert sich hier)
- Story 1.2: Backend (Backend API auf Port 3000, CORS-Setup)
- Story 3.2: Tailwind CSS (Next Story - Styling)
- Story 3.3: TanStack Query (Next Story - API-Integration)
- Story 3.4: Public CV Route (Benötigt SSR-Grundlage aus dieser Story)

**External References:**
- TanStack Start Docs: https://tanstack.com/start/latest
- TanStack Router Docs: https://tanstack.com/router/latest
- React 19 Docs: https://react.dev
- Vite SSR Guide: https://vitejs.dev/guide/ssr.html

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Developer agent will fill this in during implementation -->

### Debug Log References

<!-- Links to debug logs will be added during implementation -->

### Completion Notes List

<!-- Developer will add completion notes here -->

### File List

<!-- Files created/modified will be listed here -->
