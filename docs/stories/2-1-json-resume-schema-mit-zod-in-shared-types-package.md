# Story 2.1: JSON Resume Schema mit Zod in Shared Types Package

Status: drafted

## Story

Als Entwickler,
möchte ich ein validiertes JSON Resume Schema in shared-types,
damit Backend und Frontend Type-Safety für CV-Daten haben.

## Acceptance Criteria

1. ✅ Zod-Schema `CVSchema` existiert in `packages/shared-types/src/cv-schema.ts`
2. ✅ Schema umfasst alle JSON Resume Core-Felder: `basics`, `work`, `education`, `skills`, `projects`, `volunteer`
3. ✅ cv-hub Extensions implementiert: `isPrivate` (boolean), `metrics` (string), `entity` (string)
4. ✅ TypeScript-Types automatisch inferiert: `type CV = z.infer<typeof CVSchema>`
5. ✅ Sub-Schemas exportiert: `BasicsSchema`, `WorkSchema`, `EducationSchema`, `SkillSchema`, `ProjectSchema`, `VolunteerSchema`
6. ✅ Unit-Tests validieren Schema: Valid Data parsed, Invalid Data wirft ZodError
7. ✅ Package baut erfolgreich: `pnpm build` in shared-types

## Tasks / Subtasks

- [ ] Task 1: Zod Dependency installieren und Schema-Struktur aufsetzen (AC: #1)
  - [ ] Subtask 1.1: Zod als Dependency in `packages/shared-types/package.json` hinzufügen
  - [ ] Subtask 1.2: Datei `packages/shared-types/src/cv-schema.ts` erstellen
  - [ ] Subtask 1.3: Basis-Imports und Exports konfigurieren

- [ ] Task 2: JSON Resume Core-Schemas implementieren (AC: #2, #3, #5)
  - [ ] Subtask 2.1: `BasicsSchema` mit allen Feldern (name, label, email, phone, url, summary, location, profiles)
  - [ ] Subtask 2.2: `WorkSchema` mit cv-hub Extension `isPrivate`
  - [ ] Subtask 2.3: `EducationSchema` gemäß JSON Resume Standard
  - [ ] Subtask 2.4: `SkillSchema` (name, level, keywords)
  - [ ] Subtask 2.5: `ProjectSchema` mit cv-hub Extensions (`isPrivate`, `metrics`, `entity`)
  - [ ] Subtask 2.6: `VolunteerSchema` gemäß JSON Resume Standard
  - [ ] Subtask 2.7: Root `CVSchema` als Composition aller Sub-Schemas

- [ ] Task 3: TypeScript Type-Inferenz konfigurieren (AC: #4)
  - [ ] Subtask 3.1: TypeScript-Types aus Zod-Schemas inferieren: `type CV = z.infer<typeof CVSchema>`
  - [ ] Subtask 3.2: Sub-Types exportieren: `Basics`, `Work`, `Education`, `Skill`, `Project`, `Volunteer`
  - [ ] Subtask 3.3: Exports in `packages/shared-types/src/index.ts` hinzufügen

- [ ] Task 4: Unit-Tests für Schema-Validierung (AC: #6)
  - [ ] Subtask 4.1: Test-Suite erstellen in `packages/shared-types/src/cv-schema.spec.ts`
  - [ ] Subtask 4.2: Test: Valid CV Data parsed erfolgreich
  - [ ] Subtask 4.3: Test: Invalid Data (missing required fields) wirft ZodError
  - [ ] Subtask 4.4: Test: Invalid Data (wrong types) wirft ZodError mit korrekten error paths
  - [ ] Subtask 4.5: Test: Optional Fields funktionieren (undefined erlaubt)
  - [ ] Subtask 4.6: Test: cv-hub Extensions (`isPrivate`, `metrics`, `entity`) werden validiert

- [ ] Task 5: Build-Konfiguration und Verifikation (AC: #7)
  - [ ] Subtask 5.1: TypeScript Build-Config für shared-types prüfen (`tsconfig.json`)
  - [ ] Subtask 5.2: Build ausführen: `pnpm build` in shared-types
  - [ ] Subtask 5.3: Generierte `.d.ts` Files verifizieren
  - [ ] Subtask 5.4: Package lokal testen (Import in Backend/Frontend)

## Dev Notes

### Kontext: JSON Resume Standard als Single Source of Truth

Diese Story implementiert das Herzstück der cv-hub Datenarchitektur: **JSON Resume Schema als Single Source of Truth**. Das JSON Resume Schema (https://jsonresume.org/schema) ist ein etablierter, community-getriebener Standard für CV-Daten und dient als Basis für die gesamte Anwendung.

**Warum JSON Resume?**
- Etablierter Standard seit Jahren stabil
- Strukturierte, semantische CV-Daten
- Kompatibilität mit Tools und Services im CV-Ökosystem
- Einfache Erweiterbarkeit für cv-hub-spezifische Felder
- Schema.org Mapping für SEO (JSON-LD)

**cv-hub Extensions:**
Das JSON Resume Schema wird erweitert um Privacy- und Metriken-Features:
- `isPrivate: boolean` - Markiert Daten als privat (nur bei Token-Zugriff sichtbar)
- `metrics: string` - Business-Metriken für Projekte (z.B. "100K+ users, 25% conversion")
- `entity: string` - Firma/Organisation für Projekte (ergänzt JSON Resume `name` Field)

### Architektur-Pattern: Zod Schema als Contract

**Pattern-Übersicht:**
Zod-Schemas dienen als zentraler Vertrag zwischen Frontend, Backend und externen Datenquellen (KI-Extraktion). Alle drei Schichten nutzen dasselbe Schema für Validation und Type-Inferenz.

**Vorteile:**
- **Single Source of Truth:** Ein Schema für alle Schichten
- **Type-Safety:** Compile-time (TypeScript) + Runtime (Zod) Validierung
- **DRY:** Keine duplizierten Type-Definitionen
- **Validierung:** Automatische Input-Validierung in API-Endpoints
- **Dokumentation:** Schema ist selbst-dokumentierend

**Nutzung im Stack:**
```typescript
// Backend DTO Validation
import { CVSchema } from '@cv-hub/shared-types';

export class UpdateCVDto {
  @IsZod(CVSchema) // Custom Zod validator decorator
  cv: CV;
}

// Frontend Form Validation
import { CVSchema } from '@cv-hub/shared-types';

const form = useForm({
  defaultValues: cv,
  onSubmit: async (values) => {
    const parsed = CVSchema.parse(values); // Runtime validation
    await updateCV(parsed);
  },
});

// KI-Extraktion Output Validation
const extractedData = await gemini.generateContent(prompt);
const validated = CVSchema.safeParse(JSON.parse(extractedData));
if (!validated.success) {
  // Show validation errors in review UI
}
```

### Project Structure Notes

**Monorepo-Struktur:**
```
cv-hub/
├── apps/
│   ├── backend/         # NestJS (konsumiert shared-types)
│   └── frontend/        # TanStack Start (konsumiert shared-types)
├── packages/
│   ├── shared-types/    # Zod schemas, TypeScript types
│   │   ├── src/
│   │   │   ├── cv-schema.ts       # JSON Resume Schema (diese Story)
│   │   │   ├── index.ts            # Exports
│   │   │   └── cv-schema.spec.ts   # Unit Tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/          # Shared configs
├── pnpm-workspace.yaml
└── package.json
```

**Package Dependencies:**
- `packages/shared-types` hat nur Zod als Runtime-Dependency
- `apps/backend` und `apps/frontend` importieren `@cv-hub/shared-types`
- pnpm Workspaces sorgt für automatisches Linking

**Build-Output:**
- `packages/shared-types/dist/` - Transpilierter JS + .d.ts Files
- Apps importieren aus compiled Package, nicht aus Source

### Implementierungs-Details aus Tech-Spec

**JSON Resume Core-Felder (Referenz: tech-spec-epic-2.md, Lines 217-316):**

**1. Basics Schema:**
```typescript
{
  name: string;              // Required
  label: string;             // "Senior Full-Stack Engineer"
  image?: string;            // URL to profile picture
  email?: string;            // Private field (filtered in public API)
  phone?: string;            // Private field
  url?: string;              // Personal website
  summary?: string;          // Professional summary
  location?: {
    address?: string;        // Private field
    postalCode?: string;     // Private field
    city?: string;           // Public
    countryCode?: string;    // Public ("DE")
    region?: string;         // Optional
  };
  profiles?: Array<{
    network: string;         // "LinkedIn", "GitHub"
    username: string;
    url: string;             // Profile URL
  }>;
}
```

**2. Work Schema:**
```typescript
{
  name?: string;             // Company name
  position: string;          // Required
  url?: string;              // Company URL
  startDate: string;         // ISO 8601: YYYY-MM-DD
  endDate?: string;          // Optional (current position)
  summary?: string;          // Job description
  highlights?: string[];     // Achievements
  isPrivate: boolean;        // cv-hub extension (default: false)
}
```

**3. Education Schema:**
```typescript
{
  institution: string;       // Required
  url?: string;              // University URL
  area?: string;             // "Computer Science"
  studyType?: string;        // "Bachelor", "Master"
  startDate?: string;
  endDate?: string;
  score?: string;            // GPA or grade
  courses?: string[];        // List of courses
}
```

**4. Skill Schema:**
```typescript
{
  name: string;              // Required
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  keywords?: string[];       // Tags: ["Frontend", "Backend"]
}
```

**5. Project Schema (mit cv-hub Extensions):**
```typescript
{
  name: string;              // Required
  description: string;       // Required
  highlights?: string[];     // Key achievements
  keywords?: string[];       // Tech stack: ["React", "Node.js"]
  startDate?: string;
  endDate?: string;
  url?: string;              // Project URL
  roles?: string[];          // ["Lead Developer", "Architect"]
  entity?: string;           // cv-hub extension: Company/Organization
  type?: string;             // "application", "website", "library"
  isPrivate: boolean;        // cv-hub extension (default: false)
  metrics?: string;          // cv-hub extension: "100K+ users, 25% conversion"
}
```

**6. Volunteer Schema:**
```typescript
{
  organization: string;      // Required
  position: string;          // Required
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}
```

**7. Root CV Schema:**
```typescript
{
  basics: Basics;            // Required
  work?: Work[];
  volunteer?: Volunteer[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  // Additional JSON Resume fields (awards, publications, languages, interests, references)
  // können bei Bedarf erweitert werden (Out of Scope für MVP)
}
```

### Testing Strategy

**Unit-Tests (Vitest):**
- Test-Coverage Ziel: 95%+ für cv-schema.ts
- Alle JSON Resume Core-Felder getestet
- cv-hub Extensions validiert
- Error-Paths bei Invalid Data verifiziert

**Test-Struktur:**
```typescript
describe('CVSchema', () => {
  describe('Valid Data', () => {
    it('should parse valid CV with all fields');
    it('should parse CV with only required fields');
    it('should handle optional fields as undefined');
  });

  describe('Invalid Data', () => {
    it('should reject CV with missing required fields');
    it('should reject CV with wrong types');
    it('should provide detailed error paths for nested fields');
  });

  describe('cv-hub Extensions', () => {
    it('should validate isPrivate boolean');
    it('should validate metrics string');
    it('should validate entity string');
  });

  describe('Sub-Schemas', () => {
    it('should export BasicsSchema independently');
    it('should export WorkSchema independently');
    // ... weitere Sub-Schemas
  });
});
```

### Learnings from Previous Story

**From Story 1-10-dokumentation-readme (Status: drafted)**

Die vorherige Story wurde noch nicht implementiert. Daher gibt es keine konkreten Erkenntnisse aus der Implementation zu übernehmen. Diese Story (2.1) ist die erste Story in Epic 2 und baut auf der Epic 1 Foundation auf.

**Erwartete Foundation aus Epic 1:**
- ✅ Monorepo mit pnpm Workspaces ist initialisiert
- ✅ `packages/shared-types` Package existiert mit TypeScript-Setup
- ✅ Build-Pipeline (pnpm build) funktioniert
- ✅ Linting und Type-Checking sind konfiguriert

**Hinweise für diese Story:**
- Kein Code aus vorherigen Stories zu wiederverwenden (erste Daten-Story)
- Nutze Epic 1 Foundation für TypeScript-Config und Build-Setup
- Stelle sicher, dass shared-types Package exportiert werden kann

### References

**Primäre Quellen:**
- [Tech Spec Epic 2: Lines 217-316](../tech-spec-epic-2.md#data-models-and-contracts) - JSON Resume Schema Definitionen
- [Tech Spec Epic 2: Lines 21-71](../tech-spec-epic-2.md#objectives-and-scope) - Epic 2 Objectives und Scope
- [Architecture: Lines 346-459](../architecture.md#3-json-resume-schema-as-single-source-of-truth) - Pattern 3: JSON Resume als Single Source of Truth
- [PRD: Lines 603-629](../PRD.md#fr-6-cv-daten-management) - FR-6: CV-Daten-Management
- [Epics: Lines 288-310](../epics.md#story-21-json-resume-schema-mit-zod-in-shared-types-package) - Story 2.1 Details

**Externe Referenzen:**
- JSON Resume Schema Standard: https://jsonresume.org/schema
- Zod Documentation: https://zod.dev
- TypeScript Type Inference: https://www.typescriptlang.org/docs/handbook/type-inference.html

**Traceability:**
- **PRD Requirement FR-6.1:** CV-Daten basieren auf JSON Resume Schema
- **Architecture Pattern 3:** JSON Resume Schema as Single Source of Truth
- **Epic 2 Objective:** JSON Resume Schema-Integration

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Agent model name and version will be added during implementation -->

### Debug Log References

<!-- Links to debug logs will be added during implementation -->

### Completion Notes List

<!-- Completion notes will be added by Dev Agent after implementation -->

### File List

<!-- Created/Modified/Deleted files will be tracked here by Dev Agent -->
