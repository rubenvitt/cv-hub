# Epic Technical Specification: Project Foundation & Infrastructure

Date: 2025-11-04
Author: Ruben
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 etabliert die technische Grundlage für das gesamte cv-hub-Projekt. Dieses Epic schafft die Entwicklungsumgebung, Projekt-Infrastruktur und grundlegenden Patterns, die für alle nachfolgenden Epics erforderlich sind.

Das Projekt ist als Monorepo mit pnpm Workspaces strukturiert und umfasst ein NestJS Backend (RESTful API) sowie ein TanStack Start Frontend (SSR-fähige React-Anwendung). Die lokale Entwicklungsumgebung läuft komplett containerisiert via Docker Compose, während eine CI/CD-Pipeline mit GitHub Actions automatisiertes Testing und Code-Qualität sicherstellt.

## Objectives and Scope

### In Scope

**Monorepo-Struktur:**
- pnpm Workspace-Setup mit root `package.json`
- `apps/backend` - NestJS API-Server
- `apps/frontend` - TanStack Start SSR-Anwendung
- `packages/shared-types` - Gemeinsame Zod-Schemas und TypeScript-Types
- Workspace-Dependency-Management

**Backend Foundation (NestJS):**
- Projekt-Initialisierung mit NestJS CLI
- SQLite-Datenbank-Integration via TypeORM
- Basic API-Struktur:
  - Health-Check-Endpoint (`/api/health`)
  - Strukturiertes Logging (Pino)
  - Globales Error-Handling mit Exception Filters
  - Request-Logging-Middleware
- Environment-Configuration (`.env` mit Validation)
- Security-Basics (Helmet, CORS-Konfiguration)

**Frontend Foundation (TanStack Start):**
- Projekt-Initialisierung mit TanStack Start
- React 19 + TypeScript Setup
- Tailwind CSS v4-Konfiguration
- shadcn/ui Component-Library-Integration
- TanStack Router file-based routing
- Basic Layout-Komponenten

**Docker-Setup:**
- `docker-compose.yml` für lokale Entwicklung
- Backend-Service (Port 3000)
- Frontend-Service (Port 5173)
- SQLite Volume (persistente Daten)
- Hot-Reload für beide Services

**CI/CD-Pipeline:**
- GitHub Actions Workflows:
  - Linting (ESLint, Prettier-Check)
  - Type-Checking (TypeScript)
  - Unit Tests (Vitest für Frontend, Jest für Backend)
  - Build-Validation

**Development Tooling:**
- ESLint-Konfiguration (shared)
- Prettier-Konfiguration (shared)
- Husky Pre-Commit-Hooks (lint-staged)
- VS Code Workspace-Settings

**Dokumentation:**
- README mit Setup-Anleitung
- Architektur-Übersicht (inline docs)
- Environment-Variables-Dokumentation

### Out of Scope

- Spezifische Business-Features (Epic 2+)
- Production-Deployment (Epic 7)
- SSL/HTTPS-Konfiguration (Epic 7)
- Backup-Strategie (Epic 7)
- Monitoring und Observability (Epic 7)
- Authentication-Implementierung (Epic 5)
- API-Versionierung (future enhancement)

## System Architecture Alignment

Dieses Epic implementiert die in der Architecture definierten Foundation-Entscheidungen:

**Monorepo mit pnpm Workspaces** (Architecture: Technical Stack Decisions)
- Struktur wie spezifiziert: `apps/backend`, `apps/frontend`, `packages/shared-types`
- Ermöglicht Type-Sharing zwischen Frontend und Backend
- Vereinfachtes Dependency-Management

**Tech Stack Adherence:**
- Backend: NestJS v11 + Node.js 20 LTS + TypeORM + SQLite (exakt wie Architecture)
- Frontend: TanStack Start RC + React 19 + Tailwind v4 + shadcn/ui (exakt wie Architecture)
- Validation: Zod v3 (shared zwischen Frontend/Backend)
- Logging: Pino (nestjs-pino) wie spezifiziert
- Security: Helmet v8, Argon2 (für spätere Epics vorbereitet)

**Docker Compose Alignment:**
- Lokales Development-Environment wie in Architecture beschrieben
- Frontend Port 5173, Backend Port 3000
- SQLite Volume für Persistence
- Basis für Production-Setup in Epic 7

**CI/CD Foundation:**
- GitHub Actions wie in Architecture spezifiziert
- Vorbereitung für automatisches Deployment (Epic 7)
- Testing-Pipeline (Vitest für Frontend, Jest für Backend)

**Constraints Enforced:**
- TypeScript Everywhere (Frontend + Backend)
- End-to-End Type Safety via Zod
- Dev/Prod Parity via Docker
- Code Quality via Linting/Formatting

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs | Outputs | Owner |
|----------------|------------------|--------|---------|-------|
| **Backend - App Module** | Root-Modul, orchestriert alle Features | Environment Config | NestJS Application | Backend |
| **Backend - Health Module** | System-Health-Check, Uptime-Monitoring | HTTP GET Request | JSON Health Status | Backend |
| **Backend - Database Module** | TypeORM-Konfiguration, SQLite-Connection | `.env` (DB Path) | TypeORM Connection | Backend |
| **Backend - Logger Module** | Strukturiertes Logging (Pino) | Request Context | JSON Log Entries | Backend |
| **Backend - Config Module** | Environment-Validation, App-Config | `.env` File | Validated Config Object | Backend |
| **Frontend - Root Route** | App-Entry, Layout-Provider | - | React Component Tree | Frontend |
| **Frontend - Layout Components** | Shared UI-Structure (Header, Footer) | Children Components | Rendered Layout | Frontend |
| **Shared Types Package** | TypeScript Types, Zod Schemas | - | Exported Types/Schemas | Shared |
| **Docker Compose** | Container-Orchestration | Dockerfiles | Running Services | DevOps |
| **GitHub Actions** | CI/CD-Pipeline | Code Push | Test Reports, Build Artifacts | DevOps |

**Module Interactions:**
- Frontend kommuniziert mit Backend via HTTP (Port 3000)
- Backend verwendet Config Module für Environment-Variablen
- Beide Apps nutzen Shared Types Package
- Docker Compose orchestriert beide Services
- CI/CD validiert beide Apps parallel

