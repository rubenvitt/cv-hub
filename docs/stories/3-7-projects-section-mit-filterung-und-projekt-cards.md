# Story 3.7: Projects Section mit Filterung und Projekt-Cards

Status: drafted

## Story

Als Benutzer der öffentlichen CV-Seite,
möchte ich eine Projects Section mit Projekt-Cards und clientseitiger Filterung nach Jahr/Keywords sehen,
damit ich relevante Projekte schnell finden und die technische Bandbreite überblicken kann.

## Acceptance Criteria

1. **AC-1:** ProjectsSection Component rendert alle Projekte als Cards (shadcn/ui Card Component)
2. **AC-2:** Projekt-Card zeigt: Name, Beschreibung (Zusammenfassung), Keywords (als Badges), Zeitraum (Start-/Enddatum)
3. **AC-3:** Filter-UI erlaubt Filterung nach Jahr (Dropdown-Auswahl) und Keywords (Multi-Select-Checkboxes)
4. **AC-4:** Filterung erfolgt client-side mit instant Feedback (<100ms Latenz, keine API-Calls)
5. **AC-5:** Sortierung nach Datum (neueste zuerst) oder Name (alphabetisch) ist umschaltbar
6. **AC-6:** Responsive Grid-Layout: Mobile = 1 Spalte, Tablet = 2 Spalten, Desktop = 3 Spalten
7. **AC-7:** Hover-State: Card hebt sich leicht an mit Shadow-Transition (Tailwind `hover:shadow-lg hover:-translate-y-1`)
8. **AC-8:** Accessibility: Keyboard-Navigation, ARIA-Labels für Filter-Controls, semantisches HTML
9. **AC-9:** Keine Layout-Shifts während Filterung (Cumulative Layout Shift <0.1)

## Tasks / Subtasks

