# Story 3.11: Sitemap und robots.txt generieren

Status: drafted

## Story

Als Entwickler,
möchte ich eine automatisch generierte sitemap.xml und robots.txt,
damit Crawler die Seite optimal indexieren können.

## Acceptance Criteria

1. `sitemap.xml` wird dynamisch generiert (Route: `/sitemap.xml`)
2. Sitemap enthält alle öffentlichen Routen mit `<lastmod>` Timestamp
3. `robots.txt` wird bereitgestellt (Route: `/robots.txt`)
4. robots.txt erlaubt alle Crawler: `User-agent: *` / `Allow: /`
5. Sitemap-URL ist in robots.txt referenziert
6. XML ist valide (validiert via W3C XML Validator)
7. Google Search Console akzeptiert Sitemap

## Tasks / Subtasks

- [ ] Task 1: Sitemap.xml Route erstellen (AC: 1, 2)
  - [ ] Subtask 1.1: TanStack Start Route `/sitemap.xml` anlegen
  - [ ] Subtask 1.2: XML-Generierungs-Logik implementieren (alle öffentlichen Routen)
  - [ ] Subtask 1.3: `<lastmod>` Timestamp aus Build-Zeit oder Git-Commit ableiten
  - [ ] Subtask 1.4: XML Header und Sitemap-Schema korrekt setzen
  - [ ] Subtask 1.5: Content-Type `application/xml` in Response Header setzen
- [ ] Task 2: robots.txt Route erstellen (AC: 3, 4, 5)
  - [ ] Subtask 2.1: TanStack Start Route `/robots.txt` anlegen
  - [ ] Subtask 2.2: Statischen robots.txt Content bereitstellen
  - [ ] Subtask 2.3: `User-agent: *` und `Allow: /` Direktiven setzen
  - [ ] Subtask 2.4: `Sitemap: https://[domain]/sitemap.xml` Referenz hinzufügen
  - [ ] Subtask 2.5: Content-Type `text/plain` in Response Header setzen
- [ ] Task 3: Validierung und Testing (AC: 6, 7)
  - [ ] Subtask 3.1: XML-Validierung via W3C Validator durchführen
  - [ ] Subtask 3.2: Sitemap in Google Search Console hochladen und testen
  - [ ] Subtask 3.3: Playwright E2E-Test für `/sitemap.xml` Endpunkt
  - [ ] Subtask 3.4: Playwright E2E-Test für `/robots.txt` Endpunkt
  - [ ] Subtask 3.5: Sicherstellen, dass Sitemap alle relevanten Routes enthält (/, /invite/:token falls öffentlich)

## Dev Notes

**Technische Anforderungen:**
- TanStack Start File-based Routing für einfache Route-Erstellung
- Sitemap.xml muss XML-Schema 0.9 folgen (https://www.sitemaps.org/protocol.html)
- Robots.txt muss SEO-Best-Practices folgen (Referenz zu Sitemap)
- Beide Files müssen auf Prod-Domain verfügbar sein

**Route-Discovery:**
- Öffentliche Routen:
  - `/` (Public CV Page) - Priority: 1.0, Changefreq: weekly
  - `/invite/:token` (Personalized CV) - NICHT in Sitemap (token-basiert, nicht crawlbar)
- Sitemap sollte nur `/` Route enthalten (MVP)

**Timestamp-Strategie:**
- `<lastmod>`: Build-Zeitpunkt (process.env.BUILD_TIME) oder Git Last-Commit-Date
- Falls nicht verfügbar: Current Date als Fallback
- Format: ISO 8601 (YYYY-MM-DD)

**XML-Struktur Beispiel:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cv-hub.example.com/</loc>
    <lastmod>2025-11-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**robots.txt Beispiel:**
```
User-agent: *
Allow: /

Sitemap: https://cv-hub.example.com/sitemap.xml
```

**Testing Strategy:**
- Unit Test: XML-Generierung korrekt (valides XML, richtige Routes)
- E2E Test: Routes `/sitemap.xml` und `/robots.txt` erreichbar
- Manual: Google Search Console Validation

**Performance:**
- Sitemap wird bei jedem Request generiert (dynamisch)
- Lightweight (nur 1 Route im MVP) - Performance unkritisch
- Falls später viele Routes: Caching erwägen (staleTime: 1 Tag)

**SEO-Impact:**
- Lighthouse SEO Score >90 Ziel (Teil von Epic 3 NFR)
- Google Search Console zeigt erfolgreiche Indexierung
- Crawl-Budget-Optimierung durch klare Sitemap

### Project Structure Notes

**File Locations:**
- Route: `apps/frontend/app/routes/sitemap.xml.tsx` (TanStack Start Route)
- Route: `apps/frontend/app/routes/robots.txt.tsx` (TanStack Start Route)
- Utility (optional): `apps/frontend/lib/generate-sitemap.ts` (Helper-Funktion)

**TanStack Start Route Pattern:**
```typescript
// apps/frontend/app/routes/sitemap.xml.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  loader: async () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cv-hub.example.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // 24h cache
      },
    });
  },
});
```

**Alignment mit Architecture:**
- Keine zusätzliche Backend-Route nötig (Frontend-generiert)
- Stateless (keine DB-Queries)
- SSR-kompatibel (TanStack Start Loader)

### References

- [Source: docs/tech-spec-epic-3.md#SEO-Optimierung]
- [Source: docs/epics.md#Story-3.11]
- [Source: docs/PRD.md#Functional-Requirements-FR-1-CV-Präsentation]
- [Source: https://www.sitemaps.org/protocol.html - Sitemap XML Schema]
- [Source: https://developers.google.com/search/docs/crawling-indexing/robots/intro - robots.txt Best Practices]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Will be filled by dev agent -->

### Debug Log References

<!-- Will be filled by dev agent -->

### Completion Notes List

<!-- Will be filled by dev agent -->

### File List

<!-- Will be filled by dev agent -->
