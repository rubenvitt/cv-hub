# Story 5.9: Frontend Admin-Dashboard mit Stats-Overview

Status: drafted

## Story

Als Admin,
möchte ich ein Dashboard mit Übersicht über aktive Links und Besuche sehen,
damit ich einen schnellen Überblick habe.

## Acceptance Criteria

1. ✅ Route `/admin/dashboard` in `apps/frontend/src/routes/admin/dashboard.tsx`
2. ✅ AdminLayout-Component (mit Sidebar/Navigation) in `apps/frontend/src/components/admin/AdminLayout.tsx`
3. ✅ Dashboard zeigt 3 StatsCards:
   - Anzahl aktive Links (GET /api/admin/invites?status=active)
   - Gesamtbesuche über alle Links (Sum visitCount)
   - Kürzlich erstellte Links (5 neueste, GET /api/admin/invites?limit=5&sortBy=createdAt)
4. ✅ beforeLoad-Hook: Prüft Auth-Status (GET /api/admin/auth/status), redirect zu `/admin/login` wenn nicht eingeloggt
5. ✅ TanStack Query für parallele API-Calls (alle 3 Stats gleichzeitig fetchen)
6. ✅ Loading-Skeletons während Datenabruf
7. ✅ Logout-Button in Navigation (POST /api/admin/auth/logout)
8. ✅ Dashboard lädt in <2s (Performance-Messung)

## Tasks / Subtasks

- [ ] Task 1: AdminLayout-Component mit Navigation erstellen (AC: 2, 7)
  - [ ] Subtask 1.1: Component-Datei `apps/frontend/src/components/admin/AdminLayout.tsx` erstellen
  - [ ] Subtask 1.2: Layout-Struktur: Sidebar (links), Main-Content (rechts)
  - [ ] Subtask 1.3: Sidebar-Navigation mit Links: Dashboard, Links, CV Extract, Logout
  - [ ] Subtask 1.4: Logout-Button mit Confirmation Dialog
  - [ ] Subtask 1.5: useLogoutMutation Hook: POST /api/admin/auth/logout → Redirect zu /admin/login
  - [ ] Subtask 1.6: Responsive Design: Mobile → Hamburger Menu, Desktop → Fixed Sidebar
  - [ ] Subtask 1.7: shadcn/ui Components: Sidebar, Button, Dialog

- [ ] Task 2: Dashboard-Route mit Auth-Check erstellen (AC: 1, 4)
  - [ ] Subtask 2.1: Route-Datei `apps/frontend/src/routes/admin/dashboard.tsx` erstellen
  - [ ] Subtask 2.2: beforeLoad-Hook implementieren
  - [ ] Subtask 2.3: GET /api/admin/auth/status via TanStack Query (useSessionStatus Hook)
  - [ ] Subtask 2.4: Falls `authenticated: false` → throw redirect({ to: '/admin/login' })
  - [ ] Subtask 2.5: Falls `authenticated: true` → Dashboard rendern (AdminLayout wrapper)
  - [ ] Subtask 2.6: staleTime: 5 Minuten (Session-Cache)

- [ ] Task 3: StatsCard-Component erstellen (AC: 3, 6)
  - [ ] Subtask 3.1: Component-Datei `apps/frontend/src/components/admin/StatsCard.tsx` erstellen
  - [ ] Subtask 3.2: Props: title (string), value (number | string), icon (ReactNode), loading (boolean)
  - [ ] Subtask 3.3: Layout: Card mit Icon (links), Title + Value (rechts)
  - [ ] Subtask 3.4: Loading-State: Skeleton anzeigen (shadcn/ui Skeleton)
  - [ ] Subtask 3.5: Value-Formatting: Große Zahlen mit Tausender-Trenner (toLocaleString)
  - [ ] Subtask 3.6: shadcn/ui Components: Card, Skeleton

- [ ] Task 4: Dashboard-Stats mit TanStack Query fetchen (AC: 3, 5)
  - [ ] Subtask 4.1: API-Client `apps/frontend/src/lib/api/admin-invites.ts` erstellen/erweitern
  - [ ] Subtask 4.2: `useActiveLinksCount` Hook: GET /api/admin/invites?status=active → count aus pagination.total
  - [ ] Subtask 4.3: `useTotalVisits` Hook: GET /api/admin/invites?status=all → sum(visitCount) aus data array
  - [ ] Subtask 4.4: `useRecentLinks` Hook: GET /api/admin/invites?limit=5&sortBy=createdAt&sortOrder=desc
  - [ ] Subtask 4.5: Alle 3 Hooks parallel aufrufen in Dashboard-Component (TanStack Query auto-parallelisiert)
  - [ ] Subtask 4.6: staleTime: 5 Minuten (Dashboard-Daten Cache)
  - [ ] Subtask 4.7: Error-Handling: Bei API-Error → Toast-Notification + Retry-Button

