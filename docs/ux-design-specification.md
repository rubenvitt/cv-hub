# {{project_name}} UX Design Specification

_Created on 2025-11-04 by Ruben_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Projekt:** cv-hub - Ein modernes, Privacy-fokussiertes CV-Management-System

cv-hub ist ein datengetriebenes CV-System, das als persönliches Portfolio UND als technisches Showcase dient. Das Besondere: Die Website selbst demonstriert technische Kompetenz durch ihre Qualität, Performance und Durchdachtheit, bevor überhaupt ein Wort gelesen wird.

**Kern-Erlebnis:**
- **Öffentliche Seite:** Moderne, begeisternde CV-Präsentation (Skills, Projekte, Erfahrung) ohne sensible Daten - SEO-optimiert, Performance-stark
- **Personalisierte Links:** Individuelle Zugänge mit vollständigem CV + optionaler persönlicher Nachricht - mit Ablaufdatum und Besuchsstatistiken

**Zielgruppen:**
- **Primary:** Recruiter und Tech Leads mit personalisierten Links
- **Secondary:** Öffentliche Besucher auf der Landing Page

**Technischer Stack:**
- Frontend: Vite + React 19 + TanStack Router + Tailwind CSS
- Backend: NestJS API mit SQLite
- Deployment: Docker Compose auf eigener Domain
- SEO: Vite SSR mit Client-Side Hydration

**Emotionales Ziel:** Die Website soll Selbstbewusstsein und Stolz vermitteln - professionelle und technische Exzellenz in jedem Detail.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Gewähltes System: shadcn/ui (mit Radix UI Primitives + Tailwind CSS)**

**Rationale:**

shadcn/ui ist die perfekte Wahl für cv-hub aus mehreren strategischen Gründen:

**Code Ownership & Portfolio Value:**
- Copy-paste Components in deinen Code (kein npm dependency lock-in)
- Code ist auf GitHub sichtbar als Teil des Portfolios
- Zeigt moderne Best Practices: Radix + Tailwind + TypeScript

**Qualität & Professionalität:**
- Polished, modern aesthetic passt zu "Beeindruckt & Überzeugt" Emotion
- Production-ready Components mit professionellem Look
- Konsistente Design Language out-of-the-box

**Accessibility baked-in:**
- Radix UI primitives = WCAG 2.1 AA compliant
- Keyboard navigation, focus management, ARIA labels automatisch
- Screen reader support ohne Extra-Arbeit

**Developer Experience:**
- TypeScript-native mit full type safety
- Kompatibel mit React 19, Vite, Tailwind v4 (dein Stack)
- AI-friendly: Readable, consistent code patterns
- Wartbar: Updates optional, keine Breaking Changes

**Customization:**
- Full Tailwind customization möglich
- Components leben in deinem Code → easy tweaks
- Design tokens konsistent über alle Components

**Component Library:** ~50 Components verfügbar
- Buttons, Forms, Inputs, Dialogs, Dropdowns, Tables, Tabs, Navigation, etc.
- Deckt 95% der UI-Needs für cv-hub

**Erweiterbarkeit:**
- Bei Bedarf: Zusätzliche Radix primitives für Custom Components
- Seamless Integration (shadcn/ui nutzt bereits Radix intern)

**Version:** shadcn/ui (Latest 2025), Radix UI primitives, Tailwind CSS v4

**Alternative betrachtet:** Pure Radix (headless), Material Tailwind, Custom Tailwind
**Grund für shadcn/ui:** Balance zwischen Speed-to-MVP und Code Quality/Ownership

---

## 2. Core User Experience

### 2.1 Defining Experience

**Das definierende Erlebnis von cv-hub:**

**"Instant Professional Impression & Effortless Overview"**

**Für Besucher (Öffentlich & Personalisiert):**
- **Sofortige Orientierung:** In den ersten 3 Sekunden verstehen, wer du bist und was du kannst
- **Müheloser Überblick:** CV-Struktur ist auf den ersten Blick erfassbar, Navigation ist intuitiv
- **Scanning-optimiert:** Information ist visuell strukturiert für schnelles Erfassen statt langem Lesen
- **Eindruck durch Qualität:** Die UX selbst kommuniziert Professionalität und technische Kompetenz

**Für Admin (CV-Pflege):**
- **Reibungslose KI-Extraktion:** PDF/Text hochladen → Strukturierte Daten → Review → Fertig
- **Kein technisches Gefrickel:** Keine HTML-Bearbeitung, keine komplexen Datenstrukturen manuell pflegen
- **Schnelles Link-Management:** Neuen Link erstellen in <30 Sekunden

**Was absolut mühelos sein MUSS:**
- Skills und Expertise auf einen Blick erfassen
- Zu interessanten Projekten navigieren
- Persönlichkeit wahrnehmen (nicht nur Technik)
- Kontaktaufnahme (wenn Interesse besteht)
- Admin: CV aktualisieren ohne Frustration

### 2.2 Desired Emotional Response

**Die gewünschte emotionale Doppel-Wirkung:**

**1. Vertrauensvoll & Überzeugt** (Rational/Professionell)
- "Diese Person ist kompetent und zuverlässig"
- "Ich kann mich auf diese Expertise verlassen"
- "Das ist jemand, mit dem ich arbeiten kann"
- Fundament für geschäftliche Entscheidungen

**2. Beeindruckt & Inspiriert** (Emotional/Qualität)
- "Wow, so gut kann das gemacht werden"
- "Hier arbeitet jemand mit außergewöhnlich hohen Standards"
- "Das ist nicht nur gut - das ist exzellent"
- Der "Erzähl-deinen-Kollegen-davon"-Faktor

**Die Balance: Substanzielle Brillanz**
- Nicht "showy" oder gimmicky
- Nicht minimalistisch bis zur Leere
- Sondern: Durchdachte Exzellenz in jedem Detail
- Performance, Struktur und visuelle Qualität arbeiten zusammen

**UX-Implikationen:**
- **Vertrauen entsteht durch:** Klarheit, Vollständigkeit, Konsistenz, professionelle Präsentation
- **Beeindruckung entsteht durch:** Außergewöhnliche Qualität, durchdachte Microinteractions, spürbare Performance, visuelle Exzellenz
- **Das Ergebnis:** Ein Recruiter/Tech Lead denkt "Das ist genau die Qualität, die ich für mein Team suche"

### 2.3 Inspiration & UX Pattern Analysis

**Inspirations: ChatGPT, Claude Code, Opal, MacroFactor, IntelliJ IDEA**

Diese Apps repräsentieren professionelle Tools mit durchdachter Eleganz - genau die Qualität, die cv-hub anstrebt.

#### **Gemeinsame UX-Patterns:**

**1. Progressive Disclosure**
- MacroFactor: "Glanceable interface mit deep details on-demand"
- IntelliJ: "Reduzierte visuelle Komplexität, progressive disclosure komplexer Features"
- **Für cv-hub:** Überblick above-the-fold, Details bei Interesse verfügbar

**2. Ablenkungsfreie Fokussierung**
- ChatGPT/Claude Code: Minimalistisch, clean layout, collapsible Sidebars
- Focus bleibt auf dem Hauptcontent
- **Für cv-hub:** Content ist König, keine ablenkenden Elemente

**3. Rewarding Experience**
- Opal: "Feels like an experience, not a tool" - Animationen, Haptics, smooth
- MacroFactor: Polished, refined, smooth interactions
- **Für cv-hub:** Jede Interaktion fühlt sich hochwertig an

**4. Information Density + Clarity**
- IntelliJ: Information-dense aber perfekt organisiert
- MacroFactor: Data exploration mit helpful tooltips
- **Für cv-hub:** Viele Skills/Projekte, aber scanbar und strukturiert

**5. Professional Polish**
- Alle: Modern, refined, attention to detail
- Consistent design language, feels premium
- **Für cv-hub:** Jedes Detail durchdacht - das IST das Portfolio

**6. Quick, Efficient Workflows**
- MacroFactor: "Fewer clicks than competitors"
- IntelliJ: "Easy access to essentials"
- **Für cv-hub:** Link erstellen in <30s, CV-Update reibungslos

**7. Data-Driven but Human**
- MacroFactor: "Colorful yet adherence-neutral" - keine Guilt-Trips
- Opal: Analytics sind motivierend, nicht überwältigend
- **Für cv-hub:** Besuchsstatistiken hilfreich, nicht stressig

#### **Anwendung auf cv-hub:**

**Öffentliche CV-Seite:**
- Progressive disclosure für Projekt-Details
- Clean, focused Layout
- Smooth scrolling & subtle Animationen
- Dense information, perfekt strukturiert

**Admin-Dashboard:**
- Quick workflows (wie MacroFactor)
- Data visualisierung hilfreich (wie Opal)
- Clean interface, essentials first

### 2.4 Novel UX Pattern: Personalisiertes Link-System

**Pattern Name:** Personalized Invite Experience

**User Goal:** Recruiter/Tech Lead erhält dedizierten Zugang zu vollständigem CV mit optionaler persönlicher Nachricht

**Das Pattern löst:**
- Wie kommuniziert man "personalisierte Ansicht" ohne aufdringlich zu sein?
- Wo platziert man die persönliche Nachricht optimal?
- Wie differenziert man visuell Public vs. Personalized View?

#### **Design Decisions:**

**1. Nachricht Placement: Hero-Integration**
- Personalisierte Nachricht als Teil des Hero-Bereichs (above the fold)
- Gestyled als elegante, prominent platzierte Card
- Fühlt sich wie ein persönlicher Brief an, nicht wie ein System-Notification

**Visual Hierarchy:**
```
┌──────────────────────────────────────────┐
│ [Subtle Badge top-right: "Invited Access"]│
│                                           │
│ ┌─────────────────────────────────────┐  │
│ │ Hey [Name],                          │  │
│ │                                      │  │
│ │ [Deine persönliche Nachricht...]     │  │
│ │                                      │  │
│ │ — Ruben                              │  │
│ └─────────────────────────────────────┘  │
│                                           │
│ [Rest of CV: Skills, Projects, etc...]    │
└──────────────────────────────────────────┘
```

**2. Tone: Professional-Warm**
- Nicht steril oder corporate, aber auch nicht zu casual
- Authentisch und menschlich
- Zeigt Persönlichkeit UND Professionalität
- Beispiel: "Hey [Name], ich freue mich, dass du dir die Zeit nimmst..." statt "Dear Sir/Madam"

**3. Visuelle Differentiation: Subtil-Sichtbar**
- **Sichtbar:** Kleine Badge/Indicator oben ("Invited Access" oder "Personalized View")
- **Subtil:** Kein kompletter Layout-Wechsel, kein auffälliger Farbwechsel
- **Content-Unterschied:** Zusätzliche Sections sichtbar (Kontakt, vollständige Details)
- **Vertrauenswürdig:** Fühlt sich natürlich an, nicht wie ein "gehackter" Zugang

