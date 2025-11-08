# Story 4.12: ContactSection Component (nur authenticated)

Status: drafted

## Story

Als Besucher mit gültigem Token,
möchte ich Kontaktdaten im personalisierten CV sehen,
damit ich den CV-Owner kontaktieren kann.

## Acceptance Criteria

1. **Component existiert:** ContactSection Component ist implementiert unter `apps/frontend/src/components/cv/ContactSection.tsx`
2. **Props-Interface definiert:**
   ```typescript
   interface ContactSectionProps {
     contact: {
       email: string;
       phone?: string;
       location?: string;
     };
   }
   ```
3. **Darstellung und Funktionalität:**
   - Email wird mit klickbarem `mailto:`-Link angezeigt
   - Telefon wird mit `tel:`-Link für Mobile angezeigt (optional)
   - Standort wird mit Icon + Text angezeigt (z.B. "Berlin, Germany")
   - Styling aligned mit shadcn/ui Card-Component (Professional Modern Design)
4. **UX-Qualität:**
   - Component verwendet shadcn/ui Card als Basis
   - Icons von lucide-react (Mail, Phone, MapPin)
   - Responsive Layout (Stack vertikal auf Mobile, Grid auf Desktop möglich)
   - Orange Akzente für Links (Primary Color #f97316)
5. **Accessibility:**
   - WCAG 2.1 AA konform
   - Keyboard-Navigation: Links sind per Tab erreichbar
   - Screen Reader: ARIA-Labels für Icons ("Email:", "Phone:", "Location:")
   - Focus-States: 2px orange ring auf Links
6. **Variant-Handling:**
   - Component wird NUR in authenticated View gerendert
   - Public View zeigt ContactSection NICHT (variant="public" check)
7. **Responsive Design:**
   - Mobile (<768px): Vertical Stack, Icons inline mit Text
   - Tablet/Desktop (≥768px): Grid Layout möglich (2-3 Spalten)
   - Touch-Targets ≥44x44px auf Mobile
8. **Testing:**
   - Unit-Test: Component rendert Email, Phone, Location korrekt
   - Unit-Test: mailto- und tel-Links funktionieren
   - Unit-Test: Component rendert nicht wenn variant="public"
   - Accessibility-Test: Keyboard navigation, Screen reader support

## Tasks / Subtasks

- [ ] Task 1: ContactSection Component erstellen (AC: 1, 2, 3)
  - [ ] 1.1: TypeScript Component-Datei unter `apps/frontend/src/components/cv/ContactSection.tsx` erstellen
  - [ ] 1.2: Props-Interface `ContactSectionProps` definieren mit `contact: { email, phone?, location? }`
  - [ ] 1.3: shadcn/ui Card als Wrapper importieren
  - [ ] 1.4: lucide-react Icons importieren (Mail, Phone, MapPin)
- [ ] Task 2: Kontaktdaten-Darstellung implementieren (AC: 3, 4)
  - [ ] 2.1: Email-Section mit mailto-Link und Mail-Icon
  - [ ] 2.2: Phone-Section mit tel-Link und Phone-Icon (conditional rendering wenn phone vorhanden)
  - [ ] 2.3: Location-Section mit MapPin-Icon (conditional rendering wenn location vorhanden)
  - [ ] 2.4: Tailwind-Styling für Professional Modern Design (monochrome base, orange links)
- [ ] Task 3: Responsive Layout implementieren (AC: 7)
  - [ ] 3.1: Mobile Layout: Vertical Stack mit flexbox
  - [ ] 3.2: Desktop Layout: Grid optional (2-3 Spalten bei vielen Feldern)
  - [ ] 3.3: Touch-Targets auf Mobile ≥44x44px für Links
- [ ] Task 4: Accessibility implementieren (AC: 5)
  - [ ] 4.1: ARIA-Labels für Icon-Sections ("Email Address:", "Phone Number:", "Location:")
  - [ ] 4.2: Keyboard-Navigation sicherstellen (Links tabbable, focus-visible)
  - [ ] 4.3: Focus-States mit 2px orange ring (--ring color aus theme)
  - [ ] 4.4: Color Contrast prüfen (Links mindestens 4.5:1 contrast)
- [ ] Task 5: Variant-Handling einbauen (AC: 6)
  - [ ] 5.1: Conditional rendering: Only render ContactSection wenn authenticated context
  - [ ] 5.2: Integration in PersonalizedCVPage (Epic 4 Route /invite/:token)
  - [ ] 5.3: Verifizieren dass Public View ContactSection NICHT rendert
- [ ] Task 6: Testing (AC: 8)
  - [ ] 6.1: Vitest Unit-Test: Component rendert mit allen Props (email, phone, location)
  - [ ] 6.2: Unit-Test: Component rendert partial props (nur email)
  - [ ] 6.3: Unit-Test: mailto- und tel-Links haben korrekte href-Attribute
  - [ ] 6.4: Accessibility-Test mit Testing Library: keyboard navigation works
  - [ ] 6.5: Manual Screen Reader Test (VoiceOver/NVDA)

## Dev Notes

### Architecture Patterns and Constraints

**Component Architecture:**
- React Functional Component mit TypeScript
- Props-Interface für Type Safety
- Conditional rendering für optionale Felder (phone, location)
- Integration in Epic 4 personalisierte CV-Route `/invite/:token`

**Design System:**
- shadcn/ui Card Component als Wrapper
- lucide-react Icons (Mail, Phone, MapPin)
- Tailwind CSS für Styling
- Design Tokens aus UX Design Spec:
  - Primary Color: `#f97316` (Orange für Links)
  - Text Colors: `zinc-900` (Headings), `zinc-700` (Body)
  - Spacing: `spacing-4` bis `spacing-6` (16-24px)
  - Border Radius: `--radius-md` (8px)

**Testing Strategy:**
- Unit-Tests mit Vitest + React Testing Library
- Accessibility-Tests mit @testing-library/jest-dom matchers
- Manual Screen Reader Tests (WCAG AA Compliance)

### Project Structure Notes

**Alignment with Unified Project Structure:**

Component-Pfad folgt established Frontend-Struktur:
```
apps/frontend/src/
├── components/
│   └── cv/
│       ├── SkillsSection.tsx      (Epic 3 - bestehend)
│       ├── ProjectsSection.tsx    (Epic 3 - bestehend)
│       ├── ExperienceSection.tsx  (Epic 3 - bestehend)
│       └── ContactSection.tsx     (Epic 4 - NEU, diese Story)
```

**Dependencies:**
- shadcn/ui: Card, CardHeader, CardTitle, CardContent
- lucide-react: Mail, Phone, MapPin Icons
- React 19 + TypeScript
- Tailwind CSS v4

**Integration Point:**
- Component wird in `PersonalizedCVPage` importiert (Epic 4)
- Nur authenticated View (variant check)
- Contact-Daten kommen von API `/api/cv/private/:token` (Epic 4 Backend)

**Detected Conflicts/Variances:** Keine

### References

**Source Documents:**

- [Tech Spec Epic 4](docs/tech-spec-epic-4.md#frontend-integration) - ContactSection als NEW component, nur authenticated
- [Epic 4 Story 4.12](docs/epics.md#story-412) - Acceptance Criteria und Requirements
- [UX Design Specification](docs/ux-design-specification.md#component-library) - shadcn/ui Strategy, Professional Modern Design
- [UX Design Specification - Visual Foundation](docs/ux-design-specification.md#visual-foundation) - Color System (Orange Primary), Typography, Spacing
- [UX Design Specification - Accessibility](docs/ux-design-specification.md#accessibility-strategy) - WCAG 2.1 AA Requirements
- [Architecture](docs/architecture.md) - Frontend Component Structure, React 19 + Tailwind

**Key Technical Details:**
- Design System: shadcn/ui ([Source: UX Design Spec Section 1.1](docs/ux-design-specification.md#11-design-system-choice))
- Color Theme: Minimalist Energy (Monochrome + Orange #f97316) ([Source: UX Design Spec Section 3.1](docs/ux-design-specification.md#31-color-system-minimalist-energy))
- Accessibility Target: WCAG 2.1 Level AA ([Source: UX Design Spec Section 8.2](docs/ux-design-specification.md#82-accessibility-strategy))
- Component Patterns: Functional Components, Props Interfaces, Conditional Rendering ([Source: Tech Spec Epic 4](docs/tech-spec-epic-4.md#component-varianten-shared-zwischen-publicprivate))

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent during implementation -->

### Completion Notes List

<!-- To be filled by dev agent after story completion -->

### File List

<!-- To be filled by dev agent:
NEW: <file_path> - <description>
MODIFIED: <file_path> - <changes_made>
DELETED: <file_path> - <reason>
-->
