# Story 6.1: File-Upload-Interface mit Drag & Drop

Status: drafted

## Story

Als Admin,
möchte ich CV-Dateien per Drag & Drop hochladen können,
damit die Bedienung intuitiv und effizient ist.

## Acceptance Criteria

1. **AC 6.1.1: UploadZone Component auf /admin/cv/extract Route**
   - Route `/admin/cv/extract` rendert UploadZone Component
   - AdminAuthGuard schützt Route (Session-basiert)
   - Layout integriert in Admin-Dashboard Navigation
   - Breadcrumb zeigt "Dashboard > CV Management > Extract"

2. **AC 6.1.2: Drag & Drop Funktionalität**
   - Drag & Drop Zone ist visuell erkennbar (gestrichelte Border, "Drop files here" Text)
   - Beim Hover über Zone mit File: Visuelles Feedback (Border highlight, Background color change)
   - Drop-Event akzeptiert Dateien und triggert Validierung
   - Unterstützte Formate werden angezeigt: "PDF, Markdown (.md), Plain Text (.txt)"

3. **AC 6.1.3: File-Picker als Alternative**
   - "Select File" Button verfügbar (für User ohne Drag & Drop)
   - Click öffnet nativen File-Browser-Dialog
   - File-Selection triggert selbe Validierung wie Drag & Drop
   - Button ist accessible (Keyboard-navigierbar, ARIA-Labels)

4. **AC 6.1.4: Client-seitige MIME-Type-Validierung**
   - Nur folgende MIME-Types erlaubt: `application/pdf`, `text/markdown`, `text/plain`
   - Bei ungültigem Type: Error-Toast "Invalid file type. Only PDF, Markdown, and Plain Text allowed."
   - File-Extension zusätzlich prüfen: `.pdf`, `.md`, `.txt`
   - Nicht-unterstützte Files (.exe, .zip etc.) werden rejected

5. **AC 6.1.5: Client-seitige File-Size-Validierung**
   - Max File-Size: 10MB (10485760 bytes)
   - Bei Überschreitung: Error-Toast "File too large. Maximum size: 10MB"
   - File-Size wird in menschenlesbarem Format angezeigt (z.B. "5.2 MB")
   - Validierung passiert VOR Upload-Start

6. **AC 6.1.6: Error-Toasts bei Validation-Failures**
   - shadcn/ui Toast-Component für Error-Messages
   - Error-Toast erscheint oben rechts, Auto-Dismiss nach 5s
   - Error-Messages sind klar und actionable (keine technischen Jargon)
   - Toast-Variante: "destructive" (rot, error-icon)

7. **AC 6.1.7: Success-State nach erfolgreicher Validierung**
   - Valides File zeigt "Ready to upload" Status
   - File-Name und Größe werden angezeigt
   - Grüner Check-Icon neben File-Info
   - "Upload & Extract" Button wird enabled

8. **AC 6.1.8: react-dropzone Library Integration**
   - react-dropzone (v14.x) installiert und konfiguriert
   - `accept` prop konfiguriert für PDF, Markdown, Plain Text
   - `maxSize` prop auf 10MB gesetzt
   - `onDrop` Callback implementiert für File-Handling
   - `onDropRejected` Callback für Error-Handling

## Tasks / Subtasks

- [ ] **Task 1: Route und Layout Setup** (AC: 6.1.1)
  - [ ] Route `/admin/cv/extract.tsx` in `apps/frontend/src/routes/admin/cv/` erstellen
  - [ ] TanStack Router `createFileRoute` definieren
  - [ ] AdminAuthGuard als `beforeLoad` Hook integrieren (Session-Check)
  - [ ] AdminLayout Component einbinden (Nav, Sidebar, Breadcrumb)
  - [ ] Breadcrumb-Pfad konfigurieren: "Dashboard > CV Management > Extract"
  - [ ] Unit-Test: Route rendert, Auth-Guard blockiert unauthenticated User

- [ ] **Task 2: UploadZone Component Basis** (AC: 6.1.2, 6.1.3)
  - [ ] `apps/frontend/src/components/UploadZone.tsx` Component erstellen
  - [ ] react-dropzone (v14.x) via pnpm installieren
  - [ ] `useDropzone` Hook konfigurieren mit accept/maxSize
  - [ ] Drag & Drop Zone UI implementieren (gestrichelte Border, Icon, Text)
  - [ ] "Select File" Button für File-Picker (Alternative zu Drag & Drop)
  - [ ] Visual Feedback bei Drag-Hover (CSS classes, isDragActive state)
  - [ ] Props: `onFileAccepted`, `onFileRejected`
  - [ ] Unit-Test: Component rendert, Drag-Hover funktioniert

