# Product Brief: cv-hub

**Date:** 2025-11-03
**Author:** Ruben
**Context:** greenfield

---

## Executive Summary

cv-hub ist ein interaktives CV-Projekt, das als technisches Showcase und Personal-Branding-Plattform dient. Das Projekt kombiniert eine begeisternde Benutzeroberfläche mit einer technisch überzeugenden API und demonstriert durch Open-Source-Veröffentlichung Qualitätsbewusstsein und Community-Engagement. Ziel ist es, unter eigener Domain eine vorzeigbare, technisch exzellente Lösung zu hosten, die sowohl Frontend- als auch Backend-Kompetenz unter Beweis stellt.

---

## Core Vision

### Problem Statement

Als Developer/Consultant/Architekt ohne aktuelle Online-Präsenz gehen konkrete Opportunities verloren. Die alte Personal Website wurde zur Belastung - wartungsintensiv, veraltet im Design und demotivierend zu pflegen. Das Resultat: Keine vorzeigbare Präsenz, reduzierte Sichtbarkeit in der Tech-Community und ein unprofessionelles Bild für jemanden, der auf Senior-Level arbeitet.

### Problem Impact

**Konkrete Auswirkungen:**
- Verpasste Gelegenheiten durch fehlende Online-Präsenz
- Reduzierte Sichtbarkeit in der Tech-Community
- Unprofessioneller Eindruck als Consultant/Architekt ohne digitales Portfolio
- Keine Möglichkeit, technische Kompetenz und Projekte zeitgemäß zu präsentieren

### Why Existing Solutions Fall Short

**Statische HTML/CSS-Websites:** Wartungsintensiv, jede Änderung erfordert manuelles Coding, keine strukturierte Datenverwaltung, veralten schnell

**LinkedIn/XING Profile:** Zu eingeschränkt, keine Möglichkeit technische Tiefe zu zeigen, kein Showcase für Code-Qualität oder API-Design

**Template-basierte Portfolio-Builder:** Generisch, zeigen keine technische Individualität, keine API-Komponente

### Proposed Solution

cv-hub ist ein Privacy-gestuftes, interaktives CV-Management-System mit zwei distinkten Erlebnissen:

**Öffentliche Landing Page:** Präsentiert CV-Informationen (Skills, Projekte, Erfahrung) ohne sensible persönliche Daten. Dient als moderne, wartbare Online-Präsenz und technisches Showcase. Diese Seite ist begeisternd gestaltet und zeigt technische Kompetenz durch UX und Performance.

**Personalisierte Private Links:** Generierbare Einladungslinks (z.B. `/invite/xyz123`) für spezifische Bewerbungen oder Anfragen. Diese Links bieten:
- Vollständigen CV mit allen Details und Kontaktdaten
- Optional: Personalisierte Nachricht pro Link
- Link-Management: Ablaufdatum, Besuchsstatistiken, Deaktivierungsmöglichkeit
- Volle Kontrolle über Datenweitergabe

**Technischer Ansatz:**
- Datengetrieben: Strukturierte CV-Daten (JSON) getrennt vom öffentlichen Repository
- API-First-Architektur: Backend-API liefert Daten mit Privacy-Logik
- Vollständig Open Source: Sowohl Frontend als auch Backend-Code öffentlich, nur CV-Daten bleiben privat
- Einfache Wartung: JSON-Datei editieren statt HTML pflegen

### Key Differentiators

**Privacy by Design:** Im Gegensatz zu statischen CVs oder LinkedIn-Profilen volle Kontrolle über Datenweitergabe durch Link-basiertes Zugriffsmanagement

**Dual-Purpose:** Gleichzeitig professionelles Portfolio UND technisches Showcase-Projekt (API-Design, moderne Architektur, Open-Source-Qualität)

**Wartungsfreundlich:** Strukturierte Daten statt HTML-Pflege, klare Trennung zwischen öffentlichen und privaten Informationen

**Personalisierung:** Jede Bewerbung erhält einen dedizierten Link mit optionaler persönlicher Nachricht - zeigt Professionalität und Aufmerksamkeit

**Nachweisbare Technische Exzellenz:** Open-Source-Code demonstriert Qualitätsstandards, API zeigt Backend-Kompetenz, UX zeigt Design-Verständnis

