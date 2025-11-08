# Story 3.10: SEO-Optimierung mit Meta-Tags und JSON-LD

**Epic:** Epic 3 - Public Portfolio Experience
**Story ID:** 3.10
**Story Key:** 3-10-seo-optimierung-mit-meta-tags-und-json-ld
**Status:** drafted
**Erstellt:** 2025-11-07
**Zuletzt aktualisiert:** 2025-11-07

---

## User Story

**Als** Entwickler,
**möchte ich** SEO-Meta-Tags und strukturierte Daten (JSON-LD) automatisch generieren,
**damit** die CV-Seite optimal für Suchmaschinen und Social Media optimiert ist.

---

## Business Context

Diese Story implementiert die SEO-Grundlage für cv-hub's öffentliche Portfolio-Seite. SEO ist kritisch, weil:

1. **Auffindbarkeit:** Die öffentliche CV-Seite soll über Suchmaschinen gefunden werden können
2. **Social Sharing:** Professionelle Preview-Cards auf LinkedIn, Twitter, etc. demonstrieren Qualität
3. **Portfolio-Wert:** Lighthouse SEO Score >90 ist messbare technische Exzellenz
4. **Strukturierte Daten:** JSON-LD mit Schema.org Person-Type verbessert Rich Snippets

**Warum jetzt:** Story 3.10 ist die letzte SEO-kritische Story in Epic 3. Vorherige Stories (3.1-3.9) haben die Content-Basis geschaffen - jetzt machen wir den Content für Suchmaschinen optimal zugänglich.

---

## Technical Context

### Architektur-Kontext

**Tech Stack (TanStack Start Frontend):**
- **Framework:** TanStack Start (RC → v1.0) - Full-document SSR
- **Router:** TanStack Router v1 - File-based routing mit SSR-Support
- **Meta-Tag-Handling:** TanStack Start Head-Export in Route-Files
- **Structured Data:** JSON-LD Script-Tag injection in `<head>`

**SSR-Strategie:**
- Meta-Tags und JSON-LD müssen server-side generiert werden
- TanStack Start Route-Exports ermöglichen `createHead()` für SSR-Meta-Tags
- CV-Daten werden bereits im SSR-Loader geladen (Story 3.4)

**Bestehende Integration:**
- Story 3.3: TanStack Query API-Integration (`usePublicCV()`)
- Story 3.4: Public CV Route mit SSR Loader
- Story 3.5-3.9: CV-Sections rendern Content (Basis für Meta-Tag-Generation)

### Dependencies

**Abhängigkeiten (müssen komplett sein):**
- ✅ Story 3.1: TanStack Start SSR-Architektur
- ✅ Story 3.3: TanStack Query API-Integration
- ✅ Story 3.4: Public CV Route mit SSR Loader (CV-Daten im Loader)
- ✅ Story 3.5: Hero Section (nutzt `basics.name`, `basics.label`, `basics.summary`)

**Blockiert durch:** Keine - alle Prerequisites sind completed

**Blockiert:**
- Story 3.11: Sitemap und robots.txt (braucht konsistente SEO-Struktur)
- Story 3.12: Performance-Optimierung (Lighthouse SEO ist Teil der Targets)

### Technische Constraints

1. **Meta-Tag-Timing:** Müssen server-side generiert werden (kein client-side-only)
2. **JSON-LD-Format:** Muss valides Schema.org Person-Type JSON sein
3. **Performance:** Meta-Tag-Generation darf SSR nicht verlangsamen (<10ms overhead)
4. **Canonical URL:** Muss aus Environment-Variable `VITE_PUBLIC_URL` geladen werden
5. **Image URLs:** Absolute URLs für OG/Twitter Images (CDN oder eigene Domain)

---

## Acceptance Criteria

### Must-Have (für Definition of Done)

