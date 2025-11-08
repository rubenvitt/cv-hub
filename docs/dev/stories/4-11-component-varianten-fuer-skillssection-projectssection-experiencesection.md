# Story 4.11: Component-Varianten für SkillsSection, ProjectsSection, ExperienceSection

Status: drafted

## Story

Als CV Owner,
möchte ich dass meine CV-Components automatisch zwischen öffentlicher und personalisierter Ansicht wechseln können,
damit ich granular kontrolliere, welche Informationen für verschiedene Audiences sichtbar sind.

## Requirements Context Summary

**Epic Context:** Epic 4 implementiert das Privacy-First Sharing System mit Token-basierten personalisierten Links. Story 4.11 fokussiert sich auf die Frontend-Komponenten, die variant-aware werden müssen, um sowohl öffentliche als auch authentifizierte Ansichten zu unterstützen.

**Tech-Spec Reference:** Story 4.11 erweitert bestehende Epic 3 Components (`SkillsSection`, `ProjectsSection`, `ExperienceSection`) mit einem `variant` prop, das zwischen `'public'` und `'authenticated'` Rendering-Modi unterscheidet.

**Kern-Anforderung:** Bestehende Components müssen rückwärtskompatibel bleiben (für öffentliche Route `/`) UND gleichzeitig personalisierte Ansichten unterstützen (für `/invite/:token` Route). Die Implementation nutzt Conditional Rendering basierend auf dem `variant` prop.

**Privacy-First Principle:** Public variant zeigt NIEMALS sensitive Daten (Company-Namen, Metriken, Skill-Levels). Authenticated variant zeigt vollständige Informationen aus `PrivateCV`.