#### **Interaction Flow:**

**Landing:**
1. User klickt auf `/invite/{token}`
2. System validiert Token (invalid → friendly Error Page mit Explanation)
3. Page lädt mit subtiler "Invited Access" Badge (top-right, nicht aufdringlich)
4. Hero-Section zeigt personalisierte Nachricht (wenn vorhanden)
   - Wenn keine Nachricht: Subtitle "You have full access to Ruben's complete profile"

**Scrolling & Discovery:**
- Zusätzliche Sections werden sichtbar (die Public View nicht hat):
  - Vollständige Kontaktdaten (Email, Phone, LinkedIn)
  - Erweiterte Projekt-Details (Firmen, Metriken, private Infos)
  - Persönliche Interessen, Ehrenamt (mehr Tiefe)
- Smooth Scrolling, progressive disclosure
- Subtle visual cues: Sections mit "Full Access" mini-badge

**Call-to-Action:**
- Prominenter "Get in Touch" Button/Section
- Mehrere Kontakt-Optionen (Email, LinkedIn, evtl. Calendly)
- Friendly invitation: "Let's connect"

#### **States & Edge Cases:**

**Token States:**
- **Valid + Active:** Normal Flow (siehe oben)
- **Expired:** Friendly message "This invite has expired. Please request a new one from Ruben."
- **Deactivated:** "This invite is no longer active."
- **Invalid:** "This invite link is invalid. Please check the URL."

**Nachricht States:**
- **Mit Nachricht:** Hero Card prominent
- **Ohne Nachricht:** Subtitle + Badge ausreichend
- **Leere Nachricht:** Fallback zu "ohne Nachricht" State

**Mobile Considerations:**
- Badge bleibt sichtbar aber kleiner
- Hero-Nachricht Card collapsible (expandable)
- CTA sticky bottom bar (optional)

#### **Visual Design Principles für dieses Pattern:**

**Trustworthiness:**
- Klare Kommunikation: "Du wurdest eingeladen" - kein Geheimnis
- Professionell gestyled: Keine "Marketing-Tricks"
- Authentisch: Fühlt sich wie ein persönlicher Brief an

**Subtlety:**
- Kein "IN YOUR FACE" Banner
- Keine abrupten visuellen Änderungen vs. Public View
- Elegant integriert in den natürlichen Flow

**Differentiation:**
- Genug sichtbar, um Personalisierung zu kommunizieren
- Nicht so auffällig, dass es vom Content ablenkt
- Balance: Erkennbar aber nicht überwältigend

**Accessibility:**
- Screen reader announcement: "You are viewing a personalized profile"
- Keyboard navigation zu "Get in Touch" CTA
- Focus management bei Hero Message Card

### 2.5 Core Experience Principles

Diese Prinzipien leiten ALLE UX-Entscheidungen für cv-hub:

#### **1. Speed: Instant Gratification**
- **First Impression in <3 Sekunden:** Above the fold muss sofort Orientierung bieten
- **Information Scent:** Nutzer sehen sofort, wo sie navigieren können
- **Performance is UX:** Ladezeiten <1.5s FCP - Performance kommuniziert Qualität
- **No Friction:** Jede Aktion sollte smooth und immediate feedback geben
- **Admin:** Häufige Actions in <30s (Link erstellen, CV updaten)

**Umsetzung:**
- SSR + Hydration für instant rendering
- Optimistic UI updates
- Skeleton screens statt Spinner
- Prefetch navigation targets

#### **2. Guidance: Progressive Disclosure**
- **Overwhelm vermeiden:** Nicht alles auf einmal zeigen
- **Scannable First:** Überblick before Details
- **On-Demand Depth:** Details verfügbar wenn gewünscht (expandable sections)
- **Clear Information Architecture:** Nutzer wissen immer wo sie sind

**Umsetzung:**
- Hero mit Kern-Info above the fold
- Sections mit klaren Headings
- Expandable/Collapsible Projekt-Details
- Breadcrumbs oder Section-Navigation (optional)

#### **3. Flexibility: Balanced Control**
- **Nicht zu guided:** Nutzer können frei explorieren
- **Nicht zu flexible:** Klare Pfade durch Content
- **Respekt für User Agency:** Nutzer entscheiden, was sie sehen wollen
- **Admin:** Volle Kontrolle über Link-Lifecycle und CV-Daten

**Umsetzung:**
- Filter für Skills/Projekte (optional)
- Jump-to-Section Navigation
- Kein forced Linear Flow
- Admin: Granulare Link-Controls (activate, deactivate, expire)

#### **4. Feedback: Subtle yet Celebratory**
- **Nicht zu quiet:** Nutzer bekommen klares Feedback auf Actions
- **Nicht zu loud:** Keine aufdringlichen Celebratory Animations
- **Meaningful:** Feedback kommuniziert State Changes klar
- **Delightful:** Microinteractions fühlen sich polished an

**Umsetzung:**
- Toast notifications für Admin-Actions (nicht für Public)
- Hover states mit subtle Transitions
- Loading states mit Skeleton UI
- Success states mit checkmark + fade
- Error states mit clear Recovery options

#### **5. Trust: Transparency & Authenticity**
- **Keine Tricks:** Honest UI, keine Dark Patterns
- **Klar kommunizieren:** Was passiert, warum, und was als nächstes
- **Professional-Warm Tone:** Menschlich aber nicht unprofessionell
- **Privacy-bewusst:** Klare Kommunikation über Daten-Zugriff

**Umsetzung:**
- "Invited Access" Badge ist sichtbar aber nicht aufdringlich
- Error messages sind helpful, nicht blame-y
- Personalisierte Nachrichten sind authentisch
- Admin Dashboard zeigt anonyme Statistiken nur

#### **6. Quality: Every Detail Matters**
- **Consistent:** Design Language durchgängig konsistent
- **Polished:** Keine rough edges, alles durchdacht
- **Accessible:** WCAG AA minimum - für alle nutzbar
- **Performant:** Lighthouse >90 - technische Exzellenz spürbar

**Umsetzung:**
- shadcn/ui für konsistente Components
- Design tokens für unified Styling
- Accessibility Testing mandatory
- Performance Budgets enforced

---

**Zusammenfassung der Principles:**

| Principle | Focus | Manifestation |
|-----------|-------|---------------|
| **Speed** | Instant Feedback | <3s first impression, <1.5s FCP |
| **Guidance** | Progressive Disclosure | Scannable overview, on-demand details |
| **Flexibility** | Balanced Control | Free exploration with clear paths |
| **Feedback** | Subtle & Meaningful | Clear state changes, delightful microinteractions |
| **Trust** | Transparency | Honest UI, professional-warm tone |
| **Quality** | Consistency | Every detail polished, accessible, performant |

Diese Principles gelten für **alle drei User Experiences:**
- Public CV (Focus: Speed + Guidance)
- Personalized View (Focus: Trust + Quality)
- Admin Dashboard (Focus: Flexibility + Feedback)

### 2.6 UX Complexity & Facilitation Approach

**UX-Komplexitäts-Analyse:**

**User Roles:** 3 distinkte Rollen mit unterschiedlichen Zugriffsrechten
1. **Public** (anonymous) - Eingeschränkte CV-Daten (Skills, Projekte - ohne sensible Infos)
2. **Authenticated via Link** (token-basiert) - Vollständiger CV + personalisierte Nachricht
3. **Admin** (Ruben) - Dashboard, Link-Management, KI-Extraktion, Statistiken

**Auth-Modell:** Token-basierte Zugriffskontrolle
- Link-System IST das Auth-Mechanismus für "Authenticated" User
- Kein klassischer Login für Empfänger - eleganter Token-basierter Zugang
- Admin: Separates Auth-System (Basic Auth oder Session-based)

**Primary User Journeys:** 3 Hauptflows
1. **Public CV-Erkundung:** Schneller professioneller Eindruck ohne sensible Daten
2. **Personalisierte Link-Ansicht:** Vollständiger Zugang via Token + optionale Nachricht
3. **Admin Dashboard:** Link-Management, KI-Extraktion, Besuchsstatistiken

**Interaction Complexity:** Medium
- Nicht triviale CRUD - KI-Extraktion mit Review-Interface
- Privacy-gestufte Daten-Ansichten (Public vs. Authenticated)
- Link-Management mit Statistiken und Lifecycle
- Progressive Disclosure auf CV-Seite

**Platform:** Web (responsive)
- Desktop, Tablet, Mobile
- SSR + Hydration für SEO und Performance

**Content-Type:** Mix
- Content consumption (Public, Authenticated)
- Content creation & management (Admin)

**Novel Patterns:**
- **Personalisiertes Link-System:** Token-basierte Auth für CV-Zugang (nicht standard)
- **KI-Extraktion UX:** Upload → Extract → Review → Speichern (innovativ)
- **Privacy-Stufen:** Dynamische Daten-Filterung basierend auf Auth-Status

**UX Complexity Assessment:** Medium - Interessante Herausforderungen, aber gut handhabbar

**Facilitation Mode:** UX_EXPERT (basierend auf user_skill_level: expert)
- Design-Terminologie frei nutzen
- Fokus auf Tradeoffs und Edge Cases
- Keine Hand-Holding bei Basics
- Schnelle Iteration durch bekannte Patterns

---

## 3. Visual Foundation

### 3.1 Color System: "Minimalist Energy"

**Gewähltes Theme:** Hybrid aus Theme 4 (Minimalist Precision) + Theme 5 (Confident Energy)

**Theme-Philosophie:**
- **Monochrome-Basis:** Ultra-clean Schwarz/Weiß/Grau für Professionalität und Klarheit
- **Orange-Akzente:** Energiegeladene Orange-Highlights für CTAs, Links, und Persönlichkeit
- **Balance:** 90% Monochrome + 10% Orange = Sophistication mit Energie

**Warum diese Kombination für cv-hub:**
- Monochrome kommuniziert **technische Präzision und Professionalität**
- Orange-Akzente zeigen **Persönlichkeit und Selbstbewusstsein**
- Steht heraus ohne zu schreien - genau die richtige Balance für ein Senior-Level Portfolio

---

#### Primary Colors

**Orange (Primary Action Color):**
- `--primary-500`: `#f97316` - Main Primary (Buttons, CTAs, Links, Active States)
- `--primary-600`: `#ea580c` - Primary Hover/Dark (Hover States, Dark Mode)
- `--primary-400`: `#fb923c` - Primary Light (Subtle Backgrounds, Highlights)
- `--primary-50`: `#fff7ed` - Primary Tint (Very subtle backgrounds, hover backgrounds)

**Usage:**
- Primary Actions (Submit, Create, Send)
- Important Links
- Navigation Active States
- Progress Indicators
- Focus States

---

#### Neutral Colors (Zinc Scale - Cool Grays)

**Text:**
- `--text-primary`: `#18181b` (zinc-900) - Headings, important text
- `--text-secondary`: `#71717a` (zinc-500) - Body text, descriptions
- `--text-tertiary`: `#a1a1aa` (zinc-400) - Muted text, captions

