# Story 5.11: Frontend Link-Erstellung-Dialog mit TanStack Form

Status: drafted

## Story

Als Admin,
möchte ich über ein Formular neue Links mit personalisierter Nachricht erstellen,
damit ich schnell personalisierte Invite-Links generieren kann.

## Acceptance Criteria

1. **AC 5.11.1: Create Link Button**
   - "Create Link" Button ist prominent auf `/admin/links` Seite platziert
   - Button verwendet shadcn/ui Button Component (Primary Variant)
   - Click öffnet Dialog mit LinkForm
   - Button zeigt Icon (z.B. Plus-Icon) + "Create Link" Label

2. **AC 5.11.2: Dialog Component**
   - shadcn/ui Dialog Component wird verwendet
   - Dialog hat Title: "Create Personalized Link"
   - Dialog ist modal (Backdrop dimmt Hintergrund, schließbar per Escape oder X-Button)
   - Dialog ist responsive (Mobile: Full-screen, Desktop: Max-width 600px)

3. **AC 5.11.3: Form-Felder mit TanStack Form**
   - **Recipient Name** (optional):
     - Input Component (shadcn/ui)
     - Placeholder: "e.g., John Doe"
     - Label: "Recipient Name (Optional)"
     - Max Length: 100 Zeichen
   - **Personalized Message** (optional):
     - Textarea Component (shadcn/ui)
     - Placeholder: "Write a personalized message in Markdown..."
     - Label: "Personalized Message (Optional)"
     - Height: Auto-expanding (min 100px, max 300px)
     - Max Length: 1000 Zeichen
   - **Expiration Date** (optional):
     - Datepicker mit shadcn/ui Popover + Calendar Component
     - Label: "Expiration Date (Optional)"
     - Min Date: Heute
     - Max Date: +1 Jahr
     - Format: date-fns (z.B. "Dec 31, 2025")
   - **Active Status**:
     - Toggle/Switch Component (shadcn/ui)
     - Label: "Active"
     - Default: true (checked)

4. **AC 5.11.4: Live Markdown-Preview**
   - Markdown-Preview-Komponente unterhalb Textarea
   - Verwendet react-markdown für sichere Rendering
   - Preview zeigt Live-Update beim Tippen (debounced, 300ms)
   - Styling: Grauer Rahmen, leicht abgesetzter Hintergrund
   - Wenn leer: "Preview will appear here..."

5. **AC 5.11.5: Form-Validierung mit Zod**
   - TanStack Form integriert CreateInviteDtoSchema (Zod)
   - Inline-Fehler unterhalb Felder angezeigt
   - Validierungsregeln:
     - Recipient Name: Optional, max 100 Zeichen
     - Message: Optional, max 1000 Zeichen
     - Expiration Date: Optional, muss in Zukunft liegen
     - Active Status: Boolean, default true
   - Submit-Button disabled wenn Validierung fehlschlägt

6. **AC 5.11.6: Form-Submit mit TanStack Query Mutation**
   - Bei Submit: POST /api/admin/invites mit Form-Daten
   - TanStack Query Mutation Hook (`useCreateInvite`)
   - Request Body: `{ recipientName?, message?, expiresAt?, isActive }`
   - CSRF-Token automatisch im Header (`X-CSRF-Token`)
   - Error-Handling: API-Fehler → Toast-Notification mit Error-Message

7. **AC 5.11.7: Success-Flow**
   - Dialog schließt automatisch nach erfolgreichem Submit
   - Success-Toast-Notification: "Link created successfully!"
   - Generierte URL wird angezeigt in separatem Success-Dialog:
     - URL als Text (z.B. `https://lebenslauf.example.com/invite/cm3k5y...`)
     - Copy-to-Clipboard Button (Icon: Copy → Checkmark nach Click)
     - Close Button ("Done")
   - Neuer Link erscheint sofort in Link-Tabelle (Story 5.10)

