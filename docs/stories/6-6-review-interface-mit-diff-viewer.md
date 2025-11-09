# Story 6.6: Review-Interface mit Diff-Viewer

Status: drafted

## Story

Als Admin,
möchte ich extrahierte CV-Daten im Vergleich zum aktuellen CV sehen,
damit ich Änderungen validieren kann bevor ich sie speichere.

## Acceptance Criteria

1. **AC-3.1:** DiffViewer zeigt Current CV und Extracted CV side-by-side
   - **Given:** Extraction erfolgreich (draft created)
   - **When:** Review-Interface rendered
   - **Then:** Left panel zeigt current CV, Right panel zeigt extracted CV

2. **AC-3.2:** DiffViewer highlighted Added/Removed/Changed fields
   - **Given:** Extracted CV hat neue Skills
   - **When:** DiffViewer rendered
   - **Then:** Neue Skills sind grün markiert (added), entfernte rot, geänderte gelb

3. **AC-3.3:** Validation Errors werden in UI angezeigt
   - **Given:** Extracted CV hat Validation Errors (z.B. invalid date)
   - **When:** Review-Interface rendered
   - **Then:** Fehlerhafte Felder haben roten Border + Error-Tooltip

4. **AC-3.4:** User kann extrahierte Daten inline editieren
   - **Given:** User sieht Validation Error bei work[0].startDate
   - **When:** User klickt auf Feld
   - **Then:** JSONEditor wird geöffnet, User kann Wert ändern

5. **AC-3.5:** User kann editierte Daten re-validieren
   - **Given:** User hat Fehler korrigiert
   - **When:** User klickt "Validate"
   - **Then:** System führt CVSchema.safeParse() erneut aus, zeigt Ergebnis

6. **ProgressSteps zeigt Workflow-Status**
   - **Given:** User durchläuft Extraction Flow
   - **When:** Jeder Schritt abgeschlossen wird
   - **Then:** ProgressSteps visualisiert: Upload → Extracting → Review → Save

7. **Approve & Publish Button disabled bei Validation Errors**
   - **Given:** Extracted CV hat Validation Errors
   - **When:** Review-Interface rendered
   - **Then:** "Approve & Publish" Button ist disabled + Tooltip zeigt Grund

8. **Edit Manually Button öffnet JSONEditor**
   - **Given:** User möchte Fehler korrigieren
   - **When:** User klickt "Edit Manually"
   - **Then:** JSONEditor Modal öffnet sich mit extrahierten Daten

9. **UI Performance Requirements**
   - **Given:** Extracted CV ist 500KB JSON
   - **When:** DiffViewer rendered
   - **Then:** Rendering dauert <1s, UI bleibt responsive

## Tasks / Subtasks

- [ ] Task 1: DiffViewer Component erstellen (AC: 3.1, 3.2)
  - [ ] 1.1: react-diff-viewer Library integrieren (v3.x)
  - [ ] 1.2: DiffViewer.tsx Component erstellen mit Props (currentCV, extractedCV, errors)
  - [ ] 1.3: Side-by-Side Layout implementieren (Left: Current, Right: Extracted)
  - [ ] 1.4: Syntax-Highlighting für JSON konfigurieren
  - [ ] 1.5: Color-Coding implementieren (Grün: added, Rot: removed, Gelb: changed)
  - [ ] 1.6: Component in Storybook dokumentieren (optional)

- [ ] Task 2: Validation Error Highlighting implementieren (AC: 3.3)
  - [ ] 2.1: ErrorPath von Zod in UI-Coordinates mappen (z.B. "work.0.startDate" → DOM element)
  - [ ] 2.2: Fehlerhafte Felder mit rotem Border markieren (CSS)
  - [ ] 2.3: Error-Tooltip Component erstellen (shadcn/ui Tooltip)
  - [ ] 2.4: Error-Messages anzeigen (Zod errorPath + message)
  - [ ] 2.5: Error-Count Badge in Header zeigen ("3 Validation Errors")

- [ ] Task 3: Inline Editing Integration (AC: 3.4, 3.5)
  - [ ] 3.1: "Edit Manually" Button hinzufügen (öffnet JSONEditor)
  - [ ] 3.2: JSONEditor Modal Component erstellen (Placeholder für Story 6.7)
  - [ ] 3.3: Edited Data zurück in DiffViewer State übernehmen
  - [ ] 3.4: "Validate" Button implementieren (CVSchema.safeParse())
  - [ ] 3.5: Re-Validation Feedback anzeigen (Success-Toast oder neue Errors)

- [ ] Task 4: ProgressSteps Component erstellen (AC: 6)
  - [ ] 4.1: ProgressSteps.tsx Component erstellen
  - [ ] 4.2: Steps definieren: Upload → Extracting → Review → Save
  - [ ] 4.3: Current Step Highlighting implementieren
  - [ ] 4.4: Step-Icons hinzufügen (Upload, Spinner, Check, etc.)
  - [ ] 4.5: Mobile-optimierte Darstellung (kompakte Steps)

- [ ] Task 5: Approve & Publish Button mit Validation (AC: 7)
  - [ ] 5.1: Button Component erstellen (shadcn/ui Button)
  - [ ] 5.2: Disabled-State bei Validation Errors
  - [ ] 5.3: Tooltip zeigt "Please fix X validation errors first"
  - [ ] 5.4: onClick Handler ruft publish-draft API auf (Story 6.8)
  - [ ] 5.5: Loading-State während API Call

