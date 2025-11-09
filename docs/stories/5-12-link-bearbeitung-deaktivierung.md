# Story 5.12: Frontend Link-Bearbeitung und Deaktivierung

Status: drafted

## Story

Als Admin,
möchte ich bestehende Links bearbeiten und deaktivieren,
damit ich Links verwalten kann ohne sie zu löschen.

## Acceptance Criteria

1. **AC 5.12.1: Edit-Dialog öffnen via Link-Row**
   - Klick auf eine Link-Row in der Tabelle (Story 5.10) öffnet Edit-Dialog
   - Dialog wiederverwendet LinkForm-Component aus Story 5.11
   - Dialog-Titel: "Edit Personalized Link"
   - Dialog ist modal und responsive (wie Create-Dialog)

2. **AC 5.12.2: Form-Felder vorbefüllt**
   - Alle Felder vorbefüllt mit bestehenden Link-Daten:
     - Recipient Name (falls vorhanden)
     - Personalized Message (falls vorhanden)
     - Expiration Date (falls vorhanden, formatiert mit date-fns)
     - Active Status (Toggle entsprechend isActive)
   - Token-Feld: Read-only, nicht editierbar (nur anzeigen)
   - Markdown-Preview zeigt bestehende Message beim Öffnen

3. **AC 5.12.3: Update-Mutation mit TanStack Query**
   - Bei Submit: PATCH /api/admin/invites/:id mit geänderten Daten
   - Request Body: UpdateInviteDto (nur geänderte Felder)
   - TanStack Query Mutation Hook (`useUpdateInvite`)
   - CSRF-Token automatisch im Header
   - Error-Handling: API-Fehler → Toast-Notification

4. **AC 5.12.4: Optimistic Update**
   - Tabelle zeigt aktualisierte Daten sofort (ohne Reload)
   - TanStack Query Cache-Update (`onMutate`)
   - Bei Fehler: Rollback auf alte Daten (`onError`)
   - Success: Cache Invalidierung (`onSettled`)
   - Success-Toast: "Link updated successfully!"

5. **AC 5.12.5: Deactivate-Button in Link-Row**
   - "Deactivate" Button in jeder Link-Row (nur wenn isActive === true)
   - Button-Icon: Ban/Stop-Icon + "Deactivate" Label
   - Click öffnet Confirmation-Dialog (shadcn/ui AlertDialog)
   - Confirmation-Dialog:
     - Title: "Deactivate Link?"
     - Description: "This link will no longer be accessible. You can reactivate it later."
     - Actions: "Cancel" (sekundär) + "Deactivate" (destruktiv)

6. **AC 5.12.6: Deactivate-Action**
   - Bei Bestätigung: PATCH /api/admin/invites/:id { isActive: false }
   - Optimistic Update: Row zeigt "Inactive" Badge sofort
   - Success-Toast: "Link deactivated successfully!"
   - Deaktivierter Link ist nicht mehr über `/invite/:token` aufrufbar (Backend-Validierung)

7. **AC 5.12.7: Visual States für deaktivierte Links**
   - Deaktivierte Links in Tabelle:
     - Badge: "Inactive" (rot oder grau)
     - Row: Ausgegraut (reduzierte Opacity, z.B. 0.6)
     - "Deactivate" Button → "Reactivate" Button (grün)
   - Sortierung/Filterung berücksichtigt Status (Filter: Active/Inactive/All)

8. **AC 5.12.8: Reactivate-Funktion**
   - "Reactivate" Button in deaktivierten Rows
   - Click: Sofortiges PATCH (ohne Confirmation-Dialog)
   - PATCH /api/admin/invites/:id { isActive: true }
   - Row zeigt "Active" Badge, volle Opacity
   - Success-Toast: "Link reactivated successfully!"

9. **AC 5.12.9: Delete-Button (Soft Delete)**
   - "Delete" Button in jeder Link-Row
   - Click öffnet Confirmation-Dialog
   - Confirmation-Dialog:
     - Title: "Delete Link?"
     - Description: "This link will be deactivated and marked as deleted. Statistics will be preserved."
     - Actions: "Cancel" + "Delete" (destruktiv)
   - Bei Bestätigung: PATCH /api/admin/invites/:id { isActive: false } (identisch zu Deactivate für MVP)
   - Future: Soft-delete-Flag in DB (optional, Growth-Feature)