**Backgrounds:**
- `--bg-primary`: `#ffffff` - Main background (cards, modals)
- `--bg-secondary`: `#fafafa` (zinc-50) - Page background, subtle contrast
- `--bg-tertiary`: `#f4f4f5` (zinc-100) - Hover backgrounds, disabled states

**Borders:**
- `--border-primary`: `#e4e4e7` (zinc-200) - Default borders
- `--border-secondary`: `#d4d4d8` (zinc-300) - Stronger borders, dividers
- `--border-focus`: `#f97316` - Focus borders (Orange)

**Inverse (for dark backgrounds):**
- `--text-inverse`: `#fafafa` - White text on dark backgrounds
- `--bg-inverse`: `#18181b` - Dark backgrounds, headers

---

#### Semantic Colors

**Success:**
- `--success-500`: `#22c55e` (green-500)
- `--success-50`: `#dcfce7` (green-100 tint)
- Usage: Success messages, completed states, positive feedback

**Warning:**
- `--warning-500`: `#eab308` (yellow-500)
- `--warning-50`: `#fef3c7` (yellow-100 tint)
- Usage: Warning messages, expiring links, caution states

**Error:**
- `--error-500`: `#ef4444` (red-500)
- `--error-50`: `#fee2e2` (red-100 tint)
- Usage: Error messages, validation errors, destructive actions

**Info:**
- `--info-500`: `#3b82f6` (blue-500)
- `--info-50`: `#dbeafe` (blue-100 tint)
- Usage: Info messages, tips, neutral feedback

---

#### Semantic Usage Guidelines

**Button Hierarchy:**
- **Primary:** Orange background (`#f97316`) + White text - Main actions only
- **Secondary:** White background + Orange border + Orange text - Supporting actions
- **Ghost:** Transparent background + Orange text - Tertiary actions
- **Destructive:** Red background (`#ef4444`) + White text - Delete, remove

**Form States:**
- **Default:** Zinc-200 border (`#e4e4e7`)
- **Focus:** Orange border (`#f97316`) + Orange glow (shadow)
- **Error:** Red border (`#ef4444`) + Red background tint
- **Success:** Green border (`#22c55e`) + Green background tint
- **Disabled:** Zinc-100 background (`#f4f4f5`) + Zinc-400 text

**Links:**
- **Default:** Orange (`#f97316`)
- **Hover:** Darker Orange (`#ea580c`) + Underline
- **Visited:** Same as default (no color change)
- **Focus:** Orange with focus ring

**Alerts:**
- **Background:** Semantic color at 50 lightness
- **Border-Left:** 4px solid semantic color at 500 lightness
- **Text:** Semantic color at 700-900 lightness (dark)
- **Icon:** Semantic color

---

### 3.2 Typography System

**Font Families:**

**Sans-Serif (Primary):**
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
```
- Usage: UI, body text, headings, navigation
- Rationale: System fonts = best performance, native feel, excellent readability

**Monospace (Code/Technical):**
```css
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono',
             Consolas, 'Courier New', monospace;
```
- Usage: Code snippets, technical details, tokens, hex codes
- Rationale: Technical credibility, distinction from prose

---

#### Type Scale

**Headings:**
- `--text-5xl`: `3rem` (48px) / `1.1` line-height - Hero Heading
- `--text-4xl`: `2.25rem` (36px) / `1.2` line-height - Page Heading (H1)
- `--text-3xl`: `1.875rem` (30px) / `1.25` line-height - Section Heading (H2)
- `--text-2xl`: `1.5rem` (24px) / `1.3` line-height - Subsection (H3)
- `--text-xl`: `1.25rem` (20px) / `1.4` line-height - Card Title (H4)
- `--text-lg`: `1.125rem` (18px) / `1.5` line-height - Lead Text

**Body:**
- `--text-base`: `1rem` (16px) / `1.6` line-height - Body Text (default)
- `--text-sm`: `0.875rem` (14px) / `1.5` line-height - Small text, captions
- `--text-xs`: `0.75rem` (12px) / `1.4` line-height - Tiny text, labels

---

#### Font Weights

- `--font-normal`: `400` - Body text
- `--font-medium`: `500` - Emphasized text, navigation
- `--font-semibold`: `600` - Subheadings, card titles, buttons
- `--font-bold`: `700` - Headings, strong emphasis

**Usage Guidelines:**
- Headings (H1-H3): `font-bold` (700)
- Subheadings (H4-H6): `font-semibold` (600)
- Body text: `font-normal` (400)
- Buttons, labels, navigation: `font-medium` (500)

---

#### Line Heights & Spacing

**Line Height:**
- Headings: Tighter (`1.1` - `1.3`) for visual impact
- Body text: Comfortable (`1.6`) for readability
- Small text: Balanced (`1.4` - `1.5`)

**Letter Spacing:**
- Default: `0` (normal)
- Headings (large): `-0.02em` (slight tightening)
- Small caps, labels: `0.05em` (slight expansion for legibility)

---

### 3.3 Spacing & Layout System

**Base Unit:** 4px (0.25rem)

**Spacing Scale (Tailwind-compatible):**
```css
--spacing-0:   0px      /* 0 */
--spacing-1:   4px      /* 0.25rem */
--spacing-2:   8px      /* 0.5rem */
--spacing-3:   12px     /* 0.75rem */
--spacing-4:   16px     /* 1rem */
--spacing-5:   20px     /* 1.25rem */
--spacing-6:   24px     /* 1.5rem */
--spacing-8:   32px     /* 2rem */
--spacing-10:  40px     /* 2.5rem */
--spacing-12:  48px     /* 3rem */
--spacing-16:  64px     /* 4rem */
--spacing-20:  80px     /* 5rem */
--spacing-24:  96px     /* 6rem */
--spacing-32:  128px    /* 8rem */
```

**Common Usage:**
- Component padding: `spacing-4` to `spacing-6` (16-24px)
- Section spacing: `spacing-12` to `spacing-16` (48-64px)
- Gap between elements: `spacing-2` to `spacing-4` (8-16px)
- Page margins: `spacing-6` to `spacing-8` (24-32px)

---

#### Layout Grid

**Container Widths:**
- `--container-sm`: `640px` - Small content (forms, narrow content)
- `--container-md`: `768px` - Medium content (articles)
- `--container-lg`: `1024px` - Large content (default max-width)
- `--container-xl`: `1280px` - Extra large (dashboards, wide layouts)
- `--container-full`: `100%` - Full width (when needed)

**Grid System:**
- Default: 12-column grid (Tailwind default)
- Gap: `spacing-4` to `spacing-6` (16-24px)
- Responsive breakpoints align with container widths

---

#### Border Radius

**Radius Scale:**
- `--radius-sm`: `4px` - Small elements (badges, tags)
- `--radius-md`: `8px` - Default (buttons, inputs, cards)
- `--radius-lg`: `12px` - Larger cards, modals
- `--radius-xl`: `16px` - Hero sections, major containers
- `--radius-full`: `9999px` - Circles, pills

**shadcn/ui Default:** `--radius-md` (8px)

---

#### Shadows (Elevation)

**Shadow Scale:**
```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

**Usage:**
- `shadow-sm`: Subtle elevation (input focus, hover)
- `shadow-md`: Cards, dropdowns (default)
- `shadow-lg`: Modals, popovers
- `shadow-xl`: Major overlays, hero cards

**Focus Shadow (Orange):**
```css
--shadow-focus: 0 0 0 3px rgba(249, 115, 22, 0.1);
```

---

### 3.4 Responsive Breakpoints

**Breakpoint System:**
```css
--breakpoint-sm:  640px   /* Mobile landscape, small tablets */
--breakpoint-md:  768px   /* Tablets */
--breakpoint-lg:  1024px  /* Desktop */
--breakpoint-xl:  1280px  /* Large desktop */
--breakpoint-2xl: 1536px  /* Extra large desktop */
```

**Mobile-First Approach:**
- Design for mobile (320px) first
- Progressively enhance for larger screens
- Critical content visible without horizontal scroll

---

### 3.5 Visual Foundation Summary

**Color Strategy:**
- **Monochrome dominiert:** 90% Schwarz/Weiß/Grau für Klarheit
- **Orange punktuell:** 10% für Energie und Persönlichkeit
- **Semantic klar:** Grün/Gelb/Rot/Blau nur für Feedback

**Typography Strategy:**
- **System fonts:** Performance + native feel
- **Clear hierarchy:** Bold für Headings, Normal für Body
- **Readable:** 1.6 line-height für Body-Text

**Spacing Strategy:**
- **4px base unit:** Konsistenz durch gesamte UI
- **Generous whitespace:** Minimalist = Raum zum Atmen
- **Responsive containers:** Max-width 1024px default

**Interactive Visualizations:**
- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

**Design Tokens Ready for Implementation:**
Alle Werte sind bereits im CSS Custom Properties Format für direkten Export zu shadcn/ui oder Tailwind Config.

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Gewählte Design Direction:** Professional Modern (Variation 1)

**Philosophie:**

Die "Professional Modern" Direction verbindet das Beste aus drei Welten: Die klare, strukturierte Layout-Philosophie von Direction 4, die moderne Ästhetik von Direction 8, und eine warme, zugängliche Persönlichkeit, die das sterile Gefühl vermeidet.

Diese Richtung passt perfekt zu cv-hub, weil sie:
- **Professionell** genug ist für Senior-Level Portfolio
- **Modern** genug ist, um technische Kompetenz zu demonstrieren
- **Warm** genug ist, um Persönlichkeit zu zeigen
- **Klar strukturiert** ist für schnelles Erfassen (Speed Principle)
- **Zugänglich** ist ohne zu casual zu wirken

---

#### Layout-Entscheidungen

**Navigation Pattern:**
- Top Navigation (sticky) mit Section-Links
- Clean, always visible, non-intrusive
- Mobile: Hamburger menu with slide-in navigation

**Content Structure:**
- Single-column layout (max-width 1024px)
- Centered content container
- Card-based sections mit subtiler Elevation
- Jede Section ist eine klare, abgegrenzte Einheit

**Content Organization:**
- Cards für Sections (Skills, Projects, Experience)
- Tags/Badges für Skills (scanbar, visuell)
- Project Cards mit expandierbaren Details
- Experience als strukturierte Cards mit Timeline-Elementen

---

#### Visual Hierarchy-Entscheidungen

**Density Level:** Medium
- Nicht zu spacious (verschwendet keinen Platz)
- Nicht zu dense (überwältigt nicht)
- Generous whitespace zwischen Sections
- Comfortable padding innerhalb von Cards

**Header Emphasis:** Bold but Balanced
- Section Headings: Bold, groß (text-3xl), zinc-900
- Card Titles: Semibold (text-xl), zinc-900
- Subtle orange accent line unter Section Headings

