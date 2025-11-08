# Story 3.5: Hero Section Component mit Basics-Daten

Status: drafted

## Story

Als Entwickler,
möchte ich eine Hero Section Component entwickeln, die den Namen, Berufstitel, Bio-Summary und Social-Media-Links aus den CV-Basics-Daten anzeigt,
damit die öffentliche CV-Seite eine professionelle und einladende Kopfzeile erhält.

## Acceptance Criteria

1. **AC-1:** HeroSection Component rendert `basics.name` als H1-Element
2. **AC-2:** `basics.label` wird als Tagline/Subtitle prominent angezeigt (z.B. "Senior Full-Stack Engineer")
3. **AC-3:** `basics.summary` (Bio) wird in maximal 2-3 Sätzen angezeigt
4. **AC-4:** Social-Links (`basics.profiles`) rendern als Icon-Links für GitHub, LinkedIn, Twitter
5. **AC-5:** Optional: Avatar-Bild (`basics.image`) wird angezeigt mit Fallback bei fehlendem Bild
6. **AC-6:** Responsive Design: Mobile = vertikal gestapelt, Desktop = horizontal mit Avatar links/rechts
7. **AC-7:** Accessibility: ARIA-Labels für Social-Links ("Visit GitHub Profile"), Alt-Text für Avatar-Bild

## Tasks / Subtasks