1. **Dynamic Title Tag**
   - ✅ `<title>` wird server-side aus CV-Daten generiert
   - ✅ Format: `{basics.name} | {basics.label}` (z.B. "Ruben Müller | Senior Full-Stack Engineer")
   - ✅ Title ist im SSR-HTML vorhanden (nicht nur client-side)
   - ✅ Fallback wenn `basics.name` fehlt: "CV | Professional Portfolio"

2. **Meta Description**
   - ✅ `<meta name="description">` nutzt ersten Satz von `basics.summary`
   - ✅ Max. 160 Zeichen (automatisch gekürzt mit "...")
   - ✅ Fallback wenn `basics.summary` fehlt: "Professional CV and Portfolio"
   - ✅ Server-side gerendert

3. **Open Graph Tags**
   - ✅ `og:title` - identisch mit `<title>`
   - ✅ `og:description` - identisch mit `<meta description>`
   - ✅ `og:type` - hardcoded: "profile"
   - ✅ `og:url` - Canonical URL aus `VITE_PUBLIC_URL` ENV
   - ✅ `og:image` - Optional: `basics.image` oder Fallback-Image
   - ✅ `og:image:alt` - Alt-Text für Image
   - ✅ Alle Tags server-side gerendert

4. **Twitter Cards**
   - ✅ `twitter:card` - hardcoded: "summary_large_image"
   - ✅ `twitter:title` - identisch mit OG Title
   - ✅ `twitter:description` - identisch mit OG Description
   - ✅ `twitter:image` - identisch mit OG Image
   - ✅ `twitter:creator` - Optional: aus `basics.profiles` (Twitter-Handle)
   - ✅ Server-side gerendert

5. **JSON-LD Structured Data (Schema.org Person)**
   - ✅ `<script type="application/ld+json">` im `<head>`
   - ✅ Schema.org Person-Type mit Feldern:
     - `@context`: "https://schema.org"
     - `@type`: "Person"
     - `name`: `basics.name`
     - `jobTitle`: `basics.label`
     - `description`: `basics.summary` (erster Absatz)
     - `url`: Canonical URL
     - `image`: `basics.image` (falls vorhanden)
     - `sameAs`: Array von `basics.profiles` URLs (GitHub, LinkedIn, etc.)
   - ✅ JSON ist valid (kein Syntax Error)
   - ✅ Server-side injected

6. **Canonical URL**
   - ✅ `<link rel="canonical">` gesetzt
   - ✅ URL ist selbstreferenzierend: `{VITE_PUBLIC_URL}/`
   - ✅ ENV-Variable `VITE_PUBLIC_URL` wird verwendet (nicht hardcoded)
   - ✅ Fallback: "http://localhost:5173" in Development

7. **Lighthouse SEO Score**
   - ✅ Lighthouse SEO Score ≥90 für `/` Route
   - ✅ Alle SEO-Audits passed (Meta Description, Canonical, Structured Data)
   - ✅ Manual Check: Google Rich Results Test validiert JSON-LD

8. **Type Safety & Code Quality**
   - ✅ Meta-Tag-Generator als separate Utility-Function (`lib/seo/generate-meta-tags.ts`)
   - ✅ JSON-LD-Generator als separate Utility (`lib/seo/generate-json-ld.ts`)
   - ✅ TypeScript-Typen für Meta-Tag-Config und JSON-LD-Output
   - ✅ Unit-Tests für beide Generator-Functions (80% Coverage minimum)

### Should-Have (Nice-to-Have, aber nicht blockierend)

1. **Enhanced OG/Twitter Cards**
   - ⭕ `og:locale` - "de_DE" oder "en_US" (aus CV-Daten inferiert)
   - ⭕ `twitter:site` - @handle für Website (falls vorhanden)

2. **Extended JSON-LD Fields**
   - ⭕ `email`: `basics.email` (nur wenn public, Privacy-Check!)
   - ⭕ `telephone`: `basics.phone` (nur wenn public, Privacy-Check!)
   - ⭕ `address`: LocationObject aus `basics.location` (nur Stadt/Land, nicht Adresse!)

3. **SEO Meta-Tag Component**
   - ⭕ Reusable `<SEOHead>` Component (optional für Konsistenz)
   - ⭕ Props: `title`, `description`, `imageUrl`, `canonicalUrl`

