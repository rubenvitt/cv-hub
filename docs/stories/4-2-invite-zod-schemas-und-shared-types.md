# Story 4.2: Invite Zod-Schemas und Shared Types

Status: drafted

## Story

Als Full-Stack-Entwickler,
möchte ich typsichere DTOs für Link-Erstellung und -Validierung,
damit Frontend und Backend konsistente Datenstrukturen verwenden.

## Acceptance Criteria

1. `packages/shared-types/src/invite.schema.ts` existiert
2. Zod-Schemas definiert:
   - `CreateInviteDtoSchema` (personalizedMessage: optional max 5000 chars, expiresAt: optional future date)
   - `InviteResponseSchema` (vollständiges Invite-Objekt)
   - `InviteValidationResponseSchema` (isValid, personalizedMessage, reason)
3. TypeScript-Types werden exportiert (`CreateInviteDto`, `InviteResponse`, `InviteValidationResponse`)
4. Backend kann Schemas importieren und nutzen (`@cv-hub/shared-types`)
5. Frontend kann Schemas importieren und nutzen
6. Unit-Tests: Zod-Validierung schlägt fehl bei ungültigen Inputs (z.B. expiresAt in Vergangenheit)

## Tasks / Subtasks

- [ ] Task 1: Zod-Schemas für Invite-DTOs erstellen (AC: #2)
  - [ ] 1.1: Datei `packages/shared-types/src/invite.schema.ts` anlegen
  - [ ] 1.2: `CreateInviteDtoSchema` definieren mit Validierungsregeln:
    * `personalizedMessage`: optional, string, maxLength 5000 chars
    * `expiresAt`: optional, date, custom refinement für Zukunfts-Validierung
  - [ ] 1.3: `InviteResponseSchema` definieren (id, token, personalizedMessage, expiresAt, isActive, visitCount, lastVisitAt, createdAt, updatedAt)
  - [ ] 1.4: `InviteValidationResponseSchema` definieren (isValid: boolean, personalizedMessage: nullable, reason: enum['valid', 'not_found', 'inactive', 'expired'])

- [ ] Task 2: TypeScript-Types exportieren (AC: #3)
  - [ ] 2.1: Types inferieren: `type CreateInviteDto = z.infer<typeof CreateInviteDtoSchema>`
  - [ ] 2.2: Types inferieren: `type InviteResponse = z.infer<typeof InviteResponseSchema>`
  - [ ] 2.3: Types inferieren: `type InviteValidationResponse = z.infer<typeof InviteValidationResponseSchema>`
  - [ ] 2.4: Alle Schemas und Types in `packages/shared-types/src/index.ts` exportieren

- [ ] Task 3: Cross-Workspace-Integration sicherstellen (AC: #4, #5)
  - [ ] 3.1: Im Backend: `@cv-hub/shared-types` importieren und Schema in Dummy-Test verwenden
  - [ ] 3.2: Im Frontend: `@cv-hub/shared-types` importieren (Vorbereitung für Epic 4 Stories)
  - [ ] 3.3: Shared-types Package bauen: `pnpm --filter @cv-hub/shared-types build`
  - [ ] 3.4: Workspace-Dependencies überprüfen: Backend und Frontend haben korrekte References

- [ ] Task 4: Unit-Tests für Schema-Validierung (AC: #6)
  - [ ] 4.1: Test-Suite `packages/shared-types/src/invite.schema.spec.ts` erstellen
  - [ ] 4.2: Test: CreateInviteDto - Valid Input (beide optional fields leer) → parsed
  - [ ] 4.3: Test: CreateInviteDto - personalizedMessage > 5000 chars → ZodError
  - [ ] 4.4: Test: CreateInviteDto - expiresAt in Vergangenheit → ZodError
  - [ ] 4.5: Test: CreateInviteDto - expiresAt in Zukunft (valid) → parsed
  - [ ] 4.6: Test: InviteValidationResponse - reason muss enum value sein → validation

## Dev Notes

### Architektur-Kontext

**Epic 4 Kontext:**
Diese Story etabliert die Typ-Sicherheits-Grundlage für das gesamte Invite-System. Alle nachfolgenden Stories (4.3-4.13) verwenden diese Schemas. Die Zod-Schemas fungieren als "Single Source of Truth" für Datenstrukturen zwischen Backend-API, Frontend-UI und Datenbank-Entities.

**Zod als Validation-Layer:**
- Zod ermöglicht Runtime-Validierung (API-Input) UND Compile-Time-Type-Checking (TypeScript)
- Vorteil gegenüber DTO-Classes (class-validator): Funktionale Schemas, bessere Tree-Shaking, kleinere Bundle-Size
- Custom-Refinements für Business-Logik: z.B. `expiresAt` muss in Zukunft liegen

**Integration mit InviteEntity (Story 4.1):**
Die hier definierten Schemas müssen mit `InviteEntity` (Story 4.1) aligned sein. `InviteResponseSchema` spiegelt die Entity-Felder 1:1, während `CreateInviteDtoSchema` nur die User-Inputs repräsentiert (kein `id`, `visitCount`, etc.).

**Shared-Types Package Rolle:**
Das `@cv-hub/shared-types` Package wurde in Story 1.6 etabliert und bereits für CV-Schemas (Story 2.1) genutzt. Epic 4 erweitert es um Invite-spezifische Types. Das Package wird von beiden Apps (Backend + Frontend) als Workspace-Dependency referenziert.

### Project Structure Notes

**Alignment mit Projekt-Struktur (aus Epic 1-3):**

```
packages/shared-types/
├── src/
│   ├── cv-schema.ts          # Epic 2 (bestehend)
│   ├── invite.schema.ts      # Diese Story (NEU)
│   ├── index.ts              # Export-Barrel
│   └── *.spec.ts             # Unit-Tests
├── package.json              # Dependencies: zod
└── tsconfig.json
```

**Workspace-Dependencies:**
- Backend: `"@cv-hub/shared-types": "workspace:*"` in `apps/backend/package.json`
- Frontend: `"@cv-hub/shared-types": "workspace:*"` in `apps/frontend/package.json`
- Build-Order: `pnpm build` im Root baut shared-types zuerst (via pnpm Dependency-Resolution)

**Hinweis für zukünftige Stories:**
- Story 4.3 (InviteService) nutzt `CreateInviteDto` als Input-Type
- Story 4.4 (POST /admin/invite) validiert Request-Body mit `CreateInviteDtoSchema.parse()`
- Story 4.8+ (Frontend) nutzt Types für TanStack Query Hooks

### Testing Strategy

**Unit-Tests (Vitest für shared-types Package):**
- **Schema-Validierung:** Valid Inputs → parsed, Invalid Inputs → ZodError mit aussagekräftiger Message
- **Edge-Cases:** Leere Strings, null vs. undefined, Grenzwerte (5000 chars genau, 5001 chars)
- **Custom-Refinements:** expiresAt Future-Validation (Date-Handling mit Timezones)

**Integration-Tests (später in Epic 4):**
- Story 4.4: Backend API nutzt CreateInviteDtoSchema für Request-Validation
- Story 4.8+: Frontend Form nutzt Schema für Client-Side-Validation (react-hook-form + zod-resolver)

**Test-Database-Setup:**
Keine DB nötig für diese Story - reine Schema-Unit-Tests

### Learnings from Previous Story

**From Story 4-1-cuid2-token-generierung-und-link-entity (Status: drafted)**

Previous story not yet implemented - no predecessor learnings available yet.

Note: Story 4.1 definiert die `InviteEntity` (Database-Layer), diese Story definiert die DTOs (API-Layer). Beide Stories können parallel implementiert werden, aber Story 4.2 sollte erst als "done" markiert werden, wenn Story 4.1 abgeschlossen ist (zur Sicherstellung der Alignment zwischen Entity und Schemas).

### References

**Primäre Quellen:**
- [Source: docs/epics.md#Epic-4-Story-4.2 - Story Requirements und Acceptance Criteria]
- [Source: docs/tech-spec-epic-4.md#Data-Models-and-Contracts - DTO-Definitionen]
- [Source: docs/PRD.md#System-Overview - End-to-End Type Safety Prinzip]
- [Source: docs/architecture.md - Type Safety als Architektur-Prinzip]

**Technische Referenzen:**
- Zod Documentation: https://zod.dev
- JSON Resume Schema (Epic 2 Precedent): packages/shared-types/src/cv-schema.ts
- pnpm Workspaces: https://pnpm.io/workspaces
- TypeScript Type Inference: https://www.typescriptlang.org/docs/handbook/type-inference.html

**Verwandte Stories:**
- Story 1.6 (Shared Types Package Creation) - Foundation
- Story 2.1 (JSON Resume Schema) - Vorheriges Beispiel für Zod in shared-types
- Story 4.1 (InviteEntity) - Datenmodell, mit dem diese DTOs aligned sein müssen
- Story 4.3 (InviteService) - Erster Consumer dieser DTOs

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-07: Story created (drafted) - Ready for implementation