- [ ] **Task 1: Hero Section Component erstellen** (AC: #1, #2, #3, #6)
  - [ ] 1.1: Erstelle `apps/frontend/components/sections/hero-section.tsx` mit TypeScript und React 19
  - [ ] 1.2: Definiere Props-Interface `HeroSectionProps` mit Type `PublicCV['basics']`
  - [ ] 1.3: Implementiere responsive Layout mit Tailwind CSS (mobile: flex-col, desktop: flex-row)
  - [ ] 1.4: Rendere `basics.name` als H1 mit semantischem HTML
  - [ ] 1.5: Rendere `basics.label` als Subtitle/Tagline
  - [ ] 1.6: Rendere `basics.summary` mit Textlängen-Validierung (maximal 3 Sätze)
  - [ ] 1.7: Teste Component isoliert mit React Testing Library

- [ ] **Task 2: Social Link UI Component** (AC: #4, #7)
  - [ ] 2.1: Erstelle `apps/frontend/components/ui/social-link.tsx` als wiederverwendbare Component
  - [ ] 2.2: Definiere Props-Interface mit `network`, `username`, `url`
  - [ ] 2.3: Implementiere Icon-Rendering basierend auf Network-Type (GitHub, LinkedIn, Twitter)
  - [ ] 2.4: Füge ARIA-Labels hinzu (z.B. `aria-label="Visit {network} Profile"`)
  - [ ] 2.5: Style Links mit shadcn/ui Button-Variante oder custom Tailwind-Styles
  - [ ] 2.6: Implementiere Hover-States und Focus-States (WCAG AA)
  - [ ] 2.7: Teste Component Unit-Tests (Props, Icon-Rendering, Accessibility)

- [ ] **Task 3: Avatar-Bild Integration (Optional)** (AC: #5, #6)
  - [ ] 3.1: Füge Avatar-Rendering zur HeroSection hinzu (`basics.image` wenn vorhanden)
  - [ ] 3.2: Implementiere Fallback (Placeholder oder Initialen) bei fehlendem Bild
  - [ ] 3.3: Optimiere Bild-Rendering (WebP, lazy loading, srcset für responsive)
  - [ ] 3.4: Füge Alt-Text hinzu (`basics.name` als Alt-Text)
  - [ ] 3.5: Style Avatar mit runden Ecken, Schatten (Tailwind)

- [ ] **Task 4: Integration in Public Route** (AC: alle)
  - [ ] 4.1: Importiere HeroSection in `apps/frontend/app/routes/index.tsx`
  - [ ] 4.2: Übergebe `cv.basics` als Props von Route-Loader-Daten
  - [ ] 4.3: Positioniere HeroSection als erste Section im PublicLayout
  - [ ] 4.4: Teste Integration: SSR rendert Hero-Section korrekt

- [ ] **Task 5: Accessibility & Responsive Testing** (AC: #6, #7)
  - [ ] 5.1: Teste Keyboard-Navigation (Tab-Order, Focus-States)
  - [ ] 5.2: Teste Screen-Reader (NVDA/JAWS) mit korrekten ARIA-Labels
  - [ ] 5.3: Validiere Farb-Kontraste (WCAG AA: mindestens 4.5:1)
  - [ ] 5.4: Teste responsive Breakpoints (320px, 768px, 1024px, 1440px)
  - [ ] 5.5: Validiere Touch-Targets (mindestens 44x44px für Mobile)

- [ ] **Task 6: Component Testing** (AC: alle)
  - [ ] 6.1: Schreibe Unit-Tests für HeroSection (Vitest + React Testing Library)
  - [ ] 6.2: Schreibe Unit-Tests für SocialLink Component
  - [ ] 6.3: Teste verschiedene Daten-Szenarien (mit/ohne Avatar, mit/ohne Summary)
  - [ ] 6.4: Teste Error-States (fehlende Required-Props)
  - [ ] 6.5: Snapshot-Tests für visuelle Regression-Prevention

## Dev Notes

### Tech Stack & Patterns

**Frontend-Framework:**
- React 19 (stable) mit TypeScript (strict mode)
- TanStack Start mit Server-Side Rendering (SSR)
- Tailwind CSS v4 für Utility-first Styling
- shadcn/ui Components für accessible UI-Patterns

**Data Model:**
- Props basieren auf `PublicCV['basics']` Type aus `@cv-hub/shared-types`
- Zod-Schema-Validation zur Runtime (API-Response)
- JSON Resume Schema als Datengrundlage

**Responsive Design-Strategie:**
- Mobile-First Approach (Tailwind-Breakpoints: sm, md, lg, xl)
- Flexbox-Layout: `flex-col` (Mobile), `flex-row` (Desktop)
- Avatar-Position: links (Desktop), oben (Mobile)
- Social-Links: horizontal gestapelt mit wrap

**Accessibility-Requirements:**
- WCAG 2.1 Level AA Compliance
- Semantisches HTML: `<header>` für HeroSection, `<h1>` für Name
- ARIA-Labels für Social-Links: `aria-label="Visit {network} Profile"`
- Alt-Text für Avatar: `alt={basics.name}`
- Focus-States: Tailwind `focus:ring-2` für Links
- Keyboard-Navigation: Alle Social-Links via Tab erreichbar

**Icon-Handling:**
- Icons für Social-Links: shadcn/ui `lucide-react` Icons (GitHub, LinkedIn, Twitter)
- Fallback für unbekannte Networks: Generic Link-Icon
- Icon-Größe: 24x24px (Desktop), 20x20px (Mobile)

**Performance-Optimierungen:**
- Avatar-Bilder: WebP-Format, lazy loading (`loading="lazy"`)
- Responsive Images: srcset für verschiedene Viewports
- No Client-Side API-Calls (Daten via SSR-Loader)

### Project Structure Notes

**Component-Hierarchie:**
```
apps/frontend/app/routes/index.tsx (Public Route)
└── components/layouts/public-layout.tsx (Layout)
    └── components/sections/hero-section.tsx (HeroSection)
        └── components/ui/social-link.tsx (SocialLink)
```

**File-Locations:**
- **HeroSection:** `apps/frontend/components/sections/hero-section.tsx`
- **SocialLink:** `apps/frontend/components/ui/social-link.tsx`
- **Route Integration:** `apps/frontend/app/routes/index.tsx`
- **Shared Types:** `packages/shared-types/src/index.ts` (PublicCV Type)

**Styling-Konventionen:**
- Tailwind-Klassen direkt in JSX (Utility-first)
- shadcn/ui-Komponenten für Buttons (falls genutzt)
- CSS-Variablen für Theme-Colors (Tailwind-Config)
- No external CSS-Files (außer globals.css für Tailwind Base)

### Architectural Constraints

**SSR-Kompatibilität:**
- Keine Client-Only-Code in HeroSection (z.B. `window`, `localStorage`)
- Falls Client-Side-Logik nötig: `useEffect` oder `use client` Directive
- Server-Side Rendering erzeugt vollständiges HTML (kein Loading-Spinner initial)

**Type-Safety:**
- Props-Interface mit TypeScript Strict Mode
- Runtime-Validation erfolgt bereits in API-Client (`lib/api.ts`) via Zod
- Component erhält typisierte Props vom Route-Loader

**Error-Handling:**
- Fehlende `basics.name` sollte Error werfen (Required Field)
- Fehlende `basics.label` oder `basics.summary` → Fallback zu leeren Strings
- Fehlende `basics.profiles` → Keine Social-Links rendern (conditional rendering)
- Fehlende `basics.image` → Avatar nicht anzeigen ODER Fallback-Placeholder

**Testing-Strategie:**
- **Unit-Tests (Vitest):** Component-Logik, Props-Handling, Conditional Rendering
- **Accessibility-Tests:** axe-core in React Testing Library
- **Snapshot-Tests:** Visuelle Regression-Prevention
- **Integration-Tests:** Route-Integration (in Story 3.4 getestet)

**Privacy & Security:**
- Keine sensiblen Daten in Hero-Section (nur Public-Subset)
- Social-Links öffnen in neuem Tab (`target="_blank"`, `rel="noopener noreferrer"`)
- XSS-Prevention: React escapes automatisch, keine `dangerouslySetInnerHTML`

### References

**Tech Spec:**
- [Source: docs/tech-spec-epic-3.md#Hero Section Component]
  - Data Model: PublicCV['basics'] Interface
  - Component Requirements: Name, Label, Summary, Social-Links, Avatar
  - Responsive Design: Mobile-First mit Tailwind-Breakpoints

**Architecture:**
- [Source: docs/architecture.md#Frontend Stack]
  - TanStack Start mit SSR
  - Tailwind CSS v4 für Styling
  - shadcn/ui Components für UI-Patterns

**Epics:**
- [Source: docs/epics.md#Story 3.5]
  - Acceptance Criteria (authoritative)
  - Prerequisites: Story 3.4 (Route mit CV-Daten)
  - Affected Files: hero-section.tsx, social-link.tsx

**PRD:**
- [Source: docs/PRD.md#UX Principles]
  - Visual Personality: Professionell, modern, zugänglich
  - Interaction Patterns: Microinteractions, Hover-States
  - Accessibility: WCAG 2.1 Level AA Compliance

**JSON Resume Schema:**
- [Source: https://jsonresume.org/schema]
  - `basics.name`: String (required)
  - `basics.label`: String (optional)
  - `basics.summary`: String (optional)
  - `basics.profiles`: Array (optional)
  - `basics.image`: String URL (optional)

### Implementation Notes

**Component Props-Interface:**
```typescript
interface HeroSectionProps {
  basics: PublicCV['basics'];
}
```

**Responsive Layout-Strategie:**
```typescript
// Mobile (< 768px): Vertical Stack
<div className="flex flex-col items-center gap-4">
  {basics.image && <Avatar />}
  <div className="text-center">
    <h1>{basics.name}</h1>
    <p>{basics.label}</p>
    <p>{basics.summary}</p>
  </div>
  <SocialLinks profiles={basics.profiles} />
</div>

// Desktop (>= 768px): Horizontal Layout
<div className="flex flex-row items-center gap-8 md:flex-row">
  {basics.image && <Avatar className="md:order-first" />}
  <div className="md:text-left">
    <h1>{basics.name}</h1>
    <p>{basics.label}</p>
    <p>{basics.summary}</p>
  </div>
  <SocialLinks profiles={basics.profiles} />
</div>
```

**Social-Link-Icon-Mapping:**
```typescript
const ICON_MAP: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  // Fallback:
  default: Link,
};
```

**Avatar-Fallback-Strategie:**
```typescript
// Option 1: Placeholder-Image (Generic Avatar)
{!basics.image && <div className="w-24 h-24 bg-gray-200 rounded-full" />}

// Option 2: Initialen (first letter of name)
{!basics.image && <div className="initials">{basics.name[0]}</div>}

// Option 3: Keine Anzeige (conditional rendering)
{basics.image && <Avatar src={basics.image} alt={basics.name} />}
```

### Change Log

- **2025-11-07:** Story created (drafted)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