### Nicht in Scope (Explizit NICHT Teil dieser Story)

- ❌ Sitemap.xml (Story 3.11)
- ❌ robots.txt (Story 3.11)
- ❌ Performance-Optimierung (Story 3.12)
- ❌ Analytics/Tracking-Code (Growth Feature)
- ❌ Multi-Language SEO (Future Epic)
- ❌ Blog/Article Structured Data (nicht anwendbar für CV)

---

## Implementation Plan

### Vorbereitung

**Vorhandener Code (aus Story 3.4):**
```typescript
// apps/frontend/app/routes/index.tsx - Existing SSR Loader
export const Route = createFileRoute('/')({
  loader: async () => {
    // CV-Daten werden bereits server-side geladen
    const cv = await fetchPublicCV();
    return { cv };
  }
});
```

**Zu implementieren:**
1. Meta-Tag-Generator-Utilities
2. JSON-LD-Generator-Utility
3. Integration in Route via TanStack Start `createHead()` Export

---

### Step 1: Meta-Tag-Generator-Utility erstellen

**File:** `apps/frontend/lib/seo/generate-meta-tags.ts`

**Purpose:** Zentralisiert Meta-Tag-Logic für Wiederverwendbarkeit und Testbarkeit

**Implementation:**
```typescript
import { CV } from '@cv-hub/shared-types';

export interface MetaTagsConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  imageAlt?: string;
  twitterCreator?: string;
  ogType?: string;
}

export function generateMetaTags(cv: CV, baseUrl: string): MetaTagsConfig {
  const { basics } = cv;

  // Title: "Name | Label"
  const title = basics.name && basics.label
    ? `${basics.name} | ${basics.label}`
    : basics.name || 'CV | Professional Portfolio';

  // Description: Erster Satz von summary (max 160 chars)
  const description = basics.summary
    ? truncate(basics.summary, 160)
    : 'Professional CV and Portfolio';

  // Canonical URL
  const canonicalUrl = `${baseUrl}/`;

  // Image (optional)
  const imageUrl = basics.image || `${baseUrl}/og-image.png`; // Fallback
  const imageAlt = basics.name
    ? `${basics.name}'s Profile Picture`
    : 'Professional CV Portrait';

  // Twitter Creator (optional)
  const twitterProfile = basics.profiles?.find(p =>
    p.network.toLowerCase() === 'twitter' || p.network.toLowerCase() === 'x'
  );
  const twitterCreator = twitterProfile?.username
    ? `@${twitterProfile.username}`
    : undefined;

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    imageAlt,
    twitterCreator,
    ogType: 'profile'
  };
}

// Helper: Truncate text to max length with ellipsis
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Prefer truncating at sentence end
  const sentences = text.split('. ');
  const firstSentence = sentences[0] + '.';

  if (firstSentence.length <= maxLength) {
    return firstSentence;
  }

  // Fallback: Truncate at word boundary
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}
```

**Test File:** `apps/frontend/lib/seo/generate-meta-tags.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { generateMetaTags } from './generate-meta-tags';
import { CV } from '@cv-hub/shared-types';