### Data Models and Contracts

**Epic 1 definiert keine Business-Domain-Models**, nur technische Infrastruktur-Entities:

**1. Health Check Response (Backend)**
```typescript
// DTO für Health-Check-Endpoint
interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;      // ISO 8601
  uptime: number;         // Seconds
  database: {
    status: 'connected' | 'disconnected';
    type: 'sqlite';
  };
}
```

**2. Environment Configuration (Backend)**
```typescript
// Validated via Zod in Config Module
interface AppConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_PATH: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}
```

**3. Log Entry Structure (Backend - Pino)**
```typescript
interface LogEntry {
  level: number;          // Pino log level
  time: number;           // Unix timestamp
  msg: string;
  req?: {                 // Request context
    id: string;
    method: string;
    url: string;
  };
  res?: {                 // Response context
    statusCode: number;
  };
  err?: {                 // Error context
    type: string;
    message: string;
    stack: string;
  };
}
```

**Shared Types Package Structure:**
```typescript
// packages/shared-types/src/index.ts
export * from './health.types';
export * from './api.types';
export * from './config.types';

// Wird in späteren Epics erweitert mit:
// - CV-Schema (Epic 2)
// - Invite-Schema (Epic 4)
// - Admin-Schema (Epic 5)
```

### APIs and Interfaces

**Backend API Endpoints (Epic 1):**

| Method | Path | Description | Request | Response | Auth |
|--------|------|-------------|---------|----------|------|
| GET | `/api/health` | System Health Check | - | `HealthCheckResponse` | None |
| GET | `/` | API Root | - | `{ message: "cv-hub API", version: "1.0.0" }` | None |

**Health Check Endpoint Specification:**

```typescript
// GET /api/health
// Response 200 OK
{
  "status": "ok",
  "timestamp": "2025-11-04T10:30:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "connected",
    "type": "sqlite"
  }
}

// Response 503 Service Unavailable (Database down)
{
  "status": "error",
  "timestamp": "2025-11-04T10:30:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "disconnected",
    "type": "sqlite"
  }
}
```

**Error Response Format (Global):**
```typescript
// Standard Error Response (alle Endpoints)
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "timestamp": "2025-11-04T10:30:00.000Z",
  "path": "/api/health"
}
```

**Frontend Routes (Epic 1):**

| Path | Component | Purpose | SSR |
|------|-----------|---------|-----|
| `/` | Index (Placeholder) | Root Route, zeigt "Coming Soon" | Yes |
| `/admin` | Protected (Placeholder) | Admin-Route vorbereitet | No |

**Frontend API Client Interface:**
```typescript
// lib/api.ts - TanStack Query Integration
import { createAPIClient } from '@tanstack/react-query';

export const apiClient = {
  health: {
    check: async (): Promise<HealthCheckResponse> => {
      const res = await fetch('http://localhost:3000/api/health');
      return res.json();
    },
  },
};
```

### Workflows and Sequencing

**1. Local Development Startup Sequence**

```
Developer runs: docker-compose up
        │
        ▼
Docker Compose reads docker-compose.yml
        │
        ├─► Start Backend Container
        │   │
        │   ├─► Install Dependencies (pnpm install)
        │   ├─► Validate Environment (.env)
        │   ├─► Initialize Database (TypeORM migrations)
        │   ├─► Start NestJS App (PORT 3000)
        │   └─► Health Check available (/api/health)
        │
        └─► Start Frontend Container
            │
            ├─► Install Dependencies (pnpm install)
            ├─► Start Vite Dev Server (PORT 5173)
            └─► Hot Module Replacement active
```

**2. CI/CD Pipeline Sequence**

```
Developer pushes code to GitHub
        │
        ▼
GitHub Actions Trigger (.github/workflows/ci.yml)
        │
        ├─► Checkout Code
        │
        ├─► Setup Node.js 20 LTS
        │
        ├─► Install Dependencies (pnpm install)
        │
        ├─► Parallel Jobs:
        │   │
        │   ├─► Linting
        │   │   ├─► ESLint (Backend)
        │   │   ├─► ESLint (Frontend)
        │   │   └─► Prettier Check
        │   │
        │   ├─► Type Checking
        │   │   ├─► TypeScript (Backend)
        │   │   └─► TypeScript (Frontend)
        │   │
        │   └─► Testing
        │       ├─► Jest (Backend Unit Tests)
        │       └─► Vitest (Frontend Unit Tests)
        │
        └─► Build Validation
            ├─► Build Backend (NestJS)
            └─► Build Frontend (TanStack Start)
```

**3. Database Initialization Sequence**

```
TypeORM Connection Initialize
        │
        ▼
Check if SQLite file exists at DATABASE_PATH
        │
        ├─► File Exists
        │   │
        │   └─► Run Pending Migrations
        │       └─► Ready
        │
        └─► File Not Exists
            │
            ├─► Create SQLite File
            ├─► Run All Migrations (Schema Creation)
            └─► Ready
```

**4. Request/Response Flow (Health Check Example)**

```
Client (Browser/cURL)
        │
        │ HTTP GET /api/health
        ▼
Nginx (in future) / Direct to Backend
        │
        ▼
NestJS Application
        │
        ├─► Global Guards (none for health)
        ├─► Request Logger Middleware (Pino)
        │
        ▼
Health Controller
        │
        ▼
Health Service
        │
        ├─► Check Database Connection (TypeORM)
        ├─► Calculate Uptime
        │
        ▼
Build HealthCheckResponse DTO
        │
        ▼
Response Serialization
        │
        │ HTTP 200 + JSON
        ▼
Client receives response
```

## Non-Functional Requirements

### Performance

**Development Environment Performance:**
- **Docker Container Startup:** <30 Sekunden (Cold Start)
- **Hot-Reload (Frontend):** <1 Sekunde (nach Code-Änderung)
- **Hot-Reload (Backend):** <3 Sekunden (nach Code-Änderung)
- **TypeScript Compilation:** <10 Sekunden (Backend + Frontend)
- **Test Suite Execution:** <30 Sekunden (alle Unit Tests)

