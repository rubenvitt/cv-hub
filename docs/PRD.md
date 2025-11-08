# lebenslauf - Product Requirements Document

**Author:** Ruben
**Date:** 2025-11-04
**Version:** 1.0

---

## Executive Summary

cv-hub löst das Problem der veralteten, wartungsintensiven Personal Websites durch ein datengetriebenes CV-Management-System mit intelligentem Privacy-Management. Statt einer statischen Website oder generischen LinkedIn-Profilen bietet cv-hub eine moderne, wartbare Lösung mit zwei distinkten Erlebnissen:

Eine öffentliche Landing Page präsentiert Skills, Projekte und Erfahrung ohne sensible Daten - als technisches Showcase und moderne Online-Präsenz. Für spezifische Opportunities werden personalisierte Links mit vollständigem CV und optionaler persönlicher Nachricht generiert. Jeder Link ist individuell steuerbar: Ablaufdatum, Besuchsstatistiken, Deaktivierung.

Das Projekt dient gleichzeitig als professionelles Portfolio und technisches Showcase mit vollständig Open-Source-Code (nur CV-Daten bleiben privat). Die Wartung reduziert sich auf JSON-Editing statt HTML-Pflege.

### What Makes This Special

cv-hub's besonderes Merkmal ist die **personalisierte Kontrolle über Datenweitergabe mit begeisternder UX**:

Jeder Empfänger erhält einen dedizierten, personalisierten Link mit optionaler Nachricht - das zeigt Professionalität und Aufmerksamkeit im Detail. Gleichzeitig behält der Nutzer volle Kontrolle: Links können ablaufen, deaktiviert werden, Besuchsstatistiken liefern Einblicke ohne Privacy-Verletzung.

Die Website selbst ist das Portfolio - eine UX, die durch ihre Qualität, Performance und Durchdachtheit technische Kompetenz demonstriert, bevor ein einziges Wort gelesen wird. Der Open-Source-Code fungiert als erweiterte Visitenkarte und zeigt Qualitätsstandards in der Praxis.

Diese Kombination aus Privacy by Design, individueller Personalisierung und technischer Exzellenz macht cv-hub einzigartig - es ist nicht nur ein CV, sondern ein Statement über Werte, Können und Professionalität.

---

## Project Classification

**Technical Type:** Full-Stack Web Application + API Backend
**Domain:** General (Technology/Personal Branding)
**Complexity:** Medium (Level 2 - Multi-Epic Project)

cv-hub ist ein Full-Stack Web-Projekt mit API-First-Architektur:

**Projekt-Typ:** Web Application + RESTful API Backend
- Öffentliche Web-Seite (SEO-optimiert, responsive)
- Admin Dashboard (Link-Management)
- RESTful API mit Privacy-Logik
- Zwei distinkte User Experiences (public vs. personalized)

**Tech Stack:**
- Backend: NestJS (TypeScript)
- Frontend: Vite + React
- Database: SQLite
- Deployment: Docker Compose, eigene Domain

---

## Success Criteria

cv-hub ist erfolgreich, wenn es **Selbstbewusstsein und Kontrolle** über die eigene Online-Präsenz schafft:

**Kurzfristig (MVP-Launch):**
- ✅ cv-hub läuft stabil unter eigener Domain mit professioneller UX
- ✅ Open-Source-Code auf GitHub mit sauberer Dokumentation veröffentlicht
- ✅ Link-Management-System ist funktional und intuitiv bedienbar
- ✅ Personalisierte Links mit Nachrichten können erstellt und verwaltet werden

**Qualitative Erfolgs-Indikatoren (Das wichtigste!):**
- **Stolz und Selbstbewusstsein:** "Diese Website kann ich selbstbewusst teilen - sie repräsentiert mich gut"
- **Wow-Moment bei Empfängern:** Positive Reaktionen auf personalisierte Links und UX-Qualität
- **Wartbarkeit erfüllt:** "CV-Updates sind einfach - JSON editieren, deployen, fertig"
- **Code als Visitenkarte:** "Der Open-Source-Code zeigt meine Standards - clean, dokumentiert, durchdacht"
- **Privacy-Kontrolle funktioniert:** "Ich entscheide präzise, wer was sieht und für wie lange"

**Mittelfristig (3-6 Monate):**
- Aktive Nutzung personalisierter Links bei Bewerbungen/Opportunities
- cv-hub wird in Gesprächen als Referenz erwähnt
- Positives Feedback zu UX und Personalisierung
- Community-Resonanz: GitHub Stars, Forks, oder positive Erwähnungen

**Langfristig (6-12+ Monate):**
- cv-hub trägt zu konkreten Karriere-Opportunities bei
- Andere Entwickler nutzen es als Template oder Inspiration
- Etablierte Online-Präsenz unter eigener Marke
- Projekt wird Teil des persönlichen Tech-Portfolios