- [ ] Task 5: Dashboard UI Assembly und Layout (AC: 3, 6, 8)
  - [ ] Subtask 5.1: Dashboard-Page-Component in `dashboard.tsx` implementieren
  - [ ] Subtask 5.2: Grid-Layout für 3 StatsCards (1 Row auf Desktop, 1 Column auf Mobile)
  - [ ] Subtask 5.3: StatsCard 1: "Aktive Links" mit Icon (Link-Icon), Value = activeLinksCount
  - [ ] Subtask 5.4: StatsCard 2: "Gesamtbesuche" mit Icon (Eye-Icon), Value = totalVisits
  - [ ] Subtask 5.5: StatsCard 3: "Kürzlich erstellt" mit Icon (Clock-Icon), Value = recentLinks.length
  - [ ] Subtask 5.6: Recent-Links-Liste unterhalb StatsCards: Tabelle mit 5 neuesten Links (Recipient, Created Date, Copy-Button)
  - [ ] Subtask 5.7: Loading-State: Alle 3 StatsCards zeigen Skeleton während fetching
  - [ ] Subtask 5.8: Tailwind Responsive: Grid cols-1 md:cols-3

- [ ] Task 6: Performance-Optimierung und Testing (AC: 8)
  - [ ] Subtask 6.1: Lighthouse Audit: Dashboard load time <2s (Time to Interactive)
  - [ ] Subtask 6.2: React DevTools Profiler: Component render times optimieren
  - [ ] Subtask 6.3: TanStack Query DevTools: Cache-Hits überprüfen
  - [ ] Subtask 6.4: Lazy Loading: Recent-Links-Liste nur laden wenn sichtbar (optional)
  - [ ] Subtask 6.5: E2E-Test mit Playwright: Dashboard-Load, Stats korrekt, Logout funktioniert
  - [ ] Subtask 6.6: E2E-Test: beforeLoad redirect wenn nicht eingeloggt

## Dev Notes

### Architektur-Constraints

