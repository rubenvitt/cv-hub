# Story 3.6: Skills Section mit Client-Side-Filterung

Status: drafted

## Story

Als Benutzer der öffentlichen CV-Seite,
möchte ich eine Skills Section mit filterbaren Skill-Badges sehen,
damit ich schnell relevante Skills nach Kategorien (Frontend, Backend, etc.) entdecken kann.

## Acceptance Criteria

1. **AC-1:** SkillsSection Component rendert alle Skills aus `cv.skills` als visuelle Badges (Tailwind-styled)
2. **AC-2:** Filter-Dropdown zeigt eindeutige Kategorien aus `skills[].keywords` Array
3. **AC-3:** User kann mehrere Kategorien gleichzeitig auswählen (Multi-Select-Filterung)
4. **AC-4:** Filterung erfolgt client-side ohne API-Calls mit instant Feedback (<100ms Latenz)
5. **AC-5:** "Clear Filters" Button resettet alle aktiven Filter auf Anfangszustand
6. **AC-6:** Gefilterte Skills zeigen Fade-In/Fade-Out-Animation (Tailwind Transitions)
7. **AC-7:** Responsive Grid-Layout: Mobile = 2 Spalten, Desktop = 4-6 Spalten
8. **AC-8:** Accessibility: Keyboard-Navigation für Filter-Controls, ARIA-Labels, Screen-Reader-Support
9. **AC-9:** Keine Layout-Shifts während Filterung (Cumulative Layout Shift <0.1)

## Tasks / Subtasks

