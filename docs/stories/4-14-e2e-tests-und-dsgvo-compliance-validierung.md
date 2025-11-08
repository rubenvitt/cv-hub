# Story 4.14: E2E-Tests und DSGVO-Compliance-Validierung

Status: drafted

## Story

Als Entwickler,
möchte ich End-to-End-Tests für das Privacy-First Link-System implementieren und DSGVO-Compliance validieren,
so dass das Versprechen von granularer Datenkontrolle und Privacy-First Sharing sichergestellt ist und rechtlich einwandfrei funktioniert.

## Acceptance Criteria

1. **E2E-Test: Kompletter Invite-Flow (Playwright oder Browser-Use MCP)**
   - Admin erstellt neuen Link via API (`POST /api/admin/invite`)
   - Besucher navigiert zu `/invite/:token` Route
   - Personalisierte Nachricht wird korrekt im Hero-Bereich angezeigt
   - Vollständiger CV wird gerendert (Kontaktdaten, echte Firmennamen, detaillierte Metriken sichtbar)
   - Besuchsstatistik wird korrekt inkrementiert (`visitCount++`, `lastVisitAt` aktualisiert)

2. **E2E-Test: Abgelaufener Link**
   - Link mit `expiresAt` in der Vergangenheit
   - Navigation zu `/invite/:token` führt zu Error-Page
   - Error-Page zeigt freundliche Nachricht: "This invite has expired. Please request a new one."
   - Option zum Besuch der Public CV-Seite wird angezeigt

3. **E2E-Test: Deaktivierter Link**
   - Link mit `isActive=false`
   - Navigation zu `/invite/:token` führt zu Error-Page
   - Error-Page zeigt: "This invite is no longer active."
   - Keine Besuchsstatistik-Inkrementierung bei deaktivierten Links

4. **DSGVO-Compliance-Checks**
   - Keine IP-Adressen in Datenbank gespeichert (verifiziere `invites` Tabelle hat keine IP-Spalte)
   - User-Agent nicht persistiert (nur temporär für Rate-Limiting verwendet, nicht in DB)
   - Keine Third-Party-Tracking-Cookies aktiv (nur Session-Cookie für Admin)
   - Besuchsstatistiken anonymisiert: Nur `visitCount` (Integer) und `lastVisitAt` (Timestamp)
   - Privacy-Policy-Hinweis auf Error-Pages (optional aber empfohlen)

5. **Performance-Test: Lighthouse Score >90 für `/invite/:token`**
   - Lighthouse CI in GitHub Actions oder manuell
   - Performance Score ≥90
   - Accessibility Score ≥90
   - SEO Score ≥90 (trotz `noindex, nofollow`)
   - Best Practices Score ≥90

6. **Accessibility-Test: axe DevTools 0 kritische Fehler**
   - Automatischer axe-core Test via Playwright
   - Keine kritischen Accessibility-Fehler (critical violations = 0)
   - Keine moderaten Fehler im Hero/Message-Bereich
   - Keyboard-Navigation funktioniert (Tab durch alle interaktiven Elemente)

## Tasks / Subtasks

