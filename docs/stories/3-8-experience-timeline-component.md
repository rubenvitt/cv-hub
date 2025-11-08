# Story 3.8: Experience Timeline Component

Status: drafted

## Story

Als Benutzer der öffentlichen CV-Seite,
möchte ich eine Berufserfahrungs-Timeline sehen, die Jobs chronologisch darstellt,
damit ich die Career-History nachvollziehen und relevante Berufserfahrung identifizieren kann.

## Acceptance Criteria

1. **AC-1:** ExperienceSection Component rendert `cv.work[]` als vertikale Timeline mit chronologischer Sortierung (neueste zuerst)
2. **AC-2:** Jeder Job zeigt: Position (Titel), Zeitraum (Start-/Enddatum formatiert), Highlights (max. 5 Achievements)
3. **AC-3:** Firmennamen werden als "Confidential" angezeigt (Privacy-Filtering bereits server-side durch Epic 2)
4. **AC-4:** Timeline-Indicator visuell: Vertikale Linie (`border-l-2`) mit Dots (`rounded-full`) pro Job
5. **AC-5:** Responsive Layout: Mobile = kompakte vertikale Stack-Ansicht (1-Spalten), Desktop = Timeline-Layout mit Spacing
6. **AC-6:** Aktiver Job (`endDate` === null oder "Present") wird visuell hervorgehoben (farbiger Dot, Label "Aktuell")
7. **AC-7:** Accessibility: Semantisches HTML (`<section>`, `<article>` pro Job, `<time>` für Zeiträume), ARIA-Labels, Keyboard-Navigation

## Tasks / Subtasks

