# Story 3.9: Education und Volunteering Sections

Status: drafted

## Story

Als Benutzer der öffentlichen CV-Seite,
möchte ich Education und Volunteering Sections sehen, die strukturiert meinen Bildungsweg und Ehrenamt darstellen,
damit ich ein vollständiges Bild meiner Qualifikationen und meines gesellschaftlichen Engagements erhalte.

## Acceptance Criteria

1. **AC-1:** EducationSection Component rendert `cv.education[]` als Cards oder Liste mit klarer visueller Hierarchie
2. **AC-2:** Jede Education-Entry zeigt: Institution, Studiengang (area), Abschluss (studyType), Zeitraum (Start-/Enddatum), optional GPA/Score
3. **AC-3:** VolunteeringSection Component rendert `cv.volunteer[]` (falls vorhanden, sonst Section nicht anzeigen)
4. **AC-4:** Volunteering-Entry zeigt: Organisation, Rolle (position), Zeitraum, Beschreibung (summary), optional Highlights
5. **AC-5:** Responsive Layout: Mobile = Cards vertikal gestapelt (1-Spalte), Desktop = Grid (2 Spalten mit gap-6)
6. **AC-6:** Optional: Icons für Institutionstyp (Universität, Online-Kurs) via shadcn/ui Icons oder Lucide
7. **AC-7:** Accessibility: Semantisches HTML (`<section>`, `<article>` pro Card, `<time>` für Zeiträume), ARIA-Labels für Section-Headings, Keyboard-Navigation

## Tasks / Subtasks