- [ ] **Task 3: Client-seitige File-Validierung** (AC: 6.1.4, 6.1.5)
  - [ ] MIME-Type-Validierung in `onDrop` Callback
  - [ ] Allowed Types: `application/pdf`, `text/markdown`, `text/plain`
  - [ ] File-Extension-Validierung: `.pdf`, `.md`, `.txt`
  - [ ] File-Size-Validierung: Max 10MB
  - [ ] Helper-Function: `validateFile(file: File)` mit Return Type `{valid: boolean, error?: string}`
  - [ ] Human-Readable File-Size Formatter (z.B. 5242880 → "5.0 MB")
  - [ ] Unit-Test: Valide Files passieren, invalide Files werden rejected

- [ ] **Task 4: Error-Handling mit shadcn/ui Toasts** (AC: 6.1.6)
  - [ ] shadcn/ui Toast Component installieren (falls noch nicht vorhanden)
  - [ ] `useToast` Hook in UploadZone einbinden
  - [ ] Error-Toast bei ungültigem MIME-Type: "Invalid file type. Only PDF, Markdown, and Plain Text allowed."
  - [ ] Error-Toast bei File-Size-Überschreitung: "File too large. Maximum size: 10MB"
  - [ ] Toast-Konfiguration: Variante "destructive", Auto-Dismiss 5s
  - [ ] Toast erscheint oben rechts (Position konfigurieren)
  - [ ] Unit-Test: Error-Toasts werden korrekt getriggert

- [ ] **Task 5: Success-State UI** (AC: 6.1.7)
  - [ ] State für accepted File: `const [file, setFile] = useState<File | null>(null)`
  - [ ] Success-State UI: File-Name, File-Size, Check-Icon (grün)
  - [ ] "Ready to upload" Badge oder Text-Indikator
  - [ ] "Upload & Extract" Button (enabled nur wenn File accepted)
  - [ ] "Remove" Button zum Resetten (Clear File, zurück zu Upload-Zone)
  - [ ] Unit-Test: Success-State rendert korrekt nach File-Accept

- [ ] **Task 6: Styling und UX-Polish** (AC: 6.1.2, 6.1.7)
  - [ ] Tailwind CSS Styling für Upload-Zone:
    - Gestrichelte Border (`border-dashed`)
    - Hover-State: Border highlight, Background change
    - Icon: Upload-Icon (Lucide React Icons)
    - Typography: Clear "Drop files here or click to select"
  - [ ] Success-State Styling:
    - Card-Layout mit File-Info
    - Check-Icon (grün, Lucide `CheckCircle`)
    - File-Size in grauem Text
  - [ ] Responsive Design: Mobile-optimiert (touch-friendly)
  - [ ] Accessibility: ARIA-Labels, Keyboard-Navigation
  - [ ] Visual-Test: Component sieht gut aus auf Desktop/Mobile

- [ ] **Task 7: Integration in extract.tsx Route** (AC: 6.1.1, 6.1.7)
  - [ ] UploadZone Component in `extract.tsx` importieren
  - [ ] State-Management: File-State wird von Route verwaltet
  - [ ] `onFileAccepted` Handler: setFile(file)
  - [ ] `onFileRejected` Handler: Toast-Notification
  - [ ] "Upload & Extract" Button triggert Next-Step (Placeholder für Story 6.2)
  - [ ] Integration-Test: Route → UploadZone → File-Accept funktioniert

- [ ] **Task 8: Unit und E2E Tests** (AC: alle)
  - [ ] Unit-Test: UploadZone Component (Rendering, Drag & Drop, Validation)
  - [ ] Unit-Test: File-Validierung (MIME-Type, Size, Extensions)
  - [ ] Unit-Test: Toast-Notifications (Error-Cases)
  - [ ] E2E-Test (Playwright):
    - Navigate to /admin/cv/extract (als eingeloggter Admin)
    - Drag & Drop valides PDF → Success-State
    - Drag & Drop .exe File → Error-Toast
    - Drag & Drop 15MB File → Error-Toast
    - Select File via File-Picker → Success-State
  - [ ] Visual-Regression-Test (optional): Screenshot-Vergleich

## Dev Notes

### Architektur-Kontext

**Frontend-Stack (aus tech-spec-epic-6.md):**
- **TanStack Start**: SSR + CSR Framework
- **TanStack Router**: File-based routing, Type-safe
- **React 19**: Stable, TypeScript
- **shadcn/ui**: Radix UI primitives, Tailwind-styled
- **Tailwind CSS v4**: Utility-first CSS framework

**Admin Routes (CSR, kein SSR):**
- `/admin/cv/extract` → Diese Story (File-Upload-Interface)
- Layout: AdminLayout mit Nav + Sidebar
- Auth-Check: beforeLoad hook prüft Session

