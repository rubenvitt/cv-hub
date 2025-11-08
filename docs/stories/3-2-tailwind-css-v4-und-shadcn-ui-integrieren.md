# Story 3.2: Tailwind CSS v4 und shadcn/ui integrieren

Status: drafted

## Story

Als Entwickler,
möchte ich Tailwind CSS v4 und shadcn/ui-Komponenten einsatzbereit haben,
damit ich moderne, accessible UI-Komponenten für die CV-Seite nutzen kann.

## Acceptance Criteria

1. ✅ Tailwind CSS v4 ist installiert und konfiguriert (`tailwind.config.ts`)
2. ✅ shadcn/ui CLI ist installiert und Konfiguration erstellt (`components.json`)
3. ✅ Base-Komponenten sind importiert: Button, Card, Badge (in `apps/frontend/components/ui/`)
4. ✅ Komponenten rendern korrekt mit Tailwind-Styles (Test mit Demo-Page)
5. ✅ Dark-Mode-Vorbereitung: CSS-Variablen sind konfiguriert (optional aktivierbar)
6. ✅ WCAG AA Farb-Kontraste sind gewährleistet (Tailwind-Farbpalette validiert)
7. ✅ `globals.css` enthält Tailwind-Directives und shadcn/ui-Styles

## Tasks / Subtasks