**Build Performance:**
- **Backend Build (Production):** <2 Minuten
- **Frontend Build (Production):** <3 Minuten
- **CI/CD Pipeline (Total):** <5 Minuten

**Rationale für Epic 1:**
Performance-Metriken für Epic 1 fokussieren auf Developer Experience. Runtime-Performance (FCP, LCP etc.) wird in Epic 3 (Public Portfolio) gemessen, da Epic 1 noch keine User-facing Features hat.

**Messbarkeit:**
- CI/CD-Pipeline tracked Build-Zeiten automatisch
- Docker Compose Startup-Zeit via `time docker-compose up -d`
- Hot-Reload subjektiv messbar während Development

### Security

**Development Security (Epic 1):**
- **Helmet Integration:** Security Headers konfiguriert (CSP, HSTS, X-Frame-Options)
- **CORS Configuration:** Nur `localhost:5173` (Frontend) erlaubt in Development
- **Environment Variables:** Sensitive Daten in `.env` (nicht im Git)
- **Dependency Security:** `pnpm audit` läuft in CI/CD, kritische Vulnerabilities blocken Build
- **Input Validation:** Zod-Schemas für alle API-Inputs (vorbereitet für Epic 2+)

**Deferred to Later Epics:**
- Authentication/Authorization (Epic 5)
- Rate Limiting (Epic 4 - Token-Validation)
- SQL Injection Prevention (Epic 2 - TypeORM Queries)
- Password Hashing (Epic 5 - Argon2)

**Security Baseline:**
- Alle Secrets in `.env` (nie committen)
- `.env.example` für Template (ohne echte Werte)
- Docker Container laufen non-root (Security Best Practice)
- TypeScript Strict Mode aktiviert (Type Safety)

**Compliance:**
- DSGVO: Noch keine personenbezogenen Daten in Epic 1 (vorbereitet für Epic 2+)
- OWASP Top 10: Helmet addressiert mehrere Punkte (XSS, Clickjacking, etc.)

### Reliability/Availability

**Development Environment Reliability:**
- **Docker Compose:** Automatisches Restart bei Container-Crash (`restart: unless-stopped`)
- **Database Persistence:** SQLite Volume bleibt erhalten nach Container-Neustart
- **Graceful Shutdown:** NestJS Lifecycle Hooks für sauberes Shutdown
- **Health Check:** `/api/health` erlaubt Monitoring (Docker Healthcheck vorbereitet)

**Error Handling:**
- **Global Exception Filter:** Alle unbehandelten Exceptions werden geloggt und als strukturierte JSON-Errors zurückgegeben
- **Database Connection Errors:** Health Check zeigt Status "error" bei DB-Problemen
- **Validation Errors:** Zod-Validation-Errors werden als 400 Bad Request mit Details zurückgegeben

**Recovery Mechanisms:**
- **Automatischer Retry:** TypeORM reconnect bei DB-Connection-Loss
- **Container Restart:** Docker Compose startet abgestürzte Container automatisch neu
- **Data Persistence:** SQLite-Datei bleibt erhalten (kein Datenverlust)

**Availability Targets (Development):**
- Development Environment sollte 99%+ verfügbar sein (nur bei intentionalem Shutdown down)
- Single Point of Failure akzeptiert (SQLite, einzelner Container)
- Production-Availability wird in Epic 7 addressiert

### Observability

**Logging (Pino):**
- **Structured Logging:** Alle Logs als JSON (maschinell parsierbar)
- **Request Logging:** Jeder HTTP-Request wird geloggt mit:
  - Request ID (UUID)
  - Method, URL, Status Code
  - Response Time
  - User Agent (für Debugging)
- **Error Logging:** Stack Traces bei Exceptions
- **Log Levels:** `debug`, `info`, `warn`, `error` (konfigurierbar via `LOG_LEVEL`)
- **Development Output:** Pretty-Print für bessere Lesbarkeit

**Log-Beispiel:**
```json
{
  "level": 30,
  "time": 1699012345678,
  "req": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "method": "GET",
    "url": "/api/health"
  },
  "res": {
    "statusCode": 200
  },
  "responseTime": 12,
  "msg": "Request completed"
}
```

**Health Monitoring:**
- **Endpoint:** `/api/health` liefert System-Status
- **Checks:**
  - Database Connection (TypeORM Ping)
  - Uptime (Process Start Time)
- **Docker Healthcheck:** Vorbereitet für `docker-compose.yml` (optional)

**Development Tools:**
- **NestJS DevTools:** Integrierbar für Request-Tracing (optional)
- **Console Logs:** Frontend-Logs in Browser DevTools
- **Docker Logs:** `docker-compose logs -f` für Live-Monitoring

**Metrics (Future):**
- Keine Metriken in Epic 1 (Development Focus)
- Prometheus/Grafana in Epic 7 (Production Monitoring)
- Application Performance Monitoring (APM) optional

## Dependencies and Integrations

### Backend Dependencies (NestJS)

**Core Framework:**
- `@nestjs/common` ^11.0.0 - Core NestJS framework
- `@nestjs/core` ^11.0.0 - NestJS application core
- `@nestjs/platform-express` ^11.0.0 - Express adapter für NestJS
- `typescript` ^5.6.0 - TypeScript compiler
- `reflect-metadata` ^0.2.0 - Metadata reflection für Decorators

**Database & ORM:**
- `@nestjs/typeorm` ^11.0.0 - TypeORM integration für NestJS
- `typeorm` ^0.3.20 - TypeScript ORM
- `sqlite3` ^5.1.7 - SQLite3 driver

**Logging:**
- `nestjs-pino` ^4.4.1 - Pino logger integration
- `pino-http` ^10.4.0 - HTTP request logger
- `pino-pretty` ^13.0.0 - Pretty printer für Development

**Security:**
- `helmet` ^8.0.0 - Security headers middleware
- `@nestjs/throttler` ^6.4.0 - Rate limiting (vorbereitet für Epic 4)

**Validation:**
- `zod` ^3.24.1 - Schema validation (shared mit Frontend)
- `class-validator` ^0.14.1 - Decorator-based validation
- `class-transformer` ^0.5.1 - Object transformation