10. **AC 5.12.10: Success/Error-Toasts für alle Aktionen**
    - Edit Success: "Link updated successfully!"
    - Edit Error: "Failed to update link" (+ API-Error-Message)
    - Deactivate Success: "Link deactivated successfully!"
    - Deactivate Error: "Failed to deactivate link"
    - Reactivate Success: "Link reactivated successfully!"
    - Reactivate Error: "Failed to reactivate link"
    - Delete Success: "Link deleted successfully!"
    - Delete Error: "Failed to delete link"

## Tasks / Subtasks

- [ ] **Task 1: LinkEditDialog Component erstellen** (AC: 5.12.1, 5.12.2)
  - [ ] LinkEditDialog.tsx Component in `apps/frontend/src/components/admin/` anlegen
  - [ ] Wiederverwendet LinkForm-Component aus Story 5.11
  - [ ] Props: `inviteId`, `inviteData`, `onClose`, `onSuccess`
  - [ ] Dialog öffnet bei Click auf Link-Row (Event-Handler in LinkTableRow)
  - [ ] Form-Felder vorbefüllt mit `inviteData`:
    - recipientName, message, expiresAt, isActive
  - [ ] Token-Feld: Read-only Input (disabled, nicht editierbar)
  - [ ] Markdown-Preview zeigt bestehende Message beim Öffnen
  - [ ] Unit-Test: Dialog öffnet mit vorbefüllten Daten

- [ ] **Task 2: TanStack Query Update-Mutation Hook** (AC: 5.12.3)
  - [ ] `useUpdateInvite` Hook in `apps/frontend/src/lib/api/admin-invites.ts` erstellen
  - [ ] PATCH /api/admin/invites/:id mit UpdateInviteDto
  - [ ] TanStack Query `useMutation` Hook verwenden
  - [ ] CSRF-Token automatisch im Header (axios interceptor aus Story 5.11)
  - [ ] Error-Handling: onError Callback → Toast-Notification
  - [ ] Success-Handling: onSuccess Callback → Dialog schließen + Success-Toast
  - [ ] Integration-Test: API-Call mit korrektem Request Body

- [ ] **Task 3: Optimistic Update Implementierung** (AC: 5.12.4)
  - [ ] `onMutate` Callback: Optimistisches Update in Cache
  - [ ] `queryClient.setQueryData` zum Aktualisieren des Cache
  - [ ] Cache Key: `['admin-invites', { ...query params }]` (identisch zu Story 5.10)
  - [ ] `onError` Callback: Rollback bei Fehler
  - [ ] `onSettled` Callback: Invalidate alle relevanten Query Keys
  - [ ] Integration-Test: Optimistic Update funktioniert, Rollback bei Fehler

- [ ] **Task 4: Deactivate-Button und Confirmation-Dialog** (AC: 5.12.5, 5.12.6)
  - [ ] "Deactivate" Button in LinkTableRow hinzufügen
  - [ ] Button nur angezeigt wenn `isActive === true`
  - [ ] shadcn/ui AlertDialog Component importieren und einrichten
  - [ ] Confirmation-Dialog mit Title, Description, Cancel + Deactivate Buttons
  - [ ] Bei Bestätigung: `useUpdateInvite` Mutation mit `{ isActive: false }`
  - [ ] Optimistic Update: Row zeigt "Inactive" Badge sofort
  - [ ] Success-Toast: "Link deactivated successfully!"
  - [ ] E2E-Test: Deactivate-Flow (Click → Confirm → Link inaktiv)

- [ ] **Task 5: Visual States für deaktivierte Links** (AC: 5.12.7)
  - [ ] Badge-Component: "Inactive" Badge (rot oder grau)
  - [ ] Row-Styling: Opacity 0.6 für deaktivierte Links
  - [ ] Conditional Rendering: "Deactivate" Button → "Reactivate" Button
  - [ ] Filter-Logik: Berücksichtigt isActive-Status (Filter-Dropdown)
  - [ ] Unit-Test: Badge und Opacity korrekt bei isActive=false