[Source: docs/tech-spec-epic-4.md#Overview]
[Source: docs/architecture.md#Privacy-First Data Filtering]

## Structure Alignment Summary

**Betroffene Komponenten (aus Epic 3):**
- `apps/frontend/src/components/cv/SkillsSection.tsx` - Wird erweitert mit `variant` prop
- `apps/frontend/src/components/cv/ProjectsSection.tsx` - Wird erweitert mit `variant` prop
- `apps/frontend/src/components/cv/ExperienceSection.tsx` - Wird erweitert mit `variant` prop
- `apps/frontend/src/components/cv/ProjectCard.tsx` - Neues Sub-Component für Projects (optional, falls nicht bereits vorhanden)

**Monorepo-Struktur:** Alle Änderungen erfolgen im Frontend-Workspace (`apps/frontend`). Keine Backend-Änderungen erforderlich.

**Type Definitions:** `variant: 'public' | 'authenticated'` wird als Prop-Type zu bestehenden Component-Interfaces hinzugefügt.

**Rückwärtskompatibilität:** Bestehende Public Route (`/`) verwendet `variant="public"`. Neue Personalized Route (`/invite/:token`) verwendet `variant="authenticated"`. Komponenten bleiben für Epic 3 Public Route funktional.

**Integration Points:**
- Epic 3 Public Route: `<SkillsSection variant="public" />`
- Epic 4 Personalized Route: `<SkillsSection variant="authenticated" />`

**Data Sources:**
- Public variant: Empfängt Daten von `PublicCV` (gefiltert via Backend)
- Authenticated variant: Empfängt Daten von `PrivateCV` (vollständig)

**Keine Konflikte erwartet:** Story modifiziert nur Component Props und Rendering-Logik. Keine Architektur- oder Datenmodell-Änderungen.

[Source: docs/architecture.md#Monorepo Structure]
[Source: docs/tech-spec-epic-4.md#Component Extension]

## Acceptance Criteria

1. **Component Interfaces Extended** (AC-4.16)
   - `SkillsSection`, `ProjectsSection`, `ExperienceSection` unterstützen `variant` prop
   - Prop-Type: `variant: 'public' | 'authenticated'`
   - TypeScript-Inferenz funktioniert korrekt

2. **SkillsSection Variant Behavior**
   - `variant="public"`: Zeigt nur Skill-Namen (keine Level-Indicators)
   - `variant="authenticated"`: Zeigt Skill-Namen + Level-Indicators (Beginner/Advanced/Expert)
   - Conditional Rendering mit `variant === 'authenticated'` Check

3. **ProjectsSection Variant Behavior** (AC-4.17)
   - `variant="public"`: Zeigt Projekt-Beschreibung (KEINE Company-Namen, KEINE Metriken)
   - `variant="authenticated"`: Zeigt echte Company-Namen (`project.entity`) + Business-Metriken (`project.metrics`)
   - Metriken als `Badge` Components (shadcn/ui) mit `variant="secondary"`
   - Company mit `Building` Icon (lucide-react)

4. **ExperienceSection Variant Behavior**
   - `variant="public"`: Zeigt "Confidential" anstelle echter Company-Namen
   - `variant="authenticated"`: Zeigt echte Company-Namen in Timeline
   - Conditional Rendering basierend auf `variant` prop

5. **Rückwärtskompatibilität**
   - Bestehende Public Route (`/`) funktioniert weiterhin mit `variant="public"`
   - Keine Breaking Changes für Epic 3 Components

6. **Type Safety**
   - Alle Props typisiert mit TypeScript
   - Zod-Schemas für `PublicCV` und `PrivateCV` korrekt verwendet
   - Keine `any` Types in Component Props

7. **Testing**
   - Unit-Tests für jeden Component mit beiden Variants
   - Test: `variant="public"` zeigt KEINE sensitiven Daten
   - Test: `variant="authenticated"` zeigt vollständige Daten
   - Test: Type-Checks für Props funktionieren

[Source: docs/tech-spec-epic-4.md#Acceptance Criteria AC-4.16, AC-4.17]

## Tasks / Subtasks

- [ ] **Task 1: TypeScript Interfaces erweitern** (AC: 1)
  - [ ] 1.1: `SkillsSectionProps` Interface mit `variant` prop erweitern
  - [ ] 1.2: `ProjectsSectionProps` Interface mit `variant` prop erweitern
  - [ ] 1.3: `ExperienceSectionProps` Interface mit `variant` prop erweitern
  - [ ] 1.4: Optional: `ProjectCardProps` Interface erstellen (falls nicht vorhanden)

- [ ] **Task 2: SkillsSection Conditional Rendering** (AC: 2)
  - [ ] 2.1: `variant` prop zu Component hinzufügen
  - [ ] 2.2: Conditional Rendering: Level-Indicators nur bei `variant="authenticated"`
  - [ ] 2.3: Public variant zeigt nur Skill-Namen

- [ ] **Task 3: ProjectsSection Conditional Rendering** (AC: 3)
  - [ ] 3.1: `variant` prop zu Component hinzufügen
  - [ ] 3.2: `ProjectCard` Sub-Component mit `variant` prop (falls nicht vorhanden, erstellen)
  - [ ] 3.3: Conditional: Company-Name (`project.entity`) nur bei `variant="authenticated"`
  - [ ] 3.4: Conditional: Metriken (`project.metrics`) nur bei `variant="authenticated"`
  - [ ] 3.5: Company-Name mit `Building` Icon (lucide-react) anzeigen
  - [ ] 3.6: Metriken als `Badge` Components (shadcn/ui, `variant="secondary"`) anzeigen

- [ ] **Task 4: ExperienceSection Conditional Rendering** (AC: 4)
  - [ ] 4.1: `variant` prop zu Component hinzufügen
  - [ ] 4.2: Conditional: "Confidential" bei `variant="public"`
  - [ ] 4.3: Conditional: Echte Company-Namen bei `variant="authenticated"`

- [ ] **Task 5: Route Integration** (AC: 5)
  - [ ] 5.1: Public Route (`/`): Components mit `variant="public"` verwenden
  - [ ] 5.2: Personalized Route (`/invite/:token`): Components mit `variant="authenticated"` verwenden
  - [ ] 5.3: Rückwärtskompatibilität verifizieren (Public Route funktioniert)

- [ ] **Task 6: Testing** (AC: 7)
  - [ ] 6.1: Unit-Test: `SkillsSection` mit `variant="public"` (keine Levels)
  - [ ] 6.2: Unit-Test: `SkillsSection` mit `variant="authenticated"` (mit Levels)
  - [ ] 6.3: Unit-Test: `ProjectsSection` mit `variant="public"` (keine Company/Metriken)
  - [ ] 6.4: Unit-Test: `ProjectsSection` mit `variant="authenticated"` (mit Company/Metriken)
  - [ ] 6.5: Unit-Test: `ExperienceSection` mit beiden Variants
  - [ ] 6.6: Type-Check: TypeScript Build ohne Fehler

## Dev Notes

### Architecture Patterns & Constraints

**Privacy-First Pattern:** Diese Story implementiert das zentrale Privacy-First Pattern von Epic 4. Server-seitiges Filtering (via `CVService.getCV(context)`) stellt sicher, dass Public Clients NIEMALS sensitive Daten empfangen. Frontend-Components agieren als zusätzliche Defense-in-Depth-Schicht via Conditional Rendering.

**Conditional Rendering Strategy:**
```typescript
{variant === 'authenticated' && sensitiveData && (
  <div>Sensitive Content</div>
)}
```

**Type Safety über Monorepo-Boundaries:**
- Shared Types aus `packages/shared-types` für `PublicCV` und `PrivateCV`
- Zod-Schemas validieren Daten an API-Grenzen
- TypeScript Strict Mode verhindert `any` Prop-Types

**Component Reusability:**
- Epic 3 Public Route: `<Component variant="public" data={publicCV.field} />`
- Epic 4 Personalized Route: `<Component variant="authenticated" data={privateCV.field} />`
- Keine Code-Duplikation, eine Komponente für beide Contexts

### Testing Standards

**Unit Testing (Vitest + React Testing Library):**
- Test beide Variants separat (public/authenticated)
- Snapshot-Tests für UI-Regression
- Accessibility-Tests (WCAG AA compliance via Radix UI)

**Testing Strategy:**
```typescript
describe('SkillsSection', () => {
  it('should hide skill levels in public variant', () => {
    render(<SkillsSection skills={mockSkills} variant="public" />);
    expect(screen.queryByText(/Expert|Advanced/)).not.toBeInTheDocument();
  });

  it('should show skill levels in authenticated variant', () => {
    render(<SkillsSection skills={mockSkills} variant="authenticated" />);
    expect(screen.getByText(/Expert/)).toBeInTheDocument();
  });
});
```

**Integration Testing:** Epic 4 E2E-Tests (Story 4.14) validieren vollständigen Flow mit echten API-Calls.

### Component Tree & Dependencies

**Bestehende Epic 3 Components (zu modifizieren):**
```
apps/frontend/src/components/cv/
├── SkillsSection.tsx        # Epic 3 → Epic 4 Migration
├── ProjectsSection.tsx      # Epic 3 → Epic 4 Migration
├── ExperienceSection.tsx    # Epic 3 → Epic 4 Migration
└── ProjectCard.tsx          # Falls vorhanden, ebenfalls migrieren
```

**Neue Props:**
```typescript
interface BaseSectionProps {
  variant: 'public' | 'authenticated'; // NEU
}
```

**Dependencies:**
- `lucide-react` (Building Icon) - Bereits in Epic 3 vorhanden
- `shadcn/ui Badge` Component - Bereits in Epic 3 vorhanden
- `@radix-ui/react-*` (via shadcn/ui) - Accessibility built-in

### Prerequisites & Story Dependencies

**Muss abgeschlossen sein:**
- Epic 3 (Story 3.1-3.12): Alle Components existieren, shadcn/ui ist eingerichtet
- Story 4.6: `CVService.getCV('authenticated')` Backend-Logik implementiert
- Story 4.9: Frontend Hooks (`useInviteValidation`, `usePrivateCV`) für Daten-Fetching

**Kann parallel laufen:**
- Story 4.10: PersonalizedMessageBanner (unabhängige Component)
- Story 4.12: ContactSection (neue Component, kein Konflikt)

### Project Structure Notes

**Monorepo-Kontext:**
- Workspace: `apps/frontend` (TanStack Start)
- Shared Types: `packages/shared-types` (Zod Schemas)
- Testing: `apps/frontend/src/components/cv/*.test.tsx`

**File Changes Expected:**
- **MODIFIED**: 3-4 Dateien (`SkillsSection.tsx`, `ProjectsSection.tsx`, `ExperienceSection.tsx`, optional `ProjectCard.tsx`)
- **CREATED**: 0 neue Dateien (nur Modifikationen bestehender Components)
- **TEST FILES**: 3-4 neue/erweiterte Test-Dateien (`*.test.tsx`)

**Naming Convention:**
- PascalCase für Components: `SkillsSection`, `ProjectCard`
- camelCase für Props: `variant`, `isPrivate`
- Kebab-case für Dateinamen: `skills-section.test.tsx`

### References

**Architecture:**
- [Source: docs/architecture.md#Privacy-First Data Filtering]
- [Source: docs/architecture.md#Frontend Stack]
- [Source: docs/architecture.md#Monorepo Structure]

**Tech-Spec:**
- [Source: docs/tech-spec-epic-4.md#Overview]
- [Source: docs/tech-spec-epic-4.md#Component Extension]
- [Source: docs/tech-spec-epic-4.md#Acceptance Criteria AC-4.16, AC-4.17]

**Epic Breakdown:**
- [Source: docs/epics.md#Epic 4 - Privacy-First Sharing System]

**Related Stories:**
- Story 4.6: CVService authenticated context
- Story 4.9: Frontend Hooks (usePrivateCV)
- Story 4.10: PersonalizedMessageBanner
- Story 4.14: E2E Tests & DSGVO Compliance

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

**2025-11-08 - Story Created**
- Initial story draft created by Scrum Master (Bob)
- Status: drafted (from backlog)
- Requirements extracted from tech-spec-epic-4.md
- Acceptance Criteria mapped from AC-4.16, AC-4.17
- Tasks structured for iterative implementation
- Story ready for *story-context workflow (recommended before dev)

