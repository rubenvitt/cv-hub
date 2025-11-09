# Story 5.10: Frontend Link-Management-Liste mit Sortierung und Filterung

Status: drafted

## Story

Als Admin,
möchte ich eine übersichtliche Tabelle aller personalisierten Links mit Sortierungs- und Filterfunktionen sehen,
damit ich schnell den Überblick über erstellte Links behalte und gezielt nach bestimmten Links suchen kann.

## Acceptance Criteria

1. **AC 5.10.1: Tabellen-Darstellung**
   - Tabelle zeigt folgende Spalten für jeden Link:
     - Recipient Name (oder "Unnamed" wenn leer)
     - Token (gekürzt, z.B. erste 8 Zeichen mit "...")
     - Status Badge (Active/Inactive/Expired mit farblicher Kennzeichnung)
     - Visit Count (Anzahl)
     - Created Date (formatiert mit date-fns)
   - Tabelle ist responsive und scrollbar bei vielen Einträgen

2. **AC 5.10.2: Sortierung**
   - Links können sortiert werden nach:
     - Created Date (Standard: neueste zuerst)
     - Visit Count (häufigste zuerst/zuletzt)
     - Expiration Date (ablaufend zuerst/zuletzt)
   - Sort-Order umschaltbar (aufsteigend/absteigend)
   - Aktive Sortierung visuell gekennzeichnet (Icon)

3. **AC 5.10.3: Filterung**
   - Dropdown-Filter für Status:
     - "All" (Standard)
     - "Active" (isActive=true, nicht abgelaufen)
     - "Inactive" (isActive=false)
     - "Expired" (expiresAt < now)
   - Filter-Änderung triggert sofortige Tabellen-Aktualisierung

4. **AC 5.10.4: Suchfunktion**
   - Suchfeld für Recipient Name (case-insensitive)
   - Debounced Search (300ms Verzögerung)
   - Suchergebnisse in Echtzeit angezeigt

5. **AC 5.10.5: Pagination**
   - Standard: 10 Items pro Seite
   - Maximum: 100 Items pro Seite (konfigurierbar)
   - Pagination-Controls: Previous, Next, Page Numbers
   - Total Count angezeigt ("Showing 1-10 of 42")

6. **AC 5.10.6: Quick Actions**
   - Jede Tabellenzeile hat Action Buttons:
     - "Copy URL" (kopiert `/invite/:token` URL in Clipboard)
     - "Deactivate" (öffnet Bestätigungs-Dialog, setzt isActive=false)
     - "Delete" (öffnet Bestätigungs-Dialog, soft delete via PATCH)
   - Actions als Icon-Buttons mit Tooltips
   - Copy-Aktion zeigt visuelles Feedback (Checkmark, Toast)

7. **AC 5.10.7: Performance**
   - Tabelle lädt in <100ms bei gecachten Daten (TanStack Query)
   - Sort/Filter-Operationen <100ms (server-side wenn neue Query)
   - Optimistic Updates für Quick Actions (sofortige UI-Reaktion)

8. **AC 5.10.8: Empty States**
   - Wenn keine Links existieren: "No links created yet" mit CTA-Button
   - Wenn keine Suchergebnisse: "No matches found" mit Reset-Filter-Button
   - Wenn Filter keine Ergebnisse: "No {status} links" Nachricht

## Tasks / Subtasks

- [ ] **Task 1: LinkManagement Page Component erstellen** (AC: 5.10.1)
  - [ ] Route `/admin/links` anlegen in TanStack Router
  - [ ] LinkManagement.tsx Component scaffolding
  - [ ] AdminLayout einbinden (Nav, Sidebar)
  - [ ] Routing-Test: `/admin/links` erreichbar

- [ ] **Task 2: Link Table Component mit shadcn/ui** (AC: 5.10.1)
  - [ ] shadcn/ui Table Component importieren
  - [ ] LinkTableRow Sub-Component für einzelne Zeile
  - [ ] Spalten-Definition (Recipient, Token, Status, Visits, Date)
  - [ ] Status Badge Component (farbcodiert: green=active, gray=inactive, red=expired)
  - [ ] Token-Kürzung-Logic (erste 8 Zeichen + "...")
  - [ ] date-fns Integration für Date-Formatierung (z.B. "Nov 4, 2025")
  - [ ] Responsive Design: Tabelle scrollbar auf Mobile