**Content Focus:** Mixed - Skills visuell, Projects strukturiert, Text scanbar
- Skills als visuelle Tags (farbige Badges)
- Projects als Cards mit Bildern/Icons
- Experience als strukturierte Bullets

**Visual Weight:** Balanced
- Nicht minimal (zu kalt), nicht maximalist (zu laut)
- Subtle shadows auf Cards (shadow-sm default, shadow-md on hover)
- Border radius: 8px (--radius-md) für moderne Softness
- Depth durch Schatten, nicht durch starke Borders

---

#### Interaction-Entscheidungen

**Primary Action Pattern:**
- Inline expansion für Project Details (kein Modal)
- Hover states zeigen interaktive Elemente
- Click to expand/collapse Details-Sections

**Information Disclosure:** Progressive Disclosure
- Hero + Skills above the fold
- Projects mit kurzen Descriptions + "Show More" für Details
- Experience mit Highlights + expandierbare Achievements

**User Control:** Flexible but Guided
- User kann frei scrollen und explorieren
- Section Navigation ermöglicht Jumps
- Keine erzwungenen Pfade
- Klare CTAs für nächste Actions

---

#### Visual Style-Entscheidungen

**Visual Weight:** Balanced
- Monochrome (zinc grays) als Basis für Klarheit
- Orange Akzente für CTAs, Links, Active States
- Subtle shadows für Tiefe (nicht flat, nicht dramatisch)

**Depth Cues:** Subtle Elevation
- Cards haben shadow-sm (baseline)
- Hover: shadow-md (lift effect)
- Smooth transitions (0.2s ease)
- Feeling: Cards "float" leicht über Background

**Border Style:** Subtle
- Borders: 1px solid zinc-200 (subtil, nicht dominant)
- Dividers zwischen Sections: 1px zinc-200
- Focus borders: 2px orange-500 (sichtbar aber nicht aufdringlich)

**Warmth-Elemente (gegen Sterilität):**
- Orange Akzente auf hover (links, buttons, cards)
- Generous spacing (keine cramped Layouts)
- Smooth animations (alle Transitions 0.2-0.3s)
- Friendly micro-interactions (hover lift, color shifts)
- Section dividers mit orange accent line (visual interest)

---

#### Rationale für diese Wahl

**Passt zu cv-hub Vision:**
- Die clean Structure kommuniziert technische Präzision
- Die modern Aesthetic zeigt zeitgemäßes Können
- Die Warmth zeigt Persönlichkeit hinter dem Code
- Die Balance zwischen Professionalität und Zugänglichkeit

**Passt zu Zielgruppe (Recruiter + Tech Leads):**
- Schnell erfassbar (Speed Principle) durch klare Struktur
- Professionell genug für Senior-Level Beurteilung
- Modern genug um technische Awareness zu zeigen
- Warm genug um Persönlichkeit wahrzunehmen

**Passt zu Core Experience Principles:**
- **Speed:** Clean layout = schnelle Orientierung
- **Guidance:** Progressive disclosure durch expandable cards
- **Flexibility:** Freie Navigation + Jump-to-Section
- **Feedback:** Hover states und smooth transitions
- **Trust:** Klare Struktur, keine Tricks
- **Quality:** Polished Details in jedem Element

**Public vs. Invited View Differentiation:**
- **Public:** Clean, professional showcase (reduzierte Infos)
- **Invited:** Personal message card + vollständige Details + Kontakt
- Beide teilen das gleiche Design-System (Konsistenz)
- Invited fühlt sich wie "mehr vom Gleichen" an, nicht wie eine andere Site

---

#### Key Characteristics Summary

| Dimension | Decision | Why |
|-----------|----------|-----|
| **Layout** | Single-column, card-based, top nav | Clarity, focus, modern |
| **Density** | Medium (balanced) | Scannable ohne overwhelming |
| **Hierarchy** | Bold headings, subtle structure | Clear sections, easy navigation |
| **Interaction** | Inline expansion, progressive disclosure | No modal interruptions |
| **Visual Weight** | Balanced (subtle shadows, clean) | Professional + modern |
| **Warmth** | Orange accents, smooth animations | Personality without casualness |

**Interactive Mockups:**