- [ ] **Task 1: E2E-Test-Setup konfigurieren** (AC: #1-6)
  - [ ] Playwright Installation und Konfiguration in Frontend Workspace
    - `pnpm add -D @playwright/test` in `apps/frontend`
    - Erstelle `playwright.config.ts` mit Browser-Setup (chromium, firefox, webkit)
    - Konfiguriere Base-URL: `http://localhost:5173` (Dev) oder `http://localhost:3000` (Prod)
  - [ ] Test-Datenbank-Setup für E2E-Tests
    - Separate SQLite-Datenbank für Tests (`test.db`)
    - Seed-Skript für Test-Daten (Admin-User, Sample-CV, Test-Invite-Links)
    - Cleanup-Strategie nach jedem Test (Reset DB)
  - [ ] Browser-Use MCP Alternative evaluieren (optional)
    - Wenn Browser-Use MCP verfügbar: Setup für KI-gesteuerte Browser-Tests
    - Vorteil: Natürlichsprachige Test-Szenarien, robustere Selektoren

- [ ] **Task 2: Kompletter Invite-Flow E2E-Test implementieren** (AC: #1)
  - [ ] Test-Datei erstellen: `apps/frontend/e2e/invite-flow.spec.ts`
  - [ ] Admin-Login automatisieren
    - POST zu `/api/admin/auth/login` mit Test-Credentials
    - Session-Cookie extrahieren und speichern
  - [ ] Link-Erstellung via API testen
    - POST zu `/api/admin/invite` mit `recipientName` und `personalizedMessage`
    - Token aus Response extrahieren
  - [ ] Invite-Route besuchen
    - Navigate zu `/invite/:token`
    - Warten auf vollständiges Rendering (SSR + Hydration)
  - [ ] Personalisierte Nachricht verifizieren
    - Selector: `[data-testid="personal-message"]` oder semantisches Matching
    - Text-Inhalt prüfen: Enthält personalisierte Nachricht aus Request
  - [ ] Vollständiger CV-Inhalt verifizieren
    - Kontaktdaten sichtbar: `[data-testid="contact-email"]`, `[data-testid="contact-phone"]`
    - Echte Firmennamen in Experience Section (nicht "Confidential")
    - Detaillierte Projekt-Metriken in Projects Section
  - [ ] Besuchsstatistik verifizieren
    - API-Request zu `/api/admin/invites/:id` (Admin-Auth)
    - `visitCount` = 1 nach erstem Besuch
    - `lastVisitAt` ist aktueller Timestamp (±5 Sekunden Toleranz)

- [ ] **Task 3: Abgelaufener Link E2E-Test** (AC: #2)
  - [ ] Test-Link mit abgelaufenem Datum erstellen
    - Manuell in DB einfügen oder API mit `expiresAt` = gestern
  - [ ] Navigation zu abgelaufenem Link
    - Navigate zu `/invite/:token` (expired token)
  - [ ] Error-Page verifizieren
    - Status: Seite rendert (kein 404)
    - Heading: "This invite has expired" oder ähnlich
    - Friendly Message sichtbar
    - CTA: "View Public CV" Button vorhanden

- [ ] **Task 4: Deaktivierter Link E2E-Test** (AC: #3)
  - [ ] Test-Link mit `isActive=false` erstellen
    - API-Call oder DB-Manipulation
  - [ ] Navigation zu deaktiviertem Link
  - [ ] Error-Page verifizieren
    - Heading: "This invite is no longer active"
  - [ ] Besuchsstatistik NICHT inkrementiert
    - API-Request zu Admin Endpoint
    - `visitCount` bleibt 0 (oder unverändert)

- [ ] **Task 5: DSGVO-Compliance automatische Checks** (AC: #4)
  - [ ] Datenbankschema-Validierung
    - SQL-Query oder TypeORM Schema-Inspection
    - Verifiziere `invites` Tabelle hat KEINE Spalten: `ip_address`, `user_agent`, `visitor_metadata`
    - Nur erlaubte Tracking-Felder: `visitCount`, `lastVisitAt`
  - [ ] Cookie-Analyse (Browser DevTools oder Playwright)
    - Navigiere zu `/invite/:token` (nicht eingeloggt)
    - Prüfe: Nur functional Cookies (keine Marketing/Analytics)
    - Nur Session-Cookie für Admin-Bereich erlaubt
  - [ ] Network-Traffic-Analyse
    - Playwright Network Interceptor
    - Verifiziere: Keine Third-Party-Requests (Google Analytics, Facebook Pixel, etc.)
    - Erlaubt: Nur API-Requests zu eigenem Backend
  - [ ] Privacy-Policy-Link auf Error-Pages
    - Optional aber empfohlen
    - Prüfe Footer auf Error-Pages: "Privacy Policy" Link vorhanden

- [ ] **Task 6: Performance-Tests mit Lighthouse CI** (AC: #5)
  - [ ] Lighthouse CI Setup
    - Installiere `@lhci/cli` in Root Workspace
    - Erstelle `.lighthouserc.json` Konfiguration
    - Target URLs: `/` (public), `/invite/:token` (valid token)
  - [ ] Lighthouse Assertions konfigurieren
    - Performance: ≥90
    - Accessibility: ≥90
    - Best Practices: ≥90
    - SEO: ≥90 (trotz `noindex` Meta-Tag für Invite-Route)
  - [ ] GitHub Actions Workflow Integration
    - Erstelle `.github/workflows/lighthouse.yml`
    - Run auf: Pull Request, Push zu `main`
    - Fail CI wenn Scores unter Schwellenwerten

- [ ] **Task 7: Accessibility-Tests mit axe-core** (AC: #6)
  - [ ] axe-core Playwright Integration
    - `pnpm add -D @axe-core/playwright`
    - Import in E2E-Tests: `import AxeBuilder from '@axe-core/playwright'`
  - [ ] Automated Accessibility Scan
    - Test-Code:
      ```typescript
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
      ```
  - [ ] Kritische Bereiche gezielt testen
    - Hero Section mit Personalized Message
    - Navigation (Sticky Top Nav)
    - Contact Section (nur authenticated)
    - Error Pages
  - [ ] Keyboard-Navigation manuell/automatisch testen
    - Playwright: `page.keyboard.press('Tab')` durch alle interaktiven Elemente
    - Focus-States visuell verifizieren (Screenshot-Diffing optional)

- [ ] **Task 8: Backend Integration-Tests für Privacy-Compliance** (AC: #4)
  - [ ] Test-Datei: `apps/backend/src/modules/invite/invite.e2e.spec.ts`
  - [ ] Test: Token-Validierung speichert keine IP
    - Mock HTTP-Request mit `x-forwarded-for` Header
    - Call `GET /api/invite/:token`
    - Verifiziere: DB-Entry für `invites` hat keine IP-Spalte/Wert
  - [ ] Test: visitCount Inkrement ohne IP-Persistierung
    - Mehrere Requests mit unterschiedlichen IPs
    - Jeder Request inkrementiert `visitCount`
    - Keine IP-Daten in DB gespeichert
  - [ ] Test: Rate-Limiting nutzt IP temporär (nicht persistent)
    - Verifiziere: Rate-Limiting funktioniert (z.B. mit NestJS Throttler)
    - Verifiziere: IP nicht in DB gespeichert nach Rate-Limit-Check

- [ ] **Task 9: Dokumentation und Reporting** (AC: #1-6)
  - [ ] Test-Coverage-Report generieren
    - `pnpm test:coverage` für Unit + Integration Tests
    - E2E-Test-Ergebnisse in CI-Output
  - [ ] DSGVO-Compliance-Dokumentation
    - Markdown-Dokument: `docs/DSGVO-Compliance-Report.md`
    - Inhalte:
      - Welche Daten werden gespeichert (visitCount, lastVisitAt)
      - Welche Daten werden NICHT gespeichert (IP, User-Agent, Cookies außer Admin)
      - Retention Policy (Links löschbar durch Admin, 30-Tage Log-Retention)
      - Anonymisierte Statistiken
  - [ ] E2E-Test-Screenshots für visuelle Regression (optional)
    - Playwright Screenshot-Funktion
    - Speichere Screenshots in `apps/frontend/e2e/screenshots/`
    - Nutze für manuelles Review oder Screenshot-Diffing

## Dev Notes

### Testing-Strategie

**E2E-Test-Tool:** Playwright (primär) oder Browser-Use MCP (experimentell)

**Warum Playwright:**
- Native TypeScript-Support
- Multi-Browser-Testing (Chromium, Firefox, WebKit)
- Robust gegen Flakiness (Auto-Wait, Retry-Mechanik)
- Screenshot/Video-Recording für Debugging
- Integration mit GitHub Actions

**Browser-Use MCP Alternative:**
- KI-gesteuerte Browser-Automatisierung
- Natürlichsprachige Test-Szenarien
- Intelligente Element-Erkennung (robuster gegen UI-Änderungen)
- Nutze wenn verfügbar für komplexere User-Flows

---

### DSGVO-Compliance Anforderungen

**Data Minimization:**
- Speichere nur absolut notwendige Daten für Link-Funktionalität
- `visitCount` und `lastVisitAt` sind ausreichend für Statistiken
- Keine IP-Adressen, keine User-Agents, keine Geo-Location

**Purpose Limitation:**
- Besuchsstatistiken dienen nur Admin-Transparenz (wann wurde Link genutzt?)
- Keine Profile-Building oder Tracking über Links hinweg

**Storage Limitation:**
- Links mit `expiresAt` werden nicht automatisch gelöscht (Admin-kontrolliert)
- Admin kann jederzeit Links löschen (inkl. aller Statistiken)

**Security:**
- CUID2-Tokens = kryptografisch sicher (nicht ratebar)
- HTTPS erzwungen (TLS 1.2+)
- No Third-Party Cookies

---

### Architektur-Patterns für Testing

**Test-Datenbank-Isolation:**
- Nutze separate SQLite-Datenbank für E2E-Tests (`test.db`)
- Seed mit minimal notwendigen Daten (1 Admin-User, 1 Sample-CV, 2-3 Test-Links)
- Cleanup nach jedem Test: Drop & Recreate oder Transaction-Rollback

**API-Mocking vs. Real Backend:**
- E2E-Tests nutzen REAL Backend (kein Mocking)
- Start Backend + Frontend lokal für E2E-Run
- Docker Compose für konsistente Testumgebung (optional)

**Playwright Best Practices:**
- Nutze `data-testid` Attribute für stabile Selektoren
- Vermeide CSS-Klassen als Selektoren (ändern sich oft)
- Nutze Playwright's `auto-waiting` (kein manuelles `setTimeout`)
- Page Object Model (POM) für wiederverwendbare Page-Logik

---

### Performance & Accessibility Targets

**Lighthouse Scores (aus Architecture Document):**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90 (öffentliche Seiten), ≥50 (invite-routes mit `noindex`)

**Accessibility Standards (WCAG 2.1 Level AA):**
- Color Contrast: 4.5:1 für Text, 3:1 für UI-Components
- Keyboard Navigation: Alle interaktiven Elemente mit Tab erreichbar
- Screen Reader Support: Proper ARIA-Labels, Heading-Hierarchie
- Focus Indicators: 2px orange ring (Design System)

**Critical Accessibility-Checks für `/invite/:token`:**
- Personal Message Card: Proper heading structure, readable contrast
- "Invited Access" Badge: `aria-label` für Screen Reader
- Contact Section: Links mit aussagekräftigen Labels (`aria-label="Email me at..."`)

---

### Project Structure Notes

**Betroffene Dateien (NEU):**
- `apps/frontend/e2e/invite-flow.spec.ts` - Haupttest für Invite-Flow
- `apps/frontend/e2e/invite-expired.spec.ts` - Abgelaufener Link Test
- `apps/frontend/e2e/invite-deactivated.spec.ts` - Deaktivierter Link Test
- `apps/frontend/e2e/accessibility.spec.ts` - axe-core Accessibility Tests
- `apps/backend/src/modules/invite/invite.e2e.spec.ts` - Backend Integration Tests für Privacy
- `.lighthouserc.json` - Lighthouse CI Konfiguration
- `.github/workflows/lighthouse.yml` - Lighthouse CI Workflow
- `.github/workflows/e2e-tests.yml` - Playwright E2E Workflow
- `docs/DSGVO-Compliance-Report.md` - Compliance-Dokumentation

**Playwright Konfiguration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### Testing-Matrix

| Test-Typ | Tool | Scope | Coverage Target |
|----------|------|-------|----------------|
| Unit Tests | Vitest (FE), Jest (BE) | Pure Logic | >70% (FE), >80% (BE) |
| Integration Tests | Jest + Supertest | API + DB | >60% |
| E2E Tests | Playwright | Critical Paths | 100% |
| Accessibility Tests | axe-core | All Pages | 0 Critical Violations |
| Performance Tests | Lighthouse CI | Key Routes | ≥90 Scores |
| DSGVO Compliance | Manual + DB Schema Check | Privacy | 100% Conformance |

---

### References

**Epic 4 Technical Specification:**
- [Source: docs/tech-spec-epic-4.md]
- CUID2-Token-System, Link-Validierungs-Logik, Besuchsstatistik-Tracking
- Privacy-Anforderungen: Keine IP-Speicherung, anonymisierte Statistiken
- API-Endpoints: `POST /api/admin/invite`, `GET /api/invite/:token`, `GET /api/cv/private/:token`

**Architecture Document - Testing Strategy:**
- [Source: docs/architecture.md#Testing-Strategy]
- Testing Pyramid: 60% Unit, 30% Integration, 10% E2E
- Playwright für E2E-Tests (Multi-Browser)
- Critical Paths: Public CV, Invite Flow, Admin Dashboard, CV Extraction

**Architecture Document - Privacy & GDPR Compliance:**
- [Source: docs/architecture.md#Privacy-GDPR-Compliance]
- Data Minimization: Nur visitCount + lastVisitAt
- No IP Storage, No Third-Party Cookies
- Right to be Forgotten: Link-Deletion löscht alle Daten
- Data Retention: 30 Tage Logs, user-controlled Link-Expiration

**UX Design Specification:**
- [Source: docs/ux-design-specification.md]
- Invited View Journey: Token-Validierung, Personalized Message, Full CV
- Error-States: Friendly Messages für Expired/Deactivated/Invalid Tokens
- Accessibility Requirements: WCAG 2.1 Level AA, Keyboard Navigation, Screen Reader Support

**Epic 4 Story Breakdown:**
- [Source: docs/epics.md#Epic-4]
- Story 4.1-4.13: Grundlage für Token-System, API-Endpoints, Frontend-Integration
- Story 4.14: Testing & Validation (diese Story)
- Prerequisites: Story 4.13 (PersonalizedCVPage vollständig integriert)

---

### Learnings from Previous Story

**From Story 4.13: personalizedcvpage-component-und-integration** (Status: drafted)

Die vorherige Story wurde noch nicht implementiert. Daher sind keine Dev-Agent-Learnings oder Review-Findings verfügbar.

**Erwartete Abhängigkeiten für diese Story:**
- Alle Frontend-Components für Personalized View müssen implementiert sein (Story 4.10-4.13)
- Backend-API-Endpoints funktional (`/api/invite/:token`, `/api/cv/private/:token`)
- Token-Validierungs-Logik im Backend vollständig (Story 4.3)
- Frontend-Route `/invite/:token` mit SSR-Loader (Story 4.8)

**Wichtiger Hinweis:**
Da Story 4.13 (und 4.10-4.12) noch im Status "drafted" sind, sollten E2E-Tests dieser Story (4.14) ERST NACH vollständiger Implementierung der vorherigen Stories ausgeführt werden. Diese Story kann parallel entwickelt werden (Test-Code schreiben), aber Tests werden fehlschlagen bis Story 4.13 abgeschlossen ist.

---

## Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-11-08 | 1.0 | Initial Draft | SM (Bob) via create-story workflow |
