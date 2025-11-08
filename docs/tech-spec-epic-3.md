# Epic Technical Specification: Public Portfolio Experience

Date: 2025-11-04
Author: Ruben
Epic ID: 3
Status: Draft

---

## Overview

Epic 3 schafft die öffentliche CV-Seite von cv-hub - das zentrale Aushängeschild und technische Showcase des gesamten Projekts. Diese Epic transformiert strukturierte CV-Daten (aus Epic 2) in eine begeisternde, performance-optimierte Web-Experience, die durch ihre Qualität technische Kompetenz demonstriert, bevor ein einziges Wort gelesen wird.

Die öffentliche Seite ist bewusst Privacy-First designed: Sie zeigt Skills, Projekte und Erfahrung ohne sensible persönliche Daten. Das UI ist nicht nur funktional, sondern ein Statement über Designverständnis und technische Exzellenz - moderne Ästhetik, flüssige Animationen, perfekte Accessibility und messbare Performance-Exzellenz (Lighthouse >90, FCP <1.5s).

Technisch setzt Epic 3 auf TanStack Start mit Server-Side Rendering für optimales SEO, kombiniert mit Client-Side Hydration für Interaktivität. Das Styling erfolgt via Tailwind CSS mit shadcn/ui-Komponenten für professionelle, accessible UI-Patterns. Die Integration mit dem Backend (Epic 2) erfolgt über TanStack Query für optimales State-Management und Caching.

## Objectives and Scope

### In Scope

**Frontend-Architektur:**
- TanStack Start-Projekt komplett eingerichtet (React 19, TypeScript, File-based Routing)
- TanStack Router v1 für Type-safe Routing
- TanStack Query für API-Integration und Server-State-Management
- Tailwind CSS v4 für Utility-first Styling
- shadcn/ui Component Library für accessible, moderne UI-Komponenten
- SSR mit Vite SSR + Client-Side Hydration
- Responsive Design (Mobile-First, 320px bis 1440px+)

**CV-Darstellung (Public Subset):**
- **Skills Section:**
  - Strukturierte Anzeige von Skills (Name, optional Level)
  - Client-side Filterung nach Kategorien (ohne Reload)
  - Visuelle Skill-Badges mit Tailwind
  - Responsive Grid-Layout
- **Projekte Section:**
  - Projekt-Cards mit Name, Beschreibung, Highlights, Keywords
  - Filterung nach Jahr, Kategorie, Keywords (client-side)
  - Hover-States mit subtilen Animationen
  - Lazy Loading für Projekt-Details
- **Berufserfahrung Section:**
  - Timeline-Darstellung (Start-/Enddatum)
  - Generic Company-Labels (Privacy: "Confidential" statt echter Namen)
  - Achievements/Highlights (limitiert auf öffentliche Infos)
  - Responsive Layout (Horizontal Desktop, Vertikal Mobile)
- **Bildung Section:**
  - Institution, Studiengang, Abschluss, Zeitraum
  - Optional: Kurse, Score/GPA
- **Ehrenamt/Volunteering Section (optional):**
  - Organisation, Rolle, Zeitraum, Beschreibung

**SEO-Optimierung:**
- **Meta-Tags:**
  - Dynamic `<title>` und `<meta name="description">`
  - Open Graph Tags (og:title, og:description, og:image, og:url)
  - Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image)
- **Strukturierte Daten:**
  - JSON-LD mit JSON Resume Schema (Schema.org mapping)
  - Person-Type für Google Knowledge Graph
  - Breadcrumb-Navigation (wenn Multi-Page)
- **Technisches SEO:**
  - Sitemap.xml generiert
  - robots.txt (Allow: /)
  - Canonical URLs
  - Semantisches HTML5 (header, nav, main, section, article, footer)
  - Alt-Texte für alle Bilder
  - Heading-Hierarchie (H1 einmalig, H2-H6 strukturiert)

**Performance-Optimierung:**
- **Code-Splitting:**
  - Route-based Splitting (TanStack Router automatisch)
  - Component-based Lazy Loading (React.lazy für Heavy Components)
- **Asset-Optimierung:**
  - Image-Optimierung (WebP, srcset für responsive images)
  - Lazy Loading für Bilder (native loading="lazy")
  - SVG-Icons über shadcn/ui (keine Icon-Font)
- **Caching-Strategie:**
  - TanStack Query Cache für API-Responses (staleTime: 5min)
  - Browser-Cache-Headers (Backend setzt Cache-Control)
  - Service Worker (optional, Growth-Feature)
- **Bundle-Optimierung:**
  - Tree-Shaking via Vite
  - Minification (Terser)
  - Target Bundle Size: <200KB (gzipped, initial load)
- **Render-Optimierung:**
  - SSR für initiales HTML (Server-Side Rendering)
  - Client-Side Hydration für Interaktivität
  - Skeleton-Loading während Hydration

**Accessibility (WCAG 2.1 Level AA):**
- **Keyboard-Navigation:**
  - Alle interaktiven Elemente via Tab erreichbar
  - Focus-Trap in Modals/Dialogs
  - Skip-to-Content-Link
- **Screen-Reader-Support:**
  - Semantisches HTML (richtige Element-Hierarchie)
  - ARIA-Labels wo nötig (aria-label, aria-describedby, aria-live)
  - Alt-Texte für alle Bilder
  - Screen-Reader-Only-Text für Context (sr-only Klasse)
- **Farb-Kontrast:**
  - Mindestens 4.5:1 für Normal-Text
  - Mindestens 3:1 für Large-Text und UI-Komponenten
  - Tailwind-Farben mit WCAG-Compliance
- **Responsive Text:**
  - Font-Scaling respektiert User-Präferenzen (rem statt px)
  - Min-Max-Font-Sizes
  - Line-Height für Lesbarkeit (1.5 für Body-Text)
- **Focus-Styles:**
  - Deutlich sichtbare Focus-Indicator (outline oder ring)
  - shadcn/ui-Komponenten haben Built-in Focus-Styles
- **Forms (für spätere Epics vorbereitet):**
  - Labels korrekt mit Inputs verknüpft (htmlFor)
  - Error-Messages accessible (aria-describedby)

**Testing & Quality:**
- **Lighthouse CI:**
  - Performance Score >90
  - Accessibility Score >90
  - Best Practices Score >90
  - SEO Score >90
- **Core Web Vitals:**
  - First Contentful Paint (FCP) <1.5s
  - Largest Contentful Paint (LCP) <2.5s
  - Time to Interactive (TTI) <3s
  - Cumulative Layout Shift (CLS) <0.1
- **Cross-Browser-Testing:**
  - Chrome, Firefox, Safari (Desktop + Mobile)
  - Playwright E2E-Tests für kritische User-Flows
- **Responsive Testing:**
  - 320px (Mobile), 768px (Tablet), 1024px (Desktop), 1440px+ (Large)
  - Touch-Target-Sizes mindestens 44x44px (Mobile)

### Out of Scope

- **Admin-Dashboard UI** (Epic 5)
- **Personalisierte Link-Ansicht** (Epic 4 - separate Route `/invite/:token`)
- **Authentication/Authorization** (Epic 5)
- **KI-Extraktion-Interface** (Epic 6)
- **Dark Mode Toggle** (Growth-Feature, Post-MVP)
- **Multi-Language-Support (i18n)** (Growth-Feature)
- **PDF-Export des CVs** (Growth-Feature)
- **Advanced Analytics/Tracking** (Growth-Feature)
- **CDN-Integration** (Epic 7)
- **Progressive Web App (PWA)** (Growth-Feature)

## System Architecture Alignment

Epic 3 implementiert die in der Architecture spezifizierte Frontend-Strategie:

**TanStack Start SSR-Architektur** (Architecture: Frontend Stack)
- Full-document SSR für SEO-kritische öffentliche Seite (`/`)
- Client-Side Hydration für Interaktivität (Filter, Animations)
- Type-safe Server Functions für Backend-Communication (falls nötig)
- File-based Routing via TanStack Router v1

**Tech Stack Adherence:**
- **Framework:** TanStack Start (RC → v1.0) wie spezifiziert
- **UI Library:** React 19 (latest stable)
- **Router:** TanStack Router v1 (Type-safe, SSR support)
- **Data Fetching:** TanStack Query (Server-state management)
- **Styling:** Tailwind CSS v4 (Utility-first)
- **Components:** shadcn/ui (Radix UI primitives, WCAG AA)
- **Validation:** Zod v3 (Shared mit Backend)

**Privacy-First Data Filtering** (Architecture: Pattern 1)
- Frontend ruft `/api/cv/public` Endpoint (Epic 2)
- Server filtert sensible Daten server-side
- Frontend rendert nur öffentliches Subset
- Keine sensiblen Daten im Client-Code oder HTML

**JSON Resume Schema Integration** (Architecture: Pattern 3)
- Frontend nutzt Zod-Schemas aus `@cv-hub/shared-types`
- Type-Safety zwischen Backend-API und Frontend-Components
- Runtime-Validation via Zod bei API-Responses

**Performance-Target Alignment:**
- Lighthouse Score >90 (alle Kategorien) - PRD NFR
- FCP <1.5s, LCP <2.5s, TTI <3s, CLS <0.1 - PRD NFR
- Bundle Size <200KB (gzipped) - PRD NFR

**Accessibility Alignment:**
- WCAG 2.1 Level AA Compliance - PRD NFR
- shadcn/ui liefert Radix UI = accessible by default
- Keyboard-Navigation, Screen-Reader-Support, Farb-Kontraste

