# Story 1.6: Shared Types Package mit Zod

Status: drafted

## Story

Als Entwickler,
möchte ich gemeinsame TypeScript-Types und Zod-Schemas zwischen Frontend und Backend teilen,
damit End-to-End Type-Safety gewährleistet ist.

## Acceptance Criteria

1. `packages/shared-types` package existiert mit korrekter package.json-Konfiguration
2. Mindestens 1 Zod-Schema exportiert (z.B. `HealthCheckResponseSchema`)
3. TypeScript-Types werden aus Zod-Schemas generiert (`z.infer<typeof Schema>`)
4. Backend kann Schema importieren und nutzen (`@cv-hub/shared-types`)
5. Frontend kann Schema importieren und nutzen (`@cv-hub/shared-types`)
6. Build-Prozess funktioniert (TypeScript-Compilation für shared package)
7. Package wird korrekt in Monorepo-Workspace integriert (pnpm workspace protocol)
8. Exports sind in `index.ts` zentral definiert
9. Unit-Tests validieren Zod-Schema-Parsing (Valid + Invalid Cases)

## Tasks / Subtasks

- [ ] Shared Types Package Structure erstellen (AC: #1, #7)
  - [ ] Verzeichnis `packages/shared-types/` erstellen
  - [ ] `package.json` mit Name `@cv-hub/shared-types` erstellen
  - [ ] TypeScript-Konfiguration `tsconfig.json` erstellen (target: ES2022, module: ESNext)
  - [ ] Dependencies hinzufügen: `zod` ^3.24.1, `typescript` ^5.6.0
  - [ ] Build-Script konfigurieren: `tsc` für Compilation
  - [ ] `src/` Verzeichnis für Source-Code
  - [ ] Root `pnpm-workspace.yaml` prüfen: `packages/*` vorhanden

- [ ] Health Check Response Schema implementieren (AC: #2, #3)
  - [ ] `src/health.types.ts` erstellen
  - [ ] Zod-Schema `HealthCheckResponseSchema` definieren:
    - `status`: z.enum(['ok', 'error'])
    - `timestamp`: z.string() (ISO 8601 DateTime)
    - `uptime`: z.number() (Seconds)
    - `database`: z.object({ status: z.enum(['connected', 'disconnected']), type: z.literal('sqlite') })
  - [ ] TypeScript-Type inferieren: `export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>`
  - [ ] Schema exportieren: `export { HealthCheckResponseSchema }`

- [ ] Central Exports konfigurieren (AC: #8)
  - [ ] `src/index.ts` erstellen
  - [ ] Export `health.types.ts`: `export * from './health.types'`
  - [ ] Dokumentations-Kommentar für Package-Purpose
  - [ ] Placeholder für zukünftige Exports vorbereiten:
    - `// Future: CV Schema (Epic 2)`
    - `// Future: Invite Schema (Epic 4)`
    - `// Future: Admin Schema (Epic 5)`

- [ ] Backend-Integration (AC: #4)
  - [ ] `apps/backend/package.json` erweitern: Dependency `"@cv-hub/shared-types": "workspace:*"`
  - [ ] `pnpm install` im Root ausführen (Workspace-Link erstellen)
  - [ ] Backend Health Controller updaten:
    - Import: `import { HealthCheckResponseSchema, HealthCheckResponse } from '@cv-hub/shared-types'`
    - Type für Response verwenden: `@Get() async check(): Promise<HealthCheckResponse>`
    - Response validieren: `HealthCheckResponseSchema.parse(response)` (Ensures Type-Safety)
  - [ ] Testen: Backend startet ohne Errors, Health-Check funktioniert

- [ ] Frontend-Integration (AC: #5)
  - [ ] `apps/frontend/package.json` erweitern: Dependency `"@cv-hub/shared-types": "workspace:*"`
  - [ ] `pnpm install` im Root ausführen (Workspace-Link erstellen)
  - [ ] Frontend API-Client updaten (wenn vorhanden):
    - Import: `import { HealthCheckResponseSchema, HealthCheckResponse } from '@cv-hub/shared-types'`
    - Type für API-Response verwenden
    - Schema-Validation für API-Responses implementieren (Runtime-Check)
  - [ ] Testen: Frontend startet ohne Errors, Import funktioniert

- [ ] Build-Prozess validieren (AC: #6)
  - [ ] `pnpm build` in `packages/shared-types` ausführen → `dist/` Folder erstellt
  - [ ] Generierte Type-Definitions prüfen: `dist/index.d.ts` existiert
  - [ ] Backend Build testen: `pnpm -r build` (Root-Level) → alle Workspaces bauen
  - [ ] Frontend Build testen: `cd apps/frontend && pnpm build` → Success
  - [ ] CI/CD-Pipeline testen: GitHub Actions läuft erfolgreich

- [ ] Unit-Tests für Zod-Schemas (AC: #9)
  - [ ] Test-File erstellen: `src/health.types.spec.ts`
  - [ ] Vitest konfigurieren (oder Jest, abhängig von Monorepo-Setup)
  - [ ] Test: Valid Data → Schema parsed erfolgreich
    ```typescript
    const validData = { status: 'ok', timestamp: '2025-11-06T10:00:00Z', uptime: 3600, database: { status: 'connected', type: 'sqlite' } }
    expect(() => HealthCheckResponseSchema.parse(validData)).not.toThrow()
    ```
  - [ ] Test: Invalid Data → Schema wirft ZodError
    ```typescript
    const invalidData = { status: 'invalid', timestamp: 123, uptime: 'not-a-number' }
    expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError)
    ```
  - [ ] Test: Type Inference funktioniert (TypeScript-Level-Test)
  - [ ] `pnpm test` ausführen → alle Tests passing

- [ ] Dokumentation (NFR - Maintainability)
  - [ ] `packages/shared-types/README.md` erstellen:
    - Package-Purpose: "Shared TypeScript types and Zod schemas for End-to-End Type Safety"
    - Usage-Beispiele: Backend + Frontend Import
    - Build-Command: `pnpm build`
    - Test-Command: `pnpm test`
  - [ ] Root `README.md` erweitern: Shared Types Package in Monorepo-Struktur-Übersicht erwähnen
  - [ ] Inline-Kommentare für komplexe Zod-Schema-Definitionen

## Dev Notes

### Technische Entscheidungen

**Zod als Schema-Validation-Library:**
- **Runtime + Compile-Time Type-Safety:** Zod-Schemas validieren zur Laufzeit (API-Responses, User-Input) UND generieren TypeScript-Types via `z.infer<>`
- **Single Source of Truth:** Schema-Definition = Type-Definition → keine Duplikate, keine Drift
- **Framework-Agnostic:** Zod funktioniert mit NestJS, React, TanStack Query, etc.
- **Developer Experience:** Intuitive API, exzellente Error-Messages, TypeScript-First Design
- **Performance:** Schnelle Validation (<1ms für typische Payloads)

**Monorepo Workspace Protocol (`workspace:*`):**
- **Dependency-Management:** `pnpm` linkt lokale Packages via Symlinks (keine npm-Registry)
- **Always Latest:** `workspace:*` resolved zu aktueller Local-Version (kein Version-Pinning erforderlich)
- **Build-Reihenfolge:** pnpm respektiert Dependency-Graph (Shared Types vor Backend/Frontend)
- **Hot-Reload:** Änderungen in Shared Types triggern Re-Compilation in Consumer-Apps

**Type Inference via `z.infer<>`:**
- **DRY-Prinzip:** Schema schreiben, Type automatisch generieren
- **No Manual Sync:** Schema-Änderung → Type-Änderung automatisch propagiert
- **TypeScript Strict Mode:** Compiler erzwingt korrekten Type-Usage

**Package Structure (Simple Export Pattern):**
```
packages/shared-types/
├── src/
│   ├── index.ts          # Central Exports (Public API)
│   ├── health.types.ts   # Health Check Schema (Epic 1)
│   ├── cv.types.ts       # CV Schema (Epic 2 - vorbereitet)
│   ├── invite.types.ts   # Invite Schema (Epic 4 - vorbereitet)
│   └── admin.types.ts    # Admin Schema (Epic 5 - vorbereitet)
├── dist/                 # Compiled Output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

### Architektur-Alignment

**PRD Requirements:**
- FR-7 (Development Infrastructure): End-to-End Type-Safety via Shared Types Package
- NFR Maintainability: Single Source of Truth für API-Contracts → reduziert Type-Drifts

**Tech Spec Epic 1:**
- AC-1 (Monorepo-Struktur): `packages/shared-types` als 3. Workspace neben Backend/Frontend
- Shared Types Package Structure (Tech Spec: Data Models → Shared Types Package Structure)
- Dependencies: zod ^3.24.1, typescript ^5.6.0 wie spezifiziert

**Architecture Constraints:**
- TypeScript Everywhere (Architecture: Technical Stack Decisions)
- End-to-End Type Safety via Zod (Architecture: Constraints → TypeScript Strict Mode)
- Monorepo Dependency-Sharing (Architecture: System Overview → Monorepo Pattern)

### Project Structure Notes

**Neue Files nach Story 1.6:**
```
lebenslauf/
├── packages/shared-types/       # Neues Package (Story 1.6)
│   ├── src/
│   │   ├── index.ts              # Central Exports
│   │   └── health.types.ts       # Health Check Schema
│   ├── dist/                     # Compiled Output (gitignored)
│   ├── package.json              # Package Config
│   ├── tsconfig.json             # TypeScript Config
│   └── README.md                 # Package Docs
├── apps/backend/package.json     # Updated: Dependency zu @cv-hub/shared-types
├── apps/frontend/package.json    # Updated: Dependency zu @cv-hub/shared-types
└── pnpm-workspace.yaml           # Updated (falls nötig): packages/* Pattern
```

**Health Check Schema Beispiel:**
```typescript
// packages/shared-types/src/health.types.ts
import { z } from 'zod';

export const HealthCheckResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),  // ISO 8601 DateTime
  uptime: z.number(),     // Seconds
  database: z.object({
    status: z.enum(['connected', 'disconnected']),
    type: z.literal('sqlite'),
  }),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
```

**Backend Usage:**
```typescript
// apps/backend/src/health/health.controller.ts
import { HealthCheckResponseSchema, HealthCheckResponse } from '@cv-hub/shared-types';

@Get()
async check(): Promise<HealthCheckResponse> {
  const response = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: this.isDBConnected() ? 'connected' : 'disconnected' as const,
      type: 'sqlite' as const,
    },
  };

  // Runtime Validation (Optional, aber empfohlen für API-Boundaries)
  return HealthCheckResponseSchema.parse(response);
}
```

**Frontend Usage:**
```typescript
// apps/frontend/src/lib/api.ts
import { HealthCheckResponseSchema, HealthCheckResponse } from '@cv-hub/shared-types';

export async function checkHealth(): Promise<HealthCheckResponse> {
  const res = await fetch('http://localhost:3000/api/health');
  const data = await res.json();

  // Runtime Validation (gegen API-Response)
  return HealthCheckResponseSchema.parse(data);
}
```

### Testing Strategy

**Unit Tests (Zod Schema Validation):**
```typescript
// packages/shared-types/src/health.types.spec.ts
import { describe, it, expect } from 'vitest';
import { HealthCheckResponseSchema } from './health.types';
import { ZodError } from 'zod';

describe('HealthCheckResponseSchema', () => {
  it('should parse valid data', () => {
    const validData = {
      status: 'ok',
      timestamp: '2025-11-06T10:00:00.000Z',
      uptime: 3600,
      database: { status: 'connected', type: 'sqlite' },
    };

    const result = HealthCheckResponseSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it('should reject invalid status', () => {
    const invalidData = { status: 'invalid', timestamp: '...', uptime: 3600, database: { status: 'connected', type: 'sqlite' } };
    expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
  });

  it('should reject non-number uptime', () => {
    const invalidData = { status: 'ok', timestamp: '...', uptime: 'not-a-number', database: { status: 'connected', type: 'sqlite' } };
    expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
  });

  it('should reject invalid database type', () => {
    const invalidData = { status: 'ok', timestamp: '...', uptime: 3600, database: { status: 'connected', type: 'postgres' } };
    expect(() => HealthCheckResponseSchema.parse(invalidData)).toThrow(ZodError);
  });
});
```

**Integration Tests (Backend + Frontend):**
- Backend Integration Test: `GET /api/health` Response matched `HealthCheckResponseSchema`
- Frontend Integration Test: API-Client validiert Response erfolgreich

**Build Verification:**
```bash
# Shared Types Package baut
cd packages/shared-types && pnpm build
# → dist/index.js, dist/index.d.ts generiert

# Backend nutzt Shared Types
cd apps/backend && pnpm build
# → Keine TypeScript-Errors, Import funktioniert

# Frontend nutzt Shared Types
cd apps/frontend && pnpm build
# → Keine TypeScript-Errors, Import funktioniert

# Full Monorepo Build
pnpm -r build
# → Alle Workspaces bauen erfolgreich
```

### Learnings from Previous Story

**From Story 1-5-docker-compose-fuer-lokale-entwicklung (Status: drafted)**

- **Previous story not yet implemented**
- Keine Dev-Agent-Learnings verfügbar, da Story 1.5 noch nicht abgeschlossen
- Story 1.6 kann parallel entwickelt werden (keine Runtime-Dependencies auf Docker Setup)

**Key Considerations aus Story 1.5:**
- **Docker Volume Mounts:** Story 1.5 mounted `./packages:/app/packages` in Backend + Frontend Container
  - **Implication für 1.6:** Shared Types Package wird automatisch in Container gemountet
  - **Action:** Nach Story 1.6 Completion → Docker Compose testen, Shared Types sollten verfügbar sein
- **Hot-Reload:** Volume-Mounts ermöglichen Hot-Reload für Shared Types
  - **Benefit:** Änderung in Schema → Backend/Frontend reloaden automatisch (kein Container-Rebuild)
- **Monorepo Context:** Docker Dockerfiles kopieren `packages/shared-types/package.json` während Build
  - **Action:** Wenn Story 1.6 neue Dependencies hinzufügt → Docker Images neu bauen

**Architecture Foundation aus vorherigen Stories:**
- Story 1.1 (Monorepo): pnpm Workspace-Struktur steht → Story 1.6 fügt 3. Package hinzu
- Story 1.2 (Backend): Health Controller existiert → Story 1.6 fügt Type-Annotation + Validation hinzu
- Story 1.4 (Frontend): API-Client-Stub existiert (möglicherweise) → Story 1.6 fügt Type-Safety hinzu

### References

- [Source: docs/epics.md#Story 1.6] - Story Definition und Acceptance Criteria
- [Source: docs/tech-spec-epic-1.md#Shared Types Package Structure] - Package-Architecture-Details
- [Source: docs/tech-spec-epic-1.md#Dependencies → Shared Package Dependencies] - zod ^3.24.1, typescript ^5.6.0
- [Source: docs/tech-spec-epic-1.md#Data Models → HealthCheckResponse] - Health Check Response DTO
- [Source: docs/architecture.md#Technical Stack Decisions] - End-to-End Type Safety via Zod (angenommen)
- [Source: docs/stories/1-5-docker-compose-fuer-lokale-entwicklung.md#Docker Compose Configuration] - Volume Mounts für packages/

### Risks & Mitigations

**RISK-1: Circular Dependencies in Monorepo**
- **Problem:** Backend/Frontend könnten versehentlich Circular-Dependencies mit Shared Types erzeugen
- **Mitigation:**
  - Shared Types ist PURE Data-Layer (keine Business Logic)
  - pnpm Workspace-Graph validated Circular-Dependencies (Build schlägt fehl)
  - Code-Review: Ensure Shared Types importiert NICHTS aus Backend/Frontend
- **Probability:** Low (Zod-Schemas sind naturgemäß unabhängig)

**RISK-2: Build-Reihenfolge in CI/CD**
- **Problem:** Backend/Frontend bauen bevor Shared Types gebaut ist → TypeScript-Errors
- **Mitigation:**
  - `pnpm -r build` respektiert Dependency-Graph (baut Shared Types zuerst)
  - CI/CD: Nutze `pnpm -r build` statt separate Jobs
  - Falls nötig: Explicit Build-Order in GitHub Actions
- **Probability:** Low (pnpm handled das automatisch)

**RISK-3: Runtime Validation Overhead**
- **Problem:** `Schema.parse()` bei jedem API-Request könnte Performance beeinflussen
- **Mitigation:**
  - Zod ist schnell (<1ms für typische Payloads)
  - Validation nur an API-Boundaries (Controller, nicht Service-Layer)
  - Production: Validation optional deaktivierbar via Feature-Flag
- **Probability:** Low für Epic 1 (wenig Traffic, einfache Schemas)

**RISK-4: Zod Version Mismatch**
- **Problem:** Backend/Frontend nutzen unterschiedliche Zod-Versionen → Schema-Inkonsistenzen
- **Mitigation:**
  - Shared Types Package hat Zod als Dependency → Version-Konsistenz garantiert
  - `pnpm-lock.yaml` pinned exakte Versionen
  - CI/CD: `pnpm audit` checkt Dependency-Konflikte
- **Probability:** Very Low (Monorepo verhindert Version-Drift)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **2025-11-06**: Story drafted by SM Agent (Bob) - Initial creation from epics and tech-spec-epic-1
