# lebenslauf - Epic Breakdown

**Author:** Ruben
**Date:** 2025-11-04
**Project Level:** Level 2 (Multi-Epic Project)
**Target Scale:** Personal CV-Management-System mit Privacy-by-Design

---

## Overview

This document provides the detailed epic breakdown for lebenslauf, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Project Foundation & Infrastructure

**Goal:** Etabliere die technische Basis für Backend, Frontend und lokales Development-Environment

**Value Proposition:**
Ohne stabile Foundation ist kein Feature umsetzbar. Diese Epic schafft die Grundlage für alle weiteren Entwicklungen - einmalige Investition, die sich über das gesamte Projekt auszahlt.

**Scope:**
- Projekt-Setup (Monorepo mit NestJS Backend + Vite Frontend)
- SQLite-Datenbank-Integration mit TypeORM
- Basic API-Struktur (Health-Check, Logging, Error-Handling)
- Docker-Setup für lokale Entwicklung
- CI/CD-Pipeline (GitHub Actions: Linting, Tests)
- Development-Tooling (ESLint, Prettier, Husky)
- Environment-Configuration (.env-Management)

**Out of Scope:**
- Production Deployment (Epic 7)
- Spezifische Business-Features (folgende Epics)

**Dependencies:**
Keine (Start-Epic)

**Key Deliverables:**
- ✅ `docker-compose.yml` für lokales Development
- ✅ Backend läuft auf `localhost:3000`
- ✅ Frontend läuft auf `localhost:5173`
- ✅ CI/CD-Pipeline erfolgreich
- ✅ README mit Setup-Anleitung

**Estimated Effort:** 1 Sprint (1-2 Wochen)

### Stories

**Story 1.1: Monorepo mit pnpm Workspaces initialisieren**

Als Entwickler,
möchte ich eine funktionierende Monorepo-Struktur mit pnpm Workspaces,
damit Backend, Frontend und Shared-Packages effizient verwaltet werden können.

**Acceptance Criteria:**
1. Root `package.json` mit pnpm Workspaces-Konfiguration existiert
2. Ordnerstruktur: `apps/backend`, `apps/frontend`, `packages/shared-types`
3. `pnpm install` funktioniert und installiert Dependencies für alle Workspaces
4. Workspace-Dependencies können referenziert werden (z.B. `@cv-hub/shared-types`)
5. `.gitignore` konfiguriert für node_modules, .env, build-outputs

**Prerequisites:** Keine (Start-Story)

---

**Story 1.2: NestJS Backend-Grundstruktur erstellen**

Als Entwickler,
möchte ich ein lauffähiges NestJS Backend mit Health-Check,
damit die API-Basis für alle Features steht.

**Acceptance Criteria:**
1. NestJS-Projekt in `apps/backend` initialisiert (NestJS v11, Node.js 20 LTS)
2. Health-Check-Endpoint `GET /api/health` liefert Status-JSON
3. Server startet auf Port 3000
4. Strukturiertes Logging mit Pino (nestjs-pino) funktioniert
5. Environment-Variablen werden über `@nestjs/config` geladen
6. Helmet und CORS sind konfiguriert (CORS: localhost:5173 erlaubt)

**Prerequisites:** Story 1.1 (Monorepo steht)

---

**Story 1.3: SQLite-Datenbank mit TypeORM integrieren**

Als Entwickler,
möchte ich eine funktionierende SQLite-Datenbank-Verbindung,
damit Entities persistiert werden können.

**Acceptance Criteria:**
1. TypeORM in `apps/backend` konfiguriert
2. SQLite-Datenbank-Datei wird unter `data/cv-hub.db` erstellt
3. Database-Connection wird beim Server-Start etabliert
4. Health-Check-Endpoint zeigt DB-Status (`connected` / `disconnected`)
5. TypeORM-CLI-Befehle funktionieren (Migrations generieren/ausführen)
6. Dummy-Entity (z.B. `SystemConfig`) kann erstellt und gelesen werden

**Prerequisites:** Story 1.2 (NestJS-Basis steht)

---

**Story 1.4: TanStack Start Frontend initialisieren**

Als Entwickler,
möchte ich ein lauffähiges TanStack Start Frontend mit React 19,
damit die UI-Basis für alle Features steht.

**Acceptance Criteria:**
1. TanStack Start-Projekt in `apps/frontend` initialisiert (React 19, TypeScript)
2. Dev-Server startet auf Port 5173
3. Root-Route (`/`) rendert eine Platzhalter-Seite ("cv-hub - Coming Soon")
4. Tailwind CSS v4 ist konfiguriert und funktioniert
5. shadcn/ui ist integriert (mindestens 1 Komponente, z.B. Button)
6. TanStack Router file-based routing funktioniert

**Prerequisites:** Story 1.1 (Monorepo steht)

---

**Story 1.5: Docker Compose für lokale Entwicklung**

Als Entwickler,
möchte ich Backend und Frontend via Docker Compose starten,
damit die lokale Entwicklungsumgebung konsistent ist.

**Acceptance Criteria:**
1. `docker-compose.yml` definiert Services: `backend`, `frontend`
2. `docker-compose up` startet beide Services erfolgreich
3. Backend erreichbar unter `http://localhost:3000`
4. Frontend erreichbar unter `http://localhost:5173`
5. SQLite-Datenbank ist persistent (Volume gemountet)
6. Hot-Reload funktioniert für Backend (nodemon) und Frontend (Vite)
7. Logs beider Services sind in Console sichtbar

**Prerequisites:** Story 1.2, 1.3, 1.4 (Backend + Frontend stehen)

---

**Story 1.6: Shared Types Package mit Zod**

Als Entwickler,
möchte ich gemeinsame TypeScript-Types und Zod-Schemas zwischen Frontend und Backend teilen,
damit End-to-End Type-Safety gewährleistet ist.

**Acceptance Criteria:**
1. `packages/shared-types` package existiert
2. Mindestens 1 Zod-Schema exportiert (z.B. `HealthCheckResponseSchema`)
3. TypeScript-Types werden aus Zod-Schemas generiert (`z.infer<>`)
4. Backend kann Schema importieren und nutzen (`@cv-hub/shared-types`)
5. Frontend kann Schema importieren und nutzen
6. Build-Prozess funktioniert (TypeScript-Compilation für shared package)

**Prerequisites:** Story 1.1, 1.2, 1.4 (Monorepo + Backend + Frontend)

---

**Story 1.7: CI/CD-Pipeline mit GitHub Actions (Linting & Type-Check)**

Als Entwickler,
möchte ich automatisches Linting und Type-Checking bei jedem Push,
damit Code-Qualität gesichert ist.

**Acceptance Criteria:**
1. GitHub Actions Workflow `.github/workflows/ci.yml` existiert
2. Workflow triggert bei Push und Pull Request
3. ESLint läuft für Backend und Frontend (shared config)
4. Prettier-Check läuft (Code-Formatierung validiert)
5. TypeScript-Type-Checking läuft für alle Workspaces
6. Workflow schlägt fehl bei Linting/Type-Errors
7. Status-Badge kann zu README hinzugefügt werden

**Prerequisites:** Story 1.1-1.6 (Projekt-Setup komplett)

---

**Story 1.8: CI/CD-Pipeline Unit-Tests**

Als Entwickler,
möchte ich automatische Unit-Tests in der CI-Pipeline,
damit Regressions früh erkannt werden.

**Acceptance Criteria:**
1. Vitest für Frontend konfiguriert (in `apps/frontend`)
2. Jest für Backend konfiguriert (in `apps/backend`)
3. Mindestens 1 Dummy-Test pro App (z.B. Health-Check-Test)
4. GitHub Actions Workflow führt Tests aus
5. Test-Coverage-Report wird generiert (optional: zu GitHub hochgeladen)
6. Workflow schlägt fehl bei fehlgeschlagenen Tests

**Prerequisites:** Story 1.7 (CI-Pipeline-Basis)

---

**Story 1.9: Development Tooling (Husky, lint-staged)**

Als Entwickler,
möchte ich Pre-Commit-Hooks für automatisches Linting und Formatierung,
damit schlechter Code gar nicht erst committed wird.

**Acceptance Criteria:**
1. Husky Pre-Commit-Hook installiert
2. lint-staged konfiguriert (läuft nur auf staged files)
3. Bei `git commit`: ESLint und Prettier laufen automatisch
4. Commit wird blockiert bei Linting-Fehlern
5. Prettier auto-fixed staged files vor Commit
6. README dokumentiert Tooling-Setup

**Prerequisites:** Story 1.7 (Linting-Setup steht)

---

**Story 1.10: Dokumentation & README**

Als Entwickler,
möchte ich eine vollständige README mit Setup-Anleitung,
damit andere (oder ich in Zukunft) das Projekt schnell starten können.

**Acceptance Criteria:**
1. `README.md` enthält:
   - Projekt-Beschreibung
   - Tech-Stack-Übersicht
   - Setup-Anleitung (Prerequisites, Installation, Start)
   - Development-Workflow (Linting, Testing, Docker)
   - Ordnerstruktur-Übersicht
2. Environment-Variablen sind dokumentiert (`.env.example`)
3. Architektur-Diagramm (optional, Mermaid oder inline Text)
4. Contribution-Guidelines (für Open Source)
5. License (z.B. MIT)

**Prerequisites:** Story 1.1-1.9 (Projekt komplett)

---

## Epic 2: CV Data Foundation

**Goal:** Strukturierte CV-Daten mit JSON Resume Schema und API-Endpoints für Public/Private-Zugriff

**Value Proposition:**
Das Herzstück von cv-hub. Ohne strukturierte Daten und Privacy-Logik funktioniert weder die öffentliche Seite noch das personalisierte Link-System. Diese Epic definiert die Datenarchitektur für das gesamte Projekt.

