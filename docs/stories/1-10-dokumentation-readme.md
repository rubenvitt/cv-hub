# Story 1.10: Dokumentation & README

Status: drafted

## Story

Als Entwickler,
möchte ich eine vollständige README mit Setup-Anleitung,
damit andere (oder ich in Zukunft) das Projekt schnell starten können.

## Acceptance Criteria

1. **README.md enthält vollständige Projekt-Beschreibung**
   - Projekt-Name und Zweck klar beschrieben
   - Executive Summary erklärt was cv-hub ist und warum es existiert
   - Zielgruppe und Use-Cases dokumentiert
   - Link zu detaillierter Dokumentation (falls vorhanden)

2. **Tech-Stack-Übersicht ist dokumentiert**
   - Backend: NestJS, TypeORM, SQLite, Pino Logging
   - Frontend: TanStack Start, React 19, Tailwind CSS v4, shadcn/ui
   - Monorepo: pnpm Workspaces
   - Deployment: Docker Compose, Nginx, Let's Encrypt
   - Tabelle oder Liste mit Versionen und Begründungen

3. **Setup-Anleitung ist vollständig und testbar**
   - **Prerequisites:** Node.js 20 LTS, pnpm 9+, Docker 24+, Git
   - **Installation:** Step-by-step Anleitung
     - Repository klonen
     - Dependencies installieren (`pnpm install`)
     - Environment-Variablen konfigurieren (`.env` aus `.env.example`)
     - Datenbank initialisieren (Migrations)
   - **Start:** Commands für Development
     - Docker Compose: `docker-compose up`
     - Native: `pnpm dev` (Root) oder workspace-spezifisch
   - **Verification:** Wie prüft man dass alles läuft?
     - Backend Health Check: `curl http://localhost:3000/api/health`
     - Frontend: `http://localhost:5173` im Browser
   - Neue Developer kann Setup ohne externe Hilfe durchführen (< 15 Minuten)

4. **Development-Workflow ist dokumentiert**
   - **Linting:** `pnpm lint` (ESLint + Prettier Check)
   - **Formatting:** `pnpm format` (Prettier Write)
   - **Testing:** `pnpm test` (Jest Backend, Vitest Frontend)
   - **Type-Checking:** `pnpm type-check` (TypeScript)
   - **Build:** `pnpm build` (Production Builds)
   - **Docker:** `docker-compose up` / `docker-compose down`
   - **Migrations:** `pnpm migration:generate`, `pnpm migration:run`
   - **Pre-Commit-Hooks:** Husky + lint-staged (automatisch)
   - Troubleshooting-Sektion für häufige Probleme

5. **Ordnerstruktur-Übersicht ist enthalten**
   - Monorepo-Struktur visualisiert (Tree-Format oder Tabelle)
   - `apps/backend/` - NestJS API
   - `apps/frontend/` - TanStack Start App
   - `packages/shared-types/` - Shared Zod Schemas
   - `.husky/` - Git Hooks
   - `docker-compose.yml` - Container Orchestration
   - Kurze Beschreibung jedes Top-Level-Ordners

6. **Environment-Variablen sind dokumentiert**
   - `.env.example` existiert mit Template-Werten
   - Jede Variable hat Kommentar mit:
     - Zweck (was macht die Variable?)
     - Beispiel-Wert
     - Erforderlich vs. Optional
     - Sicherheitshinweise (z.B. "NICHT committen!")
   - README referenziert `.env.example` und erklärt Setup