- [ ] **Task 3: TanStack Query Hook für Invite-Liste** (AC: 5.10.1-5.10.4)
  - [ ] `useInvites` Hook erstellen mit TanStack Query
  - [ ] GET `/api/admin/invites` mit Query Params (status, search, sortBy, sortOrder, limit, offset)
  - [ ] Cache-Konfiguration (staleTime: 5 min, refetchOnWindowFocus: true)
  - [ ] Loading/Error States handling
  - [ ] Query Key mit allen Filter-/Sort-Parametern

- [ ] **Task 4: Sortierungs-Funktionalität** (AC: 5.10.2)
  - [ ] Sortierbare Spalten-Header (Created Date, Visit Count, Expiration Date)
  - [ ] Sort State Management (sortBy, sortOrder) via URL Search Params
  - [ ] Sort-Icon anzeigen (aufsteigend/absteigend Pfeil)
  - [ ] Click-Handler für Spalten-Header (toggle sortOrder)
  - [ ] Query-Aktualisierung bei Sort-Änderung

- [ ] **Task 5: Filter-Funktionalität** (AC: 5.10.3)
  - [ ] shadcn/ui DropdownMenu für Status-Filter
  - [ ] Filter State via URL Search Params (status: all|active|inactive|expired)
  - [ ] Filter-Option-Rendering mit aktuellem Status
  - [ ] Query-Aktualisierung bei Filter-Änderung
  - [ ] Visueller Indikator für aktiven Filter

- [ ] **Task 6: Suchfunktion** (AC: 5.10.4)
  - [ ] Search Input Component (shadcn/ui Input)
  - [ ] Debounced Search Implementation (300ms mit lodash.debounce oder custom hook)
  - [ ] Search State via URL Search Params (search: string)
  - [ ] Query-Aktualisierung bei Search-Änderung
  - [ ] Clear Search Button (X-Icon)

- [ ] **Task 7: Pagination** (AC: 5.10.5)
  - [ ] Pagination Component (shadcn/ui oder custom)
  - [ ] Pagination State (limit, offset) via URL Search Params
  - [ ] Previous/Next Buttons (disabled wenn keine Daten)
  - [ ] Page Number Display (Current Page / Total Pages)
  - [ ] Total Count Display ("Showing X-Y of Z")
  - [ ] Limit-Selector (10, 25, 50, 100)

- [ ] **Task 8: Quick Action Buttons** (AC: 5.10.6)
  - [ ] Copy URL Button Component
    - Clipboard API Integration (`navigator.clipboard.writeText()`)
    - Fallback für ältere Browser (textarea-copy-Methode)
    - Visual Feedback: Checkmark-Icon für 2s, dann zurück zu Copy-Icon
    - Toast Notification: "Link copied!"
  - [ ] Deactivate Button Component
    - Confirmation Dialog (shadcn/ui AlertDialog)
    - PATCH `/api/admin/invites/:id` mit `{ isActive: false }`
    - Optimistic Update via TanStack Query
    - Success Toast: "Link deactivated"
  - [ ] Delete Button Component
    - Confirmation Dialog mit Warnung (Soft Delete)
    - DELETE `/api/admin/invites/:id` (oder PATCH mit soft delete)
    - Optimistic Update via TanStack Query
    - Success Toast: "Link deleted"
  - [ ] Tooltip für alle Action Buttons (shadcn/ui Tooltip)

- [ ] **Task 9: Empty States** (AC: 5.10.8)
  - [ ] Empty State Component ("No links created yet")
  - [ ] "Create Link" CTA Button (führt zu Link Creation Dialog)
  - [ ] No Results State ("No matches found")
  - [ ] Reset Filter Button (setzt alle Filter zurück)
  - [ ] Filter-spezifische Empty States ("No active links")

- [ ] **Task 10: Optimistic Updates für Quick Actions** (AC: 5.10.7)
  - [ ] TanStack Query `useMutation` für Deactivate
  - [ ] Optimistic Update: `queryClient.setQueryData` vor API-Call
  - [ ] Rollback bei Fehler (`onError` Callback)
  - [ ] TanStack Query `useMutation` für Delete
  - [ ] Optimistic Remove aus Liste