8. **AC 5.11.8: Optimistic Update mit TanStack Query**
   - Neuer Link wird optimistisch in TanStack Query Cache eingefügt
   - Tabelle (Story 5.10) zeigt neuen Link sofort (ohne Reload)
   - Bei API-Fehler: Rollback des optimistischen Updates
   - Cache Key: `['admin-invites', { ...query params }]`
   - Invalidiert alle relevanten Query Keys nach Success

9. **AC 5.11.9: Loading-States und UX-Feedback**
   - Submit-Button zeigt Loading-Spinner während API-Call
   - Submit-Button Text ändert sich: "Create Link" → "Creating..."
   - Submit-Button disabled während Loading
   - Dialog nicht schließbar während API-Call
   - Alle Form-Felder disabled während Loading

## Tasks / Subtasks

- [ ] **Task 1: LinkCreateDialog Component erstellen** (AC: 5.11.1, 5.11.2)
  - [ ] LinkCreateDialog.tsx Component in `apps/frontend/src/components/admin/` anlegen
  - [ ] shadcn/ui Dialog Component importieren und einrichten
  - [ ] Dialog State Management (open/close) mit useState
  - [ ] "Create Link" Button auf `/admin/links` Seite integrieren
  - [ ] Dialog öffnet bei Button-Click
  - [ ] Dialog responsive Styling (Mobile: Full-screen, Desktop: Max-width 600px)
  - [ ] Unit-Test: Dialog öffnet und schließt korrekt

- [ ] **Task 2: TanStack Form Setup und Form-Felder** (AC: 5.11.3)
  - [ ] TanStack Form Hook in LinkCreateDialog integrieren
  - [ ] Form-Felder erstellen:
    - Recipient Name Input (shadcn/ui Input)
    - Personalized Message Textarea (shadcn/ui Textarea, auto-expanding)
    - Expiration Date Datepicker (shadcn/ui Popover + Calendar + date-fns)
    - Active Status Toggle (shadcn/ui Switch)
  - [ ] Labels und Placeholders hinzufügen
  - [ ] Auto-expanding Textarea implementieren (min 100px, max 300px)
  - [ ] Datepicker: Min Date = Heute, Max Date = +1 Jahr
  - [ ] Default-Werte setzen (Active: true)
  - [ ] Unit-Test: Alle Felder rendern korrekt

- [ ] **Task 3: Zod-Schema-Integration und Validierung** (AC: 5.11.5)
  - [ ] CreateInviteDtoSchema aus `@cv-hub/shared-types` importieren
  - [ ] TanStack Form mit Zod-Validator konfigurieren
  - [ ] Inline-Error-Messages unterhalb Feldern anzeigen
  - [ ] Validierungsregeln testen:
    - Recipient Name: Optional, max 100 Zeichen
    - Message: Optional, max 1000 Zeichen
    - Expiration Date: Muss in Zukunft liegen
  - [ ] Submit-Button disabled wenn Validierung fehlschlägt
  - [ ] Unit-Test: Validierung verhindert ungültige Submits

- [ ] **Task 4: Live Markdown-Preview** (AC: 5.11.4)
  - [ ] MarkdownPreview Sub-Component erstellen
  - [ ] react-markdown Library integrieren
  - [ ] Preview unterhalb Textarea rendern
  - [ ] Debounced Update (300ms) implementieren (useDebouncedValue Hook)
  - [ ] Empty State: "Preview will appear here..."
  - [ ] Styling: Grauer Rahmen, abgesetzter Hintergrund
  - [ ] Unit-Test: Preview zeigt Markdown korrekt

- [ ] **Task 5: TanStack Query Mutation Hook** (AC: 5.11.6)
  - [ ] `useCreateInvite` Hook in `apps/frontend/src/lib/api/admin-invites.ts` erstellen
  - [ ] POST /api/admin/invites Endpoint konfigurieren
  - [ ] TanStack Query `useMutation` Hook verwenden
  - [ ] CSRF-Token automatisch im Header einfügen (axios interceptor)
  - [ ] Error-Handling: onError Callback → Toast-Notification
  - [ ] Success-Handling: onSuccess Callback → Dialog schließen + Success-Toast
  - [ ] Integration-Test: API-Call mit korrektem Request Body