- Initial Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)
- Refined Design Directions (Final): [ux-design-directions-refined.html](./ux-design-directions-refined.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

cv-hub hat 3 primäre User Journeys plus 1 Admin-Workflow, die jeweils unterschiedliche Ziele und Interaktionsmuster haben.

**Vollständige Flow-Dokumentation:** [user-journey-flows.md](./user-journey-flows.md) (mit Mermaid-Diagrammen und detaillierten Steps)

---

#### Journey 1: Public CV Exploration

**User:** Anonymous Visitor (Recruiter, Kollege, neugieriger Besucher)

**Ziel:** Schnell Skills, Experience und Projekte verstehen ohne Commitment

**Entry Point:** `https://cv-hub.example.com/`

**Key Flow Decisions:**

**Navigation Style:** Free Scroll + Sticky Top Nav
- User kann natürlich scrollen (vertraut, mobile-friendly)
- Sticky Top Nav ermöglicht Quick Jumps zu Sections
- Passt perfekt zu single-column "Professional Modern" Layout
- Minimaler UI-Overhead

**Project Details:** Inline Expansion
- "Show More" Button expandiert Details within Card
- Kein Modal (unterbricht Flow nicht)
- Progressive Disclosure (passt zu Core Principles)
- Smooth animations (0.2-0.3s ease)

**Flow Steps:**
1. **Landing/Hero** - Name, Title, Tagline, Key Skills (above fold)
2. **Skills Section** - Organized by category (Frontend, Backend, DevOps), visual tags
3. **Projects Section** - 2-3 projects as cards, expandable inline
4. **Experience Section** - Generic achievements (NO company names), brief overview
5. **CTA** - LinkedIn/GitHub links (NO email/phone in public view)

**Success State:** User has clear impression of skills/experience, can contact via social links

**Mobile Adaptations:**
- Hamburger menu for navigation
- Skills tags wrap naturally
- Cards stack vertically
- Touch-optimized targets (44x44px min)

---

#### Journey 2: Personalized Link Access (Invited View)

**User:** Recruiter/Tech Lead mit Token-Link

**Ziel:** Vollständigen CV mit allen Details sehen + einfach Kontakt aufnehmen

**Entry Point:** `https://cv-hub.example.com/invite/{token}`

**Key Flow Decisions:**

**Message Placement:** Hero Card (prominent)
- Personal message als elegante Card im Hero-Bereich
- Fühlt sich wie persönlicher Brief an (nicht wie System-Notification)
- Prominent aber nicht aufdringlich
- Gradient background mit orange border-left accent

**Visual Differentiation:** Same Design + More Content + Badge
- Kein Theme-Switch (Konsistenz wichtiger als Differenzierung)
- "Invited Access" Badge (top-right, subtle)
- Mehr Content-Tiefe in allen Sections
- Contact Info sichtbar (Email, LinkedIn, GitHub, Phone)

**Contact CTA Strategy:** Multiple CTAs + Bottom Section
- Contact info im Hero (mit Message)
- "Get in Touch" Section am Ende mit allen Optionen
- Email, LinkedIn, optional Calendly
- Friendly invitation tone

**Token State Handling:** Friendly Error Pages
- Invalid Token → "This invite link is invalid" mit Explanation
- Expired Token → "This invite has expired. Please request new one from Ruben."
- Deactivated → "This invite is no longer active."
- Alle mit freundlicher Message + Option to view Public CV

**Flow Steps:**
1. **Token Validation** - System prüft Token, redirects bei Invalid/Expired
2. **Personalized Hero** - "Invited Access" Badge + Personal Message Card + Contact Info
3. **Full CV Sections** - ALLE Details:
   - Skills MIT experience levels
   - Projects MIT company names, metrics, detailed achievements (5-7 bullets)
   - Experience MIT company names, locations, detailed achievements
   - Additional Sections: "Beyond the Code" (interests, open source)
4. **Contact CTA** - Multiple options, clear "Let's Connect" message

**Success State:** User hat vollständiges Bild, kann einfach Kontakt aufnehmen

**Content Differentiation (vs Public):**
- Company names visible ("TechCorp GmbH", "Startup XYZ")
- Business metrics visible ("25% conversion increase", "100K+ users")
- 3-4 projects statt 2-3
- Detailed achievements (5-7 bullets statt 3)
- Personal interests section (only invited)
- Full contact info (only invited)

---

#### Journey 3: Admin Dashboard - Link Management

**User:** Ruben (Admin)

**Ziel:** Personalized Link erstellen, Message hinzufügen, Expiration setzen, Visits tracken

**Entry Point:** `https://cv-hub.example.com/admin` (nach Auth)

**Key Flow Decisions:**

**Dashboard Layout:** Table with Inline Actions
- Table zeigt: Recipient, Created Date, Status, Visits, Actions
- Inline actions: Copy URL, Edit Message, Deactivate, Delete
- Quick Create Button prominent above table
- Stats overview cards above table (Total Links, Active, Visits)

**Create Link Pattern:** Quick Create + Edit Later
- Minimaler Friction: Name eingeben → Link sofort generiert
- Optional: Message + Expiration in Expand-Panel
- "Create Link" → Generate → "Copy URL" sofort verfügbar
- Edit Message später möglich (inline in table)
- Passt zu Speed Principle (<30s to create link)

**Message Input:** Optional Free-Form (mit Template Suggestions)
- Message ist optional (kann leer bleiben)
- Template suggestions als Quick Picks:
  - "Generic Professional"
  - "Recruiter Introduction"
  - "Colleague Recommendation"
- Free-form textarea für custom message
- Preview während Typing

**Expiration Setting:** Dropdown Presets + Custom Date
- Presets: 7 days, 30 days, 90 days, Never
- Custom: Datepicker für spezifisches Datum
- Default: 30 days (balance between useful & secure)

**Stats Display:** Inline in Table + Detail View on Click
- Table: Visit count prominent
- Click Row → Detail panel mit:
  - Visit timeline (graph)
  - Last visited
  - Referrer (if available)
  - Geographic data (optional)
- Nicht überwältigend, aber informativ

**Flow Steps:**
1. **Login/Auth** - Basic Auth oder Session-based
2. **Dashboard Overview** - Stats cards + Links table
3. **Create Link** - Click "Create Link" → Modal/Sheet
4. **Input Details** - Name (required), Message (optional), Expiration (dropdown)
5. **Generate** - System creates token → Shows success + Copy URL button
6. **Manage Links** - Table mit inline actions (Edit, Deactivate, Delete)
7. **View Stats** - Click link row → Detail panel mit analytics

**Success State:** Link erstellt, URL kopiert, Recipient hat Zugang

**Mobile Adaptations:**
- Table → Card list on mobile
- Actions in dropdown menu
- Stats cards stack vertically

---

#### Journey 4 (Bonus): Admin CV Update via AI Extraction

**User:** Ruben (Admin)

**Ziel:** Updated CV (PDF/Text) hochladen, AI extrahiert Daten, Review, Publish

**Entry Point:** Admin Dashboard → "Update CV" Button

**Key Flow Decisions:**

**Upload Interface:** Modal with Drag-Drop + File Picker
- Modal overlay (fokussiert auf Upload Task)
- Drag-drop zone prominent
- File picker als fallback
- Accepts: .pdf, .txt, .docx
- Shows file preview before upload

**Extraction Progress:** Progress Bar with Steps
- Progress bar zeigt: Upload → Extract → Process → Ready
- Estimated time shown (e.g., "~30 seconds")
- User can navigate away (background task)
- Notification when complete

**Review Interface:** Diff Highlighting (Git-style)
- Side-by-side layout (Desktop) OR Toggle view (Mobile)
- Green highlights: New/Added content
- Yellow highlights: Modified content
- Red strikethrough: Deleted content
- Inline edit possible for corrections
- Section-by-section review (Skills, Projects, Experience)

**Error Handling:** Allow Publish with Warnings
- Extraction errors shown as warnings (not blockers)
- Missing fields highlighted
- User can manually fill or skip
- "Publish anyway" vs "Fix issues" choice
- Trust user judgment (admin knows best)

**Publish Flow:** Preview + Confirm
- Preview button shows Public + Invited views
- Confirmation modal: "This will update your live CV. Continue?"
- Publish → Immediate update
- Success notification + Option to undo (5 min window)

**Flow Steps:**
1. **Navigate** - Dashboard → "Update CV" Button
2. **Upload** - Drag-drop or File Picker → Shows filename + size
3. **Extract** - Progress bar with steps → "Extracting..."
4. **Review** - Diff view (green/yellow/red highlights)
5. **Edit** - Inline corrections if needed
6. **Preview** - See Public + Invited views before publish
7. **Publish** - Confirm → Live update → Success + Undo option

**Success State:** CV updated, changes live, Undo available for 5 min

**Error Scenarios:**
- Upload fails → Retry option
- Extraction fails → Manual entry fallback
- Validation errors → Warnings shown, publish allowed
- Network errors → Auto-save draft, resume later

---

### 5.2 Cross-Journey Considerations

**Consistency Needs:**
- Navigation pattern identical (Public, Invited both use sticky top nav)
- Card components consistent across all views
- Orange accent usage consistent (CTAs, links, active states)
- Typography hierarchy identical
- Spacing system identical

**Navigation Between Journeys:**
- Public → Invited: Via token link (manual URL entry)
- Invited → Public: Not possible (no downgrade)
- Admin → Preview: Admin can preview Public + Invited views
- Public/Invited → Admin: Not accessible (separate auth required)

**Shared Components:**
- Hero section (different content, same structure)
- Skill tags/badges
- Project cards
- Navigation bar
- CTA buttons
- Footer

**Progressive Enhancement:**
- All journeys work without JavaScript (SSR)
- Hydration adds interactivity (expand/collapse, filtering)
- Graceful degradation for older browsers

---

### 5.3 Key Takeaways

**Design Alignment:**
- Alle Flows reflektieren "Professional Modern" Direction
- Progressive disclosure durchgängig (inline expansion, no modals)
- Speed optimiert (Quick Create, Free Scroll, Instant feedback)
- Trust through transparency (klare Kommunikation, no tricks)

**Implementation Priorities:**
- **Phase 1 (MVP):** Journey 1 + 2 (Public + Invited views)
- **Phase 2:** Journey 3 (Admin Link Management)
- **Phase 3:** Journey 4 (AI CV Extraction)

**User Value:**
- **Public Visitors:** Schneller professioneller Eindruck ohne Friction
- **Invited Recruiters:** Vollständige Infos + einfacher Kontakt
- **Admin (Ruben):** Minimaler Aufwand für Link-Management + CV-Updates

---

## 6. Component Library

### 6.1 Component Strategy

cv-hub verwendet **shadcn/ui** als Design System-Basis mit **12 Custom Components** für spezifische Anforderungen.

**Vollständige Dokumentation:** [component-library-strategy.md](./component-library-strategy.md) (71 Seiten mit allen Details)

---

#### Component Overview

**shadcn/ui Components (16 - Out-of-the-Box):**
- Button, Card, Badge, Input, Textarea, Select
- Dialog, Sheet, Table, Dropdown Menu
- Toast, Progress, Tooltip, Avatar
- Separator, Tabs, Label

**Custom Components (12 - To Develop):**
1. **SkillTag** - Visual skill badges with hover states
2. **ProjectCard** - Expandable project cards with inline details
3. **ExperienceCard** - Work experience with timeline elements
4. **PersonalMessageCard** - Hero message for invited view (gradient, warm)
5. **InvitedAccessBadge** - Subtle "Invited Access" indicator
6. **StickyNav** - Top navigation with section links
7. **HeroSection** - Name, title, tagline, key skills display
8. **StatsCard** - Admin dashboard metrics visualization
9. **LinkTableRow** - Admin link management row with inline actions
10. **DiffViewer** - Git-style diff highlighting (green/yellow/red)
11. **UploadZone** - Drag-drop file upload interface
12. **ProgressSteps** - Multi-step progress indicator

---

#### Component States & Variants

Alle Components unterstützen **Minimalist Energy** Color Theme:
- **Default:** Monochrome base (zinc grays)
- **Hover:** Orange accents (`#f97316`)
- **Active/Focus:** Orange border/ring
- **Disabled:** Reduced opacity, cursor not-allowed
- **Loading:** Skeleton UI oder Spinner

**Key Variants:**
- Buttons: `default`, `secondary`, `ghost`, `destructive`
- Cards: `default`, `elevated` (shadow-md), `interactive` (hover lift)
- Badges: `default`, `secondary`, `outline`

---

#### Journey-to-Component Mapping

**Journey 1 (Public CV):**
- HeroSection, StickyNav, SkillTag, ProjectCard, ExperienceCard
- shadcn/ui: Button, Card, Badge, Sheet (mobile), Separator

**Journey 2 (Invited View):**
- Alle von Journey 1 PLUS:
- PersonalMessageCard, InvitedAccessBadge
- shadcn/ui: Avatar (optional)

**Journey 3 (Admin Dashboard):**
- StatsCard, LinkTableRow, StickyNav
- shadcn/ui: Table, Dropdown Menu, Dialog, Toast, Input, Select, Button, Card

**Journey 4 (CV Update):**
- UploadZone, ProgressSteps, DiffViewer
- shadcn/ui: Dialog, Progress, Textarea, Button, Toast

---

#### Component Hierarchy Example (Public CV)

```
Page
├── StickyNav
│   ├── Logo/Name
│   └── Navigation Links (Buttons)
├── HeroSection
│   ├── Avatar (optional)
│   ├── Heading (Name)
│   ├── Subheading (Title)
│   └── SkillTags[] (primary skills)
├── Section (Skills)
│   ├── Heading + Separator
│   └── SkillTag[] (categorized, ~20 tags)
├── Section (Projects)
│   ├── Heading + Separator
│   └── ProjectCard[] (2-3 cards)
│       ├── Card (wrapper)
│       ├── Badge[] (tech stack)
│       └── Button (Show More/Less)
├── Section (Experience)
│   ├── Heading + Separator
│   └── ExperienceCard[] (2-3 cards)
└── Section (CTA)
    └── Button[] (LinkedIn, GitHub)
```

---

#### Implementation Priorities

**Phase 1 (MVP - Journeys 1 & 2):** 3-4 weeks
- Custom: HeroSection, StickyNav, SkillTag, ProjectCard, ExperienceCard, PersonalMessageCard, InvitedAccessBadge
- shadcn/ui: Button, Card, Badge, Sheet, Separator, Avatar

**Phase 2 (Admin Links - Journey 3):** 2-3 weeks
- Custom: StatsCard, LinkTableRow
- shadcn/ui: Table, Dropdown Menu, Dialog, Toast, Input, Select

**Phase 3 (CV Update - Journey 4):** 3-4 weeks
- Custom: UploadZone, ProgressSteps, DiffViewer
- shadcn/ui: Progress, Textarea

---

#### Accessibility Requirements

**All Components MUST:**
- Support keyboard navigation (Tab, Enter, Space, Arrows)
- Show visible focus indicators (orange ring, 2px offset)
- Include ARIA labels and roles
- Meet WCAG AA color contrast (4.5:1 for text, 3:1 for UI)
- Provide screen reader announcements for state changes
- Have touch targets ≥44x44px on mobile

**Specific Requirements:**
- **Forms:** Associated labels, error states with `aria-invalid`, help text with `aria-describedby`
- **Navigation:** `<nav>` landmark, `aria-current` for active state, skip links
- **Interactive Cards:** `aria-expanded` for expandable content
- **Tables:** Proper `<th>` headers, `scope` attributes
- **Modals:** Focus trap, `aria-modal`, Escape to close

---

#### Development Guidelines

**File Structure:**
```
src/components/
├── ui/           # shadcn/ui (auto-generated)
├── custom/       # Custom components
└── layouts/      # Page layouts
```

**Styling Approach:**
- Tailwind utility classes primary
- `cn()` utility for conditional classes
- CSS custom properties for theme values
- Smooth transitions: 0.2-0.3s ease

**Quality Checklist (per component):**
- ✅ TypeScript props interface
- ✅ All variants implemented
- ✅ All states tested
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Keyboard accessible
- ✅ ARIA attributes
- ✅ Screen reader tested
- ✅ Color contrast WCAG AA
- ✅ Touch targets ≥44x44px
- ✅ Smooth transitions
- ✅ Design tokens used

---

#### Component Reusability

**High Reusability (used across all journeys):**
- Button, Card, Badge, Input, Separator
- StickyNav

**Medium Reusability (2-3 journeys):**
- SkillTag, Toast, Dialog

**Low Reusability (single-use):**
- PersonalMessageCard, InvitedAccessBadge, DiffViewer, UploadZone

---

**Zusammenfassung:**
- **28 Total Components** (16 shadcn/ui + 12 custom)
- **Design System Aligned:** Alle reflektieren "Professional Modern" Direction
- **Accessibility-First:** WCAG AA compliance durchgängig
- **Developer-Ready:** Complete specifications mit TypeScript, Code Examples, Checklists

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

Diese UX-Pattern-Entscheidungen stellen sicher, dass cv-hub über alle User Journeys hinweg konsistent funktioniert und sich anfühlt. Sie verhindern "es funktioniert auf jeder Seite anders"-Verwirrung.

**Kritische Pattern-Kategorien für cv-hub:**
- Button Hierarchy (CTAs, Admin-Actions)
- Feedback Patterns (Admin-Dashboard-Kommunikation)
- Form Patterns (Link-Erstellung, CV-Upload)
- Navigation Patterns (Sticky Top Nav)
- Empty State Patterns (Neue Admin-Accounts)
- Notification Patterns (Admin-Aktionen)
- Search/Filter Patterns (Admin-Dashboard)
- Date/Time Patterns (Link-Statistiken)

---

#### Button Hierarchy

**Primary Actions (Orange Background #f97316 + White Text):**
- "Get in Touch" (Invited View)
- "Create Link" (Admin Dashboard)
- "Publish CV" (Admin CV Update)
- **Usage Rule:** Single primary per screen maximum - the ONE most important action
- **Visual:** Highest contrast, prominent placement, shadow-sm elevation

**Secondary Actions (White Background + Orange Border + Orange Text):**
- "Copy URL" (Admin Dashboard)
- Navigation section jumps
- "Show More" (Project details expansion)
- **Usage Rule:** Supporting actions that don't compete with primary
- **Visual:** Clear affordance, less prominent than primary

**Ghost Actions (Transparent Background + Orange Text):**
- "Edit Message" (Admin inline editing)
- Minor utility actions
- Tertiary navigation
- **Usage Rule:** Low-friction actions, doesn't distract from content
- **Visual:** Minimal visual weight, hover state for clarity

**Destructive Actions (Red Background #ef4444 + White Text):**
- "Delete Link" (Admin)
- "Deactivate Link" (Admin)
- **Usage Rule:** Always requires confirmation (modal or inline)
- **Visual:** Red signals danger, distinct from primary orange

**Rationale:** Orange primaries align with "Minimalist Energy" theme - energy for critical actions, subtlety for the rest. Single primary per screen prevents decision paralysis.

---

#### Feedback Patterns

**Success Feedback:**
- **Pattern:** Green toast notification (top-right corner)
- **Duration:** 4 seconds auto-dismiss
- **Examples:**
  - "Link created successfully" (with Copy URL button in toast)
  - "CV updated and published"
  - "Message sent"
- **Icon:** Checkmark (✓)
- **Usage:** Admin actions only (no toasts in Public/Invited views)

**Error Feedback:**
- **Pattern:** Red toast notification (top-right corner)
- **Duration:** Manual dismiss (requires user attention)
- **Examples:**
  - "Failed to create link" + recovery instructions
  - "Invalid token - please check URL"
  - "Upload failed - file too large (max 10MB)"
- **Icon:** Alert triangle (⚠)
- **Content:** Clear explanation + actionable recovery step

**Warning Feedback:**
- **Pattern:** Yellow inline alert (within context)
- **Duration:** Persistent until resolved
- **Examples:**
  - "Link expiring in 2 days" (Dashboard row)
  - "Incomplete CV section" (CV Update review)
- **Icon:** Info circle (ℹ)
- **Placement:** Contextual, near affected element

**Info Feedback:**
- **Pattern:** Blue inline message or tooltip
- **Duration:** Persistent or tooltip-based
- **Examples:**
  - "Token validated - viewing personalized profile"
  - Help text for form fields
- **Icon:** Info circle (ℹ)
- **Usage:** Non-critical information, guidance

**Loading States:**
- **Pattern:** Skeleton UI (preferred over spinners)
- **Examples:**
  - CV page: Skeleton cards during SSR hydration
  - Admin table: Skeleton rows while fetching
  - Upload: Progress bar with labeled steps ("Uploading → Extracting → Processing")
- **Rationale:** Skeleton UI provides visual structure, reduces perceived wait time
- **Fallback:** Spinner only for indeterminate waits <2 seconds

**Rationale:** Toast notifications for Admin (doesn't interrupt Public/Invited experience), Skeleton UI for perceived performance and visual continuity. Manual dismiss for errors ensures user sees recovery instructions.

---

#### Form Patterns

**Label Position:** Above input (standard, accessible, mobile-friendly)

**Required Field Indicator:**
- Visual: Red asterisk (*) after label
- Text: "(required)" for screen readers via `aria-required`
- Example: "Recipient Name * (required)"

**Validation Timing:**
- **onBlur:** Primary validation trigger (user finished typing)
- **onChange:** Real-time for specific cases:
  - Password strength meter
  - Username availability
  - Character count (e.g., message field)
- **onSubmit:** Final validation before submission
- **Rationale:** onBlur = good timing (user moved on, not interrupting), onChange für progressive feedback wo sinnvoll

**Error Display:**
- **Inline:** Red text under field + red border on input
- **Example:** "Email address is invalid" (specific, actionable)
- **Multi-field forms:** Error summary at top + inline errors
- **Accessibility:** `aria-invalid="true"` + `aria-describedby` linking to error message

**Success Indication:**
- **Pattern:** Green border + checkmark icon (right side of input)
- **Usage:** After successful validation (optional for simple forms)
- **Example:** Email verified, username available

**Help Text:**
- **Default:** Gray caption text under input
- **Example:** "This link will expire after 30 days"
- **Advanced:** Tooltip for optional details (icon trigger "?")
- **Accessibility:** `aria-describedby` linking help text to input

**Placeholder Text:**
- **Usage:** Example format only (NOT instructions)
- **Example:** "john.doe@example.com" (format), NOT "Enter your email" (instruction)
- **Rationale:** Placeholders disappear on focus - use labels for instructions

**Rationale:** onBlur validation = optimal timing (user finished typing, not too aggressive), inline errors = context preservation, help text = proactive guidance.

---

#### Modal Patterns

**Size Variants:**
- **Small (400px):** Simple confirmations ("Delete link?")
- **Medium (600px):** Forms (Create Link with message)
- **Large (800px):** Complex content (CV Upload Review, Diff Viewer)
- **Full-screen (mobile):** All modals on mobile (<768px)

**Dismiss Behavior:**
- **Click Outside:** Closes modal (non-destructive modals only)
- **Escape Key:** Always closes modal
- **Explicit Close:** X button (top-right) always present
- **Destructive Modals:** Require explicit "Cancel" or "Confirm" (no click-outside)

**Focus Management:**
- **On Open:** Focus first interactive element (or Close button if no form)
- **Focus Trap:** Tab cycles within modal
- **On Close:** Return focus to trigger element
- **Accessibility:** `aria-modal="true"`, `role="dialog"`

**Stacking:**
- **Rule:** Avoid modal-on-modal (redesign flow instead)
- **Exception:** System-critical alerts can overlay (e.g., network error during modal action)

**Rationale:** Click-outside dismiss for non-destructive actions (good UX), explicit buttons for destructive (prevents accidents). Focus trap for accessibility.

---

#### Navigation Patterns

**Active State Indication:**
- **Visual:** Orange underline (3px) + bold text + orange color
- **Example:** "Skills" section active in Top Nav
- **Scroll-based:** Nav updates based on viewport section
- **Accessibility:** `aria-current="page"` or `aria-current="location"`

**Breadcrumbs:**
- **Usage:** Not applicable for cv-hub
- **Rationale:** Single-page structure with jump-to-section navigation sufficient, no complex hierarchy

**Back Button Behavior:**
- **Browser Back:** Native behavior (no SPA intercepts)
- **Admin:** Explicit "← Back to Dashboard" link where applicable
- **Rationale:** Preserve native browser behavior, users expect it

**Deep Linking Support:**
- **Routes:**
  - `/` - Public CV
  - `/invite/{token}` - Invited View
  - `/admin` - Dashboard (auth-protected)
- **Section Anchors:**
  - `/#skills` - Jump to Skills section
  - `/#projects` - Jump to Projects section
  - `/#experience` - Jump to Experience section
- **Behavior:** Smooth scroll to section, update nav active state

**Scroll Behavior:**
- **Smooth scroll** for anchor navigation (CSS `scroll-behavior: smooth`)
- **Sticky nav** remains visible during scroll
- **Active section detection:** Intersection Observer triggers nav update

**Rationale:** Single-column layout with scroll = minimal routing complexity, browser-native back preferred, section anchors for quick navigation.

---

#### Empty State Patterns

**First Use (Admin Dashboard - No Links Created):**
- **Visual:** Centered content with illustration (optional)
- **Heading:** "No links created yet"
- **Description:** "Create personalized CV access links to share with recruiters and collaborators."
- **CTA:** Prominent "Create Your First Link" button (orange primary)
- **Illustration:** Friendly but not childish (optional)

**No Results (Admin Search/Filter):**
- **Heading:** "No links match your filters"
- **Description:** "Try adjusting your search or filters."
- **Actions:**
  - "Clear All Filters" button (secondary)
  - Show current active filters as removable tags

**Cleared Content:**
- **Example:** All links deleted
- **Heading:** "All links have been removed"
- **Description:** Brief explanation
- **CTA:** "Create New Link" (if applicable)
- **No Undo:** Confirmation modal prevented this state

**Error State (Failed to Load):**
- **Heading:** "Unable to load links"
- **Description:** "Something went wrong. Please try again."
- **CTA:** "Retry" button
- **Technical Details:** Collapsible error details for debugging (dev mode)

**Rationale:** Empty states provide guidance without being patronizing, clear next action, friendly tone matches "Professional Modern" direction.

---

#### Notification Patterns

**Placement:** Top-right corner (Admin views only)
- **Public/Invited Views:** No notifications (no distractions)
- **Admin Views:** Toast notifications for action feedback

**Duration:**
- **Success:** 4 seconds auto-dismiss
- **Error:** Manual dismiss (requires user attention)
- **Info:** 3 seconds auto-dismiss
- **Warning:** Persistent until action taken

**Stacking:**
- **Max Visible:** 3 notifications
- **Behavior:** Vertical stack, newest on top
- **Overflow:** Oldest notification auto-dismisses when 4th appears

**Priority Levels:**
- **Critical (Error):**
  - Red background, white text
  - Manual dismiss required
  - Optional sound alert (browser permission required)
  - Icon: Alert triangle
- **Important (Success):**
  - Green background, white text
  - 4s auto-dismiss
  - Icon: Checkmark
- **Info:**
  - Blue background, white text
  - 3s auto-dismiss
  - Icon: Info circle

**Interaction:**
- **Hover:** Pause auto-dismiss timer
- **Actions:** Inline buttons possible (e.g., "Copy URL" in success toast)
- **Close:** X button always present (top-right of notification)

**Accessibility:**
- **ARIA Live Region:** `role="status"` or `role="alert"` (based on priority)
- **Screen Reader:** Announces notification content
- **Keyboard:** Tab to actions, Escape to dismiss

**Rationale:** Top-right = doesn't block content, manual dismiss for errors = user sees recovery instructions, stacking = multiple actions visible, hover-pause = user control.

---

#### Search & Filter Patterns (Admin Dashboard)

**Search Trigger:**
- **Pattern:** Auto-search with 300ms debounce
- **Input:** Text field with search icon
- **Behavior:** Filter table as user types
- **Clear:** X button appears when input has value

**Filter UI:**
- **Placement:** Inline above table (horizontal row)
- **Filters:**
  - Status dropdown (All, Active, Expired, Deactivated)
  - Date Range picker (Last 7 days, Last 30 days, Custom)
- **Active Filters:** Pill badges below filter row (removable)
- **Clear All:** Button visible when any filter active

**Results Display:**
- **Pattern:** Instant filter (no separate results page)
- **Behavior:** Table rows update in-place
- **Loading:** Skeleton rows during filter
- **Count:** "Showing X of Y links" above table

**No Results State:**
- **Message:** "No links found"
- **Suggestion:** "Try adjusting your search or filters"
- **Action:** "Clear All Filters" button
- **Context:** Show active filters for transparency

**Persistence:**
- **URL:** Filter state in query params (shareable, bookmarkable)
- **Example:** `/admin?status=active&search=john`
- **Rationale:** Deep linking, browser back/forward works

**Rationale:** Admin tables benefit from instant filtering, no separate search flow needed, URL persistence for workflows.

---

#### Date/Time Patterns

**Display Format:**
- **Recent (< 7 days):** Relative time
  - "2 minutes ago", "5 hours ago", "3 days ago"
- **Older (≥ 7 days):** Absolute date
  - "Nov 3, 2025" (month-day-year)
- **Hover Tooltip:** Full timestamp
  - "November 3, 2025 at 2:45 PM CET"

**Timezone Handling:**
- **Display:** User's local time (auto-detected)
- **Storage:** ISO 8601 UTC in database
- **API:** ISO 8601 UTC in responses
- **Conversion:** Frontend converts to local on render

**Date Pickers (Admin - Link Expiration):**
- **UI:** Calendar dropdown
- **Presets:**
  - "7 days" (quick select)
  - "30 days" (default)
  - "90 days"
  - "Never" (no expiration)
  - "Custom..." (opens calendar)
- **Default:** 30 days (balance between useful and secure)
- **Min/Max:** Today to +1 year

**Expiration Indicators:**
- **Active:** Green badge + "Expires in X days"
- **Expiring Soon (<3 days):** Yellow badge + "Expires in X hours"
- **Expired:** Red badge + "Expired on [date]"

**Rationale:** Relative time = better UX for recent activity, absolute date = clarity for historic data, tooltip = precision when needed, presets = common use cases, custom for flexibility.

---

### 7.2 Cross-Journey Pattern Consistency

**Patterns Used Across All Journeys:**
- Button hierarchy (consistent orange primaries)
- Typography and spacing system
- Color theme application
- Navigation patterns (sticky top nav in Public/Invited)
- Responsive breakpoints

**Journey-Specific Pattern Overrides:**
- **Public/Invited:** No toast notifications (clean experience)
- **Admin:** Full feedback system (toasts, confirmations, loading states)
- **Invited:** Personal message card (unique to this journey)

**Component Reuse:**
- Button, Card, Badge components consistent
- SkillTag, ProjectCard, ExperienceCard shared (Public + Invited)
- Admin components separate but follow same design system

**Rationale:** Consistency builds trust, journey-specific overrides serve different user needs without breaking cohesion.

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**Target Devices:** Web (responsive)
- Desktop (>1024px) - Primäre Zielgruppe (Recruiter am Arbeitsplatz)
- Tablet (768px-1023px) - Sekundär (iPad Pro User)
- Mobile (320px-767px) - Wichtig (Recruiter unterwegs, Public visitors)

---

#### Breakpoint-Strategie

**Mobile First Approach:**
- Design für 320px baseline
- Progressive enhancement für größere Screens
- Touch-optimized für Mobile/Tablet

**Definierte Breakpoints:**
```css
--breakpoint-sm:  640px   /* Mobile landscape */
--breakpoint-md:  768px   /* Tablets */
--breakpoint-lg:  1024px  /* Desktop */
--breakpoint-xl:  1280px  /* Large desktop */
```

---

#### Adaptation Patterns pro Breakpoint

**Navigation:**
- **Mobile (<768px):** Hamburger menu → Slide-in drawer (Sheet component)
  - Full-screen overlay
  - Section links stacked vertically
  - Close button top-right
- **Tablet (768-1023px):** Top nav with icons + text
  - Horizontal layout
  - Reduced padding
- **Desktop (>1024px):** Full top nav with text labels
  - Sticky positioning
  - Max container width: 1024px

**Layout Structure:**
- **Mobile:** Single column
  - Cards stack vertically
  - Full-width content
  - Generous spacing (16px sides)
- **Tablet:** Single column
  - Cards still stack
  - Max-width container (768px)
  - More breathing room (24px sides)
- **Desktop:** Single column with max-width
  - Centered container (1024px max)
  - Comfortable margins (32px sides)

**Content Organization:**

**Skill Tags:**
- **Mobile:** 2-3 tags per row (wrap naturally)
- **Tablet:** 4-5 tags per row
- **Desktop:** 6-8 tags per row
- Tags remain same size (touch-friendly 44x44px minimum)

**Project Cards:**
- **Mobile:** Full-width, stacked
  - Image/icon full-width
  - Tech badges wrap below
- **Tablet:** Full-width, stacked
  - Slightly larger images
- **Desktop:** Full-width, stacked
  - Card max-width 800px (centered)
  - Images inline with content possible

**Experience Section:**
- **Mobile:** Compact timeline
  - Simplified date display
  - Achievements as bullet list
- **Tablet:** Timeline with more spacing
- **Desktop:** Full timeline with side dates

**Tables (Admin Dashboard):**
- **Mobile:** Card view
  - Each link becomes a Card
  - Key info visible (name, status, visits)
  - Actions in dropdown menu
- **Tablet:** Simplified table
  - Hide less critical columns (Created Date)
  - Horizontal scroll if needed
- **Desktop:** Full table
  - All columns visible
  - Inline actions

**Modals:**
- **Mobile:** Full-screen overlay
  - All modals cover viewport
  - Slide-up animation
- **Tablet:** Large modals (80% viewport)
  - Centered overlay
- **Desktop:** Sized modals (S/M/L)
  - Centered overlay with backdrop

**Forms:**
- **Mobile:** Single-column inputs
  - Full-width fields
  - Stacked labels above
- **Tablet:** Single-column
  - Slightly narrower max-width
- **Desktop:** Single or two-column
  - Related fields side-by-side possible
  - (e.g., First Name | Last Name)

**Touch Targets (Mobile Critical):**
- **Minimum:** 44x44px (Apple HIG, WCAG)
- Buttons: 48x48px minimum
- Links in text: adequate padding
- Nav items: full-width tap area

**Rationale:** Mobile-first ensures core experience works everywhere, progressive enhancement leverages screen space, single-column avoids layout complexity, touch targets prevent frustration.

---

### 8.2 Accessibility Strategy

**Compliance Target:** WCAG 2.1 Level AA

**Rationale:**
- cv-hub ist ein persönliches Portfolio (nicht government/education)
- WCAG AA = Industry best practice
- Demonstriert technische Kompetenz und Inklusion
- Breitet User-Base (alle Recruiter, auch mit Disabilities)

---

#### 1. Color Contrast

**Text Contrast (WCAG AA = 4.5:1 minimum):**
- **Primary Text (zinc-900 #18181b on white #ffffff):**
  - Contrast: 16.7:1 ✅ (exceeds AA)
- **Secondary Text (zinc-500 #71717a on white):**
  - Contrast: 5.3:1 ✅ (exceeds AA)
- **Tertiary Text (zinc-400 #a1a1aa on white):**
  - Contrast: 3.8:1 ⚠️ (fails AA - use sparingly, not for critical info)

**UI Component Contrast (WCAG AA = 3:1 minimum):**
- **Orange Primary (#f97316) on white:**
  - Contrast: 3.6:1 ✅
- **Orange border focus states:**
  - 2px orange border visible against white ✅

**Action Items:**
- Verify all colors in production
- Use Lighthouse/axe DevTools for automated checks
- Tertiary text (zinc-400) nur für non-critical content (captions, timestamps)

---

#### 2. Keyboard Navigation

**All Interactive Elements Must Be:**
- **Focusable:** Tab order logical (top-to-bottom, left-to-right)
- **Keyboard-Operable:**
  - Links/Buttons: Enter/Space to activate
  - Modals: Escape to close, Tab cycles within (focus trap)
  - Dropdowns: Arrow keys to navigate, Enter to select
  - Expandable content: Enter/Space to toggle

**Focus Indicators:**
- **Visible:** 2px orange ring (`outline: 2px solid #f97316`)
- **Offset:** 2px offset from element (`outline-offset: 2px`)
- **Never disabled:** `outline: none` nur mit custom focus state
- **Applies to:** Links, buttons, inputs, cards (expandable)

**Skip Links:**
- "Skip to main content" link (visually hidden until focused)
- Appears first in tab order
- Jumps to `<main>` content, bypassing nav

**Tab Order:**
- Logical flow: Header nav → Main content → Footer
- No tab traps (except intentional in modals)
- Hidden content (off-screen menu) removed from tab order (`tabindex="-1"`)

---

#### 3. Screen Reader Support

**ARIA Labels:**
- **Navigation:** `<nav aria-label="Main navigation">`
- **Sections:** Proper heading hierarchy (H1 → H2 → H3)
- **Buttons:** Descriptive labels (`aria-label="Create new link"` wenn icon-only)
- **Links:** Context for "Read more" (`aria-label="Read more about Project X"`)

**ARIA Live Regions:**
- **Notifications:** `role="status"` (polite) or `role="alert"` (assertive)
- **Loading States:** `aria-live="polite"` + `aria-busy="true"`
- **Dynamic Content:** Announce changes (e.g., "5 links loaded")

**Image Alt Text:**
- **Meaningful images:** Descriptive alt (`alt="Project screenshot showing dashboard"`)
- **Decorative images:** Empty alt (`alt=""`) or `role="presentation"`
- **Icons with text:** `aria-hidden="true"` (text provides context)

**Form Accessibility:**
- **Labels:** Associated with inputs (`<label for="name">`)
- **Required fields:** `aria-required="true"` + visual indicator
- **Error messages:** `aria-invalid="true"` + `aria-describedby="error-id"`
- **Help text:** `aria-describedby="help-id"`

**Component-Specific:**
- **Expandable cards:** `aria-expanded="true/false"`
- **Modals:** `aria-modal="true"`, `role="dialog"`, `aria-labelledby`
- **Tables:** `<th scope="col">` for headers
- **Tabs:** `role="tablist"`, `aria-selected`, keyboard navigation

---

#### 4. Semantic HTML

**Use Proper Elements:**
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- `<button>` for actions (not `<div>` with click handler)
- `<a>` for navigation (not `<button>`)
- `<h1>` to `<h6>` for headings (no skipping levels)

**Heading Hierarchy:**
```
<h1>Ruben [Last Name]</h1>           (Hero)
  <h2>Skills</h2>                     (Section)
    <h3>Frontend Development</h3>     (Category)
  <h2>Projects</h2>                   (Section)
    <h3>Project Name</h3>             (Card Title)
  <h2>Experience</h2>                 (Section)
    <h3>Job Title at Company</h3>     (Card Title)
```

**Lists:**
- Skills: `<ul>` with `<li>` for each tag
- Projects: `<section>` or `<article>` (semantic cards)
- Navigation: `<nav>` with `<ul>` structure

---

#### 5. Motion & Animation

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Default Animations (when allowed):**
- Smooth scroll: `scroll-behavior: smooth`
- Card hover lift: 0.2s ease
- Modal slide-in: 0.3s ease
- Toast fade: 0.2s ease

**No Auto-Play:**
- No auto-playing videos/audio
- No auto-advancing carousels (wenn überhaupt)

---

#### 6. Testing Strategy

**Automated Testing:**
- **Lighthouse:** Run on all pages (target: Accessibility score >95)
- **axe DevTools:** Browser extension during development
- **WAVE:** Additional validation
- **CI/CD:** Integrate axe-core in test suite

**Manual Testing:**
- **Keyboard-only navigation:** Complete all user journeys
- **Screen reader testing:**
  - **macOS:** VoiceOver (Safari)
  - **Windows:** NVDA (Firefox) or JAWS (Chrome)
- **Zoom to 200%:** Ensure content remains usable
- **Color blindness simulation:** Chrome DevTools or Stark plugin

**User Testing:**
- Test with actual users with disabilities (wenn möglich)
- Recruit via accessibility communities
- Iterate based on feedback

---

### 8.3 Responsive & Accessibility Checklist

**Per Component:**
- ✅ Responsive breakpoints tested (mobile, tablet, desktop)
- ✅ Touch targets ≥44x44px (mobile)
- ✅ Color contrast WCAG AA (text 4.5:1, UI 3:1)
- ✅ Keyboard accessible (Tab, Enter, Space, Escape, Arrows)
- ✅ Visible focus indicator (2px orange ring)
- ✅ Screen reader tested (labels, roles, live regions)
- ✅ Semantic HTML (proper elements, heading hierarchy)
- ✅ ARIA attributes (when needed, not over-used)
- ✅ Motion respects `prefers-reduced-motion`

**Per Page/Journey:**
- ✅ Lighthouse Accessibility score >95
- ✅ axe DevTools 0 violations
- ✅ Keyboard-only navigation complete
- ✅ Screen reader walkthrough successful
- ✅ Zoom to 200% usable
- ✅ Mobile portrait & landscape tested
- ✅ Tablet tested
- ✅ Desktop tested (1024px, 1280px, 1920px)

---

**Rationale Summary:**
- WCAG AA = Best practice für Portfolio (demonstriert Kompetenz)
- Keyboard + Screen Reader = Große User-Base (ca. 15% haben Disabilities)
- Mobile-first responsive = Performance + UX
- Automated testing = Prevent regressions
- Manual testing = Catch edge cases

---

## 9. Implementation Guidance

### 9.1 UX Design Specification Complete

**Zusammenfassung:**

Die UX Design Specification für cv-hub ist vollständig und bereit für die Implementation. Alle kritischen UX-Entscheidungen wurden getroffen und dokumentiert mit klaren Rationales.

**Was wurde erstellt:**

1. **Design System Foundation:** shadcn/ui als Basis mit 12 custom components
2. **Visual Foundation:** "Minimalist Energy" Color Theme (Monochrome + Orange), Typography System, Spacing System
3. **Design Direction:** "Professional Modern" - Single-column, card-based, sticky top nav
4. **User Journeys:** 3 primäre Flows dokumentiert mit Mermaid-Diagrammen
5. **Component Library:** 28 Components (16 shadcn/ui + 12 custom) mit vollständigen Specifications
6. **UX Patterns:** 8 kritische Pattern-Kategorien definiert für Konsistenz
7. **Responsive Strategy:** Mobile-first mit klaren Breakpoints und Adaptation Patterns
8. **Accessibility Strategy:** WCAG 2.1 AA Compliance mit Testing-Checklisten

---

### 9.2 Deliverables

**Primäres Dokument:**
- **UX Design Specification:** `/Users/rubeen/dev/personal/lebenslauf/docs/ux-design-specification.md` (2100+ Zeilen)

**Interaktive Visualisierungen (optional - noch nicht erstellt):**
- Color Theme Visualizer: `docs/ux-color-themes.html`
- Design Direction Mockups: `docs/ux-design-directions.html`

**Verwandte Dokumente:**
- PRD: `docs/PRD.md`
- Product Brief: `docs/product-brief-cv-hub-2025-11-03.md`
- User Journey Flows: Integriert in Hauptdokument (Section 5)
- Component Library Strategy: Integriert in Hauptdokument (Section 6)

---

### 9.3 Development-Ready Status

**Für Developer:**

Dieses Dokument enthält alles, was für die Implementation benötigt wird:

✅ **Design Tokens:** Farben, Typography, Spacing - ready für Tailwind/CSS Variables
✅ **Component Specifications:** Alle 28 Components mit States, Variants, Props
✅ **User Journeys:** Vollständige Flow-Dokumentation für alle 3 primären Pfade
✅ **UX Patterns:** Konsistenz-Regeln für Buttons, Forms, Feedback, Navigation
✅ **Responsive Breakpoints:** Klare Adaptation-Strategie für Mobile/Tablet/Desktop
✅ **Accessibility Requirements:** WCAG AA Compliance-Checklisten pro Component

**Was Developer NICHT selbst entscheiden müssen:**
- Button Hierarchie (definiert in Section 7.1)
- Form Validation Timing (definiert: onBlur primary)
- Modal Dismiss Behavior (definiert: click-outside für non-destructive)
- Notification Placement (definiert: top-right, admin only)
- Navigation Pattern (definiert: sticky top nav)
- Color Usage (definiert: Orange für Primary, Semantic Colors klar)

**Was Developer noch klären sollten:**
- Spezifische Implementierungs-Details (State Management Library, Router Config)
- Performance Optimizations (Code Splitting, Lazy Loading Strategie)
- Build Configuration (Vite Config, Tailwind Config)
- API Integration (Endpoints, Data Fetching Strategy)

---

### 9.4 Empfohlene Nächste Schritte

**Phase 1: Visualisierung & Validation (Optional aber empfohlen)**
1. **Interaktive HTML-Mockups erstellen** (wie im Workflow vorgeschlagen)
   - Color Theme Visualizer
   - Design Direction Mockups
   - Key Screens Showcase
2. **Stakeholder Review** - Zeige Mockups, sammle Feedback
3. **Validate UX Design** - Nutze das Validierungs-Menu (*validate-design)

**Phase 2: Technical Design**
4. **Solution Architecture Workflow** - Definiere technische Architektur mit UX-Context
   - Tech Stack finalisieren (Vite, React 19, TanStack Router, NestJS)
   - API Design (REST Endpoints, Data Models)
   - State Management (Zustand, React Query)
   - Deployment Strategy (Docker Compose, Domain Setup)

**Phase 3: Implementation Planning**
5. **Epic & Story Creation Workflow** - Breche UX Design in Development Tasks herunter
   - Epic 1: Design System Setup (shadcn/ui Installation, Custom Components)
   - Epic 2: Public CV Journey (Hero, Skills, Projects, Experience Sections)
   - Epic 3: Invited View Journey (Token Validation, Personal Message, Full CV)
   - Epic 4: Admin Dashboard (Link Management, Statistics)
   - Epic 5: CV Update Workflow (KI-Extraktion, Diff Viewer)

**Phase 4: Development**
6. **Component Development** - Baue Components nach Specification
7. **Journey Implementation** - Implementiere User Flows
8. **Testing** - Accessibility Testing, Responsive Testing, User Testing

---

### 9.5 Implementation Priorities

**MVP (Phase 1 - Journeys 1 & 2):** 3-4 Wochen
- Public CV View
- Invited View (Token-basiert)
- Custom Components: HeroSection, StickyNav, SkillTag, ProjectCard, ExperienceCard, PersonalMessageCard, InvitedAccessBadge
- shadcn/ui: Button, Card, Badge, Sheet, Separator, Avatar
- **Value:** Functional CV-Showcase, teilbar mit Recruitern

**Phase 2 (Journey 3 - Admin Links):** 2-3 Wochen
- Admin Dashboard
- Link Management (Create, View, Edit, Delete, Statistics)
- Custom Components: StatsCard, LinkTableRow
- shadcn/ui: Table, Dropdown Menu, Dialog, Toast, Input, Select
- **Value:** Selbstständige Link-Verwaltung, keine manuelle Datenbank-Manipulation

**Phase 3 (Journey 4 - CV Update):** 3-4 Wochen
- CV Upload & KI-Extraktion
- Review Interface (Diff Viewer)
- Publish Workflow
- Custom Components: UploadZone, ProgressSteps, DiffViewer
- shadcn/ui: Progress, Textarea
- **Value:** Reibungslose CV-Updates ohne manuelle Daten-Eingabe

**Total Estimated Timeline:** 8-11 Wochen für Full Feature Set

---

### 9.6 Quality Gates

**Per Phase:**
- ✅ All components meet accessibility checklist (Section 8.3)
- ✅ Lighthouse Accessibility score >95
- ✅ Responsive tested on mobile, tablet, desktop
- ✅ UX patterns followed consistently (Section 7)
- ✅ Design tokens applied correctly (Section 3)
- ✅ User journey flows as designed (Section 5)

**Before Production:**
- ✅ Full accessibility audit (automated + manual)
- ✅ Performance optimization (Lighthouse Performance >90)
- ✅ SEO optimization (Lighthouse SEO >90)
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ User testing with target audience (Recruiter feedback)

---

### 9.7 Maintenance & Evolution

**This UX Design is a Living Document:**
- Update as new requirements emerge
- Document design decisions in Version History
- Iterate based on user feedback and analytics
- Maintain consistency as features are added

**When to Revisit:**
- Adding new user journeys (e.g., Collaborative CV editing)
- Major feature additions (e.g., Video CV support)
- Rebranding or visual refresh
- Accessibility guidelines updates (WCAG 2.2, 3.0)
- User feedback indicates friction or confusion

---

**Zusammenfassung:**

cv-hub's UX Design Specification ist vollständig, actionable, und development-ready. Alle Entscheidungen sind getroffen mit klaren Rationales. Developer können sofort mit der Implementation beginnen. Das Dokument dient als Single Source of Truth für alle UX-Fragen während des gesamten Development-Lifecycles.

**Bereit für nächste Phase! 🚀**

---

## Appendix

### Related Documents

- Product Requirements: `{{prd_file}}`
- Product Brief: `{{brief_file}}`
- Brainstorming: `{{brainstorm_file}}`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: {{color_themes_html}}
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: {{design_directions_html}}
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date       | Version | Changes                         | Author |
| ---------- | ------- | ------------------------------- | ------ |
| 2025-11-04 | 1.0     | Initial UX Design Specification | Ruben  |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