**NPM Dependencies (neu für diese Story):**
- **react-dropzone** (v14.x): Drag & Drop File Upload
  - Why: Popular (10M/week), accessible, customizable
  - React 19 kompatibel
  - Zero transitive dependencies

**Existing Dependencies (genutzt):**
- **@tanstack/react-router**: Routing
- **shadcn/ui**: Toast Component
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

### Component-Struktur

**Component Hierarchy:**
```
/admin/cv/extract (Route)
└── UploadZone (Component)
    ├── Drag & Drop Zone (react-dropzone)
    │   ├── Upload Icon (Lucide)
    │   ├── "Drop files here" Text
    │   └── "Select File" Button
    ├── Success State (conditionally rendered)
    │   ├── File Icon (Lucide)
    │   ├── File Name + Size
    │   ├── Check Icon (grün)
    │   └── "Remove" Button
    └── Toast Notifications (shadcn/ui)
        ├── Error: Invalid Type
        └── Error: File too large
```

**UploadZone Component Props:**
```typescript
interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  onFileRejected: (error: string) => void;
  acceptedFile?: File | null; // Current accepted file
  onRemoveFile?: () => void;
}
```

### File-Validierung Logik

**Allowed MIME Types:**
- `application/pdf` (.pdf)
- `text/markdown` (.md)
- `text/plain` (.txt)

**Validation Flow:**
```
1. User drops file OR selects via File-Picker
2. Check MIME-Type → Not in allowed list? → Reject
3. Check File Extension → Not .pdf/.md/.txt? → Reject
4. Check File Size → >10MB? → Reject
5. All checks pass → Accept File
```

**Error Messages:**
- MIME-Type Rejection: "Invalid file type. Only PDF, Markdown, and Plain Text allowed."
- Size Rejection: "File too large. Maximum size: 10MB"

**File-Size Formatter:**
```typescript
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

### react-dropzone Configuration

**useDropzone Hook Setup:**
```typescript
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: {
    'application/pdf': ['.pdf'],
    'text/markdown': ['.md'],
    'text/plain': ['.txt'],
  },
  maxSize: 10485760, // 10MB in bytes
  multiple: false, // Only single file
  onDrop: (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      handleRejection(rejectedFiles[0]);
    }
    if (acceptedFiles.length > 0) {
      handleAcceptance(acceptedFiles[0]);
    }
  },
});
```

**Rejection Reasons (from react-dropzone):**
- `file-too-large`: File exceeds maxSize
- `file-invalid-type`: MIME-Type not in accept list

### Styling & UX

**Upload-Zone Styling (Idle State):**
```tsx
<div
  {...getRootProps()}
  className={cn(
    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
    isDragActive
      ? "border-primary bg-primary/10"
      : "border-muted hover:border-primary/50"
  )}
>
  <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
  <p className="mt-4 text-sm text-muted-foreground">
    Drop files here or click to select
  </p>
  <p className="mt-1 text-xs text-muted-foreground">
    PDF, Markdown, or Plain Text (max 10MB)
  </p>
  <input {...getInputProps()} />
</div>
```

**Success-State Styling:**
```tsx
<div className="border rounded-lg p-4 bg-muted/20">
  <div className="flex items-center gap-3">
    <FileIcon className="h-8 w-8 text-primary" />
    <div className="flex-1">
      <p className="font-medium">{file.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatFileSize(file.size)}
      </p>
    </div>
    <CheckCircle className="h-6 w-6 text-green-600" />
  </div>
  <div className="mt-3 flex gap-2">
    <Button onClick={onRemoveFile} variant="outline" size="sm">
      Remove
    </Button>
    <Button onClick={onUpload} variant="default" size="sm">
      Upload & Extract
    </Button>
  </div>
