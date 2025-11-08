# Story 2.3: Seed Data für Beispiel-CV mit JSON Resume Format

Status: drafted

## Story

Als Entwickler,
möchte ich beim ersten Aufsetzen des Projekts automatisch ein Beispiel-CV in der Datenbank haben,
damit ich die Anwendung sofort testen kann ohne manuell CV-Daten anlegen zu müssen.

## Acceptance Criteria

1. **Seed-Script existiert und ist ausführbar**
   - Seed-Script liegt unter `apps/backend/src/database/seeds/cv.seed.ts`
   - Command `npm run seed` (oder `pnpm seed`) funktioniert
   - Script ist idempotent: Mehrfaches Ausführen schadet nicht

2. **Beispiel-CV existiert als JSON-Datei**
   - Beispiel-CV-Datei liegt unter `apps/backend/seeds/example-cv.json`
   - JSON entspricht vollständig dem JSON Resume Schema
   - Enthält realistische, repräsentative Daten für alle Sections:
     - basics (name, label, summary, location, profiles)
     - work (mindestens 2 Einträge, einige mit `isPrivate: true`)
     - education (mindestens 1 Eintrag)
     - skills (diverse Skills mit levels)
     - projects (mindestens 3 Projekte, Mix aus public/private)
     - volunteer (optional, mindestens 1 Eintrag wenn vorhanden)

3. **Seed-Script validiert gegen CVSchema**
   - Vor dem Einfügen wird `CVSchema.parse(exampleCV)` ausgeführt
   - Bei Validation-Fehler: Script wirft klare Fehlermeldung
   - Keine invaliden Daten werden in DB geschrieben

4. **CV wird korrekt in Datenbank eingefügt**
   - `cv` Tabelle enthält Eintrag mit `id: 1`
   - `data` Feld enthält serialisiertes JSON (String)
   - `updatedAt` wird auf aktuellen Timestamp gesetzt

5. **Idempotenz: Script überspringt bei existierendem CV**
   - Check: Wenn `cv.id = 1` existiert → "CV already seeded, skipping..." ausgeben
   - Kein Überschreiben bei erneutem Run
   - Exit Code 0 (kein Fehler)

6. **Seed-Script ist in Dev-Workflow integriert**
   - Script läuft automatisch bei `docker-compose up` (optional via init container)
   - ODER ist dokumentiert im README als Setup-Schritt
   - ODER ist Teil von `npm run dev` / `pnpm dev`

## Tasks / Subtasks

