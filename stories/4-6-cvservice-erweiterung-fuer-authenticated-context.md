# Story 4.6: CVService-Erweiterung für 'authenticated' Context

Status: drafted

## Story

Als Backend-Entwickler,
möchte ich den CVService um 'authenticated' Context erweitern,
damit personalisierte Links den vollständigen CV ohne Filterung erhalten.

## Context & Requirements

**Epic Context:** Epic 4 implementiert das Privacy-First Sharing System mit Token-basierter Zugriffskontrolle. Story 4.6 erweitert den bestehenden CVService (aus Epic 2) um einen neuen `'authenticated'` Context-Parameter, der es Token-Inhabern ermöglicht, den vollständigen CV ohne Privacy-Filterung zu erhalten.

**Architecture Alignment:**
- **Pattern 1 (Privacy-First Data Filtering):** Der CVService implementiert bereits Public-Filterung (`context='public'`). Diese Story fügt `context='authenticated'` hinzu, der die vollständigen, ungefilterten CV-Daten zurückgibt.
- **Pattern 2 (Token-Based Access Control):** Die Token-Validierung erfolgt in Story 4.7 durch einen `TokenValidationGuard`. Story 4.6 stellt nur die Service-Logik bereit.
- **Pattern 3 (JSON Resume Schema):** Neue `PrivateCV` Type in Shared Types Package definiert die vollständige Datenstruktur.

**Prerequisites:**
- Epic 2 (CVService mit `getCV()` Methode) ist vollständig implementiert
- Story 4.2 (Shared Types mit Invite-Schemas) ist abgeschlossen

**Key Technical Decisions:**
- Server-side Filterung bleibt zentral (keine Privacy-Logik im Frontend)
- Context-Parameter als Union Type: `'public' | 'authenticated'`
- Bestehende `getCV()` Signatur wird erweitert (breaking change für Epic 2 Controller)
- `PrivateCV` Type explizit definiert (nicht nur "ungefiltert")

## Acceptance Criteria

1. **AC-4.6.1**: `CVService.getCV()` akzeptiert neuen Parameter: `context: 'public' | 'authenticated'` (required parameter)
   - Signatur: `async getCV(context: 'public' | 'authenticated'): Promise<PublicCV | PrivateCV>`
   - TypeScript Compiler erzwingt Context-Angabe (kein Default-Wert)

2. **AC-4.6.2**: Bei `context='authenticated'`: Vollständiges CV-Objekt (`PrivateCV`) ohne Filterung
   - Alle sensiblen Felder enthalten:
     - `basics.email`: Vollständige E-Mail-Adresse
     - `basics.phone`: Telefonnummer
     - `basics.location`: Vollständiger Standort (city, countryCode)
     - `work[].name`: Echte Firmennamen (nicht "Confidential")
     - `volunteer[].organization`: Echte Organisationsnamen
     - `projects[].entity`: Echte Company-Namen
     - `projects[].metrics`: Business-Metriken (z.B. "100K+ users")
   - Keine Redaktion, keine Feldkürzung

3. **AC-4.6.3**: Bei `context='public'`: Bestehende Filterung (Epic 2) unverändert
   - Alle sensiblen Felder redaktiert:
     - `basics.email`, `basics.phone`, `basics.location`: `undefined`
     - `work[].name`: `"Confidential"`
     - `projects[].entity`, `projects[].metrics`: `undefined`
   - Kompatibilität mit Epic 3 (Public Portfolio) gewährleistet

4. **AC-4.6.4**: `PrivateCV` Type in Shared Types Package (`packages/shared-types/src/cv.schema.ts`)
   - Zod-Schema definiert: `PrivateCVSchema`
   - TypeScript Type exportiert: `export type PrivateCV = z.infer<typeof PrivateCVSchema>`
   - Extendet von `CVSchema` (JSON Resume Standard)
   - Alle sensiblen Felder als `required()` markiert (nicht `optional()`)

5. **AC-4.6.5**: Unit-Tests für `CVService`
   - Test: `context='public'` → PublicCV (sensible Felder = undefined)
   - Test: `context='authenticated'` → PrivateCV (alle Felder vorhanden)
   - Test: Feldvergleich (PublicCV vs PrivateCV haben unterschiedliche Werte)
   - Test: TypeScript-Type-Safety (Compiler-Fehler bei fehlenden Feldern)

6. **AC-4.6.6**: Integration-Test (Vorbereitung für Story 4.7)
   - Mock: `GET /api/cv/public` → verwendet `getCV('public')`
   - Mock: `GET /api/cv/private/:token` → verwendet `getCV('authenticated')` (wird in 4.7 implementiert)
   - Assertion: Public-Response hat keine `email`, Private-Response hat `email`

## Tasks / Subtasks

- [ ] **Task 1**: PrivateCV Type in Shared Types definieren (AC-4.6.4)
  - [ ] 1.1: `PrivateCVSchema` mit Zod in `packages/shared-types/src/cv.schema.ts` erstellen
  - [ ] 1.2: Alle sensiblen Felder als `required()` markieren (email, phone, location, etc.)
  - [ ] 1.3: TypeScript Type exportieren: `export type PrivateCV = z.infer<typeof PrivateCVSchema>`
  - [ ] 1.4: Schema in `packages/shared-types/src/index.ts` re-exportieren

- [ ] **Task 2**: CVService erweitern für Context-Parameter (AC-4.6.1, 4.6.2, 4.6.3)
  - [ ] 2.1: `getCV()` Signatur ändern: Parameter `context: 'public' | 'authenticated'` hinzufügen
  - [ ] 2.2: Conditional Logic: `if (context === 'authenticated') return fullCV as PrivateCV`
  - [ ] 2.3: Bestehende `filterPublicSubset()` Methode für `context='public'` beibehalten
  - [ ] 2.4: Return Type anpassen: `Promise<PublicCV | PrivateCV>`
  - [ ] 2.5: TypeScript-Checks: Keine Type-Errors in CVService