- [ ] **Task 1: ExperienceSection Component Grundstruktur** (AC: #1, #5)
  - [ ] 1.1: Erstelle `apps/frontend/components/sections/experience-section.tsx` mit TypeScript
  - [ ] 1.2: Definiere Props-Interface `ExperienceSectionProps { work: PublicCV['work']; variant: 'public' | 'authenticated'; }`
  - [ ] 1.3: Implementiere responsive Container-Layout: Mobile = 1-Spalte Stack, Desktop = max-width Container mit Padding
  - [ ] 1.4: Sortiere `work` Array chronologisch (neueste zuerst): `work.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))`
  - [ ] 1.5: Rendere Timeline-Structure mit vertikaler Linie (`border-l-2 border-gray-300`) als Container
  - [ ] 1.6: Teste Component isoliert mit React Testing Library

- [ ] **Task 2: ExperienceCard UI Component** (AC: #2, #3, #4)
  - [ ] 2.1: Erstelle `apps/frontend/components/ui/experience-card.tsx` mit TypeScript
  - [ ] 2.2: Definiere Props-Interface: `ExperienceCardProps { job: NonNullable<PublicCV['work']>[number]; variant: 'public' | 'authenticated'; }`
  - [ ] 2.3: Implementiere Card-Layout mit Timeline-Dot: Dot (12x12px `rounded-full`) auf vertikaler Linie platziert
  - [ ] 2.4: Rendere Job-Details: Position (H3), Zeitraum (formatiert mit date-fns), Company-Name ("Confidential")
  - [ ] 2.5: Highlights-Liste: Bulleted List (max. 5 items, gekürzt falls mehr) mit Tailwind `list-disc`
  - [ ] 2.6: Schreibe Unit-Tests für ExperienceCard Component (verschiedene Zeitraum-Szenarien)

- [ ] **Task 3: Timeline-Indicator Styling** (AC: #4, #6)
  - [ ] 3.1: Implementiere vertikale Linie: `border-l-2 border-gray-300` als Timeline-Container
  - [ ] 3.2: Timeline-Dots: `rounded-full w-3 h-3 border-2 border-blue-500 bg-white` (default)
  - [ ] 3.3: Aktiver Job Dot-Styling: `bg-blue-500` (gefüllt) + optional pulsing animation (`animate-pulse`)
  - [ ] 3.4: Positionierung: Dot mit `absolute` positioniert auf Timeline-Linie (left: -6px)
  - [ ] 3.5: Optional: "Aktuell" Label neben aktiver Job-Dot (Badge-Component oder Text)

- [ ] **Task 4: Date Formatting Utility** (AC: #2, #6)
  - [ ] 4.1: Erstelle Utility-Function `formatDateRange(startDate: string, endDate?: string | null): string` in `lib/utils/date.ts`
  - [ ] 4.2: Formatierung: `startDate` → "Jan 2020", `endDate` → "Dez 2024" oder "Aktuell" falls null
  - [ ] 4.3: Nutze `date-fns` für Formatierung: `format(new Date(date), 'MMM yyyy', { locale: de })`
  - [ ] 4.4: Handle Edge-Cases: Fehlende Daten → "Date not specified", Invalid Date → Error-Handling
  - [ ] 4.5: Schreibe Unit-Tests für formatDateRange (verschiedene Input-Szenarien)

- [ ] **Task 5: Accessibility Implementation** (AC: #7)
  - [ ] 5.1: Semantisches HTML: `<section>` für ExperienceSection, `<article>` für jeden Job
  - [ ] 5.2: `<time>` Elements für Zeiträume mit `dateTime` Attribut (ISO 8601 Format)
  - [ ] 5.3: ARIA-Labels: `aria-label="Professional Experience Timeline"` für Section
  - [ ] 5.4: ARIA-Labels für aktiver Job: `aria-label="Current position"`
  - [ ] 5.5: Heading-Hierarchie: H2 für Section-Title, H3 für Job-Position
  - [ ] 5.6: Keyboard-Navigation: Timeline ist navigierbar (Tab zu jedem Job-Card)
  - [ ] 5.7: Screen-Reader-Test: Verifiziere korrekte Vorlesung der Timeline-Struktur

- [ ] **Task 6: Responsive Design Implementation** (AC: #5)
  - [ ] 6.1: Mobile Layout (<768px): Stack-Layout mit voller Breite, Timeline-Linie links (16px Margin)
  - [ ] 6.2: Desktop Layout (>=768px): Timeline-Layout mit max-width Container, zentriert
  - [ ] 6.3: Spacing: Mobile = kompakt (gap-4), Desktop = erweitert (gap-6)
  - [ ] 6.4: Dot-Positionierung angepasst: Mobile = left: 0, Desktop = left: -6px (auf Timeline)
  - [ ] 6.5: Test responsive Breakpoints: 320px (Mobile), 768px (Tablet), 1024px (Desktop)

- [ ] **Task 7: Integration in Public Route** (AC: #1)
  - [ ] 7.1: Importiere ExperienceSection in `apps/frontend/app/routes/index.tsx`
  - [ ] 7.2: Übergebe `cv.work` als Props von Route-Loader-Daten
  - [ ] 7.3: Positioniere ExperienceSection nach ProjectsSection im PublicLayout
  - [ ] 7.4: Teste Integration: SSR rendert ExperienceSection korrekt (keine Client-Only-Code-Fehler)
  - [ ] 7.5: Validiere: Timeline-Data wird korrekt aus API-Response übernommen

- [ ] **Task 8: Component Testing** (AC: alle)
  - [ ] 8.1: Schreibe Unit-Tests für ExperienceSection Component (Vitest + React Testing Library)
  - [ ] 8.2: Schreibe Unit-Tests für ExperienceCard Component (verschiedene Job-Szenarien)
  - [ ] 8.3: Teste Sortierung: Jobs in chronologischer Reihenfolge (neueste zuerst)
  - [ ] 8.4: Teste Privacy-Filtering: Company-Name = "Confidential" (verifiziere Props-Data)
  - [ ] 8.5: Teste aktiver Job Highlighting: Current Job hat spezielles Styling
  - [ ] 8.6: Teste Edge-Cases: Keine Work-Experience (Empty State), fehlende Zeiträume, keine Highlights
  - [ ] 8.7: Snapshot-Tests für visuelle Regression-Prevention

- [ ] **Task 9: Accessibility Testing** (AC: #7)
  - [ ] 9.1: Teste Keyboard-Navigation: Tab zu jedem Job-Card funktioniert
  - [ ] 9.2: Teste Screen-Reader (NVDA/JAWS): Timeline-Struktur korrekt vorgelesen
  - [ ] 9.3: Validiere Farb-Kontraste für Text und Timeline-Dots (WCAG AA: ≥4.5:1)
  - [ ] 9.4: Teste ARIA-Labels: Screen-Reader announced "Professional Experience Timeline"
  - [ ] 9.5: Teste semantisches HTML: `<article>`, `<time>` Elements korrekt verwendet

## Dev Notes

### Tech Stack & Patterns

**Frontend-Framework:**
- React 19 (stable) mit TypeScript (strict mode)
- TanStack Start mit Server-Side Rendering (SSR)
- Tailwind CSS v4 für Utility-first Styling
- shadcn/ui Components optional (Card-Base falls gewünscht)

**Data Model:**
- Props basieren auf `PublicCV['work']` Type aus `@cv-hub/shared-types`
- Work-Interface (JSON Resume Schema):
  ```typescript
  interface Work {
    name?: string;              // "Confidential" (generic label, privacy-filtered)
    position: string;           // "Senior Engineer"
    startDate: string;          // ISO 8601 (YYYY-MM-DD)
    endDate?: string | null;    // ISO 8601 oder null (current job)
    summary?: string;           // Role summary
    highlights?: string[];      // Achievements (limitiert auf 3-5, max. 5 anzeigen)
  }
  ```
- Timeline-Sortierung: Neueste Jobs zuerst (`work.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))`)

**Timeline-Design-Strategie:**
- **Vertikale Timeline:** Klassisches Timeline-Pattern mit Linie + Dots
- **Dot-Styling:**
  - Default (vergangene Jobs): Border-Only Dot (`border-2 border-blue-500 bg-white`)
  - Aktuell (current job): Gefüllter Dot (`bg-blue-500`) + optional pulsing animation
- **Responsive-Strategie:**
  - Mobile: Kompakte Stack-Ansicht, Timeline-Linie links (schmaler Margin)
  - Desktop: Erweiterte Timeline mit größerem Spacing zwischen Jobs
- **Color-Scheme:** Neutral (gray-300 Timeline-Linie, blue-500 Dots für Branding-Accent)

**Date-Formatting-Strategie:**
- Nutze `date-fns` für Formatierung (Tree-shakable, Lightweight)
- Format: "Jan 2020 - Dez 2024" (Monat abgekürzt, Jahr voll)
- Current Job: "Jan 2020 - Aktuell" (wenn `endDate === null`)
- Locale: German (`de`) für Monats-Namen (PRD: German UI)

**Accessibility-Requirements:**
- WCAG 2.1 Level AA Compliance
- Semantisches HTML:
  - `<section>` für ExperienceSection Container
  - `<article>` für jeden Job-Card
  - `<time>` für Zeiträume mit `dateTime` Attribut (ISO 8601)
  - `<h2>` für Section-Title ("Berufserfahrung")
  - `<h3>` für Job-Position
- ARIA-Labels:
  - Section: `aria-label="Professional Experience Timeline"`
  - Current Job: `aria-label="Current position"` (auf Job-Card)
- Keyboard-Navigation:
  - Tab zu jedem Job-Card
  - Focus-States: Tailwind `focus:ring-2`
- Screen-Reader: Timeline-Struktur wird korrekt vorgelesen ("Job 1 von 3, Position, Zeitraum, Highlights")

### Project Structure Notes

**Component-Hierarchie:**
```
apps/frontend/app/routes/index.tsx (Public Route)
└── components/sections/experience-section.tsx (ExperienceSection)
    └── components/ui/experience-card.tsx (ExperienceCard)
        ├── Date Formatting (lib/utils/date.ts)
        ├── Timeline-Dot (inline UI, keine separate Component)
        └── Highlights-Liste (Bulleted List)
```

**File-Locations:**
- **ExperienceSection:** `apps/frontend/components/sections/experience-section.tsx`
- **ExperienceCard:** `apps/frontend/components/ui/experience-card.tsx`
- **Date-Utility:** `apps/frontend/lib/utils/date.ts`
- **Route Integration:** `apps/frontend/app/routes/index.tsx`
- **Shared Types:** `packages/shared-types/src/index.ts` (PublicCV, WorkSchema)

**Styling-Konventionen:**
- Timeline-Container:
  - Border-Left: `border-l-2 border-gray-300` (vertikale Linie)
  - Padding: `pl-8` (Spacing zwischen Linie und Content)
  - Gap: Mobile = `gap-4`, Desktop = `gap-6`
- Timeline-Dots:
  - Default: `w-3 h-3 rounded-full border-2 border-blue-500 bg-white`
  - Current: `w-3 h-3 rounded-full bg-blue-500` (gefüllt)
  - Positionierung: `absolute left-[-6px]` (auf Timeline-Linie)
- Job-Card:
  - Padding: `p-4` (Mobile), `p-6` (Desktop)
  - Border-Radius: `rounded-lg` (optional, falls Card-Component)
  - Shadow: Keine (Timeline-Layout ist minimalistisch)

### Architectural Constraints

**SSR-Kompatibilität:**
- Keine Client-Only-Code in ExperienceSection initial render
- Timeline-Data wird SSR-rendered (keine Hydration-Issues)
- Date-Formatting erfolgt server-side und client-side (date-fns ist universal)
- No `window` or `localStorage` usage ohne conditional check

**Type-Safety:**
- Props-Interface mit TypeScript Strict Mode
- Runtime-Validation bereits in API-Client (`lib/api.ts`) via Zod
- Component erhält typisierte Props vom Route-Loader

**Error-Handling:**
- Fehlende `work` Array → Empty State anzeigen ("No work experience to display")
- Leere `highlights` → Job wird ohne Highlights angezeigt (Liste leer)
- Fehlende `position` → Job nicht rendern (Required Field)
- Fehlende Zeiträume → "Date not specified" anzeigen
- Invalid Date (z.B. "invalid-date-string") → Error-Handling in formatDateRange

**Testing-Strategie:**
- **Unit-Tests (Vitest):** ExperienceSection, ExperienceCard, formatDateRange
- **Accessibility-Tests:** axe-core in React Testing Library
- **Snapshot-Tests:** Visuelle Regression-Prevention
- **Integration-Tests:** E2E mit Playwright (Timeline-Rendering im Public Route)

**Performance-Optimierungen:**
- `React.memo` für ExperienceCard Component (verhindert Re-Render wenn Props gleich)
- Sortierung erfolgt einmalig (nicht bei jedem Render)
- No Animations außer optional pulsing für aktiver Job (performance-freundlich)
- Timeline-Layout mit CSS (keine JavaScript-Berechnungen)

**Privacy & Security:**
- Firmennamen bereits server-side gefiltert (Epic 2): `work[].name` = "Confidential"
- Keine sensiblen Daten in Work-Experience (nur Public-Subset)
- Detaillierte Business-Metrics sind redacted
- XSS-Prevention: React escapes automatisch
- No External API-Calls (alle Daten via SSR-Loader)

### Learnings from Previous Story

**From Story 3-7-projects-section-mit-filterung-und-projekt-cards (Status: drafted)**

Previous story not yet implemented.

### References

**Tech Spec:**
- [Source: docs/tech-spec-epic-3.md#Experience Section Component]
  - Data Model: `PublicCV['work']` Interface
  - Component Requirements: Timeline-Layout, Responsive Design, Privacy-Filtering
  - Timeline-Design: Vertikale Linie mit Dots, aktiver Job hervorgehoben
  - Date-Formatting: "MMM yyyy" Format (z.B. "Jan 2020")

**Architecture:**
- [Source: docs/architecture.md#Frontend Stack]
  - TanStack Start mit SSR
  - Tailwind CSS v4 für Styling
  - React 19 (stable)
  - shadcn/ui Components optional
  - date-fns für Date-Formatting (Tree-shakable, Lightweight)

**Epics:**
- [Source: docs/epics.md#Story 3.8]
  - Acceptance Criteria (authoritative)
  - Prerequisites: Story 3.4 (Route mit CV-Daten)
  - Affected Files: experience-section.tsx, experience-card.tsx, date.ts

**PRD:**
- [Source: docs/PRD.md#FR-1: CV-Präsentation (Öffentlich)]
  - Berufserfahrung-Section mit Timeline-Darstellung
  - Privacy-First: Generic Company-Labels ("Confidential")
  - Responsive Design (Mobile-First)
- [Source: docs/PRD.md#UX Principles]
  - Visual Personality: Professionell, modern, zugänglich
  - Microinteractions: Subtile Transitions (optional pulsing für aktiver Job)
  - Accessibility: WCAG 2.1 Level AA Compliance

**JSON Resume Schema:**
- [Source: https://jsonresume.org/schema]
  - `work[].position`: String (required)
  - `work[].startDate`: String (required) - ISO 8601 (YYYY-MM-DD)
  - `work[].endDate`: String (optional) - ISO 8601 oder null (current job)
  - `work[].highlights`: String[] (optional) - Achievements/Accomplishments

### Implementation Notes

**Component Props-Interface:**
```typescript
interface ExperienceSectionProps {
  work?: PublicCV['work'];
  variant: 'public' | 'authenticated';
}

interface ExperienceCardProps {
  job: NonNullable<PublicCV['work']>[number];
  variant: 'public' | 'authenticated';
}
```

**Date Formatting Utility (Beispiel):**
```typescript
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function formatDateRange(
  startDate: string,
  endDate?: string | null
): string {
  try {
    const start = format(new Date(startDate), 'MMM yyyy', { locale: de });

    if (!endDate) {
      return `${start} - Aktuell`;
    }

    const end = format(new Date(endDate), 'MMM yyyy', { locale: de });
    return `${start} - ${end}`;
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Date not specified';
  }
}
```

**Timeline-Sortierung (Beispiel):**
```typescript
const ExperienceSection: React.FC<ExperienceSectionProps> = ({ work = [], variant }) => {
  // Sort chronologically (newest first)
  const sortedWork = useMemo(() => {
    return [...work].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA; // Newest first
    });
  }, [work]);

  if (work.length === 0) {
    return (
      <section className="experience-section">
        <p>No work experience to display.</p>
      </section>
    );
  }

  return (
    <section className="experience-section" aria-label="Professional Experience Timeline">
      <h2 className="text-3xl font-bold mb-8">Berufserfahrung</h2>

      <div className="timeline-container border-l-2 border-gray-300 pl-8 space-y-6">
        {sortedWork.map((job, index) => (
          <ExperienceCard key={index} job={job} variant={variant} />
        ))}
      </div>
    </section>
  );
};
```

**ExperienceCard Component (Beispiel):**
```typescript
const ExperienceCard: React.FC<ExperienceCardProps> = ({ job, variant }) => {
  const isCurrent = !job.endDate; // Current job if endDate is null

  return (
    <article className="experience-card relative">
      {/* Timeline Dot */}
      <div
        className={`absolute left-[-38px] top-2 w-3 h-3 rounded-full border-2 border-blue-500 ${
          isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-white'
        }`}
        aria-label={isCurrent ? 'Current position' : undefined}
      />

      {/* Job Content */}
      <div className="job-content">
        <h3 className="text-xl font-semibold mb-1">{job.position}</h3>

        <p className="text-gray-600 text-sm mb-2">
          {job.name || 'Confidential'} • {' '}
          <time dateTime={job.startDate}>
            {formatDateRange(job.startDate, job.endDate)}
          </time>
        </p>

        {job.summary && (
          <p className="text-gray-700 mb-3">{job.summary}</p>
        )}

        {job.highlights && job.highlights.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {job.highlights.slice(0, 5).map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};
```

**Testing-Strategie (Details):**
```typescript
// Unit-Test Beispiel (Vitest + React Testing Library)
describe('ExperienceSection', () => {
  test('renders work experience timeline', () => {
    const work = [
      {
        position: 'Senior Engineer',
        name: 'Confidential',
        startDate: '2020-01-01',
        highlights: ['Achievement 1', 'Achievement 2'],
      },
    ];
    render(<ExperienceSection work={work} variant="public" />);
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByText('Confidential')).toBeInTheDocument();
  });

  test('sorts jobs chronologically (newest first)', () => {
    const work = [
      { position: 'Old Job', startDate: '2018-01-01' },
      { position: 'New Job', startDate: '2024-01-01' },
    ];
    const { container } = render(<ExperienceSection work={work} variant="public" />);

    const cards = container.querySelectorAll('.experience-card');
    expect(cards[0]).toHaveTextContent('New Job');
    expect(cards[1]).toHaveTextContent('Old Job');
  });

  test('highlights current job', () => {
    const work = [
      {
        position: 'Current Job',
        startDate: '2023-01-01',
        endDate: null, // Current job
      },
    ];
    render(<ExperienceSection work={work} variant="public" />);

    // Check for "Aktuell" label
    expect(screen.getByText(/Aktuell/)).toBeInTheDocument();

    // Check for current job styling (aria-label)
    const currentDot = screen.getByLabelText('Current position');
    expect(currentDot).toBeInTheDocument();
  });

  test('handles empty work array', () => {
    render(<ExperienceSection work={[]} variant="public" />);
    expect(screen.getByText('No work experience to display.')).toBeInTheDocument();
  });
});

// Date Formatting Test
describe('formatDateRange', () => {
  test('formats date range correctly', () => {
    const result = formatDateRange('2020-01-15', '2024-12-31');
    expect(result).toMatch(/Jan 2020 - Dez 2024/);
  });

  test('handles current job (no endDate)', () => {
    const result = formatDateRange('2023-05-01', null);
    expect(result).toMatch(/Mai 2023 - Aktuell/);
  });

  test('handles invalid dates gracefully', () => {
    const result = formatDateRange('invalid-date', '2024-01-01');
    expect(result).toBe('Date not specified');
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