</div>
```

**Mobile UX:**
- Touch-Targets: Buttons mindestens 44x44px
- Responsive Text: Lesbar auf kleinen Screens
- Upload-Zone: Größer auf Mobile (mehr Tap-Target)

### Testing-Strategie

**Unit Tests (Vitest + React Testing Library):**
- **UploadZone.test.tsx:**
  - Component rendert korrekt (Idle State)
  - Drag-Hover zeigt visuelles Feedback (isDragActive)
  - File-Accept triggert onFileAccepted Callback
  - File-Reject triggert onFileRejected Callback
  - Success-State zeigt File-Info
  - Remove-Button resettet State

- **file-validation.test.ts:**
  - Valide PDF passiert Validierung
  - Invalider MIME-Type wird rejected
  - File >10MB wird rejected
  - File-Extension-Check funktioniert

**E2E Tests (Playwright):**
- **extract.spec.ts:**
  1. Navigate to `/admin/cv/extract` (als eingeloggter Admin)
  2. Verify: Upload-Zone rendert
  3. Drag & Drop valides 5MB PDF
  4. Assert: Success-State zeigt "Ready to upload"
  5. Assert: File-Name und Größe korrekt angezeigt
  6. Drop .exe File
  7. Assert: Error-Toast "Invalid file type" erscheint
  8. Drop 15MB PDF
  9. Assert: Error-Toast "File too large" erscheint
  10. Click "Select File" Button, wähle .md File
  11. Assert: Success-State zeigt Markdown File

### Project Structure Notes

**File Locations:**
- Route: `apps/frontend/src/routes/admin/cv/extract.tsx`
- Component: `apps/frontend/src/components/UploadZone.tsx`
- Utilities: `apps/frontend/src/lib/utils/file-validation.ts` (Helper für Validierung)
- Tests: `apps/frontend/src/components/UploadZone.test.tsx`
- E2E: `apps/frontend/e2e/extract.spec.ts`

**Dependencies to Install:**
```bash
pnpm add react-dropzone@^14.0.0
# shadcn/ui toast already installed from Epic 5
```

**Import Structure:**
```typescript
// Route: extract.tsx
import { UploadZone } from '@/components/UploadZone';
import { useState } from 'react';

// Component: UploadZone.tsx
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { UploadIcon, FileIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
```

### Learnings from Previous Story

**From Story 5-12 (Status: drafted - noch nicht implementiert):**

Story 5-12 (Frontend Link-Bearbeitung und Deaktivierung) ist noch nicht implementiert. Daher gibt es keine konkreten Learnings aus der tatsächlichen Entwicklung.

**Relevant Context für Story 6-1:**
- **AdminLayout und Auth:** Story 6-1 nutzt selbes Admin-Dashboard-Layout wie Epic 5
- **shadcn/ui Components:** Toast-Component wurde in Epic 5 eingeführt, kann wiederverwendet werden
- **AdminAuthGuard:** Session-basierte Auth aus Epic 5 wird für `/admin/cv/extract` genutzt

**Neue Konzepte in Story 6-1:**
- **File-Upload:** Erste Story mit File-Handling (Drag & Drop)
- **Client-seitige Validierung:** MIME-Type und Size-Checks vor Backend-Upload
- **react-dropzone:** Neue Library, nicht in Epic 5 verwendet

**Wichtig für Implementierung:**
- AdminAuthGuard Pattern aus Epic 5 wiederverwenden (TanStack Router `beforeLoad`)
- Toast-Notification-Pattern konsistent mit Epic 5 halten
- AdminLayout Navigation um "CV Management > Extract" erweitern

### Potential Gotchas

1. **MIME-Type vs. File-Extension:**
   - Problem: User könnte .exe als .pdf umbenennen
   - Lösung: BEIDE prüfen (MIME-Type UND Extension)
   - react-dropzone prüft nur MIME-Type, Extension-Check zusätzlich implementieren

2. **File-Size-Limit Client vs. Server:**
   - Problem: Client-seitige Validierung kann umgangen werden
   - Lösung: Server-seitige Validierung in Story 6.2 (Multer 10MB limit)
   - Client-Validierung ist UX-Optimierung, nicht Security-Maßnahme

3. **react-dropzone Version Compatibility:**
   - Problem: v14.x benötigt React 19
   - Lösung: Projekt nutzt React 19 (stable) → kompatibel
   - Verify: Check peer dependencies bei Installation

4. **Mobile File-Picker:**
   - Problem: Drag & Drop funktioniert nicht auf mobilen Geräten
   - Lösung: "Select File" Button als Alternative (react-dropzone `getInputProps()`)
   - Input-Element ist immer verfügbar, auch bei Drag & Drop

5. **Toast-Notification Spam:**
   - Problem: User droppt mehrere ungültige Files hintereinander → Toast-Overload
   - Lösung: Toasts mit gleicher Message deduplicaten oder nur letzten anzeigen
   - shadcn/ui Toast hat built-in Deduplication (gleiche ID)

6. **File-State Management:**
   - Problem: File-State zwischen Route und Component synchronisieren
   - Lösung: File-State in Route (extract.tsx), als Prop an UploadZone
   - UploadZone ist Controlled Component (kein interner File-State)

### References

- [Source: docs/tech-spec-epic-6.md - Story 6.1: File-Upload-Interface]
- [Source: docs/tech-spec-epic-6.md - NPM Dependencies: react-dropzone]
- [Source: docs/tech-spec-epic-6.md - Frontend Components: UploadZone, ProgressSteps]
- [Source: docs/epics.md - Epic 6, Story 6.1]
- [Source: docs/PRD.md - FR-5: KI-gestützte CV-Daten-Extraktion, Upload-Interface]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
