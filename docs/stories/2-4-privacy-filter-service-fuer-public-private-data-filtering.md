# Story 2.4: Privacy Filter Service für Public/Private Data Filtering

Status: drafted

## Story

Als Entwickler,
möchte ich einen Service der private CV-Daten filtert,
damit öffentliche API-Requests keine sensiblen Daten leaken.

## Acceptance Criteria

1. **Service-Implementierung:** `PrivacyFilterService` existiert in `apps/backend/src/modules/cv/services/privacy-filter.service.ts`

2. **Haupt-Methode:** Method `filterPublicSubset(cv: CV): CV` implementiert mit klarer Signatur

3. **Filtering-Logik für alle Private Fields:**
   - `basics.email` → undefined
   - `basics.phone` → undefined
   - `basics.location.address` → undefined
   - `basics.location.postalCode` → undefined
   - `skills[].level` → undefined
   - `projects` → nur Projekte mit `isPrivate: false` einschließen
   - `work[].name` → "Confidential" (redacted)
   - `work[].highlights` → max 3 Items (gekürzt wenn länger)
   - `projects[].entity` → undefined
   - `projects[].metrics` → undefined

4. **Immutability:** Original-CV wird nicht mutiert (Deep-Clone oder immutable Operations)

5. **Performance:** Filter-Operation <10ms für typischen CV (~50KB JSON)

6. **Unit-Tests:** Test-Coverage 100% für alle Private Fields mit expliziten Assertions

## Tasks / Subtasks