- [ ] **Task 6: Optimistic Update Implementierung** (AC: 5.11.8)
  - [ ] `onMutate` Callback: Optimistisches Einfügen in Cache
  - [ ] Cache Key: `['admin-invites', { ...query params }]`
  - [ ] `queryClient.setQueryData` zum Aktualisieren des Cache
  - [ ] `onError` Callback: Rollback bei Fehler
  - [ ] `onSettled` Callback: Invalidate alle relevanten Query Keys
  - [ ] Integration-Test: Optimistic Update funktioniert, Rollback bei Fehler

- [ ] **Task 7: Success-Dialog mit URL und Copy-Button** (AC: 5.11.7)
  - [ ] SuccessDialog Sub-Component erstellen
  - [ ] Zeigt generierte URL aus API-Response
  - [ ] Copy-to-Clipboard Button implementieren
    - `navigator.clipboard.writeText()` API verwenden
    - Fallback für ältere Browser (textarea-copy-Methode)
    - Icon-Wechsel: Copy → Checkmark für 2s
    - Toast-Notification: "URL copied to clipboard!"
  - [ ] "Done" Button schließt Success-Dialog
  - [ ] Unit-Test: Copy-Funktion kopiert korrekt

- [ ] **Task 8: Loading-States und UX-Feedback** (AC: 5.11.9)
  - [ ] Submit-Button Loading-State implementieren
    - Spinner-Icon während API-Call
    - Text: "Create Link" → "Creating..."
    - Button disabled während Loading
  - [ ] Alle Form-Felder disabled während Loading
  - [ ] Dialog nicht schließbar während API-Call (Dialog Escape/Close disabled)
  - [ ] Unit-Test: Loading-States korrekt angezeigt

- [ ] **Task 9: Integration und E2E-Tests** (AC: alle)
  - [ ] E2E-Test (Playwright): Kompletter Flow
    - Navigate zu `/admin/links`
    - Click "Create Link" Button
    - Fill Form (Recipient, Message, Date, Active)
    - Submit Form
    - Success-Dialog erscheint mit URL
    - Copy URL funktioniert
    - Neuer Link in Tabelle sichtbar
  - [ ] E2E-Test: Validierungs-Fehler angezeigt bei ungültigen Daten
  - [ ] E2E-Test: Optimistic Update + Rollback bei API-Fehler
  - [ ] Integration-Test: TanStack Query Mutation + Cache-Update

## Dev Notes

### Architektur-Kontext

**Frontend-Architektur (aus architecture.md):**
- **TanStack Start** (SSR + CSR)
- **TanStack Router** (File-based routing, Type-safe)
- **TanStack Query** (Server-state management, Caching, Optimistic updates)
- **TanStack Form** (Type-safe forms, Validation, UX-optimized)
- **shadcn/ui** (Radix UI primitives, Tailwind-styled, Copy-paste ownership)
- **react-markdown** (Secure Markdown rendering, no dangerouslySetInnerHTML)
- **Zod** (Validation schemas, TypeScript inference)
- **date-fns** (Date formatting, Tree-shakable, Lightweight)

**Admin Routes (CSR, kein SSR):**
- `/admin/links` → LinkManagement Page (Story 5.10)
- `/admin/links` → LinkCreateDialog (diese Story)
- Layout: AdminLayout mit Nav + Sidebar
- Auth-Check: beforeLoad hook prüft Session