**Constraints Enforced:**
- No API Versioning via URI (Header-based wenn nötig)
- TypeScript Everywhere (TSX Components)
- Mobile-First Responsive Design
- Progressive Enhancement (funktioniert ohne JS für Basics)

## Detailed Design

### Services and Modules

Epic 3 fokussiert sich auf Frontend-Komponenten und deren Integration mit dem Backend (Epic 2). Die Architektur folgt TanStack Start's File-based Routing mit klarer Trennung zwischen UI-Komponenten, API-Integration und State-Management.

| Service/Module | Responsibilities | Inputs | Outputs | Owner |
|----------------|------------------|--------|---------|-------|
| **Public CV Route** (`/`) | SSR-fähige Landing Page, orchestriert CV-Darstellung | Loader: Backend API `/api/cv/public` | Gerenderte HTML-Seite (SSR) + Hydration | Frontend |
| **Hero Section Component** | Name, Tagline, CTA, Social Links | CV Basics (name, label, profiles) | Hero-Section HTML | Frontend |
| **Skills Section Component** | Skills-Anzeige mit Client-Side-Filterung | CV Skills Array | Skills Grid mit Filter-Controls | Frontend |
| **Projects Section Component** | Projekt-Cards mit Filterung (Jahr, Kategorie, Keywords) | CV Projects Array | Projekt-Grid mit Filter-Controls | Frontend |
| **Experience Section Component** | Timeline-Darstellung Berufserfahrung | CV Work Array | Experience Timeline | Frontend |
| **Education Section Component** | Bildungsweg-Darstellung | CV Education Array | Education Cards | Frontend |
| **Sticky Navigation Component** | Section-Navigation mit Smooth Scrolling | Section IDs | Nav-Bar mit Links | Frontend |
| **SEO Service** | Meta-Tags, JSON-LD, Sitemap-Generierung | CV Data | HTML Head Tags, Sitemap XML | Frontend (SSR) |
| **API Client (TanStack Query)** | HTTP-Requests an Backend, Caching, Error-Handling | API Endpoints | Typed CV Data | Frontend |
| **Filter State Management** | Client-Side Filter-State (Skills, Projects) | User-Interaktion (Filter-Selection) | Gefilterte Data Arrays | Frontend (React State) |
| **Performance Monitor** | Lighthouse CI, Core Web Vitals-Tracking | Rendered Page | Performance-Metriken | Testing |

**Module Interactions:**
- Public Route lädt CV-Daten server-side via Loader (SSR)
- API Client (TanStack Query) managed Server-State mit Caching (staleTime: 5min)
- Section-Components rendern CV-Daten aus React Context/Props
- Filter-State lebt client-side, manipuliert nur Display (keine API-Calls)
- SEO Service generiert Meta-Tags während SSR
- Sticky Nav scrollt zu Sections via native `scrollIntoView` API

### Data Models and Contracts

Epic 3 konsumiert CV-Daten vom Backend (`/api/cv/public` aus Epic 2). Die Data Models sind via Zod-Schemas aus `@cv-hub/shared-types` definiert und zwischen Frontend/Backend geteilt.

**1. Public CV Response (API Contract)**

```typescript
// API Endpoint: GET /api/cv/public
// Response Type: PublicCV (gefiltertes Subset von CV)

interface PublicCV {
  basics: {
    name: string;
    label: string;              // "Senior Full-Stack Engineer"
    image?: string;             // Avatar URL (optional)
    url?: string;               // Personal website/portfolio
    summary?: string;           // Bio/Summary (1-2 Sätze)
    location?: {
      city?: string;            // "Berlin"
      countryCode?: string;     // "DE"
    };
    profiles?: Array<{          // Social Links
      network: string;          // "GitHub", "LinkedIn", "Twitter"
      username: string;
      url: string;
    }>;
  };

  skills?: Array<{
    name: string;               // "TypeScript"
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    keywords?: string[];        // ["Frontend", "Backend"]
  }>;

  projects?: Array<{
    name: string;
    description: string;
    highlights?: string[];      // Key achievements
    keywords?: string[];        // Tech stack
    startDate?: string;         // ISO 8601 (YYYY-MM-DD)
    endDate?: string;           // ISO 8601 oder null (ongoing)
    url?: string;               // Project URL
    roles?: string[];           // ["Lead Developer"]
    type?: string;              // "Open Source", "Commercial"
    // Sensitive fields REDACTED in public API:
    // - entity (company name)
    // - metrics (business metrics)
  }>;

  work?: Array<{
    name?: string;              // "Confidential" (generic label)
    position: string;           // "Senior Engineer"
    startDate: string;          // ISO 8601
    endDate?: string;           // ISO 8601 oder null (current)
    summary?: string;           // Role summary
    highlights?: string[];      // Achievements (limitiert auf 3-5)
    // Sensitive fields REDACTED:
    // - Real company name
    // - Detailed business metrics
  }>;

  education?: Array<{
    institution: string;
    area?: string;              // "Computer Science"
    studyType?: string;         // "Bachelor of Science"
    startDate?: string;
    endDate?: string;
    score?: string;             // GPA/Grade
    courses?: string[];
  }>;

  volunteer?: Array<{
    organization: string;
    position: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
}
```

**Key Privacy Filtering (server-side, Epic 2):**
- `work[].name` → Generic "Confidential" statt echtem Firmennamen
- `projects[].entity` → Undefined (company omitted)
- `projects[].metrics` → Undefined (business metrics redacted)
- `basics.email`, `basics.phone` → Undefined (contact info omitted)

**2. Filter State Models (Frontend Client-Side)**

```typescript
// Client-Side State für Section-Filtering

interface SkillsFilterState {
  selectedCategories: string[];    // ["Frontend", "Backend"]
  searchQuery: string;             // Free-text search
}

interface ProjectsFilterState {
  selectedYears: number[];         // [2023, 2024]
  selectedKeywords: string[];      // ["TypeScript", "React"]
  selectedTypes: string[];         // ["Open Source", "Commercial"]
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}

interface ExperienceFilterState {
  showOnlyRecent: boolean;         // Show only last 3 years
  sortBy: 'date' | 'duration';
}
```

**3. Component Props (React Component Contracts)**

```typescript
// Shared Component Props

interface SkillsSectionProps {
  skills: PublicCV['skills'];
  variant: 'public' | 'authenticated';  // For future Epic 4
}

interface ProjectsSectionProps {
  projects: PublicCV['projects'];
  variant: 'public' | 'authenticated';
}

interface ProjectCardProps {
  project: NonNullable<PublicCV['projects']>[number];
  variant: 'public' | 'authenticated';
}

interface ExperienceSectionProps {
  work: PublicCV['work'];
  variant: 'public' | 'authenticated';
}

interface HeroSectionProps {
  basics: PublicCV['basics'];
}

interface SEOHeadProps {
  cv: PublicCV;
  pageType: 'public' | 'invited';
  customTitle?: string;
  customDescription?: string;
}
```

**4. Zod Schema Validation (Runtime)**

```typescript
// Shared Types Package (@cv-hub/shared-types)
import { z } from 'zod';

export const PublicCVSchema = CVSchema.pick({
  basics: true,
  skills: true,
  projects: true,
  work: true,
  education: true,
  volunteer: true,
}).transform(data => ({
  ...data,
  // Ensure privacy filtering on client-side validation
  work: data.work?.map(w => ({ ...w, name: w.name || 'Confidential' })),
  projects: data.projects?.map(p => {
    const { entity, metrics, ...rest } = p;
    return rest;
  }),
}));

export type PublicCV = z.infer<typeof PublicCVSchema>;
```

### APIs and Interfaces

Epic 3 konsumiert ausschließlich **einen** Backend-Endpoint (aus Epic 2):

**API Endpoint: Public CV Data**

```
GET /api/cv/public
```

**Request:**
- Method: `GET`
- Headers: None (public endpoint)
- Query Params: None
- Body: None

**Response:**
- Status: `200 OK`
- Content-Type: `application/json`
- Body: `PublicCV` (siehe Data Models)

**Error Responses:**

```typescript
// 500 Internal Server Error
{
  statusCode: 500,
  message: "Failed to load CV data",
  error: "Internal Server Error"
}

// 404 Not Found (wenn kein CV existiert)
{
  statusCode: 404,
  message: "CV data not found",
  error: "Not Found"
}
```

**TanStack Query Integration:**

```typescript
// lib/api.ts - API Client
import { useQuery } from '@tanstack/react-query';
import { PublicCVSchema, type PublicCV } from '@cv-hub/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const cvQueryKeys = {
  public: ['cv', 'public'] as const,
  authenticated: (token: string) => ['cv', 'authenticated', token] as const,
};

export async function fetchPublicCV(): Promise<PublicCV> {
  const response = await fetch(`${API_BASE_URL}/api/cv/public`);

  if (!response.ok) {
    throw new Error(`Failed to fetch CV: ${response.statusText}`);
  }

  const data = await response.json();

  // Runtime validation with Zod
  const validated = PublicCVSchema.safeParse(data);

  if (!validated.success) {
    console.error('CV validation failed:', validated.error);
    throw new Error('Invalid CV data received from server');
  }

  return validated.data;
}

// React Hook for Public CV
export function usePublicCV() {
  return useQuery({
    queryKey: cvQueryKeys.public,
    queryFn: fetchPublicCV,
    staleTime: 5 * 60 * 1000,      // 5 minutes (CV changes rarely)
    gcTime: 10 * 60 * 1000,         // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
```