**Was Erfolg NICHT ist:**
- Hohe Traffic-Zahlen (Qualität > Quantität)
- Virales Wachstum oder Social Media Hype
- Feature-Inflation oder Scope Creep
- Perfektionismus, der Launch verhindert

### Business Metrics

**Primär:**
- **Professionelle Reputation:** cv-hub etabliert langfristige, qualitativ hochwertige Online-Präsenz

**Sekundär:**
- **Technische Demonstration:** Code-Qualität und API-Design zeigen Senior-Level-Kompetenz
- **Open-Source-Beitrag:** Community profitiert von sauberem Template für ähnliche Projekte
- **Wartungseffizienz:** Drastisch reduzierter Wartungsaufwand im Vergleich zu alter Website

---

## Product Scope

### MVP - Minimum Viable Product

**Core Features (Must-Have):**

**1. Öffentliche CV-Seite**
- Präsentation: Skills, Projekte, Berufserfahrung, Bildung, Ehrenamt
- Privacy-First: Keine sensiblen Daten (Adresse, direkter Kontakt)
- UX-Exzellenz: Moderne, responsive, begeisternde Benutzeroberfläche
- SEO-Optimierung: Meta-Tags, strukturierte Daten (JSON-LD), Performance-optimiert
- Strukturierte Darstellung mit optionalen Filter-Funktionen

**2. RESTful API Backend**
- API-First-Architektur: Backend als standalone service
- Privacy-Logik: Unterschiedliche Daten-Subsets (public vs. private)
- Link-basierte Zugriffskontrolle für personalisierte Ansichten
- OpenAPI/Swagger-Dokumentation
- Vollständig Open Source (nur CV-Daten bleiben privat)

**3. Personalisierte Links-System**
- Link-Generierung mit eindeutigen Tokens (`/invite/{token}`)
- Vollständiger CV zugänglich über personalisierten Link
- Personalisierte Nachricht pro Link (optional)
- Ablaufdatum konfigurierbar
- Link-Deaktivierung möglich

**4. Link-Management Dashboard**
- Web-basiertes Admin-Interface
- Funktionen:
  - Neuen Link erstellen (mit optionaler Nachricht und Ablaufdatum)
  - Links deaktivieren/aktivieren
  - Besuchsstatistiken: Anzahl Aufrufe + letzter Besuch-Timestamp
  - Übersicht aller Links mit Status
- Basic Authentication für Admin-Bereich

**5. KI-gestützte CV-Daten-Extraktion**
- Upload unstrukturierter Daten (PDF, Text, Markdown)
- KI-basierte Extraktion in strukturiertes JSON-Format
- Automatische Kategorisierung (Skills, Projekte, Erfahrung, Bildung)
- Review-Interface: Extrahierte Daten vor Speichern prüfen/editieren
- Versionierung: Backup vorheriger JSON-Versionen vor Überschreiben
- Integration ins Admin-Dashboard

**6. Strukturierte CV-Daten**
- JSON-basiertes Datenformat (Schema-definiert)
- Getrennt vom öffentlichen Repository
- Versionierbar (privates Repo oder lokale Verwaltung)
- Wartung: Entweder KI-Extraktion ODER manuelles JSON-Editing

**7. Deployment & Hosting**
- Docker Compose Setup
- Eigene Domain
- CI/CD-Pipeline für Updates

### Growth Features (Post-MVP)

Features, die das Produkt verbessern, aber nicht für Launch kritisch sind:

**Analytics & Insights:**
- Erweiterte Besucherstatistiken (anonymisiert, DSGVO-konform)
- Dashboard mit Visualisierungen (Besuche über Zeit, beliebteste Sections)
- Export von Statistiken (CSV/JSON)

**Content Features:**
- PDF-Export des CVs (automatische Generierung)
- Dark Mode Toggle
- Multi-Language-Support (i18n für UI, CV-Daten mehrsprachig)

**UX Enhancements:**
- Erweiterte Filter und Sortierung (Skills nach Kategorie, Projekte nach Jahr)
- Animierte Skill-Visualisierungen (interaktive Charts)
- Projekt-Showcases mit Screenshots/Demos

**Personalization:**
- Custom Themes für personalisierte Links (z.B. Firmenfarben bei Bewerbung)
- Dynamische Sections pro Link (z.B. nur relevante Projekte zeigen)

**KI-Erweiterungen:**
- Automatische Skill-Extraktion aus Projektbeschreibungen
- Vorschläge für Verbesserungen (z.B. "Füge Metriken zu Projekt X hinzu")
- Natural Language Query: "Zeig mir alle Backend-Projekte nach 2020"

### Vision (Future)

Langfristige Vision für cv-hub:

**Community & Open Source:**
- Template-Galerie: Verschiedene CV-Design-Vorlagen
- Plugin-System für Custom Sections
- Beispiel-Daten-Sets für andere Entwickler zum Forken
- Community-Contributed Themes

