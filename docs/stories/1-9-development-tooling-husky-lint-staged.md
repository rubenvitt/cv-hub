# Story 1.9: Development Tooling (Husky, lint-staged)

Status: ready-for-dev

## Story

Als Entwickler,
möchte ich Pre-Commit-Hooks für automatisches Linting und Formatierung,
damit schlechter Code gar nicht erst committed wird.

## Acceptance Criteria

1. **Husky Pre-Commit-Hook installiert**
   - Husky v9.1.7+ im Root-Package installiert
   - `.husky/` Verzeichnis existiert mit Pre-Commit-Hook-Script
   - Hook wird automatisch bei `git commit` ausgeführt
   - Installation läuft via `pnpm install` (postinstall script)

2. **lint-staged konfiguriert**
   - lint-staged v15.2.11+ im Root-Package installiert
   - Konfiguration in Root `package.json` oder `.lintstagedrc.js`
   - Läuft nur auf staged files (nicht gesamte Codebase)
   - Separate Konfiguration für TypeScript, JSON, Markdown Files

3. **Bei `git commit`: ESLint und Prettier laufen automatisch**
   - TypeScript-Files (`*.ts`, `*.tsx`): ESLint + Prettier
   - JSON-Files (`*.json`): Prettier
   - Markdown-Files (`*.md`): Prettier
   - Hook zeigt Output in Console (welche Files geprüft werden)
   - Performance: <5 Sekunden für typischen Commit (5-10 Files)

4. **Commit wird blockiert bei Linting-Fehlern**
   - ESLint-Errors (z.B. unused variables, type errors) → Commit failed
   - ESLint-Warnings → Commit succeeded (Warning-Message angezeigt)
   - Prettier-Check-Failures → Auto-fixed (kein Blocking)
   - Klare Fehlermeldung zeigt welche Files betroffen sind

5. **Prettier auto-fixed staged files vor Commit**
   - Prettier formatiert alle staged files automatisch
   - Änderungen werden automatisch zu Commit hinzugefügt
   - Keine manuellen `prettier --write` Commands erforderlich
   - Git-Staging-Area korrekt aktualisiert nach Auto-Fix

6. **README dokumentiert Tooling-Setup**
   - Root `README.md` enthält Sektion "Development Tooling"
   - Erklärt Husky + lint-staged Setup
   - Dokumentiert wie man Hook temporär bypassed (`--no-verify`)
   - Troubleshooting-Hinweise bei Hook-Problemen

## Tasks / Subtasks