**API-Endpoint (aus tech-spec-epic-5.md):**
```
POST /api/admin/invites
Requires: Session auth
Request Body:
{
  "recipientName": "John Doe",        // Optional
  "message": "# Welcome John",        // Optional, Markdown
  "expiresAt": "2025-12-31T23:59:59Z", // Optional, ISO 8601
  "isActive": true                     // Default true
}

Response (201):
{
  "success": true,
  "invite": {
    "id": "cm3k5x...",
    "token": "cm3k5y...",
    "recipientName": "John Doe",
    "message": "# Welcome John",
    "expiresAt": "2025-12-31T23:59:59Z",
    "isActive": true,
    "visitCount": 0,
    "lastVisitAt": null,
    "createdAt": "2025-11-08T10:00:00Z",
    "updatedAt": "2025-11-08T10:00:00Z"
  },
  "url": "https://lebenslauf.example.com/invite/cm3k5y..."
}
```

### Komponenten-Struktur

**Component Hierarchy:**
```
LinkManagement (Page from Story 5.10)
├── "Create Link" Button
└── LinkCreateDialog (Modal)
    ├── Dialog (shadcn/ui)
    │   ├── Dialog Header ("Create Personalized Link")
    │   ├── Dialog Content
    │   │   └── LinkForm (TanStack Form)
    │   │       ├── RecipientNameInput (shadcn/ui Input)
    │   │       ├── MessageTextarea (shadcn/ui Textarea)
    │   │       ├── MarkdownPreview (react-markdown)
    │   │       ├── ExpirationDatePicker (shadcn/ui Popover + Calendar)
    │   │       ├── ActiveToggle (shadcn/ui Switch)
    │   │       └── SubmitButton (Loading-State)
    │   └── Dialog Footer
    └── SuccessDialog (Nested)
        ├── Generated URL Display
        ├── CopyButton (Clipboard API)
        └── Done Button
```

**shadcn/ui Components benötigt:**
- `Dialog` (Modal wrapper)
- `Input` (Recipient Name)
- `Textarea` (Personalized Message)
- `Button` (Submit, Copy, Close)
- `Popover` (Datepicker container)
- `Calendar` (Date selection)
- `Switch` (Active toggle)
- `Label` (Form labels)

### TanStack Form Integration

**Form Setup:**
```typescript
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { CreateInviteDtoSchema } from '@cv-hub/shared-types';

const form = useForm({
  defaultValues: {
    recipientName: '',
    message: '',
    expiresAt: null,
    isActive: true,
  },
  validatorAdapter: zodValidator,
  validators: {
    onChange: CreateInviteDtoSchema,
  },
  onSubmit: async ({ value }) => {
    await createInviteMutation.mutateAsync(value);
  },
});
```

**Field Example:**
```typescript
<form.Field name="recipientName">
  {(field) => (
    <>
      <Label>Recipient Name (Optional)</Label>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="e.g., John Doe"
      />
      {field.state.meta.errors && (
        <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
      )}
    </>
  )}
</form.Field>
```

### TanStack Query Optimistic Updates

**Mutation Hook:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInviteDto) => {
      return await apiClient.post('/api/admin/invites', data);
    },
    onMutate: async (newInvite) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-invites'] });

      // Snapshot previous value
      const previousInvites = queryClient.getQueryData(['admin-invites']);

      // Optimistically update cache
      queryClient.setQueryData(['admin-invites'], (old: any) => ({
        ...old,
        data: [
          {
            ...newInvite,
            id: 'temp-id', // Temporary ID
            token: 'temp-token',
            visitCount: 0,
            createdAt: new Date().toISOString(),
          },
          ...old.data,
        ],
      }));

      return { previousInvites };
    },
    onError: (err, newInvite, context) => {
      // Rollback on error
      queryClient.setQueryData(['admin-invites'], context?.previousInvites);
      toast.error('Failed to create link');
    },
    onSuccess: (response) => {
      toast.success('Link created successfully!');
      // Show success dialog with URL
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['admin-invites'] });
    },
  });
}
```

### Markdown Preview Implementation

**Debounced Preview:**
```typescript
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function MarkdownPreview({ content }: { content: string }) {
  const debouncedContent = useDebouncedValue(content, 300);

  return (
    <div className="border rounded-md p-4 bg-muted/50 min-h-[100px]">
      {debouncedContent ? (
        <ReactMarkdown>{debouncedContent}</ReactMarkdown>
      ) : (
        <p className="text-muted-foreground">Preview will appear here...</p>
      )}
    </div>
  );
}
```

**Security Note:**
- react-markdown rendert sicher (kein `dangerouslySetInnerHTML`)
- XSS-Prevention built-in
- HTML-Tags werden escaped

### Datepicker Integration

**shadcn/ui Calendar + Popover:**
```typescript
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      {expiresAt ? format(expiresAt, 'PPP') : 'Pick a date'}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={expiresAt}
      onSelect={handleDateChange}
      disabled={(date) => date < new Date() || date > add(new Date(), { years: 1 })}
    />
  </PopoverContent>