---

## Target Users

### Primary Users

**Empfänger personalisierter Links (Recruiting/Bewerbungen):**
- **Recruiter:** Erhalten personalisierten Link mit vollständigem CV und optionaler Nachricht. Bewerten technische Tiefe, aber auch Soft Skills und Persönlichkeit (Ehrenamt, Interessen).
- **Tech Leads/CTOs aus Mittelstand:** Suchen konkret für Positionen, interessieren sich für technische Kompetenz, Problemlösungsfähigkeit und Cultural Fit.

**Was ihnen wichtig ist:**
- Technische Tiefe (Stacks, gelöste Probleme, Architektur-Entscheidungen)
- Persönlichkeit und Werte (Open Source, Ehrenamt, offener Mensch)
- Professionalität und Qualitätsbewusstsein (sichtbar durch die Website selbst)
- Schnelle Orientierung (strukturierte, ansprechende Darstellung)

### Secondary Users

**Öffentliche Besucher:**
- **Potenzielle Consulting-Kunden:** Googeln "Ruben [Nachname]" und landen auf der öffentlichen Seite. Bewerten Professionalität, technische Exzellenz und Vertrauenswürdigkeit.
- **Name-Sucher:** Allgemeine Interessenten, die Ruben recherchieren
- **Tech Community:** Andere Entwickler, die Code anschauen, forken oder Inspiration suchen
- **Potenzielle Kollaborateure:** Open-Source-Interessierte, die das Projekt als Referenz nutzen

**Ihr Bedarf:**
- Öffentliche Seite: Erster Eindruck, genug Info ohne sensible Daten
- GitHub: Sauberer, gut dokumentierter Code zum Lernen/Forken
- Wiederverwendbarkeit: Clean Architecture, sodass andere es für sich anpassen können

### User Journey

**Journey 1: Bewerbungsprozess (Private Link)**
1. Ruben sendet personalisierten Link an Recruiter/Firma mit optionaler Nachricht
2. Empfänger öffnet Link → sieht personalisierte Message + vollständigen CV
3. Erkundet interaktiven CV (Skills, Projekte, Erfahrung, Ehrenamt)
4. Beeindruckt von Professionalität + technischer Umsetzung der Website selbst
5. Kontaktiert über bereitgestellte Kontaktdaten

**Journey 2: Organische Entdeckung (Öffentliche Seite)**
1. Potentieller Kunde googelt "Ruben" oder findet ihn in Tech-Community
2. Landet auf öffentlicher CV-Seite
3. Sieht beeindruckende UX + technisches Können (ohne sensible Daten)
4. Will mehr erfahren → nimmt über Kontaktformular/Link Kontakt auf
5. Erhält ggf. personalisierten Link für vollständige Infos

---

## Success Metrics

### Kurzfristig (MVP-Launch)
- ✅ cv-hub ist live unter eigener Domain
- ✅ Open-Source-Code auf GitHub veröffentlicht mit professioneller Dokumentation
- ✅ Öffentliche CV-Seite funktional und optisch ansprechend
- ✅ Link-Management-System funktioniert (erstellen, verwalten, ablaufen lassen)

### Qualitative Erfolgs-Indikatoren
- **Professionelle Repräsentation:** "Ich fühle mich mit dieser Online-Präsenz wohl und kann sie selbstbewusst teilen"
- **Wartbarkeit:** "CV-Updates sind einfach - ich editiere JSON und deploye"
- **Technische Überzeugung:** "Der Code zeigt meine Standards - sauber, dokumentiert, durchdacht"
- **Community-Resonanz:** GitHub Stars/Forks von anderen Devs, positive Kommentare zur Umsetzung

### Langfristig (6-12+ Monate)
- Bewerbungsgespräche über cv-hub (wenn aktiv auf Jobsuche)
- Personalisierte Links im aktiven Einsatz für Bewerbungen
- cv-hub wird als Referenz in Gesprächen erwähnt ("Schau dir mein cv-hub an")
- Andere Devs nutzen es als Inspiration oder Template

### Business Objectives

**Primäres Ziel:** Professionelle Online-Präsenz etablieren, die langfristig bei Karriere-Opportunities hilft