**TanStack Router Loader (SSR):**

```typescript
// app/routes/index.tsx - Public CV Route
import { createFileRoute } from '@tanstack/react-router';
import { fetchPublicCV } from '../lib/api';

export const Route = createFileRoute('/')({
  loader: async () => {
    // Server-side data fetch (SSR)
    const cv = await fetchPublicCV();
    return { cv };
  },
  component: PublicCVPage,
  ssr: true,  // Enable SSR
});

function PublicCVPage() {
  const { cv } = Route.useLoaderData();

  return (
    <PublicLayout>
      <HeroSection basics={cv.basics} />
      <SkillsSection skills={cv.skills} variant="public" />
      <ProjectsSection projects={cv.projects} variant="public" />
      <ExperienceSection work={cv.work} variant="public" />
      <EducationSection education={cv.education} />
    </PublicLayout>
  );
}
```

**Component Interfaces (React Props):**

Siehe Data Models → Component Props

**SEO Interface (Meta Tags):**

```typescript
// SEO Service Interface
interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  jsonLd: {
    '@context': 'https://schema.org';
    '@type': 'Person';
    name: string;
    jobTitle: string;
    url?: string;
    sameAs?: string[];  // Social profiles
  };
}

// Usage in Route
export const Route = createFileRoute('/')({
  head: ({ loaderData }) => ({
    meta: generateMetaTags(loaderData.cv),
  }),
});
```

### Workflows and Sequencing

**Workflow 1: Initial Page Load (SSR → Hydration)**

```
1. User navigiert zu https://cv-hub.com/
        ↓
2. Browser sendet GET Request an TanStack Start Server
        ↓
3. Server-Side Rendering (SSR):
   3.1. TanStack Router lädt Route `/` (index.tsx)
   3.2. Loader-Function führt aus: fetchPublicCV()
   3.3. Backend-Request: GET /api/cv/public
   3.4. Backend (Epic 2) filtert CV-Daten (Privacy)
   3.5. Backend returns JSON (PublicCV)
   3.6. Zod-Validation im Frontend-Loader
   3.7. React-Komponenten rendern server-side (zu HTML)
   3.8. SEO-Meta-Tags werden generiert (Head)
   3.9. Vollständiges HTML-Dokument wird erstellt
        ↓
4. Server sendet HTML-Response an Browser
   - Status: 200 OK
   - Content-Type: text/html
   - Body: Vollständiges HTML mit CV-Daten
        ↓
5. Browser rendert HTML (First Contentful Paint <1.5s)
   - User sieht sofort Content (kein Loading-Spinner)
   - SEO-Bots können HTML crawlen
        ↓
6. Browser lädt JavaScript-Bundle (Code-Splitting aktiv)
        ↓
7. Client-Side Hydration:
   7.1. React hydrated server-rendered HTML
   7.2. Event-Listener werden attached
   7.3. TanStack Query wird initialisiert
   7.4. Interaktive Features aktiviert (Filter, Smooth Scroll)
        ↓
8. User kann interagieren:
   - Filtering funktioniert (client-side, kein API-Call)
   - Smooth Scrolling zu Sections
   - Hover-States, Animationen
```

**Timing-Ziele:**
- Server-Side Rendering: 100-200ms
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Hydration: 200-500ms

**Workflow 2: Client-Side Filtering (Skills Section)**

```
1. User öffnet Skills-Section Filter-Dropdown
        ↓
2. User wählt Kategorie (z.B. "Frontend")
        ↓
3. React State Update:
   - setSelectedCategories(['Frontend'])
        ↓
4. Component Re-Render (keine API-Calls!):
   4.1. skills.filter(s => s.keywords?.includes('Frontend'))
   4.2. Gefilterte Skills werden angezeigt
   4.3. Animation: Fade-out nicht-matchende Skills
   4.4. Animation: Fade-in matchende Skills
        ↓
5. User sieht gefilterte Skills (<100ms Latenz)
        ↓
6. User kann Filter zurücksetzen oder weitere hinzufügen
   - Kumulatives Filtern (AND-Logic)
   - "Clear Filters" Button zum Reset
```

**Performance:**
- Filter-Logik: Client-side (JavaScript)
- Keine Backend-Calls (alle Daten bereits geladen)
- Optimistic UI (sofortiges Feedback)
- Smooth Animations via Tailwind Transitions

**Workflow 3: Smooth Scrolling Navigation**

```
1. User klickt Sticky-Nav Link (z.B. "Projects")
        ↓
2. JavaScript Event-Handler:
   2.1. event.preventDefault()
   2.2. document.getElementById('projects')
   2.3. element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        ↓
3. Browser scrollt smooth zur Section
   - Native Scroll-Animation (hardware-accelerated)
   - Dauer: ~500ms
        ↓
4. Section ist im Viewport
   - Optional: Update URL Hash (#projects)
   - Optional: Highlight aktiven Nav-Link
```

**Accessibility:**
- Keyboard-Navigation: Tab zu Nav-Link, Enter triggert Scroll
- Screen-Reader: "Jump to Projects Section" Announcement
- Focus-Management: Nach Scroll, Focus auf Section-Heading

**Workflow 4: SEO Metadata Generation (SSR)**

```
1. Server-Side Rendering startet
        ↓
2. Loader lädt CV-Daten (fetchPublicCV)
        ↓
3. SEO Service generiert Meta-Tags:
   3.1. Extract basics.name, basics.label, basics.summary
   3.2. Generate <title>: "{name} - {label}"
   3.3. Generate <meta name="description">: "{summary}"
   3.4. Generate Open Graph Tags:
        - og:title
        - og:description
        - og:image (basics.image)
        - og:url (canonical URL)
   3.5. Generate Twitter Cards
   3.6. Generate JSON-LD (Schema.org Person):
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": basics.name,
          "jobTitle": basics.label,
          "url": basics.url,
          "sameAs": basics.profiles.map(p => p.url)
        }
        ↓
4. Meta-Tags werden in HTML <head> injected
        ↓
5. HTML-Response enthält vollständige SEO-Daten
        ↓
6. Crawlers (Google, Twitter, LinkedIn) können Metadata lesen
   - Social Sharing zeigt Rich Previews
   - Google indexiert mit korrekten Metadaten
```

**SEO Validation:**
- Google Rich Results Test: Strukturierte Daten validiert
- Twitter Card Validator: Vorschau korrekt
- LinkedIn Post Inspector: Open Graph Tags korrekt

**Workflow 5: Performance Monitoring (Lighthouse CI)**

```
1. Developer pusht Code zu GitHub
        ↓
2. GitHub Actions Workflow triggered:
   2.1. Build-Schritt: pnpm build
   2.2. Start Production-Server: pnpm preview
   2.3. Lighthouse CI läuft:
        - lhci autorun --config=lighthouserc.json
        ↓
3. Lighthouse testet Seite (5 Runs):
   3.1. Performance Score (Target: >90)
   3.2. Accessibility Score (Target: >90)
   3.3. Best Practices Score (Target: >90)
   3.4. SEO Score (Target: >90)
   3.5. Core Web Vitals:
        - FCP <1.5s
        - LCP <2.5s
        - TTI <3s
        - CLS <0.1
        ↓
4. Lighthouse CI Report generiert
        ↓
5. Wenn Score < Threshold:
   - CI/CD Pipeline fails
   - Pull Request bekommt Comment mit Report
   - Developer muss Performance fixen
        ↓
6. Wenn Score >= Threshold:
   - CI/CD Pipeline succeeds
   - Pull Request kann gemerged werden
```

**Performance Budget (lighthouserc.json):**
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

## Non-Functional Requirements

### Performance

**Warum kritisch für Epic 3:**
Die öffentliche CV-Seite ist das Aushängeschild von cv-hub. Performance demonstriert technische Kompetenz - langsame Ladezeiten würden das Gegenteil signalisieren. Die Website selbst ist Teil des Portfolios und muss durch messbare Exzellenz überzeugen.

**Messbare Performance-Targets (PRD NFR):**

| Metrik | Zielwert | Messung | Warum wichtig |
|--------|----------|---------|---------------|
| **Lighthouse Performance Score** | >90 | Lighthouse CI (automatisch) | Ganzheitliche Performance-Bewertung |
| **First Contentful Paint (FCP)** | <1.5s | Chrome DevTools, Lighthouse | User sieht sofort Content, keine Wartezeit |
| **Largest Contentful Paint (LCP)** | <2.5s | Chrome DevTools, Core Web Vitals | Hauptinhalt ist schnell sichtbar |
| **Time to Interactive (TTI)** | <3s | Lighthouse | User kann schnell interagieren (Filter, Nav) |
| **Cumulative Layout Shift (CLS)** | <0.1 | Lighthouse, DevTools | Keine Layout-Sprünge während Load |
| **Total Blocking Time (TBT)** | <200ms | Lighthouse | Main Thread nicht blockiert |
| **Bundle Size (Initial Load)** | <200KB (gzipped) | Webpack Bundle Analyzer | Schneller Download, mobile-friendly |
| **Server Response Time (TTFB)** | <600ms | Chrome DevTools, Network Tab | SSR ist schnell |

**Performance-Optimierungsstrategien:**

**1. Server-Side Rendering (SSR)**
```typescript
// TanStack Start SSR Configuration
export const Route = createFileRoute('/')({
  loader: async () => {
    // Server-side data fetch (parallel wenn möglich)
    const cv = await fetchPublicCV();
    return { cv };
  },
  ssr: true,  // Enable SSR
  component: PublicCVPage,
});
```