- [ ] **Task 1: ProjectsSection Component Grundstruktur** (AC: #1, #6)
  - [ ] 1.1: Erstelle `apps/frontend/components/sections/projects-section.tsx` mit TypeScript
  - [ ] 1.2: Definiere Props-Interface `ProjectsSectionProps` mit Type `PublicCV['projects']` und `variant: 'public' | 'authenticated'`
  - [ ] 1.3: Implementiere responsive Grid-Layout mit Tailwind CSS (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
  - [ ] 1.4: Rendere alle Projects als ProjectCard-Components
  - [ ] 1.5: Teste Component isoliert mit React Testing Library

- [ ] **Task 2: ProjectCard UI Component** (AC: #2, #7)
  - [ ] 2.1: Erstelle `apps/frontend/components/ui/project-card.tsx` mit shadcn/ui Card als Base
  - [ ] 2.2: Definiere Props-Interface mit `project: NonNullable<PublicCV['projects']>[number]` und `variant`
  - [ ] 2.3: Implementiere Card-Layout: Titel (H3), Beschreibung (gekürzt auf 150 Zeichen), Keywords (Badge-Grid), Zeitraum
  - [ ] 2.4: Füge Hover-States hinzu: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
  - [ ] 2.5: Optional: URL-Link zum Projekt (wenn `project.url` vorhanden) mit External-Link-Icon
  - [ ] 2.6: Schreibe Unit-Tests für ProjectCard-Component

- [ ] **Task 3: Client-Side Filter State Management** (AC: #3, #4, #5)
  - [ ] 3.1: Erstelle Custom Hook `hooks/use-projects-filter.ts` mit React State
  - [ ] 3.2: State-Interface: `ProjectsFilterState { selectedYears: number[]; selectedKeywords: string[]; sortBy: 'date' | 'name'; sortOrder: 'asc' | 'desc' }`
  - [ ] 3.3: Extrahiere eindeutige Jahre aus `projects[].startDate` (ISO 8601 → Jahr extrahieren)
  - [ ] 3.4: Extrahiere eindeutige Keywords aus `projects[].keywords` (Set-basiert, dedupliziert)
  - [ ] 3.5: Implementiere Filter-Logik: `projects.filter(p => matchesYearFilter(p) && matchesKeywordFilter(p))`
  - [ ] 3.6: Implementiere Sortier-Logik: `projects.sort((a, b) => sortByDate(a, b) || sortByName(a, b))`
  - [ ] 3.7: Optimiere Performance mit `useMemo` (gefilterte + sortierte Projekte)

- [ ] **Task 4: Filter UI Component** (AC: #3, #5, #8)
  - [ ] 4.1: Erstelle Filter-Controls UI in ProjectsSection (oberhalb Grid)
  - [ ] 4.2: Implementiere Jahr-Dropdown mit shadcn/ui Select Component
  - [ ] 4.3: Implementiere Keywords-Multi-Select mit Checkbox-Group (shadcn/ui)
  - [ ] 4.4: Implementiere Sort-By-Toggle (Radio-Buttons oder Toggle-Button-Group): "Neueste zuerst" vs. "A-Z"
  - [ ] 4.5: Implementiere "Clear Filters" Button (nur sichtbar wenn Filter aktiv)
  - [ ] 4.6: Füge ARIA-Labels hinzu (`aria-label="Filter projects by year"`, `aria-label="Sort projects"`)
  - [ ] 4.7: Style Filter-UI mit Tailwind (responsive, mobile-optimiert, sticky on scroll optional)
  - [ ] 4.8: Implementiere Keyboard-Navigation (Tab, Space/Enter für Selection)

- [ ] **Task 5: Animations und Transitions** (AC: #7, #9)
  - [ ] 5.1: Implementiere Card Hover-Animation: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
  - [ ] 5.2: Verhindere Layout-Shifts: Grid-Container behält feste Höhe oder smooth collapse (CSS Grid `auto-fit`)
  - [ ] 5.3: Implementiere Fade-In/Fade-Out für gefilterte Cards (optional, Tailwind `transition-opacity`)
  - [ ] 5.4: Teste Animation-Performance (keine Janks, smooth 60fps mit Chrome DevTools)
  - [ ] 5.5: Teste CLS-Metrik mit Lighthouse (Target: <0.1)

- [ ] **Task 6: Integration in Public Route** (AC: alle)
  - [ ] 6.1: Importiere ProjectsSection in `apps/frontend/app/routes/index.tsx`
  - [ ] 6.2: Übergebe `cv.projects` als Props von Route-Loader-Daten
  - [ ] 6.3: Positioniere ProjectsSection nach SkillsSection im PublicLayout
  - [ ] 6.4: Teste Integration: SSR rendert Projects-Section korrekt (keine Client-Only-Code-Fehler)

- [ ] **Task 7: Accessibility & Responsive Testing** (AC: #6, #8)
  - [ ] 7.1: Teste Keyboard-Navigation (Tab zu Filter-Controls, Space/Enter für Toggle)
  - [ ] 7.2: Teste Screen-Reader (NVDA/JAWS): Filter-Controls und Project-Cards korrekt vorgelesen
  - [ ] 7.3: Validiere Farb-Kontraste für Card-Text und Badges (WCAG AA: ≥4.5:1)
  - [ ] 7.4: Teste responsive Breakpoints (320px, 768px, 1024px, 1440px): Grid anpasst sich korrekt
  - [ ] 7.5: Validiere Touch-Targets für Mobile (≥44x44px für Filter-Checkboxes und Card-Links)

- [ ] **Task 8: Component Testing** (AC: alle)
  - [ ] 8.1: Schreibe Unit-Tests für ProjectsSection Component (Vitest + React Testing Library)
  - [ ] 8.2: Schreibe Unit-Tests für ProjectCard Component
  - [ ] 8.3: Teste Filter-Logik (verschiedene Jahr/Keyword-Kombinationen)
  - [ ] 8.4: Teste Sortier-Logik (Datum asc/desc, Name asc/desc)
  - [ ] 8.5: Teste "Clear Filters" Funktionalität
  - [ ] 8.6: Teste Edge-Cases (keine Projekte, leere Keywords, fehlende Zeiträume)
  - [ ] 8.7: Snapshot-Tests für visuelle Regression-Prevention

- [ ] **Task 9: Performance Testing** (AC: #4, #9)
  - [ ] 9.1: Messe Filter-Latenz mit Chrome DevTools Performance-Tab (Target: <100ms)
  - [ ] 9.2: Teste mit großen Projekt-Sets (20+ Projekte) für Performance-Validierung
  - [ ] 9.3: Validiere CLS mit Lighthouse (Target: <0.1)
  - [ ] 9.4: Optimiere Re-Renders mit React.memo wenn nötig
  - [ ] 9.5: Profiling mit React DevTools Profiler

## Dev Notes

### Tech Stack & Patterns

**Frontend-Framework:**
- React 19 (stable) mit TypeScript (strict mode)
- TanStack Start mit Server-Side Rendering (SSR)
- Tailwind CSS v4 für Utility-first Styling
- shadcn/ui Components für accessible UI-Patterns (Card, Select, Checkbox)

**Data Model:**
- Props basieren auf `PublicCV['projects']` Type aus `@cv-hub/shared-types`
- Project-Interface (JSON Resume Schema):
  ```typescript
  interface Project {
    name: string;
    description: string;
    highlights?: string[];      // Key achievements
    keywords?: string[];        // Tech stack tags
    startDate?: string;         // ISO 8601 (YYYY-MM-DD)
    endDate?: string;           // ISO 8601 oder null (ongoing)
    url?: string;               // Project URL
    roles?: string[];           // ["Lead Developer"]
    type?: string;              // "Open Source", "Commercial"
  }
  ```
- Filter-State: `ProjectsFilterState { selectedYears: number[]; selectedKeywords: string[]; sortBy: 'date' | 'name'; sortOrder: 'asc' | 'desc' }`

**Client-Side Filtering Strategy:**
- **No API Calls:** Alle Projekte sind bereits via SSR-Loader geladen
- **Instant Feedback:** Filter-Logik läuft client-side (JavaScript Array.filter)
- **Multi-Select:** User kann mehrere Jahre/Keywords gleichzeitig auswählen (OR-Logic für Keywords, AND-Logic kombiniert)
- **Performance:** Memoize gefilterte + sortierte Projekte mit `useMemo` (Dependencies: `selectedYears`, `selectedKeywords`, `sortBy`, `sortOrder`)

**Responsive Design-Strategie:**
- Mobile-First Approach (Tailwind-Breakpoints)
- Grid-Layout:
  - Mobile (< 768px): `grid-cols-1` (1 Spalte, Cards full-width)
  - Tablet (768px - 1024px): `md:grid-cols-2` (2 Spalten)
  - Desktop (>= 1024px): `lg:grid-cols-3` (3 Spalten)
- Filter-Controls: Mobile = vertikale Liste, Desktop = horizontale Filter-Bar

**Animation-Strategie:**
- Hover-State für Cards: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out`
- Optional: Fade-In/Fade-Out für gefilterte Cards: `transition-opacity duration-300`
- Layout-Shift-Prevention: CSS Grid mit `auto-fit` oder `grid-auto-rows`, keine fixed heights

**Accessibility-Requirements:**
- WCAG 2.1 Level AA Compliance
- Semantisches HTML: `<section>` für ProjectsSection, `<article>` für ProjectCard, `<time>` für Zeiträume
- ARIA-Labels:
  - Filter-Dropdown: `aria-label="Filter projects by year"`
  - Keywords-Checkboxes: `aria-label="Filter by keywords"`
  - Sort-Toggle: `aria-label="Sort projects by date or name"`
  - Clear Button: `aria-label="Clear all filters"`
- Keyboard-Navigation:
  - Tab zu Filter-Controls
  - Space/Enter togglet Checkboxes/Select
  - Focus-States: Tailwind `focus:ring-2`
- Screen-Reader: Filter-Status wird announced ("8 projects shown, filtered by 2023")

### Project Structure Notes

**Component-Hierarchie:**
```
apps/frontend/app/routes/index.tsx (Public Route)
└── components/sections/projects-section.tsx (ProjectsSection)
    ├── Filter-Controls (inline UI mit shadcn/ui Select + Checkboxes)
    └── components/ui/project-card.tsx (ProjectCard)
        ├── shadcn/ui Card (Base)
        ├── components/ui/badge.tsx (Keywords)
        └── Optional: External-Link-Icon (wenn project.url vorhanden)
```

**File-Locations:**
- **ProjectsSection:** `apps/frontend/components/sections/projects-section.tsx`
- **ProjectCard:** `apps/frontend/components/ui/project-card.tsx`
- **Filter Hook:** `apps/frontend/hooks/use-projects-filter.ts`
- **Route Integration:** `apps/frontend/app/routes/index.tsx`
- **Shared Types:** `packages/shared-types/src/index.ts` (PublicCV, ProjectSchema)

**Styling-Konventionen:**
- Project-Cards: shadcn/ui Card mit Tailwind-Customizations
- Card-Layout:
  - Padding: `p-6`
  - Border-Radius: `rounded-lg`
  - Shadow: `shadow-md` (base), `hover:shadow-lg` (hover)
  - Border: `border border-gray-200` (Light Mode)
- Keywords: Badge-Component (aus Skills Section wiederverwendbar)
- Filter-UI: shadcn/ui Select-Component + Checkbox-Group

### Architectural Constraints

**SSR-Kompatibilität:**
- Keine Client-Only-Code in ProjectsSection initial render
- Filter-State via `useState` (Client-Side Hydration)
- Projects werden SSR-rendered, Filter-Controls hydrated client-side
- No `window` or `localStorage` usage ohne conditional check

**Type-Safety:**
- Props-Interface mit TypeScript Strict Mode
- Runtime-Validation bereits in API-Client (`lib/api.ts`) via Zod
- Component erhält typisierte Props vom Route-Loader

**Error-Handling:**
- Fehlende `projects` Array → Empty State anzeigen ("No projects to display")
- Leere `keywords` → Projekt wird ohne Keywords angezeigt (Badge-Grid leer)
- Fehlende `name` → Projekt nicht rendern (Required Field)
- Fehlende Zeiträume → "Date not specified" anzeigen

**Testing-Strategie:**
- **Unit-Tests (Vitest):** ProjectsSection, ProjectCard, use-projects-filter Hook
- **Accessibility-Tests:** axe-core in React Testing Library
- **Performance-Tests:** Chrome DevTools, React Profiler
- **Snapshot-Tests:** Visuelle Regression-Prevention
- **Integration-Tests:** E2E mit Playwright (Filter-Flow)

**Performance-Optimierungen:**
- `useMemo` für gefilterte + sortierte Projects (verhindert unnötige Re-Calculations)
- `React.memo` für ProjectCard Component (verhindert Re-Render wenn Props gleich)
- No Debouncing nötig (Filter ist instant, keine API-Calls)
- Grid-Layout mit CSS Grid (performanter als Flexbox für viele Items)

**Privacy & Security:**
- Keine sensiblen Daten in Projects (nur Public-Subset aus Epic 2)
- `project.entity` (company name) ist redacted (Privacy-Filtering server-side)
- `project.metrics` (business metrics) ist redacted
- XSS-Prevention: React escapes automatisch
- No External API-Calls (alle Daten via SSR-Loader)

### Learnings from Previous Story

**From Story 3-6-skills-section-mit-client-side-filterung (Status: drafted)**

Previous story not yet implemented.

### References

**Tech Spec:**
- [Source: docs/tech-spec-epic-3.md#Projects Section Component]
  - Data Model: `PublicCV['projects']` Interface
  - Component Requirements: Card-Grid, Client-Side Filtering (Jahr + Keywords), Sortierung, Responsive Layout
  - Filter-Logik: Multi-Select, Instant Feedback (<100ms)
  - Performance: Lighthouse Score >90, keine Layout-Shifts

**Architecture:**
- [Source: docs/architecture.md#Frontend Stack]
  - TanStack Start mit SSR
  - Tailwind CSS v4 für Styling
  - shadcn/ui Components für UI-Patterns
  - React 19 (stable)

**Epics:**
- [Source: docs/epics.md#Story 3.7]
  - Acceptance Criteria (authoritative)
  - Prerequisites: Story 3.4 (Route mit CV-Daten)
  - Affected Files: projects-section.tsx, project-card.tsx, use-projects-filter.ts

**PRD:**
- [Source: docs/PRD.md#FR-1.4: Client-Side Filtering]
  - Content ist filterbar (Skills nach Kategorie, Projekte nach Jahr/Keywords)
  - Client-side, ohne Reload
- [Source: docs/PRD.md#UX Principles]
  - Visual Personality: Professionell, modern, zugänglich
  - Microinteractions: Hover-States, subtile Transitions
  - Accessibility: WCAG 2.1 Level AA Compliance

**JSON Resume Schema:**
- [Source: https://jsonresume.org/schema]
  - `projects[].name`: String (required)
  - `projects[].description`: String (optional)
  - `projects[].keywords`: String[] (optional) - Tech stack tags
  - `projects[].startDate`: String (optional) - ISO 8601 (YYYY-MM-DD)
  - `projects[].endDate`: String (optional) - ISO 8601 oder null (ongoing)
  - `projects[].url`: String (optional) - Project URL

### Implementation Notes

**Component Props-Interface:**
```typescript
interface ProjectsSectionProps {
  projects?: PublicCV['projects'];
  variant: 'public' | 'authenticated';
}

interface ProjectCardProps {
  project: NonNullable<PublicCV['projects']>[number];
  variant: 'public' | 'authenticated';
}

interface ProjectsFilterState {
  selectedYears: number[];
  selectedKeywords: string[];
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}
```

**Filter-Logik (Beispiel-Code):**
```typescript
const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [], variant }) => {
  const [filterState, setFilterState] = useState<ProjectsFilterState>({
    selectedYears: [],
    selectedKeywords: [],
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Extract unique years from projects
  const availableYears = useMemo(() => {
    const years = projects
      .map(p => p.startDate ? new Date(p.startDate).getFullYear() : null)
      .filter((year): year is number => year !== null);
    return Array.from(new Set(years)).sort((a, b) => b - a); // Newest first
  }, [projects]);

  // Extract unique keywords from projects
  const availableKeywords = useMemo(() => {
    const keywords = projects.flatMap(p => p.keywords || []);
    return Array.from(new Set(keywords)).sort();
  }, [projects]);

  // Filter + Sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by years
    if (filterState.selectedYears.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.startDate) return false;
        const year = new Date(p.startDate).getFullYear();
        return filterState.selectedYears.includes(year);
      });
    }

    // Filter by keywords (OR-logic: project matches if it has ANY selected keyword)
    if (filterState.selectedKeywords.length > 0) {
      filtered = filtered.filter(p =>
        p.keywords?.some(k => filterState.selectedKeywords.includes(k))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (filterState.sortBy === 'date') {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return filterState.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        // Sort by name
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return filterState.sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [projects, filterState]);

  const clearFilters = () => {
    setFilterState({
      selectedYears: [],
      selectedKeywords: [],
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <section className="projects-section">
      {/* Filter Controls */}
      <div className="filter-controls mb-8" role="group" aria-label="Filter and sort projects">
        {/* Year Filter (Select) */}
        <div>
          <label htmlFor="year-filter">Filter by Year:</label>
          <select
            id="year-filter"
            multiple
            value={filterState.selectedYears.map(String)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value));
              setFilterState(prev => ({ ...prev, selectedYears: selected }));
            }}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Keywords Filter (Checkboxes) */}
        <div>
          <span>Filter by Keywords:</span>
          {availableKeywords.map(keyword => (
            <label key={keyword}>
              <input
                type="checkbox"
                checked={filterState.selectedKeywords.includes(keyword)}
                onChange={() => {
                  setFilterState(prev => ({
                    ...prev,
                    selectedKeywords: prev.selectedKeywords.includes(keyword)
                      ? prev.selectedKeywords.filter(k => k !== keyword)
                      : [...prev.selectedKeywords, keyword],
                  }));
                }}
              />
              {keyword}
            </label>
          ))}
        </div>

        {/* Sort Controls */}
        <div>
          <label>Sort by:</label>
          <button onClick={() => setFilterState(prev => ({ ...prev, sortBy: 'date', sortOrder: 'desc' }))}>
            Neueste zuerst
          </button>
          <button onClick={() => setFilterState(prev => ({ ...prev, sortBy: 'name', sortOrder: 'asc' }))}>
            A-Z
          </button>
        </div>

        {/* Clear Filters Button */}
        {(filterState.selectedYears.length > 0 || filterState.selectedKeywords.length > 0) && (
          <button onClick={clearFilters} aria-label="Clear all filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <p>No projects match your filters.</p>
        ) : (
          filteredProjects.map(project => (
            <ProjectCard key={project.name} project={project} variant={variant} />
          ))
        )}
      </div>
    </section>
  );
};
```

**ProjectCard Component (Beispiel):**
```typescript
const ProjectCard: React.FC<ProjectCardProps> = ({ project, variant }) => {
  const formatDateRange = (start?: string, end?: string) => {
    const startYear = start ? new Date(start).getFullYear() : null;
    const endYear = end ? (end === 'present' ? 'Present' : new Date(end).getFullYear()) : 'Present';
    return startYear ? `${startYear} - ${endYear}` : 'Date not specified';
  };

  return (
    <article className="project-card group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{project.name}</span>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.name} website`}
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLinkIcon className="w-5 h-5" />
              </a>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {project.description
              ? (project.description.length > 150
                  ? `${project.description.substring(0, 150)}...`
                  : project.description)
              : 'No description available.'}
          </p>

          {/* Keywords Badges */}
          {project.keywords && project.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.keywords.map(keyword => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* Date Range */}
          <p className="text-xs text-gray-500">
            <time dateTime={project.startDate}>
              {formatDateRange(project.startDate, project.endDate)}
            </time>
          </p>
        </CardContent>
      </Card>
    </article>
  );
};
```

**Testing-Strategie (Details):**
```typescript
// Unit-Test Beispiel (Vitest + React Testing Library)
describe('ProjectsSection', () => {
  test('renders all projects', () => {
    const projects = [
      { name: 'Project Alpha', description: 'First project' },
      { name: 'Project Beta', description: 'Second project' },
    ];
    render(<ProjectsSection projects={projects} variant="public" />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
  });

  test('filters projects by year', () => {
    const projects = [
      { name: 'Project 2023', startDate: '2023-01-01' },
      { name: 'Project 2024', startDate: '2024-01-01' },
    ];
    render(<ProjectsSection projects={projects} variant="public" />);

    // Select year 2023
    const yearFilter = screen.getByLabelText('Filter by Year:');
    fireEvent.change(yearFilter, { target: { value: ['2023'] } });

    // Assert: Only 2023 project visible
    expect(screen.getByText('Project 2023')).toBeInTheDocument();
    expect(screen.queryByText('Project 2024')).not.toBeInTheDocument();
  });

  test('filters projects by keywords', () => {
    const projects = [
      { name: 'React Project', keywords: ['React', 'TypeScript'] },
      { name: 'Node Project', keywords: ['Node.js', 'Express'] },
    ];
    render(<ProjectsSection projects={projects} variant="public" />);

    // Select "React" keyword
    const reactCheckbox = screen.getByLabelText('React');
    fireEvent.click(reactCheckbox);

    // Assert: Only React project visible
    expect(screen.getByText('React Project')).toBeInTheDocument();
    expect(screen.queryByText('Node Project')).not.toBeInTheDocument();
  });

  test('clear filters button works', () => {
    const projects = [
      { name: 'Project A', startDate: '2023-01-01' },
      { name: 'Project B', startDate: '2024-01-01' },
    ];
    render(<ProjectsSection projects={projects} variant="public" />);

    // Apply year filter
    const yearFilter = screen.getByLabelText('Filter by Year:');
    fireEvent.change(yearFilter, { target: { value: ['2023'] } });

    // Click clear button
    const clearButton = screen.getByLabelText('Clear all filters');
    fireEvent.click(clearButton);

    // Assert: All projects visible again
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  test('sorts projects by date (newest first)', () => {
    const projects = [
      { name: 'Old Project', startDate: '2020-01-01' },
      { name: 'New Project', startDate: '2024-01-01' },
    ];
    const { container } = render(<ProjectsSection projects={projects} variant="public" />);

    // Default sort: newest first
    const cards = container.querySelectorAll('.project-card');
    expect(cards[0]).toHaveTextContent('New Project');
    expect(cards[1]).toHaveTextContent('Old Project');
  });
});
```

### Change Log

- **2025-11-07:** Story created (drafted) - Non-interactive workflow execution

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