- [ ] Task 6: Extract Route & State Management (AC: 1-9)
  - [ ] 6.1: /admin/cv/extract Route erstellen (TanStack Router)
  - [ ] 6.2: Route Loader: Lade current CV von Backend
  - [ ] 6.3: State Management für Extraction Flow (TanStack Query)
  - [ ] 6.4: Extracted CV State (von POST /api/admin/cv/extract Response)
  - [ ] 6.5: Integration aller Components in Extract Route

- [ ] Task 7: Performance Optimierung (AC: 9)
  - [ ] 7.1: React.memo für DiffViewer Component
  - [ ] 7.2: Virtualisierung für lange JSON Arrays (react-window optional)
  - [ ] 7.3: Lazy Loading für react-diff-viewer (Code Splitting)
  - [ ] 7.4: Performance-Test: 500KB JSON in <1s

- [ ] Task 8: Unit & Integration Tests
  - [ ] 8.1: DiffViewer Component Tests (Vitest + RTL)
  - [ ] 8.2: ProgressSteps Component Tests
  - [ ] 8.3: Error Highlighting Logic Tests
  - [ ] 8.4: Validation Button Tests (CVSchema.safeParse mock)
  - [ ] 8.5: Integration Test: Full Review Flow (Mock API)

## Dev Notes

### Architecture Constraints

**Component Library:**
- **shadcn/ui** für Buttons, Tooltips, Modals (Radix UI primitives)
- **react-diff-viewer** (v3.x) für Side-by-Side Diff
- Beide sind WCAG AA compliant

**State Management:**
- TanStack Query für API-State (current CV, extracted CV)
- React Context oder useState für UI-State (ProgressSteps current step)
- Keine globale State Library erforderlich (Zustand/Redux overkill)

**Routing:**
- Route: `/admin/cv/extract`
- File-Based: `apps/frontend/src/routes/admin/cv/extract.tsx`
- Loader lädt current CV vor Render (SSR-kompatibel)

**Performance:**
- react-diff-viewer kann bei sehr großen JSONs (>1MB) langsam werden
- Falls Performance-Problem: Virtualisierung mit react-window erwägen
- Code Splitting: react-diff-viewer lazy loaden (nur wenn Review-Step erreicht)

### Project Structure Notes

**Neue Dateien:**
```
apps/frontend/src/
├── routes/admin/cv/
│   └── extract.tsx                    # Main Route
├── components/
│   ├── DiffViewer.tsx                 # Diff Component
│   ├── ProgressSteps.tsx              # Workflow Indicator
│   └── ErrorTooltip.tsx               # Validation Error Display
└── lib/
    └── validation.ts                  # CVSchema.safeParse wrapper
```

**Genutzte bestehende Dateien:**
- `packages/shared-types/src/cv.schema.ts` - CVSchema (Zod)
- `apps/frontend/src/lib/api.ts` - API Client (TanStack Query)

**Architektur-Alignment:**
- Folgt **Pattern 4: KI-Extraction with Review Loop** aus Architecture Doc
- Human-in-the-loop für AI-Quality-Control
- Server-side Validation (Backend), Client-side Re-Validation (Frontend)

### Dependencies

**NPM Packages (zu installieren):**
```json
{
  "react-diff-viewer": "^3.x",  // Side-by-Side Diff Component
}
```

**Shared Dependencies (bereits vorhanden):**
- @tanstack/react-router (Routing)
- @tanstack/react-query (API State)
- zod (CVSchema Validation)
- shadcn/ui (Button, Tooltip, Card)

### Testing Strategy

**Unit Tests (Vitest + React Testing Library):**
- DiffViewer: Teste Highlighting (added/removed/changed)
- ErrorTooltip: Teste Error-Message Display
- ProgressSteps: Teste Step-Transitions
- Validation Logic: Teste CVSchema.safeParse() Integration

**Integration Tests:**
- Full Extraction Flow: Upload → Extract → Review → Edit → Validate
- Mock Backend API (MSW - Mock Service Worker)
- Test Error States (Validation Errors, API Failures)

**Visual Regression Tests (optional):**
- Playwright Screenshots für DiffViewer
- Verify Color-Coding bleibt konsistent

### References

**Tech Spec:**
[Source: docs/tech-spec-epic-6.md#Services-and-Modules]
- DiffViewer Component: react-diff-viewer Library
- ProgressSteps Component: Workflow-Visualisierung (Upload → Extract → Review → Save)
- JSONEditor Component: @monaco-editor/react (Story 6.7 Dependency)

**Epics:**
[Source: docs/epics.md#Story-6.6]
- Acceptance Criteria 1-9 (Side-by-Side, Highlighting, Validation Errors, Inline Editing)

**Architecture:**
[Source: docs/architecture.md#Pattern-4-KI-Extraction-with-Review-Loop]
- Human-in-the-loop for AI-generated data
- Frontend shows Diff view, Validation errors highlighted
- User reviews, edits, approves

**PRD:**
[Source: docs/PRD.md#FR-5-KI-gestützte-CV-Daten-Extraktion]
- Review-Interface: Live-Preview des extrahierten JSONs
- Manuelles Editing vor Speichern
- Diff-View (Vergleich mit bestehendem CV)

### Learnings from Previous Story

Keine - Story 6-5 ist noch im Status "drafted" (noch nicht implementiert).
Dies ist die erste Story in Epic 6, die nach Fertigstellung der ersten 5 Stories entwickelt wird.

**Wichtige Hinweise für diese Story:**
- DiffViewer ist kritisch für UX - Quality über Speed
- Validation Error UX muss klar sein (User muss verstehen, was zu fixen ist)
- Performance bei großen CVs testen (>500KB JSON)
- Accessibility: Keyboard-Navigation, Screen-Reader-Support

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