**Frontend-Stack:**
- **TanStack Start**: Server-Side Rendering (SSR) + Client-Side Rendering (CSR)
- **TanStack Router**: File-based Routing, beforeLoad Hooks für Auth-Checks
- **TanStack Query**: API State Management, Caching (staleTime: 5min), Parallel Fetching
- **shadcn/ui**: Accessible Components (Radix UI + Tailwind CSS)
- **React 19**: Latest stable, TanStack Start compatible
- [Source: docs/architecture.md#Frontend-Stack]

**API-Integration:**
```typescript
// Active Links Count
GET /api/admin/invites?status=active
Response: { data: [...], pagination: { total: 42, ... } }
→ Use pagination.total for count

// Total Visits
GET /api/admin/invites?status=all
Response: { data: [{ visitCount: 5 }, { visitCount: 12 }, ...] }
→ Sum visitCount from all invites

// Recent Links
GET /api/admin/invites?limit=5&sortBy=createdAt&sortOrder=desc
Response: { data: [5 most recent invites], pagination: {...} }
```
- [Source: docs/tech-spec-epic-5.md#APIs-and-Interfaces]

**Session-Management:**
- beforeLoad-Hook prüft GET /api/admin/auth/status (Session-Cookie automatisch mitgesendet)
- Response: `{ authenticated: boolean, user?: { id, username } }`
- Falls authenticated=false → redirect({ to: '/admin/login' })
- Session-Cache: staleTime 5 Minuten (TanStack Query)
- [Source: docs/tech-spec-epic-5.md#Security-Constraints]

**Performance-Targets:**
- Dashboard Load Time: <2s (Time to Interactive)
- API Response Time: <200ms p95 (GET requests)
- TanStack Query Caching: staleTime=5min (Dashboard-Daten)
- Parallel API Calls: Alle 3 Stats gleichzeitig fetchen (TanStack Query auto-parallelisiert)
- [Source: docs/tech-spec-epic-5.md#Performance]

### Source Tree Components

**Neue Dateien:**

1. `apps/frontend/src/routes/admin/dashboard.tsx`:
   - TanStack Router Route-Component
   - beforeLoad Hook für Session-Check (redirect wenn nicht eingeloggt)
   - Dashboard-Page mit 3 StatsCards + Recent-Links-Liste
   - AdminLayout wrapper
   - Loading-Skeletons während Datenabruf

2. `apps/frontend/src/components/admin/AdminLayout.tsx`:
   - Layout-Component für alle Admin-Seiten
   - Sidebar mit Navigation (Dashboard, Links, CV Extract, Logout)
   - Logout-Button mit Confirmation Dialog
   - Responsive: Mobile → Hamburger Menu, Desktop → Fixed Sidebar
   - shadcn/ui: Sidebar, Button, Dialog Components

3. `apps/frontend/src/components/admin/StatsCard.tsx`:
   - Wiederverwendbare Stat-Card-Component
   - Props: title, value, icon, loading
   - Layout: Icon + Title + Value
   - Loading-State: Skeleton (shadcn/ui)
   - Value-Formatting: toLocaleString für große Zahlen

4. `apps/frontend/src/lib/api/admin-invites.ts`:
   - TanStack Query Hooks:
     - `useActiveLinksCount`: GET /api/admin/invites?status=active
     - `useTotalVisits`: GET /api/admin/invites?status=all → sum(visitCount)
     - `useRecentLinks`: GET /api/admin/invites?limit=5&sortBy=createdAt
   - Fetch Configuration: credentials: 'include' (für Cookies)
   - Error-Handling: Network Errors, HTTP Status Codes
   - staleTime: 5 Minuten (Cache)

5. `apps/frontend/tests/e2e/admin-dashboard.spec.ts`:
   - Playwright E2E-Tests
   - Test Cases: Dashboard Load, Stats korrekt, Logout, beforeLoad redirect

**Wiederverwendete Components (aus Story 5.8):**
- `apps/frontend/src/lib/api/admin-auth.ts`:
  - `useSessionStatus`: GET /api/admin/auth/status (bereits vorhanden)
  - `useLogoutMutation`: POST /api/admin/auth/logout (neu für Logout-Button)

**shadcn/ui Components (aus Epic 3):**
- `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`: StatsCard-Layout
- `<Skeleton>`: Loading-State
- `<Button>`: Logout-Button, Copy-Button
- `<Dialog>`: Logout-Confirmation
- `<Sidebar>`, `<SidebarProvider>`, `<SidebarTrigger>`: Admin-Navigation
- Alle Components bereits installiert in Epic 3

### Testing-Standards

**E2E-Tests (Playwright):**
- **Test-Setup:**
  - Admin-User eingeloggt (Session vorhanden)
  - 10+ Sample Invite Links (verschiedene States: active, inactive, expired)
  - Backend läuft auf http://localhost:3000 (Docker Compose)
  - Frontend läuft auf http://localhost:5173 (TanStack Start Dev Server)

- **Test-Coverage-Ziele:**
  - Dashboard Load: Navigiere zu /admin/dashboard → Stats sichtbar → Werte korrekt
  - Stats Accuracy: Aktive Links Count = tatsächliche Anzahl aktiver Links in DB
  - Total Visits: Sum visitCount = Summe aller visitCount-Werte
  - Recent Links: 5 neueste Links angezeigt, sortiert nach createdAt DESC
  - Loading State: Skeletons sichtbar während Datenabruf
  - beforeLoad Redirect: Kein Session → Redirect zu /admin/login
  - Logout: Logout-Button klicken → Confirmation → Session zerstört → Redirect zu /admin/login
  - Performance: Dashboard load time <2s (Lighthouse Audit)
  - [Source: docs/tech-spec-epic-5.md#Test-Strategy]

**Unit-Tests (Vitest, optional für diese Story):**
- StatsCard Component: Props korrekt gerendert, Loading-State
- useActiveLinksCount Hook: API-Call korrekt, Pagination.total extrahiert
- useTotalVisits Hook: sum(visitCount) korrekt berechnet

**Performance-Tests:**
- Lighthouse Audit: Dashboard load time <2s (TTI)
- React DevTools Profiler: Component render times
- TanStack Query DevTools: Cache-Hits, Stale-Time

### Project Structure Notes

**Alignment mit TanStack Start File-Based Routing:**
- Route-Datei: `apps/frontend/src/routes/admin/dashboard.tsx`
- URL-Path: `/admin/dashboard` (automatisch aus File-Path abgeleitet)
- Layout: `apps/frontend/src/components/admin/AdminLayout.tsx` (manuell gerendert, kein _layout.tsx)

**Integration mit bestehender Frontend-Architektur:**
- shadcn/ui Components aus Epic 3 wiederverwendet (bereits konfiguriert)
- TanStack Query Client global konfiguriert (in `apps/frontend/src/root.tsx`)
- useSessionStatus Hook aus Story 5.8 wiederverwendet
- CSRF-Token automatisch mitgesendet (Cookie-basiert, aus Story 5.6)

**Potenzielle Konflikte:**
- KEINE - Dashboard ist neue Route, keine Überschneidungen mit Public Routes (`/`, `/invite/:token`) oder Login (`/admin/login`)

**CSS/Styling:**
- Tailwind CSS v4 (aus Epic 3)
- shadcn/ui Theme (bereits konfiguriert)
- Grid-Layout: `grid-cols-1 md:grid-cols-3` für responsive StatsCards
- Dark Mode Support optional (Growth Feature)

### Learnings from Previous Story

**Von Story 5-8-frontend-admin-login-seite (Status: drafted):**

Story 5.8 wurde noch nicht implementiert (nur drafted). Keine Implementierungs-Learnings verfügbar.

**Relevante Kontext-Informationen aus vorherigen Stories:**

**Session-Management und Auth-Check (aus Story 5.8 Dev Notes):**
- `useSessionStatus` Hook bereits in `apps/frontend/src/lib/api/admin-auth.ts` definiert
- GET /api/admin/auth/status liefert `{ authenticated: boolean, user?: { id, username } }`
- beforeLoad-Hook Pattern: Falls `authenticated === false` → throw redirect({ to: '/admin/login' })
- staleTime: 5 Minuten (Session-Cache)
- **Wichtig für Story 5.9:** Gleichen Hook wiederverwenden für Dashboard Auth-Check
- [Source: stories/5-8-frontend-admin-login-seite.md#Dev-Notes]

**CSRF-Integration (aus Story 5.6 Dev Notes):**
- CSRF-Token automatisch als Cookie (`XSRF-TOKEN`) gesetzt
- GET-Requests (wie GET /api/admin/invites) sind CSRF-exempt
- POST /api/admin/auth/logout benötigt CSRF-Token (automatisch von Browser mitgesendet)
- **Wichtig für Story 5.9:** Logout-Button muss CSRF-Token mitsenden (automatisch via fetch mit credentials: 'include')
- [Source: stories/5-8-frontend-admin-login-seite.md#Dev-Notes]

**TanStack Query Setup (aus Story 5.8 Dev Notes):**
- TanStack Query Client global konfiguriert in `apps/frontend/src/root.tsx`
- Fetch Configuration: credentials: 'include' (für Cookies)
- Error-Handling: Network Errors, HTTP Status Codes
- **Wichtig für Story 5.9:** Gleiche Fetch-Config für Admin-Invites-API verwenden
- [Source: stories/5-8-frontend-admin-login-seite.md#Dev-Notes]

**shadcn/ui Components (aus Epic 3):**
- Alle Components bereits installiert (Card, Skeleton, Button, Dialog, Sidebar)
- Theme konfiguriert, Dark Mode optional
- Accessibility (WCAG AA) built-in via Radix UI
- **Wichtig für Story 5.9:** Components direkt importieren, keine Installation nötig
- [Source: docs/tech-spec-epic-5.md#Frontend-Stack]

### References

- [Source: docs/tech-spec-epic-5.md#System-Architecture-Alignment] - Frontend-Stack, TanStack Ecosystem
- [Source: docs/tech-spec-epic-5.md#APIs-and-Interfaces] - Admin Invite API Spezifikation, Response-Formate
- [Source: docs/tech-spec-epic-5.md#Performance] - Dashboard Load Time Target <2s, TanStack Query Caching
- [Source: docs/tech-spec-epic-5.md#Test-Strategy] - E2E-Test-Anforderungen, Playwright Setup
- [Source: docs/epics.md#Story-5.9] - Original Story-Definition, Acceptance Criteria, Affected Files
- [Source: docs/architecture.md#Frontend-Stack] - TanStack Start, React 19, shadcn/ui Rationale
- [Source: stories/5-8-frontend-admin-login-seite.md#Dev-Notes] - Session-Management, useSessionStatus Hook, CSRF

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

(Wird vom Dev Agent ergänzt)

### Debug Log References

### Completion Notes List

### File List