**Configuration:**
- `@nestjs/config` ^3.3.0 - Configuration management
- `dotenv` ^16.4.5 - Environment variables

**Testing:**
- `@nestjs/testing` ^11.0.0 - NestJS testing utilities
- `jest` ^29.7.0 - Testing framework
- `supertest` ^7.0.0 - HTTP assertions für E2E tests

**Development:**
- `@nestjs/cli` ^11.0.0 - NestJS CLI
- `ts-node` ^10.9.2 - TypeScript execution
- `nodemon` ^3.1.9 - Auto-restart on file changes
- `eslint` ^9.17.0 - Linting
- `prettier` ^3.4.2 - Code formatting

### Frontend Dependencies (TanStack Start)

**Core Framework:**
- `@tanstack/start` ^1.0.0-rc - TanStack Start framework
- `react` ^19.0.0 - React library
- `react-dom` ^19.0.0 - React DOM renderer
- `typescript` ^5.6.0 - TypeScript compiler

**Routing & Data:**
- `@tanstack/react-router` ^1.106.4 - File-based routing
- `@tanstack/react-query` ^5.66.1 - Data fetching & caching
- `@tanstack/react-form` ^0.38.1 - Form management

**UI & Styling:**
- `tailwindcss` ^4.0.0 - Utility-first CSS
- `@radix-ui/react-*` (multiple) - Headless UI primitives (shadcn/ui basis)
- `lucide-react` ^0.469.0 - Icon library
- `class-variance-authority` ^0.7.1 - Variant utilities
- `clsx` ^2.1.1 - Conditional classnames
- `tailwind-merge` ^2.6.0 - Tailwind class merging

**Markdown & Content:**
- `react-markdown` ^10.0.0 - Markdown rendering
- `remark-gfm` ^4.0.0 - GitHub Flavored Markdown

**Validation:**
- `zod` ^3.24.1 - Schema validation (shared mit Backend)

**Date Handling:**
- `date-fns` ^4.1.0 - Date utilities

**Testing:**
- `vitest` ^2.1.8 - Testing framework (Vite-native)
- `@testing-library/react` ^16.1.0 - React testing utilities
- `@testing-library/jest-dom` ^6.6.3 - Custom matchers
- `@vitejs/plugin-react` ^4.3.4 - React plugin für Vitest

**Development:**
- `vite` ^6.0.7 - Build tool (via TanStack Start)
- `eslint` ^9.17.0 - Linting
- `prettier` ^3.4.2 - Code formatting

### Shared Package Dependencies

**packages/shared-types:**
- `zod` ^3.24.1 - Schema definitions
- `typescript` ^5.6.0 - Type definitions

### Monorepo Tools

**Root Dependencies:**
- `pnpm` ^9.15.4 - Package manager (Workspace support)
- `husky` ^9.1.7 - Git hooks
- `lint-staged` ^15.2.11 - Staged files linting
- `prettier` ^3.4.2 - Code formatting (shared config)
- `eslint` ^9.17.0 - Linting (shared config)

### Docker Dependencies

**Base Images:**
- `node:20-alpine` - Base image für Backend & Frontend
- `nginx:alpine` - Reverse Proxy (Epic 7, vorbereitet)

**Docker Tools:**
- `docker` >= 24.0 - Container runtime
- `docker-compose` >= 2.20 - Multi-container orchestration

### External Integrations (Epic 1)

**None in Epic 1** - Externes System-Integration erfolgt erst in späteren Epics:
- Google Gemini API (Epic 6 - KI-Extraktion)
- GitHub API (Future - Content Aggregator)

### Version Constraints & Rationale

**Node.js Version:** 20 LTS
- Langfristiger Support bis April 2026
- Stabile Performance, breite Ecosystem-Unterstützung

**pnpm Version:** 9.15.4+
- Workspace-Support für Monorepo
- Schneller als npm/yarn (symbolische Links)
- Disk-Space-effizient

**TypeScript Version:** 5.6.0
- Neueste Features (Decorator Metadata, Constant Indexing)
- Bessere Type Inference
- Konsistent zwischen Frontend & Backend

**React Version:** 19.0.0
- Neueste Stable-Version
- React Compiler-ready (Future Optimization)
- TanStack Start-kompatibel

**NestJS Version:** 11.0.0
- Neueste Major-Version
- Verbesserte Performance & DX
- TypeScript 5 Support

**Tailwind CSS Version:** 4.0.0
- Neueste Major-Version
- Oxide Engine (10x schneller)
- Native CSS Support (kein PostCSS erforderlich)

### Dependency Management Strategy

**Lockfile:**
- `pnpm-lock.yaml` committed (Reproduzierbare Builds)

**Updates:**
- Major Updates: Nur nach expliziter Review
- Minor/Patch Updates: Wöchentlich via Dependabot
- Security Updates: Sofort

**Audit:**
- `pnpm audit` läuft in CI/CD
- Kritische Vulnerabilities blockieren Build
- Moderate Vulnerabilities als Warnings

**Monorepo Workspace-Struktur:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Acceptance Criteria (Authoritative)

### AC-1: Monorepo-Struktur ist initialisiert und funktional

**Given:** Ein neues Projekt-Repository existiert
**When:** Das Monorepo-Setup ist abgeschlossen
**Then:**
- ✅ Verzeichnisstruktur existiert: `apps/backend/`, `apps/frontend/`, `packages/shared-types/`
- ✅ `pnpm-workspace.yaml` definiert alle Workspaces
- ✅ Root `package.json` mit Workspace-Scripts vorhanden
- ✅ `pnpm install` installiert Dependencies für alle Workspaces
- ✅ Shared Types Package kann von Backend & Frontend importiert werden
- ✅ TypeScript-Compilation funktioniert für alle Workspaces

**Verification:**
```bash
pnpm install
pnpm -r build  # Builds all workspaces
```

---

### AC-2: Backend (NestJS) läuft lokal und liefert Health-Check

