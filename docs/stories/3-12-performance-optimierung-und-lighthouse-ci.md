# Story 3.12: Performance-Optimierung und Lighthouse CI

Status: drafted

## Story

Als Entwickler,
möchte ich Code-Splitting, Lazy Loading und Lighthouse CI einrichten,
sodass Performance-Targets automatisch validiert werden und die Seite messbar schnell ist.

## Requirements Context Summary

**Aus Tech Spec Epic 3 (Story 3.12):**
- Code-Splitting: Route-based via TanStack Router (automatisch)
- Component-based Lazy Loading: React.lazy() für Heavy Components (ProjectsSection, ExperienceTimeline)
- Asset-Optimierung: Bilder mit `loading="lazy"` und responsive `srcset`
- Bundle-Size-Target: <200KB (gzipped, initial load)
- Lighthouse CI: Integration in GitHub Actions (PR-Check)
- Performance-Budget: Definition in `lighthouserc.json`
- CI-Enforcement: Pipeline fails bei Lighthouse Score <90 oder FCP >1.5s

**Aus PRD - Performance NFRs:**
- Lighthouse Score: >90 (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Total Blocking Time (TBT): <200ms
- Bundle Size: <200KB (gzipped, initial load)

**Aus Architecture (Frontend Stack):**
- TanStack Start mit Vite: Built-in Code-Splitting und Tree-Shaking
- React 19: Support für React.lazy() und Suspense
- Vite Build-Optimierung: Terser Minification, ES2020 Target
- Performance-Monitoring: Lighthouse CI als Quality Gate

**Performance-Strategie:**
1. **Code-Splitting:** Route-based (automatisch) + Component-based (manuell für Heavy Components)
2. **Lazy Loading:** React.lazy() mit Suspense Fallback (Skeleton Loader)
3. **Asset-Optimierung:** WebP-Images, responsive srcset, lazy loading
4. **Bundle-Analyse:** vite-bundle-analyzer zur Identifikation großer Dependencies
5. **Lighthouse CI:** Automatische Performance-Validation in CI/CD

**Voraussetzungen:**
- Stories 3.1-3.11 müssen implementiert sein (alle Features vorhanden)
- Frontend-Build muss funktionieren (`pnpm build`)
- GitHub Actions Workflow muss existieren (Epic 1)

[Source: docs/tech-spec-epic-3.md#Performance-Optimierung]
[Source: docs/PRD.md#Non-Functional-Requirements-Performance]
[Source: docs/architecture.md#Frontend-Stack]

## Acceptance Criteria

1. **Code-Splitting ist aktiv**
   - Route-based Splitting funktioniert (TanStack Router automatisch)
   - Bundle-Analyse zeigt separate Chunks pro Route
   - Verification: `pnpm build` → `.output` enthält separate route-chunks

2. **Heavy Components nutzen React.lazy()**
   - ProjectsSection nutzt `React.lazy()` mit Suspense Fallback
   - ExperienceTimeline nutzt `React.lazy()` mit Suspense Fallback
   - Optional: Skills Section (falls >5KB)
   - Skeleton Loader wird während Lazy Load angezeigt
   - Verification: DevTools Network-Tab zeigt separate Component-Chunks

3. **Bilder nutzen Lazy Loading und responsive srcset**
   - Alle `<img>` Tags haben `loading="lazy"` Attribut
   - Hero-Avatar nutzt responsive `srcset` (320w, 640w, 1280w)
   - Explizite `width` und `height` Attribute gesetzt (prevent CLS)
   - Verification: Lighthouse Audit zeigt "Defer offscreen images" passed

4. **Bundle-Size <200KB (gzipped, initial load)**
   - Initial Bundle (index chunk) ist <200KB gzipped
   - Vendor-Chunk ist separiert (React, TanStack)
   - vite-bundle-analyzer zeigt Bundle-Breakdown
   - Verification: Build-Output zeigt Chunk-Sizes, gzip-compressed

5. **Lighthouse CI läuft in GitHub Actions**
   - GitHub Actions Workflow `.github/workflows/lighthouse.yml` existiert
   - Workflow startet bei Pull Requests (trigger: `pull_request`)
   - Lighthouse läuft gegen Preview-Build (`pnpm preview`)
   - PR-Comment wird erstellt mit Lighthouse-Report-Link
   - Verification: Manueller Test-PR mit Lighthouse-Check

6. **Performance-Budget ist definiert**
   - `.lighthouserc.json` existiert in `apps/frontend/`
   - Budget-Assertions enthalten:
     - `categories:performance` min 0.9
     - `categories:accessibility` min 0.9
     - `categories:best-practices` min 0.9
     - `categories:seo` min 0.9
     - `first-contentful-paint` max 1500ms
     - `largest-contentful-paint` max 2500ms
     - `cumulative-layout-shift` max 0.1
   - Verification: Config-File ist valide (LHCI testet)

7. **CI fails bei Performance-Regression**
   - Lighthouse Score <90 → CI Exit Code 1 (Pipeline fails)
   - FCP >1.5s → CI fails
   - LCP >2.5s → CI fails
   - CLS >0.1 → CI fails
   - Verification: Absichtlich schlechten Code pushen (Test-Branch)

## Tasks / Subtasks

- [ ] **Task 1: Code-Splitting für Heavy Components implementieren** (AC: #2)
  - [ ] Subtask 1.1: ProjectsSection mit React.lazy() umwandeln
    - Import: `const ProjectsSection = lazy(() => import('./sections/ProjectsSection'))`
    - Wrappen in `<Suspense fallback={<ProjectsSkeleton />}>`
    - Skeleton Loader Component erstellen (Tailwind Skeleton)
  - [ ] Subtask 1.2: ExperienceTimeline mit React.lazy() umwandeln
    - Import: `const ExperienceSection = lazy(() => import('./sections/ExperienceSection'))`
    - Wrappen in `<Suspense fallback={<ExperienceSkeleton />}>`
  - [ ] Subtask 1.3: Skills Section optional lazy-loaden (falls >5KB)
    - Bundle-Analyse: Ist SkillsSection >5KB? Falls ja: lazy()
  - [ ] Subtask 1.4: Skeleton Loader Components erstellen
    - `<ProjectsSkeleton />`: Grid mit Skeleton-Cards
    - `<ExperienceSkeleton />`: Timeline-Skeleton
    - Tailwind Klassen: `animate-pulse`, `bg-gray-200`

- [ ] **Task 2: Image-Optimierung implementieren** (AC: #3)
  - [ ] Subtask 2.1: Alle `<img>` Tags mit `loading="lazy"` attributieren
    - Suche: Alle Image-Tags in Components
    - Exception: Hero-Avatar (above-the-fold, kein lazy)
  - [ ] Subtask 2.2: Hero-Avatar mit responsive srcset ausstatten
    - Generiere 3 Größen: 320w, 640w, 1280w (WebP-Format)
    - `<img srcSet="..." sizes="..." />`
  - [ ] Subtask 2.3: Explizite width/height für alle Bilder setzen
    - Prevent Cumulative Layout Shift (CLS)
    - Aspect-Ratio via CSS falls nötig

- [ ] **Task 3: Vite Build-Konfiguration optimieren** (AC: #1, #4)
  - [ ] Subtask 3.1: Vite Config für Production-Build tunen
    - Target: ES2020
    - Minification: Terser (drop_console in production)
    - Manual Chunks: Vendor-Chunk separieren (React, TanStack)
  - [ ] Subtask 3.2: Bundle-Analyse einrichten
    - `vite-plugin-bundle-visualizer` oder `rollup-plugin-visualizer` installieren
    - Build-Script: `pnpm build:analyze`
  - [ ] Subtask 3.3: Bundle-Size-Target validieren
    - Build ausführen, Chunk-Sizes prüfen
    - Initial Load <200KB gzipped validieren
    - Falls zu groß: Dependencies reviewen, Tree-Shaking prüfen

- [ ] **Task 4: Lighthouse CI konfigurieren** (AC: #5, #6)
  - [ ] Subtask 4.1: `lighthouserc.json` erstellen
    - Config-Template aus Tech Spec nutzen
    - Assertions definieren: Performance >90, FCP <1500ms, etc.
    - URLs konfigurieren: `http://localhost:4173/`
  - [ ] Subtask 4.2: Lighthouse CI Dependencies installieren
    - `@lhci/cli` als devDependency in `apps/frontend/package.json`
    - Script: `"lighthouse": "lhci autorun"`
  - [ ] Subtask 4.3: Lokaler Lighthouse-Test
    - `pnpm build && pnpm preview` starten
    - `pnpm lighthouse` ausführen
    - Report analysieren, Baseline etablieren

- [ ] **Task 5: GitHub Actions Workflow für Lighthouse CI** (AC: #5, #7)
  - [ ] Subtask 5.1: `.github/workflows/lighthouse.yml` erstellen
    - Trigger: `pull_request` (paths: `apps/frontend/**`)
    - Steps: Checkout, pnpm setup, install, build, preview, lighthouse
  - [ ] Subtask 5.2: wait-on für Server-Start nutzen
    - `npx wait-on http://localhost:4173` (warten bis Preview-Server bereit)
  - [ ] Subtask 5.3: Lighthouse CI ausführen im Workflow
    - `lhci autorun --config=apps/frontend/.lighthouserc.json`
    - Artifacts hochladen (Lighthouse-Report HTML)
  - [ ] Subtask 5.4: PR-Comment mit Report-Link (optional)
    - Action: `treosh/lighthouse-ci-action` für PR-Comments
    - Falls Budget fails: Comment mit Details

- [ ] **Task 6: CI-Enforcement testen** (AC: #7)
  - [ ] Subtask 6.1: Test-Branch mit absichtlich schlechter Performance erstellen
    - Großes Bild einbinden (5MB, kein lazy)
    - Heavy Blocking-Script einfügen
  - [ ] Subtask 6.2: PR erstellen, CI-Failure validieren
    - CI muss rot werden (Lighthouse-Budget fails)
    - Fehlermeldung muss klar sein
  - [ ] Subtask 6.3: Test-Branch löschen, Baseline-Performance validieren
    - Main-Branch: CI muss grün sein
    - Alle Scores >90

- [ ] **Task 7: Dokumentation und Testing** (AC: #1-7)
  - [ ] Subtask 7.1: README-Abschnitt für Performance-Monitoring
    - Erklären: Wie Lighthouse CI funktioniert
    - How-to: Lokal Lighthouse ausführen
    - Troubleshooting: Häufige Performance-Issues
  - [ ] Subtask 7.2: Performance-Budget dokumentieren
    - Tabelle mit allen Metrics und Targets
    - Rationale: Warum diese Targets?
  - [ ] Subtask 7.3: Integration-Test für Lazy Loading
    - Playwright-Test: Prüfe dass Component-Chunks lazy geladen werden
    - Network-Tab inspizieren: Separate Requests für Lazy-Components

## Dev Notes

### Architecture Patterns und Constraints

**Performance-Optimierung-Strategie (aus Tech Spec):**
- **Code-Splitting:** TanStack Router macht Route-based Splitting automatisch. Zusätzlich Component-based für Heavy Components (>5KB).
- **Lazy Loading:** React.lazy() mit Suspense für Heavy Components. Skeleton Loader als Fallback für bessere UX.
- **Asset-Optimierung:** WebP-Images mit responsive srcset. Lazy Loading für Bilder außerhalb Viewport.
- **Bundle-Optimierung:** Vite Tree-Shaking, Terser Minification, Vendor-Chunk-Splitting.
- **Lighthouse CI:** Automatische Performance-Validation in CI/CD als Quality Gate.

**Vite Build-Configuration (aus Architecture):**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.logs in production
        dead_code: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'tanstack': ['@tanstack/react-router', '@tanstack/react-query'],
          'ui': ['./components/ui/**'],
        },
      },
    },
  },
});
```

**Lighthouse CI Configuration (aus Tech Spec):**
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

**React.lazy() Pattern:**
```typescript
// Bad: Synchronous Import
import ProjectsSection from './sections/ProjectsSection';

// Good: Lazy Import with Suspense
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));

<Suspense fallback={<ProjectsSkeleton />}>
  <ProjectsSection projects={cv.projects} variant="public" />
</Suspense>
```

**Image-Optimierung Pattern:**
```typescript
// Hero Avatar with responsive srcset
<img
  src="/avatar.webp"
  srcSet="/avatar-320w.webp 320w, /avatar-640w.webp 640w, /avatar-1280w.webp 1280w"
  sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1280px"
  alt={cv.basics.name}
  loading="lazy"      // Lazy load (except above-the-fold)
  decoding="async"
  width={320}         // Prevent CLS
  height={320}
/>
```

**GitHub Actions Workflow Pattern:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    paths:
      - 'apps/frontend/**'

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build frontend
        run: pnpm --filter frontend build

      - name: Start preview server
        run: pnpm --filter frontend preview &

      - name: Wait for server
        run: npx wait-on http://localhost:4173

      - name: Run Lighthouse CI
        run: lhci autorun --config=apps/frontend/.lighthouserc.json

      - name: Upload Lighthouse Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: lighthouse-report
          path: .lighthouseci
```

### Source Tree Components to Touch

**Neue Dateien (zu erstellen):**
- `apps/frontend/.lighthouserc.json` - Lighthouse CI Configuration
- `.github/workflows/lighthouse.yml` - GitHub Actions Workflow für Lighthouse CI
- `apps/frontend/components/skeletons/projects-skeleton.tsx` - Skeleton Loader für Projects
- `apps/frontend/components/skeletons/experience-skeleton.tsx` - Skeleton Loader für Experience

**Zu modifizierende Dateien:**
- `apps/frontend/vite.config.ts` - Build-Optimierung, Manual Chunks, Terser Config
- `apps/frontend/app/routes/index.tsx` - Lazy Imports für Heavy Components, Suspense Wrapper
- `apps/frontend/components/sections/hero-section.tsx` - Avatar mit responsive srcset
- `apps/frontend/components/sections/projects-section.tsx` - Lazy Loadable Export
- `apps/frontend/components/sections/experience-section.tsx` - Lazy Loadable Export
- `apps/frontend/package.json` - `@lhci/cli` als devDependency, Scripts für Lighthouse
- `apps/frontend/README.md` - Performance-Monitoring-Dokumentation

**Dependencies:**
- `@lhci/cli` - Lighthouse CI Tool (devDependency)
- `vite-plugin-visualizer` oder `rollup-plugin-visualizer` - Bundle-Analyse (optional, devDependency)

### Testing Standards Summary

**Unit Tests:**
- **Lazy Loading:** Teste dass Lazy Components korrekt laden (Mock dynamic import)
- **Skeleton Loaders:** Teste dass Fallback-Components rendern

**Integration Tests:**
- **Bundle-Size:** Automatischer Test im CI - Build muss <200KB sein
- **Image Lazy Loading:** Playwright-Test - Bilder außerhalb Viewport laden erst on-scroll

**E2E Tests (Lighthouse CI):**
- **Performance-Budget:** Lighthouse CI validiert automatisch alle Metrics
- **Regression-Prevention:** CI fails bei Score-Drop

**Manual Testing:**
- **Bundle-Analyse:** Nach Build `pnpm build:analyze` ausführen, Chunks reviewen
- **Network-Tab:** DevTools - Lazy Chunks werden erst bei Bedarf geladen
- **Lighthouse Local:** `pnpm lighthouse` lokal ausführen, Report analysieren

### References

**Technical Specifications:**
- [Tech Spec Epic 3: Performance-Optimierung](docs/tech-spec-epic-3.md#Performance-Optimierung)
- [Tech Spec Epic 3: Workflows - Performance Monitoring](docs/tech-spec-epic-3.md#Workflow-5-Performance-Monitoring)
- [Tech Spec Epic 3: Test Strategy](docs/tech-spec-epic-3.md#Test-Strategy-Summary)

**Product Requirements:**
- [PRD: Non-Functional Requirements - Performance](docs/PRD.md#Performance)
- [PRD: Web Application Specifications - Performance Targets](docs/PRD.md#Frontend-Architektur)

**Architecture:**
- [Architecture: Frontend Stack - TanStack Start](docs/architecture.md#Frontend-Stack)
- [Architecture: Performance Strategy](docs/architecture.md#Performance-NFRs)

**Epic Context:**
- [Epic 3: Public Portfolio Experience](docs/epics.md#Epic-3-Public-Portfolio-Experience)
- [Story 3.12: Performance-Optimierung und Lighthouse CI](docs/epics.md#Story-3-12)

## Change Log

- **2025-11-07:** Story created by SM agent (non-interactive mode)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