**Benefit:**
- FCP <1.5s (HTML sofort sichtbar, kein Loading-Spinner)
- SEO-optimiert (Crawlers bekommen vollständiges HTML)
- Perceived Performance höher (User sieht Content während JS lädt)

**2. Code-Splitting & Lazy Loading**
```typescript
// Route-based Code-Splitting (automatisch via TanStack Router)
// Jede Route = separate Chunk

// Component-based Lazy Loading (Heavy Components)
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ExperienceTimeline = lazy(() => import('./components/ExperienceTimeline'));

// Usage with Suspense
<Suspense fallback={<SkeletonLoader />}>
  <ProjectsSection projects={cv.projects} />
</Suspense>
```

**Benefit:**
- Initial Bundle Size reduziert
- Paralleles Laden von Chunks
- Schnellere Time to Interactive

**3. Asset-Optimierung**
```typescript
// Image-Optimierung
<img
  src="/avatar.webp"
  srcSet="/avatar-320w.webp 320w, /avatar-640w.webp 640w, /avatar-1280w.webp 1280w"
  sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1280px"
  alt={cv.basics.name}
  loading="lazy"
  decoding="async"
  width={320}
  height={320}
/>
```

**Asset-Pipeline:**
- WebP-Format (30-50% kleiner als JPEG)
- Responsive Srcset (richtige Größe für Device)
- Lazy Loading (bilder außerhalb Viewport laden erst on-scroll)
- Explizite width/height (prevent CLS)

**4. Caching-Strategie**
```typescript
// TanStack Query Cache-Konfiguration
export function usePublicCV() {
  return useQuery({
    queryKey: cvQueryKeys.public,
    queryFn: fetchPublicCV,
    staleTime: 5 * 60 * 1000,      // 5 min - CV ändert sich selten
    gcTime: 10 * 60 * 1000,         // 10 min - Keep in memory
    retry: 2,
  });
}
```

**Backend Cache-Headers (Epic 2):**
```typescript
// NestJS Controller
@Get('cv/public')
@Header('Cache-Control', 'public, max-age=300, s-maxage=600')
async getPublicCV() {
  return this.cvService.getCV('public');
}
```

**Benefit:**
- Client-Side Cache: Wiederholte Navigationen instant
- HTTP Cache: Browser cached Response (5 min)
- CDN Cache (optional, Growth): s-maxage=600 (10 min)

**5. Bundle-Optimierung**
```typescript
// Vite Config (app.config.ts)
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
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router'],
  },
});
```

**Bundle Analysis:**
- Webpack Bundle Analyzer im CI/CD
- Target: <200KB gzipped für initial load
- Vendor-Chunk separate (Browser-Cache nutzen)

**Performance Monitoring & Alerts:**

**1. Lighthouse CI in GitHub Actions**
```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  run: |
    pnpm build
    pnpm preview &
    npx wait-on http://localhost:4173
    lhci autorun --config=lighthouserc.json
```

**Alert:**
- Pull Request Comment mit Lighthouse-Report
- CI fails wenn Score <90
- Developer muss Performance fixen vor Merge

**2. Real User Monitoring (RUM) - Optional Growth**
```typescript
// Web Vitals Tracking
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  // Anonymized tracking (DSGVO-compliant)
  fetch('/api/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify({ metric: name, value, id }),
  });
}

onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
onINP(sendToAnalytics);
```

**Benefit:**
- Real-World Performance-Daten
- Device-/Network-spezifische Insights
- Trend-Analyse über Zeit

### Security

**Warum relevant für Epic 3:**
Epic 3 ist eine öffentliche Read-Only-Seite ohne Authentication, aber Security-Best-Practices müssen trotzdem implementiert sein. Content-Security-Policy verhindert XSS, HTTPS-Only schützt Datenintegrität, und Privacy-Compliance ist gesetzlich erforderlich.

**Security-Anforderungen:**

**1. Content Security Policy (CSP)**
```typescript
// Backend (Epic 1) - Helmet Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],  // TanStack Router inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],   // Tailwind inline styles
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],  // API calls nur zu eigenem Backend
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],  // Force HTTPS
    },
  },
  hsts: {
    maxAge: 31536000,  // 1 Jahr
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },  // No iframes
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

**Benefit:**
- XSS-Prevention (kein inline-script injection)
- Clickjacking-Protection (no iframe embedding)
- HTTPS-Enforcement (upgrade insecure requests)

**2. Input Validation (für spätere Epics vorbereitet)**
```typescript
// Zod Runtime Validation (Frontend)
const PublicCVSchema = z.object({ /* ... */ });

const validated = PublicCVSchema.safeParse(apiResponse);
if (!validated.success) {
  // Reject malformed data
  throw new Error('Invalid API response');
}
```

**Benefit:**
- Schutz vor malformed API responses
- Type-Safety + Runtime-Safety

**3. HTTPS-Only (Epic 7 Deployment)**
- Let's Encrypt SSL-Zertifikat
- HTTP → HTTPS Redirect (Nginx)
- HSTS Header (force HTTPS für 1 Jahr)

**4. No Third-Party-Tracking**
- Keine Google Analytics, Facebook Pixel, etc. (MVP)
- Privacy-First: Keine Cookies außer Session-Cookies (Admin, Epic 5)
- DSGVO-konform ohne Cookie-Banner

**Security Testing:**
- OWASP ZAP Scan (automated in CI)
- npm audit (dependency vulnerabilities)
- Snyk (continuous monitoring)

### Reliability/Availability

**Ziel:** Öffentliche CV-Seite ist 99.9% verfügbar (max. 43 min Downtime/Monat).

**Reliability-Strategien:**

**1. Fehlerbehandlung (Graceful Degradation)**
```typescript
// Error Boundary für React Components
class PublicCVErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title="Oops! Something went wrong"
          message="We're having trouble loading the CV. Please try again later."
          action={<Button onClick={() => window.location.reload()}>Reload Page</Button>}
        />
      );
    }

    return this.props.children;
  }
}
```

**2. API Error-Handling**
```typescript
// TanStack Query Error-Handling
export function usePublicCV() {
  return useQuery({
    queryKey: cvQueryKeys.public,
    queryFn: fetchPublicCV,
    retry: 2,  // Retry failed requests 2x
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    throwOnError: false,  // Don't throw, show error UI
  });
}

// Component Usage
function PublicCVPage() {
  const { data: cv, isLoading, isError, error } = usePublicCV();

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return <CVContent cv={cv} />;
}
```

**3. Offline-Support (Optional, Growth)**
```typescript
// Service Worker für Offline-Caching
// PWA-Feature: Cached CV bleibt offline verfügbar
```

**Monitoring (Epic 7):**
- Uptime-Monitoring (UptimeRobot, Better Uptime)
- Error-Tracking (Sentry)
- Alerting bei >1% Error Rate

### Observability

**Logging-Strategie:**

**Frontend Logging:**
```typescript
// Error Logging (Production)
window.addEventListener('error', (event) => {
  if (import.meta.env.PROD) {
    fetch('/api/logs/client-error', {
      method: 'POST',
      body: JSON.stringify({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    });
  }
});

// Performance Logging
import { onCLS, onFCP, onLCP } from 'web-vitals';

onLCP((metric) => {
  // Send to backend for analysis
  fetch('/api/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
});
```

**Backend Logging (Epic 1 - Pino):**
```typescript
// Request Logging
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log({
          method: request.method,
          url: request.url,
          duration,
          statusCode: context.switchToHttp().getResponse().statusCode,
        });
      }),
    );
  }
}
```

**Metrics-Tracking:**
- Page Load Times (RUM)
- API Response Times (Backend Metrics)
- Error Rates (Frontend + Backend)
- User Journey Funnels (optional)

**Signals benötigt:**
- Logs: Pino (Backend), Console (Frontend)
- Metrics: Prometheus (optional, Growth)
- Traces: OpenTelemetry (optional, Growth)

## Dependencies and Integrations

### Frontend Dependencies (apps/frontend)

Epic 3 baut auf dem TanStack-Ökosystem und modernen React-Libraries auf. Alle Versionen sind aus der Architecture übernommen.

**Core Framework & Routing:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `react` | 19.x | UI Library | Latest stable, TanStack Start compatible |
| `react-dom` | 19.x | DOM Rendering | Match React version |
| `@tanstack/react-router` | v1.x | Type-safe Routing, File-based | SSR support required |
| `@tanstack/start` | RC → v1.0 | Full-document SSR, Server Functions | Vite-powered |

**State Management & Data Fetching:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `@tanstack/react-query` | Latest | Server-state management, Caching | Optimistic updates support |
| `@tanstack/react-form` | Latest | Type-safe forms, Validation | Admin-Dashboard (Epic 5), vorbereitet |

**Styling & UI Components:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `tailwindcss` | v4.x | Utility-first CSS framework | Production-optimized |
| `@radix-ui/react-*` | Latest | Accessible UI primitives | Via shadcn/ui |
| `class-variance-authority` | Latest | Component variants (shadcn/ui) | Type-safe styling |
| `clsx` | Latest | Conditional className merging | Tailwind helper |
| `tailwind-merge` | Latest | Merge Tailwind classes (conflicts resolution) | DX improvement |

**Validation & Type Safety:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `zod` | v3.x | Runtime validation, Type inference | Shared mit Backend |
| `@cv-hub/shared-types` | Workspace | Shared Zod schemas, TypeScript types | Monorepo package |

**Markdown & Content:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `react-markdown` | v10.x | Secure Markdown rendering | No dangerouslySetInnerHTML |
| `remark-gfm` | Latest | GitHub-Flavored Markdown | Plugin für react-markdown |

**Utilities:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `date-fns` | Latest | Date formatting, manipulation | Tree-shakable, lightweight |

**Development & Testing:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `typescript` | Latest | Type-safety | TSConfig strict mode |
| `vite` | Latest | Build tool, Dev server | TanStack Start built-in |
| `vitest` | Latest | Unit testing (3-4x faster than Jest) | Vite-native |
| `@testing-library/react` | Latest | Component testing | User-centric tests |
| `@playwright/test` | Latest | E2E testing | Cross-browser |
| `eslint` | Latest | Linting | Shared config (Epic 1) |
| `prettier` | Latest | Code formatting | Shared config (Epic 1) |

**Performance & Monitoring:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `web-vitals` | Latest | Core Web Vitals tracking | FCP, LCP, CLS, TTI |
| `@lhci/cli` | Latest | Lighthouse CI (automated testing) | CI/CD integration |

### Backend Dependencies (apps/backend)

Epic 3 konsumiert nur **einen** Backend-Endpoint (`GET /api/cv/public` aus Epic 2), aber die Dependencies sind für Vollständigkeit aufgeführt.

**Core Framework:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `@nestjs/core` | v11.x | NestJS Framework | Enterprise-grade |
| `@nestjs/common` | v11.x | Common utilities | Match NestJS core |
| `@nestjs/platform-express` | v11.x | Express HTTP adapter | Default NestJS platform |

**Database & ORM (Epic 2):**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `typeorm` | Latest | ORM for SQLite | NestJS-native |
| `sqlite3` | Latest | SQLite database driver | File-based, simple |

**Security:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `helmet` | v8.x | Security headers (CSP, HSTS) | Epic 1 Foundation |
| `@nestjs/throttler` | v6.4.0 | Rate-limiting | NestJS Guards |

**Validation & Logging:**

| Dependency | Version | Purpose | Constraints |
|------------|---------|---------|-------------|
| `zod` | v3.x | Runtime validation, shared schemas | Shared mit Frontend |
| `nestjs-pino` | v4.4.1 | Structured logging (Pino) | Fastest async logger |

### Integration Points

**1. Backend API Integration (Epic 2)**

```
Frontend (TanStack Start)  →  Backend (NestJS)
       |                              |
       └──────── HTTP/JSON ──────────┘
          GET /api/cv/public