describe('generateMetaTags', () => {
  const baseUrl = 'https://cv-hub.example.com';

  const mockCV: CV = {
    basics: {
      name: 'John Doe',
      label: 'Senior Full-Stack Engineer',
      summary: 'Experienced engineer with 10+ years in web development. Passionate about clean code and scalable architectures.',
      image: 'https://example.com/avatar.jpg',
      profiles: [
        { network: 'Twitter', username: 'johndoe', url: 'https://twitter.com/johndoe' }
      ]
    },
    skills: [],
    work: [],
    education: [],
    projects: []
  };

  it('should generate title from name and label', () => {
    const result = generateMetaTags(mockCV, baseUrl);
    expect(result.title).toBe('John Doe | Senior Full-Stack Engineer');
  });

  it('should truncate description at 160 chars', () => {
    const result = generateMetaTags(mockCV, baseUrl);
    expect(result.description.length).toBeLessThanOrEqual(160);
    expect(result.description).toContain('Experienced engineer');
  });

  it('should use fallback title when name is missing', () => {
    const cvWithoutName = { ...mockCV, basics: { ...mockCV.basics, name: undefined } };
    const result = generateMetaTags(cvWithoutName as any, baseUrl);
    expect(result.title).toBe('CV | Professional Portfolio');
  });

  it('should extract Twitter creator from profiles', () => {
    const result = generateMetaTags(mockCV, baseUrl);
    expect(result.twitterCreator).toBe('@johndoe');
  });

  it('should set canonical URL correctly', () => {
    const result = generateMetaTags(mockCV, baseUrl);
    expect(result.canonicalUrl).toBe('https://cv-hub.example.com/');
  });
});
```

---

### Step 2: JSON-LD-Generator-Utility erstellen

**File:** `apps/frontend/lib/seo/generate-json-ld.ts`

```typescript
import { CV } from '@cv-hub/shared-types';

export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}

export function generatePersonJsonLd(cv: CV, baseUrl: string): PersonSchema {
  const { basics } = cv;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: basics.name || 'Unknown',
    jobTitle: basics.label,
    description: basics.summary ? extractFirstParagraph(basics.summary) : undefined,
    url: `${baseUrl}/`,
    image: basics.image,
    sameAs: basics.profiles?.map(p => p.url).filter(Boolean)
  };
}

// Helper: Extract first paragraph from multi-paragraph text
function extractFirstParagraph(text: string): string {
  const paragraphs = text.split('\n\n');
  return paragraphs[0].trim();
}
```

**Test File:** `apps/frontend/lib/seo/generate-json-ld.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { generatePersonJsonLd } from './generate-json-ld';
import { CV } from '@cv-hub/shared-types';

describe('generatePersonJsonLd', () => {
  const baseUrl = 'https://cv-hub.example.com';

  const mockCV: CV = {
    basics: {
      name: 'Jane Smith',
      label: 'Product Designer',
      summary: 'Creative designer specializing in UX/UI.\n\nPassionate about user-centered design.',
      image: 'https://example.com/jane.jpg',
      profiles: [
        { network: 'LinkedIn', url: 'https://linkedin.com/in/janesmith' },
        { network: 'GitHub', url: 'https://github.com/janesmith' }
      ]
    },
    skills: [],
    work: [],
    education: [],
    projects: []
  };

  it('should generate valid Person schema', () => {
    const result = generatePersonJsonLd(mockCV, baseUrl);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Person');
    expect(result.name).toBe('Jane Smith');
    expect(result.jobTitle).toBe('Product Designer');
  });

  it('should extract first paragraph for description', () => {
    const result = generatePersonJsonLd(mockCV, baseUrl);
    expect(result.description).toBe('Creative designer specializing in UX/UI.');
    expect(result.description).not.toContain('Passionate'); // Second paragraph
  });

  it('should include sameAs array with profile URLs', () => {
    const result = generatePersonJsonLd(mockCV, baseUrl);
    expect(result.sameAs).toEqual([
      'https://linkedin.com/in/janesmith',
      'https://github.com/janesmith'
    ]);
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalCV: CV = {
      basics: { name: 'John' },
      skills: [],
      work: [],
      education: [],
      projects: []
    };

    const result = generatePersonJsonLd(minimalCV, baseUrl);
    expect(result.name).toBe('John');
    expect(result.jobTitle).toBeUndefined();
    expect(result.sameAs).toBeUndefined();
  });
});
```

---

### Step 3: TanStack Start Route mit `createHead()` erweitern

**File:** `apps/frontend/app/routes/index.tsx` (Update)

**Implementation:**
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { fetchPublicCV } from '@/lib/api';
import { generateMetaTags } from '@/lib/seo/generate-meta-tags';
import { generatePersonJsonLd } from '@/lib/seo/generate-json-ld';
import { PublicCVPage } from '@/components/pages/PublicCVPage';

// SSR Loader (existing from Story 3.4)
export const Route = createFileRoute('/')({
  loader: async () => {
    const cv = await fetchPublicCV();
    return { cv };
  },

  // NEW: Meta-Tags via createHead()
  head: ({ loaderData }) => {
    const { cv } = loaderData;
    const baseUrl = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173';

    const metaTags = generateMetaTags(cv, baseUrl);
    const jsonLd = generatePersonJsonLd(cv, baseUrl);

    return {
      title: metaTags.title,
      meta: [
        // Basic Meta
        { name: 'description', content: metaTags.description },

        // Open Graph
        { property: 'og:title', content: metaTags.title },
        { property: 'og:description', content: metaTags.description },
        { property: 'og:type', content: metaTags.ogType },
        { property: 'og:url', content: metaTags.canonicalUrl },
        { property: 'og:image', content: metaTags.imageUrl },
        { property: 'og:image:alt', content: metaTags.imageAlt },

        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: metaTags.title },
        { name: 'twitter:description', content: metaTags.description },
        { name: 'twitter:image', content: metaTags.imageUrl },
        ...(metaTags.twitterCreator
          ? [{ name: 'twitter:creator', content: metaTags.twitterCreator }]
          : []
        )
      ],
      links: [
        // Canonical URL
        { rel: 'canonical', href: metaTags.canonicalUrl }
      ],
      scripts: [
        // JSON-LD Structured Data
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd)
        }
      ]
    };
  },

  component: RouteComponent
});

function RouteComponent() {
  const { cv } = Route.useLoaderData();
  return <PublicCVPage cv={cv} />;
}
```

