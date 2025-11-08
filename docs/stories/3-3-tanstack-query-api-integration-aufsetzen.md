# Story 3.3: TanStack Query API-Integration aufsetzen

Status: drafted

## Story

Als Entwickler,
möchte ich TanStack Query für API-Calls an `/api/cv/public` konfigurieren,
damit CV-Daten mit Caching und Error-Handling geladen werden.

## Acceptance Criteria

1. ✅ TanStack Query Provider ist in App-Root integriert (`QueryClientProvider`)
2. ✅ API-Client-Modul (`lib/api.ts`) erstellt mit `fetchPublicCV()` Function
3. ✅ Custom Hook `usePublicCV()` funktioniert mit Caching (staleTime: 5min, gcTime: 10min)
4. ✅ Zod-Schema-Validation validiert API-Response zur Runtime (`PublicCVSchema.safeParse`)
5. ✅ Error-Handling mit Retry-Logic (2 Retries, exponential backoff)
6. ✅ Loading-States und Error-States werden korrekt zurückgegeben (`isLoading`, `isError`, `error`)
7. ✅ TypeScript-Types aus `@cv-hub/shared-types` werden genutzt (`PublicCV`, `PublicCVSchema`)

## Tasks / Subtasks

- [ ] **Task 1:** TanStack Query Installation und Setup (AC: #1)
  - [ ] Subtask 1.1: `pnpm add @tanstack/react-query --filter frontend`
  - [ ] Subtask 1.2: `QueryClient` instanziieren in `app/root.tsx`
  - [ ] Subtask 1.3: `QueryClientProvider` in Root-Component wrappen
  - [ ] Subtask 1.4: DevTools optional hinzufügen (`@tanstack/react-query-devtools`)

- [ ] **Task 2:** API-Client-Modul erstellen (AC: #2, #4, #7)
  - [ ] Subtask 2.1: `apps/frontend/lib/api.ts` erstellen
  - [ ] Subtask 2.2: `API_BASE_URL` aus Environment-Variable (`import.meta.env.VITE_API_URL`)
  - [ ] Subtask 2.3: `fetchPublicCV()` async function implementieren mit `fetch()`
  - [ ] Subtask 2.4: Response-Validation mit `PublicCVSchema.safeParse()` (Zod)
  - [ ] Subtask 2.5: Error-Handling für HTTP-Errors (Status 4xx, 5xx)
  - [ ] Subtask 2.6: TypeScript Return-Type: `Promise<PublicCV>`

- [ ] **Task 3:** usePublicCV Custom Hook erstellen (AC: #3, #5, #6)
  - [ ] Subtask 3.1: `cvQueryKeys` Object definieren für Query-Key-Patterns
  - [ ] Subtask 3.2: `usePublicCV()` Hook mit `useQuery` implementieren
  - [ ] Subtask 3.3: Cache-Config: `staleTime: 5 * 60 * 1000` (5min), `gcTime: 10 * 60 * 1000` (10min)
  - [ ] Subtask 3.4: Retry-Config: `retry: 2`, `retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000)`
  - [ ] Subtask 3.5: Return-Type: `{ data, isLoading, isError, error }` (TanStack Query Standard)

- [ ] **Task 4:** Integration-Test und Type-Safety prüfen (AC: #7)
  - [ ] Subtask 4.1: Dummy-Component erstellen die `usePublicCV()` aufruft
  - [ ] Subtask 4.2: Loading-State testen (Spinner/Skeleton)
  - [ ] Subtask 4.3: Success-State testen (CV-Daten gerendert)
  - [ ] Subtask 4.4: Error-State testen (Mock API Error, Error-Message anzeigen)
  - [ ] Subtask 4.5: TypeScript Compilation prüfen (`pnpm --filter frontend tsc --noEmit`)

- [ ] **Task 5:** Environment-Variable konfigurieren (AC: #2)
  - [ ] Subtask 5.1: `.env` erstellen in `apps/frontend` mit `VITE_API_URL=http://localhost:3000`
  - [ ] Subtask 5.2: `.env.example` dokumentieren für andere Entwickler
  - [ ] Subtask 5.3: Production-Config: `VITE_API_URL` in Docker Compose / Deployment

## Dev Notes

### Technische Hinweise

**TanStack Query v5 (Latest):**
- **QueryClient Config:**
  - `defaultOptions`: Global defaults für alle Queries
  - `staleTime`: Wie lange Daten als "fresh" gelten (5min für CV-Daten)
  - `gcTime`: Wie lange unused Daten im Cache bleiben (10min)
  - `retry`: Anzahl automatischer Retries bei Fehler (2)
  - `retryDelay`: Exponential Backoff (1s, 2s, 5s max)

- **Query Keys Pattern:**
  ```typescript
  export const cvQueryKeys = {
    public: ['cv', 'public'] as const,
    authenticated: (token: string) => ['cv', 'authenticated', token] as const,
  };
  ```
  - Array-basiert für Query-Invalidation
  - `as const` für Type-Safety
  - Hierarchisch aufgebaut (base → specifics)

- **Error-Handling:**
  - `throwOnError: false` - Hook wirft NICHT, gibt `isError` zurück
  - `error` Property enthält Error-Object mit Message
  - Frontend kann Custom Error-Messages anzeigen

**Zod Runtime-Validation (Critical!):**
- **Warum Runtime-Validation?**
  - TypeScript validiert nur zur Compile-Time
  - API-Response kann sich ändern (Backend-Deployment)
  - Malformed Data würde zu Runtime-Crashes führen
  - Runtime-Validation fängt Schema-Mismatches früh ab

- **safeParse vs parse:**
  - `safeParse()` → Gibt `{ success: boolean, data?, error? }` zurück
  - `parse()` → Wirft Error bei Validation-Failure (nicht empfohlen für API-Responses)
  - Empfehlung: `safeParse()` nutzen, Error-Handling explizit

- **Validation Error-Handling:**
  ```typescript
  const validated = PublicCVSchema.safeParse(data);
  if (!validated.success) {
    console.error('CV validation failed:', validated.error);
    throw new Error('Invalid CV data received from server');
  }
  return validated.data; // Type: PublicCV
  ```

**API_BASE_URL Configuration:**
- **Development:** `http://localhost:3000` (Backend-Port)
- **Production:** `https://cv-hub.com` (eigene Domain)
- **Environment-Variable:** `import.meta.env.VITE_API_URL`
- **Fallback:** Hardcoded Default für lokale Entwicklung

**Shared Types aus @cv-hub/shared-types:**
- **Import Path:** `import { PublicCVSchema, type PublicCV } from '@cv-hub/shared-types';`
- **Monorepo Workspace Protocol:** `"@cv-hub/shared-types": "workspace:*"`
- **Type-Safety:** `PublicCV` Type wird aus Zod-Schema inferiert
- **Single Source of Truth:** Backend und Frontend nutzen identische Schemas

### Project Structure Notes

**Erwartete Dateistruktur nach Completion:**

```
apps/frontend/
├── app/
│   ├── root.tsx                   # QueryClientProvider hier integriert
│   └── routes/
│       └── index.tsx              # Später: usePublicCV() nutzen
├── lib/
│   ├── api.ts                     # NEU: fetchPublicCV(), usePublicCV()
│   └── utils.ts                   # Existing (shadcn/ui utils)
├── .env                           # NEU: VITE_API_URL
├── .env.example                   # NEU: Dokumentation
├── package.json                   # @tanstack/react-query hinzugefügt
└── tsconfig.json                  # Paths für @cv-hub/shared-types
```

**Integration-Punkt mit @cv-hub/shared-types:**
- Shared Types Package muss existieren (Epic 1 - Story 1.6)
- Falls NICHT vorhanden: Story blockiert, 1.6 zuerst abschließen!
- Import erfolgt über Monorepo-Workspace-Reference

### Learnings from Previous Story

**From Story 3-2-tailwind-css-v4-und-shadcn-ui-integrieren (Status: drafted)**

Previous story not yet implemented - keine Dev-Agent-Learnings verfügbar.

**Expected Prerequisites from Story 3.1 und 3.2:**
- TanStack Start-Projekt initialisiert in `apps/frontend`
- File-based Routing funktioniert (`app/routes/index.tsx`)
- Dev-Server startet auf Port 5173
- TypeScript strict mode konfiguriert
- Tailwind CSS und shadcn/ui sind installiert (für spätere UI-Integration)

**Falls Stories 3.1 oder 3.2 NICHT abgeschlossen sind:**
- Story 3.3 kann technisch implementiert werden (keine direkte Dependency auf UI)
- Aber: Testing erfordert UI-Components (Loading-Skeleton, Error-Message)
- Empfehlung: 3.1 und 3.2 zuerst abschließen für vollständigen Test

### References

**Sources:**
- [Tech-Spec Epic 3: APIs and Interfaces](docs/tech-spec-epic-3.md#apis-and-interfaces)
- [Tech-Spec Epic 3: Services and Modules - API Client (TanStack Query)](docs/tech-spec-epic-3.md#services-and-modules)
- [Epics Epic 3: Story 3.3](docs/epics.md#story-33-tanstack-query-api-integration-aufsetzen)
- [Architecture: Frontend Stack - TanStack Query](docs/architecture.md#frontend-stack)
- [Architecture: Pattern 3 - JSON Resume Schema Integration](docs/architecture.md#3-json-resume-schema-as-single-source-of-truth)

**External Docs:**
- [TanStack Query v5 Docs](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Query - Error Handling](https://tanstack.com/query/latest/docs/react/guides/error-handling)
- [TanStack Query - Query Keys](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Zod Documentation](https://zod.dev/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