- [ ] **Task 1: Husky installieren und konfigurieren** (AC: #1)
  - [ ] 1.1 Installiere Husky: `pnpm add -D husky -w` (root workspace)
  - [ ] 1.2 Initialisiere Husky: `npx husky init`
  - [ ] 1.3 Erstelle Pre-Commit-Hook: `.husky/pre-commit` mit `pnpm lint-staged`
  - [ ] 1.4 Füge `postinstall` Script zu Root `package.json` hinzu: `"postinstall": "husky"`
  - [ ] 1.5 Teste Hook: `git commit -m "test"` → Hook läuft

- [ ] **Task 2: lint-staged installieren und konfigurieren** (AC: #2, #3, #5)
  - [ ] 2.1 Installiere lint-staged: `pnpm add -D lint-staged -w`
  - [ ] 2.2 Erstelle Konfiguration in Root `package.json`:
    ```json
    "lint-staged": {
      "*.{ts,tsx}": [
        "eslint --fix",
        "prettier --write"
      ],
      "*.{json,md}": [
        "prettier --write"
      ]
    }
    ```
  - [ ] 2.3 Verifiziere: Nur staged files werden geprüft (nicht gesamte Codebase)
  - [ ] 2.4 Teste Performance mit mehreren Files (sollte <5s sein)

- [ ] **Task 3: Commit-Blocking bei ESLint-Errors testen** (AC: #4)
  - [ ] 3.1 Erstelle Test-File mit intentionalem ESLint-Error (z.B. unused variable)
  - [ ] 3.2 Stage File: `git add test-file.ts`
  - [ ] 3.3 Versuche Commit: `git commit -m "test"`
  - [ ] 3.4 Verifiziere: Commit wird blockiert, Error-Message angezeigt
  - [ ] 3.5 Fixe Error, committe erfolgreich
  - [ ] 3.6 Lösche Test-File

- [ ] **Task 4: Prettier Auto-Fix validieren** (AC: #5)
  - [ ] 4.1 Erstelle Test-File mit schlechter Formatierung (z.B. inkonsistente Indents)
  - [ ] 4.2 Stage File: `git add test-file.ts`
  - [ ] 4.3 Committe: `git commit -m "test"`
  - [ ] 4.4 Verifiziere: File wurde automatisch formatiert
  - [ ] 4.5 Prüfe Git-Staging-Area: Formatierte Version ist committed
  - [ ] 4.6 Lösche Test-File

- [ ] **Task 5: README dokumentieren** (AC: #6)
  - [ ] 5.1 Füge neue Sektion "Development Tooling" zu Root `README.md` hinzu
  - [ ] 5.2 Dokumentiere Husky + lint-staged Setup
  - [ ] 5.3 Erkläre Hook-Bypass: `git commit --no-verify` (für Notfälle)
  - [ ] 5.4 Füge Troubleshooting-Sektion hinzu:
    - Hook läuft nicht → `pnpm install` (Husky re-initialize)
    - Permission-Errors → `chmod +x .husky/pre-commit`
    - Performance-Probleme → `pnpm lint-staged --verbose` (Debug-Mode)
  - [ ] 5.5 Committe README-Änderungen

- [ ] **Task 6: End-to-End Smoke-Test** (AC: All)
  - [ ] 6.1 Leere Git-Staging-Area: `git reset`
  - [ ] 6.2 Ändere mehrere Files (Backend + Frontend)
  - [ ] 6.3 Stage Files: `git add .`
  - [ ] 6.4 Committe: `git commit -m "test: validate husky + lint-staged"`
  - [ ] 6.5 Verifiziere: Hook läuft, alle Files formatiert, Commit erfolgreich
  - [ ] 6.6 Prüfe Git-Log: Commit existiert mit korrekter Message

## Dev Notes

### Testing-Strategie aus Tech Spec Epic 1

**Development Tooling Requirements:**
- Pre-Commit-Hooks für Code-Quality (Linting + Formatting)
- Performance-Ziel: <5 Sekunden Hook-Execution für typischen Commit
- Nur staged files prüfen (nicht gesamte Codebase)
- Auto-Fix für Formatierung (Prettier), Blocking nur bei echten Errors

**Tools:**
- Husky v9.1.7 (Git Hooks Manager)
- lint-staged v15.2.11 (Staged Files Runner)

### Architektur-Constraints

**Monorepo-Integration:**
- Husky und lint-staged im Root-Package (nicht in Workspaces)
- Shared ESLint/Prettier-Configs müssen von allen Workspaces erreichbar sein
- Hook läuft einmal für gesamtes Repo (nicht per Workspace)

**ESLint-Konfiguration:**
```javascript
// Root .eslintrc.js (bereits vorhanden aus Story 1.7)
module.exports = {
  root: true,
  extends: ['@cv-hub/eslint-config'], // Shared config
  parserOptions: {
    project: './tsconfig.json',
  },
};
```

**Prettier-Konfiguration:**
```javascript
// Root .prettierrc.js (bereits vorhanden aus Story 1.7)
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
};
```

**lint-staged Performance-Optimierung:**
- Nutze `--max-warnings 0` für ESLint (nur Errors blocken)
- Nutze `--cache` für ESLint (schnellere Re-Runs)
- Gruppiere Files nach Typ (TS/JSON/MD) für optimale Tool-Auswahl

### Project Structure Notes

**Hook-File-Location:**
- `.husky/pre-commit` (ausführbares Shell-Script)
- Muss executable sein: `chmod +x .husky/pre-commit`
- Content: `pnpm lint-staged` (ruft lint-staged auf)

**Konfiguration-Location:**
- `package.json` (Root) → `"lint-staged": {...}` Section
- Alternative: `.lintstagedrc.js` (wenn komplexere Config nötig)
- Root-Level Config gilt für alle Workspaces

**Git-Hooks-Directory:**
- `.husky/` Directory committed (nicht in `.gitignore`)
- Hooks sind versioniert (Team-konsistenz)
- `pnpm install` aktiviert Hooks automatisch (postinstall)

### Integration mit CI/CD

**Beziehung zu Story 1.7 (CI-Pipeline):**
- CI-Pipeline (GitHub Actions) läuft **vollständiges** Linting/Type-Checking
- Pre-Commit-Hook läuft **nur** auf staged files (schneller Feedback)
- Hook ist **nicht** Ersatz für CI (nur erste Verteidigungslinie)
- CI fängt Fälle die Hook missed (z.B. wenn Developer `--no-verify` nutzt)

**Workflow:**
1. Developer commitet → Husky-Hook läuft (Fast Feedback)
2. Developer pushed → CI-Pipeline läuft (Full Validation)
3. PR Merge → CI-Pipeline muss grün sein (Safety Net)

### Performance-Überlegungen

**Typische Commit-Scenarios:**
- **Small Commit (1-3 Files):** <2 Sekunden Hook-Execution
- **Medium Commit (5-10 Files):** <5 Sekunden Hook-Execution
- **Large Commit (20+ Files):** <10 Sekunden Hook-Execution

**Performance-Bottlenecks:**
- ESLint Type-Checking (langsamster Teil)
- TypeScript-Compilation für `--project` Flag
- Große Files (>1000 Zeilen)

**Optimization-Strategien:**
- ESLint `--cache` Flag (nutzt `.eslintcache` File)
- lint-staged gruppiert Files effizient
- TypeORM-Entities excluded von Linting (decorators verlangsamen Parser)

### Troubleshooting

**Hook läuft nicht:**
- Ursache: Husky nicht initialisiert oder `.husky/` fehlt
- Lösung: `pnpm install` (Husky postinstall re-runs)

**Permission-Denied-Errors:**
- Ursache: `.husky/pre-commit` nicht executable
- Lösung: `chmod +x .husky/pre-commit`

**Hook zu langsam (>10 Sekunden):**
- Ursache: Zu viele Files staged oder ESLint-Cache disabled
- Lösung: Stage fewer files, enable ESLint `--cache`, check `.eslintcache` exists

**Bypass Hook (Notfall):**
- Command: `git commit --no-verify`
- Warnung: CI-Pipeline wird trotzdem validieren!
- Use-Case: Dringender Hotfix, Hook-Bug

### References

- [Source: docs/tech-spec-epic-1.md#Dependencies-and-Integrations (Monorepo Tools Section)]
- [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria (AC-6: Development Tooling)]
- [Source: docs/epics.md#Story-1.9]

### Learnings from Previous Story

Story 1.8 (CI/CD-Pipeline Unit-Tests) ist noch im Status "drafted" und wurde noch nicht implementiert. Daher gibt es keine Learnings aus der vorherigen Story.

**Wichtige Kontextinformationen:**
- Story 1.9 baut auf Story 1.7 (CI/CD-Pipeline Linting & Type-Check) auf
- ESLint und Prettier-Konfigurationen sollten bereits existieren (aus Story 1.7)
- Falls Story 1.7 noch nicht abgeschlossen ist: Zuerst Story 1.7 implementieren
- Pre-Commit-Hook und CI-Pipeline sind komplementär (nicht redundant):
  - Hook = Fast Feedback für Developer (nur staged files)
  - CI = Full Validation (gesamte Codebase)

## Dev Agent Record

### Context Reference

- `docs/stories/1-9-development-tooling-husky-lint-staged.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