---

### Step 4: Environment-Variable für Public URL

**File:** `apps/frontend/.env.example` (Update)

```bash
# Base URL für Production (ohne trailing slash)
VITE_PUBLIC_URL=https://cv-hub.example.com

# Development Fallback: http://localhost:5173
```

**File:** `apps/frontend/.env.development` (optional, für lokale Tests)
```bash
VITE_PUBLIC_URL=http://localhost:5173
```

**Deployment-Note:** Production `.env` muss `VITE_PUBLIC_URL` mit echter Domain setzen.

---

### Step 5: TypeScript Type-Definitions

**File:** `apps/frontend/lib/seo/types.ts` (optional, für Klarheit)

```typescript
export interface SEOConfig {
  metaTags: MetaTagsConfig;
  jsonLd: PersonSchema;
}

export type { MetaTagsConfig } from './generate-meta-tags';
export type { PersonSchema } from './generate-json-ld';
```

---

## Testing Strategy

### Unit Tests (Vitest)

**Coverage Target:** 80% minimum für SEO-Utilities

1. **`generate-meta-tags.test.ts`**
   - Test all meta-tag fields generation
   - Test truncation logic (description <160 chars)
   - Test fallback logic (missing name, summary)
   - Test Twitter creator extraction
   - Edge cases: Empty CV, nur Name ohne Label

2. **`generate-json-ld.test.ts`**
   - Test valid Schema.org Person output
   - Test paragraph extraction logic
   - Test sameAs array generation
   - Edge cases: Missing profiles, missing summary

**Run Command:**
```bash
pnpm --filter @cv-hub/frontend test lib/seo
```

---

### Integration Tests

**Test:** SSR Meta-Tags vorhanden im HTML

**File:** `apps/frontend/test/seo.integration.test.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('SEO Meta-Tags', () => {
  test('should have dynamic title tag in SSR HTML', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toContain('|'); // Format: "Name | Label"
  });

  test('should have meta description', async ({ page }) => {
    await page.goto('/');

    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description.length).toBeLessThanOrEqual(160);
  });

  test('should have Open Graph tags', async ({ page }) => {
    await page.goto('/');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const ogType = await page.getAttribute('meta[property="og:type"]', 'content');

    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogType).toBe('profile');
  });

  test('should have Twitter Card tags', async ({ page }) => {
    await page.goto('/');

    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    expect(twitterCard).toBe('summary_large_image');
  });

  test('should have canonical link', async ({ page }) => {
    await page.goto('/');

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toMatch(/^https?:\/\//); // Absolute URL
  });

  test('should have valid JSON-LD structured data', async ({ page }) => {
    await page.goto('/');

    const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLdScript).toBeTruthy();

    const jsonLd = JSON.parse(jsonLdScript!);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBeTruthy();
  });
});
```