- [ ] **Task 6: Reactivate-Button und Action** (AC: 5.12.8)
  - [ ] "Reactivate" Button in deaktivierten Link-Rows
  - [ ] Button-Variante: Grün, ermutigend (z.B. "Activate" oder "Enable")
  - [ ] Click: Sofortiges PATCH ohne Confirmation-Dialog
  - [ ] `useUpdateInvite` Mutation mit `{ isActive: true }`
  - [ ] Row zeigt "Active" Badge, volle Opacity
  - [ ] Success-Toast: "Link reactivated successfully!"
  - [ ] E2E-Test: Reactivate-Flow (Click → Link aktiv)

- [ ] **Task 7: Delete-Button und Soft Delete** (AC: 5.12.9)
  - [ ] "Delete" Button in jeder Link-Row
  - [ ] Button-Icon: Trash-Icon + "Delete" Label (destruktive Variante)
  - [ ] shadcn/ui AlertDialog für Confirmation
  - [ ] Confirmation-Dialog:
    - Title: "Delete Link?"
    - Description: "This link will be deactivated. Statistics preserved."
    - Actions: "Cancel" + "Delete" (destruktiv)
  - [ ] Bei Bestätigung: `useUpdateInvite` Mutation mit `{ isActive: false }`
  - [ ] MVP: Delete = Deactivate (identische Logik)
  - [ ] Future: Soft-delete-Flag in DB (optional, Growth-Feature)
  - [ ] E2E-Test: Delete-Flow (Click → Confirm → Link deaktiviert)

- [ ] **Task 8: Success/Error-Toast-Messages** (AC: 5.12.10)
  - [ ] Toast-Notifications für alle Aktionen:
    - Edit Success/Error
    - Deactivate Success/Error
    - Reactivate Success/Error
    - Delete Success/Error
  - [ ] Toast-Library: shadcn/ui Toaster oder react-hot-toast
  - [ ] Error-Messages zeigen API-Error-Details (falls vorhanden)
  - [ ] Unit-Test: Toast-Messages korrekt angezeigt

- [ ] **Task 9: Integration und E2E-Tests** (AC: alle)
  - [ ] E2E-Test (Playwright): Edit-Flow
    - Click auf Link-Row
    - Edit-Dialog öffnet mit vorbefüllten Daten
    - Ändere Recipient Name + Message
    - Submit Form
    - Tabelle zeigt aktualisierte Daten
  - [ ] E2E-Test: Deactivate-Flow
    - Click "Deactivate" Button
    - Confirmation-Dialog erscheint
    - Confirm
    - Row zeigt "Inactive" Badge, ausgegraut
  - [ ] E2E-Test: Reactivate-Flow
    - Click "Reactivate" Button
    - Row zeigt "Active" Badge, volle Opacity
  - [ ] E2E-Test: Delete-Flow
    - Click "Delete" Button
    - Confirmation-Dialog erscheint
    - Confirm
    - Link deaktiviert
  - [ ] Integration-Test: TanStack Query Mutation + Cache-Update
  - [ ] Integration-Test: Optimistic Update + Rollback bei API-Fehler

## Dev Notes

### Architektur-Kontext

**Frontend-Architektur (aus architecture.md):**
- **TanStack Start** (SSR + CSR)
- **TanStack Router** (File-based routing, Type-safe)
- **TanStack Query** (Server-state management, Caching, Optimistic updates)
- **TanStack Form** (Type-safe forms, Validation, UX-optimized)
- **shadcn/ui** (Radix UI primitives, Tailwind-styled)
- **Zod** (Validation schemas, TypeScript inference)

**Admin Routes (CSR, kein SSR):**
- `/admin/links` → LinkManagement Page (Story 5.10)
- LinkEditDialog (diese Story)
- Layout: AdminLayout mit Nav + Sidebar
- Auth-Check: beforeLoad hook prüft Session

**API-Endpoints (aus tech-spec-epic-5.md):**
```
PATCH /api/admin/invites/:id
Requires: Session auth
Request Body (partial update):
{
  "recipientName": "John Doe Updated",  // Optional
  "message": "# Updated Message",       // Optional
  "expiresAt": "2025-12-31T23:59:59Z", // Optional
  "isActive": false                     // Deactivate
}

Response (200):
{
  "success": true,
  "invite": {
    "id": "cm3k5x...",
    "token": "cm3k5y...",
    "recipientName": "John Doe Updated",
    "message": "# Updated Message",
    "expiresAt": "2025-12-31T23:59:59Z",
    "isActive": false,
    "visitCount": 5,
    "lastVisitAt": "2025-11-03T14:30:00Z",
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-11-08T12:00:00Z"
  }
}
```