**Given:** Backend-Dependencies sind installiert
**When:** Backend wird gestartet
**Then:**
- ✅ NestJS-Server startet ohne Errors auf Port 3000
- ✅ `GET /api/health` liefert HTTP 200 mit korrektem JSON-Response
- ✅ SQLite-Datenbank wird initialisiert (File existiert)
- ✅ TypeORM-Connection ist erfolgreich
- ✅ Pino-Logging schreibt strukturierte Logs (JSON-Format)
- ✅ Helmet Security Headers sind aktiv (CSP, HSTS, etc.)
- ✅ CORS erlaubt nur `localhost:5173`

**Verification:**
```bash
cd apps/backend
pnpm run start:dev
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"...","uptime":...,"database":{"status":"connected","type":"sqlite"}}
```

---

### AC-3: Frontend (TanStack Start) läuft lokal und rendert Placeholder

**Given:** Frontend-Dependencies sind installiert
**When:** Frontend wird gestartet
**Then:**
- ✅ Vite Dev Server startet ohne Errors auf Port 5173
- ✅ Browser zeigt Placeholder-Seite ("Coming Soon" o.ä.)
- ✅ React 19 rendert korrekt
- ✅ TanStack Router ist konfiguriert (`/` Route funktioniert)
- ✅ Tailwind CSS ist aktiv (Styling sichtbar)
- ✅ shadcn/ui Komponenten können importiert werden
- ✅ Hot Module Replacement (HMR) funktioniert

**Verification:**
```bash
cd apps/frontend
pnpm run dev
# Browser öffnen: http://localhost:5173
# Seite lädt ohne Fehler, zeigt Content
```

---

### AC-4: Docker Compose Setup funktioniert End-to-End

**Given:** `docker-compose.yml` ist konfiguriert
**When:** `docker-compose up` wird ausgeführt
**Then:**
- ✅ Backend-Container startet erfolgreich
- ✅ Frontend-Container startet erfolgreich
- ✅ SQLite Volume wird gemountet und persistiert Daten
- ✅ Backend ist erreichbar: `curl http://localhost:3000/api/health` liefert 200
- ✅ Frontend ist erreichbar: Browser auf `http://localhost:5173` zeigt Seite
- ✅ Hot-Reload funktioniert in beiden Containern
- ✅ Container restarten automatisch bei Crash (`restart: unless-stopped`)
- ✅ Logs sind lesbar via `docker-compose logs`

**Verification:**
```bash
docker-compose up -d
docker-compose ps  # Alle Services "Up"
curl http://localhost:3000/api/health
curl http://localhost:5173
docker-compose down
docker-compose up -d  # Daten persistieren
```

---

### AC-5: CI/CD-Pipeline validiert Code-Qualität

**Given:** GitHub Actions Workflow ist konfiguriert
**When:** Code wird nach GitHub gepusht
**Then:**
- ✅ Workflow triggert automatisch (on: push, pull_request)
- ✅ Node.js 20 LTS wird installiert
- ✅ Dependencies werden installiert (`pnpm install`)
- ✅ **Linting:**
  - ✅ ESLint läuft für Backend (keine Errors)
  - ✅ ESLint läuft für Frontend (keine Errors)
  - ✅ Prettier-Check läuft (alle Dateien formatiert)
- ✅ **Type-Checking:**
  - ✅ TypeScript-Compilation Backend (keine Errors)
  - ✅ TypeScript-Compilation Frontend (keine Errors)
- ✅ **Testing:**
  - ✅ Jest Unit Tests Backend (alle passing)
  - ✅ Vitest Unit Tests Frontend (alle passing)
- ✅ **Build Validation:**
  - ✅ Backend Build erfolgreich
  - ✅ Frontend Build erfolgreich
- ✅ Pipeline läuft in <5 Minuten
- ✅ Fehler blocken Merge (Status Check)

**Verification:**
- GitHub Actions Tab zeigt grüne Checks
- Pipeline-Log zeigt alle Steps erfolgreich

---

### AC-6: Development Tooling ist konfiguriert

**Given:** Tooling-Konfigurationen sind committed
**When:** Developer arbeitet im Projekt
**Then:**
- ✅ ESLint-Konfiguration ist shared (Root + Workspaces)
- ✅ Prettier-Konfiguration ist shared
- ✅ Husky Pre-Commit-Hook ist installiert
- ✅ lint-staged läuft bei Commit (lint + format)
- ✅ VS Code Workspace-Settings sind vorhanden (optional)
- ✅ `.env.example` existiert mit Template-Werten
- ✅ `.gitignore` excludiert `node_modules`, `.env`, `dist`, etc.

**Verification:**
```bash
git commit -m "test"  # Triggert Husky Hook
# lint-staged läuft, formatiert Dateien
```

---

### AC-7: Dokumentation ist vollständig

**Given:** Projekt ist initial aufgesetzt
**When:** Developer liest Dokumentation
**Then:**
- ✅ `README.md` existiert mit:
  - Projekt-Übersicht
  - Lokales Setup (Prerequisites, Installation, Start)
  - Docker Compose Usage
  - Available Scripts (Monorepo + Workspaces)
  - Tech Stack Overview
  - Folder Structure
- ✅ `.env.example` dokumentiert alle Environment-Variablen
- ✅ Inline-Code-Kommentare für komplexe Setup-Logik
- ✅ `apps/backend/README.md` mit Backend-spezifischen Infos (optional)
- ✅ `apps/frontend/README.md` mit Frontend-spezifischen Infos (optional)

**Verification:**
- Neuer Developer kann Setup ohne externe Hilfe durchführen
- Alle Scripts in `package.json` sind dokumentiert

---

### AC-8: Environment-Configuration funktioniert

**Given:** `.env` File mit korrekten Werten existiert
**When:** Backend wird gestartet
**Then:**
- ✅ Environment-Variablen werden geladen (dotenv)
- ✅ `@nestjs/config` validiert Required-Variablen (Zod-Schema)
- ✅ Fehlerhafte/fehlende Variablen stoppen App-Start mit klarer Fehlermeldung
- ✅ `NODE_ENV`, `PORT`, `DATABASE_PATH`, `CORS_ORIGIN`, `LOG_LEVEL` werden verwendet
- ✅ Secrets sind NICHT im Code hardcoded
- ✅ `.env` ist in `.gitignore`