- [ ] **Task 3**: CVController (Epic 2) auf neues API anpassen (Breaking Change)
  - [ ] 3.1: `GET /api/cv/public` Endpoint: `cvService.getCV('public')` aufrufen
  - [ ] 3.2: Sicherstellen, dass Epic 3 Frontend weiterhin funktioniert (Public Route)
  - [ ] 3.3: TypeScript Compiler bestätigt: Alle `getCV()` Calls haben Context-Parameter

- [ ] **Task 4**: Unit-Tests für CVService schreiben (AC-4.6.5)
  - [ ] 4.1: Test: `getCV('public')` gibt PublicCV zurück (email = undefined)
  - [ ] 4.2: Test: `getCV('authenticated')` gibt PrivateCV zurück (email vorhanden)
  - [ ] 4.3: Test: PublicCV != PrivateCV (Feldvergleich für work[0].name)
  - [ ] 4.4: Test: Type-Safety (PrivateCV hat alle required Felder)

- [ ] **Task 5**: Integration-Tests vorbereiten (AC-4.6.6)
  - [ ] 5.1: Test: `GET /api/cv/public` returned filtered CV
  - [ ] 5.2: Test-Stub für `GET /api/cv/private/:token` (wird in Story 4.7 implementiert)
  - [ ] 5.3: Assertion: Public hat keine `email`, Private wird `email` haben (sobald 4.7 live)

## Dev Notes

### Architecture Patterns

**Pattern 1: Privacy-First Data Filtering (Architecture.md#Pattern-1)**
```typescript
class CVService {
  async getCV(context: 'public' | 'authenticated'): Promise<CVData> {
    const fullCV = await this.repository.findOne();

    if (context === 'public') {
      return this.filterPublicSubset(fullCV); // Epic 2 Logik
    }

    return fullCV; // Full data for authenticated (NEU)
  }
}
```
- Server-side Filterung (nie private Daten zum Client senden)
- Context bestimmt durch Token-Validierung (Story 4.7)
- Zod-Schemas für Validation an Boundaries

**Pattern 2: Token-Based Access Control (Architecture.md#Pattern-2)**
- Story 4.6 implementiert nur die Service-Logik
- Token-Validierung erfolgt in Story 4.7 durch `TokenValidationGuard`
- Guard attached `request.invite` → Context `'authenticated'` wird gesetzt

### Testing Strategy

**Unit-Tests (CVService):**
- Mock: TypeORM Repository mit Beispiel-CV
- Assertions: Feldvergleich (Public vs Private)
- Tool: Vitest (Epic 1 Testing Setup)

**Integration-Tests (API):**
- Epic 1 Setup: Supertest + TypeORM In-Memory DB
- Story 4.7 wird `/api/cv/private/:token` hinzufügen
- Diese Story bereitet nur die Service-Layer-Logik vor

### File Structure Alignment

**Betroffene Files (Story 4.6):**
```
packages/
  shared-types/
    src/
      cv.schema.ts          (UPDATE: PrivateCVSchema hinzufügen)
      index.ts              (UPDATE: PrivateCV re-exportieren)

apps/
  backend/
    src/
      modules/
        cv/
          cv.service.ts     (UPDATE: context Parameter hinzufügen)
          cv.controller.ts  (UPDATE: getCV() Calls anpassen)
          cv.service.spec.ts (UPDATE: Tests für beide Contexts)
```

**Nicht betroffene Files:**
- `apps/frontend/` (keine Frontend-Changes in Story 4.6)
- `apps/backend/src/modules/invite/` (wird in Story 4.7 verwendet)

### Technical Considerations

**Breaking Change:**
- `CVService.getCV()` benötigt jetzt Context-Parameter
- Alle bestehenden Calls müssen aktualisiert werden:
  - Epic 2: `GET /api/cv/public` → `cvService.getCV('public')`
  - Epic 3 Frontend nutzt `/api/cv/public` (kein Breaking Change für Frontend)

**Type Safety:**
- TypeScript erzwingt Context-Parameter (kein Default-Wert)
- Return Type `PublicCV | PrivateCV` erhöht Type-Safety
- Compiler-Fehler bei fehlenden Feldern in `PrivateCVSchema`

**Performance:**
- Kein Performance-Impact (keine zusätzlichen DB-Queries)
- Filterung bleibt auf Server (wie in Epic 2)
- Epic 3 Public Route bleibt unverändert schnell

### Prerequisites Verification

- ✅ Epic 2: CVService mit `getCV()` implementiert
- ✅ Epic 2: Privacy-Filter (`filterPublicSubset()`) existiert
- ✅ Story 4.2: Invite-Schemas in Shared Types (CUID2Token, InviteValidation)
- ⏳ Story 4.7: Wird `TokenValidationGuard` + `GET /api/cv/private/:token` hinzufügen

### References

- [Source: docs/epics.md#Story-4.6] - Story Definition & Acceptance Criteria
- [Source: docs/architecture.md#Pattern-1] - Privacy-First Data Filtering Pattern
- [Source: docs/architecture.md#Pattern-2] - Token-Based Access Control Pattern
- [Source: docs/tech-spec-epic-4.md#System-Architecture-Alignment] - Epic 4 Architecture Kontext

## Change Log

- **2025-11-07**: Story 4.6 erstellt (Status: drafted)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