```

**Contract:**
- Endpoint: `GET http://localhost:3000/api/cv/public` (Dev), `https://cv-hub.com/api/cv/public` (Prod)
- Request: None (public endpoint)
- Response: JSON (PublicCV schema, siehe Data Models)
- Content-Type: `application/json`
- Cache-Control: `public, max-age=300, s-maxage=600`
- Error Handling: 404 (not found), 500 (server error)

**Integration-Test:**
```typescript
// E2E Test (Playwright)
test('Public CV loads successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Check API call
  const response = await page.waitForResponse('**/api/cv/public');
  expect(response.status()).toBe(200);

  // Check content rendered
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-testid="skills-section"]')).toBeVisible();
});
```

**2. Shared Types Package (`@cv-hub/shared-types`)**

```
Frontend  ←──── Zod Schemas ────→  Backend
   |                                   |
   └──── @cv-hub/shared-types ────────┘
```

**Shared Schemas:**
- `CVSchema` (JSON Resume Standard)
- `PublicCVSchema` (filtered subset)
- `SkillSchema`, `ProjectSchema`, `WorkSchema`, etc.

**Usage:**
```typescript
// Frontend
import { PublicCVSchema, type PublicCV } from '@cv-hub/shared-types';

// Backend
import { CVSchema } from '@cv-hub/shared-types';
```

**Benefit:**
- Single Source of Truth für Data Contracts
- Compile-time + Runtime Type-Safety
- No API drift (Frontend/Backend immer synchron)

**3. External Dependencies (None in Epic 3)**

Epic 3 hat **keine** externen Third-Party-Integrationen:
- Kein Google Analytics (Privacy-First)
- Kein CDN (lokales Serving, Growth-Feature in Epic 7)
- Keine Social Media APIs
- Keine Payment Processors
- Kein External Auth (nur für Admin in Epic 5)

**Future Integrations (Growth/Vision):**
- GitHub API (für Content Aggregator)
- Blog RSS-Feeds
- Stack Overflow API
- CDN für Assets (Cloudflare, Vercel)

### Dependency Management

**Monorepo mit pnpm Workspaces:**

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Benefits:**
- Shared dependencies cached (pnpm store)
- Single lockfile (`pnpm-lock.yaml`)
- Workspace protocol (`workspace:*`)
- Hoisting optimization

**Dependency Update Strategy:**

```bash
# Check outdated dependencies
pnpm outdated -r

# Update dependencies (minor/patch)
pnpm update -r

# Update specific package
pnpm update react@latest -r --filter frontend
```

**Security Audits:**
```bash
# npm audit (automated in CI)
pnpm audit

# Snyk scanning
snyk test

# Dependabot (GitHub) - automated PRs
```

**Version Constraints:**
- `^` (caret) für stable packages (minor updates allowed)
- `~` (tilde) für critical packages (patch updates only)
- Exact versions für NestJS core (avoid breaking changes)

### Build & Deployment Dependencies

**CI/CD (GitHub Actions):**

| Tool | Purpose | When |
|------|---------|------|
| `pnpm` | Package manager | All workflows |
| `@lhci/cli` | Lighthouse CI | PR checks |
| `playwright` | E2E tests | PR checks, nightly |
| `vitest` | Unit tests | PR checks |
| `eslint` | Linting | PR checks |
| `prettier` | Formatting | PR checks |

**Docker (Epic 7 Preview):**

```dockerfile
# Frontend Build (Multi-Stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
RUN pnpm --filter frontend build

# Production Image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/frontend/.output .
EXPOSE 5173
CMD ["node", "server/index.mjs"]
```

**Constraint:**
- Node.js 20 LTS (Architecture-Spec)
- Alpine Linux (small image size)
- Multi-stage build (no dev dependencies in production)

## Acceptance Criteria (Authoritative)

Epic 3 ist erfolgreich abgeschlossen, wenn folgende Kriterien erfüllt sind:

### AC-1: Öffentliche CV-Seite lädt und rendert korrekt

**Given:** User navigiert zu `https://cv-hub.com/` oder `http://localhost:5173/` (Dev)
**When:** Die Seite lädt
**Then:**
- ✅ HTML wird server-side gerendert (SSR)
- ✅ First Contentful Paint erfolgt in <1.5s
- ✅ Vollständiges CV wird angezeigt (Hero, Skills, Projects, Experience, Education)
- ✅ Keine sensiblen Daten sind sichtbar (keine Email, Phone, echte Firmennamen)
- ✅ Page-Load-Errors: 0 (keine Console-Errors)

**Testable:**
```bash
# Lighthouse CI
lhci autorun --config=lighthouserc.json
# Expect: FCP <1.5s, Performance Score >90

# E2E Test
npx playwright test tests/public-cv.spec.ts
```

---

### AC-2: Performance-Targets werden erreicht

**Given:** Öffentliche CV-Seite wird geladen
**When:** Lighthouse CI testet die Seite (5 Runs)
**Then:**
- ✅ **Performance Score:** >90
- ✅ **Accessibility Score:** >90
- ✅ **Best Practices Score:** >90
- ✅ **SEO Score:** >90
- ✅ **First Contentful Paint (FCP):** <1.5s
- ✅ **Largest Contentful Paint (LCP):** <2.5s
- ✅ **Time to Interactive (TTI):** <3s
- ✅ **Cumulative Layout Shift (CLS):** <0.1
- ✅ **Total Blocking Time (TBT):** <200ms
- ✅ **Bundle Size (Initial Load):** <200KB (gzipped)

**Testable:**
```yaml
# GitHub Actions - Lighthouse CI Workflow
- Assert: categories:performance min 0.9
- Assert: first-contentful-paint max 1500ms
- Assert: largest-contentful-paint max 2500ms
```

---

### AC-3: Responsive Design funktioniert auf allen Geräten

**Given:** CV-Seite wird auf verschiedenen Viewports getestet
**When:** Browser-Größe ändert sich
**Then:**
- ✅ **Mobile (320px):** Alle Sections sichtbar, keine horizontalen Scrollbars, Touch-Targets ≥44x44px
- ✅ **Tablet (768px):** Optimiertes Layout, keine Element-Überlappungen
- ✅ **Desktop (1024px+):** Multi-Column-Layout, optimale Lesbarkeit
- ✅ **Large Desktop (1440px+):** Max-Width constraint, zentriertes Layout
- ✅ Images: Responsive srcset, korrekte Größen pro Viewport
- ✅ Text: Skaliert mit Viewport (rem-based), min 16px Body-Text

**Testable:**
```typescript
// Playwright Responsive Test
test.describe('Responsive Design', () => {
  test('Mobile 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    // Assert: No overflow, touch targets ≥44px
  });

  test('Desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // Assert: Max-width constraint, centered layout
  });
});
```

---

### AC-4: Client-Side Filtering funktioniert ohne API-Calls