**Sekundäre Ziele:**
- Technische Kompetenz demonstrieren (API-Design, Clean Code, UX)
- Open-Source-Werte zeigen und zur Community beitragen
- Wartbare Lösung haben (kein "Website-Pflege-Frust" wie früher)

---

## MVP Scope

### Core Features

**1. Öffentliche CV-Seite**
- Zeigt CV-Daten: Skills, Projekte, Berufserfahrung, Bildung, Ehrenamt
- Keine sensiblen persönlichen Daten (Adresse, direkter Kontakt, Firmennamen nach Bedarf)
- Moderne, responsive UX - muss überzeugen (ist Haupt-Domain)
- Gut strukturierte Darstellung, optional: einfache Filter-Funktionen
- **SEO-optimiert:** Meta-Tags, strukturierte Daten (JSON-LD), semantisches HTML, Performance-optimiert für gutes Google-Ranking

**2. API-Backend**
- RESTful API liefert CV-Daten
- Privacy-Logik: public vs. private Daten-Subsets
- Link-basierte Zugriffskontrolle für personalisierte Ansichten
- Vollständig Open Source (nur Daten-JSON bleibt privat)

**3. Personalisierte Links-System**
- Link-Generierung: `/invite/{token}` mit eindeutigem Token
- Vollständiger CV zugänglich über personalisierten Link
- Optionale personalisierte Nachricht pro Link
- Link-Ablaufdatum konfigurierbar

**4. Link-Management Dashboard**
- Web-basiertes Admin-Interface (passt zu Container-Deployment)
- Funktionen:
  - Neuen Link erstellen (mit optionaler Nachricht)
  - Link deaktivieren/aktivieren
  - Ablaufdatum setzen
  - Besuchsstatistiken: Anzahl Aufrufe + letzter Besuch-Timestamp
  - Übersicht aller Links mit Status
- Basic Authentication/Login für Admin-Bereich

**5. Strukturierte CV-Daten**
- JSON-basiertes CV-Datenformat
- Getrennt vom öffentlichen Repository
- Einfache Wartung: JSON editieren → Deployment
- Versionierbar (privates Repo/lokale Verwaltung)

**6. Deployment & Hosting**
- Container-basiertes Deployment
- Läuft unter eigener Domain
- CI/CD-Pipeline für einfaches Update

### Out of Scope for MVP

**Erweiterte Analytics:**
- Detaillierte Besucherstatistiken (IP-Tracking, Verweildauer, Klick-Tracking)
- Geografische Herkunft der Besucher
- User-Agent-Analyse

**Content Management:**
- Vollständiges CMS für CV-Bearbeitung (JSON-Editing reicht)
- Wysiwyg-Editor
- Multi-Language-Support

**Advanced Features:**
- PDF-Export des CVs
- Erweiterte Interaktivität (animierte Timelines, interaktive Skill-Visualisierungen)
- Kommentarfunktion oder Nachrichtensystem
- Multi-Tenancy/Plattform für andere User

**Nice-to-Have später:**
- Erweiterte Filter und Sortierung
- Dark Mode
- Detaillierte Projekt-Showcases mit Screenshots/Demos

### MVP Success Criteria

**Technisch:**
- ✅ Beide Seiten (öffentlich + privat) laufen stabil
- ✅ API liefert korrekte Daten für beide Kontexte
- ✅ Links funktionieren inkl. Ablauf und Deaktivierung
- ✅ Dashboard ist intuitiv bedienbar
- ✅ Code-Qualität: dokumentiert, testbar, clean architecture

**Funktional:**
- ✅ CV-Update: JSON ändern → Deployment → sichtbar auf Seite
- ✅ Link erstellen, Nachricht hinzufügen, versenden funktioniert
- ✅ Besuchsstatistiken werden korrekt getrackt

**Qualitativ:**
- ✅ Beide Seiten überzeugen optisch und funktional
- ✅ Performance: Schnelle Ladezeiten, responsive Design
- ✅ "Würde ich das selbstbewusst teilen?" → Ja

### Future Vision