### Komponenten-Struktur

**Component Hierarchy:**
```
LinkManagement (Page from Story 5.10)
├── LinkTable
│   └── LinkTableRow (erweitert mit Actions)
│       ├── "Edit" Button → Opens LinkEditDialog
│       ├── "Deactivate" Button → Opens ConfirmDialog
│       ├── "Reactivate" Button (conditional)
│       └── "Delete" Button → Opens ConfirmDialog
├── LinkEditDialog (Modal)
│   ├── Dialog (shadcn/ui, reused from Story 5.11)
│   │   ├── Dialog Header ("Edit Personalized Link")
│   │   ├── Dialog Content
│   │   │   └── LinkForm (TanStack Form, reused)
│   │   │       ├── Token Display (Read-only)
│   │   │       ├── RecipientNameInput (prefilled)
│   │   │       ├── MessageTextarea (prefilled)
│   │   │       ├── MarkdownPreview (shows existing message)
│   │   │       ├── ExpirationDatePicker (prefilled)
│   │   │       ├── ActiveToggle (prefilled)
│   │   │       └── UpdateButton (Loading-State)
│   │   └── Dialog Footer
└── ConfirmationDialog (shadcn/ui AlertDialog)
    ├── Title ("Deactivate Link?" / "Delete Link?")
    ├── Description (Warning message)
    └── Actions (Cancel + Confirm)
```

**shadcn/ui Components benötigt:**
- `AlertDialog` (Confirmation-Dialog für Deactivate/Delete)
- `Dialog` (wiederverwendet aus Story 5.11)
- `Input`, `Textarea`, `Button`, `Switch`, `Label` (wiederverwendet)

**Neue Components:**
- `LinkEditDialog.tsx` (Modal für Link-Editing)
- `ConfirmationDialog.tsx` (wiederverwendbar für Deactivate/Delete)

### TanStack Query Update-Mutation

**Mutation Hook:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInviteDto }) => {
      return await apiClient.patch(`/api/admin/invites/${id}`, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-invites'] });

      // Snapshot previous value
      const previousInvites = queryClient.getQueryData(['admin-invites']);

      // Optimistically update cache
      queryClient.setQueryData(['admin-invites'], (old: any) => ({
        ...old,
        data: old.data.map((invite: any) =>
          invite.id === id ? { ...invite, ...data } : invite
        ),
      }));

      return { previousInvites };
    },
    onError: (err, { id, data }, context) => {
      // Rollback on error
      queryClient.setQueryData(['admin-invites'], context?.previousInvites);
      toast.error('Failed to update link');
    },
    onSuccess: (response) => {
      toast.success('Link updated successfully!');
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['admin-invites'] });
    },
  });
}
```

### Soft Delete vs. Hard Delete

**MVP-Ansatz: Soft Delete**
- Deactivate und Delete setzen beide `isActive = false`
- Grund: Statistiken bleiben erhalten (visitCount, lastVisitAt)
- Links bleiben in Datenbank, sind nur nicht mehr aufrufbar
- Vorteil: Historie und Analytics bleiben verfügbar

**Future: Dedicated Delete-Flag (Growth-Feature)**
```typescript
// Optional: Erweiterte Soft-Delete-Logik
export const UpdateInviteDtoSchema = z.object({
  // ...
  isDeleted: z.boolean().optional(), // Dedicated flag für "gelöscht"
});

// Backend-Logik:
// isActive=false + isDeleted=false → Deactivated (kann reaktiviert werden)
// isActive=false + isDeleted=true  → Deleted (nicht reaktivierbar, UI versteckt)
```

**Für MVP:** `isActive = false` genügt, kein separates `isDeleted`-Flag nötig.

### Confirmation-Dialog Best Practices

**AlertDialog vs. Dialog:**
- **AlertDialog** (shadcn/ui): Speziell für Bestätigungen
  - Destruktive Aktionen (Delete, Deactivate)
  - Fokus-Management: "Confirm" Button hat initial focus
  - Escape schließt Dialog ohne Aktion
- **Dialog** (shadcn/ui): Für komplexe Forms (Edit)

**UX-Patterns:**
- **Primary Action:** Confirm-Button (destruktiv: rot, achtung: gelb)
- **Secondary Action:** Cancel-Button (neutral)
- **Button-Reihenfolge:** Cancel links, Confirm rechts (Konsistenz)
- **Keyboard:** Enter = Confirm, Escape = Cancel

**Example:**
```typescript
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Deactivate Link?</AlertDialogTitle>
      <AlertDialogDescription>
        This link will no longer be accessible via /invite/:token. You can reactivate it later.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeactivate} className="bg-destructive">
        Deactivate
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Visual States für deaktivierte Links