**Given:** User ist auf der CV-Seite
**When:** User wählt Filter (Skills: "Frontend", Projects: Jahr "2024")
**Then:**
- ✅ Gefilterte Ergebnisse werden **sofort** angezeigt (<100ms Latenz)
- ✅ **Keine neuen API-Calls** werden getriggert (Network-Tab leer)
- ✅ Smooth Animations (Fade-out/Fade-in)
- ✅ "Clear Filters" Button resettet alle Filter
- ✅ URL-State bleibt optional (kein Hash-Change required für MVP)

**Testable:**
```typescript
// E2E Test
test('Skills filtering works client-side', async ({ page }) => {
  await page.goto('/');

  // Monitor network requests
  const apiCalls = [];
  page.on('request', req => {
    if (req.url().includes('/api/')) apiCalls.push(req.url());
  });

  // Apply filter
  await page.click('[data-testid="skills-filter-dropdown"]');
  await page.click('text=Frontend');

  // Assert: No API calls
  expect(apiCalls.length).toBe(0);

  // Assert: Filtered results visible
  const skills = await page.locator('[data-testid="skill-tag"]').all();
  expect(skills.length).toBeGreaterThan(0);
});
```

---

### AC-5: SEO-Optimierung ist vollständig implementiert

**Given:** CV-Seite wird von Crawlers oder SEO-Tools gecrawlt
**When:** HTML-Quelle wird analysiert
**Then:**
- ✅ **Meta-Tags vorhanden:**
  - `<title>` dynamisch aus CV-Daten generiert
  - `<meta name="description">` vorhanden
  - Open Graph Tags (og:title, og:description, og:image, og:url)
  - Twitter Cards (twitter:card, twitter:title, twitter:description)
- ✅ **Strukturierte Daten (JSON-LD):**
  - Schema.org Person-Type im `<head>`
  - JSON Resume Schema-konform
- ✅ **Semantisches HTML:**
  - `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` korrekt verwendet
  - H1 einmalig (Name), H2-H6 hierarchisch
- ✅ **Technisches SEO:**
  - `sitemap.xml` verfügbar unter `/sitemap.xml`
  - `robots.txt` verfügbar unter `/robots.txt` (Allow: /)
  - Canonical URL gesetzt
  - Alt-Texte für alle Bilder

**Testable:**
```bash
# Google Rich Results Test
# Input: https://cv-hub.com
# Expect: Valid Person schema detected

# SEO Audit (Lighthouse)
lhci autorun --config=lighthouserc.json
# Assert: SEO Score >90
```

---

### AC-6: Accessibility (WCAG 2.1 Level AA) ist erfüllt

**Given:** CV-Seite wird mit Accessibility-Tools getestet
**When:** axe DevTools und Screen-Reader laufen
**Then:**
- ✅ **Lighthouse Accessibility Score:** >90
- ✅ **axe DevTools:** 0 kritische Fehler
- ✅ **Keyboard-Navigation:**
  - Alle interaktiven Elemente via Tab erreichbar
  - Focus-States deutlich sichtbar (outline oder ring)
  - Skip-to-Content-Link funktioniert
- ✅ **Screen-Reader-Support:**
  - ARIA-Labels wo nötig (Buttons, Nav-Links)
  - Alt-Texte für alle Bilder
  - Heading-Hierarchie korrekt (H1→H2→H3)
- ✅ **Farb-Kontrast:**
  - Normal-Text: ≥4.5:1
  - Large-Text/UI: ≥3:1
- ✅ **Form-Elemente (Filter):**
  - Labels korrekt verknüpft (htmlFor)
  - Error-Messages accessible (aria-describedby)

**Testable:**
```typescript
// Playwright Accessibility Test
test('Accessibility compliance', async ({ page }) => {
  await page.goto('/');

  // Inject axe-core
  await injectAxe(page);

  // Run axe scan
  const results = await checkA11y(page);
  expect(results.violations).toHaveLength(0);
});

// Manual Test
// - Screen-Reader: NVDA/JAWS navigiert korrekt durch Seite
// - Keyboard-only: Alle Features erreichbar ohne Maus
```

---

### AC-7: Smooth Scrolling und Navigation funktionieren

