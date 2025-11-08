# Story 4.13: PersonalizedCVPage Component und Integration

Status: drafted

## Story

Als Besucher,
möchte ich eine vollständige personalisierte CV-Seite sehen,
damit ich alle Informationen in gut strukturierter Form erhalte.

## Acceptance Criteria

1. Component `PersonalizedCVPage` existiert
2. Layout:
   - `PersonalizedMessageBanner` (oben, wenn vorhanden)
   - Badge "Personalisierte Ansicht" (Header, subtil)
   - `ContactSection`
   - `SkillsSection` (variant="authenticated")
   - `ProjectsSection` (variant="authenticated")
   - `ExperienceSection` (variant="authenticated")
3. Styling: Consistent mit Epic 3 Public CV (Tailwind CSS)
4. Visuelle Differenzierung: Subtile Border-Color oder Akzent unterschiedlich zu Public
5. Responsive: Mobile-First, funktioniert auf allen Breakpoints
6. Accessibility: Keyboard-Navigation, Focus-States
7. Performance: Code-Splitting (separate Chunk für /invite Route)
8. Integration: Route `/invite/:token.tsx` nutzt `PersonalizedCVPage` als Main Component

## Tasks / Subtasks

- [ ] **Task 1: PersonalizedCVPage Component erstellen** (AC: #1, #2, #3, #4)
  - [ ] Subtask 1.1: Component-Datei `apps/frontend/src/components/invite/PersonalizedCVPage.tsx` anlegen
  - [ ] Subtask 1.2: Props Interface definieren (`{ cv: PrivateCV, personalizedMessage?: string }`)
  - [ ] Subtask 1.3: Layout-Struktur implementieren (MessageBanner, Badge, Sections-Container)
  - [ ] Subtask 1.4: PersonalizedMessageBanner konditional rendern (wenn message vorhanden)
  - [ ] Subtask 1.5: Badge "Personalisierte Ansicht" im Header integrieren
  - [ ] Subtask 1.6: Section-Components mit variant="authenticated" einbinden:
    - ContactSection
    - SkillsSection
    - ProjectsSection
    - ExperienceSection
  - [ ] Subtask 1.7: Tailwind CSS Styling konsistent mit Epic 3 Public CV anwenden
  - [ ] Subtask 1.8: Visuelle Differenzierung implementieren (z.B. Border-Color, Akzent)

- [ ] **Task 2: Responsive Design & Accessibility** (AC: #5, #6)
  - [ ] Subtask 2.1: Mobile-First Breakpoints testen (sm, md, lg, xl)
  - [ ] Subtask 2.2: Keyboard-Navigation sicherstellen (Tab-Order, Focus-Styles)
  - [ ] Subtask 2.3: ARIA-Labels für Badge und Sections hinzufügen
  - [ ] Subtask 2.4: Focus-States für interaktive Elemente stylen

- [ ] **Task 3: Code-Splitting & Performance** (AC: #7)
  - [ ] Subtask 3.1: TanStack Router Code-Splitting für /invite Route verifizieren
  - [ ] Subtask 3.2: Lazy-Loading für PersonalizedCVPage Component implementieren (falls nötig)
  - [ ] Subtask 3.3: Bundle-Size überprüfen (separate Chunk für /invite Route)

- [ ] **Task 4: Route-Integration** (AC: #8)
  - [ ] Subtask 4.1: Route-Datei `apps/frontend/src/routes/invite/$token.tsx` öffnen
  - [ ] Subtask 4.2: PersonalizedCVPage Component importieren
  - [ ] Subtask 4.3: Component in Route-Render-Funktion integrieren
  - [ ] Subtask 4.4: Props korrekt durchreichen (cv, personalizedMessage)
  - [ ] Subtask 4.5: Error-Handling für ungültige/abgelaufene Tokens verifizieren

- [ ] **Task 5: Testing** (AC: #1-8)
  - [ ] Subtask 5.1: Unit-Test für PersonalizedCVPage Component (`PersonalizedCVPage.test.tsx`)
  - [ ] Subtask 5.2: Test: Component rendert ohne personalizedMessage
  - [ ] Subtask 5.3: Test: Component rendert mit personalizedMessage
  - [ ] Subtask 5.4: Test: Alle Section-Components werden mit variant="authenticated" gerendert
  - [ ] Subtask 5.5: Test: ContactSection wird nur in authenticated Ansicht gerendert
  - [ ] Subtask 5.6: Integration-Test: Route `/invite/:token` lädt PersonalizedCVPage
  - [ ] Subtask 5.7: Accessibility-Test mit axe DevTools (0 kritische Fehler)

## Dev Notes

### Architecture & Patterns

**Component Structure:**
- PersonalizedCVPage ist eine Composite-Component, die bestehende Section-Components orchestriert
- Verwendet variant-basiertes Rendering für unterschiedliche Datenfilterung (public vs authenticated)
- Layout folgt Epic 3 Public CV-Struktur für Konsistenz

**Data Flow:**
- Component erhält PrivateCV-Daten von Route Loader (SSR)
- PersonalizedMessage optional von `/api/invite/:token` Response
- Section-Components konsumieren CV-Daten mit variant="authenticated"

**Visual Differentiation:**
- Subtile Unterscheidung zur Public-Ansicht ohne aufdringlich zu sein
- Mögliche Ansätze: Border-Color (z.B. accent-color aus Tailwind), Badge im Header
- Konsistentes Design-System mit Epic 3 (Tailwind CSS, shadcn/ui)

**Performance Considerations:**
- Code-Splitting auf Route-Level (/invite/:token als separate Chunk)
- Lazy-Loading für PersonalizedCVPage falls Bundle-Size zu groß
- SSR für initiale Render-Performance

### Technical Constraints

**Prerequisites (Epic 4):**
- Story 4.10: PersonalizedMessageBanner Component (bereits drafted)
- Story 4.11: Section-Component-Varianten (SkillsSection, ProjectsSection, ExperienceSection) (bereits drafted)
- Story 4.12: ContactSection Component (bereits drafted)
- Story 4.8: Route `/invite/:token.tsx` mit SSR Loader (bereits drafted)

**Testing Requirements:**
- Testing-Framework: Vitest + React Testing Library (laut Architecture)
- Accessibility-Testing: axe DevTools, WCAG AA Compliance
- Unit-Tests für Component Rendering
- Integration-Tests für Route-Integration

**File Paths (laut Project Structure):**
- Component: `apps/frontend/src/components/invite/PersonalizedCVPage.tsx` (NEU)
- Test: `apps/frontend/src/components/invite/PersonalizedCVPage.test.tsx` (NEU)
- Route: `apps/frontend/src/routes/invite/$token.tsx` (UPDATE)

### Project Structure Notes

**Alignment mit Monorepo-Struktur:**
- Frontend liegt in `apps/frontend/`
- Components unter `src/components/`
- Neue Subdirectory: `components/invite/` für invite-spezifische Components
- Routes unter `src/routes/` (TanStack Router file-based routing)

**Dependency auf andere Stories:**
- PersonalizedMessageBanner aus Story 4.10
- ContactSection aus Story 4.12
- Section-Varianten (SkillsSection, ProjectsSection, ExperienceSection) aus Story 4.11
- Route `/invite/:token` aus Story 4.8

**Type Definitions:**
- `PrivateCV` Type aus shared-types Package (`packages/shared-types`)
- Component Props Interface in gleicher Datei definieren

### References

- [Source: docs/epics.md#Epic-4-Story-4.13] - User Story, Acceptance Criteria, Prerequisites
- [Source: docs/tech-spec-epic-4.md#Frontend-Integration] - Component-Architektur, TanStack Query Hooks, Visuelle Differenzierung
- [Source: docs/architecture.md#Frontend-Stack] - TanStack Start, React 19, Tailwind CSS, shadcn/ui
- [Source: docs/architecture.md#Technical-Stack-Decisions] - Testing-Framework (Vitest + RTL), Accessibility (WCAG AA)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