**Scope:**
- JSON Resume Schema-Integration (https://jsonresume.org/schema)
- CV-Daten-Models (TypeORM Entities)
- API-Endpoints:
  - `GET /api/cv/public` - Öffentliche CV-Daten (ohne sensible Infos)
  - `GET /api/cv/private/:token` - Vollständiger CV (nach Token-Validierung)
- Privacy-Filtering-Logik (Public vs. Private Subsets)
- Versionierung (Timestamped Backups bei Änderungen)
- OpenAPI/Swagger-Dokumentation für API
- Seed-Data für lokale Entwicklung (Beispiel-CV)

**Out of Scope:**
- KI-Extraktion (Epic 6)
- Frontend-Darstellung (Epic 3)
- Token-Generierung (Epic 4)

**Dependencies:**
Epic 1 (Foundation muss stehen)

**Key Deliverables:**
- ✅ CV-Daten validieren gegen JSON Resume Schema
- ✅ API-Endpoints liefern korrekte Daten
- ✅ Public/Private-Filtering funktioniert
- ✅ Swagger-Docs unter `/api/docs` verfügbar
- ✅ Versionierung funktioniert (Backup-Mechanismus)

**Estimated Effort:** 1 Sprint (1-2 Wochen)

---

### Stories

**Story 2.1: JSON Resume Schema mit Zod in Shared Types Package**

Als Entwickler,
möchte ich ein validiertes JSON Resume Schema in shared-types,
damit Backend und Frontend Type-Safety für CV-Daten haben.

**Acceptance Criteria:**
1. Zod-Schema `CVSchema` existiert in `packages/shared-types/src/cv-schema.ts`
2. Schema umfasst alle JSON Resume Core-Felder: `basics`, `work`, `education`, `skills`, `projects`, `volunteer`
3. cv-hub Extensions implementiert: `isPrivate` (boolean), `metrics` (string), `entity` (string)
4. TypeScript-Types automatisch inferiert: `type CV = z.infer<typeof CVSchema>`
5. Sub-Schemas exportiert: `BasicsSchema`, `WorkSchema`, `EducationSchema`, `SkillSchema`, `ProjectSchema`, `VolunteerSchema`
6. Unit-Tests validieren Schema: Valid Data parsed, Invalid Data wirft ZodError
7. Package baut erfolgreich: `pnpm build` in shared-types

**Prerequisites:** Story 1.1, 1.6 (Monorepo + Shared Types Package existiert)

**Affected Files:**
- `packages/shared-types/src/cv-schema.ts` (neu)
- `packages/shared-types/src/index.ts` (export hinzufügen)
- `packages/shared-types/package.json` (zod dependency)

---

**Story 2.2: CV und CVVersion TypeORM Entities mit Migration**

Als Entwickler,
möchte ich TypeORM-Entities für CV-Daten und Versionierung,
damit CV-Daten persistent gespeichert werden können.

**Acceptance Criteria:**
1. `CVEntity` existiert in `apps/backend/src/modules/cv/entities/cv.entity.ts`
   - Felder: `id` (primary key), `data` (text, JSON string), `updatedAt` (datetime)
2. `CVVersionEntity` existiert in `apps/backend/src/modules/cv/entities/cv-version.entity.ts`
   - Felder: `id`, `cvId`, `data`, `status`, `source`, `fileHash`, `createdAt`
   - Status Constraint: `'draft' | 'active' | 'archived'`
   - Foreign Key: `cvId` → `cv.id`
3. Migration `CreateCVTables` erstellt Tabellen `cv` und `cv_versions`
4. Indexes angelegt: `idx_cv_versions_cv_id`, `idx_cv_versions_status`, `idx_cv_versions_created_at`
5. Migration läuft erfolgreich: `npm run migration:run`
6. SQLite-Schema validiert: Tabellen existieren in `data/cv-hub.db`

**Prerequisites:** Story 1.3 (TypeORM-Integration steht)

**Affected Files:**
- `apps/backend/src/modules/cv/entities/cv.entity.ts` (neu)
- `apps/backend/src/modules/cv/entities/cv-version.entity.ts` (neu)
- `apps/backend/src/database/migrations/TIMESTAMP-CreateCVTables.ts` (neu)

---

**Story 2.3: Seed Data für Beispiel-CV mit JSON Resume Format**

Als Entwickler,
möchte ich Seed-Data für einen Beispiel-CV,
damit lokales Development mit realistischen Daten möglich ist.

**Acceptance Criteria:**
1. Beispiel-CV existiert: `apps/backend/seeds/example-cv.json`
2. CV validiert gegen `CVSchema` (alle Required-Felder vorhanden)
3. CV enthält Privacy-Test-Cases:
   - Public Fields: name, label, summary, city, skills (ohne level), public projects
   - Private Fields: email, phone, address, skill levels, private projects, company names, metrics
4. Seed-Script existiert: `apps/backend/src/database/seeds/cv.seed.ts`
5. Script ist idempotent: Prüft ob CV bereits existiert, skippt bei Duplikat
6. Command `npm run seed` funktioniert und logged Success
7. Nach Seeding: `cv` Tabelle enthält Entry mit `id: 1`

**Prerequisites:** Story 2.1, 2.2 (Schema + Entities existieren)

**Affected Files:**
- `apps/backend/seeds/example-cv.json` (neu)
- `apps/backend/src/database/seeds/cv.seed.ts` (neu)
- `apps/backend/package.json` (seed script)

---

**Story 2.4: Privacy Filter Service für Public/Private Data Filtering**

Als Entwickler,
möchte ich einen Service der private CV-Daten filtert,
damit öffentliche API-Requests keine sensiblen Daten leaken.

**Acceptance Criteria:**
1. `PrivacyFilterService` existiert in `apps/backend/src/modules/cv/services/privacy-filter.service.ts`
2. Method `filterPublicSubset(cv: CV): CV` implementiert
3. Filtering-Logik entfernt Private Fields:
   - `basics.email`, `basics.phone` → undefined
   - `basics.location.address`, `basics.location.postalCode` → undefined
   - `skills[].level` → undefined
   - `projects` → nur `isPrivate: false` Projekte
   - `work[].name` → "Confidential" (redacted)
   - `work[].highlights` → max 3 Items
   - `projects[].entity`, `projects[].metrics` → undefined
4. Immutable Operation: Original-CV nicht mutiert
5. Performance <10ms für typischen CV (50KB JSON)
6. Unit-Tests mit 100% Coverage für alle Private Fields

**Prerequisites:** Story 2.1 (CVSchema existiert)

**Affected Files:**
- `apps/backend/src/modules/cv/services/privacy-filter.service.ts` (neu)
- `apps/backend/src/modules/cv/services/privacy-filter.service.spec.ts` (neu)

---

**Story 2.5: CV Service mit getCV, updateCV, Versionierung**

Als Entwickler,
möchte ich einen CV Service für Business-Logic,
damit CV-Daten konsistent verwaltet werden.

**Acceptance Criteria:**
1. `CVService` existiert in `apps/backend/src/modules/cv/services/cv.service.ts`
2. Method `getCV(context: 'public' | 'authenticated')` implementiert:
   - Lädt CV aus Database (TypeORM Repository)
   - Validiert gegen `CVSchema`
   - Ruft `PrivacyFilterService` bei `context: 'public'`
   - Returns full CV bei `context: 'authenticated'`
3. Method `updateCV(updateDto: Partial<CV>)` implementiert:
   - Startet Transaction
   - Archiviert aktuelle Version: INSERT in `cv_versions` mit `status: 'archived'`, `source: 'api-update'`
   - Updated CV: UPDATE `cv` mit neuen Daten
   - Committed Transaction
   - Rollback bei Fehler
4. Error Handling für DB-Fehler, Validation-Fehler
5. Unit-Tests für Service-Methoden

**Prerequisites:** Story 2.2, 2.4 (Entities + Privacy Filter)

**Affected Files:**
- `apps/backend/src/modules/cv/services/cv.service.ts` (neu)
- `apps/backend/src/modules/cv/services/cv.service.spec.ts` (neu)

---

**Story 2.6: GET /api/cv/public Endpoint mit Caching**

Als Entwickler,
möchte ich einen Public-API-Endpoint für gefilterte CV-Daten,
damit die öffentliche Website CV-Daten abrufen kann.

**Acceptance Criteria:**
1. `CVController` existiert mit `GET /api/cv/public` Endpoint
2. Endpoint ruft `CVService.getCV('public')` auf
3. Response Format: `{ success: true, data: CV }`
4. Caching aktiviert: 5 Minuten TTL
5. ETag Header gesetzt für Cache-Validation
6. Rate-Limiting: 100 requests/15min pro IP
7. Response Time <100ms (p95)
8. Integration-Test validiert:
   - HTTP 200 Status
   - Filtered CV (keine private Felder)
   - Cache-Headers vorhanden

**Prerequisites:** Story 2.5 (CVService steht)

**Affected Files:**
- `apps/backend/src/modules/cv/controllers/cv.controller.ts` (neu)
- `apps/backend/src/modules/cv/cv.module.ts` (neu)
- `apps/backend/test/cv.e2e-spec.ts` (neu)

---

**Story 2.7: GET /api/cv/private/:token Endpoint (Placeholder Guard)**

Als Entwickler,
möchte ich einen Token-basierten Endpoint für vollständigen CV,
damit personalisierte Links (Epic 4) vollständige Daten abrufen können.

**Acceptance Criteria:**
1. `GET /api/cv/private/:token` Endpoint implementiert
2. Placeholder `InviteGuard` erstellt (Epic 4 ersetzt durch echte Validation):
   - Guard logged Warning: "Placeholder Guard - Epic 4 implements real token validation"
   - Option A: Returns 501 Not Implemented
   - Option B: Bypassed (für Epic 2 Testing)
3. Endpoint ruft `CVService.getCV('authenticated')` auf
4. Response enthält VOLLSTÄNDIGEN CV (keine Filterung)
5. Integration-Test mit Mock-Token
6. Kommentar im Code: "TODO Epic 4: Implement real InviteGuard"

**Prerequisites:** Story 2.5 (CVService steht)

**Affected Files:**
- `apps/backend/src/modules/cv/controllers/cv.controller.ts` (erweitert)
- `apps/backend/src/modules/cv/guards/invite.guard.ts` (neu, placeholder)

---

**Story 2.8: Admin CV Endpoints (PATCH, Versions, Rollback) mit Placeholder Auth**

Als Entwickler,
möchte ich Admin-Endpoints für CV-Management,
damit der Admin (Epic 5) CVs updaten und versionieren kann.

**Acceptance Criteria:**
1. Placeholder `AdminAuthGuard` erstellt (Epic 5 ersetzt durch Session-Auth):
   - Logged Warning: "Placeholder Guard - Epic 5 implements real admin auth"
   - Returns 501 Not Implemented oder Bypass
2. `PATCH /api/admin/cv` implementiert:
   - Validiert DTO mit Zod
   - Ruft `CVService.updateCV()` auf
   - Returns updated CV
3. `GET /api/admin/cv/versions?limit=10&offset=0` implementiert:
   - `CVService.getVersions(limit, offset)` method
   - Returns Array von Versions mit Pagination
4. `POST /api/admin/cv/rollback/:versionId` implementiert:
   - `CVService.rollback(versionId)` method
   - Archiviert aktuelle Version mit `source: 'rollback'`
   - Restored versionId Daten
5. Integration-Tests für alle 3 Endpoints
6. Kommentar: "TODO Epic 5: Implement real AdminAuthGuard"

**Prerequisites:** Story 2.5 (CVService + Versionierungs-Logic)

**Affected Files:**
- `apps/backend/src/modules/cv/controllers/cv.controller.ts` (erweitert)
- `apps/backend/src/modules/cv/guards/admin-auth.guard.ts` (neu, placeholder)
- `apps/backend/src/modules/cv/dto/update-cv.dto.ts` (neu)
- `apps/backend/src/modules/cv/dto/cv-version-response.dto.ts` (neu)

---

**Story 2.9: Swagger/OpenAPI Dokumentation für CV-API**

Als Entwickler,
möchte ich automatisch generierte API-Dokumentation,
damit Frontend-Entwickler und Konsumenten die API verstehen.

**Acceptance Criteria:**
1. Swagger-Module in `apps/backend/src/main.ts` konfiguriert
2. API-Dokumentation erreichbar unter `http://localhost:3000/api/docs`
3. Alle CV-Endpoints dokumentiert mit:
   - Operation Summary und Description
   - Request/Response Schemas (auto-generiert aus DTOs)
   - HTTP Status Codes (200, 400, 403, 500)
   - Beispiel-Requests verfügbar ("Try it out")
4. DTOs mit `@ApiProperty()` Decorators annotiert
5. Controller mit `@ApiTags('CV')` gruppiert
6. Swagger UI ist visuell korrekt formatiert

**Prerequisites:** Story 2.6, 2.7, 2.8 (Alle Endpoints existieren)

**Affected Files:**
- `apps/backend/src/main.ts` (Swagger setup)
- `apps/backend/src/modules/cv/controllers/cv.controller.ts` (Swagger decorators)
- `apps/backend/src/modules/cv/dto/*.dto.ts` (ApiProperty decorators)

---

**Story 2.10: Integration Tests und CI/CD für Epic 2**

Als Entwickler,
möchte ich vollständige Integration-Tests für CV-API,
damit Epic 2 stabil und regression-frei ist.

**Acceptance Criteria:**
1. Integration-Tests in `apps/backend/test/cv.e2e-spec.ts`:
   - GET /api/cv/public: Privacy-Filtering validiert
   - GET /api/cv/public: Caching funktioniert (ETag)
   - PATCH /api/admin/cv: Update + Versionierung
   - GET /api/admin/cv/versions: Pagination
   - POST /api/admin/cv/rollback: Rollback-Transaction
2. Test-Coverage >= 90% für CV-Module
3. CI/CD-Pipeline läuft Epic 2 Tests:
   - Unit-Tests (Shared Types + Backend)
   - Integration-Tests (CV API)
   - Migration-Tests
4. Alle Tests passing in CI
5. Code-Coverage-Report generiert

**Prerequisites:** Story 2.1-2.9 (Alle Features implementiert)

**Affected Files:**
- `apps/backend/test/cv.e2e-spec.ts` (erweitert)
- `.github/workflows/ci.yml` (Epic 2 Tests hinzufügen)

---

## Epic 3: Public Portfolio Experience

**Goal:** Begeisternde öffentliche CV-Seite mit SEO-Optimierung und herausragender UX

**Value Proposition:**
Die öffentliche Seite ist das Aushängeschild - sie demonstriert technische Kompetenz durch Qualität, Performance und Design. Erste Impression zählt. Diese Epic macht cv-hub zu einem Portfolio-Piece, das für sich selbst spricht.

**Scope:**
- Frontend-Setup (Vite + React 19 + TypeScript)
- TanStack Router v1 für Routing
- TanStack Query für API-Integration
- Tailwind CSS für Styling
- Server-Side Rendering (SSR) mit Vite SSR + Hydration
- CV-Darstellung:
  - Skills-Section (mit optionalen Filtern)
  - Projekte-Section (mit Filterung nach Jahr/Kategorie)
  - Berufserfahrung, Bildung, Ehrenamt
- Responsive Design (Mobile-First)
- SEO-Optimierung:
  - Meta-Tags (Title, Description, OG-Tags, Twitter Cards)
  - JSON-LD strukturierte Daten (JSON Resume Schema)
  - Sitemap.xml & robots.txt
  - Semantisches HTML5
- Performance-Optimierung:
  - Code-Splitting
  - Lazy Loading
  - Image-Optimierung
  - Caching-Strategie
- Accessibility (WCAG 2.1 Level AA)

**Out of Scope:**
- Admin-Dashboard (Epic 5)
- Personalisierte Ansicht (Epic 4)

**Dependencies:**
Epic 2 (CV-API muss verfügbar sein)

**Key Deliverables:**
- ✅ Öffentliche Seite unter `/` erreichbar
- ✅ Lighthouse Score >90 (alle Kategorien)
- ✅ First Contentful Paint <1.5s
- ✅ Mobile und Desktop responsive
- ✅ SEO-Meta-Tags und strukturierte Daten vorhanden
- ✅ Accessibility-Tests bestanden

**Estimated Effort:** 2 Sprints (2-3 Wochen)

### Stories

**Story 3.1: TanStack Start SSR-Architektur einrichten**

Als Entwickler,
möchte ich eine funktionierende TanStack Start SSR-Infrastruktur mit React 19,
damit die Frontend-Basis für Server-Side Rendering und Client-Hydration steht.

**Acceptance Criteria:**
1. TanStack Start-Projekt in `apps/frontend` initialisiert (React 19, TypeScript)
2. File-based Routing mit TanStack Router v1 funktioniert
3. Root-Route (`/`) ist SSR-fähig und rendert HTML server-side
4. Client-Side Hydration funktioniert (React attached Events nach Initial Load)
5. Dev-Server startet auf Port 5173 mit Hot-Reload
6. Environment-Variablen werden über `import.meta.env` geladen
7. TypeScript-Konfiguration ist strict mode

**Prerequisites:** Epic 1 (Monorepo steht)

**Affected Files:**
- `apps/frontend/app.config.ts`
- `apps/frontend/app/routes/index.tsx`
- `apps/frontend/tsconfig.json`

---

**Story 3.2: Tailwind CSS v4 und shadcn/ui integrieren**

Als Entwickler,
möchte ich Tailwind CSS v4 und shadcn/ui-Komponenten einsatzbereit haben,
damit ich moderne, accessible UI-Komponenten nutzen kann.

**Acceptance Criteria:**
1. Tailwind CSS v4 ist konfiguriert und funktioniert
2. shadcn/ui CLI ist installiert und konfiguriert
3. Mindestens 3 Base-Komponenten sind importiert: Button, Card, Badge
4. Komponenten rendern korrekt mit Tailwind-Styles
5. Dark-Mode-Vorbereitung (CSS-Variablen) ist vorhanden (optional aktivierbar)
6. WCAG AA Farb-Kontraste sind gewährleistet (Tailwind-Farbpalette)
7. shadcn/ui Components sind in `apps/frontend/components/ui/` verfügbar

**Prerequisites:** Story 3.1 (Frontend-Basis steht)

**Affected Files:**
- `apps/frontend/tailwind.config.ts`
- `apps/frontend/components/ui/button.tsx`
- `apps/frontend/components/ui/card.tsx`
- `apps/frontend/components/ui/badge.tsx`
- `apps/frontend/app/globals.css`

---

**Story 3.3: TanStack Query API-Integration aufsetzen**

Als Entwickler,
möchte ich TanStack Query für API-Calls an `/api/cv/public` konfigurieren,
damit CV-Daten mit Caching und Error-Handling geladen werden.

**Acceptance Criteria:**
1. TanStack Query Provider ist in App-Root integriert
2. API-Client-Modul (`lib/api.ts`) erstellt mit `fetchPublicCV()`
3. Custom Hook `usePublicCV()` funktioniert mit Caching (staleTime: 5min)
4. Zod-Schema-Validation validiert API-Response zur Runtime
5. Error-Handling mit Retry-Logic (2 Retries, exponential backoff)
6. Loading-States und Error-States werden korrekt zurückgegeben
7. TypeScript-Types aus `@cv-hub/shared-types` werden genutzt

**Prerequisites:** Story 3.1, Epic 2 (Backend API `/api/cv/public` verfügbar)

**Affected Files:**
- `apps/frontend/lib/api.ts`
- `apps/frontend/app/root.tsx`
- `apps/frontend/hooks/use-public-cv.ts`

---

**Story 3.4: Public CV Route mit SSR Loader implementieren**

Als Entwickler,
möchte ich die Root-Route (`/`) mit TanStack Router Loader SSR-fähig machen,
damit CV-Daten server-side geladen und als vollständiges HTML gerendert werden.

**Acceptance Criteria:**
1. Route `/` nutzt TanStack Router Loader für Server-Side Data-Fetching
2. `fetchPublicCV()` wird server-side aufgerufen (kein Client-Request)
3. HTML-Response enthält vollständige CV-Daten (kein Loading-State initial)
4. Client-Side Hydration funktioniert (TanStack Query übernimmt State)
5. First Contentful Paint <1.5s (messbar via Lighthouse)
6. Keine Hydration-Mismatch-Errors in Console
7. Error-Boundary fängt Loader-Errors ab

**Prerequisites:** Story 3.3 (API-Integration steht)

**Affected Files:**
- `apps/frontend/app/routes/index.tsx`
- `apps/frontend/components/layouts/public-layout.tsx`

---

**Story 3.5: Hero Section Component mit Basics-Daten**

Als Entwickler,
möchte ich eine Hero Section, die Name, Label, Summary und Social-Links anzeigt,
damit die Startseite eine einladende Kopfzeile hat.

**Acceptance Criteria:**
1. HeroSection Component rendert `basics.name` als H1
2. `basics.label` wird als Tagline angezeigt (z.B. "Senior Full-Stack Engineer")
3. `basics.summary` (Bio) wird in maximal 2-3 Sätzen angezeigt
4. Social-Links (`basics.profiles`) rendern als Icon-Links (GitHub, LinkedIn, Twitter)
5. Optional: Avatar-Bild wird angezeigt (`basics.image`)
6. Responsive Design: Mobile = vertikal gestapelt, Desktop = horizontal mit Avatar
7. Accessibility: ARIA-Labels für Social-Links, Alt-Text für Avatar

**Prerequisites:** Story 3.4 (Route mit CV-Daten)

**Affected Files:**
- `apps/frontend/components/sections/hero-section.tsx`
- `apps/frontend/components/ui/social-link.tsx`

---

**Story 3.6: Skills Section mit Client-Side-Filterung**

Als Entwickler,
möchte ich eine Skills Section mit filterbaren Skill-Badges,
damit User Skills nach Kategorien filtern können (Frontend, Backend, etc.).

**Acceptance Criteria:**
1. SkillsSection Component rendert alle Skills als Badges (Tailwind-styled)
2. Filter-Dropdown zeigt eindeutige Kategorien aus `skills[].keywords`
3. User kann mehrere Kategorien gleichzeitig auswählen (Multi-Select)
4. Filterung erfolgt client-side (keine API-Calls, instant <100ms)
5. "Clear Filters" Button resettet alle aktiven Filter
6. Gefilterte Skills zeigen Fade-In/Fade-Out-Animation (Tailwind Transitions)
7. Responsive Grid-Layout: Mobile = 2 Spalten, Desktop = 4-6 Spalten

**Prerequisites:** Story 3.4 (Route mit CV-Daten)

**Affected Files:**
- `apps/frontend/components/sections/skills-section.tsx`
- `apps/frontend/components/ui/skill-badge.tsx`
- `apps/frontend/components/ui/filter-dropdown.tsx`
- `apps/frontend/hooks/use-skills-filter.ts`

---

**Story 3.7: Projects Section mit Filterung und Projekt-Cards**

Als Entwickler,
möchte ich eine Projects Section mit Projekt-Cards und Filterung nach Jahr/Keywords,
damit User relevante Projekte schnell finden.

**Acceptance Criteria:**
1. ProjectsSection rendert alle Projekte als Cards (shadcn/ui Card Component)
2. Projekt-Card zeigt: Name, Beschreibung, Keywords (Badges), Zeitraum
3. Filter-UI erlaubt Filterung nach Jahr (Dropdown) und Keywords (Multi-Select)
4. Filterung erfolgt client-side mit instant Feedback (<100ms)
5. Sortierung nach Datum (neueste zuerst) oder Name (alphabetisch)
6. Responsive Grid: Mobile = 1 Spalte, Tablet = 2 Spalten, Desktop = 3 Spalten
7. Hover-State: Card hebt sich leicht an (Tailwind Shadow + Transform)

**Prerequisites:** Story 3.4 (Route mit CV-Daten)

**Affected Files:**
- `apps/frontend/components/sections/projects-section.tsx`
- `apps/frontend/components/ui/project-card.tsx`
- `apps/frontend/hooks/use-projects-filter.ts`

---

**Story 3.8: Experience Timeline Component**

Als Entwickler,
möchte ich eine Berufserfahrungs-Timeline, die Jobs chronologisch darstellt,
damit User meine Career-History nachvollziehen können.

**Acceptance Criteria:**
1. ExperienceSection rendert `work[]` als vertikale Timeline
2. Jeder Job zeigt: Position, Zeitraum (Start-/Enddatum), Highlights (max. 5)
3. Firmennamen werden als "Confidential" angezeigt (Privacy-Filtering)
4. Timeline-Indicator (vertikale Linie mit Dots) verbindet Jobs visuell
5. Responsive Layout: Mobile = kompakte vertikale Ansicht, Desktop = Timeline links
6. Aktiver Job ("current") wird visuell hervorgehoben (z.B. farbiger Dot)
7. Accessibility: Semantisches HTML (`<article>`, `<time>` Elements)

**Prerequisites:** Story 3.4 (Route mit CV-Daten)

**Affected Files:**
- `apps/frontend/components/sections/experience-section.tsx`
- `apps/frontend/components/ui/timeline-item.tsx`

---

**Story 3.9: Education und Volunteering Sections**

Als Entwickler,
möchte ich Education und Volunteering Sections, die strukturiert Bildung/Ehrenamt zeigen,
damit die CV-Darstellung vollständig ist.

**Acceptance Criteria:**
1. EducationSection rendert `education[]` als Cards oder Liste
2. Jede Education-Entry zeigt: Institution, Studiengang, Abschluss, Zeitraum, optional GPA
3. VolunteeringSection rendert `volunteer[]` (falls vorhanden)
4. Volunteering-Entry zeigt: Organisation, Rolle, Zeitraum, Beschreibung
5. Responsive Layout: Mobile = Cards vertikal gestapelt, Desktop = Grid (2 Spalten)
6. Optional: Icons für Institutionstyp (Universität, Online-Kurs etc.)
7. Accessibility: ARIA-Labels für Section-Headings

**Prerequisites:** Story 3.4 (Route mit CV-Daten)

**Affected Files:**
- `apps/frontend/components/sections/education-section.tsx`
- `apps/frontend/components/sections/volunteering-section.tsx`
- `apps/frontend/components/ui/education-card.tsx`

---

**Story 3.10: SEO-Optimierung mit Meta-Tags und JSON-LD**

Als Entwickler,
möchte ich SEO-Meta-Tags und strukturierte Daten (JSON-LD) automatisch generieren,
damit die CV-Seite optimal für Suchmaschinen und Social Media optimiert ist.

**Acceptance Criteria:**
1. `<title>` Tag wird dynamisch aus `basics.name` + `basics.label` generiert
2. `<meta name="description">` nutzt `basics.summary`
3. Open Graph Tags (og:title, og:description, og:image, og:url) sind vorhanden
4. Twitter Cards (twitter:card, twitter:title, twitter:description) sind gesetzt
5. JSON-LD mit Schema.org Person-Type wird in `<head>` injected
6. Canonical URL wird gesetzt (selbstreferenzierend)
7. Lighthouse SEO Score >90

**Prerequisites:** Story 3.4 (Route mit CV-Daten)

**Affected Files:**
- `apps/frontend/components/seo/seo-head.tsx`
- `apps/frontend/lib/generate-meta-tags.ts`
- `apps/frontend/app/routes/index.tsx` (Head-Export)

---

**Story 3.11: Sitemap und robots.txt generieren**

Als Entwickler,
möchte ich eine automatisch generierte sitemap.xml und robots.txt,
damit Crawler die Seite optimal indexieren können.

**Acceptance Criteria:**
1. `sitemap.xml` wird dynamisch generiert (Route: `/sitemap.xml`)
2. Sitemap enthält alle öffentlichen Routen mit `<lastmod>` Timestamp
3. `robots.txt` wird bereitgestellt (Route: `/robots.txt`)
4. robots.txt erlaubt alle Crawler: `User-agent: * / Allow: /`
5. Sitemap-URL ist in robots.txt referenziert
6. XML ist valide (validiert via W3C XML Validator)
7. Google Search Console akzeptiert Sitemap

**Prerequisites:** Story 3.4 (Route steht)

**Affected Files:**
- `apps/frontend/app/routes/sitemap.xml.ts`
- `apps/frontend/app/routes/robots.txt.ts`

---

**Story 3.12: Performance-Optimierung und Lighthouse CI**

Als Entwickler,
möchte ich Code-Splitting, Lazy Loading und Lighthouse CI einrichten,
damit Performance-Targets (Score >90, FCP <1.5s) automatisch validiert werden.

**Acceptance Criteria:**
1. Code-Splitting ist aktiv (Route-based via TanStack Router)
2. Heavy Components nutzen React.lazy() (z.B. ProjectsSection, ExperienceTimeline)
3. Bilder nutzen `loading="lazy"` und responsive `srcset`
4. Bundle-Size <200KB (gzipped, initial load) - gemessen via vite-bundle-analyzer
5. Lighthouse CI läuft in GitHub Actions (PR-Check)
6. Performance-Budget ist definiert (`lighthouserc.json`)
7. CI fails wenn Lighthouse Score <90 oder FCP >1.5s

**Prerequisites:** Story 3.1-3.11 (alle Features implementiert)

**Affected Files:**
- `apps/frontend/.lighthouserc.json`
- `apps/frontend/vite.config.ts` (Build-Optimierung)
- `.github/workflows/lighthouse.yml`

---

## Epic 4: Privacy-First Sharing System

**Goal:** Personalisierte Links mit Token-basiertem Zugriff auf vollständigen CV und Besuchsstatistiken

**Value Proposition:**
Das Alleinstellungsmerkmal von cv-hub. Granulare Kontrolle über Datenweitergabe mit begeisternder Personalisierung. Jeder Empfänger erhält einen dedizierten Link - professionell, durchdacht, mit voller Kontrolle für den CV-Owner.

**Scope:**
- Token-Generierung (CUID oder NanoID - kryptografisch sicher)
- Link-Entity (Database-Model):
  - Token (unique)
  - Personalisierte Nachricht (optional, Markdown-Support)
  - Ablaufdatum (optional)
  - Status (aktiv/deaktiviert)
  - Besuchsstatistiken (Counter + Last-Visit-Timestamp)
  - Created-At, Updated-At
- API-Endpoints:
  - `POST /api/admin/invite` - Link erstellen (Admin)
  - `GET /api/invite/:token` - Link-Validierung & Metadaten
  - `GET /api/cv/private/:token` - Vollständiger CV (nach Token-Validierung)
- Link-Validierungs-Logik:
  - Token existiert
  - Link ist aktiv
  - Ablaufdatum nicht überschritten
- Besuchsstatistik-Tracking (anonymisiert, DSGVO-konform)
- Frontend:
  - `/invite/:token` Route (SSR + Hydration)
  - Personalisierte Nachricht prominent anzeigen
  - Vollständiger CV mit allen Sections
  - Visuelle Differenzierung zur öffentlichen Seite

**Out of Scope:**
- Admin-UI für Link-Management (Epic 5)
- Erweiterte Statistiken/Analytics (Growth-Feature)

**Dependencies:**
Epic 2 (CV-API), Epic 3 (Frontend-Basis)

**Key Deliverables:**
- ✅ Token-Generierung funktioniert (kollisionsfrei)
- ✅ Link-Validierung korrekt (aktiv/abgelaufen/deaktiviert)
- ✅ Personalisierte Ansicht zeigt vollständigen CV
- ✅ Besuchsstatistiken werden getrackt
- ✅ Privacy-Compliance (keine IP-Speicherung)

**Estimated Effort:** 1 Sprint (1-2 Wochen)

### Stories

**Story 4.1: CUID2-Token-Generierung und Link-Entity**

Als Backend-Entwickler,
möchte ich eine sichere Token-Generierung und Link-Datenbank-Entity,
damit personalisierte Links eindeutig und kollisionsfrei erstellt werden können.

**Acceptance Criteria:**
1. CUID2-Library (`@paralleldrive/cuid2`) ist installiert und konfiguriert
2. `InviteEntity` (TypeORM) existiert mit allen Feldern:
   - `id` (Primary Key, Auto-Increment)
   - `token` (TEXT, UNIQUE, 25 Zeichen)
   - `personalizedMessage` (TEXT, nullable)
   - `expiresAt` (DATETIME, nullable)
   - `isActive` (BOOLEAN, default: true)
   - `visitCount` (INTEGER, default: 0)
   - `lastVisitAt` (DATETIME, nullable)
   - `createdAt`, `updatedAt` (Timestamps)
3. Indizes existieren: `idx_invite_token` (unique), `idx_invite_active` (isActive, expiresAt)
4. TypeORM Migration generiert und erfolgreich ausgeführt
5. Token-Generierung liefert 25-Zeichen CUID2-Strings (URL-safe)
6. Unit-Test: 10.000 generierte Tokens sind eindeutig (keine Kollisionen)

**Prerequisites:** Epic 1 (Foundation), Epic 2 (TypeORM Setup)

**Betroffene Files:**
- `apps/backend/src/modules/invite/entities/invite.entity.ts` (NEU)
- `apps/backend/src/migrations/*-create-invite-table.ts` (NEU)

---

**Story 4.2: Invite Zod-Schemas und Shared Types**

Als Full-Stack-Entwickler,
möchte ich typsichere DTOs für Link-Erstellung und -Validierung,
damit Frontend und Backend konsistente Datenstrukturen verwenden.

**Acceptance Criteria:**
1. `packages/shared-types/src/invite.schema.ts` existiert
2. Zod-Schemas definiert:
   - `CreateInviteDtoSchema` (personalizedMessage: optional max 5000 chars, expiresAt: optional future date)
   - `InviteResponseSchema` (vollständiges Invite-Objekt)
   - `InviteValidationResponseSchema` (isValid, personalizedMessage, reason)
3. TypeScript-Types werden exportiert (`CreateInviteDto`, `InviteResponse`, `InviteValidationResponse`)
4. Backend kann Schemas importieren und nutzen (`@cv-hub/shared-types`)
5. Frontend kann Schemas importieren und nutzen
6. Unit-Tests: Zod-Validierung schlägt fehl bei ungültigen Inputs (z.B. expiresAt in Vergangenheit)

**Prerequisites:** Story 1.6 (Shared Types Package)

**Betroffene Files:**
- `packages/shared-types/src/invite.schema.ts` (NEU)
- `packages/shared-types/src/index.ts` (Update)

---

**Story 4.3: InviteService mit Token-Validierungs-Logik**

Als Backend-Entwickler,
möchte ich einen InviteService für Link-CRUD und Token-Validierung,
damit die Business-Logik zentral und testbar ist.

**Acceptance Criteria:**
1. `InviteService` existiert in `apps/backend/src/modules/invite/invite.service.ts`
2. Methoden implementiert:
   - `createInvite(dto: CreateInviteDto): Promise<InviteEntity>` - Generiert Token, persistiert Link
   - `validateToken(token: string): Promise<InviteValidationResponse>` - Prüft: existiert && isActive && nicht abgelaufen
   - `trackVisit(token: string): Promise<void>` - Inkrement visitCount, update lastVisitAt
   - `findByToken(token: string): Promise<InviteEntity | null>` - Repository-Wrapper
3. Token-Validierungs-Logik korrekt:
   - `isValid = true` wenn: Token existiert UND isActive=true UND (expiresAt=null ODER expiresAt>now())
   - `reason` gesetzt: 'not_found', 'inactive', 'expired' bei Fehlschlägen
4. `trackVisit()` ist idempotent (mehrfache Calls pro Minute zählen nur einmal)
5. Unit-Tests: Alle Validierungs-Edge-Cases abgedeckt (nicht existent, deaktiviert, abgelaufen, gültig)

**Prerequisites:** Story 4.1 (InviteEntity), Story 4.2 (Shared Types)

**Betroffene Files:**
- `apps/backend/src/modules/invite/invite.service.ts` (NEU)
- `apps/backend/src/modules/invite/invite.service.spec.ts` (NEU)

---

**Story 4.4: API-Endpoint POST /api/admin/invite**

Als Admin,
möchte ich via API einen personalisierten Link erstellen können,
damit ich Links programmatisch generieren kann (vorbereitet für Epic 5 Dashboard).

**Acceptance Criteria:**
1. Endpoint `POST /api/admin/invite` existiert in `InviteController`
2. Input-Validierung via Zod (`CreateInviteDtoSchema`)
3. Request-Body: `{ personalizedMessage?: string, expiresAt?: Date }`
4. Response: `{ id, token, url, createdAt }` (Status 201 Created)
5. Generierte `url` ist vollständig: `https://domain.com/invite/{token}`
6. Admin-Auth-Guard ist vorbereitet (Placeholder für Epic 5, aktuell: open endpoint)
7. Error-Handling: 400 Bad Request bei ungültigem Input (z.B. expiresAt in Vergangenheit)
8. Integration-Test: Endpoint erstellt validen Link, Token ist in DB

**Prerequisites:** Story 4.3 (InviteService)

**Betroffene Files:**
- `apps/backend/src/modules/invite/invite.controller.ts` (NEU)
- `apps/backend/src/modules/invite/dto/create-invite.dto.ts` (NEU)

---

**Story 4.5: API-Endpoint GET /api/invite/:token (Validierung & Tracking)**

Als Besucher,
möchte ich via Token-Aufruf validieren und Metadaten abrufen können,
damit die Frontend-Route prüfen kann, ob der Link gültig ist.

**Acceptance Criteria:**
1. Endpoint `GET /api/invite/:token` existiert in `InviteController`
2. Token-Validierung via `InviteService.validateToken()`
3. Response bei gültigem Token: `{ isValid: true, personalizedMessage: "...", reason: 'valid' }` (Status 200)
4. Response bei ungültigem Token: `{ isValid: false, personalizedMessage: null, reason: 'not_found' | 'inactive' | 'expired' }` (Status 200, kein 404!)
5. Besuchsstatistik wird aktualisiert: `InviteService.trackVisit()` bei gültigem Token
6. Rate-Limiting: 100 requests/minute pro IP (Epic 1 Foundation)
7. Integration-Test: Gültiger Token → isValid=true, visitCount incremented; Abgelaufener Token → isValid=false, reason='expired'

**Prerequisites:** Story 4.3 (InviteService)

**Betroffene Files:**
- `apps/backend/src/modules/invite/invite.controller.ts` (Update)

---

**Story 4.6: CVService-Erweiterung für 'authenticated' Context**

Als Backend-Entwickler,
möchte ich den CVService um 'authenticated' Context erweitern,
damit personalisierte Links den vollständigen CV ohne Filterung erhalten.

**Acceptance Criteria:**
1. `CVService.getCV()` (Epic 2) akzeptiert neuen Context-Parameter: `context: 'public' | 'authenticated'`
2. Bei `context='authenticated'`: Keine Privacy-Filterung, vollständiges CV-Objekt (PrivateCV)
3. Bei `context='public'`: Bestehende Filterung (Epic 2) unverändert
4. `PrivateCV` Type (Shared Types) enthält alle sensiblen Felder:
   - Kontaktdaten (email, phone, location)
   - Echte Firmennamen in `work` und `volunteer`
   - Projekt-Metriken und Details
5. Unit-Tests: PublicCV vs PrivateCV haben unterschiedliche Felder
6. Integration-Test: `/api/cv/public` liefert gefiltert, `/api/cv/private/:token` (Story 4.7) liefert vollständig

**Prerequisites:** Epic 2 (CVService), Story 4.2 (Shared Types)

**Betroffene Files:**
- `apps/backend/src/modules/cv/cv.service.ts` (Update)
- `packages/shared-types/src/cv.schema.ts` (Update - PrivateCV Type)

---

**Story 4.7: API-Endpoint GET /api/cv/private/:token**

Als Besucher mit gültigem Token,
möchte ich den vollständigen CV abrufen können,
damit die personalisierte Ansicht alle Daten anzeigen kann.

**Acceptance Criteria:**
1. Endpoint `GET /api/cv/private/:token` existiert in `InviteController`
2. Token-Validierung via `TokenValidationGuard` (NestJS Guard)
   - Guard ruft `InviteService.validateToken()` auf
   - Bei ungültigem Token: 403 Forbidden Response
   - Bei gültigem Token: Request.user = InviteEntity (für Logging)
3. Response: Vollständiges CV-Objekt (`PrivateCV`) via `CVService.getCV('authenticated')`
4. Besuchsstatistik wird getrackt (via Guard oder Controller)
5. Rate-Limiting: 100 requests/minute pro Token
6. Error-Handling: 403 Forbidden (ungültiger Token), 404 Not Found (CV existiert nicht)
7. Integration-Test: Gültiger Token → vollständiger CV; Ungültiger Token → 403; Abgelaufener Token → 403

**Prerequisites:** Story 4.6 (CVService authenticated), Story 4.3 (InviteService)

**Betroffene Files:**
- `apps/backend/src/modules/invite/invite.controller.ts` (Update)
- `apps/backend/src/modules/invite/guards/token-validation.guard.ts` (NEU)

---

**Story 4.8: Frontend-Route /invite/:token mit SSR-Loader**

Als Besucher,
möchte ich eine personalisierte CV-Seite unter /invite/:token aufrufen können,
damit ich den vollständigen CV sehe.

**Acceptance Criteria:**
1. TanStack Router Route: `apps/frontend/src/routes/invite/$token.tsx`
2. SSR-Loader implementiert:
   - Parallel-Fetch: `GET /api/invite/:token` (Validierung) + `GET /api/cv/private/:token` (CV-Daten)
   - Server-Side Rendering für initiales HTML
   - Client-Side Hydration für Interaktivität
3. Error-States:
   - Ungültiger/abgelaufener Token → Redirect zu `/invite/error` mit Reason
   - Deaktivierter Link → "Link wurde deaktiviert" Seite
   - Netzwerk-Fehler → Generische Error-Page
4. Loading-State: Skeleton während SSR (Server-Side)
5. Meta-Tags: `<meta name="robots" content="noindex,nofollow">` (Privacy)
6. Performance: First Contentful Paint <1.5s (wie Epic 3)

**Prerequisites:** Story 4.5 (GET /api/invite/:token), Story 4.7 (GET /api/cv/private/:token)

**Betroffene Files:**
- `apps/frontend/src/routes/invite/$token.tsx` (NEU)
- `apps/frontend/src/routes/invite/error.tsx` (NEU - Error-Page)

---

**Story 4.9: Frontend-Hooks useInviteValidation und usePrivateCV**

Als Frontend-Entwickler,
möchte ich TanStack Query Hooks für Invite-Validierung und CV-Daten,
damit API-Calls konsistent gecacht und verwaltet werden.

**Acceptance Criteria:**
1. Hook `useInviteValidation(token: string)` existiert:
   - Fetcht `GET /api/invite/:token`
   - Returns: `{ isValid, personalizedMessage, reason, isLoading, error }`
   - Cache-Strategie: staleTime 5min, gcTime 10min (wie Epic 3)
2. Hook `usePrivateCV(token: string)` existiert:
   - Fetcht `GET /api/cv/private/:token`
   - Returns: `{ cv: PrivateCV, isLoading, error }`
   - Cache-Strategie: staleTime 5min, gcTime 10min
   - Error-Handling: 403 Forbidden → `error.status = 403`
3. Type-Safety: Response-Types via Zod-Schemas validiert
4. Prefetching im SSR-Loader funktioniert (Hydration ohne Refetch)
5. Unit-Tests (Mock): Hooks returnen korrektes Datenformat

**Prerequisites:** Story 4.5, 4.7 (API-Endpoints), Story 4.2 (Shared Types)

**Betroffene Files:**
- `apps/frontend/src/lib/api/invite.ts` (NEU)
- `apps/frontend/src/lib/api/invite.test.ts` (NEU)

---

**Story 4.10: PersonalizedMessageBanner Component**

Als Besucher,
möchte ich eine prominente Nachricht am Anfang der personalisierten CV-Seite sehen,
damit ich weiß, warum ich diesen Link erhalten habe.

**Acceptance Criteria:**
1. Component `PersonalizedMessageBanner` existiert (shadcn/ui Alert-Komponente)
2. Props: `message: string | null`
3. Markdown-Rendering via `react-markdown` (Library installiert)
4. Styling: Prominent, aber nicht aufdringlich (z.B. Info-Alert mit Icon)
5. Visuelle Differenzierung: Subtile Border/Background-Color
6. Responsive: Mobile und Desktop optimiert
7. Accessibility: ARIA-Label für Screen-Reader
8. Conditional Rendering: Nur anzeigen wenn `message` nicht null
9. Unit-Test: Component rendert Markdown korrekt

**Prerequisites:** Epic 3 (shadcn/ui Setup)

**Betroffene Files:**
- `apps/frontend/src/components/invite/PersonalizedMessageBanner.tsx` (NEU)
- `apps/frontend/src/components/invite/PersonalizedMessageBanner.test.tsx` (NEU)

---

**Story 4.11: Component-Varianten für SkillsSection, ProjectsSection, ExperienceSection**

Als Frontend-Entwickler,
möchte ich bestehende CV-Components mit 'variant' Prop erweitern,
damit sie zwischen öffentlicher und authentifizierter Ansicht differenzieren können.

**Acceptance Criteria:**
1. Components erweitert: `SkillsSection`, `ProjectsSection`, `ExperienceSection`
2. Neue Prop: `variant: 'public' | 'authenticated'`
3. Conditional Rendering basierend auf `variant`:
   - **SkillsSection:** `authenticated` → zeige Skill-Level und Details
   - **ProjectsSection:** `authenticated` → zeige echte Company-Namen (`entity`), Metriken
   - **ExperienceSection:** `authenticated` → zeige echte Firmennamen statt "Confidential"
4. Default: `variant='public'` (Backwards-Compatible mit Epic 3)
5. Type-Safety: PrivateCV vs PublicCV Types unterscheiden sich
6. Unit-Tests: Component rendert unterschiedlich je nach Variant
7. Visuelle Regression-Tests optional (Story-Points: Growth)

**Prerequisites:** Epic 3 (Components), Story 4.6 (PrivateCV Type)

**Betroffene Files:**
- `apps/frontend/src/components/cv/SkillsSection.tsx` (Update)
- `apps/frontend/src/components/cv/ProjectsSection.tsx` (Update)
- `apps/frontend/src/components/cv/ExperienceSection.tsx` (Update)

---

**Story 4.12: ContactSection Component (nur authenticated)**

Als Besucher mit gültigem Token,
möchte ich Kontaktdaten im personalisierten CV sehen,
damit ich den CV-Owner kontaktieren kann.

**Acceptance Criteria:**
1. Component `ContactSection` existiert
2. Props: `contact: { email, phone, location }`
3. Darstellung:
   - Email (mit mailto-Link)
   - Telefon (mit tel-Link für Mobile)
   - Standort (Icon + Text, z.B. "Berlin, Germany")
4. Icons: lucide-react (Mail, Phone, MapPin)
5. Styling: shadcn/ui Card-Komponente
6. Responsive: Mobile optimiert (Click-to-Call, Click-to-Email)
7. Accessibility: ARIA-Labels, semantisches HTML
8. Unit-Test: Component rendert alle Felder korrekt

**Prerequisites:** Epic 3 (shadcn/ui, lucide-react)

**Betroffene Files:**
- `apps/frontend/src/components/cv/ContactSection.tsx` (NEU)
- `apps/frontend/src/components/cv/ContactSection.test.tsx` (NEU)

---

**Story 4.13: PersonalizedCVPage Component und Integration**

Als Besucher,
möchte ich eine vollständige personalisierte CV-Seite sehen,
damit ich alle Informationen in gut strukturierter Form erhalte.

**Acceptance Criteria:**
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

**Prerequisites:** Story 4.10 (MessageBanner), 4.11 (Varianten), 4.12 (ContactSection), 4.8 (Route)

**Betroffene Files:**
- `apps/frontend/src/components/invite/PersonalizedCVPage.tsx` (NEU)
- `apps/frontend/src/routes/invite/$token.tsx` (Update - Integration)

---

**Story 4.14: E2E-Tests und DSGVO-Compliance-Validierung**

Als Entwickler,
möchte ich End-to-End-Tests für das Link-System und DSGVO-Compliance validieren,
damit das Privacy-First-Versprechen sichergestellt ist.

**Acceptance Criteria:**
1. E2E-Test (Playwright oder Browser-Use MCP):
   - Admin erstellt Link via API (`POST /api/admin/invite`)
   - Besucher navigiert zu `/invite/:token`
   - Personalisierte Nachricht wird angezeigt
   - Vollständiger CV wird gerendert (Kontaktdaten sichtbar)
   - Besuchsstatistik wird korrekt inkrementiert
2. E2E-Test: Abgelaufener Link zeigt Error-Page
3. E2E-Test: Deaktivierter Link (isActive=false) zeigt Error-Page
4. DSGVO-Compliance-Checks:
   - Keine IP-Adressen in DB-Logs gespeichert
   - User-Agent nicht persistiert
   - Keine Third-Party-Tracking-Cookies
   - Privacy-Policy-Hinweis auf Error-Page (optional)
5. Performance-Test: Lighthouse Score >90 für `/invite/:token`
6. Accessibility-Test: axe DevTools 0 kritische Fehler

**Prerequisites:** Story 4.13 (vollständige Integration)

**Betroffene Files:**
- `apps/frontend/e2e/invite-flow.spec.ts` (NEU)
- `apps/backend/src/modules/invite/invite.e2e.spec.ts` (NEU)

---
## Epic 5: Link Management Dashboard

**Goal:** Komfortables Admin-Interface für Link-CRUD, Statistiken und Übersicht

**Value Proposition:**
Ohne Admin-Dashboard wäre Link-Management mühsam (Datenbank-Tools erforderlich). Diese Epic macht cv-hub praktisch nutzbar - Links erstellen, verwalten, deaktivieren in wenigen Klicks.

**Scope:**
- Admin-Authentication:
  - Basic Auth (Username/Password)
  - Session-Management (HTTP-only Cookies)
  - CSRF-Protection (NestJS Guards)
  - API-Endpoints: `/api/admin/auth/login`, `/api/admin/auth/logout`, `/api/admin/auth/status`
- Admin-Dashboard (React):
  - Login-Seite (`/admin/login`)
  - Dashboard-Overview (`/admin/dashboard`):
    - Anzahl aktive Links
    - Gesamtbesuche
    - Kürzlich erstellte Links
  - Link-Liste (`/admin/links`):
    - Tabellen-Ansicht mit Sortierung (Datum, Besuche, Status)
    - Filterung (aktiv/deaktiviert/abgelaufen)
    - Quick-Actions (Kopieren, Deaktivieren, Löschen)
- Link-Erstellung-Formular (TanStack Form):
  - Textfeld für personalisierte Nachricht (Markdown-Support)
  - Datepicker für Ablaufdatum
  - Status-Toggle (aktiv/deaktiviert)
  - Live-Preview der generierten URL
- Link-Detail-Ansicht:
  - Besuchsstatistiken (Anzahl, letzter Besuch)
  - Edit-Funktionalität
- API-Endpoints:
  - `GET /api/admin/invites` - Alle Links abrufen
  - `PATCH /api/admin/invite/:id` - Link aktualisieren
  - `DELETE /api/admin/invite/:id` - Link löschen (soft delete)

**Out of Scope:**
- Multi-User-Support (nur 1 Admin)
- Erweiterte Analytics/Charts (Growth-Feature)

**Dependencies:**
Epic 4 (Link-System muss existieren)

**Key Deliverables:**
- ✅ Admin kann sich einloggen und authentifizieren
- ✅ Dashboard zeigt Übersicht
- ✅ Links können erstellt, bearbeitet, gelöscht werden
- ✅ Besuchsstatistiken sichtbar
- ✅ UI ist effizient bedienbar (max. 3 Klicks für häufige Aktionen)

**Estimated Effort:** 1-2 Sprints (2-3 Wochen)


### Stories


## Stories

**Story 5.1: Admin User Entity und Seed-Daten**

Als Entwickler,
möchte ich eine AdminUser-Entity mit Argon2-gehashten Credentials und initialen Seed-Daten,
damit die Authentifizierungs-Basis für das Admin-Dashboard steht.

**Acceptance Criteria:**
1. TypeORM Entity `AdminUser` existiert in `apps/backend/src/admin/entities/admin-user.entity.ts`
2. Felder: `id`, `username` (unique), `passwordHash` (Argon2), `createdAt`, `updatedAt`
3. Migration erstellt Admin-Users-Tabelle in SQLite
4. Seed-Script erstellt initialen Admin-User (username aus ENV: `ADMIN_USERNAME`, password gehashed aus `ADMIN_PASSWORD`)
5. Argon2-Hashing funktioniert korrekt (argon2id, 64MB memory, 3 iterations)
6. Unit-Test für Password-Hashing und Verification

**Prerequisites:** Epic 1 (NestJS + TypeORM stehen)

**Affected Files:**
- `apps/backend/src/admin/entities/admin-user.entity.ts`
- `apps/backend/src/database/migrations/*-CreateAdminUser.ts`
- `apps/backend/src/database/seeds/admin-user.seed.ts`
- `apps/backend/src/admin/admin.service.ts` (Password-Hashing-Utility)

---

**Story 5.2: Session-Management mit express-session**

Als Entwickler,
möchte ich Session-Management mit SQLite-Storage und HTTP-only Cookies,
damit Admin-Sessions sicher persistiert werden.

**Acceptance Criteria:**
1. `express-session` und `connect-sqlite3` Dependencies installiert
2. SessionModule konfiguriert in `apps/backend/src/admin/session.module.ts`
3. Sessions werden in SQLite-Tabelle `sessions` gespeichert (persistent über Restarts)
4. Session-Cookie: HttpOnly, Secure (in Production), SameSite=Lax, Max-Age=7 days
5. Session-Secret aus Environment-Variable `SESSION_SECRET` (mindestens 32 Bytes)
6. Expired Sessions werden täglich bereinigt (Cron-Job oder Middleware)
7. Health-Check-Endpoint zeigt Session-Store-Status

**Prerequisites:** Story 5.1 (Admin-Entity steht)

**Affected Files:**
- `apps/backend/src/admin/session.module.ts`
- `apps/backend/src/admin/admin.module.ts` (SessionModule importieren)
- `apps/backend/src/app.module.ts` (Session-Middleware registrieren)
- `apps/backend/src/config/session.config.ts`

---

**Story 5.3: Passport.js Local Strategy für Admin-Login**

Als Entwickler,
möchte ich Passport.js Local Strategy mit Username/Password-Authentifizierung,
damit Admins sich einloggen können.

**Acceptance Criteria:**
1. `@nestjs/passport`, `passport`, `passport-local` Dependencies installiert
2. LocalStrategy implementiert in `apps/backend/src/admin/strategies/local.strategy.ts`
3. Strategy validiert Username/Password gegen AdminUser-Entity (Argon2 verify)
4. AdminService.validateUser() Methode implementiert
5. Bei erfolgreicher Validierung wird User-Object zurückgegeben
6. Bei fehlgeschlagener Validierung wird UnauthorizedException geworfen
7. Unit-Tests für LocalStrategy und AdminService.validateUser()

**Prerequisites:** Story 5.2 (Session-Management steht)

**Affected Files:**
- `apps/backend/src/admin/strategies/local.strategy.ts`
- `apps/backend/src/admin/admin.service.ts` (validateUser Methode)
- `apps/backend/src/admin/admin.module.ts` (PassportModule importieren)

---

**Story 5.4: Admin Auth Controller und Login-Endpoint**

Als Admin,
möchte ich mich über POST /api/admin/auth/login einloggen,
damit ich Zugriff auf das Dashboard erhalte.

**Acceptance Criteria:**
1. AdminAuthController in `apps/backend/src/admin/controllers/admin-auth.controller.ts`
2. POST /api/admin/auth/login Endpoint implementiert (verwendet LocalAuthGuard)
3. Request Body: { username, password } - validiert mit Zod LoginDtoSchema
4. Bei erfolgreicher Auth: Session erstellt, User-Object zurückgegeben (ohne Password)
5. Bei fehlgeschlagener Auth: 401 Unauthorized mit Error-Message
6. Rate-Limiting aktiv: 5 Versuche pro 15 Minuten pro IP (ThrottlerGuard)
7. Integration-Test für Login-Flow (Success und Failure Cases)

**Prerequisites:** Story 5.3 (Local Strategy steht)

**Affected Files:**
- `apps/backend/src/admin/controllers/admin-auth.controller.ts`
- `apps/backend/src/admin/dto/login.dto.ts` (Zod Schema)
- `apps/backend/src/admin/guards/local-auth.guard.ts`
- `packages/shared-types/src/admin-auth.schemas.ts` (Shared Zod Schema)

---

**Story 5.5: AdminAuthGuard für geschützte Routen**

Als Entwickler,
möchte ich einen AdminAuthGuard, der alle Admin-Routen schützt,
damit nur authentifizierte Admins Zugriff haben.

**Acceptance Criteria:**
1. AdminAuthGuard implementiert in `apps/backend/src/admin/guards/admin-auth.guard.ts`
2. Guard prüft `request.isAuthenticated()` (Passport Session)
3. Bei nicht-authentifizierten Requests: 401 Unauthorized
4. Guard kann via `@UseGuards(AdminAuthGuard)` Decorator verwendet werden
5. GET /api/admin/auth/status Endpoint (geschützt mit Guard) liefert Auth-Status
6. POST /api/admin/auth/logout Endpoint (geschützt mit Guard) zerstört Session
7. Unit-Tests für Guard (Mock Session, Test Success/Failure)

**Prerequisites:** Story 5.4 (Login-Endpoint steht)

**Affected Files:**
- `apps/backend/src/admin/guards/admin-auth.guard.ts`
- `apps/backend/src/admin/controllers/admin-auth.controller.ts` (status + logout Endpoints)

---

**Story 5.6: CSRF-Protection mit csurf Middleware**

Als Entwickler,
möchte ich CSRF-Protection für alle Admin-POST/PATCH/DELETE-Requests,
damit Cross-Site-Request-Forgery-Attacken verhindert werden.

**Acceptance Criteria:**
1. `csurf` Middleware installiert und konfiguriert
2. CSRF-Token wird als Cookie gesetzt (`XSRF-TOKEN`)
3. Frontend muss CSRF-Token im Header `X-CSRF-Token` mitsenden
4. Alle Admin POST/PATCH/DELETE-Requests ohne gültigen Token → 403 Forbidden
5. GET-Requests sind CSRF-exempt (nur lesende Operationen)
6. CSRF-Config: Double-Submit-Cookie-Pattern
7. Integration-Test: Request mit/ohne CSRF-Token

**Prerequisites:** Story 5.5 (AdminAuthGuard steht)

**Affected Files:**
- `apps/backend/src/main.ts` (csurf Middleware registrieren)
- `apps/backend/src/admin/admin.module.ts`

---

**Story 5.7: Admin Invite CRUD API-Endpoints**

Als Admin,
möchte ich Invites über API-Endpoints verwalten (GET, POST, PATCH, DELETE),
damit ich Links erstellen, bearbeiten und löschen kann.

**Acceptance Criteria:**
1. AdminInviteController in `apps/backend/src/admin/controllers/admin-invite.controller.ts`
2. Endpoints implementiert:
   - GET /api/admin/invites (Liste mit Pagination, Sortierung, Filterung)
   - GET /api/admin/invites/:id (Single Invite Details)
   - POST /api/admin/invites (Neuen Link erstellen)
   - PATCH /api/admin/invites/:id (Link aktualisieren)
   - DELETE /api/admin/invites/:id (Soft Delete - isActive=false)
3. Alle Endpoints geschützt mit AdminAuthGuard
4. DTOs validiert mit Zod (CreateInviteDto, UpdateInviteDto, InviteQueryDto)
5. InviteService erweitert mit Admin-Query-Methoden (Filterung, Sortierung)
6. Response-Format: Paginierte Liste mit total/limit/offset/hasNext
7. Integration-Tests für alle CRUD-Operations

**Prerequisites:** Story 5.6 (CSRF steht), Epic 4 (Invite-Entity existiert)

**Affected Files:**
- `apps/backend/src/admin/controllers/admin-invite.controller.ts`
- `apps/backend/src/invite/invite.service.ts` (erweitert)
- `apps/backend/src/admin/dto/create-invite.dto.ts`
- `apps/backend/src/admin/dto/update-invite.dto.ts`
- `apps/backend/src/admin/dto/invite-query.dto.ts`
- `packages/shared-types/src/invite.schemas.ts`

---

**Story 5.8: Frontend Admin-Login-Seite**

Als Admin,
möchte ich mich über eine Login-Seite einloggen,
damit ich Zugriff auf das Dashboard erhalte.

**Acceptance Criteria:**
1. Route `/admin/login` in `apps/frontend/src/routes/admin/login.tsx`
2. Login-Formular mit shadcn/ui Components (Input, Button, Card)
3. Form-Validierung mit TanStack Form und Zod LoginDtoSchema
4. Bei Submit: POST /api/admin/auth/login mit TanStack Query
5. Bei Erfolg: Redirect zu `/admin/dashboard`
6. Bei Fehler: Error-Message anzeigen (Toast-Notification)
7. Loading-State während Login-Request (Spinner im Button)
8. beforeLoad-Hook: Redirect zu `/admin/dashboard` wenn bereits eingeloggt
9. E2E-Test mit Playwright (Login-Flow Success + Failure)

**Prerequisites:** Story 5.4 (Login-Endpoint steht)

**Affected Files:**
- `apps/frontend/src/routes/admin/login.tsx`
- `apps/frontend/src/components/admin/LoginForm.tsx`
- `apps/frontend/src/lib/api/admin-auth.ts` (TanStack Query hooks)

---

**Story 5.9: Frontend Admin-Dashboard mit Stats-Overview**

Als Admin,
möchte ich ein Dashboard mit Übersicht über aktive Links und Besuche sehen,
damit ich einen schnellen Überblick habe.

**Acceptance Criteria:**
1. Route `/admin/dashboard` in `apps/frontend/src/routes/admin/dashboard.tsx`
2. AdminLayout-Component (mit Sidebar/Navigation) in `apps/frontend/src/components/admin/AdminLayout.tsx`
3. Dashboard zeigt 3 StatsCards:
   - Anzahl aktive Links (GET /api/admin/invites?status=active)
   - Gesamtbesuche über alle Links (Sum visitCount)
   - Kürzlich erstellte Links (5 neueste, GET /api/admin/invites?limit=5&sortBy=createdAt)
4. beforeLoad-Hook: Prüft Auth-Status (GET /api/admin/auth/status), redirect zu `/admin/login` wenn nicht eingeloggt
5. TanStack Query für parallele API-Calls (alle 3 Stats gleichzeitig fetchen)
6. Loading-Skeletons während Datenabruf
7. Logout-Button in Navigation (POST /api/admin/auth/logout)
8. Dashboard lädt in <2s (Performance-Messung)

**Prerequisites:** Story 5.7 (Admin Invite API steht), Story 5.8 (Login-Seite steht)

**Affected Files:**
- `apps/frontend/src/routes/admin/dashboard.tsx`
- `apps/frontend/src/components/admin/AdminLayout.tsx`
- `apps/frontend/src/components/admin/StatsCard.tsx`
- `apps/frontend/src/lib/api/admin-invites.ts` (TanStack Query hooks)

---

**Story 5.10: Frontend Link-Management-Liste mit Sortierung und Filterung**

Als Admin,
möchte ich alle Links in einer Tabelle sehen und nach Status filtern/sortieren,
damit ich Links effizient verwalten kann.

**Acceptance Criteria:**
1. Route `/admin/links` in `apps/frontend/src/routes/admin/links.tsx`
2. Tabelle zeigt alle Invites mit Spalten: Recipient, Token (gekürzt), Status, Visits, Created Date
3. Sortierung: Klick auf Column Header → Sort by (Created Date, Visit Count, Expiration Date)
4. Filterung: Dropdown für Status (All, Active, Inactive, Expired)
5. Search-Input: Filter nach Recipient Name (Debounced, 300ms)
6. Pagination: 10 Items per Page, "Load More" Button (oder Infinite Scroll)
7. Quick Actions pro Row: Copy URL Button, Deactivate Button (Toggle), Delete Button
8. Status-Badge: Grün (Active), Grau (Inactive), Rot (Expired)
9. TanStack Query mit staleTime=5min (Cache für Performance)
10. Empty-State wenn keine Links vorhanden ("No links yet. Create your first link!")

**Prerequisites:** Story 5.9 (Dashboard steht)

**Affected Files:**
- `apps/frontend/src/routes/admin/links.tsx`
- `apps/frontend/src/components/admin/LinkTable.tsx`
- `apps/frontend/src/components/admin/LinkTableRow.tsx`
- `apps/frontend/src/components/ui/badge.tsx` (shadcn/ui)
- `apps/frontend/src/components/ui/table.tsx` (shadcn/ui)

---

**Story 5.11: Frontend Link-Erstellung-Dialog mit TanStack Form**

Als Admin,
möchte ich über ein Formular neue Links mit personalisierter Nachricht erstellen,
damit ich schnell personalisierte Invite-Links generieren kann.

**Acceptance Criteria:**
1. "Create Link" Button auf `/admin/links` Seite
2. Dialog öffnet mit LinkForm (shadcn/ui Dialog Component)
3. Form-Felder (TanStack Form):
   - Recipient Name (optional, Input)
   - Personalized Message (optional, Textarea mit Markdown-Preview)
   - Expiration Date (optional, Datepicker - shadcn/ui Popover + date-fns)
   - Active Status (Toggle, default: true)
4. Live Markdown-Preview mit react-markdown (unterhalb Textarea)
5. Form-Validierung mit Zod CreateInviteDtoSchema (inline Errors)
6. Bei Submit: POST /api/admin/invites (TanStack Query Mutation)
7. Erfolg: Dialog schließen, Success-Toast, generierte URL anzeigen mit Copy-Button
8. Optimistic Update: Neuer Link erscheint sofort in Tabelle (TanStack Query Cache)
9. Loading-State im Submit-Button während API-Call

**Prerequisites:** Story 5.10 (Link-Liste steht)

**Affected Files:**
- `apps/frontend/src/components/admin/LinkCreateDialog.tsx`
- `apps/frontend/src/components/admin/LinkForm.tsx`
- `apps/frontend/src/components/ui/dialog.tsx` (shadcn/ui)
- `apps/frontend/src/components/ui/calendar.tsx` (shadcn/ui)
- `apps/frontend/src/lib/api/admin-invites.ts` (useMutation Hook)

---

**Story 5.12: Frontend Link-Bearbeitung und Deaktivierung**

Als Admin,
möchte ich bestehende Links bearbeiten und deaktivieren,
damit ich Links verwalten kann ohne sie zu löschen.

**Acceptance Criteria:**
1. Klick auf Link-Row öffnet Edit-Dialog (wiederverwendet LinkForm aus Story 5.11)
2. Form-Felder vorbefüllt mit bestehenden Daten (außer Token - read-only)
3. Bei Submit: PATCH /api/admin/invites/:id (TanStack Query Mutation)
4. Optimistic Update: Tabelle zeigt aktualisierte Daten sofort
5. Deactivate-Button in Row: Confirmation-Dialog ("Deactivate this link?")
6. Bei Bestätigung: PATCH /api/admin/invites/:id { isActive: false }
7. Deaktivierter Link zeigt "Inactive" Badge und ist ausgegraut
8. Reactivate möglich über Edit-Dialog (Toggle isActive zurück auf true)
9. Delete-Button: Soft Delete (gleich wie Deactivate, für MVP)
10. Success/Error-Toasts für alle Aktionen

**Prerequisites:** Story 5.11 (Link-Erstellung steht)

**Affected Files:**
- `apps/frontend/src/components/admin/LinkEditDialog.tsx`
- `apps/frontend/src/components/admin/LinkTableRow.tsx` (erweitert mit Actions)
- `apps/frontend/src/components/ui/alert-dialog.tsx` (shadcn/ui Confirmation)
- `apps/frontend/src/lib/api/admin-invites.ts` (useMutation für Update/Delete)

---

## Epic 6: Intelligent CV Maintenance (KI-Extraktion)

**Goal:** Automatische Extraktion von CV-Daten aus unstrukturierten Dateien via LLM

**Value Proposition:**
Reduziert Wartungsaufwand drastisch - von "HTML-Pflege" oder "JSON manuell bearbeiten" zu "PDF hochladen, fertig". KI extrahiert strukturierte Daten, User reviewed und speichert. Einzigartige User-Experience und praktischer Mehrwert.

**Scope:**
- File-Upload-Interface (Admin-Dashboard):
  - Drag & Drop
  - Unterstützte Formate: PDF, Markdown, Plain Text
  - File-Size-Limit: 10MB
  - Route: `/admin/cv/extract`
- LLM-Integration:
  - OpenAI API (primär) oder Anthropic Claude
  - Prompt für JSON Resume Schema-Extraktion
  - Timeout-Handling (60s)
  - Retry-Logic (3 Versuche)
  - Rate-Limiting (5 requests/hour)
- Review-Interface:
  - Live-Preview des extrahierten JSONs
  - Manuelles Editing vor Speichern
  - Diff-View (Vergleich mit bestehendem CV)
  - Fehlende Felder hervorheben
  - JSON Schema Validation
- Versionierung:
  - Automatisches Backup vor Überschreiben
  - Versionshistorie-Liste (`/admin/cv/versions`)
  - Rollback-Funktionalität
- API-Endpoints:
  - `POST /api/admin/cv/extract` - Upload & Extraktion
  - `GET /api/admin/cv/versions` - Versionshistorie
  - `POST /api/admin/cv/rollback/:version` - Rollback

**Out of Scope:**
- Automatische Skill-Extraktion aus Projektbeschreibungen (Growth)
- Multi-Source-Aggregation (GitHub, Blog etc. - Vision)

**Dependencies:**
Epic 2 (CV-Daten-Models), Epic 5 (Admin-Dashboard-Basis)

**Key Deliverables:**
- ✅ File-Upload funktioniert (Drag & Drop)
- ✅ LLM-Extraktion liefert valides JSON Resume
- ✅ Review-Interface zeigt extrahierte Daten
- ✅ Versionierung mit Backup funktioniert
- ✅ Rollback möglich
- ✅ Rate-Limiting verhindert Missbrauch

**Estimated Effort:** 1-2 Sprints (2-3 Wochen)

### Stories

**Story 6.1: File-Upload-Interface mit Drag & Drop**

Als Admin,
möchte ich CV-Dateien per Drag & Drop hochladen können,
damit die Bedienung intuitiv und effizient ist.

**Acceptance Criteria:**
1. UploadZone Component rendert auf `/admin/cv/extract` Route
2. Drag & Drop funktioniert für Dateien (visuelles Feedback bei Hover)
3. File-Picker-Button als Alternative zum Drag & Drop verfügbar
4. Client-seitige Validierung: Nur PDF, Markdown (.md), Plain Text (.txt) erlaubt
5. Client-seitige Validierung: Max 10MB File-Size
6. Error-Toasts bei ungültigen Dateien (MIME-Type oder Größe)
7. Success-State zeigt "Ready to upload" nach erfolgreicher Validierung
8. react-dropzone Library integriert und konfiguriert

**Prerequisites:** Epic 5 (Admin-Dashboard-Basis)

**Affected Files:**
- `apps/frontend/src/routes/admin/cv/extract.tsx` (neu)
- `apps/frontend/src/components/UploadZone.tsx` (neu)

---

**Story 6.2: Backend File-Upload-Endpoint mit Multer**

Als Backend-Entwickler,
möchte ich einen sicheren File-Upload-Endpoint mit Multer,
damit Dateien validiert und verarbeitet werden können.

**Acceptance Criteria:**
1. POST `/api/admin/cv/extract` Endpoint erstellt
2. AdminAuthGuard schützt Endpoint (Session-basiert)
3. Multer FileInterceptor konfiguriert (memory storage, 10MB limit)
4. Server-seitige MIME-Type-Validierung (application/pdf, text/markdown, text/plain)
5. File-Extension-Whitelist (.pdf, .md, .txt)
6. Rate-Limiting: 5 Requests pro Stunde pro Session (@nestjs/throttler)
7. Error-Responses: 400 (invalid file), 401 (unauthorized), 429 (rate limit)
8. File wird in Memory gehalten (nicht auf Disk gespeichert)

**Prerequisites:** Story 6.1 (Frontend Upload-UI)

**Affected Files:**
- `apps/backend/src/modules/extraction/extraction.controller.ts` (neu)
- `apps/backend/src/modules/extraction/extraction.module.ts` (neu)

---

**Story 6.3: File-Parser-Service für PDF/Markdown/Text**

Als Extraction-Service,
möchte ich Text aus verschiedenen File-Formaten extrahieren,
damit ich strukturierte Input-Daten für LLM habe.

**Acceptance Criteria:**
1. FileParsers Service erstellt mit Methoden für PDF, Markdown, Plain Text
2. pdf-parse Library (v2.4.5) integriert für PDF-Text-Extraktion
3. Markdown und Plain Text: Direct UTF-8 read
4. Error-Handling: Leere PDFs, korrupte Dateien → klare Error-Messages
5. Unit-Tests mit Sample-Files (sample-cv.pdf, sample-cv.md, sample-cv.txt)
6. Performance: <5s für 50-page PDF
7. Output: Plain text string (ohne Formatierung)

**Prerequisites:** Story 6.2 (File-Upload-Endpoint)

**Affected Files:**
- `apps/backend/src/modules/extraction/services/file-parsers.service.ts` (neu)
- `apps/backend/test/fixtures/sample-cv.pdf` (neu)

---

**Story 6.4: Gemini API Integration mit @google/genai SDK**

Als Backend-Entwickler,
möchte ich Google Gemini 2.0 Flash für CV-Extraktion nutzen,
damit unstrukturierte Daten in JSON Resume Schema konvertiert werden.

**Acceptance Criteria:**
1. @google/genai Package (v1.28.0+) installiert
2. GeminiService erstellt mit generateContent() Methode
3. Gemini 2.0 Flash Modell (gemini-2.0-flash-001) konfiguriert
4. Environment-Variable GEMINI_API_KEY in .env.example dokumentiert
5. Prompt-Template für JSON Resume Schema-Extraktion erstellt
6. generationConfig: temperature=0.2, maxOutputTokens=8192
7. Timeout-Handling: 60s hard timeout
8. Retry-Logic: 3 Versuche mit exponential backoff (1s, 2s, 4s)
9. Error-Handling: 503 (retry), 401 (invalid key), Timeout (clear error)
10. Unit-Tests mit Mock-Responses

**Prerequisites:** Story 6.3 (File-Parser)

**Affected Files:**
- `apps/backend/src/modules/extraction/services/gemini.service.ts` (neu)
- `apps/backend/.env.example` (update)

---

**Story 6.5: Extraction-Orchestration mit Validation**

Als Extraction-Service,
möchte ich den gesamten Extraction-Flow orchestrieren (Parse → LLM → Validate),
damit der Admin ein validiertes Extraction-Result erhält.

**Acceptance Criteria:**
1. ExtractionService.extractFromFile() Methode erstellt
2. Flow: File → FileParsers.parse() → GeminiService.generate() → CVSchema.safeParse()
3. Success-Case: Valides JSON → Save as Draft (status='draft', source='ai-extraction')
4. Validation-Error-Case: Return { success: false, errors: ZodError[], rawData: {...} }
5. File-Hash (SHA-256) berechnen und in cv_versions.file_hash speichern
6. Deduplication: Wenn file_hash bereits existiert → optional skip extraction
7. Correlation-ID durch gesamten Flow (Logging)
8. ExtractionResultDto (Zod-Schema) für Response definiert
9. Integration-Tests mit Mock Gemini API

**Prerequisites:** Story 6.4 (Gemini Integration)

**Affected Files:**
- `apps/backend/src/modules/extraction/services/extraction.service.ts` (neu)
- `apps/backend/src/modules/extraction/dto/extraction-result.dto.ts` (neu)
- `packages/shared-types/src/cv.schema.ts` (genutzt)

---

**Story 6.6: Review-Interface mit Diff-Viewer**

Als Admin,
möchte ich extrahierte CV-Daten im Vergleich zum aktuellen CV sehen,
damit ich Änderungen validieren kann bevor ich sie speichere.

**Acceptance Criteria:**
1. DiffViewer Component erstellt mit react-diff-viewer Library
2. Side-by-Side Ansicht: Links aktueller CV, Rechts extrahierter CV
3. Syntax-Highlighting für JSON
4. Color-Coding: Grün (added), Rot (removed), Gelb (changed)
5. Validation-Errors werden highlighted (rote Borders + Tooltips)
6. Error-Messages zeigen Zod errorPath und message
7. ProgressSteps Component zeigt aktuellen Status (Upload → Extracting → Review → Save)
8. "Approve & Publish" Button disabled wenn Validation Errors vorhanden
9. "Edit Manually" Button öffnet JSONEditor für Fehlerkorrektur

**Prerequisites:** Story 6.5 (Extraction-Service)

**Affected Files:**
- `apps/frontend/src/components/DiffViewer.tsx` (neu)
- `apps/frontend/src/components/ProgressSteps.tsx` (neu)
- `apps/frontend/src/routes/admin/cv/extract.tsx` (update)

---

**Story 6.7: JSON-Editor mit Monaco für manuelles Editing**

Als Admin,
möchte ich extrahierte Daten inline editieren können,
damit ich Validation-Errors oder unvollständige Extractions korrigieren kann.

**Acceptance Criteria:**
1. JSONEditor Component mit @monaco-editor/react erstellt
2. Syntax-Highlighting für JSON
3. Schema-Validation (CVSchema) integriert in Editor (live errors)
4. Auto-Completion basierend auf JSON Resume Schema
5. Lazy-Loading: Monaco Editor erst laden wenn geöffnet (Performance)
6. "Validate" Button führt CVSchema.safeParse() aus
7. "Save" Button speichert editierte Daten zurück zu DiffViewer
8. Error-Anzeige: Inline markers für Validation-Errors
9. Performance: <500ms initial render

**Prerequisites:** Story 6.6 (Review-Interface)

**Affected Files:**
- `apps/frontend/src/components/JSONEditor.tsx` (neu)

---

**Story 6.8: Draft-Publish-Flow mit Versionierung**

Als Admin,
möchte ich einen validierten Extraction-Draft als aktive CV-Version publishen,
damit die neuen Daten auf der öffentlichen Seite erscheinen.

**Acceptance Criteria:**
1. POST `/api/admin/cv/publish-draft` Endpoint erstellt
2. Request-Body: { draftId: number, editedData: CVSchema }
3. Backend-Flow: Validate editedData → Archive current active version → Set draft as active
4. Database-Transaction: Rollback bei Fehler
5. cv_versions.status: 'draft' → 'active', old active → 'archived'
6. Success-Response: { success: true, activeVersionId, message }
7. Frontend: Success-Toast, Redirect zu /admin/dashboard
8. Error-Handling: 400 (invalid CVSchema), 500 (DB error)
9. Integration-Tests für Publish-Flow

**Prerequisites:** Story 6.7 (JSON-Editor)

**Affected Files:**
- `apps/backend/src/modules/cv/cv.controller.ts` (update)
- `apps/backend/src/modules/cv/cv.service.ts` (update)

---

**Story 6.9: Versionshistorie-Interface**

Als Admin,
möchte ich alle CV-Versionen mit Metadaten sehen,
damit ich den Verlauf meiner CV-Updates nachvollziehen kann.

**Acceptance Criteria:**
1. GET `/api/admin/cv/versions` Endpoint erstellt
2. Query-Params: limit (default 50), status (filter by draft/active/archived)
3. Response: Array von CVVersion (id, status, source, createdAt, dataPreview)
4. Frontend-Route: `/admin/cv/versions` erstellt
5. Tabellen-Ansicht mit Columns: ID, Status, Source, Created Date, Preview
6. Sortierung nach createdAt (neueste zuerst)
7. Filterung nach Status (dropdown)
8. "View" Button öffnet Modal mit vollständigem JSON (read-only)
9. "Rollback" Button für archived Versions

**Prerequisites:** Story 6.8 (Draft-Publish)

**Affected Files:**
- `apps/backend/src/modules/cv/cv.controller.ts` (update)
- `apps/frontend/src/routes/admin/cv/versions.tsx` (neu)

---

**Story 6.10: Rollback-Funktionalität**

Als Admin,
möchte ich zu einer vorherigen CV-Version zurückkehren können,
damit ich fehlerhafte Updates rückgängig machen kann.

**Acceptance Criteria:**
1. POST `/api/admin/cv/rollback/:versionId` Endpoint erstellt
2. Backend-Flow: Load version data → Archive current active → Create new active version (source='rollback')
3. Database-Transaction für Atomicität
4. Success-Response: { success: true, message, newActiveVersion }
5. Frontend: Confirmation-Dialog vor Rollback ("Are you sure?")
6. Success-Toast nach Rollback, Version-List refresh
7. Error-Handling: 400 (version not found), 500 (rollback failed)
8. Integration-Tests für Rollback-Flow
9. Logging: Rollback-Events mit correlation-ID

**Prerequisites:** Story 6.9 (Versionshistorie)

**Affected Files:**
- `apps/backend/src/modules/cv/cv.controller.ts` (update)
- `apps/backend/src/modules/cv/cv.service.ts` (update)
- `apps/frontend/src/routes/admin/cv/versions.tsx` (update)

---

**Story 6.11: Observability & Logging für Extraction-Flow**

Als DevOps/Entwickler,
möchte ich strukturierte Logs für den Extraction-Flow,
damit ich Performance-Probleme und Fehler debuggen kann.

**Acceptance Criteria:**
1. Pino Logger in ExtractionService integriert
2. Correlation-ID durch gesamten Flow (Upload → Parse → LLM → Validate → Save)
3. Log-Events: extraction_started, file_parsed, gemini_call_started, gemini_call_completed, validation_completed, draft_saved
4. Gemini API Latency, inputTokens, outputTokens geloggt
5. Error-Logs mit Context: correlationId, errorCount, errorPaths, draftId
6. Log-Level: INFO (success), WARN (validation errors), ERROR (failures)
7. JSON-Format für strukturiertes Logging
8. Rate-Limit-Events geloggt (429 responses)
9. Performance-Metrics: P50, P95 Extraction-Time trackbar

**Prerequisites:** Story 6.5 (Extraction-Service)

**Affected Files:**
- `apps/backend/src/modules/extraction/extraction.service.ts` (update)
- `apps/backend/src/modules/extraction/services/gemini.service.ts` (update)

---

**Story 6.12: E2E-Testing für Extraction-Flow**

Als QA/Entwickler,
möchte ich automatisierte E2E-Tests für kritische Extraction-Flows,
damit Regressions früh erkannt werden.

**Acceptance Criteria:**
1. Playwright E2E-Tests für 5 Szenarien:
   - Happy Path: Upload PDF → Extract → Review → Publish
   - Validation Errors: Extract → Errors shown → Edit → Publish
   - Rollback: Versions → Select → Rollback
   - Rate Limiting: 6 requests → 429 error
   - LLM Failure: Mock API failure → Manual Editor fallback
2. Test-Fixtures: sample-cv.pdf, large-cv.pdf, invalid-cv.pdf
3. Mock-Service-Worker (MSW) für Gemini API Mocking
4. Assertions: DOM-Elements, API-Responses, Database-State
5. CI/CD-Integration: Tests laufen bei jedem Push
6. Test-Artifacts: Screenshots, Videos bei Failure

**Prerequisites:** Story 6.10 (alle Features fertig)

**Affected Files:**
- `apps/frontend/e2e/extraction.spec.ts` (neu)
- `apps/backend/test/fixtures/` (sample files)

---

## Epic 7: Production Deployment & Operations

**Goal:** cv-hub läuft stabil unter eigener Domain mit HTTPS, Monitoring und Backups

**Value Proposition:**
Von "lokales Projekt" zu "professionelle Online-Präsenz". Diese Epic bringt cv-hub in die Produktion und macht es zur echten Visitenkarte. Ohne Deployment bleibt alles nur ein Experiment.

**Scope:**
- Docker Compose Production-Setup:
  - Optimierte Images (Multi-Stage Builds)
  - Persistent Volumes (SQLite-DB, CV-Backups)
  - Health-Checks
  - Restart-Policies
- Domain-Konfiguration:
  - DNS-Setup (A-Record, AAAA-Record)
  - Reverse Proxy (Nginx oder Traefik)
- HTTPS/SSL:
  - Let's Encrypt (Certbot oder ACME)
  - Automatische Zertifikat-Erneuerung
  - HTTP → HTTPS Redirect
  - Security Headers (Helmet.js)
- Monitoring & Logging:
  - Strukturierte Logs (Winston)
  - Log-Rotation
  - Error-Tracking (z.B. Sentry - optional)
  - Uptime-Monitoring (UptimeRobot, Better Uptime - optional)
- Backup-Strategie:
  - Automatisches SQLite-DB-Backup (täglich)
  - CV-JSON Backups (bereits in Epic 2/6)
  - Backup-Retention-Policy
- CI/CD Production-Pipeline:
  - Automatisches Deployment nach Git Push
  - Smoke-Tests nach Deployment
  - Rollback-Mechanismus
- Security:
  - Firewall-Konfiguration
  - Rate-Limiting (Production-Level)
  - Secret-Management (Environment-Variablen)

**Out of Scope:**
- CDN für Assets (Growth-Feature)
- Horizontal Scaling (nicht nötig für persönliches Projekt)
- Advanced Monitoring (Grafana, Prometheus - optional)

**Dependencies:**
Epic 1-6 (alle Features müssen fertig sein)

**Key Deliverables:**
- ✅ cv-hub läuft unter eigener Domain
- ✅ HTTPS funktioniert (Let's Encrypt)
- ✅ SSL Labs Score: A oder höher
- ✅ CI/CD deployt automatisch
- ✅ Backups laufen automatisch
- ✅ Monitoring aktiv

**Estimated Effort:** 1 Sprint (1-2 Wochen)

### Stories

**Story 7.1: Production Docker Compose Setup**

Als DevOps Engineer,
möchte ich eine Production-optimierte Docker Compose Konfiguration mit Multi-Stage Builds und Resource Limits,
damit alle Services (Backend, Frontend, Nginx, Certbot) stabil und performant in Production laufen.

**Acceptance Criteria:**
1. `docker-compose.yml` definiert Services: nginx, frontend, backend, certbot
2. Multi-Stage Dockerfiles für Backend und Frontend (Build + Runtime Stage)
3. Resource Limits konfiguriert (Backend: 512M RAM, Frontend: 256M, Nginx: 128M)
4. Restart Policies: `unless-stopped` für alle Services
5. Persistent Volumes gemountet: `/app/data`, `/app/logs`, `/app/uploads`, `/etc/letsencrypt`
6. Docker Health Checks für Backend (`/api/health`) und Frontend (HTTP 200)
7. `docker-compose up -d` startet alle Services erfolgreich
8. `docker-compose ps` zeigt alle Services als "Up (healthy)"

**Prerequisites:** Epic 1-6 abgeschlossen (alle Features implementiert)

**Affected Files:**
- `docker-compose.yml`
- `apps/backend/Dockerfile.prod`
- `apps/frontend/Dockerfile.prod`
- `.dockerignore`

---

**Story 7.2: Nginx Reverse Proxy Konfiguration**

Als DevOps Engineer,
möchte ich Nginx als Reverse Proxy mit SSL Termination und Rate Limiting konfigurieren,
damit alle HTTP/HTTPS Requests effizient geroutet und geschützt werden.

**Acceptance Criteria:**
1. Nginx Container konfiguriert mit Alpine Image (`nginx:alpine`)
2. `nginx.conf` definiert HTTP → HTTPS Redirect (Port 80 → 443)
3. Proxy-Konfiguration für Backend (`/api/*` → `backend:3000`)
4. Proxy-Konfiguration für Frontend (`/*` → `frontend:5173`)
5. Rate Limiting konfiguriert (100 req/min general, 50 req/min admin)
6. Gzip Compression enabled für text-based Assets
7. Static Asset Serving mit Caching Headers (`Cache-Control`)
8. Nginx lädt ohne Fehler: `docker-compose logs nginx` zeigt keine Errors

**Prerequisites:** Story 7.1 (Docker Compose Setup)

**Affected Files:**
- `nginx/nginx.conf`
- `nginx/Dockerfile`

---

**Story 7.3: Let's Encrypt SSL Integration**

Als DevOps Engineer,
möchte ich automatisierte SSL-Zertifikate via Let's Encrypt mit Certbot,
damit cv-hub unter HTTPS mit gültigem Zertifikat läuft.

**Acceptance Criteria:**
1. Certbot Container konfiguriert (`certbot/certbot` Image)
2. ACME Challenge Webroot konfiguriert: Nginx serves `/.well-known/acme-challenge/`
3. Initiales Zertifikat kann erstellt werden: `certbot certonly --webroot`
4. SSL-Zertifikate gemountet in Nginx: `/etc/letsencrypt/live/{domain}/`
5. Nginx SSL-Konfiguration korrekt (fullchain.pem, privkey.pem)
6. HTTPS funktioniert: `https://cv-hub.example.com` lädt ohne Warnung
7. Certificate Auto-Renewal via Certbot (12h Check-Interval)
8. Nginx reload nach Certificate Renewal: `nginx -s reload`

**Prerequisites:** Story 7.2 (Nginx Proxy steht)

**Affected Files:**
- `docker-compose.yml` (certbot service)
- `nginx/nginx.conf` (SSL config)
- `certbot/renew-hook.sh`

---

**Story 7.4: Security Hardening (SSL, Headers, Firewall)**

Als DevOps Engineer,
möchte ich Security Best Practices für Production (SSL A+, Security Headers, Firewall),
damit cv-hub gegen gängige Angriffe geschützt ist.

**Acceptance Criteria:**
1. Security Headers in Nginx konfiguriert (HSTS, X-Frame-Options, CSP, X-Content-Type-Options)
2. TLS 1.2+ only (TLS 1.0/1.1 disabled)
3. Strong Cipher Suites (Mozilla Modern Profile)
4. SSL Labs Test: Score A oder höher
5. UFW Firewall auf VPS konfiguriert (nur Ports 22, 80, 443 offen)
6. `.env` File Permissions: 600 (nur Owner read/write)
7. Secrets Management: SESSION_SECRET (64-char hex), ADMIN_PASSWORD (bcrypt)
8. npm audit: 0 critical/high vulnerabilities

**Prerequisites:** Story 7.3 (SSL funktioniert)

**Affected Files:**
- `nginx/nginx.conf` (Security Headers)
- `.env.example` (dokumentierte Secrets)
- VPS Firewall Config (UFW)

---

**Story 7.5: Production Environment Configuration**

Als DevOps Engineer,
möchte ich Environment-Variablen für Production sauber verwalten,
damit alle Secrets sicher und alle Configs korrekt geladen werden.

**Acceptance Criteria:**
1. `.env.example` enthält alle Required Variables mit Kommentaren
2. `.env` ist in `.gitignore` (niemals committed)
3. Environment Variables dokumentiert: NODE_ENV, DATABASE_URL, SESSION_SECRET, GEMINI_API_KEY, DOMAIN, etc.
4. Backend lädt `.env` via `@nestjs/config`
5. Frontend erhält `VITE_API_URL` via Environment
6. Docker Compose lädt `.env` File automatisch
7. Validierung: Fehlende Required Variables → Startup-Fehler mit klarer Message
8. README enthält "Environment Setup" Sektion

**Prerequisites:** Story 7.1 (Docker Compose Setup)

**Affected Files:**
- `.env.example`
- `.gitignore`
- `apps/backend/src/config/env.validation.ts`
- `README.md`

---

**Story 7.6: Production Health Check & Monitoring**

Als DevOps Engineer,
möchte ich erweiterte Health Checks und strukturierte Logs für Production Monitoring,
damit ich den Service-Status proaktiv überwachen kann.

**Acceptance Criteria:**
1. Health Check Endpoint erweitert: `GET /api/health` enthält SSL expiry, uptime, version
2. Winston Logger konfiguriert (JSON Logs, Log-Rotation täglich)
3. Logs schreiben nach `/app/logs/backend-YYYY-MM-DD.log`
4. Log Retention: 7 Tage, alte Logs werden komprimiert (gzip)
5. Correlation IDs in allen Logs (Request Tracing)
6. Docker Health Checks funktionieren: `docker-compose ps` zeigt "healthy"
7. Logs zugreifbar: `docker-compose logs -f backend` zeigt strukturierte JSON
8. Health Check Response enthält: status, uptime, version, database, ssl

**Prerequisites:** Story 7.1 (Docker Compose Setup)

**Affected Files:**
- `apps/backend/src/health/health.service.ts`
- `apps/backend/src/logging/winston.config.ts`
- `apps/backend/src/middleware/correlation-id.middleware.ts`

---

**Story 7.7: Automated Backup Strategy**

Als DevOps Engineer,
möchte ich automatische Daily Backups für SQLite-DB und Uploads mit Retention Policy,
damit Daten bei Disaster Recovery wiederherstellbar sind.

**Acceptance Criteria:**
1. Backup-Script erstellt: `/opt/cv-hub-backups/backup.sh`
2. Script erstellt SQLite-DB-Copy mit Timestamp: `cv-hub-YYYY-MM-DD.db`
3. Script erstellt tar.gz von Uploads: `uploads-YYYY-MM-DD.tar.gz`
4. SHA-256 Checksums werden berechnet und gespeichert
5. Backup-Manifest (`backup-manifest.json`) wird aktualisiert
6. Cron-Job konfiguriert: Täglich 02:00 UTC
7. Backup-Retention: 30 Tage (alte Backups werden gelöscht)
8. Backup-Restore dokumentiert und erfolgreich getestet

**Prerequisites:** Story 7.1 (Docker Compose mit Volumes)

**Affected Files:**
- `scripts/backup.sh`
- `scripts/restore.sh`
- `docs/backup-restore.md`
- Cron Config (VPS)

---

**Story 7.8: GitHub Actions CI/CD Pipeline**

Als DevOps Engineer,
möchte ich eine vollautomatische CI/CD-Pipeline mit Test, Build, Deploy und Smoke Tests,
damit Deployments schnell und zuverlässig ablaufen.

**Acceptance Criteria:**
1. GitHub Actions Workflow erstellt: `.github/workflows/deploy.yml`
2. Stage 1 (Test): ESLint, TypeScript, Vitest, Jest, npm audit
3. Stage 2 (Build): Build Frontend + Backend, Build Docker Images
4. Stage 3 (Deploy): SSH zu VPS, git pull, docker-compose up -d --build
5. Stage 4 (Smoke Tests): curl health check + frontend → 200 OK
6. Workflow triggert bei Push auf main branch
7. Deployment dauert <5 Minuten (end-to-end)
8. Rollback bei Smoke-Test-Failure: git checkout previous commit, redeploy

**Prerequisites:** Story 7.1-7.6 (Production Setup komplett)

**Affected Files:**
- `.github/workflows/deploy.yml`
- GitHub Secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY

---

**Story 7.9: VPS Provisioning & Initial Deployment**

Als DevOps Engineer,
möchte ich das VPS initial einrichten und cv-hub zum ersten Mal deployen,
damit die Produktionsumgebung einsatzbereit ist.

**Acceptance Criteria:**
1. VPS provisioned (Hetzner/DigitalOcean: 2 vCPU, 2GB RAM, 40GB SSD)
2. Docker + Docker Compose installiert
3. UFW Firewall konfiguriert (Ports 22, 80, 443)
4. Repository geklont: `/opt/cv-hub`
5. `.env` erstellt mit allen Required Variables
6. DNS A Record konfiguriert: `cv-hub.example.com` → VPS IP
7. Initiales SSL-Zertifikat erstellt: `certbot certonly --webroot`
8. `docker-compose up -d` startet alle Services erfolgreich

**Prerequisites:** Story 7.1-7.8 (alle Configs vorhanden)

**Affected Files:**
- VPS Setup (Dokumentation)
- DNS Config
- `/opt/cv-hub/.env`

---

**Story 7.10: Post-Deployment Verification & Go-Live**

Als DevOps Engineer,
möchte ich eine vollständige Post-Deployment-Checkliste durchlaufen,
damit ich sicherstellen kann, dass cv-hub Production-Ready ist.

**Acceptance Criteria:**
1. Public CV Page lädt: `https://cv-hub.example.com/` → 200 OK
2. Admin Login funktioniert: `https://cv-hub.example.com/admin/login`
3. Test Invite Link erstellt und funktioniert
4. CV Extraction getestet (Upload PDF → Extract → Save)
5. Lighthouse Score >90 (alle Kategorien: Performance, Accessibility, SEO, Best Practices)
6. SSL Labs Test: A oder höher
7. 24h Stability Test: Keine Memory Leaks, keine kritischen Errors in Logs
8. Disaster Recovery getestet: Backup-Restore erfolgreich
9. Monitoring & Alerting aktiv (optional: UptimeRobot)
10. README enthält vollständige Deployment-Dokumentation

**Prerequisites:** Story 7.9 (Initial Deployment abgeschlossen)

**Affected Files:**
- `docs/go-live-checklist.md`
- `README.md` (Production Deployment Section)

---

## Implementation Sequence & Phases

### Phase 1: Foundation (Woche 1-2)
**Epic 1: Project Foundation & Infrastructure**
- Ziel: Lokales Development-Environment steht
- Parallel-Arbeit: Keine (Foundation zuerst)

### Phase 2: Data Layer (Woche 3-4)
**Epic 2: CV Data Foundation**
- Ziel: CV-Daten strukturiert und API verfügbar
- Abhängigkeit: Epic 1 abgeschlossen

### Phase 3: Public Experience (Woche 5-7)
**Epic 3: Public Portfolio Experience**
- Ziel: Öffentliche CV-Seite live und begeisternd
- Abhängigkeit: Epic 2 abgeschlossen
- Parallel möglich: Epic 4 kann parallel starten (ab Woche 6)

### Phase 4: Privacy Features (Woche 7-9)
**Epic 4: Privacy-First Sharing System**
- Ziel: Personalisierte Links funktionieren
- Abhängigkeit: Epic 2 + Epic 3 (Frontend-Basis)
- Parallel mit: Epic 5 kann parallel starten (ab Woche 8)

### Phase 5: Admin Experience (Woche 9-11)
**Epic 5: Link Management Dashboard**
- Ziel: Admin-Interface für Link-Verwaltung
- Abhängigkeit: Epic 4 (Link-System existiert)
- Parallel mit: Epic 6 kann parallel starten (ab Woche 10)

### Phase 6: Intelligence (Woche 11-13)
**Epic 6: Intelligent CV Maintenance**
- Ziel: KI-Extraktion reduziert Wartungsaufwand
- Abhängigkeit: Epic 2 (Data Models) + Epic 5 (Admin-Dashboard)

### Phase 7: Production Launch (Woche 14-15)
**Epic 7: Production Deployment & Operations**
- Ziel: cv-hub läuft produktiv unter eigener Domain
- Abhängigkeit: Epic 1-6 abgeschlossen
- **Go-Live!** 🚀

---

## Dependencies & Critical Path

```
Epic 1 (Foundation)
  ↓
Epic 2 (Data Layer)
  ↓
Epic 3 (Public Experience) ← Critical Path
  ↓
Epic 4 (Privacy Sharing)
  ↓
Epic 5 (Admin Dashboard)
  ↓
Epic 6 (KI-Extraktion)
  ↓
Epic 7 (Production Launch) ← Go-Live
```

**Parallel-Opportunities:**
- **Epic 3 + Epic 4:** Ab Woche 6 (Frontend-Basis steht)
- **Epic 4 + Epic 5:** Ab Woche 8 (Link-System-Basis steht)
- **Epic 5 + Epic 6:** Ab Woche 10 (Admin-Dashboard-Basis steht)

**Critical Path:** Epic 1 → Epic 2 → Epic 3 → Epic 7
- Ohne Foundation keine Daten
- Ohne Daten keine öffentliche Seite
- Ohne öffentliche Seite kein Launch
- Epics 4-6 sind "Value-Add", aber nicht Launch-Blocker (falls MVP früher gewünscht)

---

## Risk Mitigation

**Epic 3 (Public Experience):**
- **Risiko:** Performance-Targets verfehlt (Lighthouse <90)
- **Mitigation:** Frühzeitige Performance-Tests, SSR-Profiling, Bundle-Analyse

**Epic 4 (Privacy Sharing):**
- **Risiko:** Token-Kollisionen (sehr unwahrscheinlich mit CUID/NanoID)
- **Mitigation:** Unit-Tests für Token-Generierung, DB-Constraint (unique)

**Epic 6 (KI-Extraktion):**
- **Risiko:** LLM-API-Ausfälle oder schlechte Extraktion
- **Mitigation:** Retry-Logic, Fallback zu manuellem JSON-Editing, User-Review-Interface

**Epic 7 (Production):**
- **Risiko:** Deployment-Fehler, SSL-Probleme
- **Mitigation:** Staging-Environment testen, Rollback-Mechanismus, Dokumentation

---

## Success Metrics

**MVP-Launch-Kriterien (Nach Epic 7):**
- ✅ cv-hub läuft unter eigener Domain mit HTTPS
- ✅ Öffentliche CV-Seite: Lighthouse Score >90
- ✅ Personalisierte Links funktionieren (Epic 4)
- ✅ Admin kann Links verwalten (Epic 5)
- ✅ KI-Extraktion funktional (Epic 6)
- ✅ Open-Source-Code auf GitHub veröffentlicht

**Qualitative Ziele:**
- **Stolz:** "Diese Website repräsentiert mich gut"
- **Wow-Moment:** Positive Reaktionen auf personalisierte Links
- **Wartbarkeit:** CV-Updates in Minuten statt Stunden
- **Code-Qualität:** "Der Code zeigt meine Standards"

---

## Next Steps

1. **Architecture Definition** - Run: `/bmad:bmm:agents:architect` (Workflow: `create-architecture`)
   - Technical decisions für Stack-Details
   - API-Design & Schema-Definitionen
   - Frontend-Architektur & Component-Struktur

2. **Tech Spec Creation** - Run: `/bmad:bmm:agents:pm` (Workflow: `tech-spec`)
   - Detaillierte technische Spezifikation
   - Implementation-Guidance pro Epic

3. **Story Breakdown** - Im Tech-Spec oder später während Implementation
   - Epics werden in bite-sized Stories aufgebrochen
   - Pro Epic: 5-10 Stories für 200k context agents

---

**Für Implementation:** Nutze den `create-story` Workflow, um individuelle Story-Implementation-Plans aus diesem Epic-Breakdown zu generieren (im Tech-Spec oder Architektur-Dokument).
