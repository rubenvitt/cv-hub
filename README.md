# Lebenslauf (CV-Hub)

<!-- TODO: Nach GitHub Push Owner/Repo in Badge-URL ersetzen -->

![CI Status](https://github.com/{owner}/{repo}/actions/workflows/ci.yml/badge.svg)

Moderne CV-Management-Plattform mit Privacy-First Sharing – entwickelt mit TypeScript, NestJS und TanStack Start.

## Überblick

Das CV-Hub Projekt bietet eine vollständige Lösung zur Verwaltung und zum Teilen von Lebensläufen mit Fokus auf Datenschutz und Benutzerfreundlichkeit. Die Anwendung nutzt eine moderne Monorepo-Architektur mit pnpm Workspaces.

### Tech Stack

- **Backend:** NestJS (TypeScript)
- **Frontend:** TanStack Start (React-basiert)
- **Datenbank:** PostgreSQL
- **Package Manager:** pnpm 9.15.4
- **Build-Tools:** TypeScript, ESLint, Prettier
- **CI/CD:** GitHub Actions

## Voraussetzungen

- **Node.js:** 20 LTS oder höher
- **pnpm:** Version 9.15.4
- **Docker:** (optional) für lokale Entwicklung mit Docker Compose

## Installation

```bash
# Repository klonen
git clone <repository-url>
cd lebenslauf

# Abhängigkeiten installieren
pnpm install
```

## Entwicklung

### Lokale Entwicklung (ohne Docker)

```bash
# Backend starten (Port 3000)
pnpm --filter @cv-hub/backend dev

# Frontend starten (Port 3001)
pnpm --filter @cv-hub/frontend dev
```

### Lokale Entwicklung (mit Docker)

```bash
# Alle Services starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Services stoppen
docker-compose down
```

## CI/CD Pipeline

### Automatische Checks

Die CI-Pipeline führt bei jedem Push und Pull Request auf den `main`-Branch folgende Validierungen durch:

- **ESLint:** Code-Qualitätsprüfung für Backend und Frontend
- **Prettier:** Formatierungsprüfung für alle Dateien
- **TypeScript:** Type-Check für alle TypeScript-Dateien

### Lokale Validierung vor Push

Es wird empfohlen, vor jedem Push die folgenden Checks lokal durchzuführen:

```bash
# ESLint für alle Workspaces
pnpm run lint

# TypeScript Type-Check für alle Workspaces
pnpm run type-check

# Prettier Formatierung validieren
pnpm exec prettier --check .

# Prettier Formatierung automatisch korrigieren
pnpm exec prettier --write .
```

### Workflow-Status

Der CI/CD-Status wird durch den Badge am Anfang dieser README angezeigt:

- **Grün (passing):** Alle Checks erfolgreich
- **Rot (failing):** Mindestens ein Check fehlgeschlagen

## Projekt-Struktur

```
lebenslauf/
├── apps/
│   ├── backend/          # NestJS Backend-Anwendung
│   └── frontend/         # TanStack Start Frontend-Anwendung
├── packages/
│   └── shared-types/     # Gemeinsame TypeScript-Typen (Zod-Schemas)
├── docs/                 # Projektdokumentation
├── .github/
│   └── workflows/        # GitHub Actions CI/CD Workflows
├── docker-compose.yml    # Lokale Entwicklungsumgebung
└── pnpm-workspace.yaml   # pnpm Workspace-Konfiguration
```

## Verfügbare Scripts

```bash
# Alle Workspaces
pnpm run lint              # ESLint für alle Workspaces
pnpm run type-check        # TypeScript Type-Check für alle Workspaces
pnpm run test              # Tests für alle Workspaces

# Spezifisches Workspace
pnpm --filter @cv-hub/backend <command>
pnpm --filter @cv-hub/frontend <command>
pnpm --filter @cv-hub/shared-types <command>
```

## Entwicklungs-Richtlinien

### Code-Qualität

- Alle Code-Änderungen müssen die ESLint-Regeln erfüllen
- TypeScript-Strict-Mode ist aktiviert
- Prettier formatiert automatisch alle Dateien
- Shared Types werden über Zod-Schemas definiert

### Git Workflow

1. Feature-Branch erstellen
2. Änderungen implementieren
3. Lokale Validierung durchführen (`pnpm run lint && pnpm run type-check`)
4. Commit mit aussagekräftiger Message
5. Push und Pull Request erstellen
6. CI-Pipeline muss erfolgreich sein (grüner Badge)

## Lizenz

Proprietär – Alle Rechte vorbehalten.