- [ ] **Task 11: Integration Tests** (AC: alle)
  - [ ] E2E Test (Playwright): Tabelle rendern, Daten korrekt angezeigt
  - [ ] E2E Test: Sortierung funktioniert (Created Date asc/desc)
  - [ ] E2E Test: Filter funktioniert (Status: Active, Inactive, Expired)
  - [ ] E2E Test: Search funktioniert (Recipient Name)
  - [ ] E2E Test: Pagination funktioniert (Next/Previous)
  - [ ] E2E Test: Copy URL kopiert korrekt in Clipboard
  - [ ] E2E Test: Deactivate Link setzt isActive=false
  - [ ] E2E Test: Delete Link entfernt aus Liste
  - [ ] Unit Test: Debounced Search (300ms Verzögerung)
  - [ ] Unit Test: Token-Kürzung-Logic

## Dev Notes

### Architektur-Kontext

**Frontend-Architektur (aus architecture.md):**
- TanStack Start (SSR + CSR)
- TanStack Router (File-based routing, Type-safe)
- TanStack Query (Server-state management, Caching, Optimistic updates)
- TanStack Form (für Link Creation, nicht diese Story)
- shadcn/ui Components (Radix UI primitives, Tailwind-styled)
- Tailwind CSS v4 (Utility-first)

**Admin Routes (CSR, kein SSR):**
- `/admin/links` → LinkManagement Page (diese Story)
- Layout: AdminLayout mit Nav + Sidebar
- Auth-Check: beforeLoad hook prüft Session

**API Endpoints (aus tech-spec-epic-5.md):**
```
GET /api/admin/invites
Query Params:
  - status: 'active' | 'inactive' | 'expired' | 'all' (default: 'all')
  - search: string (optional, searches recipientName)
  - limit: number (default: 10, max: 100)
  - offset: number (default: 0)
  - sortBy: 'createdAt' | 'visitCount' | 'expiresAt' (default: 'createdAt')
  - sortOrder: 'asc' | 'desc' (default: 'desc')

Response:
{
  "data": [
    {
      "id": "cm3k5x...",
      "token": "cm3k5y...",
      "recipientName": "John Doe",
      "message": "# Welcome John",
      "expiresAt": "2025-12-31T23:59:59Z",
      "isActive": true,
      "visitCount": 5,
      "lastVisitAt": "2025-11-03T14:30:00Z",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-03T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasNext": true
  }
}

PATCH /api/admin/invites/:id
Body: { "isActive": false } // für Deactivate

DELETE /api/admin/invites/:id
Note: Soft delete (sets isActive=false)
```

### Komponenten-Struktur

**Komponenten-Hierarchie:**
```
LinkManagement (Page)
├── AdminLayout
│   ├── AdminNav
│   └── AdminSidebar
├── FilterBar
│   ├── StatusFilter (DropdownMenu)
│   ├── SearchInput (debounced)
│   └── SortControls
├── LinkTable (shadcn/ui Table)
│   ├── TableHeader
│   │   ├── Sortable Column Headers
│   │   └── Sort Icons
│   └── TableBody
│       └── LinkTableRow (repeated)
│           ├── Recipient Cell
│           ├── Token Cell (gekürzt)
│           ├── Status Badge
│           ├── Visit Count Cell
│           ├── Created Date Cell
│           └── Actions Cell
│               ├── CopyButton (Tooltip)
│               ├── DeactivateButton (Tooltip + Dialog)
│               └── DeleteButton (Tooltip + Dialog)
├── Pagination Component
└── EmptyState (conditional)
```

**shadcn/ui Components benötigt:**
- `Table` (table, thead, tbody, tr, th, td)
- `Badge` (für Status)
- `Button` (Actions, Pagination)
- `DropdownMenu` (Filter)
- `Input` (Search)
- `Tooltip` (Action Buttons)
- `AlertDialog` (Confirmation für Deactivate/Delete)

### State Management

**URL Search Params als Single Source of Truth:**
- `status` (all|active|inactive|expired)
- `search` (string)
- `sortBy` (createdAt|visitCount|expiresAt)
- `sortOrder` (asc|desc)
- `limit` (10|25|50|100)
- `offset` (number)

**Vorteile:**
- Deep Linking möglich (Share URL mit aktiven Filtern)
- Browser Back/Forward funktioniert
- State persistence automatisch
- TanStack Router: `useSearch()` Hook

**TanStack Query Cache Keys:**
```typescript
['admin-invites', { status, search, sortBy, sortOrder, limit, offset }]
```