**Given:** User klickt Sticky-Nav Link (z.B. "Projects")
**When:** Link wird geklickt oder Enter gedrückt
**Then:**
- ✅ Browser scrollt smooth zur Section (behavior: 'smooth')
- ✅ Scroll-Dauer: ~500ms (native Browser-Animation)
- ✅ Section-Heading erhält Focus (Accessibility)
- ✅ Optional: URL-Hash updated (#projects)
- ✅ Optional: Aktiver Nav-Link highlighted

**Testable:**
```typescript
// E2E Test
test('Smooth scrolling navigation', async ({ page }) => {
  await page.goto('/');

  // Get initial scroll position
  const initialScroll = await page.evaluate(() => window.scrollY);

  // Click nav link
  await page.click('a[href="#projects"]');

  // Wait for scroll animation
  await page.waitForTimeout(600);

  // Assert: Scrolled to section
  const finalScroll = await page.evaluate(() => window.scrollY);
  expect(finalScroll).toBeGreaterThan(initialScroll);

  // Assert: Section is in viewport
  const projectsSection = page.locator('#projects');
  await expect(projectsSection).toBeInViewport();
});
```

---

### AC-8: Error-Handling und Graceful Degradation

**Given:** Backend-API ist nicht erreichbar oder liefert Fehler
**When:** Frontend versucht CV-Daten zu laden
**Then:**
- ✅ **Loading-State:** Skeleton-Loader wird angezeigt während Fetch
- ✅ **Error-State:** Freundliche Error-Message mit Retry-Button
- ✅ **Retry-Logic:** Automatisch 2 Retries mit exponential backoff
- ✅ **Error-Boundary:** React Error-Boundary fängt Render-Errors
- ✅ **Console:** Strukturierte Error-Logs (inkl. Stack-Trace)
- ✅ **Keine Crashes:** App bleibt funktional, zeigt Fallback-UI

**Testable:**
```typescript
// Integration Test (Mock API Failure)
test('Handles API errors gracefully', async ({ page }) => {
  // Mock API to return 500 error
  await page.route('**/api/cv/public', route => {
    route.fulfill({ status: 500, body: 'Internal Server Error' });
  });

  await page.goto('/');

  // Assert: Error state shown
  await expect(page.locator('text=Oops! Something went wrong')).toBeVisible();
  await expect(page.locator('button:has-text("Reload Page")')).toBeVisible();

  // Assert: No console errors (handled gracefully)
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  expect(errors.filter(e => !e.includes('Failed to fetch'))).toHaveLength(0);
});
```

---

### AC-9: CI/CD Pipeline validiert Qualität automatisch

**Given:** Developer pusht Code zu GitHub
**When:** GitHub Actions Workflow läuft
**Then:**
- ✅ **Linting:** ESLint passes (0 errors)
- ✅ **Type-Checking:** TypeScript compiles (0 errors)
- ✅ **Unit Tests:** Vitest passes (all tests green)
- ✅ **E2E Tests:** Playwright passes (critical flows)
- ✅ **Lighthouse CI:** Performance/A11y/SEO Scores >90
- ✅ **Build:** Production-Build succeeds
- ✅ **Bundle-Size:** <200KB gzipped (Budget enforced)

**Testable:**
```yaml
# .github/workflows/ci.yml
- Lint: pnpm lint
- Type-check: pnpm type-check
- Test: pnpm test
- E2E: pnpm test:e2e
- Lighthouse: lhci autorun
- Build: pnpm build
- Bundle-Analysis: npx vite-bundle-analyzer

# Assert: All steps pass (exit code 0)
```

---

### AC-10: Privacy-First Design ist gewährleistet

**Given:** Öffentliche CV-Seite wird inspiziert
**When:** HTML-Quelle, API-Response, Network-Tab analysiert werden
**Then:**
- ✅ **API-Response (`/api/cv/public`):**
  - Kein `email` Feld
  - Kein `phone` Feld
  - Keine echten Firmennamen (work[].name = "Confidential")
  - Keine business metrics (projects[].metrics = undefined)
- ✅ **HTML-Quelle:**
  - Keine sensiblen Daten im SSR-Output
  - Keine versteckten Inputs mit private Daten
- ✅ **No Third-Party-Tracking:**
  - Keine Google Analytics Scripts
  - Keine Facebook Pixel
  - Keine Third-Party-Cookies (nur First-Party für Admin, Epic 5)
- ✅ **DSGVO-konform:**
  - Kein Cookie-Banner nötig (keine Tracking-Cookies)
  - Keine IP-Adressen gespeichert

**Testable:**
```typescript
// Integration Test
test('Privacy filtering works', async ({ page }) => {
  const response = await page.goto('/');
  const cvData = await response.json();

  // Assert: No sensitive fields in API response
  expect(cvData.basics.email).toBeUndefined();
  expect(cvData.basics.phone).toBeUndefined();

  cvData.work?.forEach(job => {
    expect(job.name).toMatch(/Confidential|undefined/);
  });

  cvData.projects?.forEach(project => {
    expect(project.entity).toBeUndefined();
    expect(project.metrics).toBeUndefined();
  });
});

// Manual Audit
// - Network Tab: Keine Third-Party-Requests (Analytics, Tracking)
// - Cookies: Keine Tracking-Cookies gesetzt
```

---

## Traceability Mapping

Die folgende Tabelle mappt Acceptance Criteria auf PRD Requirements, Spec-Sections, API-Endpoints, Components und Test-Strategien.

| AC | PRD Requirement | Spec Section | Component(s) | API Endpoint | Test Strategy |
|----|-----------------|--------------|--------------|--------------|---------------|
| **AC-1** | FR-1: CV-Präsentation (Öffentlich) | Workflows → Initial Page Load | PublicCVPage, HeroSection, SkillsSection, ProjectsSection | GET /api/cv/public | E2E (Playwright): public-cv.spec.ts |
| **AC-2** | NFR: Performance (Lighthouse >90, FCP <1.5s) | NFR → Performance | All Components, SSR Loader | GET /api/cv/public | Lighthouse CI, Performance Budget |
| **AC-3** | FR-1.5: Responsive Design (Mobile/Tablet/Desktop) | System Arch Alignment → Mobile-First | All Components, Tailwind Breakpoints | - | E2E (Playwright): responsive.spec.ts |
| **AC-4** | FR-1.4: Client-Side Filtering | Workflows → Client-Side Filtering | SkillsSection, ProjectsSection, FilterState | - | E2E + Unit: filter.spec.ts |
| **AC-5** | FR-1.6: SEO-Optimierung (Meta-Tags, JSON-LD) | Workflows → SEO Metadata Generation | SEOHead Component, SSR Loader | - | Lighthouse SEO Score, Manual SEO Audit |
| **AC-6** | NFR: Accessibility (WCAG 2.1 Level AA) | NFR → Accessibility, Scope → Accessibility | All Components, shadcn/ui | - | axe DevTools, Lighthouse A11y, Manual Screen-Reader |
| **AC-7** | UX: Smooth Scrolling Navigation | Workflows → Smooth Scrolling Navigation | StickyNav Component | - | E2E (Playwright): navigation.spec.ts |
| **AC-8** | NFR: Reliability/Availability (Error-Handling) | NFR → Reliability, Workflows → Initial Page Load | PublicCVErrorBoundary, usePublicCV Hook | GET /api/cv/public | Integration Test: error-handling.spec.ts |
| **AC-9** | Epic Scope: CI/CD Pipeline | Dependencies → Build & Deployment | GitHub Actions Workflows | - | CI/CD Pipeline Execution (GitHub Actions) |
| **AC-10** | FR-1.2: Privacy-First (Keine sensiblen Daten) | System Arch → Privacy-First Data Filtering | Backend Filter (Epic 2), API Client | GET /api/cv/public | Integration Test: privacy-filtering.spec.ts |

**Traceability-Validierung:**
- ✅ Jedes AC mappt auf mindestens ein PRD Requirement
- ✅ Alle AC sind testbar (automatisch oder manuell)
- ✅ Alle Spec Sections sind durch AC abgedeckt
- ✅ API-Endpoints sind dokumentiert und getestet
- ✅ Test-Strategy ist definiert pro AC

## Risks, Assumptions, Open Questions

### Risks

**Risk 1: Performance-Targets verfehlt (Lighthouse <90)**

**Impact:** Hoch - Performance ist Teil des Value Proposition ("Website demonstriert technische Kompetenz")
**Probability:** Mittel - TanStack Start SSR + Optimierungen sollten ausreichen, aber Bundle-Size könnte problematisch sein
**Mitigation:**
- **Preventive:** Lighthouse CI in Pull Requests (fail bei Score <90)
- **Preventive:** Bundle-Analyse nach jedem Build (vite-bundle-analyzer)
- **Preventive:** Code-Splitting aggressiv nutzen (Route + Component Level)
- **Corrective:** Performance-Profiling mit Chrome DevTools, React Profiler
- **Corrective:** Lazy Loading für Heavy Components (ProjectsSection, ExperienceTimeline)
- **Contingency:** Wenn Bundle-Size Problem → Shadcn/ui Components selective importieren (nicht alle)

**Next Steps:**
- Setup Lighthouse CI in GitHub Actions (Epic 1 bereits vorbereitet)
- Performance-Budget definieren (bereits in lighthouserc.json)
- Baseline-Messung nach MVP-Feature-Complete

---

**Risk 2: TanStack Start RC Instabilität (v1.0 noch nicht released)**

**Impact:** Hoch - Core Framework, könnte Breaking Changes enthalten
**Probability:** Mittel - TanStack Start ist in Release Candidate Phase, nähert sich v1.0
**Mitigation:**
- **Preventive:** Pin TanStack Start Version in package.json (keine `^` ranges)
- **Preventive:** Monitor TanStack GitHub Issues/Releases für Breaking Changes
- **Preventive:** Comprehensive E2E Tests (schützen vor Regression)
- **Corrective:** Fallback-Plan: Migration zu Next.js 15 App Router (ähnliche SSR-Patterns)
- **Contingency:** Budget 1-2 Tage für Migration falls TanStack Start abandoned wird

**Next Steps:**
- Pin Version nach Initial Setup
- Subscribe zu TanStack Start GitHub Release Notifications
- E2E Test-Suite als Regression-Protection

---

**Risk 3: SSR Hydration Mismatch (React 19 + TanStack Start)**

**Impact:** Mittel - Hydration Errors führen zu Console-Warnings, schlechter UX
**Probability:** Mittel - React 19 + SSR ist komplex, Edge Cases möglich
**Mitigation:**
- **Preventive:** Strict TypeScript Config (catch issues früh)
- **Preventive:** React StrictMode in Development (double-rendering detection)
- **Preventive:** No client-only Logic in SSR-rendered Components (z.B. `window` usage ohne check)
- **Corrective:** Hydration-Error-Logging in Production (catch specific issues)
- **Contingency:** Fallback zu Client-Side-Only für problematische Components

**Next Steps:**
- Enable React.StrictMode in Development
- Test SSR Output mit curl (HTML-Validierung)
- Monitor Console-Warnings in Development

---

**Risk 4: shadcn/ui Accessibility-Lücken (Custom Components)**

**Impact:** Mittel - WCAG 2.1 Level AA ist Requirement, Lücken = AC-6 failed
**Probability:** Niedrig - shadcn/ui basiert auf Radix UI (accessible by default)
**Mitigation:**
- **Preventive:** axe DevTools in CI/CD Pipeline (automated A11y testing)
- **Preventive:** Manual Screen-Reader Tests (NVDA/JAWS) vor Launch
- **Preventive:** Lighthouse Accessibility Score >90 enforced
- **Corrective:** Custom Component Audit, ARIA-Labels nachziehen
- **Contingency:** Accessibility Consultant bei schweren Lücken

**Next Steps:**
- Setup axe-core in Playwright Tests
- Manual Screen-Reader Test nach UI-Completion
- Lighthouse A11y Score Baseline

---

**Risk 5: Backend API Downtime (Epic 2 Dependency)**

**Impact:** Hoch - Keine CV-Daten = leere Seite
**Probability:** Niedrig - Lokale SQLite-DB, keine externe Dependencies
**Mitigation:**
- **Preventive:** Retry-Logic in TanStack Query (2 Retries, exponential backoff)
- **Preventive:** Error-Boundary mit Fallback-UI (AC-8)
- **Corrective:** Graceful Degradation (Skeleton Loader → Error-State)
- **Contingency:** Static Fallback-CV (hardcoded JSON für Demo-Zwecke)

**Next Steps:**
- Implement Error-Handling (usePublicCV Hook)
- E2E Test für API-Failure-Scenario
- Optional: Static Fallback-CV für Disaster-Recovery

---

### Assumptions

**Assumption 1: Backend API (`/api/cv/public`) ist verfügbar**
- **Validation:** Epic 2 muss abgeschlossen sein vor Epic 3 Start
- **Impact if False:** Epic 3 blockiert, Frontend kann nicht entwickelt werden
- **Mitigation:** Mock-API für Frontend-Development (JSON-File oder MSW)

**Assumption 2: CV-Daten sind im JSON Resume Format**
- **Validation:** Epic 2 implementiert JSON Resume Schema (Zod)
- **Impact if False:** Frontend muss Data-Transformation implementieren
- **Mitigation:** Shared-Types Package validiert Contract (Runtime + Compile-Time)

**Assumption 3: Keine IE11-Support erforderlich**
- **Validation:** PRD spezifiziert moderne Browser (Chrome, Firefox, Safari)
- **Impact if False:** Polyfills erforderlich, Bundle-Size erhöht
- **Mitigation:** Browserslist-Config definiert Target-Browser (es2020)

**Assumption 4: CV-Daten ändern sich selten (5min Cache valide)**
- **Validation:** User-Feedback nach Launch
- **Impact if False:** Cache muss kürzer sein (1min statt 5min)
- **Mitigation:** TanStack Query staleTime konfigurierbar (Environment-Variable)

**Assumption 5: Keine Multi-Language-Support für MVP**
- **Validation:** PRD Out-of-Scope (Growth-Feature)
- **Impact if False:** i18n-Library erforderlich, Komplexität steigt
- **Mitigation:** i18n-ready Architecture (Content via JSON, nicht hardcoded)

---

### Open Questions

**Question 1: Welches shadcn/ui Theme verwenden? (Default vs. Custom)**
- **Context:** shadcn/ui bietet Default-Theme (Zinc-based), aber Custom Theme möglich
- **Impact:** Visuelle Identität, Branding
- **Decision Needed:** Vor UI-Implementierung
- **Recommendation:** Start mit Default, Custom Theme als Iteration (Post-MVP)

**Question 2: Dark Mode in MVP oder Post-MVP?**
- **Context:** PRD listet Dark Mode als Growth-Feature
- **Impact:** State-Management (Theme-Toggle), CSS-Variablen, Testing-Aufwand
- **Decision Needed:** Vor UI-Implementierung
- **Recommendation:** Post-MVP (Focus auf Performance + A11y zuerst)

**Question 3: Analytics/Tracking in MVP? (Privacy-First vs. User-Insights)**
- **Context:** PRD sagt "No Third-Party-Tracking", aber RUM könnte nützlich sein
- **Impact:** Performance-Insights, Debugging
- **Decision Needed:** Vor Launch
- **Recommendation:** Optional: Self-hosted Plausible/Umami (DSGVO-konform), First-Party

**Question 4: PDF-Export-Feature in MVP?**
- **Context:** PRD listet PDF-Export als Growth-Feature
- **Impact:** Library-Dependency (jsPDF, Puppeteer), Server-Side-Rendering
- **Decision Needed:** Vor Epic-3-Completion
- **Recommendation:** Post-MVP (nicht kritisch für Launch)

**Question 5: Wie viele shadcn/ui Components initial importieren?**
- **Context:** shadcn/ui = Copy-Paste, alle Components erhöhen Bundle-Size
- **Impact:** Bundle-Size, Development-Speed
- **Decision Needed:** Bei Setup
- **Recommendation:** Selective Import (nur benötigte: Button, Card, Badge, Dialog)

---

## Test Strategy Summary

### Test-Pyramid für Epic 3

```
                  ╱╲
                 ╱  ╲
                ╱ E2E╲              ← 10% (Critical User-Flows)
               ╱──────╲
              ╱        ╲
             ╱Integration╲          ← 20% (API Integration, Error-Handling)
            ╱────────────╲
           ╱              ╲
          ╱  Unit Tests    ╲       ← 70% (Components, Hooks, Utils)
         ╱──────────────────╲
```

**Ratio:** 70% Unit, 20% Integration, 10% E2E (Ice Cream Cone vermeiden)

---

### Test-Levels

**1. Unit Tests (70% - Vitest + React Testing Library)**

**Scope:**
- React Components (isolation)
- Custom Hooks (usePublicCV, useFilters)
- Utility Functions (date formatting, filters)
- Zod Schema Validation

**Tools:**
- Vitest (3-4x faster als Jest, Vite-native)
- @testing-library/react (user-centric tests)
- @testing-library/jest-dom (assertions)

**Coverage Target:** >80% Line Coverage

**Examples:**
```typescript
// SkillTag Component Test
describe('SkillTag', () => {
  test('renders skill name', () => {
    render(<SkillTag name="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('applies correct variant', () => {
    const { container } = render(<SkillTag name="React" variant="primary" />);
    expect(container.firstChild).toHaveClass('bg-blue-500');
  });
});

// usePublicCV Hook Test
describe('usePublicCV', () => {
  test('fetches CV data successfully', async () => {
    const { result } = renderHook(() => usePublicCV());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveProperty('basics');
  });

  test('handles errors gracefully', async () => {
    server.use(
      rest.get('/api/cv/public', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => usePublicCV());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

---

**2. Integration Tests (20% - Vitest + MSW)**

**Scope:**
- API-Integration (Frontend ↔ Backend)
- Error-Handling-Flows
- Cache-Behavior (TanStack Query)
- Privacy-Filtering-Validation

**Tools:**
- Vitest
- MSW (Mock Service Worker) - API-Mocking
- @testing-library/react

**Examples:**
```typescript
// API Integration Test
describe('Public CV API Integration', () => {
  test('loads CV from API and renders', async () => {
    server.use(
      rest.get('/api/cv/public', (req, res, ctx) => {
        return res(ctx.json(mockPublicCV));
      })
    );

    render(<PublicCVPage />);

    await waitFor(() => {
      expect(screen.getByText(mockPublicCV.basics.name)).toBeInTheDocument();
    });
  });

  test('validates privacy filtering', async () => {
    const response = await fetch('/api/cv/public');
    const data = await response.json();

    expect(data.basics.email).toBeUndefined();
    expect(data.basics.phone).toBeUndefined();
  });
});
```

---

**3. E2E Tests (10% - Playwright)**

**Scope:**
- Critical User-Flows (Page Load, Navigation, Filtering)
- Cross-Browser-Testing (Chrome, Firefox, Safari)
- Responsive-Testing (Mobile, Tablet, Desktop)
- Performance-Testing (Lighthouse CI)

**Tools:**
- Playwright (Cross-Browser, fast, reliable)
- Lighthouse CI (Performance/A11y/SEO)

**Coverage:** 5-10 kritische Flows

**Examples:**
```typescript
// Critical User-Flow: Page Load
test('Public CV loads successfully', async ({ page }) => {
  await page.goto('/');

  // Assert: Content visible
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-testid="skills-section"]')).toBeVisible();

  // Assert: Performance
  const metrics = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    return { fcp: fcp?.startTime };
  });
  expect(metrics.fcp).toBeLessThan(1500);
});