**Content Aggregator:**
- Automatische Integration verschiedener Sources:
  - **GitHub:** Repos, Contributions, Activity, Stars
  - **Blog/Medium:** Artikel-Liste mit Links
  - **Stack Overflow:** Reputation, Top-Antworten
  - **Social (Twitter/X, LinkedIn):** Tech-Content, Posts
  - **GitLab/Bitbucket:** Falls relevant
- Automatische Updates: Regelmäßiger Sync (täglich/wöchentlich)
- Kuratierung: Welche Inhalte sollen angezeigt werden (Filter-Regeln)
- Unified Timeline: Alle Aktivitäten in einer chronologischen Ansicht

**Advanced Integrations:**
- Webhook-Support für automatische Updates
- RSS-Feed für neue Projekte/Skills
- Custom API-Endpoints für eigene Integrationen

**AI-Powered Features:**
- Automatische CV-Optimierung für ATS-Systeme (Applicant Tracking Systems)
- Personalisierte CV-Versionen basierend auf Job-Description
- Interview-Prep-Assistent basierend auf CV-Daten

---

## Innovation & Novel Patterns

cv-hub kombiniert bewährte Konzepte auf neue Weise:

**1. Privacy-by-Design mit Link-Management**
- Nicht nur "öffentlich vs. privat", sondern **granulare Kontrolle** pro Empfänger
- Temporäre, personalisierte Zugänge mit Ablaufdatum
- Tracking ohne Privacy-Verletzung (anonyme Zähler)

**2. KI-gestützte Daten-Extraktion**
- Senkt Wartungsaufwand drastisch: Von "HTML-Pflege" zu "PDF hochladen"
- Automatische Strukturierung unstrukturierter Daten
- Review-Loop für Qualität

**3. Code als Visitenkarte**
- Website ist selbst Teil des Portfolios
- Open-Source-Code demonstriert Standards
- Community kann profitieren (Template-Charakter)

### Validation Approach

- **MVP-Nutzung:** Selbst verwenden, Feedback von Empfängern sammeln
- **Open Source Resonanz:** GitHub Stars, Forks, Community-Feedback
- **Wartbarkeit:** Tatsächliche Zeit für CV-Updates messen (Vorher: Stunden, Nachher: Minuten)

---

## Web Application + API Backend Spezifikationen

**API-Architektur & Endpoints:**

cv-hub folgt API-First-Architektur mit klarer Trennung zwischen Backend (NestJS) und Frontend (Vite + React).

**Core API Endpoints:**

```
GET  /api/cv/public              - Öffentliche CV-Daten
GET  /api/cv/private/:token      - Vollständiger CV über personalisierten Link
GET  /api/invite/:token          - Link-Validierung und Metadaten
POST /api/admin/invite           - Neuen personalisierten Link erstellen
GET  /api/admin/invites          - Alle Links abrufen (Admin)
PATCH /api/admin/invite/:id      - Link aktualisieren (Status, Ablauf)
DELETE /api/admin/invite/:id     - Link deaktivieren
POST /api/admin/cv/extract       - KI-Extraktion starten (Upload)
GET  /api/admin/cv/versions      - CV-Versionshistorie
POST /api/admin/auth/login       - Admin-Login
GET  /api/admin/auth/status      - Auth-Status prüfen
POST /api/admin/auth/logout      - Admin-Logout
```

**API-Versionierung:**
- ⛔ **NICHT über URI** (kein `/api/v1/...`)
- ✅ Über HTTP Header (z.B. `Accept-Version`, `API-Version`) ODER andere Mechanismen
- Entscheidung liegt beim Architekten, aber URI-Versionierung ist explizit ausgeschlossen

**Datenformate:**
- Request/Response: JSON
- Content-Type: `application/json`
- API-Dokumentation: OpenAPI 3.0 (Swagger UI verfügbar unter `/api/docs`)

**Error Handling:**
- Standard HTTP Status Codes
- Strukturierte Error-Responses

**Rate Limiting:**
- Öffentliche Endpoints: 100 requests/minute pro IP
- Admin Endpoints: 50 requests/minute pro Session
- KI-Extraktion: 5 requests/hour (ressourcenintensiv)

### Authentication & Authorization

**Admin-Dashboard:**
- **Basic Authentication** für MVP (Username/Password)
- Session-based mit HTTP-only Cookies
- CSRF-Protection via NestJS Guards
- Keine Multi-User-Funktionalität (Single Admin)

**Personalisierte Links:**
- Token-basierte Zugriffskontrolle (keine Authentication erforderlich)
- **Tokens:** CUID oder NanoID (kryptografisch sicher, URL-safe, kollisionsresistent)
- Validierung:
  - Token existiert in DB
  - Link ist aktiv (nicht deaktiviert)
  - Ablaufdatum nicht überschritten