**Run Command:**
```bash
pnpm --filter @cv-hub/frontend test:e2e seo.integration
```

---

### Manual Testing (Lighthouse & Validation Tools)

**1. Lighthouse SEO Audit**

```bash
# Install Lighthouse CLI (if not in CI)
npm install -g @lhci/cli

# Run Lighthouse on local dev server
lhci autorun --config=.lighthouserc.json
```

**Target:** SEO Score ≥90

**2. Google Rich Results Test**

1. Start dev server: `pnpm dev`
2. Expose localhost via ngrok: `ngrok http 5173`
3. Test JSON-LD: https://search.google.com/test/rich-results
4. Verify: "Person" structured data detected

**3. Social Media Preview Tools**

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

**Expected:** Preview Cards zeigen Title, Description, Image korrekt

---

## Documentation

### Developer Docs

**File:** `apps/frontend/README.md` (Update - SEO Section)

```markdown
## SEO Configuration

### Environment Variables

- `VITE_PUBLIC_URL` - Base URL for canonical links and Open Graph (required in production)

### Meta-Tag Generation

Meta-tags and JSON-LD are generated server-side via TanStack Start's `head()` export.

**Utilities:**
- `lib/seo/generate-meta-tags.ts` - Meta-tag logic
- `lib/seo/generate-json-ld.ts` - JSON-LD schema generation

**Testing:**
```bash
# Unit tests
pnpm test lib/seo

# Lighthouse SEO
lhci autorun
```

**Validation:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Open Graph Debugger: https://developers.facebook.com/tools/debug/
```

---

### User-Facing Docs (Optional)

**File:** `docs/SEO-GUIDE.md` (für README-Link)

```markdown
# cv-hub SEO Guide

cv-hub is optimized for search engines and social media sharing.

## What's Included

- **Dynamic Title & Description:** Generated from your CV data
- **Open Graph Tags:** Professional preview cards on LinkedIn, Twitter, Facebook
- **JSON-LD Structured Data:** Schema.org Person type for rich snippets
- **Canonical URLs:** Prevents duplicate content issues

## How to Customize

### Image for Social Previews

Add `basics.image` to your CV JSON:
```json
{
  "basics": {
    "image": "https://your-cdn.com/avatar.jpg"
  }
}
```

### Twitter Handle

Add Twitter profile to `basics.profiles`:
```json
{
  "basics": {
    "profiles": [
      {
        "network": "Twitter",
        "username": "yourhandle",
        "url": "https://twitter.com/yourhandle"
      }
    ]
  }
}
```

## Validation

Use these tools to verify SEO:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
```

---

## Affected Files

**New Files:**
```
apps/frontend/lib/seo/generate-meta-tags.ts
apps/frontend/lib/seo/generate-meta-tags.test.ts
apps/frontend/lib/seo/generate-json-ld.ts
apps/frontend/lib/seo/generate-json-ld.test.ts
apps/frontend/lib/seo/types.ts (optional)
apps/frontend/test/seo.integration.test.ts
docs/SEO-GUIDE.md (optional)
```

**Updated Files:**
```
apps/frontend/app/routes/index.tsx (add head() export)
apps/frontend/.env.example (add VITE_PUBLIC_URL)
apps/frontend/README.md (SEO section)
apps/frontend/.lighthouserc.json (SEO assertions, falls noch nicht vorhanden)
```

**Dependencies (new):**
```json
{
  "devDependencies": {
    "@lhci/cli": "^0.13.0" // Lighthouse CI (falls noch nicht vorhanden)
  }
}
```