</Popover>
```

**Date Constraints:**
- Min: Heute (verhindert vergangene Daten)
- Max: +1 Jahr (verhindert unrealistische Ablaufdaten)

### Copy-to-Clipboard Implementation

**Modern Clipboard API mit Fallback:**
```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API (HTTPS required)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed', err);
    }
  }

  // Fallback for older browsers or HTTP
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('Fallback copy failed', err);
    return false;
  }
}

// Usage in Component
const handleCopy = async () => {
  const success = await copyToClipboard(generatedUrl);
  if (success) {
    setCopied(true);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
  } else {
    toast.error('Failed to copy URL');
  }
};
```

**Visual Feedback:**
- Icon wechselt von Copy → Checkmark für 2s
- Toast-Notification bestätigt Erfolg

### CSRF-Token Handling

**Automatic CSRF Token Injection:**
```typescript
// In axios instance setup (apps/frontend/src/lib/api/client.ts)
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Include cookies
});

// Request interceptor: Add CSRF token from cookie to header
apiClient.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

export default apiClient;
```

**Backend CSRF Validation:**
- csurf Middleware prüft Token (Story 5.6)
- Fehlender Token → 403 Forbidden

### Testing-Strategie

**Unit Tests (Vitest + React Testing Library):**
- **LinkCreateDialog.test.tsx:**
  - Dialog öffnet und schließt korrekt
  - Alle Form-Felder rendern
  - Default-Werte korrekt gesetzt (Active: true)
- **MarkdownPreview.test.tsx:**
  - Preview zeigt Markdown korrekt
  - Debounce funktioniert (300ms Verzögerung)
  - Empty State angezeigt wenn leer
- **useCreateInvite.test.tsx:**
  - Mutation sendet korrekten Request Body
  - Optimistic Update funktioniert
  - Rollback bei Fehler
  - Cache Invalidierung nach Success

**Integration Tests:**
- **LinkForm Integration:**
  - TanStack Form + Zod Validierung
  - Inline-Errors angezeigt
  - Submit disabled bei ungültigen Daten
- **API Integration:**
  - POST /api/admin/invites mit korrektem Payload
  - CSRF-Token im Header
  - Success-Response verarbeitet

**E2E Tests (Playwright):**
- **Happy Path:**
  1. Navigate to `/admin/links`
  2. Click "Create Link" Button
  3. Fill Form: Recipient "John Doe", Message "# Welcome", Date "2025-12-31", Active checked
  4. Click Submit
  5. Assert: Success-Dialog erscheint mit URL
  6. Click Copy Button
  7. Assert: Toast "URL copied"
  8. Close Success-Dialog
  9. Assert: Neuer Link in Tabelle sichtbar
- **Validation Error:**
  1. Open Dialog
  2. Enter Message > 1000 Zeichen
  3. Assert: Error-Message "Message too long"
  4. Submit-Button disabled
- **API Error:**
  1. Mock API-Fehler (500)
  2. Submit Form
  3. Assert: Error-Toast angezeigt
  4. Assert: Optimistic Update rollback (Link nicht in Tabelle)

**Test Data:**
- Mock Invites in TanStack Query Cache
- Mock API-Responses (Success, Error)
- Sample Markdown-Texte für Preview-Tests

### Performance-Optimierungen

**Debounced Markdown-Preview:**
- 300ms Verzögerung verhindert Re-Rendering bei jedem Tastendruck
- Performance-Vorteil bei langen Texten

**TanStack Query Caching:**
- Optimistic Update: Sofortige UI-Reaktion (kein Warten auf API)
- Cache Invalidierung nur bei Bedarf (onSettled)
- staleTime: 5 Minuten (Cache bleibt fresh)

**Lazy Loading:**
- Dialog-Content wird nur bei Öffnung geladen
- React.lazy für Success-Dialog (optional)

### UX-Details

**Visual Feedback:**
- **Loading States:** Spinner im Submit-Button, "Creating..." Text
- **Success States:** Success-Toast, Success-Dialog mit URL
- **Error States:** Error-Toast, Inline-Errors bei Validierung
- **Copy Feedback:** Icon-Wechsel (Copy → Checkmark), Toast

**Accessibility (WCAG AA):**
- Alle Form-Felder haben Labels
- Inline-Errors haben `aria-describedby`
- Dialog hat `aria-labelledby` und `aria-describedby`
- Keyboard-Navigation funktioniert (Tab, Enter, Escape)
- Focus-Management: Dialog fokussiert bei Öffnung

**Responsive Design:**
- **Mobile:** Dialog als Full-screen Overlay
- **Tablet:** Dialog als Modal mit 80% width
- **Desktop:** Dialog als Modal mit max-width 600px
- **Textarea:** Auto-expanding (min 100px, max 300px)
- **Datepicker:** Touch-friendly auf Mobile

### Potential Gotchas

1. **CSRF-Token Missing:**
   - Problem: POST-Request ohne CSRF-Token → 403 Forbidden
   - Lösung: axios interceptor setzt Token automatisch aus Cookie

2. **Clipboard API HTTPS-Only:**
   - Problem: `navigator.clipboard` funktioniert nicht auf HTTP
   - Lösung: Fallback auf `document.execCommand('copy')`

3. **TanStack Query Cache Key Mismatch:**
   - Problem: Optimistic Update funktioniert nicht, weil Cache Key falsch
   - Lösung: Exakt gleichen Cache Key verwenden wie in Story 5.10 (`['admin-invites', { ...params }]`)

4. **Date Timezone Issues:**
   - Problem: Datepicker in lokaler Timezone, API erwartet UTC ISO 8601
   - Lösung: date-fns `formatISO()` konvertiert automatisch zu UTC

5. **Textarea Auto-Expand Performance:**
   - Problem: Große Texte verursachen Performance-Issues
   - Lösung: Max-height 300px, Scroll danach

6. **Markdown XSS:**
   - Problem: User-generiertes Markdown könnte XSS enthalten
   - Lösung: react-markdown rendert sicher (kein dangerouslySetInnerHTML)

7. **Form Reset nach Success:**
   - Problem: Dialog schließt, aber Form-Daten bleiben
   - Lösung: `form.reset()` nach Success-Callback

### References

- [Source: docs/tech-spec-epic-5.md - AC-4: Link Creation]
- [Source: docs/tech-spec-epic-5.md - Data Models: CreateInviteDto, InviteQueryDto]
- [Source: docs/tech-spec-epic-5.md - APIs: POST /api/admin/invites]
- [Source: docs/tech-spec-epic-5.md - Services: LinkForm, MarkdownPreview]
- [Source: docs/epics.md - Epic 5, Story 5.11]
- [Source: docs/architecture.md - Frontend Stack: TanStack Start, TanStack Form, shadcn/ui]
- [Source: docs/architecture.md - Privacy-First Patterns: Token-based Access Control]
- [Source: docs/PRD.md - MVP Features: Link-Management Dashboard]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