**Verification:**
```bash
# Fehlende Variable testen
mv .env .env.backup
pnpm run start:dev  # Sollte mit Validation Error stoppen
mv .env.backup .env
```

---

### AC-9: Error Handling funktioniert korrekt

**Given:** Backend läuft
**When:** Ein Fehler tritt auf (z.B. 404, 500)
**Then:**
- ✅ Global Exception Filter fängt alle Exceptions
- ✅ Strukturierter JSON-Error-Response wird gesendet:
  - `statusCode`, `message`, `error`, `timestamp`, `path`
- ✅ Stack Traces werden geloggt (Pino)
- ✅ 404 für nicht-existente Routes
- ✅ 500 für unbehandelte Exceptions (mit Generic-Message, kein Stack-Leak)

**Verification:**
```bash
curl http://localhost:3000/non-existent  # 404
# Manuell Exception werfen in Code, testen ob geloggt
```

---

## Traceability Mapping

| AC | Epic Requirement | Tech Spec Section | Component/API | Test Type |
|----|------------------|-------------------|---------------|-----------|
| **AC-1** | Monorepo-Struktur | Services & Modules → Monorepo Tools | pnpm Workspaces, Root `package.json` | Manual verification + Build test |
| **AC-2** | Backend Foundation | Services & Modules → Backend Modules, APIs → Health Endpoint | NestJS App, Health Module, TypeORM, Pino | Integration test (`supertest /api/health`) |
| **AC-3** | Frontend Foundation | Services & Modules → Frontend Components, APIs → Frontend Routes | TanStack Start, React Router, Tailwind | Manual browser test + E2E (optional) |
| **AC-4** | Docker Setup | Workflows → Docker Startup Sequence | `docker-compose.yml`, Dockerfiles | Manual Docker test + CI smoke test |
| **AC-5** | CI/CD Pipeline | Workflows → CI/CD Pipeline Sequence | `.github/workflows/ci.yml` | GitHub Actions execution |
| **AC-6** | Development Tooling | Out of Scope → Tooling Section | ESLint, Prettier, Husky, lint-staged | Git commit test (Husky hook) |
| **AC-7** | Dokumentation | Out of Scope → Documentation | `README.md`, Inline Comments | Manual review |
| **AC-8** | Environment Config | Data Models → AppConfig, Services → Config Module | `@nestjs/config`, Zod Validation | Unit test (Config validation) |
| **AC-9** | Error Handling | NFR → Reliability → Error Handling | Global Exception Filter, Pino Logger | Integration test (Error scenarios) |

### Requirement → Component Traceability

**PRD Requirement: FR-7 (Deployment & Operations) → Subsection: Docker Compose Setup**
- Maps to: AC-4 (Docker Compose)
- Components: `docker-compose.yml`, Backend/Frontend Dockerfiles
- Tests: Docker integration tests

**PRD Requirement: FR-7 (CI/CD Pipeline)**
- Maps to: AC-5 (CI/CD)
- Components: `.github/workflows/ci.yml`, ESLint, Jest, Vitest
- Tests: GitHub Actions workflow execution

**Architecture Decision: Monorepo with pnpm Workspaces**
- Maps to: AC-1 (Monorepo)
- Components: `pnpm-workspace.yaml`, Root `package.json`, Workspace structure
- Tests: Build all workspaces

**Architecture Decision: NestJS Backend + TypeORM + SQLite**
- Maps to: AC-2 (Backend)
- Components: NestJS App Module, Health Module, TypeORM Config, SQLite DB
- Tests: Health endpoint integration test, DB connection test

**Architecture Decision: TanStack Start Frontend**
- Maps to: AC-3 (Frontend)
- Components: TanStack Start app, React Router, Tailwind Config
- Tests: Frontend renders placeholder

### Test Strategy per AC

| AC | Test Level | Test Tool | Coverage Target |
|----|------------|-----------|-----------------|
| AC-1 | Build Verification | `pnpm -r build` | All workspaces compile |
| AC-2 | Integration | Jest + Supertest | Health endpoint returns 200, DB connected |
| AC-3 | E2E (optional) | Playwright/Cypress | Frontend loads, no console errors |
| AC-4 | Integration | Docker + curl | Services start, health checks pass |
| AC-5 | CI | GitHub Actions | All jobs pass (lint, test, build) |
| AC-6 | Manual | Git commit | Husky hook runs lint-staged |
| AC-7 | Manual Review | - | README completeness check |
| AC-8 | Unit | Jest | Config validation logic |
| AC-9 | Integration | Jest + Supertest | Error responses structured correctly |

### Cross-Epic Dependencies

**Epic 1 Outputs consumed by:**
- **Epic 2 (CV Data Foundation):** Backend Foundation (NestJS + TypeORM), Shared Types Package
- **Epic 3 (Public Portfolio):** Frontend Foundation (TanStack Start + Tailwind), API Client
- **Epic 4 (Privacy Sharing):** Backend Modules (Guards, Services), Frontend Routes
- **Epic 5 (Admin Dashboard):** Frontend Layout Components, Backend Auth Modules (prepared)
- **Epic 6 (KI Extraction):** Backend File Upload, Zod Validation
- **Epic 7 (Production):** Docker Compose Baseline, CI/CD Pipeline Extension

**Epic 1 guarantees for downstream epics:**
- Stable Monorepo-Struktur (keine Breaking Changes)
- TypeScript End-to-End Type Safety
- Shared Zod-Schemas für API-Contracts
- Docker-basierte Development Environment
- CI/CD Pipeline Extension-ready

## Risks, Assumptions, Open Questions

### Risks

**RISK-1: TanStack Start RC Instability**
- **Description:** TanStack Start ist noch Release Candidate (nicht v1.0 stable)
- **Impact:** Breaking Changes könnten auftreten, Updates komplex
- **Probability:** Medium (RC ist stabil, aber nicht garantiert)
- **Mitigation:**
  - Pin exakte Versionen in `package.json`
  - Monitor TanStack Start Releases/Changelog
  - Fallback-Plan: Migration zu Next.js 15 wenn nötig (ähnliches API-Design)
- **Owner:** Frontend Team