---

## Definition of Done

### Code Complete

- ✅ Alle Must-Have Acceptance Criteria erfüllt
- ✅ Unit-Tests geschrieben und passed (Coverage ≥80% für SEO-Utilities)
- ✅ Integration-Tests geschrieben und passed
- ✅ Code-Review completed (mindestens 1 Reviewer)
- ✅ Keine ESLint/TypeScript-Errors

### Quality Gates

- ✅ Lighthouse SEO Score ≥90 (CI-Check)
- ✅ Google Rich Results Test validiert JSON-LD erfolgreich
- ✅ Open Graph Preview funktioniert (manuell mit Facebook Debugger getestet)
- ✅ Twitter Card Preview funktioniert (manuell mit Twitter Validator getestet)

### Documentation

- ✅ README.md updated (SEO-Section)
- ✅ Code-Kommentare vorhanden (komplexe Logic erklärt)
- ✅ Optional: SEO-GUIDE.md für User erstellt

### Deployment Ready

- ✅ Environment-Variable `VITE_PUBLIC_URL` in Production-Config dokumentiert
- ✅ Fallback-Logic für Development funktioniert (localhost)
- ✅ Keine Hardcoded Production-URLs im Code

---

## Implementation Notes

### Edge Cases zu beachten

1. **Fehlende CV-Daten:**
   - Immer Fallbacks vorsehen (z.B. kein `basics.name` → "CV | Professional Portfolio")
   - Nie `undefined` oder `null` in Meta-Tags (Lighthouse-Fehler)

2. **Lange Texte:**
   - Description-Truncation muss an Satzende oder Wortgrenze abschneiden (kein Mid-Word-Cut)
   - First-Paragraph-Extraction für JSON-LD (nicht ganzer Summary-Text)

3. **Image URLs:**
   - Müssen absolute URLs sein (relative Pfade funktionieren nicht in OG/Twitter)
   - Fallback-Image muss existieren (`public/og-image.png`)

4. **Environment-Variables:**
   - `VITE_PUBLIC_URL` darf NICHT mit `/` enden (sonst `//` im Canonical)
   - Development-Fallback muss ohne Config funktionieren

### Performance-Considerations

- Meta-Tag-Generation synchron im SSR-Loader (kein async overhead)
- JSON-LD serialization ist lightweight (<1ms)
- Keine externen API-Calls für Meta-Tags (alles aus CV-Daten)

### Security-Considerations

- XSS-Prevention: Alle CV-Daten in Meta-Tags müssen sanitized sein (TanStack Start macht das automatisch)
- JSON-LD: `JSON.stringify()` escaped automatisch problematic characters
- Keine User-Inputs direkt in Meta-Tags (CV-Daten kommen aus Backend, validiert via Zod)

---

## Open Questions / Risks

**NONE** - Story ist klar definiert, alle Abhängigkeiten sind resolved.

**Potenzielle Blocker:**
- ⚠️ Wenn `VITE_PUBLIC_URL` nicht gesetzt ist in Production → Canonical URL falsch
  - **Mitigation:** .env.example dokumentiert, CI-Check empfohlen

**Future Enhancements (nicht in Scope):**
- Multi-Language SEO (hreflang Tags) - Future Epic
- Dynamic OG Images generieren (mit User-Avatar overlay) - Growth Feature
- Article/BlogPosting structured data (wenn Blog hinzugefügt wird) - Future

---

## Story Complete

Diese Story ist **drafted** und bereit für Sprint Planning.

**Geschätzter Aufwand:** 3-5 Story Points (1-2 Developer-Days)

**Dependencies-Status:** ✅ Alle Prerequisites completed (Story 3.1-3.9)

**Next Story:** Story 3.11 - Sitemap und robots.txt generieren

---

**Story erstellt durch:** BMAD Scrum Master (Bob)
**Workflow:** create-story (non-interactive mode)
**Basis-Dokumente:** PRD, Epic 3, Tech Spec Epic 3, UX Design Specification, Architecture