- [ ] **Task 1: SkillsSection Component Grundstruktur** (AC: #1, #7)
  - [ ] 1.1: Erstelle `apps/frontend/components/sections/skills-section.tsx` mit TypeScript
  - [ ] 1.2: Definiere Props-Interface `SkillsSectionProps` mit Type `PublicCV['skills']` und `variant: 'public' | 'authenticated'`
  - [ ] 1.3: Implementiere responsive Grid-Layout mit Tailwind CSS (`grid-cols-2` Mobile, `md:grid-cols-4 lg:grid-cols-6` Desktop)
  - [ ] 1.4: Rendere alle Skills als SkillBadge-Components
  - [ ] 1.5: Teste Component isoliert mit React Testing Library

- [ ] **Task 2: SkillBadge UI Component** (AC: #1)
  - [ ] 2.1: Erstelle `apps/frontend/components/ui/skill-badge.tsx` als wiederverwendbare Component
  - [ ] 2.2: Definiere Props-Interface mit `name: string` und `level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'`
  - [ ] 2.3: Implementiere Badge-Styling mit Tailwind (rounded, padded, colored basierend auf Level)
  - [ ] 2.4: Füge Hover-States und Transitions hinzu (smooth scale-on-hover)
  - [ ] 2.5: Implementiere optionale Level-Indicator (z.B. farbcodiert oder Badge-Variante)
  - [ ] 2.6: Schreibe Unit-Tests für Badge-Component

- [ ] **Task 3: Client-Side Filter State Management** (AC: #2, #3, #4, #5)
  - [ ] 3.1: Implementiere React State für Filter-Logik (`useState` Hook)
  - [ ] 3.2: State-Interface: `SkillsFilterState { selectedCategories: string[] }`
  - [ ] 3.3: Extrahiere eindeutige Kategorien aus `skills[].keywords` (Set-basiert, dedupliziert)
  - [ ] 3.4: Implementiere Filter-Logik: `skills.filter(s => selectedCategories.length === 0 || s.keywords?.some(k => selectedCategories.includes(k)))`
  - [ ] 3.5: Implementiere Multi-Select-Handler für Filter-Dropdown
  - [ ] 3.6: Implementiere "Clear Filters" Button-Handler (resettet State zu `[]`)
  - [ ] 3.7: Optimiere Filter-Performance (memoize gefilterte Skills mit useMemo)

- [ ] **Task 4: Filter UI Component** (AC: #2, #3, #5, #8)
  - [ ] 4.1: Erstelle Filter-Controls UI in SkillsSection (oberhalb Grid)
  - [ ] 4.2: Implementiere Multi-Select-Dropdown mit shadcn/ui (z.B. Checkbox-Group)
  - [ ] 4.3: Zeige alle verfügbaren Kategorien als Checkboxes
  - [ ] 4.4: Implementiere "Clear Filters" Button (nur sichtbar wenn Filter aktiv)
  - [ ] 4.5: Füge ARIA-Labels hinzu (`aria-label="Filter skills by category"`)
  - [ ] 4.6: Style Filter-UI mit Tailwind (responsive, mobile-optimiert)
  - [ ] 4.7: Implementiere Keyboard-Navigation (Tab, Space/Enter für Checkbox-Toggle)

- [ ] **Task 5: Animationen und Transitions** (AC: #6, #9)
  - [ ] 5.1: Implementiere Fade-In/Fade-Out-Animation für gefilterte Skills (Tailwind `transition-opacity duration-300`)
  - [ ] 5.2: Verhindere Layout-Shifts: Grid-Container behält feste Höhe oder smooth collapse
  - [ ] 5.3: Teste Animation-Performance (keine Janks, smooth 60fps)
  - [ ] 5.4: Implementiere Skeleton-Loading-States (optional, falls nötig)
  - [ ] 5.5: Teste CLS-Metrik mit Lighthouse (Target: <0.1)

- [ ] **Task 6: Integration in Public Route** (AC: alle)
  - [ ] 6.1: Importiere SkillsSection in `apps/frontend/app/routes/index.tsx`
  - [ ] 6.2: Übergebe `cv.skills` als Props von Route-Loader-Daten
  - [ ] 6.3: Positioniere SkillsSection nach HeroSection im PublicLayout
  - [ ] 6.4: Teste Integration: SSR rendert Skills-Section korrekt (keine Client-Only-Code-Fehler)

- [ ] **Task 7: Accessibility & Responsive Testing** (AC: #7, #8)
  - [ ] 7.1: Teste Keyboard-Navigation (Tab zu Filter-Controls, Space/Enter für Toggle)
  - [ ] 7.2: Teste Screen-Reader (NVDA/JAWS): Filter-Controls und Skills korrekt vorgelesen
  - [ ] 7.3: Validiere Farb-Kontraste für Skill-Badges (WCAG AA: ≥4.5:1)
  - [ ] 7.4: Teste responsive Breakpoints (320px, 768px, 1024px, 1440px)
  - [ ] 7.5: Validiere Touch-Targets für Mobile (≥44x44px für Filter-Checkboxes)

- [ ] **Task 8: Component Testing** (AC: alle)
  - [ ] 8.1: Schreibe Unit-Tests für SkillsSection Component (Vitest + React Testing Library)
  - [ ] 8.2: Schreibe Unit-Tests für SkillBadge Component
  - [ ] 8.3: Teste Filter-Logik (verschiedene Kategorie-Kombinationen)
  - [ ] 8.4: Teste "Clear Filters" Funktionalität
  - [ ] 8.5: Teste Animation-Behavior (Fade-In/Fade-Out)
  - [ ] 8.6: Teste Edge-Cases (keine Skills, keine Keywords, leere Kategorien)
  - [ ] 8.7: Snapshot-Tests für visuelle Regression-Prevention

- [ ] **Task 9: Performance Testing** (AC: #4, #9)
  - [ ] 9.1: Messe Filter-Latenz mit Chrome DevTools Performance-Tab (Target: <100ms)
  - [ ] 9.2: Teste mit großen Skill-Sets (50+ Skills) für Performance-Validierung
  - [ ] 9.3: Validiere CLS mit Lighthouse (Target: <0.1)
  - [ ] 9.4: Optimiere Re-Renders mit React.memo wenn nötig
  - [ ] 9.5: Profiling mit React DevTools Profiler

## Dev Notes

### Tech Stack & Patterns

**Frontend-Framework:**
- React 19 (stable) mit TypeScript (strict mode)
- TanStack Start mit Server-Side Rendering (SSR)
- Tailwind CSS v4 für Utility-first Styling
- shadcn/ui Components für accessible UI-Patterns (Multi-Select-Dropdown)

**Data Model:**
- Props basieren auf `PublicCV['skills']` Type aus `@cv-hub/shared-types`
- Skill-Interface: `{ name: string; level?: string; keywords?: string[] }`
- Filter-State: `SkillsFilterState { selectedCategories: string[] }`

**Client-Side Filtering Strategy:**
- **No API Calls:** Alle Skills sind bereits via SSR-Loader geladen
- **Instant Feedback:** Filter-Logik läuft client-side (JavaScript Array.filter)
- **Multi-Select:** User kann mehrere Kategorien gleichzeitig auswählen (AND-Logic: Skill muss mindestens eine ausgewählte Kategorie haben)
- **Performance:** Memoize gefilterte Skills mit `useMemo` (Dependency: `selectedCategories`)

**Responsive Design-Strategie:**
- Mobile-First Approach (Tailwind-Breakpoints)
- Grid-Layout:
  - Mobile (< 768px): `grid-cols-2` (2 Spalten)
  - Tablet (768px - 1024px): `md:grid-cols-4` (4 Spalten)
  - Desktop (>= 1024px): `lg:grid-cols-6` (6 Spalten)
- Filter-Controls: Mobile = vertikale Liste, Desktop = horizontale Checkboxen

**Animation-Strategie:**
- Tailwind Transitions: `transition-opacity duration-300 ease-in-out`
- Fade-In: `opacity-0` → `opacity-100`
- Fade-Out: `opacity-100` → `opacity-0`
- Layout-Shift-Prevention: CSS Grid bleibt konstant, nur Items faden in/out

**Accessibility-Requirements:**
- WCAG 2.1 Level AA Compliance
- Semantisches HTML: `<section>` für SkillsSection, `<div role="group">` für Filter-Controls
- ARIA-Labels:
  - Filter-Dropdown: `aria-label="Filter skills by category"`
  - Clear Button: `aria-label="Clear all filters"`
  - Checkboxes: `aria-checked` States korrekt setzen
- Keyboard-Navigation:
  - Tab zu Filter-Controls
  - Space/Enter togglet Checkboxes
  - Focus-States: Tailwind `focus:ring-2`
- Screen-Reader: Filter-Status wird announced ("5 skills shown, filtered by Frontend")

### Project Structure Notes

**Component-Hierarchie:**
```
apps/frontend/app/routes/index.tsx (Public Route)
└── components/sections/skills-section.tsx (SkillsSection)
    ├── Filter-Controls (inline UI)
    └── components/ui/skill-badge.tsx (SkillBadge)
```

**File-Locations:**
- **SkillsSection:** `apps/frontend/components/sections/skills-section.tsx`
- **SkillBadge:** `apps/frontend/components/ui/skill-badge.tsx`
- **Route Integration:** `apps/frontend/app/routes/index.tsx`
- **Shared Types:** `packages/shared-types/src/index.ts` (PublicCV, SkillSchema)

**Styling-Konventionen:**
- Skill-Badges: Tailwind-styled (rounded-full, px-3 py-1, bg-primary, text-white)
- Level-based Coloring (optional):
  - Beginner: bg-blue-500
  - Intermediate: bg-green-500
  - Advanced: bg-orange-500
  - Expert: bg-red-500
- Filter-UI: shadcn/ui Checkbox-Group oder custom Tailwind-Checkboxes

### Architectural Constraints

**SSR-Kompatibilität:**
- Keine Client-Only-Code in SkillsSection initial render
- Filter-State via `useState` (Client-Side Hydration)
- Skills werden SSR-rendered, Filter-Controls hydrated client-side
- No `window` or `localStorage` usage ohne conditional check

**Type-Safety:**
- Props-Interface mit TypeScript Strict Mode
- Runtime-Validation bereits in API-Client (`lib/api.ts`) via Zod
- Component erhält typisierte Props vom Route-Loader

**Error-Handling:**
- Fehlende `skills` Array → Empty State anzeigen ("No skills to display")
- Leere `keywords` → Skill ist in Filter nicht selektierbar (exclude from categories)
- Fehlende `name` → Skill nicht rendern (Required Field)

**Testing-Strategie:**
- **Unit-Tests (Vitest):** SkillsSection, SkillBadge, Filter-Logik
- **Accessibility-Tests:** axe-core in React Testing Library
- **Performance-Tests:** Chrome DevTools, React Profiler
- **Snapshot-Tests:** Visuelle Regression-Prevention
- **Integration-Tests:** E2E mit Playwright (Filter-Flow)

**Performance-Optimierungen:**
- `useMemo` für gefilterte Skills (verhindert unnötige Re-Renders)
- `React.memo` für SkillBadge Component (verhindert Re-Render wenn Props gleich)
- No Debouncing nötig (Filter ist instant, keine API-Calls)
- Grid-Layout mit CSS Grid (performanter als Flexbox für viele Items)

**Privacy & Security:**
- Keine sensiblen Daten in Skills (nur Public-Subset)
- XSS-Prevention: React escapes automatisch
- No External API-Calls (alle Daten via SSR-Loader)

### Learnings from Previous Story

**From Story 3-5-hero-section-component-mit-basics-daten (Status: drafted)**

Previous story not yet implemented.

### References

**Tech Spec:**
- [Source: docs/tech-spec-epic-3.md#Skills Section Component]
  - Data Model: `PublicCV['skills']` Interface
  - Component Requirements: Badge-Grid, Client-Side Filtering, Responsive Layout
  - Filter-Logik: Multi-Select, Instant Feedback (<100ms)

**Architecture:**
- [Source: docs/architecture.md#Frontend Stack]
  - TanStack Start mit SSR
  - Tailwind CSS v4 für Styling
  - shadcn/ui Components für UI-Patterns

**Epics:**
- [Source: docs/epics.md#Story 3.6]
  - Acceptance Criteria (authoritative)
  - Prerequisites: Story 3.4 (Route mit CV-Daten)
  - Affected Files: skills-section.tsx, skill-badge.tsx

**PRD:**
- [Source: docs/PRD.md#FR-1.4: Client-Side Filtering]
  - Content ist filterbar (Skills nach Kategorie, Projekte nach Jahr)
  - Client-side, ohne Reload
- [Source: docs/PRD.md#UX Principles]
  - Visual Personality: Professionell, modern, zugänglich
  - Microinteractions: Hover-States, subtile Transitions
  - Accessibility: WCAG 2.1 Level AA Compliance

**JSON Resume Schema:**
- [Source: https://jsonresume.org/schema]
  - `skills[].name`: String (required)
  - `skills[].level`: String (optional) - "Beginner", "Intermediate", "Advanced", "Expert"
  - `skills[].keywords`: String[] (optional) - Categories like "Frontend", "Backend"

### Implementation Notes

**Component Props-Interface:**
```typescript
interface SkillsSectionProps {
  skills?: PublicCV['skills'];
  variant: 'public' | 'authenticated';
}

interface SkillBadgeProps {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillsFilterState {
  selectedCategories: string[];
}
```

**Filter-Logik (Beispiel-Code):**
```typescript
const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [], variant }) => {
  const [filterState, setFilterState] = useState<SkillsFilterState>({
    selectedCategories: [],
  });

  // Extract unique categories from all skills
  const categories = useMemo(() => {
    const allKeywords = skills.flatMap(s => s.keywords || []);
    return Array.from(new Set(allKeywords)).sort();
  }, [skills]);

  // Filter skills based on selected categories
  const filteredSkills = useMemo(() => {
    if (filterState.selectedCategories.length === 0) return skills;
    return skills.filter(skill =>
      skill.keywords?.some(k => filterState.selectedCategories.includes(k))
    );
  }, [skills, filterState.selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setFilterState(prev => ({
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  const clearFilters = () => {
    setFilterState({ selectedCategories: [] });
  };

  return (
    <section className="skills-section">
      {/* Filter Controls */}
      <div role="group" aria-label="Filter skills by category">
        {categories.map(cat => (
          <label key={cat}>
            <input
              type="checkbox"
              checked={filterState.selectedCategories.includes(cat)}
              onChange={() => handleCategoryToggle(cat)}
            />
            {cat}
          </label>
        ))}
        {filterState.selectedCategories.length > 0 && (
          <button onClick={clearFilters} aria-label="Clear all filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredSkills.map(skill => (
          <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
        ))}
      </div>
    </section>
  );
};
```

**SkillBadge Component (Beispiel):**
```typescript
const SkillBadge: React.FC<SkillBadgeProps> = ({ name, level }) => {
  const levelColors = {
    Beginner: 'bg-blue-500',
    Intermediate: 'bg-green-500',
    Advanced: 'bg-orange-500',
    Expert: 'bg-red-500',
  };

  const bgColor = level ? levelColors[level] : 'bg-gray-600';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${bgColor}
        transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-offset-2`}
      tabIndex={0}
    >
      {name}
    </span>
  );
};
```

**Animation CSS (Tailwind):**
```css
/* Fade-In Animation */
.skill-badge-enter {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}
.skill-badge-enter-active {
  opacity: 1;
}

/* Fade-Out Animation */
.skill-badge-exit {
  opacity: 1;
  transition: opacity 300ms ease-in-out;
}
.skill-badge-exit-active {
  opacity: 0;
}
```

**Testing-Strategie (Details):**
```typescript
// Unit-Test Beispiel (Vitest + React Testing Library)
describe('SkillsSection', () => {
  test('renders all skills', () => {
    const skills = [{ name: 'TypeScript' }, { name: 'React' }];
    render(<SkillsSection skills={skills} variant="public" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('filters skills by category', () => {
    const skills = [
      { name: 'TypeScript', keywords: ['Frontend'] },
      { name: 'Node.js', keywords: ['Backend'] },
    ];
    render(<SkillsSection skills={skills} variant="public" />);

    // Select "Frontend" filter
    const frontendCheckbox = screen.getByLabelText('Frontend');
    fireEvent.click(frontendCheckbox);

    // Assert: Only TypeScript visible
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
  });

  test('clear filters button works', () => {
    const skills = [
      { name: 'TypeScript', keywords: ['Frontend'] },
      { name: 'Node.js', keywords: ['Backend'] },
    ];
    render(<SkillsSection skills={skills} variant="public" />);

    // Apply filter
    fireEvent.click(screen.getByLabelText('Frontend'));

    // Click clear button
    const clearButton = screen.getByLabelText('Clear all filters');
    fireEvent.click(clearButton);

    // Assert: All skills visible again
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
});
```

### Change Log

- **2025-11-07:** Story created (drafted) - Non-interactive workflow execution