- Besuchsstatistik-Tracking bei Zugriff (anonymisiert)

**Security Measures:**
- HTTPS-only (Redirect von HTTP)
- Helmet.js für Security Headers
- CORS-Konfiguration (nur eigene Domain)
- Input Validation & Sanitization (class-validator)
- SQL Injection Prevention (TypeORM parameterized queries)

### Frontend-Architektur

**Tech Stack:**
- **Build Tool:** Vite
- **Framework:** React 19 (stable) mit TypeScript
- **Routing:** TanStack Router v1
- **State Management:** TanStack Query (für API-Calls) + Context API (für lokalen State)
- **Styling:** Tailwind CSS
- **Forms:** TanStack Form (Admin-Dashboard)
- **SSR:** Vite SSR mit Hydration für SEO-kritische Seiten

**Seiten-Struktur:**
```
/ (public)                    - Öffentliche CV-Seite (SSR + Hydration)
/invite/:token                - Personalisierte CV-Ansicht (SSR + Hydration)
/admin/login                  - Admin-Login (CSR)
/admin/dashboard              - Link-Management (CSR)
/admin/cv/extract             - KI-Extraktion Interface (CSR)
/admin/cv/versions            - Versionshistorie (CSR)
404                           - Not Found Page
```

**SSR-Strategie:**
- **Öffentliche Seiten** (`/`, `/invite/:token`): Server-Side Rendering mit Client-Side Hydration für SEO und Performance
- **Admin-Seiten**: Client-Side Rendering (kein SEO erforderlich, Auth-Protected)
- Initial HTML wird server-side generiert, dann hydrated für Interaktivität