**Post-MVP Enhancements:**
- **Erweiterte Analytics:** Detaillierte Besucherstatistiken und Insights
- **PDF-Export:** Automatische PDF-Generierung des CVs
- **Advanced Interaktivität:** Animierte Skill-Visualisierungen, interaktive Timelines
- **Projekt-Showcases:** Detaillierte Case Studies mit Screenshots, Code-Snippets, Live-Demos
- **API-Erweiterung:** Öffentliche API für andere Services (z.B. automatische Integration in andere Plattformen)
- **Community Features:** Template-Sammlung, Beispiel-Daten für andere Devs zum Fork

---

## Technical Preferences

### Technology Stack

**Backend:**
- **Framework:** NestJS (TypeScript, strukturiert, gut für API-First-Architektur)
- **Database:** SQLite (ausreichend für MVP, einfach zu deployen)
- **Authentication:** NestJS Guards oder Passport.js für Admin-Dashboard
- **API:** RESTful, OpenAPI/Swagger-Dokumentation

**Frontend:**
- **Build Tool:** Vite (schnell, modern, gute Developer Experience)
- **Framework:** TBD (React, Vue, oder Svelte - flexibel)
- **Styling:** Moderne CSS-Lösung für responsive Design

**Deployment:**
- **Containerization:** Docker mit compose.yaml
- **Frontend-Optionen:**
  - Option A: Im Container mitgeliefert
  - Option B: Cloudflare Pages (optional, für bessere Performance/CDN)
- **Hosting:** Eigene Domain, flexible Deployment-Strategie

### Architecture Principles

- **API-First:** Backend als standalone API, Frontend konsumiert diese
- **Privacy by Design:** Keine persönlichen Besucherdaten sammeln (DSGVO-Compliance)
- **SEO-First:** Server-Side Rendering oder Static Site Generation für optimale Auffindbarkeit
- **Performance:** Schnelle Ladezeiten, optimierte Assets, Progressive Web App Prinzipien
- **Clean Code:** Dokumentiert, testbar, wartbar
- **Open Source Ready:** Saubere Code-Struktur für Community-Nutzung

## Risks and Assumptions

### Risiken

**Wartungs-Risiko:** Geschichte wiederholt sich - Website wird wieder zur Last
- **Mitigation:** Strikte Trennung Daten/Code, einfache JSON-Wartung, gute Dokumentation

**Security:** Admin-Dashboard ist Angriffspunkt
- **Mitigation:** Bewährte Auth-Lösung (Passport.js/NestJS Guards), HTTPS-only, Rate-Limiting

**DSGVO-Compliance:** Besuchsstatistiken könnten problematisch werden
- **Mitigation:** Keine personenbezogenen Daten sammeln (keine IPs, User-Agents nur temporär), nur anonyme Zähler

**Scope Creep:** Feature-Wünsche führen zu nie fertigem Projekt
- **Mitigation:** Strikter MVP-Fokus, Future-Vision-Liste für Post-MVP

### Annahmen

- **Zeitinvestition:** AI-gestützte Implementierung reduziert Entwicklungszeit signifikant
- **Deployment-Komplexität:** Docker Compose reicht für MVP-Hosting-Anforderungen
- **Traffic:** Niedrige bis moderate Besucherzahlen, SQLite ist ausreichend
- **Forking durch Community:** Sauberer Code + Dokumentation machen Projekt attraktiv für andere Devs
- **CV-Datenformat:** JSON-Struktur ist ausreichend flexibel für alle CV-Inhalte

## Timeline

**Projekt-Charakter:** Side-Project, kein Zeitdruck

**Entwicklungs-Ansatz:** AI-gestützte Implementierung, iterative Entwicklung

**Phasen:**
1. **MVP-Entwicklung:** API + Frontend + Dashboard + Deployment-Setup
2. **Testing & Refinement:** UX-Polish, Code-Qualität, Dokumentation
3. **Launch:** Deployment auf eigene Domain, GitHub-Veröffentlichung
4. **Post-MVP:** Iterative Verbesserungen basierend auf eigener Nutzung

---

_This Product Brief captures the vision and requirements for cv-hub._

_It was created through collaborative discovery and reflects the unique needs of this greenfield project._

_Next: The PRD workflow will transform this brief into detailed product requirements and epic breakdown._