- [ ] **Task 1: Beispiel-CV JSON-Datei erstellen** (AC: #2)
  - [ ] 1.1: `apps/backend/seeds/example-cv.json` Datei anlegen
  - [ ] 1.2: JSON Resume Schema konform befüllen mit realistischen Daten
  - [ ] 1.3: Privacy-Flags setzen: Mindestens 1 work entry mit `isPrivate: true`
  - [ ] 1.4: Projekte Mix: Mindestens 1 Projekt mit `isPrivate: false`, 1 mit `isPrivate: true`
  - [ ] 1.5: Validieren gegen CVSchema (lokal testen mit Zod)

- [ ] **Task 2: Seed-Script implementieren** (AC: #1, #3, #4, #5)
  - [ ] 2.1: `apps/backend/src/database/seeds/cv.seed.ts` erstellen
  - [ ] 2.2: Funktion `seedCV(dataSource: DataSource)` implementieren
  - [ ] 2.3: Check implementieren: Wenn `cv.id=1` existiert → Skip
  - [ ] 2.4: Beispiel-CV-Datei laden und parsen
  - [ ] 2.5: Zod-Validation mit `CVSchema.parse()` durchführen
  - [ ] 2.6: Bei erfolgreichem Parse: INSERT in `cv` Tabelle (id: 1)
  - [ ] 2.7: Erfolgs-/Skip-Meldungen ausgeben (console.log)
  - [ ] 2.8: Error-Handling: Zod-Fehler, File-not-found, DB-Errors

- [ ] **Task 3: NPM-Script für Seed-Command erstellen** (AC: #1)
  - [ ] 3.1: `package.json` (Backend) um `seed` Script erweitern
  - [ ] 3.2: Script ruft `seedCV()` Funktion auf mit DataSource
  - [ ] 3.3: Testen: `pnpm seed` im backend/ Ordner funktioniert
  - [ ] 3.4: Idempotenz testen: Mehrfaches Ausführen funktioniert

- [ ] **Task 4: Integration in Dev-Workflow** (AC: #6)
  - [ ] 4.1: Dokumentation in README hinzufügen (Setup-Schritte)
  - [ ] 4.2: Optional: Docker-Compose init-container für auto-seeding
  - [ ] 4.3: Oder: `npm run dev` führt automatisch Seed aus (wenn DB leer)

- [ ] **Task 5: Testing und Validation** (AC: #2, #3, #4, #5)
  - [ ] 5.1: Unit-Test für `seedCV()` Funktion schreiben
  - [ ] 5.2: Test: Seed auf leere DB → CV wird eingefügt
  - [ ] 5.3: Test: Seed auf existierende DB → Skipping funktioniert
  - [ ] 5.4: Test: Invalid JSON → Zod wirft Fehler
  - [ ] 5.5: Manueller Test: `pnpm seed` ausführen und DB prüfen

## Dev Notes

### Technische Hinweise

**JSON Resume Schema Conformance:**
- Strikte Konformität zu https://jsonresume.org/schema ist erforderlich
- cv-hub Extensions: `isPrivate` (work, projects), `metrics` (projects), `entity` (projects)
- Alle Core-Felder müssen valide sein: `basics`, `work`, `education`, `skills`, `projects`

**Privacy-Flags für Seed-Data:**
- Mindestens 1 `work` Entry mit `isPrivate: false` (für Public-Ansicht)
- Mindestens 1 `work` Entry mit `isPrivate: true` (für Private-Ansicht Testing)
- Mindestens 1 `project` mit `isPrivate: false` (öffentliches Projekt)
- Mindestens 1 `project` mit `isPrivate: true` (privates Projekt mit `metrics`, `entity`)

**Seed-Script Best Practices:**
- TypeORM DataSource muss initialisiert sein vor Seed-Call
- Verwende `repository.findOne({ where: { id: 1 } })` für existence check
- JSON serialization: `JSON.stringify(validatedCV)` vor INSERT
- Exit Codes: 0 bei Success/Skip, 1 bei Error

**Idempotenz:**
- Wichtig für Docker Compose restarts
- Wichtig für CI/CD Pipelines (wiederholbare Deployments)
- Check BEFORE any writes

### Projektstruktur-Notizen

**Seed-Datei-Pfade:**
```
apps/backend/
├── src/
│   └── database/
│       └── seeds/
│           └── cv.seed.ts          # Seed-Script
└── seeds/
    └── example-cv.json             # Beispiel-CV Daten
```

**Integration:**
- Seed-Script nutzt existierende TypeORM DataSource
- CVEntity und CVSchema sind bereits vorhanden (Story 2.1, 2.2)
- Keine neue Migration erforderlich (nur Daten-INSERT)

**NPM-Script (`apps/backend/package.json`):**
```json
{
  "scripts": {
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/runner.ts"
  }
}
```

**Runner-Script (`src/database/seeds/runner.ts`):**
```typescript
import { DataSource } from 'typeorm';
import { seedCV } from './cv.seed';
import dataSourceConfig from '../data-source'; // TypeORM config

async function run() {
  const dataSource = new DataSource(dataSourceConfig);
  await dataSource.initialize();

  try {
    await seedCV(dataSource);
    console.log('✓ Seeding completed');
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

run();
```

### Referenzen

**Tech-Spec:**
- [AC-9: Seed Data lädt Beispiel-CV bei erster Initialisierung](../tech-spec-epic-2.md#ac-9-seed-data-lädt-beispiel-cv-bei-erster-initialisierung)
- [Seed Data Script Implementation](../tech-spec-epic-2.md#seed-data-script)

**Architecture:**
- [JSON Resume Schema Integration](../architecture.md#3-json-resume-as-single-source-of-truth)
- [TypeORM Data Models](../architecture.md#backend-stack)

**PRD:**
- [FR-6: CV-Daten-Management](../PRD.md#fr-6-cv-daten-management)

**Abhängigkeiten:**
- **Voraussetzung:** Story 2.1 (JSON Resume Zod-Schema existiert)
- **Voraussetzung:** Story 2.2 (CV und CVVersion Entities existieren, Migrations laufen)
- **Blockiert:** Story 2.4+ (Privacy Filter braucht Test-Daten)

## Dev Agent Record

### Context Reference

<!-- Story Context XML wird von story-context workflow hinzugefügt -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

<!-- Hier kommen während der Entwicklung Links zu Debug-Logs -->

### Completion Notes List

<!-- Entwickler fügt hier Notizen hinzu nach Abschluss der Story -->

### File List

<!-- Liste der erstellten/modifizierten/gelöschten Dateien -->

---

## Change Log

**2025-11-06 - Story Created (drafted)**
- Initial story draft created by Scrum Master (Bob)
- Based on Tech-Spec Epic 2, AC-9
- Status: drafted → Bereit für Technical Review
- Next: SM kann `*story-context` oder `*story-ready` ausführen