- [ ] **Task 1: EducationSection Component Grundstruktur** (AC: #1, #5, #7)
  - [ ] 1.1: Erstelle `apps/frontend/components/sections/education-section.tsx` mit TypeScript
  - [ ] 1.2: Definiere Props-Interface `EducationSectionProps { education?: PublicCV['education']; }`
  - [ ] 1.3: Implementiere responsive Container-Layout: Mobile = 1-Spalte Stack, Desktop = 2-Spalten Grid (`grid grid-cols-1 md:grid-cols-2 gap-6`)
  - [ ] 1.4: Sortiere `education` Array chronologisch (neueste zuerst): `education.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))`
  - [ ] 1.5: Rendere Section mit H2-Heading "Bildungsweg" und ARIA-Label `aria-label="Education History"`
  - [ ] 1.6: Handle Empty-State: Wenn `education` undefined oder leer → Section nicht rendern
  - [ ] 1.7: Teste Component isoliert mit React Testing Library (verschiedene Data-Szenarien)

- [ ] **Task 2: EducationCard UI Component** (AC: #2, #6)
  - [ ] 2.1: Erstelle `apps/frontend/components/ui/education-card.tsx` mit TypeScript
  - [ ] 2.2: Definiere Props-Interface: `EducationCardProps { entry: NonNullable<PublicCV['education']>[number]; }`
  - [ ] 2.3: Implementiere Card-Layout mit shadcn/ui Card Component oder Custom Card
  - [ ] 2.4: Rendere Education-Details:
    - Institution Name (H3, bold, prominent)
    - Studiengang/Area (text-lg, muted)
    - Abschluss/StudyType (text-sm, badge-style optional)
    - Zeitraum: formatiert mit date-fns (`formatDateRange` util aus Story 3.8)
    - Optional: GPA/Score (falls vorhanden, text-sm, badge)
  - [ ] 2.5: Optional: Institution-Icon (Lucide `GraduationCap` oder `BookOpen`) links oder oben im Card
  - [ ] 2.6: Optional: Courses-Liste anzeigen (falls `entry.courses` vorhanden): Collapsible List oder inline Tags
  - [ ] 2.7: Schreibe Unit-Tests für EducationCard Component (verschiedene Entry-Szenarien)

- [ ] **Task 3: VolunteeringSection Component Grundstruktur** (AC: #3, #5, #7)
  - [ ] 3.1: Erstelle `apps/frontend/components/sections/volunteering-section.tsx` mit TypeScript
  - [ ] 3.2: Definiere Props-Interface `VolunteeringSectionProps { volunteer?: PublicCV['volunteer']; }`
  - [ ] 3.3: Implementiere responsive Container-Layout: Mobile = 1-Spalte Stack, Desktop = 2-Spalten Grid
  - [ ] 3.4: Sortiere `volunteer` Array chronologisch (neueste zuerst)
  - [ ] 3.5: Rendere Section mit H2-Heading "Ehrenamt" und ARIA-Label `aria-label="Volunteer Experience"`
  - [ ] 3.6: Handle Empty-State: Wenn `volunteer` undefined oder leer → Section nicht rendern
  - [ ] 3.7: Teste Component isoliert mit React Testing Library

- [ ] **Task 4: VolunteeringCard UI Component** (AC: #4)
  - [ ] 4.1: Erstelle `apps/frontend/components/ui/volunteering-card.tsx` mit TypeScript
  - [ ] 4.2: Definiere Props-Interface: `VolunteeringCardProps { entry: NonNullable<PublicCV['volunteer']>[number]; }`
  - [ ] 4.3: Implementiere Card-Layout ähnlich EducationCard
  - [ ] 4.4: Rendere Volunteering-Details:
    - Organisation Name (H3, bold)
    - Position/Rolle (text-lg, muted)
    - Zeitraum: formatiert mit date-fns
    - Summary/Beschreibung (text-sm, paragraph)
    - Optional: Highlights-Liste (bullets, max 3-5 items)
  - [ ] 4.5: Optional: Volunteering-Icon (Lucide `Heart` oder `Users`) im Card
  - [ ] 4.6: Schreibe Unit-Tests für VolunteeringCard Component

- [ ] **Task 5: Date Formatting Utility Re-Use** (AC: #2, #4)
  - [ ] 5.1: Verifiziere `formatDateRange` Utility existiert in `lib/utils/date.ts` (aus Story 3.8)
  - [ ] 5.2: Nutze `formatDateRange(startDate: string, endDate?: string | null): string` für Education und Volunteering
  - [ ] 5.3: Formatierung: `startDate` → "Jan 2020", `endDate` → "Dez 2024" oder "Aktuell" falls null/undefined
  - [ ] 5.4: Falls Utility noch nicht existiert: Erstelle es analog zu Story 3.8 Spezifikation
  - [ ] 5.5: Handle Edge-Cases: Fehlende Daten → "Date not specified", Invalid Date → Error-Handling

- [ ] **Task 6: Accessibility Implementation** (AC: #7)
  - [ ] 6.1: Semantisches HTML: `<section>` für beide Sections, `<article>` für jede Card
  - [ ] 6.2: `<time>` Elements für Zeiträume mit `dateTime` Attribut (ISO 8601 Format)
  - [ ] 6.3: ARIA-Labels:
    - EducationSection: `aria-label="Education History"`
    - VolunteeringSection: `aria-label="Volunteer Experience"`
  - [ ] 6.4: Heading-Hierarchie: H2 für Section-Titles, H3 für Entry-Titles (Institution/Organisation)
  - [ ] 6.5: Keyboard-Navigation: Cards sind navigierbar via Tab (wenn interaktiv, sonst kein Fokus erforderlich)
  - [ ] 6.6: Screen-Reader-Test: Verifiziere korrekte Vorlesung der Section-Struktur

- [ ] **Task 7: Responsive Design Implementation** (AC: #5)
  - [ ] 7.1: Mobile Layout (<768px):
    - Cards vertikal gestapelt (1-Spalte, volle Breite)
    - Spacing: gap-4 zwischen Cards
    - Padding: p-4 pro Card
  - [ ] 7.2: Desktop Layout (>=768px):
    - 2-Spalten Grid: `grid grid-cols-1 md:grid-cols-2`
    - Spacing: gap-6 zwischen Cards
    - Padding: p-6 pro Card
  - [ ] 7.3: Large Desktop (>=1024px):
    - Optional: Max-Width constraint auf Container (z.B. max-w-7xl mx-auto)
  - [ ] 7.4: Test responsive Breakpoints: 320px (Mobile), 768px (Tablet), 1024px (Desktop)

- [ ] **Task 8: Integration in Public Route** (AC: #1, #3)
  - [ ] 8.1: Importiere EducationSection in `apps/frontend/app/routes/index.tsx`
  - [ ] 8.2: Importiere VolunteeringSection in `apps/frontend/app/routes/index.tsx`
  - [ ] 8.3: Übergebe `cv.education` als Props von Route-Loader-Daten
  - [ ] 8.4: Übergebe `cv.volunteer` als Props von Route-Loader-Daten
  - [ ] 8.5: Positioniere Sections nach ExperienceSection im PublicLayout:
    - Reihenfolge: Hero → Skills → Projects → Experience → **Education** → **Volunteering**
  - [ ] 8.6: Teste Integration: SSR rendert beide Sections korrekt (keine Client-Only-Code-Fehler)
  - [ ] 8.7: Validiere: Data wird korrekt aus API-Response übernommen

- [ ] **Task 9: Component Testing** (AC: alle)
  - [ ] 9.1: Schreibe Unit-Tests für EducationSection Component (Vitest + React Testing Library)
  - [ ] 9.2: Schreibe Unit-Tests für EducationCard Component (verschiedene Entry-Szenarien)
  - [ ] 9.3: Schreibe Unit-Tests für VolunteeringSection Component
  - [ ] 9.4: Schreibe Unit-Tests für VolunteeringCard Component
  - [ ] 9.5: Teste Sortierung: Entries in chronologischer Reihenfolge (neueste zuerst)
  - [ ] 9.6: Teste Empty-States: Keine Education/Volunteer-Data → Sections nicht gerendert
  - [ ] 9.7: Teste Edge-Cases: Fehlende optional Fields (GPA, Courses, Highlights)
  - [ ] 9.8: Snapshot-Tests für visuelle Regression-Prevention

- [ ] **Task 10: Accessibility Testing** (AC: #7)
  - [ ] 10.1: Teste Keyboard-Navigation: Tab zu jedem Card funktioniert (falls interaktiv)
  - [ ] 10.2: Teste Screen-Reader (NVDA/JAWS): Section-Struktur korrekt vorgelesen
  - [ ] 10.3: Validiere Farb-Kontraste für Text (WCAG AA: ≥4.5:1 für Normal-Text)
  - [ ] 10.4: Teste ARIA-Labels: Screen-Reader announced "Education History" und "Volunteer Experience"
  - [ ] 10.5: Teste semantisches HTML: `<article>`, `<time>` Elements korrekt verwendet

## Dev Notes

### Tech Stack & Patterns

**Frontend-Framework:**
- React 19 (stable) mit TypeScript (strict mode)
- TanStack Start mit Server-Side Rendering (SSR)
- Tailwind CSS v4 für Utility-first Styling
- shadcn/ui Components optional (Card-Base, Icons)

**Data Model:**
- Props basieren auf `PublicCV['education']` und `PublicCV['volunteer']` Types aus `@cv-hub/shared-types`
- Education-Interface (JSON Resume Schema):
  ```typescript
  interface Education {
    institution: string;            // "Universität Berlin"
    area?: string;                  // "Computer Science"
    studyType?: string;             // "Bachelor of Science"
    startDate?: string;             // ISO 8601 (YYYY-MM-DD)
    endDate?: string | null;        // ISO 8601 oder null (laufend)
    score?: string;                 // "3.8 GPA" oder "1.5" (German grading)
    courses?: string[];             // Optional: Liste von Kursen
  }
  ```
- Volunteer-Interface (JSON Resume Schema):
  ```typescript
  interface Volunteer {
    organization: string;           // "Deutsche Tafel"
    position: string;               // "Freiwilliger Helfer"
    startDate?: string;             // ISO 8601
    endDate?: string | null;        // ISO 8601 oder null (ongoing)
    summary?: string;               // Beschreibung der Tätigkeit
    highlights?: string[];          // Achievements (max. 3-5 anzeigen)
  }
  ```
- Sortierung: Neueste Entries zuerst (`education.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))`)

**Card-Design-Strategie:**
- **Layout:** shadcn/ui Card Component ODER Custom Card mit Tailwind
- **Card-Structure:**
  - Header: Institution/Organisation Name (H3, bold)
  - Subheader: Area/Position (text-lg, muted)
  - Meta: Zeitraum (text-sm, date-fns formatted)
  - Content: Summary/Beschreibung (paragraph)
  - Optional: Badges für studyType, Score, oder Highlights
- **Responsive-Strategie:**
  - Mobile: 1-Spalte Stack (volle Breite, gap-4)
  - Desktop: 2-Spalten Grid (gap-6)
- **Color-Scheme:** Neutral (gray-50 Card background, blue-500 Accent für Links/Icons)

**Date-Formatting-Strategie:**
- Re-Use `formatDateRange` Utility aus Story 3.8 (falls existiert)
- Falls nicht existiert: Implementiere analog zu Story 3.8:
  - Nutze `date-fns` für Formatierung (Tree-shakable, Lightweight)
  - Format: "Jan 2020 - Dez 2024" (Monat abgekürzt, Jahr voll)
  - Ongoing/Current: "Jan 2020 - Aktuell" (wenn `endDate === null`)
  - Locale: German (`de`) für Monats-Namen (PRD: German UI)

**Icons-Strategy (Optional):**
- Lucide Icons via shadcn/ui:
  - Education: `GraduationCap`, `BookOpen`, `School`
  - Volunteering: `Heart`, `Users`, `Handshake`
- Icons positioniert: Links im Card-Header oder top-left
- Size: 24x24px (w-6 h-6), Color: text-blue-500 oder text-muted

**Accessibility-Requirements:**
- WCAG 2.1 Level AA Compliance
- Semantisches HTML:
  - `<section>` für Section-Container
  - `<article>` für jede Education/Volunteer Card
  - `<time>` für Zeiträume mit `dateTime` Attribut (ISO 8601)
  - `<h2>` für Section-Titles ("Bildungsweg", "Ehrenamt")
  - `<h3>` für Entry-Titles (Institution/Organisation)
- ARIA-Labels:
  - EducationSection: `aria-label="Education History"`
  - VolunteeringSection: `aria-label="Volunteer Experience"`
- Keyboard-Navigation:
  - Cards sollten nicht fokussierbar sein (wenn nicht interaktiv)
  - Falls Links in Cards: Tab zu Links funktioniert
- Screen-Reader: Section-Struktur wird korrekt vorgelesen ("Education 1 of 3, Institution, Zeitraum")

### Project Structure Notes

**Component-Hierarchie:**
```
apps/frontend/app/routes/index.tsx (Public Route)
├── components/sections/education-section.tsx (EducationSection)
│   └── components/ui/education-card.tsx (EducationCard)
│       └── Date Formatting (lib/utils/date.ts - re-use from Story 3.8)
└── components/sections/volunteering-section.tsx (VolunteeringSection)
    └── components/ui/volunteering-card.tsx (VolunteeringCard)
        └── Date Formatting (lib/utils/date.ts)
```

**File-Locations:**
- **EducationSection:** `apps/frontend/components/sections/education-section.tsx`
- **EducationCard:** `apps/frontend/components/ui/education-card.tsx`
- **VolunteeringSection:** `apps/frontend/components/sections/volunteering-section.tsx`
- **VolunteeringCard:** `apps/frontend/components/ui/volunteering-card.tsx`
- **Date-Utility:** `apps/frontend/lib/utils/date.ts` (bereits existiert aus Story 3.8 oder neu erstellen)
- **Route Integration:** `apps/frontend/app/routes/index.tsx`
- **Shared Types:** `packages/shared-types/src/index.ts` (PublicCV, EducationSchema, VolunteerSchema)

**Styling-Konventionen:**
- Section-Container:
  - Padding: `px-4 md:px-8 py-12`
  - Max-Width: `max-w-7xl mx-auto` (optional, Large Desktop)
  - Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Cards:
  - Background: `bg-white` oder `bg-gray-50` (Light Mode)
  - Border: `border border-gray-200 rounded-lg`
  - Padding: Mobile = `p-4`, Desktop = `p-6`
  - Shadow: `shadow-sm hover:shadow-md transition-shadow` (optional, subtil)
- Section-Heading:
  - Font: `text-3xl font-bold mb-8`
  - Color: `text-gray-900` (High Contrast)
- Card-Title (Institution/Organisation):
  - Font: `text-xl font-semibold mb-2`
  - Color: `text-gray-900`
- Card-Subtitle (Area/Position):
  - Font: `text-lg text-gray-600 mb-1`
- Zeitraum:
  - Font: `text-sm text-gray-500`
  - Format: "Jan 2020 - Dez 2024"

### Architectural Constraints

**SSR-Kompatibilität:**
- Keine Client-Only-Code in EducationSection/VolunteeringSection initial render
- Data wird SSR-rendered (keine Hydration-Issues)
- Date-Formatting erfolgt server-side und client-side (date-fns ist universal)
- No `window` or `localStorage` usage ohne conditional check

**Type-Safety:**
- Props-Interface mit TypeScript Strict Mode
- Runtime-Validation bereits in API-Client (`lib/api.ts`) via Zod
- Components erhalten typisierte Props vom Route-Loader

**Error-Handling:**
- Fehlende `education` oder `volunteer` Arrays → Sections nicht rendern (Empty State)
- Leere Arrays → Sections nicht rendern
- Fehlende optional Fields (GPA, Courses, Highlights) → Einfach nicht anzeigen
- Fehlende Required Fields (Institution, Organisation) → Entry nicht rendern (Skip)
- Fehlende Zeiträume → "Date not specified" anzeigen

**Testing-Strategie:**
- **Unit-Tests (Vitest):** EducationSection, EducationCard, VolunteeringSection, VolunteeringCard, formatDateRange
- **Accessibility-Tests:** axe-core in React Testing Library
- **Snapshot-Tests:** Visuelle Regression-Prevention
- **Integration-Tests:** E2E mit Playwright (Education/Volunteering-Rendering im Public Route)

**Performance-Optimierungen:**
- `React.memo` für EducationCard und VolunteeringCard Components (verhindert Re-Render wenn Props gleich)
- Sortierung erfolgt einmalig (nicht bei jedem Render)
- No Heavy Animations (nur subtile Hover-Transitions via Tailwind)
- Layout mit CSS Grid (keine JavaScript-Berechnungen)

**Privacy & Security:**
- Education und Volunteer-Daten bereits server-side gefiltert (Epic 2)
- Keine sensiblen Daten in Public Subset
- XSS-Prevention: React escapes automatisch
- No External API-Calls (alle Daten via SSR-Loader)

### Learnings from Previous Story

**From Story 3-8-experience-timeline-component (Status: drafted)**

Previous story not yet implemented.

### References

**Tech Spec:**
- [Source: docs/tech-spec-epic-3.md#Education Section Component]
  - Data Model: `PublicCV['education']` Interface (JSON Resume Schema)
  - Component Requirements: Card-Layout, Responsive Design, Accessibility
- [Source: docs/tech-spec-epic-3.md#Data Models]
  - Education Schema: institution, area, studyType, startDate, endDate, score, courses
  - Volunteer Schema: organization, position, startDate, endDate, summary, highlights

**Architecture:**
- [Source: docs/architecture.md#Frontend Stack]
  - TanStack Start mit SSR
  - Tailwind CSS v4 für Styling
  - React 19 (stable)
  - shadcn/ui Components optional
  - date-fns für Date-Formatting (Tree-shakable, Lightweight)

**Epics:**
- [Source: docs/epics.md#Story 3.9]
  - Acceptance Criteria (authoritative)
  - Prerequisites: Story 3.4 (Route mit CV-Daten)
  - Affected Files: education-section.tsx, volunteering-section.tsx, education-card.tsx

**PRD:**
- [Source: docs/PRD.md#FR-1: CV-Präsentation (Öffentlich)]
  - Bildung und Ehrenamt als Teil der vollständigen CV-Darstellung
  - Responsive Design (Mobile-First)
- [Source: docs/PRD.md#UX Principles]
  - Visual Personality: Professionell, modern, zugänglich
  - Microinteractions: Subtile Transitions (Hover-Effects)
  - Accessibility: WCAG 2.1 Level AA Compliance

**JSON Resume Schema:**
- [Source: https://jsonresume.org/schema]
  - `education[].institution`: String (required)
  - `education[].area`: String (optional) - Field of study
  - `education[].studyType`: String (optional) - Degree type
  - `education[].startDate`: String (optional) - ISO 8601
  - `education[].endDate`: String (optional) - ISO 8601
  - `volunteer[].organization`: String (required)
  - `volunteer[].position`: String (required)
  - `volunteer[].startDate`: String (optional) - ISO 8601
  - `volunteer[].endDate`: String (optional) - ISO 8601

### Implementation Notes

**Component Props-Interface:**
```typescript
interface EducationSectionProps {
  education?: PublicCV['education'];
}

interface EducationCardProps {
  entry: NonNullable<PublicCV['education']>[number];
}

interface VolunteeringSectionProps {
  volunteer?: PublicCV['volunteer'];
}

interface VolunteeringCardProps {
  entry: NonNullable<PublicCV['volunteer']>[number];
}
```

**Date Formatting Utility (Re-Use or Create):**
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

**EducationSection Component (Beispiel):**
```typescript
const EducationSection: React.FC<EducationSectionProps> = ({ education = [] }) => {
  // Sort chronologically (newest first)
  const sortedEducation = useMemo(() => {
    return [...education].sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateB - dateA; // Newest first
    });
  }, [education]);

  if (education.length === 0) {
    return null; // Don't render section if no education data
  }

  return (
    <section className="education-section px-4 md:px-8 py-12 max-w-7xl mx-auto" aria-label="Education History">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Bildungsweg</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedEducation.map((entry, index) => (
          <EducationCard key={index} entry={entry} />
        ))}
      </div>
    </section>
  );
};
```

**EducationCard Component (Beispiel):**
```typescript
const EducationCard: React.FC<EducationCardProps> = ({ entry }) => {
  return (
    <article className="education-card bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Optional: Icon */}
        <GraduationCap className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />

        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1 text-gray-900">{entry.institution}</h3>

          {entry.area && (
            <p className="text-lg text-gray-600 mb-1">{entry.area}</p>
          )}

          {entry.studyType && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded mb-2">
              {entry.studyType}
            </span>
          )}

          {(entry.startDate || entry.endDate) && (
            <p className="text-sm text-gray-500 mb-2">
              <time dateTime={entry.startDate}>
                {formatDateRange(entry.startDate, entry.endDate)}
              </time>
            </p>
          )}

          {entry.score && (
            <p className="text-sm text-gray-600">
              <strong>Note/GPA:</strong> {entry.score}
            </p>
          )}

          {entry.courses && entry.courses.length > 0 && (
            <details className="mt-3">
              <summary className="text-sm text-blue-600 cursor-pointer hover:underline">
                Kurse ({entry.courses.length})
              </summary>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                {entry.courses.map((course, i) => (
                  <li key={i}>{course}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </article>
  );
};
```

**VolunteeringSection Component (Beispiel):**
```typescript
const VolunteeringSection: React.FC<VolunteeringSectionProps> = ({ volunteer = [] }) => {
  const sortedVolunteer = useMemo(() => {
    return [...volunteer].sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateB - dateA;
    });
  }, [volunteer]);

  if (volunteer.length === 0) {
    return null;
  }

  return (
    <section className="volunteering-section px-4 md:px-8 py-12 max-w-7xl mx-auto" aria-label="Volunteer Experience">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Ehrenamt</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedVolunteer.map((entry, index) => (
          <VolunteeringCard key={index} entry={entry} />
        ))}
      </div>
    </section>
  );
};
```

**Testing-Strategie (Details):**
```typescript
// Unit-Test Beispiel (Vitest + React Testing Library)
describe('EducationSection', () => {
  test('renders education entries', () => {
    const education = [
      {
        institution: 'Universität Berlin',
        area: 'Computer Science',
        studyType: 'Bachelor of Science',
        startDate: '2018-09-01',
        endDate: '2022-06-30',
        score: '1.5',
      },
    ];
    render(<EducationSection education={education} />);
    expect(screen.getByText('Universität Berlin')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
  });

  test('sorts entries chronologically (newest first)', () => {
    const education = [
      { institution: 'Old University', startDate: '2015-09-01', endDate: '2018-06-30' },
      { institution: 'New University', startDate: '2020-09-01' },
    ];
    const { container } = render(<EducationSection education={education} />);

    const cards = container.querySelectorAll('.education-card');
    expect(cards[0]).toHaveTextContent('New University');
    expect(cards[1]).toHaveTextContent('Old University');
  });

  test('handles empty education array', () => {
    const { container } = render(<EducationSection education={[]} />);
    expect(container.querySelector('.education-section')).not.toBeInTheDocument();
  });
});

// VolunteeringSection Test
describe('VolunteeringSection', () => {
  test('renders volunteer entries', () => {
    const volunteer = [
      {
        organization: 'Deutsche Tafel',
        position: 'Freiwilliger Helfer',
        startDate: '2020-01-01',
        summary: 'Helfe regelmäßig bei der Essensausgabe.',
      },
    ];
    render(<VolunteeringSection volunteer={volunteer} />);
    expect(screen.getByText('Deutsche Tafel')).toBeInTheDocument();
    expect(screen.getByText('Freiwilliger Helfer')).toBeInTheDocument();
  });

  test('does not render section if volunteer array empty', () => {
    const { container } = render(<VolunteeringSection volunteer={[]} />);
    expect(container.querySelector('.volunteering-section')).not.toBeInTheDocument();
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