**Badge-Varianten:**
- **Active:** Grün, "Active"
- **Inactive:** Grau oder Rot, "Inactive"
- **Expired:** Gelb, "Expired" (falls expiresAt < NOW())

**Row-Styling:**
```typescript
// LinkTableRow.tsx
<TableRow
  className={cn(
    "cursor-pointer hover:bg-muted/50",
    !invite.isActive && "opacity-60 bg-muted/20" // Deaktiviert
  )}
  onClick={() => handleEdit(invite)}
>
  {/* Row content */}
  <Badge variant={invite.isActive ? "success" : "secondary"}>
    {invite.isActive ? "Active" : "Inactive"}
  </Badge>
</TableRow>
```

**Conditional Button Rendering:**
```typescript
{invite.isActive ? (
  <Button variant="destructive" size="sm" onClick={handleDeactivate}>
    Deactivate
  </Button>
) : (
  <Button variant="default" size="sm" onClick={handleReactivate}>
    Reactivate
  </Button>
)}
```

### Testing-Strategie

**Unit Tests (Vitest + React Testing Library):**
- **LinkEditDialog.test.tsx:**
  - Dialog öffnet mit vorbefüllten Daten
  - Token-Feld ist read-only (disabled)
  - Form-Submit sendet Update-Mutation
- **ConfirmationDialog.test.tsx:**
  - Dialog öffnet und schließt korrekt
  - Cancel-Button schließt ohne Aktion
  - Confirm-Button triggert Callback
- **useUpdateInvite.test.tsx:**
  - Mutation sendet korrekten Request Body
  - Optimistic Update funktioniert
  - Rollback bei Fehler
  - Cache Invalidierung nach Success

**Integration Tests:**
- **Link Update Flow:**
  - TanStack Form + Zod Validierung
  - PATCH /api/admin/invites/:id mit korrektem Payload
  - CSRF-Token im Header
  - Success-Response verarbeitet
- **Optimistic Update:**
  - Cache aktualisiert vor API-Response
  - Rollback bei API-Fehler
  - Invalidierung nach Success

**E2E Tests (Playwright):**
- **Edit-Flow:**
  1. Navigate to `/admin/links`
  2. Click auf Link-Row
  3. Edit-Dialog öffnet mit vorbefüllten Daten
  4. Ändere Recipient Name: "John Doe Updated"
  5. Ändere Message: "# Updated Message"
  6. Click Submit
  7. Assert: Success-Toast erscheint
  8. Assert: Tabelle zeigt aktualisierte Daten ohne Reload
- **Deactivate-Flow:**
  1. Click "Deactivate" Button
  2. Assert: Confirmation-Dialog erscheint
  3. Click "Deactivate" (Confirm)
  4. Assert: Success-Toast "Link deactivated successfully!"
  5. Assert: Row zeigt "Inactive" Badge, ausgegraut
  6. Assert: Link nicht mehr über `/invite/:token` aufrufbar (404 oder Fehler)
- **Reactivate-Flow:**
  1. Click "Reactivate" Button auf deaktiviertem Link
  2. Assert: Success-Toast "Link reactivated successfully!"
  3. Assert: Row zeigt "Active" Badge, volle Opacity
  4. Assert: Link wieder über `/invite/:token` aufrufbar
- **Delete-Flow:**
  1. Click "Delete" Button
  2. Assert: Confirmation-Dialog erscheint
  3. Click "Delete" (Confirm)
  4. Assert: Success-Toast "Link deleted successfully!"
  5. Assert: Link deaktiviert (identisch zu Deactivate für MVP)

### Performance-Optimierungen

**Optimistic Updates:**
- Sofortige UI-Reaktion (kein Warten auf API)
- Verbesserte Perceived Performance
- TanStack Query Cache-Update vor API-Response

**Dialog Lazy Loading:**
- LinkEditDialog nur geladen wenn geöffnet (React.lazy)
- Reduziert Initial Bundle Size

