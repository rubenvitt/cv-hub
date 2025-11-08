# Story 4.9: Frontend-Hooks useInviteValidation und usePrivateCV

Status: drafted

## Story

Als Frontend-Entwickler,
möchte ich TanStack Query Hooks für Invite-Validierung und CV-Daten,
damit API-Calls konsistent gecacht und verwaltet werden.

## Acceptance Criteria

1. Hook `useInviteValidation(token: string)` existiert:
   - Fetcht `GET /api/invite/:token`
   - Returns: `{ isValid, personalizedMessage, reason, isLoading, error }`
   - Cache-Strategie: staleTime 5min, gcTime 10min (wie Epic 3)
2. Hook `usePrivateCV(token: string)` existiert:
   - Fetcht `GET /api/cv/private/:token`
   - Returns: `{ cv: PrivateCV, isLoading, error }`
   - Cache-Strategie: staleTime 5min, gcTime 10min
   - Error-Handling: 403 Forbidden → `error.status = 403`
3. Type-Safety: Response-Types via Zod-Schemas validiert
4. Prefetching im SSR-Loader funktioniert (Hydration ohne Refetch)
5. Unit-Tests (Mock): Hooks returnen korrektes Datenformat

## Tasks / Subtasks

- [ ] Hook useInviteValidation implementieren (AC: #1, #3)
  - [ ] TanStack Query Hook erstellen in `apps/frontend/src/lib/hooks/useInviteValidation.ts`
  - [ ] API-Call zu `GET /api/invite/:token` implementieren
  - [ ] Return-Type definieren: `{ isValid, personalizedMessage, reason, isLoading, error }`
  - [ ] Cache-Strategie konfigurieren: `staleTime: 5 * 60 * 1000` (5min), `gcTime: 10 * 60 * 1000` (10min)
  - [ ] Zod-Schema für Response-Validierung integrieren (`InviteValidationResponseSchema`)

- [ ] Hook usePrivateCV implementieren (AC: #2, #3)
  - [ ] TanStack Query Hook erstellen in `apps/frontend/src/lib/hooks/usePrivateCV.ts`
  - [ ] API-Call zu `GET /api/cv/private/:token` implementieren
  - [ ] Return-Type definieren: `{ cv: PrivateCV, isLoading, error }`
  - [ ] Cache-Strategie konfigurieren: `staleTime: 5 * 60 * 1000`, `gcTime: 10 * 60 * 1000`
  - [ ] Error-Handling für 403 Forbidden implementieren: `error.status = 403`
  - [ ] Zod-Schema für PrivateCV-Validierung integrieren

- [ ] SSR Prefetching Support (AC: #4)
  - [ ] QueryClient-Konfiguration für SSR vorbereiten
  - [ ] Prefetch-Helper für SSR-Loader erstellen
  - [ ] Hydration ohne Refetch sicherstellen (dehydrate/hydrate)
  - [ ] Dokumentation: Wie Hooks in SSR-Loadern genutzt werden

- [ ] Unit-Tests schreiben (AC: #5)
  - [ ] Test-Setup mit Vitest + React Testing Library
  - [ ] Mock-API-Responses erstellen
  - [ ] Test useInviteValidation: Gültiger Token → isValid=true
  - [ ] Test useInviteValidation: Ungültiger Token → isValid=false, reason gesetzt
  - [ ] Test usePrivateCV: Erfolgreicher Fetch → cv-Objekt korrekt
  - [ ] Test usePrivateCV: 403 Error → error.status = 403
  - [ ] Test Cache-Strategie: Subsequent Calls nutzen Cache

- [ ] Type-Safety und Exports (AC: #3)
  - [ ] TypeScript-Types aus Hooks exportieren
  - [ ] Sicherstellen: Hooks nutzen shared-types (`@cv-hub/shared-types`)
  - [ ] Index-File für Hook-Exports erstellen (`apps/frontend/src/lib/hooks/index.ts`)

## Dev Notes

### Technische Entscheidungen

**TanStack Query für Server-State Management:**
- Gewählt für konsistentes Caching, automatische Refetching-Logik und optimistische Updates
- Cache-Strategie (staleTime 5min, gcTime 10min) aligned mit Epic 3 Public CV Hooks
- SSR-Unterstützung via Prefetching und Hydration verhindert unnötige Client-Side-Fetches

**Type-Safety mit Zod-Schemas:**
- Response-Validierung zur Laufzeit via Zod-Schemas aus `@cv-hub/shared-types`
- `InviteValidationResponseSchema` und `PrivateCV` Schema werden importiert
- Verhindert Runtime-Errors durch ungültige API-Responses

**Error-Handling Pattern:**
- 403 Forbidden (ungültiger Token) wird explizit als `error.status = 403` exposiert
- Komponenten können basierend auf Error-Status unterschiedliche UIs rendern (z.B. ExpiredLinkPage)
- TanStack Query error-Property enthält vollständigen Fetch-Error

**SSR Prefetching:**
- Hooks werden im SSR-Loader via `queryClient.prefetchQuery()` vorgeladen
- Hydration erfolgt automatisch via `<HydrationBoundary>` Component
- Verhindert Flash of Loading State und verbessert Perceived Performance

### Architektur-Alignment

**PRD Requirements:**
- FR-3 (Personalisierte Links): Diese Hooks ermöglichen Validierung und Datenabruf für `/invite/:token` Route
- FR-2 (RESTful API): Hooks konsumieren Backend-Endpoints aus Story 4.5 und 4.7
- UX-Exzellenz: Caching-Strategie sorgt für schnelle, responsive UX ohne redundante API-Calls

**Tech Spec Epic 4:**
- Frontend Hooks (Story 4.9): Direkt adressiert - `useInviteValidation` und `usePrivateCV`
- Cache-Strategie: staleTime 5min, gcTime 10min (wie Public CV aus Epic 3)
- SSR-Loader Integration: Prefetching-Support für hydration-optimierte Ladezeiten

**Architecture Constraints:**
- Frontend Stack: TanStack Query (Latest) für Server-State Management [Source: architecture.md#Frontend Stack]
- Testing: Vitest + React Testing Library für Unit-Tests [Source: architecture.md#Frontend Stack]
- Type-Safety: End-to-End TypeScript mit Zod-Runtime-Validation [Source: architecture.md#Architecture Principles]
- SSR: TanStack Start mit Full-Document SSR [Source: architecture.md#Frontend Stack]

### Project Structure Notes

**Betroffene Files (NEU):**
```
apps/frontend/src/lib/hooks/
├── useInviteValidation.ts      # Hook für Token-Validierung
├── usePrivateCV.ts             # Hook für Private CV Fetch
├── useInviteValidation.test.ts # Unit-Tests
├── usePrivateCV.test.ts        # Unit-Tests
└── index.ts                    # Hook Exports
```

**Dependencies:**
- `@tanstack/react-query` (bereits installiert in Epic 3)
- `@cv-hub/shared-types` (Zod-Schemas aus Story 4.2)
- `zod` (Runtime-Validation)

**API-Integration:**
- Backend-Endpoints:
  - `GET /api/invite/:token` (Story 4.5)
  - `GET /api/cv/private/:token` (Story 4.7)
- Base-URL: Konfiguriert via Environment-Variable oder API-Client aus Epic 3

**Alignment mit Epic 3 Patterns:**
- Epic 3 hat bereits Public CV Hooks mit TanStack Query implementiert
- Cache-Strategie (5min/10min) konsistent mit bestehenden Patterns
- Gleiche Testing-Approach (Vitest + RTL) wie Epic 3

### Testing Strategy

**Unit-Tests (Vitest + React Testing Library):**
1. **useInviteValidation Hook:**
   - Test: Gültiger Token → `isValid=true`, `personalizedMessage` korrekt
   - Test: Ungültiger Token → `isValid=false`, `reason='not_found'`
   - Test: Abgelaufener Token → `isValid=false`, `reason='expired'`
   - Test: isLoading State während Fetch
   - Test: Cache funktioniert (zweiter Call ohne erneuten Fetch)

2. **usePrivateCV Hook:**
   - Test: Erfolgreicher Fetch → `cv` Objekt korrekt strukturiert (Zod-Validation)
   - Test: 403 Forbidden → `error.status = 403`
   - Test: 404 Not Found → Error-Handling korrekt
   - Test: isLoading State während Fetch
   - Test: Cache funktioniert

3. **SSR Prefetching:**
   - Test: `prefetchQuery` lädt Daten vor Hydration
   - Test: Hydration nutzt prefetched Data (kein erneuter Fetch)
   - Test: Hydration Boundary funktioniert

**Mock-Strategie:**
- MSW (Mock Service Worker) für API-Mocking (wenn bereits in Epic 3 Setup)
- Alternativ: `vi.mock()` für fetch/axios Mocks
- Mock-Responses basierend auf Zod-Schemas (Type-Safety in Tests)

**Integration-Tests:**
- E2E-Tests (Story 4.14) werden `/invite/:token` Route mit echten API-Calls testen
- Diese Story fokussiert auf Unit-Tests der Hooks isoliert

**Risks & Mitigations:**
- **RISK:** SSR Hydration Mismatch
  - **Mitigation:** QueryClient dehydrate/hydrate korrekt implementieren, Prefetch-Keys müssen identisch sein
- **RISK:** Cache zu aggressiv (stale Data)
  - **Mitigation:** staleTime 5min ist konservativ, kann später optimiert werden
- **RISK:** 403 Error wird nicht korrekt gefangen
  - **Mitigation:** Explizites Error-Handling in Hook, Tests validieren error.status

### References

- [Source: docs/tech-spec-epic-4.md#Frontend Hooks] - Hook-Spezifikationen, Cache-Strategie
- [Source: docs/epics.md#Epic 4 - Story 4.9] - Story Definition und Acceptance Criteria
- [Source: docs/architecture.md#Frontend Stack] - TanStack Query, Vitest + RTL, SSR mit TanStack Start
- [Source: docs/architecture.md#Privacy-First Data Filtering] - PrivateCV vs PublicCV Type-Unterschiede
- [Source: docs/PRD.md#Personalisierte Links-System] - Business-Kontext für Token-Validierung

### Learnings from Previous Story

**From Previous Stories (Epic 4):**
- Previous story (4-8) ist noch nicht implementiert (Status: drafted, Datei existiert nicht)
- Keine direkte Vorgänger-Story mit Code-Ergebnissen verfügbar

**Context from Epic 4 Dependencies:**
- Story 4.2 (Invite Zod-Schemas) liefert `InviteValidationResponseSchema` und `InviteResponse` Types
- Story 4.5 (GET /api/invite/:token Endpoint) ist Backend-Dependency für `useInviteValidation`
- Story 4.7 (GET /api/cv/private/:token Endpoint) ist Backend-Dependency für `usePrivateCV`
- Epic 3 Stories liefern Pattern-Referenz für TanStack Query Hooks (Public CV Hooks bereits implementiert)

**Wichtig:**
- Diese Story kann parallel zu Backend-Stories entwickelt werden (Mocking in Tests)
- Allerdings müssen Stories 4.5 und 4.7 completed sein, bevor E2E-Tests (Story 4.14) ausgeführt werden können
- Integration-Testing erfordert funktionierende Backend-Endpoints

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