- [ ] Task 1: Service-Datei erstellen und Grundstruktur aufsetzen (AC: #1)
  - [ ] Subtask 1.1: Service-Klasse in `apps/backend/src/modules/cv/services/privacy-filter.service.ts` erstellen
  - [ ] Subtask 1.2: NestJS `@Injectable()` Decorator hinzufügen
  - [ ] Subtask 1.3: CVSchema-Types aus `@cv-hub/shared-types` importieren

- [ ] Task 2: Haupt-Filtering-Methode implementieren (AC: #2, #3)
  - [ ] Subtask 2.1: `filterPublicSubset(cv: CV): CV` Methode-Signatur definieren
  - [ ] Subtask 2.2: Basics-Filtering implementieren (email, phone, address, postalCode)
  - [ ] Subtask 2.3: Skills-Filtering implementieren (level entfernen)
  - [ ] Subtask 2.4: Projects-Filtering implementieren (nur isPrivate: false, entity und metrics entfernen)
  - [ ] Subtask 2.5: Work-Filtering implementieren (name redaction, highlights kürzen)
  - [ ] Subtask 2.6: Validator-Methode `shouldIncludeField()` hinzufügen (optional helper)

- [ ] Task 3: Immutability sicherstellen (AC: #4)
  - [ ] Subtask 3.1: Deep-Clone-Strategie implementieren (z.B. structured clone oder JSON.parse/stringify)
  - [ ] Subtask 3.2: Test schreiben der Original-CV-Mutation verifiziert

- [ ] Task 4: Performance-Optimierung (AC: #5)
  - [ ] Subtask 4.1: Benchmark-Test für Filter-Operation erstellen
  - [ ] Subtask 4.2: Bei Bedarf Optimierungen (z.B. selective cloning statt full clone)

- [ ] Task 5: Umfassende Unit-Tests schreiben (AC: #6)
  - [ ] Subtask 5.1: Test-Datei `privacy-filter.service.spec.ts` erstellen
  - [ ] Subtask 5.2: Fixture-CV mit allen Feldern (public + private) erstellen
  - [ ] Subtask 5.3: Tests für basics-Filtering (email, phone, address)
  - [ ] Subtask 5.4: Tests für skills-Filtering (level removal)
  - [ ] Subtask 5.5: Tests für projects-Filtering (isPrivate, entity, metrics)
  - [ ] Subtask 5.6: Tests für work-Filtering (name redaction, highlights truncation)
  - [ ] Subtask 5.7: Test für Immutability (original nicht mutiert)
  - [ ] Subtask 5.8: Performance-Test (<10ms assertion)

- [ ] Task 6: Service in CV-Module registrieren
  - [ ] Subtask 6.1: PrivacyFilterService in `cv.module.ts` zu `providers` hinzufügen
  - [ ] Subtask 6.2: Service exportieren falls von anderen Modulen benötigt

## Dev Notes

### Architektur-Patterns

**Privacy-by-Design (Architecture Pattern 1):**
- Server-Side-Filtering: Private Daten verlassen nie den Server im public Context
- Fail-Closed: Bei Filter-Fehler wird Error geworfen, nicht ungefilterter CV zurückgegeben
- Field-Level Access Control: Granulare Kontrolle pro Feld

[Quelle: architecture.md#Privacy-First, tech-spec-epic-2.md Zeilen 142-151, 898-914]

**Immutable Operations:**
- Original-CV wird nicht mutiert (wichtig für Caching und Debugging)
- Deep-Clone-Strategie erforderlich (nested objects)
- Alternative: Immutable.js oder Immer.js (optional, nicht zwingend)

[Quelle: tech-spec-epic-2.md Zeilen 876, 1534-1539]

### Source Tree Components

**Neue Dateien:**
- `apps/backend/src/modules/cv/services/privacy-filter.service.ts` - Haupt-Service
- `apps/backend/src/modules/cv/services/privacy-filter.service.spec.ts` - Unit Tests

**Abhängigkeiten:**
- `packages/shared-types/src/cv-schema.ts` - CVSchema, CV Type (Story 2.1)
- `apps/backend/src/modules/cv/cv.module.ts` - Module-Registration

**Verwendung durch:**
- Story 2.5 (CVService.getCV() ruft PrivacyFilterService auf)
- Story 2.6 (GET /api/cv/public Endpoint)

### Testing Standards

**Unit-Test-Anforderungen:**
- Framework: Jest (NestJS Standard)
- Coverage: 100% für PrivacyFilterService
- Fixtures: Vollständiger Test-CV mit allen JSON Resume Feldern
- Assertions: Explizite Checks für ALLE private Fields (siehe AC #3)
- Performance: Benchmark-Test mit >100 Iterationen, p95 <10ms

**Test-Struktur:**
```typescript
describe('PrivacyFilterService', () => {
  let service: PrivacyFilterService;

  beforeEach(() => {
    service = new PrivacyFilterService();
  });

  it('should remove basics.email');
  it('should remove basics.phone');
  it('should redact work[].name to "Confidential"');
  it('should truncate work[].highlights to max 3 items');
  it('should filter projects where isPrivate: true');
  it('should remove projects[].entity and metrics');
  it('should remove skills[].level');
  it('should not mutate original CV');
  it('should complete filtering in <10ms');
});
```

[Quelle: tech-spec-epic-2.md Zeilen 1859-1911, 2048-2069]

### Project Structure Notes

**Module-Hierarchie:**
```
apps/backend/src/modules/cv/
├── cv.module.ts (Module Definition)
├── entities/
│   ├── cv.entity.ts (Story 2.2)
│   └── cv-version.entity.ts (Story 2.2)
├── services/
│   ├── privacy-filter.service.ts ← Dieser Service (Story 2.4)
│   ├── privacy-filter.service.spec.ts
│   └── cv.service.ts (Story 2.5 - nutzt PrivacyFilterService)
└── controllers/
    └── cv.controller.ts (Story 2.6+)
```

**NestJS Dependency Injection:**
- PrivacyFilterService wird als `@Injectable()` deklariert
- In CVService via Constructor Injection verwendbar:
  ```typescript
  constructor(private privacyFilter: PrivacyFilterService) {}
  ```

### Learnings from Previous Story

**From Story 2-3 (Status: drafted):**
- Vorherige Story "seed-data-fuer-beispiel-cv-mit-json-resume-format" ist drafted, aber noch nicht implementiert
- Keine Service-Patterns oder Dateien zum Wiederverwenden vorhanden
- Dies ist eine der ersten Service-Implementierungen in Epic 2

### References

**Technical Specifications:**
- [Tech-Spec Epic 2, Zeilen 110-150]: Privacy Filter Service Responsibilities
- [Tech-Spec Epic 2, Zeilen 344-359]: Privacy-Filtered Subsets (Expected Output)
- [Tech-Spec Epic 2, Zeilen 907-914]: Privacy-by-Design Security Patterns
- [Tech-Spec Epic 2, Zeilen 967-991]: Error Handling Strategy
- [Tech-Spec Epic 2, Zeilen 1534-1542]: AC-8 Details (Privacy Filter Tests)
- [Tech-Spec Epic 2, Zeilen 1812-1911]: Unit Test Examples

**Architecture:**
- [architecture.md, Pattern 1]: Privacy-First Data Filtering
- [architecture.md, Backend Stack]: NestJS Service Layer Patterns

**Epic Context:**
- [epics.md, Zeilen 365-391]: Story 2.4 Definition und Acceptance Criteria

## Dev Agent Record

### Context Reference

<!-- Story Context XML wird hier von story-context workflow hinzugefügt -->

### Agent Model Used

<!-- Model-Info wird beim Start der Implementierung eingetragen -->

### Debug Log References

<!-- Debug-Logs während Implementierung -->

### Completion Notes List

<!-- Nach Implementierung: Learnings, neue Patterns, Abweichungen -->

### File List

<!-- Nach Implementierung: Erstellte/Modifizierte Dateien -->