**Performance-Targets:**
- Lighthouse Score: >90 (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Bundle Size: <200KB (gzipped, initial load)

**Responsive Design:**
- Mobile-First Approach
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Touch-optimized für mobile Geräte
- Progressive Enhancement

### SEO-Strategie

**On-Page SEO:**
- Semantisches HTML5 (header, nav, main, section, article, footer)
- Strukturierte Daten: **JSON Resume Schema** (https://jsonresume.org/schema)
- Meta-Tags: Title, Description, OG-Tags (Open Graph), Twitter Cards
- Sitemap.xml & robots.txt
- Canonical URLs

**Server-Side Rendering (SSR):**
- Vite SSR für öffentliche Seiten (`/` und `/invite/:token`)
- Hydration für Client-Side Interaktivität
- Admin-Dashboard: Client-Side (kein SEO erforderlich)

**Content-Optimierung:**
- Heading-Hierarchie (H1, H2, H3)
- Alt-Texte für Bilder
- Schnelle Ladezeiten (siehe Performance Targets)
- Mobile-Friendly (Google Mobile-First Indexing)

**Structured Data mit JSON Resume Schema:**

cv-hub nutzt den JSON Resume Standard (https://jsonresume.org/schema) als Basis für CV-Daten. Dies bietet:
- Etablierter, community-getriebener Standard
- Kompatibilität mit Tools und Services im CV-Ökosystem
- Strukturierte Daten für SEO (schema.org mapping)
- Einfache Erweiterbarkeit für custom fields

---

## User Experience Principles

cv-hub's UX muss selbst überzeugen - sie ist Teil des Portfolios und demonstriert technische Kompetenz durch Qualität und Durchdachtheit.

**Visual Personality:**
- **Professionell, aber nicht steril:** Sauber, modern, aber mit Persönlichkeit
- **Technisch versiert:** Subtile Animationen, durchdachte Microinteractions
- **Vertrauenswürdig:** Klare Hierarchien, konsistente Patterns, keine "Tricks"
- **Zugänglich:** Lesbar, kontrastreich, barrierefrei

**Design-Vibe:**
- Modern und zeitlos (kein kurzlebiger Trend)
- Minimalistisch mit bewussten Akzenten
- Technisch sophistiziert ohne Overengineering
- Performance spürbar (schnell, flüssig, responsiv)

### Key Interactions

**1. Öffentliche CV-Seite:**
- **First Impression:** Sofortige visuelle Qualität - "Wow, das ist gut gemacht"
- **Navigation:** Smooth Scrolling, klare Section-Marker, optionale Sidebar/Navigation
- **Content Discovery:** Filter für Skills/Projekte ohne Reload (Client-Side)
- **Microinteractions:** Hover-States, subtile Transitions, keine abrupten Änderungen
- **Performance:** Instant Feedback, keine Ladezeiten nach initial load

**2. Personalisierte Link-Ansicht:**
- **Personalisierte Nachricht:** Prominente, aber nicht aufdringliche Anzeige
- **Differentiation:** Subtile Hinweise, dass dies eine personalisierte Ansicht ist
- **Vollständiger Zugang:** Zusätzliche Sections (Kontakt, Details) klar erkennbar
- **Call-to-Action:** Kontaktmöglichkeit gut sichtbar

**3. Admin-Dashboard:**
- **Effizienz:** Schnelle Link-Erstellung, keine unnötigen Klicks
- **Übersicht:** Dashboard mit allen Links, Status auf einen Blick
- **Statistics:** Einfache Visualisierung von Besuchsstatistiken
- **KI-Extraktion:** Drag & Drop für Upload, Live-Preview während Extraktion
- **Feedback:** Klare Success/Error-States, Loading-Indicators

**Accessibility Requirements:**
- WCAG 2.1 Level AA Compliance (minimum)
- Keyboard-Navigation für alle Funktionen
- Screen-Reader-Support (ARIA-Labels)
- Farb-Kontraste nach WCAG-Standard
- Focus-States deutlich sichtbar
- Responsive Text-Scaling (user preferences)

**Interaction Patterns:**
- Progressive Enhancement (funktioniert ohne JavaScript für Basics)
- Optimistic UI Updates (sofortiges Feedback)
- Error Recovery (klare Fehlermeldungen, Retry-Optionen)
- Loading States (Skeletons, Spinner nur wenn nötig)
- Toast Notifications für Admin-Aktionen (Success/Error)

**Mobile Experience:**
- Touch-Targets mindestens 44x44px
- Swipe-Gesten für Navigation (optional)
- Hamburger Menu für mobile Navigation
- Bottom Navigation für häufige Actions (Admin)
- Optimierte Formulare (große Inputs, native Keyboard)

---

## Functional Requirements

Die Anforderungen sind nach User-facing Capabilities organisiert und beinhalten jeweils Akzeptanzkriterien.

### FR-1: CV-Präsentation (Öffentlich)

**Beschreibung:** Öffentliche Besucher können CV-Informationen ohne sensible Daten einsehen.

**Requirements:**
- **FR-1.1** System zeigt strukturierte CV-Daten: Skills, Projekte, Berufserfahrung, Bildung, Ehrenamt
- **FR-1.2** Keine sensiblen persönlichen Daten werden angezeigt (Adresse, direkter Kontakt, Firmennamen nach Konfiguration)
- **FR-1.3** CV-Daten werden aus JSON Resume Schema geladen und gerendert
- **FR-1.4** Content ist filterbar (Skills nach Kategorie, Projekte nach Jahr) - client-side, ohne Reload
- **FR-1.5** Seite ist vollständig responsive (mobile, tablet, desktop)
- **FR-1.6** SEO-optimiert: Meta-Tags, strukturierte Daten (JSON-LD), semantisches HTML
- **FR-1.7** Server-Side Rendering mit Client-Side Hydration für Performance

**Akzeptanzkriterien:**
- ✅ Öffentliche Seite lädt in <1.5s (FCP)
- ✅ Lighthouse Score >90 (alle Kategorien)
- ✅ CV-Sections sind klar strukturiert und navigierbar
- ✅ Filter funktionieren ohne Reload
- ✅ Keine sensiblen Daten sind im HTML oder API-Response sichtbar

---

### FR-2: Personalisierte Link-Verwaltung

**Beschreibung:** Admin kann personalisierte Links mit vollständigem CV-Zugang erstellen und verwalten.

**Requirements:**
- **FR-2.1** Admin kann neuen personalisierten Link erstellen mit:
  - Eindeutigem Token (CUID oder NanoID)
  - Optionaler personalisierter Nachricht
  - Ablaufdatum (optional)
  - Aktivierungsstatus (aktiv/deaktiviert)
- **FR-2.2** System generiert eindeutige URL: `/invite/{token}`
- **FR-2.3** Admin kann bestehende Links verwalten:
  - Anzeigen aller Links mit Status
  - Link aktivieren/deaktivieren
  - Ablaufdatum ändern
  - Link löschen (soft delete - für Statistik-Historie)
- **FR-2.4** System validiert Link-Zugriff:
  - Token existiert in DB
  - Link ist aktiv (nicht deaktiviert)
  - Ablaufdatum nicht überschritten
- **FR-2.5** System tracked anonyme Besuchsstatistiken pro Link:
  - Anzahl Besuche (Counter)
  - Letzter Besuch (Timestamp)
  - Keine personenbezogenen Daten (IP, User-Agent nur temporär für Rate-Limiting)

**Akzeptanzkriterien:**
- ✅ Link-Erstellung dauert <2 Sekunden
- ✅ Tokens sind eindeutig und kollisionsfrei
- ✅ Abgelaufene Links zeigen "Link expired" Seite
- ✅ Deaktivierte Links sind sofort nicht mehr zugreifbar
- ✅ Besuchsstatistiken sind DSGVO-konform (anonym)

---

### FR-3: Personalisierte CV-Ansicht

**Beschreibung:** Empfänger mit personalisiertem Link sehen vollständigen CV inkl. Nachricht.

**Requirements:**
- **FR-3.1** System validiert Token und zeigt vollständigen CV (alle Daten aus JSON Resume)
- **FR-3.2** Personalisierte Nachricht wird prominent, aber nicht aufdringlich angezeigt
- **FR-3.3** Zusätzliche Sections sind sichtbar: Kontaktdaten, vollständige Projektdetails, private Informationen
- **FR-3.4** Visuelle Differenzierung zur öffentlichen Seite (subtile Hinweise: "Personalisierte Ansicht")
- **FR-3.5** Call-to-Action für Kontaktaufnahme ist gut sichtbar
- **FR-3.6** Server-Side Rendering mit Hydration
- **FR-3.7** Bei Link-Zugriff wird Besuchsstatistik aktualisiert (anonymisiert)

**Akzeptanzkriterien:**
- ✅ Ungültiger/abgelaufener Token zeigt Error-Seite
- ✅ Personalisierte Nachricht ist sofort erkennbar
- ✅ Vollständiger CV ist zugänglich (alle private Sections)
- ✅ Performance: <1.5s FCP
- ✅ Besuchsstatistik wird korrekt aktualisiert

---

### FR-4: Admin-Dashboard

**Beschreibung:** Admin-Interface für Link-Management, CV-Verwaltung und Statistiken.

**Requirements:**
- **FR-4.1** Admin-Login mit Basic Authentication (Username/Password)
- **FR-4.2** Session-basierte Auth mit HTTP-only Cookies und CSRF-Protection
- **FR-4.3** Dashboard zeigt Übersicht:
  - Anzahl aktive Links
  - Gesamtbesuche über alle Links
  - Kürzlich erstellte Links
- **FR-4.4** Link-Management-Interface:
  - Liste aller Links (Tabelle/Karten-Ansicht)
  - Sortierung nach Erstellungsdatum, Besuchen, Status
  - Filterung nach Status (aktiv/deaktiviert/abgelaufen)
  - Quick Actions: Deaktivieren, Kopieren, Löschen
- **FR-4.5** Link-Erstellung-Formular:
  - Textfeld für personalisierte Nachricht (optional, Markdown-Support)
  - Datepicker für Ablaufdatum (optional)
  - Checkbox für "Aktiv" Status
  - Live-Preview der generierten URL
- **FR-4.6** Besuchsstatistiken pro Link:
  - Anzahl Besuche
  - Letzter Besuch Timestamp
  - Einfache Visualisierung (Chart für Besuche über Zeit - Growth Feature)
- **FR-4.7** Logout-Funktionalität

**Akzeptanzkriterien:**
- ✅ Nur authentifizierte Admins können Dashboard zugreifen
- ✅ Alle CRUD-Operationen für Links funktionieren
- ✅ UI ist effizient bedienbar (max. 3 Klicks für häufige Aktionen)
- ✅ Form-Validierung funktioniert (Fehlermeldungen)
- ✅ Optimistic UI Updates (sofortiges Feedback)

---

### FR-5: KI-gestützte CV-Daten-Extraktion

**Beschreibung:** Admin kann unstrukturierte CV-Daten hochladen und automatisch in JSON Resume Format extrahieren lassen.

**Requirements:**
- **FR-5.1** Upload-Interface im Admin-Dashboard:
  - Drag & Drop für Dateien
  - Unterstützte Formate: PDF, Markdown, Plain Text
  - File-Size-Limit: 10MB
- **FR-5.2** KI-Extraktion-Prozess:
  - System sendet Daten an LLM (OpenAI, Anthropic, oder lokales Modell)
  - Prompt instruiert Extraktion in JSON Resume Schema Format
  - Automatische Kategorisierung: Skills, Projekte, Erfahrung, Bildung, Ehrenamt
  - Strukturierung komplexer Daten (z.B. Projekt-Details mit Zeiträumen)
- **FR-5.3** Review-Interface:
  - Live-Preview des extrahierten JSONs
  - Manuelles Editing vor Speichern
  - Diff-View: Vergleich mit bestehendem CV (falls vorhanden)
  - Fehlende Felder hervorheben
- **FR-5.4** Versionierung:
  - Automatisches Backup der aktuellen CV-JSON vor Überschreiben
  - Liste vorheriger Versionen mit Timestamps
  - Rollback zu vorheriger Version möglich
- **FR-5.5** Validierung:
  - JSON Schema Validation (JSON Resume Standard)
  - Warnung bei fehlenden Required Fields
  - Hinweis auf unstrukturierte/unerkannte Daten
- **FR-5.6** Fehlerbehandlung:
  - Retry bei API-Fehler (LLM-Call)
  - Fallback: Manuelles JSON-Editing wenn Extraktion fehlschlägt
  - Clear Error Messages

**Akzeptanzkriterien:**
- ✅ Upload funktioniert mit Drag & Drop und File-Picker
- ✅ Extraktion liefert valides JSON Resume Format
- ✅ Review-Interface zeigt extrahierte Daten klar strukturiert
- ✅ Backup wird erstellt vor Überschreiben
- ✅ Rollback zu vorheriger Version funktioniert
- ✅ Fehlende oder fehlerhafte Daten werden deutlich angezeigt
- ✅ Rate-Limiting verhindert Missbrauch (5 requests/hour)

---

### FR-6: CV-Daten-Management

**Beschreibung:** Strukturierte Speicherung und Verwaltung von CV-Daten im JSON Resume Format.

**Requirements:**
- **FR-6.1** CV-Daten basieren auf JSON Resume Schema (https://jsonresume.org/schema)
- **FR-6.2** Daten werden getrennt vom öffentlichen Repository gespeichert (private file/DB)
- **FR-6.3** Zwei Daten-Subsets:
  - **Public:** Für öffentliche Seite (ohne sensible Infos)
  - **Private:** Vollständige Daten für personalisierte Links
- **FR-6.4** API-Endpunkte filtern automatisch basierend auf Kontext:
  - `/api/cv/public` → Nur public Subset
  - `/api/cv/private/:token` → Vollständige Daten (nach Token-Validierung)
- **FR-6.5** Schema-Erweiterungen möglich (custom fields außerhalb JSON Resume Standard)
- **FR-6.6** Versionierung:
  - Timestamped Backups bei jeder Änderung
  - Versionshistorie im Admin-Dashboard
- **FR-6.7** Wartung:
  - Option A: Manuelle JSON-Datei-Bearbeitung (lokale Entwicklung)
  - Option B: KI-Extraktion (Production)
  - Admin-Interface für direkte JSON-Bearbeitung (für Quick-Fixes)

**Akzeptanzkriterien:**
- ✅ JSON validiert gegen JSON Resume Schema
- ✅ Public/Private-Filtering funktioniert korrekt
- ✅ Keine sensiblen Daten erscheinen in öffentlicher API
- ✅ Versionshistorie kann angezeigt werden
- ✅ Rollback zu vorheriger Version funktioniert

---

### FR-7: Deployment & Operations

**Beschreibung:** Containerisiertes Deployment mit CI/CD für einfache Wartung.

**Requirements:**
- **FR-7.1** Docker Compose Setup:
  - Backend-Container (NestJS)
  - Frontend als Teil des Backends ODER separater Container/CDN
  - SQLite-Datenbank (persistent volume)
- **FR-7.2** Environment Configuration:
  - `.env` für Secrets (Admin-Password, API-Keys für KI)
  - Konfigurierbar: Domain, Port, CORS-Origins
- **FR-7.3** CI/CD-Pipeline:
  - Automatisches Build bei Git Push
  - Tests laufen automatisch
  - Deployment auf eigene Domain
- **FR-7.4** Monitoring & Logging:
  - Strukturierte Logs (Winston oder ähnlich)
  - Error-Tracking
  - Uptime-Monitoring (optional: UptimeRobot, Better Uptime)
- **FR-7.5** Backup-Strategie:
  - Automatisches Backup der SQLite-DB (täglich)
  - CV-JSON Versionierung (siehe FR-6.6)
- **FR-7.6** HTTPS-Support:
  - SSL-Zertifikat (Let's Encrypt)
  - HTTP → HTTPS Redirect

**Akzeptanzkriterien:**
- ✅ `docker-compose up` startet komplettes System
- ✅ Environment-Variablen funktionieren
- ✅ CI/CD deployt automatisch nach Push
- ✅ HTTPS funktioniert unter eigener Domain
- ✅ Logs sind zugänglich und durchsuchbar
- ✅ Backup-Prozess läuft automatisch

---

## Non-Functional Requirements

### Performance

Performance ist kritisch - die Website selbst ist Teil des Portfolios und muss überzeugen.

**Performance-Targets:**
- **Lighthouse Score:** >90 in allen Kategorien (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint (FCP):** <1.5s
- **Time to Interactive (TTI):** <3s
- **Largest Contentful Paint (LCP):** <2.5s
- **Cumulative Layout Shift (CLS):** <0.1
- **Bundle Size:** <200KB (gzipped, initial load)

**Warum wichtig für cv-hub:**
Die Performance der Website demonstriert technische Kompetenz. Langsame Ladezeiten würden das Gegenteil signalisieren.

**Messbare Kriterien:**
- Automatisches Lighthouse-Testing in CI/CD
- Core Web Vitals werden gemessen und reportet
- Performance-Budget ist definiert (Bundle-Size-Limits)

**Umsetzung:**
- SSR für initiales Rendering
- Code-Splitting für optimale Bundle-Größe
- Image-Optimierung (WebP, lazy loading)
- Aggressive Caching-Strategie
- CDN für statische Assets (optional)

### Security

Security ist wichtig für Admin-Dashboard und Privacy-Compliance.

**Security-Anforderungen:**
- **Authentication:**
  - Sichere Password-Hashing (bcrypt oder Argon2)
  - Session-Management mit HTTP-only Cookies
  - CSRF-Protection (NestJS Guards)
  - Brute-Force-Protection (Rate-Limiting auf Login)

- **Data Protection:**
  - HTTPS-only (HTTP → HTTPS Redirect)
  - Security Headers (Helmet.js): CSP, HSTS, X-Frame-Options
  - Input Validation & Sanitization (alle User-Inputs)
  - SQL Injection Prevention (TypeORM parameterized queries)
  - XSS-Protection (React default escaping + CSP)

- **Privacy & DSGVO:**
  - Keine personenbezogenen Daten ohne explizite Kontrolle
  - Besuchsstatistiken anonym (keine IP-Speicherung)
  - User-Agent nur temporär für Rate-Limiting
  - Keine Third-Party-Tracking-Cookies
  - Privacy-First-Architektur

- **API-Security:**
  - Rate-Limiting (alle Endpoints)
  - CORS-Restriktionen (nur eigene Domain)
  - API-Key-Rotation für LLM-Services
  - Secrets in Environment-Variablen (nicht im Code)

**Warum wichtig für cv-hub:**
Admin-Dashboard ist Angriffspunkt. DSGVO-Compliance ist gesetzlich erforderlich. Privacy-by-Design ist Teil des Produktkonzepts.

**Messbare Kriterien:**
- Security-Audit vor Launch (npm audit, Snyk)
- OWASP Top 10 werden addressiert
- Penetration Testing (manuell oder automatisiert)
- SSL Labs Score: A+ (TLS-Konfiguration)

### Accessibility

Accessibility ist sowohl ethisch wichtig als auch SEO-relevant.

**Accessibility-Anforderungen:**
- **WCAG 2.1 Level AA Compliance** (minimum)
- Keyboard-Navigation für alle Funktionen
- Screen-Reader-Support:
  - Korrekte semantische HTML-Elemente
  - ARIA-Labels wo nötig
  - Alt-Texte für alle Bilder
- Farb-Kontraste nach WCAG-Standard:
  - Normal Text: 4.5:1
  - Large Text: 3:1
- Focus-States deutlich sichtbar (alle interaktiven Elemente)
- Responsive Text-Scaling (user preferences respektieren)
- Keine Flicker/Flash-Content (Epilepsie-Prävention)
- Formulare mit Labels und Error-Messages

**Warum wichtig für cv-hub:**
Breite Zugänglichkeit zeigt Professionalität. SEO profitiert von semantischem HTML. Barrierefrei ist besser für alle.

**Messbare Kriterien:**
- Lighthouse Accessibility Score >90
- axe DevTools (0 kritische Fehler)
- Keyboard-Navigation getestet (alle Flows erreichbar)
- Screen-Reader-Test (NVDA/JAWS)

### Integration

Integration bezieht sich hauptsächlich auf KI-APIs für CV-Extraktion.

**Integration-Anforderungen:**
- **LLM-Provider-Integration:**
  - OpenAI API (primär) oder Anthropic Claude
  - Fallback zu lokalem Modell (optional für Kosten-Optimierung)
  - API-Key-Management über Environment-Variablen
  - Timeout-Handling (60s für KI-Requests)
  - Retry-Logic bei temporären Fehlern (3 Versuche)

- **Future Integrations (Growth/Vision):**
  - GitHub API (für Content Aggregator)
  - Stack Overflow API
  - Blog RSS-Feeds

**Warum wichtig für cv-hub:**
KI-Extraktion ist MVP-Feature und muss zuverlässig funktionieren. Provider-Ausfälle dürfen System nicht blockieren.

**Messbare Kriterien:**
- KI-Extraktion Success Rate >95%
- Fallback-Mechanismus funktioniert bei Provider-Ausfall
- Error-Handling ist klar und benutzerfreundlich

**Keine Scalability-Requirements:**

cv-hub ist ein persönliches Projekt mit niedrigem bis moderatem Traffic. SQLite ist ausreichend. Horizontal Scaling ist nicht erforderlich.

---

## Implementation Planning

### Epic Breakdown Required

Requirements must be decomposed into epics and bite-sized stories (200k context limit).

**Next Step:** Run `workflow epics-stories` to create the implementation breakdown.

---

## References

{{#if product_brief_path}}

- Product Brief: {{product_brief_path}}
  {{/if}}
  {{#if domain_brief_path}}
- Domain Brief: {{domain_brief_path}}
  {{/if}}
  {{#if research_documents}}
- Research: {{research_documents}}
  {{/if}}

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow epics-stories`
2. **UX Design** (if UI) - Run: `workflow ux-design`
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of lebenslauf - {{product_magic_summary}}_

_Created through collaborative discovery between Ruben and AI facilitator._
