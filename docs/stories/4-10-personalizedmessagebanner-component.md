# Story 4.10: PersonalizedMessageBanner Component

Status: drafted

## Story

Als Besucher,
möchte ich eine prominente Nachricht am Anfang der personalisierten CV-Seite sehen,
damit ich weiß, warum ich diesen Link erhalten habe.

## Acceptance Criteria

1. Component `PersonalizedMessageBanner` existiert (shadcn/ui Alert-Komponente)
   - Basiert auf shadcn/ui Alert-Component (Radix UI primitives)
   - Strukturiert als eigenständige Component in `apps/frontend/src/components/invite/`
2. Props: `message: string | null`
   - TypeScript Interface definiert Props korrekt
   - Null-Safety berücksichtigt (conditional rendering)
3. Markdown-Rendering via `react-markdown` (Library installiert)
   - react-markdown v10 für sichere Content-Darstellung
   - Keine dangerouslySetInnerHTML - Security by Design
4. Styling: Prominent, aber nicht aufdringlich (z.B. Info-Alert mit Icon)
   - Tailwind CSS v4 für Styling
   - Info-Variante (blaue Border/Background subtil)
   - Icon für visuelle Verbesserung (lucide-react)
5. Visuelle Differenzierung: Subtile Border/Background-Color
   - Border und Background-Color unterscheiden sich subtil von normalem Content
   - Konsistent mit Design-System (shadcn/ui)
6. Responsive: Mobile und Desktop optimiert
   - Padding und Font-Size responsiv
   - Lesbarkeit auf allen Viewport-Größen gewährleistet
7. Accessibility: ARIA-Label für Screen-Reader
   - ARIA-Label beschreibt Zweck der Component
   - Semantisches HTML (role="alert" oder region)
   - WCAG AA konform
8. Conditional Rendering: Nur anzeigen wenn `message` nicht null
   - Component rendert nichts wenn `message === null`
   - Keine leeren Divs oder Platzhalter
9. Unit-Test: Component rendert Markdown korrekt
   - Vitest + React Testing Library
   - Test: Message wird als Markdown gerendert (z.B. **bold**, _italic_)
   - Test: Component rendert nicht wenn message=null
   - Test: Accessibility Attributes vorhanden

## Tasks / Subtasks