**Cache Management:**
- TanStack Query Cache-Invalidierung nur bei Bedarf (onSettled)
- staleTime: 5 Minuten (Cache bleibt fresh)

### UX-Details

**Visual Feedback:**
- **Loading States:** Spinner im Update-Button, "Updating..." Text
- **Success States:** Success-Toast, Dialog schließt automatisch
- **Error States:** Error-Toast, Inline-Errors bei Validierung
- **Deactivated State:** Ausgegraut, "Inactive" Badge, visuell klar unterscheidbar

**Accessibility (WCAG AA):**
- AlertDialog hat `aria-labelledby` und `aria-describedby`
- Fokus-Management: AlertDialog fokussiert bei Öffnung
- Keyboard-Navigation: Enter = Confirm, Escape = Cancel
- Farbkontrast: Inactive-Badge mindestens 4.5:1

**Responsive Design:**
- **Mobile:** AlertDialog als Full-screen Overlay
- **Desktop:** AlertDialog als Modal mit max-width 400px
- **Edit-Dialog:** Wiederverwendet responsive Design aus Story 5.11

### Potential Gotchas

1. **Token Read-Only:**
   - Problem: User könnte versuchen, Token zu editieren
   - Lösung: Input-Feld disabled, visuell als read-only markiert

2. **Cache Key Mismatch:**
   - Problem: Optimistic Update funktioniert nicht, weil Cache Key falsch
   - Lösung: Exakt gleichen Cache Key verwenden wie in Story 5.10 (`['admin-invites', { ...params }]`)

3. **Deactivate vs. Delete:**
   - Problem: User verwechselt Deactivate und Delete
   - Lösung: Klare Labels, unterschiedliche Confirmation-Messages, visuell unterschiedliche Button-Farben

4. **Reactivate ohne Confirmation:**
   - Problem: User aktiviert Link versehentlich
   - Lösung: Reactivate ist non-destruktive Aktion, kein Confirmation-Dialog nötig (UX-Optimierung)

5. **Form Reset nach Edit:**
   - Problem: Dialog schließt, aber Form-Daten bleiben
   - Lösung: `form.reset()` nach Success-Callback

6. **CSRF-Token Missing:**
   - Problem: PATCH-Request ohne CSRF-Token → 403 Forbidden
   - Lösung: axios interceptor setzt Token automatisch aus Cookie (wiederverwendet aus Story 5.11)

### Learnings from Previous Story

**From Story 5.11 (Status: drafted - noch nicht implementiert):**

Diese Story baut direkt auf Story 5.11 auf, die den LinkForm-Component und die Create-Funktionalität implementiert. Da Story 5.11 noch nicht implementiert ist (Status: drafted), gibt es keine konkreten Learnings aus der Implementierung.

**Wichtige Wiederverwendungen aus Story 5.11:**
- **LinkForm Component:** Wird für Edit-Dialog wiederverwendet (Prefill-Mode)
- **TanStack Query Setup:** Mutation-Pattern für Create wird adaptiert für Update
- **CSRF-Token Handling:** axios interceptor wird wiederverwendet
- **Optimistic Update Pattern:** Gleiche Logik wie Create, aber mit `setQueryData` statt `push`

**Adaptierungen für Edit-Mode:**
- Form-Felder müssen vorbefüllt werden (neue Prop: `initialData`)
- Token-Feld: Neu, read-only Display
- Submit-Aktion: PATCH statt POST

### References

- [Source: docs/tech-spec-epic-5.md - AC-5: Link Editing]
- [Source: docs/tech-spec-epic-5.md - Data Models: UpdateInviteDto]
- [Source: docs/tech-spec-epic-5.md - APIs: PATCH /api/admin/invites/:id]
- [Source: docs/tech-spec-epic-5.md - Services: LinkForm, LinkEditDialog]
- [Source: docs/epics.md - Epic 5, Story 5.12]
- [Source: docs/architecture.md - Frontend Stack: TanStack Start, TanStack Form, shadcn/ui]
- [Source: docs/architecture.md - Privacy-First Patterns: Token-based Access Control]
- [Source: docs/PRD.md - MVP Features: Link-Management Dashboard]
- [Source: docs/stories/5-11-frontend-link-erstellung-dialog-mit-tanstack-form.md - LinkForm Component Reference]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