### Testing-Strategie

**E2E Tests (Playwright):**
- **Kritischer Path:** Admin Login → Navigate to /admin/links → Tabelle geladen → Sortieren/Filtern/Suchen → Actions durchführen
- **Fixtures:** 50 Test-Links mit verschiedenen Status (active, inactive, expired)
- **Assertions:**
  - Tabelle zeigt korrekte Anzahl Links
  - Sortierung ändert Reihenfolge
  - Filter reduziert sichtbare Links
  - Search findet korrekte Matches
  - Pagination funktioniert (Next/Previous disabled wenn nötig)
  - Copy URL kopiert korrekten Link
  - Deactivate setzt Status auf Inactive
  - Delete entfernt Link aus Tabelle

**Unit Tests (Vitest):**
- Debounced Search Logic (300ms Verzögerung)
- Token-Kürzung-Funktion (erste 8 Zeichen + "...")
- Status Badge Color Logic (active=green, inactive=gray, expired=red)
- Empty State Rendering Logic

### Performance-Optimierungen

**TanStack Query Caching:**
- `staleTime: 5 * 60 * 1000` (5 Minuten) - Daten als fresh betrachten
- `cacheTime: 10 * 60 * 1000` (10 Minuten) - Cache im Memory halten
- `refetchOnWindowFocus: true` - Aktualisierung bei Tab-Wechsel

**Optimistic Updates:**
- Deactivate: Sofortige Badge-Änderung, Rollback bei Fehler
- Delete: Sofortiges Entfernen aus Liste, Rollback bei Fehler
- Copy: Sofortiges Icon-Feedback (Checkmark)

**Debounced Search:**
- 300ms Verzögerung verhindert API-Call bei jedem Tastendruck
- Verwendung: `lodash.debounce` oder custom `useDebouncedValue` Hook

**Pagination:**
- Server-side Pagination (nur benötigte Items laden)
- Limit: 10 (Default), max 100 (verhindert große Result Sets)

### UX-Details

**Visual Feedback:**
- **Copy Button:** Icon wechselt zu Checkmark für 2s
- **Toast Notifications:** "Link copied!", "Link deactivated", "Link deleted"
- **Loading States:** Skeleton Loader für Tabelle während Fetch
- **Error States:** Freundliche Fehlermeldungen ("Failed to load links. Try again.")

**Accessibility (WCAG AA):**
- Alle Action Buttons haben `aria-label`
- Sort-Spalten haben `aria-sort` Attribute
- Tooltips haben `role="tooltip"`
- Confirmation Dialogs haben fokussiertes "Cancel" by default

**Responsive Design:**
- Desktop: Volle Tabelle (alle Spalten)
- Tablet: Optional horizontales Scrollen
- Mobile: Card-Layout statt Tabelle (optional, oder scrollbar table)

### Potential Gotchas

1. **Clipboard API Browser Support:**
   - `navigator.clipboard` nicht in allen Browsern (vor allem HTTP)
   - Fallback: `document.execCommand('copy')` via hidden textarea
   - Test mit HTTPS (oder localhost)

2. **TanStack Query Cache Invalidation:**
   - Nach Deactivate/Delete: `queryClient.invalidateQueries(['admin-invites'])`
   - Oder: Optimistic Update + Rollback bei Fehler

3. **URL Search Params Encoding:**
   - Search-String muss URI-encoded sein
   - TanStack Router handled das automatisch

4. **Empty State bei Filtern:**
   - "No active links" wenn Filter gesetzt, aber keine Ergebnisse
   - Reset-Filter-Button oder Hinweis "Try changing filters"

5. **Soft Delete vs. Hard Delete:**
   - DELETE Endpoint führt Soft Delete durch (isActive=false)
   - Links bleiben in DB für Statistiken
   - UI zeigt "Deleted" oder "Inactive" Status

### References

- [Source: docs/tech-spec-epic-5.md - AC-3: Link Management - List View]
- [Source: docs/tech-spec-epic-5.md - Services: LinkManagement, LinkTableRow]
- [Source: docs/tech-spec-epic-5.md - APIs: GET /api/admin/invites]
- [Source: docs/architecture.md - Frontend Stack: TanStack Start, shadcn/ui]
- [Source: docs/epics.md - Epic 5: Link Management Dashboard]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