- [ ] Component-Struktur erstellen (AC: #1, #2)
  - [ ] Datei erstellen: `apps/frontend/src/components/invite/PersonalizedMessageBanner.tsx`
  - [ ] TypeScript Interface `PersonalizedMessageBannerProps` definieren mit `message: string | null`
  - [ ] Component-Skeleton mit Props erstellen
  - [ ] Conditional Rendering implementieren: Return `null` wenn `message === null`

- [ ] shadcn/ui Alert Integration (AC: #1, #4, #5)
  - [ ] shadcn/ui Alert-Component installieren (falls noch nicht vorhanden): `npx shadcn-ui@latest add alert`
  - [ ] Alert-Component importieren und als Basis verwenden
  - [ ] Info-Variante konfigurieren: `<Alert variant="default">` mit blauen Akzenten
  - [ ] lucide-react Icon hinzufügen: `Info` Icon für visuelle Verstärkung
  - [ ] Tailwind CSS für subtile Border und Background-Color anpassen

- [ ] Markdown-Rendering implementieren (AC: #3)
  - [ ] `react-markdown` installieren: `pnpm add react-markdown@^10.0.0`
  - [ ] react-markdown Component importieren
  - [ ] Message als Children an ReactMarkdown übergeben: `<ReactMarkdown>{message}</ReactMarkdown>`
  - [ ] Sicherstellen: Keine dangerouslySetInnerHTML verwendet (Security by Design)

- [ ] Responsive Design & Styling (AC: #6)
  - [ ] Tailwind CSS responsive Klassen anwenden
  - [ ] Padding responsiv: `p-4 md:p-6`
  - [ ] Font-Size responsiv: `text-sm md:text-base`
  - [ ] Max-Width für Desktop definieren (z.B. `max-w-4xl mx-auto`)
  - [ ] Mobile Viewport Test: Lesbarkeit auf 320px-768px sicherstellen

- [ ] Accessibility (WCAG AA) (AC: #7)
  - [ ] ARIA-Label hinzufügen: `aria-label="Personalisierte Nachricht"`
  - [ ] Semantisches HTML: `role="region"` oder `role="alert"` je nach Kontext
  - [ ] Farbkontrast prüfen: Text-to-Background Ratio ≥ 4.5:1 (WCAG AA)
  - [ ] Keyboard-Navigation: Component ist fokussierbar wenn nötig

- [ ] Unit-Tests schreiben (AC: #9)
  - [ ] Test-Datei erstellen: `apps/frontend/src/components/invite/PersonalizedMessageBanner.test.tsx`
  - [ ] Test-Setup mit Vitest + React Testing Library
  - [ ] Test 1: Component rendert Markdown korrekt
    - Input: `message="**Bold** and _italic_"`
    - Expect: `<strong>Bold</strong>` und `<em>italic</em>` im DOM
  - [ ] Test 2: Component rendert nicht wenn `message === null`
    - Input: `message={null}`
    - Expect: Component returnt `null`, kein DOM-Element
  - [ ] Test 3: Accessibility Attributes vorhanden
    - Expect: `aria-label` vorhanden
    - Expect: `role` Attribut vorhanden
  - [ ] Test 4: Alert-Component wird korrekt gerendert
    - Expect: shadcn/ui Alert mit Info-Variante

- [ ] Integration vorbereiten (AC: #8)
  - [ ] Component aus `index.ts` exportieren: `apps/frontend/src/components/invite/index.ts`
  - [ ] Type-Exports sicherstellen
  - [ ] Dokumentation: JSDoc-Kommentar für Component Props

## Dev Notes

### Technische Entscheidungen

**shadcn/ui Alert als Basis-Component:**
- Gewählt wegen etablierter Radix UI Primitives (bereits in Epic 3 Setup)
- Alert-Component bietet out-of-the-box Accessibility (ARIA-Rollen, Keyboard-Navigation)
- Varianten (default/destructive) ermöglichen konsistentes Styling über gesamte App
- Kopie-und-Eigentümer-Ansatz (shadcn/ui) erlaubt vollständige Anpassung ohne Vendor-Lock-in

**react-markdown für sicheres Markdown-Rendering:**
- v10 verwendet keine dangerouslySetInnerHTML (Security by Design)
- Plugin-System ermöglicht zukünftige Erweiterungen (z.B. Syntax-Highlighting, wenn benötigt)
- Leichtgewichtig und tree-shakable (minimale Bundle-Size)
- Standard in modernen React-Apps für Content-Rendering

**Conditional Rendering Pattern:**
- Early Return (`if (!message) return null`) verhindert leere DOM-Elemente
- TypeScript Null-Safety durch `message: string | null` Props-Type
- Performant: Keine unnötigen React-Reconciliation bei null-Message

**Accessibility-First Approach:**
- WCAG AA konform (Farbkontrast, ARIA-Labels, semantisches HTML)
- role="region" für statische Messages, role="alert" für dynamische Updates (je nach Kontext)
- lucide-react Icons sind SVG-basiert (skalierbar, accessibility-friendly)

### Architektur-Alignment

**PRD Requirements:**
- FR-3 (Personalisierte Links): Diese Component visualisiert die personalisierte Nachricht aus dem Link-System
- UX-Exzellenz: Prominente, aber nicht aufdringliche Darstellung schafft positive User Experience
- Privacy-First: Nachricht ist kontextabhängig und nur für authentifizierte Token-Besitzer sichtbar
- [Source: docs/PRD.md#Personalisierte Links]

**Tech Spec Epic 4:**
- Frontend-Integration für personalisierte Ansicht (Story 4.10)
- PersonalizedMessageBanner als eigenständige Component
- Wiederverwendbar in PersonalizedCVPage (Story 4.13)
- [Source: docs/tech-spec-epic-4.md#Frontend-Integration]

**Architecture Constraints:**
- Frontend Stack: React 19, TanStack Start, shadcn/ui, Tailwind CSS v4 [Source: docs/architecture.md#Frontend Stack]
- Component Library: shadcn/ui (Radix UI Primitives, Copy-paste Ownership) [Source: docs/architecture.md#Frontend Stack]
- Markdown Rendering: react-markdown v10 (Secure, no dangerouslySetInnerHTML) [Source: docs/architecture.md#Frontend Stack]
- Testing: Vitest + React Testing Library [Source: docs/architecture.md#Frontend Stack]
- Accessibility: WCAG AA konform (Farbkontrast, ARIA, Semantisches HTML) [Source: docs/architecture.md#Quality First]

### Project Structure Notes

**Betroffene Files (NEU):**
```
apps/frontend/src/components/invite/
├── PersonalizedMessageBanner.tsx       # Main Component
├── PersonalizedMessageBanner.test.tsx  # Unit-Tests
└── index.ts                            # Exports
```

**Dependencies:**
- `react-markdown` v10 (installieren via `pnpm add react-markdown`)
- shadcn/ui Alert-Component (installieren via `npx shadcn-ui@latest add alert`, falls nicht vorhanden)
- `lucide-react` (bereits installiert in Epic 3)
- `@cv-hub/shared-types` (optional, falls Message-Type aus Shared-Types kommt)

**Integration mit bestehenden Components:**
- Diese Component wird in Story 4.13 (PersonalizedCVPage) integriert
- Verwendet gleiche Design-Patterns wie Epic 3 Components (shadcn/ui, Tailwind CSS)
- Konsistentes Styling mit restlicher App (Info-Variante, Border/Background)

**Alignment mit Epic 3 Patterns:**
- Epic 3 hat shadcn/ui und Tailwind CSS v4 bereits eingerichtet
- Gleiche Testing-Approach (Vitest + RTL) wie Epic 3 Public CV Components
- Responsive Design-Patterns konsistent mit HeroSection, SkillsSection etc.

### Testing Strategy

**Unit-Tests (Vitest + React Testing Library):**

1. **Markdown Rendering Test:**
   - Input: `message="**Bold**, _italic_, and [link](https://example.com)"`
   - Expect: `<strong>`, `<em>`, `<a>` Tags korrekt im DOM
   - Validiert: react-markdown funktioniert korrekt

2. **Conditional Rendering Test:**
   - Input: `message={null}`
   - Expect: Component returnt `null`, kein DOM-Element vorhanden
   - Validiert: Keine leeren Divs werden gerendert

3. **Accessibility Test:**
   - Expect: `aria-label` Attribut vorhanden
   - Expect: `role` Attribut vorhanden (region oder alert)
   - Expect: Farbkontrast ≥ 4.5:1 (manuell oder via jest-axe)
   - Validiert: WCAG AA konform

4. **shadcn/ui Integration Test:**
   - Expect: Alert-Component wird gerendert
   - Expect: Info-Variante aktiv (CSS-Klassen prüfen)
   - Expect: Icon vorhanden (lucide-react Info Icon)

**Mock-Strategie:**
- Keine API-Mocks nötig (reine Presentational Component)
- react-markdown kann optional gemockt werden für schnellere Tests
- RTL render-Helper für Component-Testing

**Integration-Tests:**
- E2E-Tests (Story 4.14) werden vollständige `/invite/:token` Route mit PersonalizedMessageBanner testen
- Diese Story fokussiert auf Unit-Tests der isolierten Component

**Risks & Mitigations:**
- **RISK:** Markdown-Injection (XSS via malicious Message)
  - **Mitigation:** react-markdown v10 sanitized automatisch, keine dangerouslySetInnerHTML
- **RISK:** Message zu lang (UI bricht)
  - **Mitigation:** Max-Length Validation auf Backend-Seite (Story 4.4), Frontend zeigt Truncate-Indikator (zukünftig)
- **RISK:** Accessibility-Konflikte mit shadcn/ui Alert
  - **Mitigation:** shadcn/ui Alert ist bereits WCAG-konform, Tests validieren

### Learnings from Previous Story

**From Story 4.9 (Frontend Hooks useInviteValidation und usePrivateCV) - Status: drafted**

Story 4.9 ist noch nicht implementiert, daher keine direkten Code-Artefakte verfügbar. Jedoch wichtige Kontext-Informationen:

**Dependencies zu Story 4.9:**
- Story 4.9 liefert `useInviteValidation(token)` Hook, der `{ isValid, personalizedMessage, ... }` returnt
- Die `personalizedMessage` aus diesem Hook wird als `message` Prop an PersonalizedMessageBanner übergeben
- Integration erfolgt in Story 4.13 (PersonalizedCVPage):
  ```tsx
  const { personalizedMessage } = useInviteValidation(token);
  return <PersonalizedMessageBanner message={personalizedMessage} />;
  ```

**Wichtig für diese Story:**
- PersonalizedMessageBanner kann parallel entwickelt werden (keine Code-Abhängigkeit zu 4.9)
- Unit-Tests nutzen Mock-Message (keine Hook-Integration nötig)
- Integration mit useInviteValidation erfolgt in Story 4.13

**Context aus Epic 4 Dependencies:**
- Story 4.5 (GET /api/invite/:token Endpoint) liefert `personalizedMessage` vom Backend
- Story 4.2 (Invite Zod-Schemas) definiert `personalizedMessage: string | null` Type
- Epic 3 liefert shadcn/ui Setup, Tailwind CSS v4, Vitest + RTL Testing-Setup

**Patterns aus Epic 3 für Wiederverwendung:**
- Responsive Design: `p-4 md:p-6`, `text-sm md:text-base` (konsistent mit HeroSection)
- shadcn/ui Component-Integration: Alert wie Card/Badge/Button bereits etabliert
- Testing-Patterns: RTL render-Helper, Vitest Mocks (gleicher Ansatz wie PublicCV Components)

[Source: docs/stories/4-9-frontend-hooks-useinvitevalidation-und-useprivatecv.md#Dev Notes]

### References

- [Source: docs/epics.md#Epic 4 - Story 4.10] - Story Definition und Acceptance Criteria
- [Source: docs/tech-spec-epic-4.md#Frontend-Integration] - PersonalizedMessageBanner Component-Spezifikation
- [Source: docs/architecture.md#Frontend Stack] - React 19, shadcn/ui, react-markdown, Vitest + RTL
- [Source: docs/architecture.md#Quality First] - WCAG AA, Security (no dangerouslySetInnerHTML), Performance
- [Source: docs/PRD.md#Personalisierte Links] - Business-Kontext für personalisierte Nachrichten
- [Source: docs/stories/4-9-frontend-hooks-useinvitevalidation-und-useprivatecv.md] - Hook-Integration für personalizedMessage

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

