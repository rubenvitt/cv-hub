# Story 1.7: CI/CD-Pipeline mit GitHub Actions (Linting & Type-Check)

Status: drafted

## Story

Als Entwickler,
möchte ich automatisches Linting und Type-Checking bei jedem Push,
damit Code-Qualität gesichert ist.

## Acceptance Criteria

1. GitHub Actions Workflow `.github/workflows/ci.yml` existiert
2. Workflow triggert bei Push und Pull Request auf main-Branch
3. ESLint läuft für Backend und Frontend (shared config)
4. Prettier-Check läuft (Code-Formatierung validiert)
5. TypeScript-Type-Checking läuft für alle Workspaces
6. Workflow schlägt fehl bei Linting/Type-Errors
7. Status-Badge kann zu README hinzugefügt werden

## Tasks / Subtasks

- [ ] GitHub Actions Workflow-Datei erstellen (AC: #1, #2)
  - [ ] `.github/workflows/ci.yml` im Repository-Root erstellen
  - [ ] Workflow-Name definieren: "CI Pipeline - Code Quality"
  - [ ] Trigger konfigurieren: `on: [push, pull_request]` für main-Branch
  - [ ] Job-Matrix vorbereiten: Node.js 20 LTS, pnpm 9.15.4

- [ ] Dependencies-Installation-Step (AC: #1)
  - [ ] Node.js 20 LTS Setup-Action integrieren (`actions/setup-node@v4`)
  - [ ] pnpm-Action integrieren (`pnpm/action-setup@v4`)
  - [ ] pnpm-Store-Caching konfigurieren für schnellere Builds
  - [ ] `pnpm install --frozen-lockfile` ausführen für reproduzierbare Builds

- [ ] Linting-Job implementieren (AC: #3, #4)
  - [ ] ESLint-Step für Backend: `pnpm --filter @cv-hub/backend run lint`
  - [ ] ESLint-Step für Frontend: `pnpm --filter @cv-hub/frontend run lint`
  - [ ] Prettier-Check-Step: `pnpm exec prettier --check .`
  - [ ] Job schlägt fehl bei ESLint/Prettier-Errors (Exit Code != 0)

- [ ] Type-Checking-Job implementieren (AC: #5, #6)
  - [ ] TypeScript-Compilation für alle Workspaces: `pnpm -r run type-check`
  - [ ] Alternative: `pnpm exec tsc --noEmit` im Root (wenn type-check-Script nicht existiert)
  - [ ] Verifizieren: Shared-Types Package wird vor Backend/Frontend gebaut
  - [ ] Job schlägt fehl bei TypeScript-Errors

- [ ] Workspace-Scripts definieren (Prerequisite für CI)
  - [ ] `lint` Script in Backend `package.json`: `eslint 'src/**/*.ts'`
  - [ ] `lint` Script in Frontend `package.json`: `eslint 'src/**/*.{ts,tsx}'`
  - [ ] `type-check` Script in Backend: `tsc --noEmit`
  - [ ] `type-check` Script in Frontend: `tsc --noEmit`
  - [ ] Root-Level `lint` Script: `pnpm -r run lint`
  - [ ] Root-Level `type-check` Script: `pnpm -r run type-check`

- [ ] ESLint und Prettier Shared Config (AC: #3, #4)
  - [ ] ESLint Flat Config im Root: `eslint.config.js` (ESLint v9)
  - [ ] Prettier Config im Root: `.prettierrc.json`
  - [ ] ESLint-Plugins installieren: `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
  - [ ] Prettier-Ignore-File: `.prettierignore` (node_modules, dist, build)
  - [ ] Workspaces erben Root-Configs (keine Duplikate)

- [ ] Status-Badge und Dokumentation (AC: #7)
  - [ ] Badge-URL von GitHub Actions kopieren
  - [ ] README.md mit Badge aktualisieren (optional, Story 1.10 fokussiert)
  - [ ] Workflow-Dokumentation in README: Welche Checks laufen, wie man lokal testet

- [ ] Workflow testen und verifizieren (AC-übergreifend)
  - [ ] Code mit intentionalem Linting-Error pushen, Workflow schlägt fehl
  - [ ] Code mit TypeScript-Error pushen, Workflow schlägt fehl
  - [ ] Sauberer Code pushen, Workflow ist grün
  - [ ] Pull-Request erstellen, Workflow läuft automatisch
  - [ ] Workflow-Laufzeit messen: Sollte <3 Minuten sein (mit Cache)

## Dev Notes

### Technische Entscheidungen

**GitHub Actions als CI/CD-Plattform:**
- Native Integration mit GitHub (kein zusätzlicher Service erforderlich)
- Kostenlos für Public Repositories, 2000 Minuten/Monat für Private
- Einfache YAML-Konfiguration, umfangreiches Action-Ecosystem
- Matrix-Builds ermöglichen Parallel-Execution (zukünftige Erweiterung für Multi-OS)

**ESLint v9 Flat Config:**
- Moderne Flat Config statt Legacy `.eslintrc.js` (Deprecated in v9)
- Vereinfachte Konfiguration, bessere IDE-Integration
- TypeScript ESLint Parser für Type-aware Linting
- Shared Config im Root reduziert Duplikation über Workspaces

**Prettier für Code-Formatierung:**
- Opinionated Formatter eliminiert Formatierungs-Diskussionen
- Integration mit ESLint via `eslint-config-prettier` (deaktiviert konfliktende Regeln)
- Pre-Commit-Hooks in Story 1.9 werden Prettier Auto-Fix triggern

**pnpm Workspace-Filter:**
- `pnpm --filter @cv-hub/backend run lint` führt Lint nur für Backend aus
- `pnpm -r run lint` führt Lint für alle Workspaces aus (rekursiv)
- Ermöglicht granulare CI-Jobs (parallele Execution möglich)

**Caching-Strategie:**
- pnpm Store-Caching via `actions/cache` reduziert Installation-Zeit von ~2min auf ~20s
- Cache-Key basiert auf `pnpm-lock.yaml` Hash
- Fallback auf neuesten Cache bei Lockfile-Änderungen

### Architektur-Alignment

**PRD Requirements:**
- FR-7 (Deployment & Operations): CI/CD-Pipeline ist Teil der Deployment-Strategie
- Epic 1 Ziel: "GitHub Actions Workflows: Linting, Type-Checking, Unit Tests" - Story 1.7 liefert ersten Teil

**Tech Spec Epic 1:**
- AC-5 (CI/CD-Pipeline validiert Code-Qualität): Diese Story implementiert Linting und Type-Checking
- Workflows → CI/CD Pipeline Sequence: ESLint, Prettier, TypeScript Jobs wie spezifiziert
- Dependencies: ESLint v9.17.0, Prettier v3.4.2 (shared Root-Dependencies)
- Test Strategy: CI/CD Tests validieren alle Files konform

**Architecture Constraints:**
- TypeScript Strict Mode: Type-Checking sichert Type-Safety über alle Workspaces
- Code Quality: ESLint enforced Coding-Standards (keine unused vars, consistent naming)
- Monorepo-Awareness: pnpm Workspace-Filter für effiziente CI-Execution

### Project Structure Notes

**CI/CD Ordnerstruktur nach Completion:**
```
lebenslauf/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Linting + Type-Check Workflow
├── eslint.config.js               # ESLint Flat Config (shared)
├── .prettierrc.json               # Prettier Config (shared)
├── .prettierignore                # Prettier Ignore-Patterns
├── apps/
│   ├── backend/
│   │   └── package.json           # "lint", "type-check" Scripts
│   └── frontend/
│       └── package.json           # "lint", "type-check" Scripts
└── package.json                   # Root "lint", "type-check" Scripts
```

**GitHub Actions Workflow-Struktur:**
```yaml
name: CI Pipeline - Code Quality

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup:
    # Node.js + pnpm Setup, Dependencies-Installation, Cache

  lint:
    needs: setup
    # ESLint Backend, ESLint Frontend, Prettier-Check

  type-check:
    needs: setup
    # TypeScript Compilation für alle Workspaces
```

**ESLint Flat Config Pattern (ESLint v9):**
```javascript
// eslint.config.js (Root)
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: true },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
];
```

**Prettier Config (.prettierrc.json):**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Testing Strategy

**CI/CD Validation (Primary):**
- **Test 1:** Push Code mit Linting-Error → Workflow schlägt fehl, zeigt ESLint-Error in Logs
- **Test 2:** Push Code mit TypeScript-Error → Workflow schlägt fehl, zeigt tsc-Error
- **Test 3:** Push Code mit Prettier-Formatierungs-Fehler → Workflow schlägt fehl
- **Test 4:** Push sauberer Code → Workflow ist grün, alle Jobs passing

**Local Verification (Pre-Push):**
1. `pnpm run lint` im Root → Sollte ohne Errors durchlaufen
2. `pnpm run type-check` im Root → Sollte ohne Errors durchlaufen
3. `pnpm exec prettier --check .` → Sollte alle Files als formatiert bestätigen

**Performance-Tests:**
- **Cold Run (kein Cache):** Workflow sollte <3 Minuten dauern
- **Warm Run (mit Cache):** Workflow sollte <1 Minute dauern
- pnpm-Installation mit Cache: ~20 Sekunden
- ESLint + Prettier: ~15 Sekunden
- TypeScript Type-Check: ~20 Sekunden

**Failure-Szenarien:**
- Intentional Linting-Error: `const unused = 'variable';` ohne Usage
- TypeScript-Error: Type-Missmatch wie `const x: number = 'string';`
- Prettier-Error: Manuell formatierte Datei (falsche Indentation)

### Learnings from Previous Story

**Von Story 1.2 (NestJS Backend-Grundstruktur):**
- **Testing-Setup mit Jest:** CI-Pipeline wird in Story 1.8 um Unit-Tests erweitert
- **TypeScript-Compiler-Fehler:** Import-Probleme bei supertest (namespace vs default) - CI kann ähnliche Probleme frühzeitig erkennen
- **Integration-Test-Pattern:** GitHub Actions kann E2E-Tests später integrieren (Supertest-basierte Tests)

**Von Story 1.1 (Monorepo-Setup):**
- **pnpm Workspace-Commands:** `pnpm -r run <script>` führt Script für alle Workspaces aus
- **Workspace-Filter:** `pnpm --filter @cv-hub/backend run <script>` für spezifische Workspaces
- **Root-Level Scripts:** Root `package.json` kann Workspace-Scripts aggregieren

**Wichtige Pattern für Story 1.7:**
- **Script-Naming-Konsistenz:** Alle Workspaces müssen identische Script-Namen haben (`lint`, `type-check`)
- **Monorepo-Awareness:** CI-Workflow muss pnpm Workspaces verstehen (nicht npm)
- **Shared Configs:** ESLint und Prettier im Root vermeiden Duplikation und Konflikte

**Risiken aus vorherigen Storys:**
- **Dependency-Konflikte:** ESLint-Plugins müssen kompatibel sein mit TypeScript-Version
- **Build-Order:** Shared-Types Package muss vor Backend/Frontend gebaut werden (Dependency-Chain)
- **Cache-Invalidierung:** pnpm-Lock-Änderungen invalidieren Cache, erhöhen Build-Zeit

### References

- [Source: docs/tech-spec-epic-1.md#CI/CD Foundation] - GitHub Actions Setup, Linting-Pipeline-Spec
- [Source: docs/tech-spec-epic-1.md#Workflows and Sequencing → CI/CD Pipeline Sequence] - Parallel Jobs: Linting, Type-Checking
- [Source: docs/tech-spec-epic-1.md#Dependencies - Monorepo Tools] - ESLint v9.17.0, Prettier v3.4.2
- [Source: docs/epics.md#Epic 1 - Story 1.7] - Story Definition und Acceptance Criteria
- [Source: docs/architecture.md#CI/CD Pipeline] - GitHub Actions wie spezifiziert
- [Source: docs/tech-spec-epic-1.md#Test Strategy Summary → CI/CD Tests] - ESLint, Prettier-Check, pnpm audit
- [Source: stories/1-1-monorepo-mit-pnpm-workspaces-initialisieren.md#Dev Agent Record] - pnpm Workspace-Commands Pattern
- [Source: stories/1-2-nestjs-backend-grundstruktur-erstellen.md#Testing Strategy] - Integration-Test-Setup für zukünftige CI-Erweiterung

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