// Cross-Browser Test
test.describe('Cross-Browser Compatibility', () => {
  test('works in Chrome', async ({ browser }) => {
    const context = await browser.newContext({ browserName: 'chromium' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

---

### Test-Automation Strategy

**CI/CD Pipeline (GitHub Actions):**

```yaml
# .github/workflows/ci.yml
name: CI

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2

      # Unit + Integration Tests
      - name: Run Tests
        run: pnpm --filter frontend test

      # E2E Tests
      - name: Run E2E Tests
        run: |
          pnpm --filter frontend build
          pnpm --filter backend start &
          pnpm --filter frontend preview &
          npx wait-on http://localhost:3000 http://localhost:5173
          pnpm --filter frontend test:e2e

      # Lighthouse CI
      - name: Lighthouse CI
        run: |
          pnpm --filter frontend build
          pnpm --filter frontend preview &
          npx wait-on http://localhost:5173
          lhci autorun --config=lighthouserc.json

      # Accessibility Tests
      - name: axe Accessibility Tests
        run: pnpm --filter frontend test:a11y
```

**Test-Execution-Times (Target):**
- Unit Tests: <30s
- Integration Tests: <1min
- E2E Tests: <3min
- Lighthouse CI: <2min
- **Total CI Time:** <7min

---

### Coverage Requirements

**Code Coverage:**
- **Unit Tests:** >80% Line Coverage
- **Integration Tests:** >60% Coverage (API-Integration)
- **E2E Tests:** 100% Critical User-Flows

**Coverage-Enforcement:**
```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

**Coverage-Report:** HTML-Report in CI-Artifacts, PR-Comment mit Coverage-Diff

---

### Manual Testing

**Pre-Launch Checklist:**
- ✅ Screen-Reader-Test (NVDA/JAWS) - 1 hour
- ✅ Keyboard-Navigation-Test (keine Maus) - 30min
- ✅ Cross-Browser-Test (Chrome, Firefox, Safari Desktop + Mobile) - 1 hour
- ✅ Responsive-Test (5 Viewports: 320px, 768px, 1024px, 1440px, 2560px) - 30min
- ✅ Performance-Profiling (Chrome DevTools) - 30min
- ✅ SEO-Validation (Google Rich Results Test, Twitter Card Validator) - 15min

**Total Manual Testing Time:** ~4 hours

---

### Test-Data Strategy

**Mock CV-Data:**
```typescript
// tests/fixtures/mock-cv.ts
export const mockPublicCV: PublicCV = {
  basics: {
    name: 'Max Mustermann',
    label: 'Senior Full-Stack Engineer',
    summary: 'Experienced software engineer...',
    profiles: [
      { network: 'GitHub', username: 'maxmustermann', url: 'https://github.com/maxmustermann' },
    ],
  },
  skills: [
    { name: 'TypeScript', level: 'Expert', keywords: ['Frontend', 'Backend'] },
    { name: 'React', level: 'Advanced', keywords: ['Frontend'] },
  ],
  projects: [
    {
      name: 'Project Alpha',
      description: 'A cool project',
      keywords: ['TypeScript', 'React'],
      startDate: '2023-01-01',
      endDate: '2024-01-01',
    },
  ],
  work: [
    {
      name: 'Confidential',
      position: 'Senior Engineer',
      startDate: '2020-01-01',
      highlights: ['Led team of 5', 'Increased performance by 40%'],
    },
  ],
};
```

**Test-Data-Maintenance:**
- Mock-Data in `tests/fixtures/` folder
- JSON-Schema-konform (validated via Zod)
- Update Mock-Data wenn Schema ändert

---

### Regression-Prevention

**Strategy:**
- **Snapshot-Tests:** UI-Components (React Testing Library)
- **Visual-Regression-Tests:** Percy/Chromatic (optional, Growth)
- **Performance-Regression:** Lighthouse CI (fail bei Score-Drop >5)
- **Bundle-Size-Regression:** vite-bundle-analyzer (fail bei +20KB)

**Continuous Monitoring:**
- Sentry Error-Tracking (Production)
- Lighthouse CI Trends (track Performance over time)
- Bundle-Size-Trends (GitHub PR Comments)

---

**Test-Strategy-Summary:**
- ✅ 70/20/10 Test-Pyramid
- ✅ Automated Tests in CI/CD
- ✅ >80% Code Coverage
- ✅ Performance/A11y/SEO automated (Lighthouse CI)
- ✅ Manual Testing Checklist vor Launch
- ✅ Regression-Prevention (Snapshots, Lighthouse Trends)