**RISK-2: Monorepo Complexity für kleine Projekte**
- **Description:** Monorepo-Overhead (pnpm Workspaces) könnte für 2-App-Setup übertrieben sein
- **Impact:** Längere Build-Zeiten, komplexere Debugging
- **Probability:** Low (pnpm ist effizient, Overhead minimal)
- **Mitigation:**
  - Keep Workspace-Struktur einfach (nur 3 Packages)
  - Dokumentiere Troubleshooting-Szenarien
  - Bei Performance-Problemen: Separate Repos evaluieren
- **Owner:** DevOps

**RISK-3: Docker Hot-Reload Performance auf macOS/Windows**
- **Description:** Docker Volumes auf macOS/Windows können langsam sein (File-Sync-Latenz)
- **Impact:** Langsame Hot-Reload-Zeiten (>5s), schlechte DX
- **Probability:** Medium (bekanntes Docker-Problem)
- **Mitigation:**
  - Dokumentiere native Development-Setup als Alternative (ohne Docker)
  - Nutze `cached` oder `delegated` Volume-Mounts (macOS)
  - Bei Performance-Problemen: Docker Desktop alternativen testen (OrbStack, Colima)
- **Owner:** DevOps

**RISK-4: SQLite Concurrent Write Limitations**
- **Description:** SQLite hat limitierte Concurrent-Write-Performance (Lock-Contention)
- **Impact:** Langsame Responses bei hoher Last (nicht relevant für Epic 1, aber später)
- **Probability:** Low für Development, Medium für Production
- **Mitigation:**
  - Für Development akzeptabel (Single-User)
  - Epic 7: WAL Mode aktivieren (Write-Ahead Logging)
  - Migration zu PostgreSQL möglich wenn scale erforderlich
- **Owner:** Backend Team

**RISK-5: CI/CD Pipeline zu langsam (>5 Minuten)**
- **Description:** Parallel-Tests, Builds, Linting könnten Timeout-Limits überschreiten
- **Impact:** Lange Feedback-Loops, Developer-Frustration
- **Probability:** Low (kleine Codebase in Epic 1)
- **Mitigation:**
  - GitHub Actions Caching nutzen (node_modules, pnpm store)
  - Matrix-Builds für Parallel-Execution
  - Bei Problemen: Pipeline optimieren (Skip redundante Steps)
- **Owner:** DevOps

### Assumptions

**ASSUMPTION-1: Developer hat Docker installiert**
- Docker Desktop (macOS/Windows) oder Docker Engine (Linux) >= 24.0
- Fallback: Native Setup dokumentiert (ohne Docker)

**ASSUMPTION-2: Node.js 20 LTS ist verfügbar**
- Developer-Maschine hat Node.js 20 LTS installiert (für native Development)
- CI/CD: GitHub Actions installiert automatisch

**ASSUMPTION-3: pnpm ist global installiert**
- `npm install -g pnpm@9` erforderlich für Monorepo-Commands
- Alternative: `npx pnpm` (langsamer)

**ASSUMPTION-4: GitHub Actions ist verfügbar**
- Projekt ist auf GitHub gehostet (oder GitHub Actions self-hosted runner)
- Alternativen: GitLab CI, CircleCI (nicht in Scope für Epic 1)

**ASSUMPTION-5: .env File wird manuell erstellt**
- Developer kopiert `.env.example` zu `.env` und füllt Werte
- Keine automatische .env-Generierung

**ASSUMPTION-6: Keine Multi-User Development**
- Nur 1 Developer gleichzeitig (kein Konflikt-Handling in SQLite erforderlich)
- Team-Development erst ab Epic 2+

### Open Questions

**QUESTION-1: VS Code vs. andere IDEs?**
- **Status:** Open
- **Decision Needed:** Sollen Workspace-Settings für VS Code committed werden?
- **Options:**
  - A) VS Code Settings committen (`.vscode/settings.json`)
  - B) Neutral bleiben (jeder IDE-Support separat)
- **Impact:** DX, Onboarding-Zeit für neue Developer
- **Recommendation:** A - VS Code Settings committen (De-facto Standard, keine Lock-in)

**QUESTION-2: Welche shadcn/ui Components initial installieren?**
- **Status:** Open
- **Decision Needed:** Welche UI-Components brauchen wir sofort für Placeholder-Seite?
- **Options:**
  - A) Nur Basics (Button, Card, Layout)
  - B) Full-Set (~16 Components)
- **Impact:** Initial Setup-Zeit, Bundle-Size
- **Recommendation:** A - Nur Basics, rest on-demand in Epic 3

**QUESTION-3: E2E Testing in CI/CD oder nur lokal?**
- **Status:** Open
- **Decision Needed:** Soll Playwright/Cypress in GitHub Actions laufen?
- **Options:**
  - A) Ja - E2E Tests in CI (langsamer, höhere Confidence)
  - B) Nein - Nur Unit/Integration Tests in CI (schneller)
- **Impact:** CI/CD-Zeit, Test-Coverage
- **Recommendation:** B für Epic 1 (keine User-facing Features), A ab Epic 3

**QUESTION-4: Prettier Config - Tabs oder Spaces?**
- **Status:** Open (zu klären vor Implementation)
- **Decision Needed:** Code-Style-Präferenz
- **Options:**
  - A) 2 Spaces (JavaScript Community Standard)
  - B) Tabs (Accessibility-vorteil)
- **Impact:** Code-Readability, Git-Diffs
- **Recommendation:** A - 2 Spaces (NestJS/React Convention)

**QUESTION-5: Health Check erweitert oder minimal?**
- **Status:** Open
- **Decision Needed:** Soll Health Check mehr prüfen als nur DB?
- **Options:**
  - A) Minimal (nur DB Connection + Uptime)
  - B) Erweitert (Memory Usage, Disk Space, etc.)
- **Impact:** Complexity, Debugging-Nutzen
- **Recommendation:** A für Epic 1, B optional in Epic 7 (Production Monitoring)

## Test Strategy Summary

### Test Pyramid für Epic 1

