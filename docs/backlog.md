# Development Backlog - lebenslauf

Generated: 2025-11-08

## Action Items from Code Reviews

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
|------|-------|------|------|----------|-------|--------|-------|
| 2025-11-08 | 1.7 | 1 | Security | High | TBD | Open | Entferne Test-File-Ignores aus ESLint-Config - Erstelle separate Rule-Sets für Tests statt komplettes Ignore (AC #3) [file: eslint.config.js:14-17] |
| 2025-11-08 | 1.7 | 1 | Security | High | TBD | Open | Pin GitHub Actions zu SHA-Hashes statt floating tags @v4 (Supply Chain Attack Prevention) [file: .github/workflows/ci.yml:13,15,19] |
| 2025-11-08 | 1.7 | 1 | Documentation | High | TBD | Open | Erstelle README.md im Repository-Root mit CI-Badge, Setup-Anleitung und Workflow-Dokumentation (AC #7) [file: README.md (neu)] |
| 2025-11-08 | 1.7 | 1 | Code Quality | Medium | TBD | Open | Ändere `@typescript-eslint/no-explicit-any` von 'warn' zu 'error' für Type-Safety (AC #3) [file: eslint.config.js:40] |
| 2025-11-08 | 1.7 | 1 | Testing | Medium | TBD | Open | Push Repository zu GitHub und führe mindestens 3 Workflow-Tests durch: (1) Linting-Error, (2) Type-Error, (3) Clean Pass (AC #6 Validation) |
| 2025-11-08 | 1.7 | 1 | Code Quality | Medium | TBD | Open | Füge `--if-present` Flag zu Root pnpm Scripts hinzu für Robustheit [file: package.json:9-13] |
| 2025-11-08 | 1.7 | 1 | Performance | Low | TBD | Open | Erwäge parallele CI-Jobs für Backend/Frontend Linting (Performance-Optimierung) [file: .github/workflows/ci.yml:27-37] |

## Advisory Notes (No Action Required)

- TypeORM CLI-Commands nutzen deprecated `typeorm-ts-node-commonjs` - Erwäge Migration zu modernem `typeorm` CLI (apps/backend/package.json:24-27)
- Prettier Ignore-Patterns für `.claude`, `bmad`, `docs`, `stories` könnten zu breit sein - Erwäge spezifischere Patterns (.prettierignore:7-10)
- Frontend Build-Script führt type-check redundant aus (bereits in CI separat) - Vereinfachen zu `vite build` (apps/frontend/package.json:8)
- Nach GitHub Push Status-Badge-URL aktualisieren und in README einbinden