7. **Contribution-Guidelines und License sind vorhanden**
   - `CONTRIBUTING.md` (optional für MVP, aber vorbereitet):
     - Code-Style-Guides (ESLint/Prettier)
     - Branch-Strategie (z.B. feature/*, fix/*)
     - PR-Prozess
     - Testing-Anforderungen
   - `LICENSE` File: MIT License (oder User-Präferenz)
   - README enthält Sektion "Contributing" mit Link zu Guidelines
   - README enthält License-Badge

8. **Optional: Architektur-Diagramm**
   - Mermaid-Diagramm oder Text-basierte Darstellung
   - Zeigt: Frontend ↔ Backend ↔ Database ↔ External APIs
   - Einfach genug für schnelles Verständnis (High-Level)
   - Kann als separates `ARCHITECTURE.md` existieren

## Tasks / Subtasks

- [ ] **Task 1: README.md Struktur erstellen** (AC: #1, #2, #5)
  - [ ] 1.1 Erstelle README.md mit grundlegender Markdown-Struktur
  - [ ] 1.2 Schreibe Executive Summary basierend auf PRD
  - [ ] 1.3 Erstelle Tech-Stack-Tabelle mit Versionen und Rationales
  - [ ] 1.4 Dokumentiere Ordnerstruktur mit Tree-Format
  - [ ] 1.5 Füge Projekt-Badges hinzu (License, Build Status, etc.)

- [ ] **Task 2: Setup-Anleitung schreiben** (AC: #3)
  - [ ] 2.1 Dokumentiere Prerequisites (Node.js, pnpm, Docker, Git)
  - [ ] 2.2 Schreibe Installation-Steps mit Code-Blocks
  - [ ] 2.3 Dokumentiere `.env` Setup (Referenz zu `.env.example`)
  - [ ] 2.4 Erkläre Database-Migrations-Setup
  - [ ] 2.5 Dokumentiere Start-Commands (Docker + Native)
  - [ ] 2.6 Füge Verification-Steps hinzu (Health Check, Frontend)
  - [ ] 2.7 Teste Anleitung selbst: Fresh Clone → Running App (< 15 Min)

- [ ] **Task 3: Development-Workflow dokumentieren** (AC: #4)
  - [ ] 3.1 Dokumentiere alle pnpm Scripts im Root `package.json`
  - [ ] 3.2 Erkläre Linting, Formatting, Testing, Type-Checking
  - [ ] 3.3 Dokumentiere Docker-Commands (up, down, logs, exec)
  - [ ] 3.4 Dokumentiere TypeORM Migrations-Workflow
  - [ ] 3.5 Erkläre Pre-Commit-Hooks (Husky + lint-staged)
  - [ ] 3.6 Füge Troubleshooting-Sektion hinzu:
    - Hook läuft nicht → `pnpm install`
    - Docker-Probleme → `docker-compose down -v && docker-compose up`
    - Port bereits belegt → Ports in `docker-compose.yml` anpassen
    - Migrations-Fehler → `pnpm migration:drop && pnpm migration:run`

- [ ] **Task 4: .env.example erstellen** (AC: #6)
  - [ ] 4.1 Erstelle `.env.example` im Root
  - [ ] 4.2 Dokumentiere alle Backend Environment-Variablen:
    - `NODE_ENV` (development/production/test)
    - `PORT` (3000)
    - `DATABASE_PATH` (./data/cv-hub.db)
    - `CORS_ORIGIN` (http://localhost:5173)
    - `LOG_LEVEL` (debug/info/warn/error)
    - `SESSION_SECRET` (generierter Secret)
    - `GEMINI_API_KEY` (für Epic 6, optional für Epic 1)
  - [ ] 4.3 Füge Kommentare mit Beispiel-Werten hinzu
  - [ ] 4.4 Markiere erforderliche vs. optionale Variablen
  - [ ] 4.5 Füge Sicherheitswarnung hinzu: "NEVER commit .env!"

- [ ] **Task 5: Contributing und License** (AC: #7)
  - [ ] 5.1 Erstelle LICENSE File (MIT License)
  - [ ] 5.2 Erstelle CONTRIBUTING.md (optional, kann auch später):
    - Code-Style (ESLint, Prettier)
    - Branch-Strategie (feature/*, fix/*)
    - Commit-Message-Format
    - PR-Prozess
    - Testing-Requirements
  - [ ] 5.3 Füge "Contributing"-Sektion zu README hinzu
  - [ ] 5.4 Füge License-Badge zu README hinzu

- [ ] **Task 6: Optional - Architektur-Diagramm** (AC: #8)
  - [ ] 6.1 Erstelle Mermaid-Diagramm oder Ascii-Art
  - [ ] 6.2 Zeige High-Level-Architektur:
    - User → Nginx → Frontend (TanStack Start)
    - User → Nginx → Backend (NestJS) → SQLite
    - Backend → Gemini API (Epic 6)
  - [ ] 6.3 Füge Diagramm zu README hinzu oder erstelle `ARCHITECTURE.md`

- [ ] **Task 7: Smoke-Test der Dokumentation** (AC: All)
  - [ ] 7.1 Simuliere Fresh Setup:
    - Clone Repo in neues Verzeichnis
    - Folge README-Anleitung Step-by-Step
    - Dokumentiere Zeit (sollte < 15 Min sein)
    - Notiere Unklarheiten oder fehlende Steps
  - [ ] 7.2 Fixe identifizierte Probleme
  - [ ] 7.3 Bitte Kollegen/Freund um unabhängigen Test (optional)
  - [ ] 7.4 Commit finale README-Version

## Dev Notes

### Zusammenhang mit Story 1.9 (Development Tooling)

Story 1.10 dokumentiert die in Story 1.9 eingerichteten Development Tools:
- Husky Pre-Commit-Hooks
- lint-staged
- ESLint + Prettier
- Workflow-Commands

Die README sollte erklären WIE diese Tools genutzt werden, nicht WAS sie tun (das ist in Story 1.9 implementiert).

### Testing-Strategie aus Tech Spec Epic 1

**AC-7: Dokumentation ist vollständig**
- README.md mit vollständiger Setup-Anleitung
- `.env.example` dokumentiert alle Variablen
- Neue Developer kann Setup ohne externe Hilfe durchführen
- Alle Scripts in `package.json` sind dokumentiert

**Verification:**
- Neuer Developer führt Setup durch (< 15 Minuten)
- README-Vollständigkeits-Check (Checklist)

### Architektur-Constraints

**Monorepo-Kontext:**
- pnpm Workspaces mit Root `package.json`
- Workspace-Scripts müssen dokumentiert sein (`pnpm -r build`, `pnpm -w add`)
- Dependencies können root-level oder workspace-level sein

**Docker-Setup:**
```yaml
# docker-compose.yml - Relevante Services
services:
  backend:
    build: ./apps/backend
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=development

  frontend:
    build: ./apps/frontend
    ports:
      - "5173:5173"
    volumes:
      - ./apps/frontend:/app
```

**Environment-Variablen (Backend):**
```bash
# .env.example
NODE_ENV=development                    # development | production | test
PORT=3000                               # Backend port
DATABASE_PATH=./data/cv-hub.db          # SQLite file path
CORS_ORIGIN=http://localhost:5173       # Frontend URL for CORS
LOG_LEVEL=debug                         # debug | info | warn | error
SESSION_SECRET=change-me-in-production  # Session encryption secret (min 32 chars)

# Optional for Epic 6 (KI-Extraktion)
GEMINI_API_KEY=                         # Google Gemini API Key
```

### Ordnerstruktur (Monorepo)

```
cv-hub/
├── apps/
│   ├── backend/                # NestJS API
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules (health, cv, invite, admin)
│   │   │   ├── common/         # Shared utilities (filters, guards, pipes)
│   │   │   └── main.ts         # App entry
│   │   ├── test/               # E2E tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/               # TanStack Start App
│       ├── src/
│       │   ├── routes/         # File-based routing
│       │   ├── components/     # React components
│       │   ├── lib/            # Utilities, API client
│       │   └── main.tsx        # App entry
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── shared-types/           # Zod schemas, TypeScript types
│       ├── src/
│       │   ├── cv-schema.ts    # JSON Resume schema
│       │   ├── api-dtos.ts     # API request/response types
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .husky/                     # Git hooks (pre-commit)
├── data/                       # SQLite database (gitignored)
├── docker-compose.yml          # Multi-container setup
├── pnpm-workspace.yaml         # Workspace config
├── package.json                # Root workspace
├── .env.example                # Environment template
├── .gitignore
├── README.md                   # This documentation!
├── CONTRIBUTING.md             # Contribution guidelines (optional)
├── LICENSE                     # MIT License
└── tsconfig.json               # Root TypeScript config
```

### README-Struktur Best Practices

**Recommended Sections (in order):**
1. **Hero/Title:** Projekt-Name, Tagline, Badges
2. **Executive Summary:** Was, Warum, Für Wen
3. **Features:** Key Features als Bullet-Liste
4. **Tech Stack:** Tabelle mit Versionen
5. **Getting Started:**
   - Prerequisites
   - Installation
   - Configuration (`.env`)
   - Running the App
   - Verification
6. **Development:**
   - Folder Structure
   - Available Scripts
   - Pre-Commit Hooks
   - Testing
   - Troubleshooting
7. **Architecture:** (optional, Link zu ARCHITECTURE.md)
8. **Contributing:** Link zu CONTRIBUTING.md
9. **License:** MIT
10. **Contact:** GitHub Issues, Email

**Markdown Best Practices:**
- Nutze Code-Blocks mit Syntax-Highlighting (```bash, ```typescript)
- Nutze Collapsible Sections (`<details>`) für lange Sections
- Nutze Tabellen für strukturierte Daten
- Nutze Badges für visuellen Appeal (shields.io)
- Nutze relative Links für interne Dokumente
- Halte Absätze kurz (< 3 Zeilen)

### Projekt-Badges

Empfohlene Badges für README:
```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6-blue.svg)
![pnpm](https://img.shields.io/badge/pnpm-9.x-orange.svg)
```

### Learnings from Previous Story

Story 1.9 (Development Tooling: Husky, lint-staged) ist noch im Status "drafted" und wurde noch nicht implementiert.

**Wichtige Kontextinformationen:**
- Story 1.10 baut auf Story 1.9 auf (Dokumentation der Tools)
- Falls Story 1.9 noch nicht abgeschlossen ist: README sollte trotzdem Development-Workflow dokumentieren (Husky, lint-staged)
- README sollte erklären WIE die Tools genutzt werden:
  - Pre-Commit-Hook läuft automatisch bei `git commit`
  - Hook kann mit `--no-verify` übersprungen werden (Notfall)
  - Hook führt ESLint + Prettier auf staged files aus

### Integration mit CI/CD (Story 1.7/1.8)

README sollte auch CI/CD erwähnen (falls implementiert):
- GitHub Actions läuft bei Push/PR
- CI validiert: Linting, Type-Check, Tests, Build
- Status-Badge zeigt CI-Status an

### References

- [Source: docs/tech-spec-epic-1.md#AC-7 (Dokumentation ist vollständig)]
- [Source: docs/tech-spec-epic-1.md#Dependencies-and-Integrations (Monorepo Tools)]
- [Source: docs/epics.md#Story-1.10 (Dokumentation & README)]
- [Source: docs/architecture.md#System-Overview (High-Level Architecture)]
- [Source: docs/PRD.md#Technical-Stack-Decisions]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