```
         /\
        /  \      E2E Tests (Optional)
       /    \     - Frontend renders placeholder
      /------\    - Docker Compose integration
     /        \
    /  Integ.  \  Integration Tests (Primary)
   /   Tests    \ - Backend Health endpoint (Supertest)
  /--------------\- Database connection (TypeORM)
 /                \- Error handling scenarios
/  Unit Tests      \ Unit Tests (Foundation)
--------------------\- Config validation logic (Jest)
                     - Zod Schema validation
                     - Utility functions
```

### Test Levels

**1. Unit Tests**
- **Scope:** Einzelne Funktionen, Utility-Logic
- **Tools:** Jest (Backend), Vitest (Frontend)
- **Coverage Target:** 70%+ für kritische Logic (Config Validation, Zod Schemas)
- **Examples:**
  - `ConfigService.validate()` throws bei fehlenden Variablen
  - Zod-Schema validiert Health-Check-Response korrekt
  - Utility-Functions (Date-Formatting, etc.)

**2. Integration Tests**
- **Scope:** API-Endpoints, Database-Interaktion, Module-Zusammenspiel
- **Tools:** Jest + Supertest (Backend)
- **Coverage Target:** 90%+ für API-Endpoints
- **Examples:**
  - `GET /api/health` liefert 200 + korrektes JSON
  - TypeORM verbindet erfolgreich zu SQLite
  - Global Exception Filter fängt Errors und logged korrekt
  - CORS erlaubt nur `localhost:5173`

**3. E2E Tests (Optional)**
- **Scope:** Full User-Flow, Browser-Interaktion
- **Tools:** Playwright oder Cypress
- **Coverage Target:** Smoke Tests nur (1-2 Tests)
- **Examples:**
  - Frontend lädt unter `localhost:5173` ohne Errors
  - Placeholder-Content ist sichtbar
- **Note:** Deferred to Epic 3 (keine User-Flows in Epic 1)

**4. Build Verification Tests**
- **Scope:** Compilation, Bundle-Generation
- **Tools:** TypeScript Compiler, pnpm build
- **Coverage Target:** 100% (alle Workspaces müssen builden)
- **Examples:**
  - `pnpm -r build` erfolgreich für alle Workspaces
  - Keine TypeScript-Errors
  - Docker-Images builden ohne Fehler

**5. CI/CD Tests**
- **Scope:** Linting, Formatting, Security
- **Tools:** ESLint, Prettier, pnpm audit
- **Coverage Target:** 100% (alle Files müssen konform sein)
- **Examples:**
  - ESLint findet keine Errors
  - Prettier-Check passiert
  - `pnpm audit` findet keine kritischen Vulnerabilities

### Test Execution Strategy

**Local Development:**
```bash
# Unit Tests (watch mode)
pnpm -r test:watch

# Integration Tests (single run)
cd apps/backend && pnpm test:e2e

# Full Test Suite
pnpm -r test

# Build Verification
pnpm -r build
```

**CI/CD (GitHub Actions):**
```yaml
# Parallel Execution
jobs:
  lint:    # ESLint + Prettier
  test:    # Jest + Vitest
  build:   # TypeScript + pnpm build

# Run on:
- push (all branches)
- pull_request (to main)
```

**Pre-Commit (Husky + lint-staged):**
```bash
# Automatisch bei git commit
- ESLint für geänderte Files
- Prettier für geänderte Files
- TypeScript check (optional, falls schnell genug)
```

### Test Coverage Goals

| Component | Unit | Integration | E2E | Total Target |
|-----------|------|-------------|-----|--------------|
| Backend Config | 90% | - | - | 90% |
| Backend Health Module | 50% | 100% | - | 100% |
| Backend Database Module | 30% | 100% | - | 80% |
| Backend Exception Filter | 60% | 100% | - | 90% |
| Frontend Components | 50% | - | Optional | 50% |
| Shared Types | 80% | - | - | 80% |
| **Overall Target** | **60%** | **90%** | **Optional** | **70%** |

**Rationale:**
- Integration Tests wichtiger als Unit Tests (Real-World-Szenarien)
- Backend: Höhere Coverage (Business Logic)
- Frontend Epic 1: Niedrigere Coverage (nur Placeholder, kein Business Logic)

### Testing Best Practices

**1. Arrange-Act-Assert (AAA) Pattern**
```typescript
it('should return health status', async () => {
  // Arrange
  const app = await createTestApp();

  // Act
  const response = await request(app.getHttpServer())
    .get('/api/health');

  // Assert
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('ok');
});
```

**2. Test Isolation**
- Jeder Test ist unabhängig (keine shared state)
- Database wird vor jedem Test gereset (In-Memory SQLite für Tests)
- Mocks für externe Dependencies (später: Gemini API)

**3. Test Naming Convention**
```typescript
describe('HealthController', () => {
  describe('GET /api/health', () => {
    it('should return 200 when database is connected', ...);
    it('should return 503 when database is disconnected', ...);
  });
});
```

**4. Fixtures & Factories**
- Shared Test-Data-Factories für wiederverwendbare Fixtures
- `test/fixtures/` Ordner für Mock-Daten

**5. Continuous Testing**
- Watch-Mode während Development (`pnpm test:watch`)
- Fast Feedback-Loop (<5 Sekunden für Unit Tests)

### Test Maintenance

**When to Update Tests:**
- Bei API-Änderungen (neue Endpoints, geänderte Responses)
- Bei Breaking Changes (TypeScript Interfaces, Zod Schemas)
- Bei Bug-Fixes (Test schreiben, der Bug reproduziert, dann fixen)

**Test Debt Management:**
- Flaky Tests sofort fixen oder skippen (nicht ignored lassen)
- Coverage-Reports in CI/CD (Track Trends)
- Quarterly Test-Review (Remove obsolete tests)

### Definition of Done (DoD) for Epic 1

Epic 1 ist **Done** wenn:
- ✅ Alle 9 Acceptance Criteria erfüllt
- ✅ CI/CD-Pipeline grün (alle Tests passing)
- ✅ Docker Compose startet ohne Errors
- ✅ README dokumentiert Setup
- ✅ Code-Review abgeschlossen (falls Team-Development)
- ✅ Keine kritischen Security-Vulnerabilities (`pnpm audit`)
- ✅ Test-Coverage >= 70% (Overall)
- ✅ Sprint-Status aktualisiert (Epic 1: contexted → in-progress → done)