- [ ] **Task 1:** Tailwind CSS v4 Setup (AC: #1, #7)
  - [ ] Subtask 1.1: `pnpm add tailwindcss@next postcss autoprefixer -w --filter frontend`
  - [ ] Subtask 1.2: `tailwind.config.ts` erstellen mit Content-Paths für `.tsx` Files
  - [ ] Subtask 1.3: `postcss.config.js` erstellen
  - [ ] Subtask 1.4: `apps/frontend/app/globals.css` mit Tailwind-Directives erstellen
  - [ ] Subtask 1.5: `globals.css` in Root-Layout importieren (`app/root.tsx`)

- [ ] **Task 2:** shadcn/ui Installation und Konfiguration (AC: #2, #7)
  - [ ] Subtask 2.1: `pnpm dlx shadcn-ui@latest init` im frontend-Workspace ausführen
  - [ ] Subtask 2.2: `components.json` konfigurieren (Style: default, Base Color: Zinc, CSS-Variablen)
  - [ ] Subtask 2.3: Tailwind-Config für shadcn/ui Plugin erweitern (Typography, Animations)
  - [ ] Subtask 2.4: CSS-Variablen für Dark Mode in `globals.css` vorbereiten (`:root` + `.dark`)

- [ ] **Task 3:** Base-Komponenten importieren (AC: #3, #4)
  - [ ] Subtask 3.1: `pnpm dlx shadcn-ui@latest add button` → `components/ui/button.tsx`
  - [ ] Subtask 3.2: `pnpm dlx shadcn-ui@latest add card` → `components/ui/card.tsx`
  - [ ] Subtask 3.3: `pnpm dlx shadcn-ui@latest add badge` → `components/ui/badge.tsx`
  - [ ] Subtask 3.4: Test-Page erstellen (`app/routes/test-ui.tsx`) mit allen 3 Komponenten
  - [ ] Subtask 3.5: Manueller Test: Dev-Server starten, `/test-ui` öffnen, Komponenten prüfen

- [ ] **Task 4:** Accessibility und Farb-Kontraste validieren (AC: #6)
  - [ ] Subtask 4.1: Tailwind-Farbpalette mit WCAG-Contrast-Checker validieren (Normal-Text ≥4.5:1)
  - [ ] Subtask 4.2: shadcn/ui Button-Variants auf Kontrast prüfen (primary, secondary, outline)
  - [ ] Subtask 4.3: Lighthouse Accessibility-Audit auf Test-Page (Score >90)

- [ ] **Task 5:** Integration-Test und Cleanup (AC: #4, #7)
  - [ ] Subtask 5.1: Integration-Test: Alle 3 Komponenten rendern in Demo-Page
  - [ ] Subtask 5.2: Dark-Mode-Toggle-Skeleton erstellen (UI-only, keine Logik - für Post-MVP)
  - [ ] Subtask 5.3: Test-Page entfernen ODER als Style-Guide behalten (Entscheidung mit SM)
  - [ ] Subtask 5.4: TypeScript Compilation prüfen (`pnpm --filter frontend tsc --noEmit`)

## Dev Notes

### Technische Hinweise

**Tailwind CSS v4:**
- Version: `tailwindcss@next` (v4 Alpha/Beta)
- Content-Paths: `content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']`
- PostCSS: Autoprefixer erforderlich für Browser-Kompatibilität
- JIT-Mode standardmäßig aktiv (v4)

**shadcn/ui:**
- Basiert auf Radix UI (accessible by default, WCAG AA)
- Copy-Paste-Ansatz: Komponenten landen in `components/ui/`, vollständig editierbar
- `components.json` definiert Aliases (`@/components`, `@/lib/utils`)
- Utility-Helper: `clsx` + `tailwind-merge` für Klassen-Merging

**Dark-Mode-Vorbereitung:**
- CSS-Variablen in `globals.css` (`--background`, `--foreground`, `--primary`, etc.)
- `.dark`-Klasse für Theme-Toggle (React Context + LocalStorage in Post-MVP)
- shadcn/ui unterstützt Dark-Mode out-of-the-box via CSS-Variablen

**WCAG AA Compliance:**
- Normal-Text: ≥4.5:1 Kontrast
- Large-Text (18pt / 14pt bold): ≥3:1
- Tailwind Zinc-Palette erfüllt WCAG AA für Text auf `zinc-50`/`zinc-900` Backgrounds
- Radix UI Primitives haben Built-in Focus-States (Accessibility)

### Project Structure Notes

**Erwartete Dateistruktur nach Completion:**

```
apps/frontend/
├── app/
│   ├── root.tsx                   # Import globals.css hier
│   ├── globals.css                # Tailwind + shadcn/ui Styles
│   └── routes/
│       └── test-ui.tsx            # Demo-Page (temporär)
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── lib/
│   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
├── tailwind.config.ts
├── postcss.config.js
└── components.json                # shadcn/ui config
```

**Wichtig:**
- **NICHT** alle shadcn/ui-Komponenten auf einmal installieren (Bundle-Size!)
- Nur benötigte Komponenten installieren (Button, Card, Badge für diese Story)
- Weitere Komponenten werden in nachfolgenden Stories hinzugefügt (Dropdown, Dialog, etc.)

### Learnings from Previous Story

**From Story 3-1-tanstack-start-ssr-architektur-einrichten (Status: drafted)**

Previous story not yet implemented - keine Dev-Agent-Learnings verfügbar.

**Expected Prerequisites from Story 3.1:**
- TanStack Start-Projekt initialisiert in `apps/frontend`
- File-based Routing funktioniert (`app/routes/index.tsx`)
- Dev-Server startet auf Port 5173
- TypeScript strict mode konfiguriert

Falls Story 3.1 NICHT abgeschlossen ist, diese Story BLOCKIEREN und Story 3.1 zuerst abschließen!

### References

**Sources:**
- [Tech-Spec Epic 3: Dependencies](docs/tech-spec-epic-3.md#frontend-dependencies-apps-frontend)
- [Tech-Spec Epic 3: System Architecture Alignment](docs/tech-spec-epic-3.md#system-architecture-alignment)
- [Epics Epic 3: Story 3.2](docs/epics.md#story-32-tailwind-css-v4-und-shadcnui-integrieren)
- [PRD: Frontend-Architektur](docs/PRD.md#frontend-architektur)

**External Docs:**
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Installation Guide](https://ui.shadcn.com/docs/installation/vite)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
