# Epic Technical Specification: Privacy-First Sharing System

Date: 2025-11-05
Author: Ruben
Epic ID: 4
Status: Draft

---

## Overview

Epic 4 implementiert das Herzstück von cv-hub's Value Proposition: **Privacy-First Sharing mit granularer Kontrolle**. Diese Epic transformiert die öffentliche CV-Seite (Epic 3) in ein intelligentes Dual-Mode-System, bei dem jeder Empfänger einen personalisierten, zeitlich begrenzten Zugang zum vollständigen CV erhält - mit optionaler persönlicher Nachricht und vollständiger Besuchsstatistik-Transparenz.

Das Token-System nutzt kryptografisch sichere CUID2-Tokens für kollisionsfreie Link-Generierung. Jeder Link ist eine eigenständige Entity mit konfigurierbarem Ablaufdatum, Aktivierungsstatus und anonymisierten Besuchsstatistiken (Counter + Last-Visit-Timestamp, keine IP-Speicherung = DSGVO-konform). Die Backend-API erweitert sich um zwei kritische Endpoints: `POST /api/admin/invite` für Link-Erstellung und `GET /api/cv/private/:token` für vollständigen CV-Zugriff nach Token-Validierung.

Frontend-seitig entsteht eine neue SSR-optimierte Route `/invite/:token`, die visuell differenziert zur öffentlichen Seite ist und personalisierte Nachrichten prominent anzeigt. Die personalisierte Ansicht zeigt alle CV-Sections inklusive Kontaktdaten, echter Firmennamen und detaillierter Projekt-Metriken - exakt die Daten, die in der öffentlichen Ansicht gefiltert wurden.

Technisch baut Epic 4 auf Epic 2 (CV Data Foundation, Privacy-Filtering-Logik) und Epic 3 (Frontend-Basis, Component-Library) auf. Die Integration erfolgt nahtlos: Bestehende Components (`SkillsSection`, `ProjectsSection`, etc.) werden variant-aware (`public` vs `authenticated`), das Backend erweitert sich um Link-Management-Logik mit TypeORM-Entities, und das Frontend konsumiert die neuen API-Endpoints via TanStack Query mit identischen Caching-Strategien wie Epic 3.

## Objectives and Scope

### In Scope

**Token-System (Backend):**
- CUID2-basierte Token-Generierung (kryptografisch sicher, 25 Zeichen, URL-safe)
- Link-Entity mit TypeORM (SQLite-Persistierung):
  - `id` (Primary Key, Auto-Increment)
  - `token` (Unique Index, CUID2)
  - `personalizedMessage` (Optional, Text, Markdown-Support)
  - `expiresAt` (Optional, DateTime, NULL = kein Ablauf)
  - `isActive` (Boolean, Default: true)
  - `visitCount` (Integer, Default: 0)
  - `lastVisitAt` (DateTime, Nullable)
  - `createdAt`, `updatedAt` (Timestamps)
- Link-Validierungs-Logik:
  - Token existiert in DB
  - `isActive === true`
  - `expiresAt === null || expiresAt > now()`
- Besuchsstatistik-Tracking:
  - Inkrement `visitCount` bei jedem Zugriff
  - Update `lastVisitAt` Timestamp
  - DSGVO-konform: Keine IP-Speicherung, keine User-Agent-Persistierung

**API-Endpoints (Backend):**
- `POST /api/admin/invite` - Link erstellen (Admin-Auth required, Epic 5)
  - Input: `{ personalizedMessage?: string, expiresAt?: Date }`
  - Output: `{ id, token, url, createdAt }`
  - Validierung: Zod-Schema für Input-DTO
- `GET /api/invite/:token` - Link-Validierung & Metadaten
  - Input: Token (URL-Param)
  - Output: `{ isValid: boolean, personalizedMessage?: string }`
  - Tracking: visitCount++, lastVisitAt = now()
- `GET /api/cv/private/:token` - Vollständiger CV (Token-validiert)
  - Input: Token (URL-Param)
  - Output: `PrivateCV` (vollständiges CV-Objekt, siehe Epic 2)
  - Validierung: Token-Check, dann Privacy-Filtering bypassen

**Frontend-Integration:**
- Neue Route: `/invite/:token` (TanStack Router)
  - SSR-Loader: Token-Validierung + CV-Daten parallel fetchen
  - Client-Side Hydration für Interaktivität
  - Error-States: Ungültiger Token, abgelaufener Link, deaktivierter Link
- Personalisierte Ansicht-Components:
  - `PersonalizedCVPage` (Main Layout)
  - `PersonalizedMessageBanner` (prominent, aber nicht aufdringlich)
  - Wiederverwendung bestehender Section-Components:
    - `SkillsSection` (variant="authenticated")
    - `ProjectsSection` (variant="authenticated")
    - `ExperienceSection` (variant="authenticated")
  - Neue/erweiterte Sections:
    - `ContactSection` (Email, Phone, Location - nur authenticated)
    - `ProjectDetailsEnhanced` (echte Company-Namen, Metriken)
- Visuelle Differenzierung:
  - Subtile Badge: "Personalisierte Ansicht" (Header)
  - Farbakzent (z.B. Border-Color unterschiedlich)
  - Favicon optional anders (Growth-Feature)
- TanStack Query Integration:
  - `useInviteValidation(token)` Hook
  - `usePrivateCV(token)` Hook
  - Cache-Strategie: staleTime 5min (wie Public CV)

**Component-Varianten (Shared zwischen Public/Private):**
- Bestehende Components aus Epic 3 erweitern:
  - `variant` Prop: `'public' | 'authenticated'`
  - Conditional Rendering basierend auf Variant
  - Beispiel `ProjectCard`: Zeige `entity` (Company) nur wenn authenticated
  - Beispiel `ExperienceTimeline`: Zeige echten Company-Namen statt "Confidential"

**SEO-Behandlung für /invite/:token:**
- Meta-Tags: `noindex, nofollow` (Vermeide Indexierung personalisierter Links)
- Open Graph: Generische Daten (kein Leak personalisierter Nachrichten)
- JSON-LD: Kein strukturiertes Data-Snippet (Privacy)

**Privacy & DSGVO:**
- Keine IP-Adressen speichern (weder in Logs noch DB)
- User-Agent nur temporär für Rate-Limiting (nicht persistiert)
- Anonymisierte Statistiken (nur Counter + Timestamp)
- Keine Third-Party-Cookies
- Keine personenbezogenen Daten außer optional vom Admin eingegebene Message

### Out of Scope

- **Admin-UI für Link-Management** (Epic 5 - Dashboard)
  - Link-Liste, CRUD-Operations, Statistics-Visualisierung
  - Wird in Epic 5 als Admin-Dashboard implementiert
- **Erweiterte Statistiken/Analytics** (Growth-Feature)
  - Device-Type-Tracking, Geographic Data, Referrer-Tracking
  - Verletzen würde Privacy-First-Prinzip
- **Custom Themes pro Link** (Growth-Feature)
  - Personalisierte Farbschemas, Logo-Injection
  - Erhöht Komplexität, nicht MVP-kritisch
- **Dynamische Sections pro Link** (Growth-Feature)
  - Zeige nur relevante Projekte (z.B. Backend-Projekte für Backend-Job)
  - Erfordert komplexe Filtering-Logik
- **Link-Passwort-Schutz** (Growth-Feature)
  - Zusätzliches Passwort neben Token
  - Erhöht UX-Friction, für persönliches CV nicht nötig
- **Bulk-Link-Erstellung** (Growth-Feature)
  - CSV-Import für mehrere Links
  - Für persönliches Projekt überdimensioniert
- **Link-Expiry-Notifications** (Growth-Feature)
  - Email-Benachrichtigung vor Link-Ablauf
  - Erfordert Email-Service-Integration
- **Besuchsstatistik-Details** (Growth-Feature)
  - Session-Duration, Click-Heatmaps, Scroll-Depth
  - Privacy-kritisch, nicht für MVP

## System Architecture Alignment

Epic 4 implementiert das in der Architecture spezifizierte **Token-Based Access Control Pattern** (Architecture Pattern 2) und erweitert das **Privacy-First Data Filtering Pattern** (Architecture Pattern 1) um einen authenticated Context.

**Token-Based Access Control (Architecture Pattern 2):**
- CUID2-Token-Generierung wie spezifiziert (25 Zeichen, URL-safe, kryptografisch sicher)
- Stateless Token-Validierung: Token existiert + isActive + nicht abgelaufen
- TypeORM Link-Entity mit allen spezifizierten Feldern
- Besuchsstatistik-Tracking ohne Privacy-Verletzung (anonymisiert)

**Privacy-First Data Filtering Extension:**
- Bestehende `CVService.getCV()` Methode (Epic 2) erweitert:
  - Context `'public'` → Gefilterte Daten (bestehend)
  - Context `'authenticated'` → Vollständige Daten (NEU in Epic 4)
- Token-Validierung als Middleware/Guard vor CV-Zugriff
- Server-side Filtering bleibt zentral (keine Privacy-Logik im Frontend)

**Backend-Architektur (NestJS Modular Architecture):**
```
apps/backend/src/
├── modules/
│   ├── cv/                    # Epic 2 (bestehend)
│   │   ├── cv.controller.ts   # GET /api/cv/public (bestehend)
│   │   ├── cv.service.ts      # getCV(context) - erweitert
│   │   └── entities/
│   │       └── cv.entity.ts
│   ├── invite/                # Epic 4 (NEU)
│   │   ├── invite.controller.ts
│   │   │   ├── POST /api/admin/invite
│   │   │   ├── GET /api/invite/:token
│   │   │   └── GET /api/cv/private/:token
│   │   ├── invite.service.ts
│   │   │   ├── createInvite()
│   │   │   ├── validateToken()
│   │   │   ├── trackVisit()
│   │   ├── entities/
│   │   │   └── invite.entity.ts (Link Model)
│   │   └── dto/
│   │       ├── create-invite.dto.ts
│   │       └── invite-response.dto.ts
│   └── auth/                  # Epic 5 (vorbereitet)
│       └── guards/
│           └── admin-auth.guard.ts
```

**Frontend-Architektur (TanStack Start SSR):**
```
apps/frontend/src/
├── routes/
│   ├── index.tsx                    # Epic 3 (bestehend)
│   │   └── GET / - Public CV
│   └── invite/
│       └── $token.tsx               # Epic 4 (NEU)
│           └── GET /invite/:token - Personalized CV
├── components/
│   ├── cv/                          # Epic 3 (bestehend, erweitert)
│   │   ├── SkillsSection.tsx        # + variant prop
│   │   ├── ProjectsSection.tsx      # + variant prop
│   │   ├── ExperienceSection.tsx    # + variant prop
│   │   └── ContactSection.tsx       # Epic 4 (NEU)
│   └── invite/                      # Epic 4 (NEU)
│       ├── PersonalizedMessageBanner.tsx
│       └── PersonalizedCVPage.tsx
├── lib/
│   └── api/
│       ├── cv.ts                    # Epic 3 (bestehend)
│       │   └── usePublicCV()
│       └── invite.ts                # Epic 4 (NEU)
│           ├── useInviteValidation()
│           └── usePrivateCV()
```

**Database Schema Extension (SQLite + TypeORM):**
```sql
-- Epic 2 (bestehend)
CREATE TABLE cv (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,  -- JSON Resume
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Epic 4 (NEU)
CREATE TABLE invite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  personalizedMessage TEXT,
  expiresAt DATETIME,
  isActive BOOLEAN DEFAULT 1,
  visitCount INTEGER DEFAULT 0,
  lastVisitAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invite_token ON invite(token);
CREATE INDEX idx_invite_active ON invite(isActive, expiresAt);
```

**API Versioning Strategy:**
- Keine URI-Versionierung (`/api/v1/...` verboten laut PRD)
- Backwards-Compatible Changes (neue Endpoints, optionale Felder)
- Zukünftig: Header-based Versioning (`Accept-Version: 2025-11-05`) bei Breaking Changes

**Tech Stack Adherence:**
- **Backend:** NestJS v11, TypeORM, CUID2 (Architecture-konform)
- **Frontend:** TanStack Start SSR, TanStack Query, React 19 (Architecture-konform)
- **Validation:** Zod v3 Shared Schemas zwischen Frontend/Backend
- **Database:** SQLite (Architecture-konform für <50k requests/month)

**Performance Alignment:**
- SSR für `/invite/:token` (wie `/` in Epic 3)
- TanStack Query Caching (staleTime: 5min, gcTime: 10min)
- Bundle-Impact minimal (neue Route = separate Chunk via Code-Splitting)
- Target: FCP <1.5s auch für personalisierte Ansicht

**Security Alignment:**
- Token-Validierung als NestJS Guard (Pattern aus Architecture)
- Rate-Limiting auf `/api/admin/invite` (Epic 1 Foundation, 50 req/min)
- Helmet Security Headers (Epic 1 Foundation, CSP, HSTS)
- DSGVO-konform: Keine IP-Speicherung, anonymisierte Statistiken

**Dependencies auf vorherige Epics:**
- **Epic 1:** NestJS Foundation, TypeORM Setup, Security Headers
- **Epic 2:** CV-Entity, Privacy-Filtering-Logik (`getCV(context)`)
- **Epic 3:** Frontend Components, TanStack Router, shadcn/ui, SSR-Setup

**Integration Points:**
- `CVService.getCV('authenticated')` ruft Epic 2 Logik auf
- Frontend Components aus Epic 3 werden wiederverwendet (mit `variant` prop)
- Shared-Types Package (`@cv-hub/shared-types`) für neue DTOs erweitert

## Detailed Design

### Services and Modules

Epic 4 erweitert die Backend-Architektur um ein neues `InviteModule` und passt bestehende Frontend-Components aus Epic 3 an. Die Module-Struktur folgt NestJS Best Practices mit klarer Trennung zwischen Controller (HTTP-Layer), Service (Business-Logik) und Repository (Data-Access).

| Service/Module | Responsibilities | Inputs | Outputs | Owner |
|----------------|------------------|--------|---------|-------|
| **InviteController** (Backend) | HTTP-Endpoints für Link-Management und Token-Validierung | HTTP Requests (POST /admin/invite, GET /invite/:token, GET /cv/private/:token) | JSON Responses (InviteDTO, CV Data) | Backend |
| **InviteService** (Backend) | Business-Logik: Token-Generierung, Validierung, Statistik-Tracking | CreateInviteDTO, Token (string) | Invite-Entity, ValidationResult, PrivateCV | Backend |
| **InviteRepository** (TypeORM) | Datenbank-Operationen: CRUD für Invite-Entities | Invite-Entity, Query-Criteria | Invite-Entity, Update-Result | Backend |
| **CVService.getCV()** (Backend - erweitert) | Privacy-Filtering basierend auf Context | Context: 'public' \| 'authenticated', CV-ID | PublicCV \| PrivateCV | Backend (Epic 2, erweitert) |
| **TokenValidationGuard** (Backend) | Middleware: Token-Check vor CV-Zugriff | HTTP Request mit :token Param | Boolean (pass/fail), Request.user = InviteEntity | Backend |
| **Personalized CV Route** (/invite/:token) | SSR-Route für personalisierte Ansicht | Token (URL-Param) | HTML (SSR) + Hydration | Frontend |
| **useInviteValidation()** Hook (Frontend) | Token-Validierung via TanStack Query | Token (string) | { isValid, personalizedMessage, isLoading, error } | Frontend |
| **usePrivateCV()** Hook (Frontend) | Vollständigen CV fetchen via TanStack Query | Token (string) | { cv: PrivateCV, isLoading, error } | Frontend |
| **PersonalizedCVPage** Component (Frontend) | Main Layout für /invite/:token Route | CV Data, Personalized Message | Gerenderte Page mit Sections | Frontend |
| **PersonalizedMessageBanner** (Frontend) | Prominente Anzeige der persönlichen Nachricht | Message (string, Markdown) | Banner-Component (shadcn/ui Alert) | Frontend |
| **SkillsSection** (Frontend - erweitert) | Skills-Darstellung mit Variant-Support | Skills Array, variant: 'public' \| 'authenticated' | Skills Grid (public: nur Name, authenticated: Level + Details) | Frontend (Epic 3, erweitert) |
| **ProjectsSection** (Frontend - erweitert) | Projekte mit Variant-Support | Projects Array, variant | Project Cards (authenticated: echte Company-Namen, Metriken) | Frontend (Epic 3, erweitert) |
| **ExperienceSection** (Frontend - erweitert) | Berufserfahrung mit Variant-Support | Work Array, variant | Experience Timeline (authenticated: echte Firmennamen) | Frontend (Epic 3, erweitert) |
| **ContactSection** (Frontend - NEU) | Kontaktdaten-Anzeige (nur authenticated) | Contact Info (email, phone, location) | Contact Card mit Icons | Frontend |

**Module-Interaktionen (Backend):**

```
HTTP Request: POST /api/admin/invite
        ↓
InviteController.createInvite()
        ↓
InviteService.createInvite(dto)
        ↓ (CUID2 Token generieren)
        ↓
InviteRepository.save(inviteEntity)
        ↓ (SQLite persist)
        ↓
Return: { id, token, url, createdAt }
```

```
HTTP Request: GET /api/invite/:token
        ↓
InviteController.validateToken(token)
        ↓
InviteService.validateToken(token)
        ↓
InviteRepository.findOne({ token })
        ↓ (Check: exists && isActive && !expired)
        ↓
InviteService.trackVisit(invite)
        ↓ (visitCount++, lastVisitAt = now())
        ↓
InviteRepository.save(updatedInvite)
        ↓
Return: { isValid: true, personalizedMessage }
```

```
HTTP Request: GET /api/cv/private/:token
        ↓
TokenValidationGuard.canActivate(context)
        ↓
InviteService.validateToken(token)
        ↓ (Attach invite to request.user)
        ↓
InviteController.getPrivateCV(token)
        ↓
CVService.getCV('authenticated')
        ↓ (Epic 2 Logik: NO filtering, return full CV)
        ↓
Return: PrivateCV (full JSON Resume)
```

**Module-Interaktionen (Frontend):**

```
User: Navigate to /invite/abc123
        ↓
TanStack Router: Load Route /invite/$token.tsx
        ↓
SSR Loader: Parallel Fetches
   ├─→ useInviteValidation(token)
   │      ↓ GET /api/invite/:token
   │      ↓ Return: { isValid, personalizedMessage }
   └─→ usePrivateCV(token)
          ↓ GET /api/cv/private/:token
          ↓ Return: PrivateCV
        ↓
Server-Side Rendering
        ↓
Return HTML (SSR)
        ↓
Browser: Render + Hydration
        ↓
PersonalizedCVPage Component
   ├─→ PersonalizedMessageBanner (if message)
   ├─→ ContactSection (authenticated data)
   ├─→ SkillsSection (variant="authenticated")
   ├─→ ProjectsSection (variant="authenticated")
   └─→ ExperienceSection (variant="authenticated")
```

**Shared Component Variant-Logic:**

```typescript
// Epic 3 Component (erweitert für Epic 4)
interface ProjectCardProps {
  project: Project;
  variant: 'public' | 'authenticated';
}

function ProjectCard({ project, variant }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        {variant === 'authenticated' && project.entity && (
          <CardDescription>
            <Building className="inline w-4 h-4" />
            {project.entity} {/* Echte Company, nur authenticated */}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p>{project.description}</p>
        {variant === 'authenticated' && project.metrics && (
          <div className="mt-4 grid gap-2">
            {project.metrics.map(metric => (
              <MetricBadge key={metric.name} metric={metric} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Service-Responsibilities-Matrix:**

| Capability | InviteService | CVService | TokenValidationGuard | Frontend Hooks |
|------------|---------------|-----------|---------------------|----------------|
| Token-Generierung | ✅ (CUID2) | - | - | - |
| Token-Validierung | ✅ (Business-Logik) | - | ✅ (Guard-Wrapper) | ✅ (API-Call) |
| Link-CRUD | ✅ | - | - | - |
| Statistik-Tracking | ✅ | - | - | - |
| CV-Filtering | - | ✅ (public/authenticated) | - | - |
| API-Integration | - | - | - | ✅ (TanStack Query) |

### Data Models and Contracts

Epic 4 führt neue Data Models für Link-Management ein und erweitert bestehende CV-Schemas aus Epic 2 um einen `PrivateCV` Type. Alle Models nutzen Zod für Runtime-Validation und TypeScript Type-Inference.

**1. Invite Entity (Backend - TypeORM)**

```typescript
// apps/backend/src/modules/invite/entities/invite.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('invite')
export class InviteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @Index('idx_invite_token')
  token: string; // CUID2, 25 chars, URL-safe

  @Column({ type: 'text', nullable: true })
  personalizedMessage: string | null;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'boolean', default: true })
  @Index('idx_invite_active')
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  visitCount: number;

  @Column({ type: 'datetime', nullable: true })
  lastVisitAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Key Constraints:**
- `token` UNIQUE constraint (verhindert Duplikate)
- Composite Index auf `(isActive, expiresAt)` für schnelle Validierung
- `personalizedMessage` und `expiresAt` sind optional (NULL)
- Timestamps automatisch via TypeORM Decorators

---

**2. Invite DTOs (Shared Types Package)**

```typescript
// packages/shared-types/src/invite.schema.ts
import { z } from 'zod';

// Create Invite DTO (Admin Input)
export const CreateInviteDtoSchema = z.object({
  personalizedMessage: z.string().max(5000).optional(),
  expiresAt: z.coerce.date().min(new Date()).optional(), // Future date only
});

export type CreateInviteDto = z.infer<typeof CreateInviteDtoSchema>;

// Invite Response (API Output)
export const InviteResponseSchema = z.object({
  id: z.number().int().positive(),
  token: z.string().length(25), // CUID2 = exactly 25 chars
  url: z.string().url(),
  personalizedMessage: z.string().nullable(),
  expiresAt: z.date().nullable(),
  isActive: z.boolean(),
  visitCount: z.number().int().nonnegative(),
  lastVisitAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InviteResponse = z.infer<typeof InviteResponseSchema>;

// Invite Validation Response (Token-Check Endpoint)
export const InviteValidationResponseSchema = z.object({
  isValid: z.boolean(),
  personalizedMessage: z.string().nullable(),
  reason: z.enum(['valid', 'not_found', 'inactive', 'expired']).optional(),
});

export type InviteValidationResponse = z.infer<typeof InviteValidationResponseSchema>;
```

**Validation Rules:**
- `personalizedMessage` max 5000 chars (Markdown-kompatibel)
- `expiresAt` muss in der Zukunft liegen (z.coerce.date().min(new Date()))
- `token` exakt 25 Zeichen (CUID2-Standard)
- `url` muss valide URL sein (z.string().url())

---

**3. Private CV Schema (Extension von Epic 2)**

```typescript
// packages/shared-types/src/cv.schema.ts
import { z } from 'zod';

// Epic 2: Public CV Schema (bestehend)
export const PublicCVSchema = CVSchema.pick({
  basics: true,
  skills: true,
  projects: true,
  work: true,
  education: true,
  volunteer: true,
}).transform(data => ({
  ...data,
  // Server-side filtered (no email, phone, real company names)
  basics: {
    ...data.basics,
    email: undefined,
    phone: undefined,
  },
  work: data.work?.map(w => ({ ...w, name: 'Confidential' })),
  projects: data.projects?.map(p => {
    const { entity, metrics, ...rest } = p;
    return rest; // Remove entity (company) and metrics
  }),
}));

export type PublicCV = z.infer<typeof PublicCVSchema>;

// Epic 4: Private CV Schema (NEU - vollständige Daten)
export const PrivateCVSchema = CVSchema; // No filtering, full JSON Resume

export type PrivateCV = z.infer<typeof PrivateCVSchema>;

// Difference: PrivateCV includes
interface PrivateCVExtensions {
  basics: {
    email: string;
    phone: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      countryCode: string;
    };
  };
  work: Array<{
    name: string; // Real company name (not "Confidential")
    // ... all other fields
  }>;
  projects: Array<{
    entity: string; // Company/Client name
    metrics: Array<{ name: string; value: string }>; // Business metrics
    // ... all other fields
  }>;
}
```

**Key Differences Public vs Private:**

| Field | PublicCV | PrivateCV |
|-------|----------|-----------|
| `basics.email` | ❌ undefined | ✅ "ruben@example.com" |
| `basics.phone` | ❌ undefined | ✅ "+49 123 456789" |
| `basics.location.address` | ❌ undefined | ✅ "Musterstraße 1" |
| `work[].name` | ❌ "Confidential" | ✅ "Google Inc." |
| `projects[].entity` | ❌ undefined | ✅ "Startup XYZ" |
| `projects[].metrics` | ❌ undefined | ✅ [{ name: "Revenue", value: "+40%" }] |

---

**4. API Request/Response Contracts**

**POST /api/admin/invite**

```typescript
// Request
interface CreateInviteRequest {
  personalizedMessage?: string; // Max 5000 chars, Markdown
  expiresAt?: string; // ISO 8601 DateTime, future only
}

// Response (201 Created)
interface CreateInviteResponse {
  id: number;
  token: string; // CUID2, 25 chars
  url: string; // Full URL: https://cv-hub.com/invite/{token}
  personalizedMessage: string | null;
  expiresAt: string | null; // ISO 8601
  isActive: boolean;
  visitCount: 0;
  lastVisitAt: null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// Error Responses
// 400 Bad Request - Validation failed
{
  statusCode: 400,
  message: ["expiresAt must be a future date"],
  error: "Bad Request"
}

// 401 Unauthorized - Admin auth required (Epic 5)
{
  statusCode: 401,
  message: "Unauthorized",
  error: "Unauthorized"
}
```

**GET /api/invite/:token**

```typescript
// Request
// Path Param: token (string, 25 chars)

// Response (200 OK)
interface ValidateInviteResponse {
  isValid: boolean;
  personalizedMessage: string | null; // Markdown string
  reason?: 'valid' | 'not_found' | 'inactive' | 'expired';
}

// Example: Valid token
{
  isValid: true,
  personalizedMessage: "Hi Ruben, looking forward to discussing this opportunity!",
  reason: "valid"
}

// Example: Expired token
{
  isValid: false,
  personalizedMessage: null,
  reason: "expired"
}

// Side Effects:
// - visitCount incremented (if valid)
// - lastVisitAt updated to current timestamp
```

**GET /api/cv/private/:token**

```typescript
// Request
// Path Param: token (string, 25 chars)

// Response (200 OK)
interface PrivateCVResponse extends PrivateCV {
  // Full JSON Resume, no filtering
  basics: {
    name: string;
    label: string;
    email: string; // ✅ Included
    phone: string; // ✅ Included
    location: { /* full address */ };
    // ...
  };
  work: Array<{
    name: string; // ✅ Real company name
    // ...
  }>;
  projects: Array<{
    entity: string; // ✅ Client/Company
    metrics: Array<{ name: string; value: string }>; // ✅ Business metrics
    // ...
  }>;
  // ... all other JSON Resume fields
}

// Error Responses
// 401 Unauthorized - Invalid/expired token
{
  statusCode: 401,
  message: "Invalid or expired invite token",
  error: "Unauthorized"
}

// 404 Not Found - CV data not found
{
  statusCode: 404,
  message: "CV data not found",
  error: "Not Found"
}
```

---

**5. Frontend Hook Contracts (TanStack Query)**

```typescript
// lib/api/invite.ts

// useInviteValidation Hook
interface UseInviteValidationResult {
  data?: InviteValidationResponse;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

function useInviteValidation(token: string): UseInviteValidationResult;

// Usage Example
const { data, isLoading, isError } = useInviteValidation(token);

if (data?.isValid === false) {
  // Show error page (expired/inactive/not_found)
}

// usePrivateCV Hook
interface UsePrivateCVResult {
  data?: PrivateCV;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

function usePrivateCV(token: string): UsePrivateCVResult;

// Usage Example
const { data: cv, isLoading, isError } = usePrivateCV(token);

// Server-Side Loader (TanStack Router)
export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => {
    const [validation, cv] = await Promise.all([
      fetchInviteValidation(params.token),
      fetchPrivateCV(params.token),
    ]);

    if (!validation.isValid) {
      throw new Error(`Invalid invite: ${validation.reason}`);
    }

    return { validation, cv };
  },
});
```

---

**6. Component Props Contracts**

```typescript
// PersonalizedCVPage Props
interface PersonalizedCVPageProps {
  cv: PrivateCV;
  personalizedMessage: string | null;
}

// PersonalizedMessageBanner Props
interface PersonalizedMessageBannerProps {
  message: string; // Markdown string
}

// ContactSection Props (NEW)
interface ContactSectionProps {
  contact: {
    email: string;
    phone: string;
    location: {
      address?: string;
      city?: string;
      countryCode?: string;
    };
  };
}

// Shared Section Props (Extended with Variant)
interface SkillsSectionProps {
  skills: PrivateCV['skills'];
  variant: 'public' | 'authenticated';
}

interface ProjectsSectionProps {
  projects: PrivateCV['projects'];
  variant: 'public' | 'authenticated';
}

interface ExperienceSectionProps {
  work: PrivateCV['work'];
  variant: 'public' | 'authenticated';
}
```

---

**7. Database Schema (SQLite + TypeORM Migration)**

```sql
-- Epic 4 Migration: Create Invite Table
CREATE TABLE invite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  personalizedMessage TEXT,
  expiresAt DATETIME,
  isActive INTEGER DEFAULT 1, -- SQLite boolean (0/1)
  visitCount INTEGER DEFAULT 0,
  lastVisitAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invite_token ON invite(token);
CREATE INDEX idx_invite_active ON invite(isActive, expiresAt);

-- Trigger: Update updatedAt on row change
CREATE TRIGGER update_invite_timestamp
AFTER UPDATE ON invite
FOR EACH ROW
BEGIN
  UPDATE invite SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
```

**Indexes Rationale:**
- `idx_invite_token`: Primäre Lookup-Strategie (fast token validation)
- `idx_invite_active`: Compound index für `WHERE isActive = 1 AND (expiresAt IS NULL OR expiresAt > NOW())`

### APIs and Interfaces

Epic 4 führt drei neue Backend-Endpoints ein und erweitert einen bestehenden. Alle Endpoints folgen REST-Konventionen und nutzen JSON für Request/Response-Bodies.

---

**API Endpoint 1: Create Invite Link**

```
POST /api/admin/invite
```

**Purpose:** Erstelle einen neuen personalisierten Link mit Token

**Authentication:** Required (Admin Session, Epic 5)
- Session-Cookie muss vorhanden sein
- NestJS Guard: `@UseGuards(AdminAuthGuard)`

**Request Headers:**
```http
Content-Type: application/json
Cookie: connect.sid=<session-id>
```

**Request Body:**
```typescript
{
  personalizedMessage?: string;  // Optional, max 5000 chars, Markdown
  expiresAt?: string;            // Optional, ISO 8601 DateTime, future only
}
```

**Validation (Zod):**
```typescript
const CreateInviteDtoSchema = z.object({
  personalizedMessage: z.string().max(5000).optional(),
  expiresAt: z.coerce.date().min(new Date()).optional(),
});
```

**Success Response (201 Created):**
```typescript
{
  id: 42,
  token: "ckl8x9y2v0000qzrmn8zg9q3c", // CUID2, 25 chars
  url: "https://cv-hub.com/invite/ckl8x9y2v0000qzrmn8zg9q3c",
  personalizedMessage: "Hi! Looking forward to our chat.",
  expiresAt: "2025-12-31T23:59:59.000Z",
  isActive: true,
  visitCount: 0,
  lastVisitAt: null,
  createdAt: "2025-11-05T10:30:00.000Z",
  updatedAt: "2025-11-05T10:30:00.000Z"
}
```

**Error Responses:**

```typescript
// 400 Bad Request - Validation failed
{
  statusCode: 400,
  message: [
    "personalizedMessage must be shorter than or equal to 5000 characters",
    "expiresAt must be a future date"
  ],
  error: "Bad Request"
}

// 401 Unauthorized - Not authenticated
{
  statusCode: 401,
  message: "Unauthorized",
  error: "Unauthorized"
}

// 500 Internal Server Error - Token generation failed
{
  statusCode: 500,
  message: "Failed to create invite link",
  error: "Internal Server Error"
}
```

**Implementation (NestJS Controller):**
```typescript
@Controller('admin/invite')
@UseGuards(AdminAuthGuard)
export class InviteController {
  @Post()
  async createInvite(@Body() dto: CreateInviteDto): Promise<InviteResponse> {
    return this.inviteService.createInvite(dto);
  }
}
```

**Rate Limiting:**
- 50 requests per minute per session (NestJS Throttler)
- Prevents abuse of link creation

---

**API Endpoint 2: Validate Invite Token**

```
GET /api/invite/:token
```

**Purpose:** Validiere Token und hole personalisierte Nachricht (ohne CV-Daten)

**Authentication:** None (public endpoint)

**Path Parameters:**
- `token` (string, 25 chars, CUID2)

**Request Headers:**
```http
Accept: application/json
```

**Success Response (200 OK):**
```typescript
// Valid token
{
  isValid: true,
  personalizedMessage: "Hi Ruben! Excited to discuss this opportunity with you.",
  reason: "valid"
}

// Invalid token (not found)
{
  isValid: false,
  personalizedMessage: null,
  reason: "not_found"
}

// Invalid token (inactive)
{
  isValid: false,
  personalizedMessage: null,
  reason: "inactive"
}

// Invalid token (expired)
{
  isValid: false,
  personalizedMessage: null,
  reason: "expired"
}
```

**Side Effects:**
- IF token is valid → `visitCount` incremented
- IF token is valid → `lastVisitAt` updated to current timestamp
- IF token is invalid → No side effects

**Validation Logic:**
```typescript
async validateToken(token: string): Promise<InviteValidationResponse> {
  const invite = await this.inviteRepository.findOne({ where: { token } });

  if (!invite) {
    return { isValid: false, personalizedMessage: null, reason: 'not_found' };
  }

  if (!invite.isActive) {
    return { isValid: false, personalizedMessage: null, reason: 'inactive' };
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return { isValid: false, personalizedMessage: null, reason: 'expired' };
  }

  // Valid token - track visit
  await this.trackVisit(invite);

  return {
    isValid: true,
    personalizedMessage: invite.personalizedMessage,
    reason: 'valid',
  };
}

private async trackVisit(invite: InviteEntity): Promise<void> {
  invite.visitCount += 1;
  invite.lastVisitAt = new Date();
  await this.inviteRepository.save(invite);
}
```

**Error Response:**

```typescript
// 500 Internal Server Error - Database error
{
  statusCode: 500,
  message: "Failed to validate invite token",
  error: "Internal Server Error"
}
```

**Rate Limiting:**
- 100 requests per minute per IP (shared with public CV endpoint)

---

**API Endpoint 3: Get Private CV (Token-Protected)**

```
GET /api/cv/private/:token
```

**Purpose:** Hole vollständigen CV (keine Privacy-Filtering) nach Token-Validierung

**Authentication:** Token-based (stateless)
- Token wird via Path-Parameter übergeben
- `TokenValidationGuard` prüft Token-Gültigkeit

**Path Parameters:**
- `token` (string, 25 chars, CUID2)

**Request Headers:**
```http
Accept: application/json
```

**Success Response (200 OK):**
```typescript
// Full JSON Resume (PrivateCV)
{
  basics: {
    name: "Ruben Mustermann",
    label: "Senior Full-Stack Engineer",
    email: "ruben@example.com",        // ✅ Included
    phone: "+49 123 456789",            // ✅ Included
    url: "https://ruben.dev",
    summary: "Experienced engineer...",
    location: {
      address: "Musterstraße 42",       // ✅ Included
      postalCode: "12345",
      city: "Berlin",
      countryCode: "DE"
    },
    profiles: [
      { network: "GitHub", username: "ruben", url: "https://github.com/ruben" }
    ]
  },
  skills: [
    {
      name: "TypeScript",
      level: "Expert",                  // ✅ Included (not in public)
      keywords: ["Frontend", "Backend"]
    }
  ],
  projects: [
    {
      name: "cv-hub",
      entity: "Personal Project",       // ✅ Included (not in public)
      description: "Privacy-first CV management system",
      highlights: ["Built with NestJS + TanStack Start"],
      keywords: ["TypeScript", "React"],
      startDate: "2025-01-01",
      url: "https://github.com/ruben/cv-hub",
      metrics: [                        // ✅ Included (not in public)
        { name: "Stars", value: "1.2k" },
        { name: "Performance", value: "Lighthouse 95+" }
      ]
    }
  ],
  work: [
    {
      name: "Google Inc.",              // ✅ Real name (not "Confidential")
      position: "Senior Engineer",
      startDate: "2020-01-01",
      endDate: "2024-01-01",
      summary: "Led frontend architecture...",
      highlights: [
        "Improved performance by 40%",
        "Mentored 5 junior engineers"
      ]
    }
  ],
  education: [ /* ... */ ],
  volunteer: [ /* ... */ ]
}
```

**Error Responses:**

```typescript
// 401 Unauthorized - Invalid token
{
  statusCode: 401,
  message: "Invalid or expired invite token",
  error: "Unauthorized"
}

// 404 Not Found - CV data not found
{
  statusCode: 404,
  message: "CV data not found",
  error: "Not Found"
}

// 500 Internal Server Error
{
  statusCode: 500,
  message: "Failed to fetch CV data",
  error: "Internal Server Error"
}
```

**Implementation (NestJS Controller):**
```typescript
@Controller('cv')
export class CVController {
  @Get('private/:token')
  @UseGuards(TokenValidationGuard)
  async getPrivateCV(@Param('token') token: string): Promise<PrivateCV> {
    // Guard already validated token, attach invite to request.user
    return this.cvService.getCV('authenticated');
  }
}
```

**TokenValidationGuard:**
```typescript
@Injectable()
export class TokenValidationGuard implements CanActivate {
  constructor(private inviteService: InviteService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    const validation = await this.inviteService.validateToken(token);

    if (!validation.isValid) {
      throw new UnauthorizedException('Invalid or expired invite token');
    }

    // Attach invite to request for logging/tracking
    request.user = { token, validation };

    return true;
  }
}
```

**Rate Limiting:**
- 100 requests per minute per token
- Prevents abuse of individual links

---

**API Endpoint 4: Get Public CV (Extended from Epic 2)**

```
GET /api/cv/public
```

**Purpose:** Hole gefilterten CV (bestehend aus Epic 2, hier für Vollständigkeit)

**Authentication:** None

**Success Response (200 OK):**
```typescript
// Filtered PublicCV (no email, phone, real companies)
{
  basics: {
    name: "Ruben Mustermann",
    label: "Senior Full-Stack Engineer",
    // email: undefined,         ❌ Filtered
    // phone: undefined,         ❌ Filtered
    url: "https://ruben.dev",
    summary: "Experienced engineer...",
    location: {
      // address: undefined,     ❌ Filtered
      city: "Berlin",
      countryCode: "DE"
    },
    profiles: [ /* ... */ ]
  },
  skills: [
    {
      name: "TypeScript",
      // level: undefined,        ❌ Filtered in public
      keywords: ["Frontend", "Backend"]
    }
  ],
  projects: [
    {
      name: "cv-hub",
      // entity: undefined,       ❌ Filtered
      description: "Privacy-first CV management system",
      highlights: ["Built with NestJS + TanStack Start"],
      keywords: ["TypeScript", "React"],
      // metrics: undefined       ❌ Filtered
    }
  ],
  work: [
    {
      name: "Confidential",           // ❌ Generic label
      position: "Senior Engineer",
      startDate: "2020-01-01",
      highlights: [
        "Improved performance by 40%",
        "Mentored 5 junior engineers"
      ]
    }
  ]
}
```

**Rate Limiting:**
- 100 requests per minute per IP

---

**API Comparison: Public vs Private CV**

| Endpoint | Auth | Privacy Filtering | Use Case |
|----------|------|-------------------|----------|
| `GET /api/cv/public` | None | ✅ Yes (server-side) | Öffentliche Landing Page |
| `GET /api/cv/private/:token` | Token | ❌ No (full data) | Personalisierte Invite-Links |

---

**Frontend API Client (TanStack Query)**

```typescript
// lib/api/invite.ts
import { useQuery } from '@tanstack/react-query';
import { InviteValidationResponseSchema, PrivateCVSchema } from '@cv-hub/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const inviteQueryKeys = {
  validation: (token: string) => ['invite', 'validation', token] as const,
  privateCV: (token: string) => ['cv', 'private', token] as const,
};

// Fetch Invite Validation
export async function fetchInviteValidation(token: string): Promise<InviteValidationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/invite/${token}`);

  if (!response.ok) {
    throw new Error(`Failed to validate invite: ${response.statusText}`);
  }

  const data = await response.json();
  const validated = InviteValidationResponseSchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation response parsing failed:', validated.error);
    throw new Error('Invalid validation response');
  }

  return validated.data;
}

// Fetch Private CV
export async function fetchPrivateCV(token: string): Promise<PrivateCV> {
  const response = await fetch(`${API_BASE_URL}/api/cv/private/${token}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid or expired invite token');
    }
    throw new Error(`Failed to fetch CV: ${response.statusText}`);
  }

  const data = await response.json();
  const validated = PrivateCVSchema.safeParse(data);

  if (!validated.success) {
    console.error('CV validation failed:', validated.error);
    throw new Error('Invalid CV data received');
  }

  return validated.data;
}

// React Hook: useInviteValidation
export function useInviteValidation(token: string) {
  return useQuery({
    queryKey: inviteQueryKeys.validation(token),
    queryFn: () => fetchInviteValidation(token),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 1,                  // Only retry once (invalid tokens won't become valid)
  });
}

// React Hook: usePrivateCV
export function usePrivateCV(token: string) {
  return useQuery({
    queryKey: inviteQueryKeys.privateCV(token),
    queryFn: () => fetchPrivateCV(token),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
```

---

**Error Handling Strategy**

**Backend (NestJS Exception Filters):**
```typescript
// Global Exception Filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // Log error (Pino)
    this.logger.error({
      statusCode: status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Frontend (TanStack Query Error Boundaries):**
```typescript
// routes/invite/$token.tsx
export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => {
    try {
      const [validation, cv] = await Promise.all([
        fetchInviteValidation(params.token),
        fetchPrivateCV(params.token),
      ]);

      if (!validation.isValid) {
        throw new Error(`Invalid invite: ${validation.reason}`);
      }

      return { validation, cv };
    } catch (error) {
      throw error; // Will be caught by ErrorBoundary
    }
  },
  errorComponent: InviteErrorPage,
});

// InviteErrorPage Component
function InviteErrorPage({ error }: { error: Error }) {
  const message = error.message;

  if (message.includes('expired')) {
    return <ExpiredLinkPage />;
  }

  if (message.includes('inactive') || message.includes('not_found')) {
    return <InvalidLinkPage />;
  }

  return <GenericErrorPage error={error} />;
}
```

### Workflows and Sequencing

Epic 4 definiert drei primäre User-Journeys: Link-Erstellung (Admin), Token-Validierung (Viewer) und personalisierte CV-Ansicht (Viewer). Alle Workflows nutzen SSR für optimale Performance und SEO.

---

**Workflow 1: Admin erstellt personalisierten Link (Epic 5 Integration)**

```
1. Admin navigiert zu Admin-Dashboard (/admin/links)
        ↓
2. Klick auf "Neuen Link erstellen" Button
        ↓
3. Form öffnet sich (Modal oder neue Page):
   - Optionales Feld: Personalisierte Nachricht (Textarea, Markdown-Support)
   - Optionales Feld: Ablaufdatum (Date-Picker, min: heute)
        ↓
4. Admin füllt Form aus und klickt "Link erstellen"
        ↓
5. Frontend: TanStack Form Validation
   - personalizedMessage max 5000 chars
   - expiresAt >= heute (wenn gesetzt)
        ↓
6. Frontend sendet POST Request:
   POST /api/admin/invite
   Headers: Cookie: connect.sid=<session>
   Body: {
     personalizedMessage: "Hi Ruben! Excited to chat about this opportunity.",
     expiresAt: "2025-12-31T23:59:59.000Z"
   }
        ↓
7. Backend: AdminAuthGuard prüft Session (Epic 5)
   - Session valid? → Continue
   - Session invalid? → 401 Unauthorized
        ↓
8. Backend: InviteController.createInvite()
        ↓
9. Backend: InviteService.createInvite(dto)
   9.1. Generate CUID2 token (25 chars)
   9.2. Create InviteEntity:
        {
          token: "ckl8x9y2v0000qzrmn8zg9q3c",
          personalizedMessage: dto.personalizedMessage,
          expiresAt: dto.expiresAt,
          isActive: true,
          visitCount: 0,
          lastVisitAt: null
        }
   9.3. Save to SQLite via TypeORM
        ↓
10. Backend: Build full URL
    url = `https://cv-hub.com/invite/${token}`
        ↓
11. Backend: Return Response (201 Created):
    {
      id: 42,
      token: "ckl8x9y2v0000qzrmn8zg9q3c",
      url: "https://cv-hub.com/invite/ckl8x9y2v0000qzrmn8zg9q3c",
      personalizedMessage: "Hi Ruben!...",
      expiresAt: "2025-12-31T23:59:59.000Z",
      isActive: true,
      visitCount: 0,
      lastVisitAt: null,
      createdAt: "2025-11-05T10:30:00.000Z",
      updatedAt: "2025-11-05T10:30:00.000Z"
    }
        ↓
12. Frontend: Display Success-State
    - Show full URL mit Copy-to-Clipboard Button
    - Optional: QR-Code generieren
    - Optional: Email-Compose-Link (mailto:?body=...)
        ↓
13. Frontend: Update Link-Liste (TanStack Query Cache invalidiert)
```

**Timing:**
- Form-Validation: <50ms (client-side)
- API-Call: 100-200ms (inkl. Token-Generierung + DB-Write)
- Total User-Perceived Time: <300ms

---

**Workflow 2: Viewer öffnet personalisierten Link**

```
1. Viewer klickt Link in Email/Message:
   https://cv-hub.com/invite/ckl8x9y2v0000qzrmn8zg9q3c
        ↓
2. Browser sendet GET Request an TanStack Start Server
        ↓
3. Server-Side Rendering (SSR):
   3.1. TanStack Router lädt Route: /invite/$token.tsx
   3.2. Loader-Function führt aus (Server-Side):

        export const Route = createFileRoute('/invite/$token')({
          loader: async ({ params }) => {
            const token = params.token;

            // Parallel Fetches (Performance-Optimierung)
            const [validation, cv] = await Promise.all([
              fetchInviteValidation(token),  // GET /api/invite/:token
              fetchPrivateCV(token),          // GET /api/cv/private/:token
            ]);

            if (!validation.isValid) {
              throw new Error(`Invalid invite: ${validation.reason}`);
            }

            return { validation, cv };
          },
        });
        ↓
4. Backend: GET /api/invite/:token (parallel mit 5)
   4.1. InviteService.validateToken(token)
   4.2. Query DB: SELECT * FROM invite WHERE token = ?
   4.3. Validate:
        - Token exists? → Continue
        - isActive === true? → Continue
        - expiresAt === null || expiresAt > now()? → Continue
   4.4. IF valid:
        - visitCount += 1
        - lastVisitAt = now()
        - UPDATE invite SET visitCount = ?, lastVisitAt = ?
   4.5. Return: { isValid: true, personalizedMessage, reason: 'valid' }
        ↓
5. Backend: GET /api/cv/private/:token (parallel mit 4)
   5.1. TokenValidationGuard.canActivate()
   5.2. InviteService.validateToken(token) [cached from 4]
   5.3. IF invalid → throw UnauthorizedException (401)
   5.4. CVService.getCV('authenticated')
   5.5. Load CV from DB (no privacy filtering)
   5.6. Return: PrivateCV (full JSON Resume)
        ↓
6. SSR: React Components rendern server-side
   6.1. PersonalizedCVPage receives { cv, validation }
   6.2. IF validation.personalizedMessage:
        - Render PersonalizedMessageBanner
   6.3. Render ContactSection (email, phone, location)
   6.4. Render SkillsSection(variant="authenticated")
   6.5. Render ProjectsSection(variant="authenticated")
        - Shows real company names, metrics
   6.6. Render ExperienceSection(variant="authenticated")
        - Shows real company names (not "Confidential")
        ↓
7. SSR: Generate Meta-Tags (SEO)
   7.1. <title>{cv.basics.name} - Personalisierter CV</title>
   7.2. <meta name="robots" content="noindex, nofollow">
   7.3. <meta property="og:title" content="..."> (generic, no leak)
        ↓
8. Server sendet HTML-Response (200 OK)
   - Vollständiges HTML mit CV-Daten
   - Meta-Tags für SEO (noindex!)
   - Inline-CSS (Critical CSS)
        ↓
9. Browser rendert HTML (First Contentful Paint <1.5s)
   - User sieht sofort:
     - Personalisierte Nachricht (falls vorhanden)
     - Vollständigen CV inkl. Kontaktdaten
     - Echte Firmennamen, Projekt-Metriken
        ↓
10. Browser lädt JavaScript-Bundle
    - Code-Splitting: Separate Chunk für /invite Route
        ↓
11. Client-Side Hydration
    11.1. React hydrated server-rendered HTML
    11.2. TanStack Query initialisiert
    11.3. Event-Listener attached
    11.4. Interaktive Features aktiv (Filter, Smooth Scroll)
        ↓
12. User kann interagieren:
    - Client-Side Filtering (Skills, Projects)
    - Smooth Scrolling Navigation
    - Copy Email/Phone mit Click
```

**Timing-Ziele:**
- Server-Side Rendering: 150-300ms
  - Parallel API Fetches: 100-200ms
  - React SSR: 50-100ms
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Hydration: 200-500ms

**Error-Handling:**

```
IF validation.isValid === false:
  → SSR: Throw Error in Loader
  → ErrorBoundary catches error
  → Render appropriate Error-Page basierend auf reason:

    reason: 'expired' → ExpiredLinkPage
      - Message: "Dieser Link ist abgelaufen."
      - CTA: "Kontakt aufnehmen" (Link zur öffentlichen Seite)

    reason: 'inactive' → InvalidLinkPage
      - Message: "Dieser Link wurde deaktiviert."
      - CTA: "Zur öffentlichen Seite"

    reason: 'not_found' → NotFoundPage
      - Message: "Link nicht gefunden."
      - CTA: "Zurück zur Startseite"
```

---

**Workflow 3: Viewer kehrt zu personalisiertem Link zurück (Repeat Visit)**

```
1. Viewer öffnet Link erneut (z.B. nach 2 Tagen)
   https://cv-hub.com/invite/ckl8x9y2v0000qzrmn8zg9q3c
        ↓
2. SSR Loader führt aus (wie Workflow 2)
        ↓
3. Backend: GET /api/invite/:token
   3.1. Validate token (wie in Workflow 2)
   3.2. IF valid:
        - visitCount += 1 (war 1, wird 2)
        - lastVisitAt = now() (update auf neuen Timestamp)
        ↓
4. SSR + Hydration (wie Workflow 2)
        ↓
5. User sieht aktualisierte CV-Daten
   - Falls Admin CV aktualisiert hat → neue Daten sichtbar
   - Personalisierte Nachricht bleibt gleich
```

**Statistik-Tracking:**
- `visitCount` zeigt Anzahl der Zugriffe
- `lastVisitAt` zeigt letzten Besuch
- Keine IP-Speicherung (DSGVO-konform)
- Keine User-Agent-Persistierung

---

**Workflow 4: Component Variant-Rendering (Shared Components)**

```
// Public Route (/) - Epic 3
<SkillsSection skills={publicCV.skills} variant="public" />
  ↓
  Render: Nur Skill-Name, keine Level-Indicator

// Personalized Route (/invite/:token) - Epic 4
<SkillsSection skills={privateCV.skills} variant="authenticated" />
  ↓
  Render: Skill-Name + Level-Indicator (Beginner/Advanced/Expert)

// ProjectsSection Variant-Logic
function ProjectsSection({ projects, variant }: ProjectsSectionProps) {
  return (
    <section>
      <h2>Projekte</h2>
      <div className="grid gap-6">
        {projects.map(project => (
          <ProjectCard key={project.name} project={project} variant={variant} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, variant }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>

        {/* Conditional: Company nur bei authenticated */}
        {variant === 'authenticated' && project.entity && (
          <CardDescription>
            <Building className="w-4 h-4 inline mr-1" />
            {project.entity}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <p>{project.description}</p>

        {/* Conditional: Metrics nur bei authenticated */}
        {variant === 'authenticated' && project.metrics && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.metrics.map(metric => (
              <Badge key={metric.name} variant="secondary">
                {metric.name}: {metric.value}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Variant-Comparison:**

| Component | Public Variant | Authenticated Variant |
|-----------|----------------|----------------------|
| **SkillsSection** | Name only | Name + Level (Expert/Advanced/etc.) |
| **ProjectCard** | No company name, no metrics | Company name + Business metrics |
| **ExperienceCard** | "Confidential" company | Real company name |
| **ContactSection** | N/A (not rendered) | Email, Phone, Location |

---

**Workflow 5: SSR vs CSR Decision-Making**

Epic 4 nutzt **Hybrid SSR + CSR** wie Epic 3:

**Server-Side Rendering (SSR) für:**
- Initial Page Load (`/invite/:token`)
- SEO Meta-Tags (noindex, nofollow)
- First Contentful Paint <1.5s
- CV-Daten fetchen (parallel API-Calls)

**Client-Side Rendering (CSR) für:**
- Filtering (Skills, Projects) - keine API-Calls
- Smooth Scrolling Navigation
- Copy-to-Clipboard Interaktionen
- Form-Interactions (Admin-Dashboard, Epic 5)

**Hydration-Strategy:**
```typescript
export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => {
    // SSR: Fetch data server-side
    const [validation, cv] = await Promise.all([
      fetchInviteValidation(params.token),
      fetchPrivateCV(params.token),
    ]);

    return { validation, cv };
  },
  component: PersonalizedCVPage,
  ssr: true, // Enable SSR
});

function PersonalizedCVPage() {
  // Hydration: Data already available from SSR
  const { validation, cv } = Route.useLoaderData();

  // Client-Side State (nicht SSR)
  const [filterState, setFilterState] = useState<FilterState>({
    selectedSkills: [],
  });

  return (
    <div>
      {validation.personalizedMessage && (
        <PersonalizedMessageBanner message={validation.personalizedMessage} />
      )}

      <ContactSection contact={cv.basics} />

      <SkillsSection
        skills={cv.skills}
        variant="authenticated"
        filterState={filterState}
        onFilterChange={setFilterState}
      />

      {/* ... more sections */}
    </div>
  );
}
```

---

**Workflow 6: Cache-Invalidierung (Admin deaktiviert Link)**

```
// Epic 5 (Admin-Dashboard)
1. Admin deaktiviert Link in Dashboard
   → PUT /api/admin/invite/:id { isActive: false }
        ↓
2. Backend: Update invite.isActive = false
        ↓
3. Viewer öffnet Link erneut
   → GET /api/invite/:token
        ↓
4. Backend: validateToken(token)
   → invite.isActive === false
   → Return: { isValid: false, reason: 'inactive' }
        ↓
5. Frontend: ErrorBoundary catches
   → Render InvalidLinkPage
   → Message: "Dieser Link wurde deaktiviert."
```

**TanStack Query Cache:**
- `staleTime: 5 minutes` (wie Epic 3)
- Wenn Link innerhalb 5min deaktiviert wird → Client sieht cached "valid"
- Nach 5min → Client re-fetches → sieht "invalid"
- Akzeptables Trade-off (kein Real-Time-Requirement)

---

**Workflow 7: Performance-Optimierung (Parallel API Fetches)**

```typescript
// INEFFICIENT (Sequential):
const validation = await fetchInviteValidation(token); // 100ms
if (validation.isValid) {
  const cv = await fetchPrivateCV(token); // 150ms
}
// Total: 250ms

// EFFICIENT (Parallel):
const [validation, cv] = await Promise.all([
  fetchInviteValidation(token), // 100ms
  fetchPrivateCV(token),          // 150ms
]);
// Total: 150ms (max of both)

// Performance Gain: ~100ms (40% faster)
```

**Rationale:**
- Beide API-Calls sind unabhängig
- Validation muss nicht zwingend vor CV-Fetch erfolgen
- Error-Handling: Wenn validation.isValid === false → CV-Response wird ignoriert
- Trade-off: Potentiell unnötiger CV-Fetch wenn invalid → akzeptabel für Performance-Gewinn

## Non-Functional Requirements

### Performance

Epic 4 übernimmt die Performance-Targets aus Epic 3 und erweitert sie für die personalisierte Ansicht. Die `/invite/:token` Route muss dieselben Lighthouse-Scores erreichen wie die öffentliche Route.

**Performance-Targets (identisch zu Epic 3):**

| Metrik | Zielwert | Warum wichtig für Epic 4 |
|--------|----------|--------------------------|
| **Lighthouse Performance Score** | >90 | Personalisierte Links repräsentieren den User professionell |
| **First Contentful Paint (FCP)** | <1.5s | Viewer sieht sofort personalisierten Content |
| **Largest Contentful Paint (LCP)** | <2.5s | Vollständiger CV lädt schnell trotz mehr Daten |
| **Time to Interactive (TTI)** | <3s | Interactive Features (Copy-to-Clipboard) schnell verfügbar |
| **Cumulative Layout Shift (CLS)** | <0.1 | Keine Layout-Sprünge bei PersonalizedMessageBanner |
| **Bundle Size (Initial Load)** | <200KB (gzipped) | Neue Route `/invite/:token` = separate Chunk (Code-Splitting) |

**Performance-Optimierungen spezifisch für Epic 4:**

**1. Parallel API Fetches (SSR Loader)**
```typescript
// ~100ms Performance-Gewinn
const [validation, cv] = await Promise.all([
  fetchInviteValidation(token),  // 100ms
  fetchPrivateCV(token),          // 150ms
]);
// Total: 150ms (statt 250ms sequential)
```

**2. Database Query Optimization**
```sql
-- Token-Lookup mit Index
SELECT * FROM invite WHERE token = ?;
-- Uses idx_invite_token (UNIQUE index)
-- Query Time: <5ms (indexed lookup)

-- Validation Query mit Composite Index
SELECT * FROM invite
WHERE isActive = 1
  AND (expiresAt IS NULL OR expiresAt > CURRENT_TIMESTAMP);
-- Uses idx_invite_active (isActive, expiresAt)
-- Query Time: <10ms
```

**3. Component Reuse (keine neuen Bundles)**
- `SkillsSection`, `ProjectsSection`, `ExperienceSection` aus Epic 3 wiederverwendet
- Nur neue Components: `PersonalizedMessageBanner`, `ContactSection`
- Geschätzte Bundle-Size-Zunahme: +15KB (gzipped)
- Total Bundle für `/invite/:token`: ~215KB (noch unter 250KB Limit)

**4. TanStack Query Caching (wie Epic 3)**
```typescript
export function useInviteValidation(token: string) {
  return useQuery({
    queryKey: inviteQueryKeys.validation(token),
    queryFn: () => fetchInviteValidation(token),
    staleTime: 5 * 60 * 1000,  // 5 min
    gcTime: 10 * 60 * 1000,    // 10 min
  });
}

// Bei Repeat Visits: Cache Hit → 0ms API-Call
```

**5. SSR für personalisierte Route**
```typescript
// /invite/:token nutzt SSR (wie / in Epic 3)
export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => { /* ... */ },
  ssr: true, // Server-Side Rendering
});

// Benefit:
// - FCP <1.5s (HTML sofort sichtbar)
// - SEO Meta-Tags korrekt (noindex, nofollow)
```

**Performance-Monitoring:**

**Lighthouse CI (erweitert):**
```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI - Personalized Route
  run: |
    # Create test invite link
    TOKEN=$(curl -X POST http://localhost:3000/api/admin/invite \
      -H "Cookie: test-session" \
      -d '{}' | jq -r '.token')

    # Test personalized route
    lhci autorun --url="http://localhost:5173/invite/$TOKEN"
```

**Expected Results:**
- Performance: >90
- FCP: <1.5s
- LCP: <2.5s
- CLS: <0.1

**Performance-Regression-Prevention:**
- Lighthouse CI fails wenn Score <90
- Bundle-Size-Tracking in CI (vite-bundle-analyzer)
- Alert wenn `/invite` Route >250KB (gzipped)

### Security

Epic 4 führt neue Security-Anforderungen ein: Token-basierte Zugriffskontrolle, DSGVO-konforme Statistiken und Schutz vor Token-Enumeration-Attacken.

**Security-Anforderungen:**

**1. Token-Sicherheit (CUID2)**

```typescript
import { createId } from '@paralleldrive/cuid2';

// Token-Generierung
const token = createId(); // 25 chars, URL-safe

// Properties:
// - Kryptografisch sicher (verwendet crypto.getRandomValues)
// - Kollisionsresistent (4 quadrillion unique IDs)
// - URL-safe (keine special chars)
// - Nicht errätbar (brute-force unmöglich)
```

**Token-Space-Analyse:**
- CUID2 = 25 Zeichen
- Character-Set = 36 (a-z + 0-9)
- Mögliche Kombinationen = 36^25 ≈ 10^38
- Brute-Force-Unmöglichkeit: Bei 1 Mio Versuchen/Sekunde → 10^25 Jahre

**2. Rate-Limiting (Schutz vor Token-Enumeration)**

```typescript
// NestJS Throttler Configuration
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'public-endpoints',
          ttl: 60000,  // 1 minute
          limit: 100,  // 100 requests per minute per IP
        },
        {
          name: 'admin-endpoints',
          ttl: 60000,
          limit: 50,   // 50 requests per minute per session
        },
      ],
    }),
  ],
})
export class AppModule {}

// Apply to Invite Endpoints
@Controller('invite')
@UseGuards(ThrottlerGuard)
export class InviteController {
  @Get(':token')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async validateToken(@Param('token') token: string) {
    // ...
  }
}
```

**Schutz vor Token-Enumeration:**
- 100 requests/minute = max 6000 Tokens/Stunde testbar
- Bei 10^38 möglichen Tokens → Unmöglich alle zu testen
- Response-Time-Konstanz (verhindert Timing-Attacks):
  ```typescript
  // Invalid token → Return sofort (nicht "token existiert nicht")
  // Valid token → Return mit konstanter Delay
  // Beide Cases: ~100ms Response-Time (prevent timing attacks)
  ```

**3. Privacy-First Statistiken (DSGVO-konform)**

```typescript
// Was wird NICHT gespeichert:
// - IP-Adressen (weder in DB noch Logs)
// - User-Agent Strings (nur temporär für Rate-Limiting)
// - Referrer-URLs
// - Geografische Daten
// - Device-Fingerprints

// Was wird gespeichert (anonymisiert):
interface InviteStatistics {
  visitCount: number;      // Nur Counter
  lastVisitAt: Date;       // Nur Timestamp (kein User-Identifier)
}

// DSGVO-Compliance:
// - Art. 6 (1) lit. f DSGVO: Berechtigtes Interesse (eigene Statistik)
// - Art. 25 DSGVO: Privacy by Design
// - Keine personenbezogenen Daten (keine IP, keine Cookies außer Admin-Session)
```

**4. Input-Validation (XSS/Injection-Prevention)**

```typescript
// Zod Validation (Server-Side)
const CreateInviteDtoSchema = z.object({
  personalizedMessage: z.string()
    .max(5000)
    .transform(sanitizeMarkdown), // Strip dangerous HTML
  expiresAt: z.coerce.date()
    .min(new Date())
    .optional(),
});

// Markdown-Sanitization (DOMPurify)
import DOMPurify from 'isomorphic-dompurify';

function sanitizeMarkdown(markdown: string): string {
  // Allow: Bold, Italic, Links, Lists
  // Deny: <script>, <iframe>, onclick, etc.
  return DOMPurify.sanitize(markdown, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}
```

**5. SQL-Injection-Prevention (TypeORM)**

```typescript
// TypeORM verwendet Prepared Statements (automatisch)
const invite = await this.inviteRepository.findOne({
  where: { token },  // Parameterized query
});

// Generierte Query (Safe):
// SELECT * FROM invite WHERE token = ? -- Bound parameter, not string concatenation
```

**6. Content Security Policy (CSP) für /invite/:token**

```typescript
// Helmet Configuration (Epic 1 Foundation, erweitert)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // TanStack Router inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],  // Tailwind inline styles
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"], // API calls nur zu eigenem Backend
      frameSrc: ["'none'"],   // No iframes (prevent clickjacking)
    },
  },
}));
```

**7. Token-Revocation (Admin-Control)**

```typescript
// Admin kann Link deaktivieren (Epic 5)
PUT /api/admin/invite/:id
{
  isActive: false
}

// Effect:
// - Sofortige Invalidierung (nächster Zugriff → 401 Unauthorized)
// - Keine "Token-Löschung" (Audit-Trail bleibt erhalten)
// - Kann reaktiviert werden (isActive: true)
```

**8. HTTPS-Only (Epic 7 Deployment)**

```nginx
# Nginx Configuration
server {
  listen 80;
  server_name cv-hub.com;
  return 301 https://$server_name$request_uri; # Force HTTPS
}

server {
  listen 443 ssl http2;
  server_name cv-hub.com;

  ssl_certificate /etc/letsencrypt/live/cv-hub.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/cv-hub.com/privkey.pem;

  # HSTS Header (1 year)
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
}
```

**9. Session-Security (Admin-Auth, Epic 5 vorbereitet)**

```typescript
// Admin-Session-Cookie (Epic 5)
app.use(session({
  secret: process.env.SESSION_SECRET, // 32+ chars random string
  name: 'cv.sid',                      // Custom name (nicht "connect.sid")
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,   // No JavaScript access
    secure: true,     // HTTPS only
    sameSite: 'lax',  // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
```

**Security-Testing:**

**OWASP ZAP Scan (automated in CI):**
```yaml
# .github/workflows/security.yml
- name: OWASP ZAP Scan
  run: |
    docker run -t owasp/zap2docker-stable zap-baseline.py \
      -t http://localhost:5173/invite/test-token \
      -r zap-report.html
```

**npm audit (dependency vulnerabilities):**
```bash
pnpm audit
# Fail CI if critical vulnerabilities found
```

**Security-Checklist:**
- ✅ Token-Generation kryptografisch sicher (CUID2)
- ✅ Rate-Limiting gegen Token-Enumeration
- ✅ DSGVO-konforme Statistiken (keine IPs)
- ✅ Input-Validation (Zod + DOMPurify)
- ✅ SQL-Injection-Prevention (TypeORM Prepared Statements)
- ✅ XSS-Prevention (CSP + Sanitization)
- ✅ HTTPS-Only (Nginx + HSTS)
- ✅ Clickjacking-Protection (CSP frame-src: none)
- ✅ Token-Revocation möglich (isActive flag)

### Reliability/Availability

Epic 4 erbt die Reliability-Strategien aus Epic 3 und erweitert sie für Token-basierte Zugriffe.

**Availability-Target:** 99.9% Uptime (max. 43 min Downtime/Monat)

**Error-Handling-Strategien:**

**1. Token-Validation Errors (Graceful Degradation)**
```typescript
// Frontend ErrorBoundary (TanStack Router)
export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => {
    try {
      const [validation, cv] = await Promise.all([
        fetchInviteValidation(params.token),
        fetchPrivateCV(params.token),
      ]);

      if (!validation.isValid) {
        throw new Error(`Invalid invite: ${validation.reason}`);
      }

      return { validation, cv };
    } catch (error) {
      // Error caught by errorComponent
      throw error;
    }
  },
  errorComponent: InviteErrorPage,
});

// Error-Specific UI
function InviteErrorPage({ error }: { error: Error }) {
  if (error.message.includes('expired')) {
    return <ExpiredLinkPage />;  // CTA: Kontakt aufnehmen
  }

  if (error.message.includes('inactive')) {
    return <InvalidLinkPage />;  // CTA: Zur Startseite
  }

  if (error.message.includes('not_found')) {
    return <NotFoundPage />;
  }

  return <GenericErrorPage />;   // CTA: Reload oder Support
}
```

**2. Database Resilience (SQLite)**
```typescript
// TypeORM Connection with Retry
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/cv-hub.db',
      retryAttempts: 3,
      retryDelay: 1000,
      autoLoadEntities: true,
    }),
  ],
})
```

**3. API Retry-Logic (TanStack Query)**
```typescript
export function usePrivateCV(token: string) {
  return useQuery({
    queryKey: inviteQueryKeys.privateCV(token),
    queryFn: () => fetchPrivateCV(token),
    retry: 2,  // Retry 2x bei Netzwerkfehlern
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    // 1. Retry: 1s delay
    // 2. Retry: 2s delay
  });
}
```

**4. Monitoring & Alerting (Epic 7 - vorbereitet)**
- Uptime-Monitoring (Better Uptime, UptimeRobot)
- Error-Rate-Tracking (Sentry)
- Alert wenn Error-Rate >1%
- Alert wenn Uptime <99.9%

**Disaster-Recovery:**
- SQLite-Backups täglich (cron job)
- Backup-Strategie: 7 Daily, 4 Weekly, 12 Monthly
- Recovery-Time-Objective (RTO): <1 Stunde
- Recovery-Point-Objective (RPO): <24 Stunden

### Observability

Epic 4 erweitert Logging um Token-Validierung und Besuchsstatistiken.

**Logging-Strategie (Pino - Epic 1 Foundation):**

**Backend Logging:**
```typescript
// Invite Service Logging
@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);

  async validateToken(token: string): Promise<InviteValidationResponse> {
    this.logger.log({
      action: 'validate_token',
      token: token.substring(0, 5) + '***', // Partial token (privacy)
    });

    const invite = await this.inviteRepository.findOne({ where: { token } });

    if (!invite) {
      this.logger.warn({
        action: 'validate_token_failed',
        reason: 'not_found',
        token: token.substring(0, 5) + '***',
      });
      return { isValid: false, reason: 'not_found', personalizedMessage: null };
    }

    // ... validation logic

    this.logger.log({
      action: 'validate_token_success',
      inviteId: invite.id,
      visitCount: invite.visitCount,
    });

    return { isValid: true, personalizedMessage: invite.personalizedMessage };
  }
}
```

**Strukturierte Logs (JSON-Format):**
```json
{
  "level": "info",
  "time": "2025-11-05T10:30:00.000Z",
  "pid": 1234,
  "hostname": "cv-hub-server",
  "context": "InviteService",
  "action": "validate_token_success",
  "inviteId": 42,
  "visitCount": 3,
  "msg": "Token validated successfully"
}
```

**Metrics-Tracking:**
- Token-Validierungs-Rate (valid vs invalid)
- Durchschnittliche visitCount pro Link
- Anzahl aktiver Links
- API-Response-Times (GET /api/invite/:token, GET /api/cv/private/:token)

**Observability-Dashboard (Optional, Growth):**
- Grafana Dashboard mit Pino-Logs (Loki)
- Prometheus Metrics
- Request-Latency-Histogramme
- Error-Rate-Graphs

## Dependencies and Integrations

**Epic Dependencies (Blocking):**

| Dependency | Type | Status | Details |
|------------|------|--------|---------|
| **Epic 1: Foundation** | Blocking | ✅ Done | NestJS Setup, TypeORM, Security Headers (Helmet), Rate-Limiting |
| **Epic 2: CV Data** | Blocking | ✅ Done | CV-Entity, Privacy-Filtering (`getCV(context)`), JSON Resume Schema |
| **Epic 3: Frontend** | Blocking | ✅ Done | TanStack Start SSR, shadcn/ui Components, TanStack Query, Public Route |

**Epic 4 kann erst starten, wenn Epic 1-3 vollständig abgeschlossen sind.**

**Integration Points:**

**1. CVService Extension (Epic 2)**
```typescript
// Epic 2 (Bestehend):
class CVService {
  getCV(context: 'public'): Promise<PublicCV>;
}

// Epic 4 (Erweitert):
class CVService {
  getCV(context: 'public' | 'authenticated'): Promise<PublicCV | PrivateCV>;
}
```

**2. Component Extension (Epic 3)**
```typescript
// Epic 3 (Bestehend):
interface SkillsSectionProps {
  skills: Skill[];
}

// Epic 4 (Erweitert):
interface SkillsSectionProps {
  skills: Skill[];
  variant?: 'public' | 'authenticated'; // NEU
}
```

**3. Shared Types Package (Epic 2)**
```typescript
// packages/shared-types/src/index.ts

// Epic 2 (Bestehend):
export * from './cv.schema';

// Epic 4 (Erweitert):
export * from './cv.schema';
export * from './invite.schema'; // NEU
```

**External Dependencies (npm packages):**

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@paralleldrive/cuid2` | Latest | CUID2 Token-Generierung | MIT |
| `react-markdown` | v10 | Markdown-Rendering (personalisierte Nachricht) | MIT |
| `isomorphic-dompurify` | Latest | XSS-Prevention (Markdown-Sanitization) | MPL-2.0/Apache-2.0 |

**Integration mit Epic 5 (Admin-Dashboard - vorbereitet):**
- `POST /api/admin/invite` verwendet `AdminAuthGuard` (Epic 5)
- Admin-UI konsumiert InviteController-Endpoints
- Epic 4 stellt Backend bereit, Epic 5 nutzt es

**No External Service Dependencies:**
- Kein Email-Service (Links manuell teilen)
- Keine Third-Party-Analytics
- Keine CDN (Nginx served static assets)

## Acceptance Criteria (Authoritative)

Epic 4 ist erfolgreich abgeschlossen, wenn alle folgenden Kriterien erfüllt sind:

**Backend:**

- ✅ **AC-4.1**: CUID2-Token-Generierung implementiert (25 Zeichen, URL-safe, kryptografisch sicher)
- ✅ **AC-4.2**: `InviteEntity` mit TypeORM erstellt (alle spezifizierten Felder inkl. Indexes)
- ✅ **AC-4.3**: Database-Migration für `invite` Tabelle ausgeführt (SQLite)
- ✅ **AC-4.4**: `POST /api/admin/invite` Endpoint implementiert mit Zod-Validation
- ✅ **AC-4.5**: `GET /api/invite/:token` Endpoint implementiert mit Token-Validierung
- ✅ **AC-4.6**: `GET /api/cv/private/:token` Endpoint implementiert mit TokenValidationGuard
- ✅ **AC-4.7**: Besuchsstatistik-Tracking funktioniert (`visitCount++`, `lastVisitAt` update)
- ✅ **AC-4.8**: Rate-Limiting auf allen Invite-Endpoints (100 req/min für public, 50 req/min für admin)
- ✅ **AC-4.9**: `CVService.getCV('authenticated')` liefert vollständigen CV ohne Privacy-Filtering
- ✅ **AC-4.10**: Markdown-Sanitization verhindert XSS (DOMPurify)

**Frontend:**

- ✅ **AC-4.11**: Route `/invite/:token` mit TanStack Router erstellt
- ✅ **AC-4.12**: SSR-Loader fetched Token-Validation + CV parallel (<150ms)
- ✅ **AC-4.13**: `PersonalizedCVPage` Component rendert vollständigen CV
- ✅ **AC-4.14**: `PersonalizedMessageBanner` zeigt Markdown-Message (falls vorhanden)
- ✅ **AC-4.15**: `ContactSection` zeigt Email, Phone, Location (nur authenticated)
- ✅ **AC-4.16**: Bestehende Components (`SkillsSection`, `ProjectsSection`, `ExperienceSection`) unterstützen `variant` prop
- ✅ **AC-4.17**: `variant="authenticated"` zeigt echte Company-Namen, Metriken, Skill-Levels
- ✅ **AC-4.18**: Error-Pages für expired/inactive/not_found Tokens implementiert
- ✅ **AC-4.19**: Meta-Tags korrekt: `noindex, nofollow` für /invite/:token
- ✅ **AC-4.20**: TanStack Query Hooks (`useInviteValidation`, `usePrivateCV`) implementiert

**Performance:**

- ✅ **AC-4.21**: Lighthouse Performance Score >90 für `/invite/:token`
- ✅ **AC-4.22**: First Contentful Paint (FCP) <1.5s
- ✅ **AC-4.23**: Bundle-Size für `/invite` Route <250KB (gzipped)
- ✅ **AC-4.24**: Parallel API-Fetches im SSR-Loader (validation + cv)

**Security:**

- ✅ **AC-4.25**: CUID2-Tokens sind URL-safe und kollisionsfrei
- ✅ **AC-4.26**: Keine IP-Adressen in Datenbank gespeichert (DSGVO-konform)
- ✅ **AC-4.27**: Markdown-Sanitization verhindert <script>, <iframe>, onclick
- ✅ **AC-4.28**: Token-Revocation funktioniert (isActive: false → 401 Unauthorized)
- ✅ **AC-4.29**: Rate-Limiting verhindert Token-Enumeration-Attacken

**Testing:**

- ✅ **AC-4.30**: Unit-Tests für `InviteService` (Token-Generierung, Validation, Tracking)
- ✅ **AC-4.31**: Integration-Tests für alle 3 Endpoints (POST /admin/invite, GET /invite/:token, GET /cv/private/:token)
- ✅ **AC-4.32**: E2E-Test: Admin erstellt Link → Viewer öffnet Link → sieht vollständigen CV
- ✅ **AC-4.33**: E2E-Test: Expired Token → ExpiredLinkPage angezeigt
- ✅ **AC-4.34**: E2E-Test: Inactive Token → InvalidLinkPage angezeigt
- ✅ **AC-4.35**: Security-Test: XSS in personalizedMessage wird sanitized

**Documentation:**

- ✅ **AC-4.36**: API-Endpoints in Swagger dokumentiert (OpenAPI 3.0)
- ✅ **AC-4.37**: Component-Storybook für `PersonalizedMessageBanner`, `ContactSection`
- ✅ **AC-4.38**: README.md aktualisiert mit Token-System-Erklärung

## Traceability Mapping

**PRD → Epic 4 → Stories (Framework):**

| PRD Requirement | Epic 4 Feature | Acceptance Criteria | Story (Epic 5) |
|-----------------|----------------|---------------------|----------------|
| **F1.1**: Privacy-First Token-System | Token-Generierung (CUID2) | AC-4.1, AC-4.2, AC-4.25 | Story 4.1 |
| **F1.2**: Personalisierte Links | POST /api/admin/invite | AC-4.4, AC-4.10 | Story 4.1 |
| **F1.3**: Granulare Zugriffskontrolle | Token-Validierung | AC-4.5, AC-4.6, AC-4.28 | Story 4.2 |
| **F1.4**: Vollständiger CV für Token-Holder | GET /cv/private/:token | AC-4.6, AC-4.9, AC-4.17 | Story 4.3 |
| **F1.5**: Besuchsstatistiken (anonymisiert) | visitCount, lastVisitAt Tracking | AC-4.7, AC-4.26 | Story 4.2 |
| **F2.1**: Personalisierte Nachricht | personalizedMessage Field + Banner | AC-4.14, AC-4.27 | Story 4.4 |
| **F2.2**: Link-Ablaufdatum | expiresAt Field + Validation | AC-4.5, AC-4.33 | Story 4.2 |
| **NF1**: Performance >90 Lighthouse | SSR + Parallel Fetches | AC-4.21, AC-4.22, AC-4.24 | Story 4.3, 4.4 |
| **NF2**: DSGVO-Konformität | Keine IP-Speicherung | AC-4.26 | Story 4.2 |
| **NF3**: Security (Rate-Limiting) | NestJS Throttler | AC-4.8, AC-4.29 | Story 4.1, 4.2 |

**Epic 4 Story Breakdown (Vorschlag):**

- **Story 4.1**: Backend - Token-System & Link-Erstellung (InviteEntity, POST /admin/invite)
- **Story 4.2**: Backend - Token-Validierung & Statistik-Tracking (GET /invite/:token, visitCount)
- **Story 4.3**: Backend - Private CV-Zugriff (GET /cv/private/:token, TokenValidationGuard)
- **Story 4.4**: Frontend - Personalisierte CV-Ansicht (/invite/:token Route, Components)
- **Story 4.5**: Frontend - Component-Variants (variant prop, ContactSection)
- **Story 4.6**: Testing & Security (E2E-Tests, XSS-Prevention, Rate-Limiting)

## Risks, Assumptions, Open Questions

**Risks:**

| Risk | Wahrscheinlichkeit | Impact | Mitigation |
|------|-------------------|--------|------------|
| **R1**: Token-Enumeration trotz Rate-Limiting | Niedrig | Hoch | CUID2 = 10^38 Kombinationen, brute-force praktisch unmöglich |
| **R2**: SQLite Performance-Bottleneck bei vielen Links | Niedrig | Mittel | Indexes auf `token` + `isActive`, Migration zu PostgreSQL wenn >10k Links |
| **R3**: Markdown-XSS trotz DOMPurify | Sehr niedrig | Hoch | DOMPurify battle-tested, regelmäßige Updates, OWASP ZAP Scans in CI |
| **R4**: Admin-Auth nicht bereit (Epic 5 Delay) | Mittel | Niedrig | POST /admin/invite temporär ohne Auth (nur in Dev), Epic 5 fügt Guard hinzu |
| **R5**: Bundle-Size >250KB durch neue Route | Niedrig | Niedrig | Code-Splitting, Component-Reuse, Bundle-Analyzer in CI |

**Assumptions:**

- **A1**: Epic 1-3 sind vollständig abgeschlossen (Foundation, CV Data, Frontend)
- **A2**: Admin-Auth (Epic 5) kann später hinzugefügt werden (POST /admin/invite zunächst ungeschützt in Dev)
- **A3**: SQLite reicht für <1000 Links (Migration zu PostgreSQL später möglich)
- **A4**: Viewer teilen Links manuell (kein Email-Service benötigt)
- **A5**: Personalisierte Nachrichten sind <5000 Zeichen (Markdown-kompatibel)
- **A6**: Keine Real-Time-Statistiken nötig (5min staleTime akzeptabel)
- **A7**: HTTPS ist in Produktion verfügbar (Epic 7 Deployment)

**Open Questions:**

| Question | Owner | Status | Resolution |
|----------|-------|--------|------------|
| **Q1**: Soll personalizedMessage Markdown-Preview im Admin-UI haben? | Epic 5 (Dashboard) | Open | Entscheidung in Epic 5, Epic 4 stellt Backend bereit |
| **Q2**: Sollen Links editierbar sein (Message/Expiry ändern)? | Product | Open | Für MVP: Nein (create-only), Growth-Feature: PUT /admin/invite/:id |
| **Q3**: Soll QR-Code-Generierung Teil von Epic 4 sein? | Product | Open | Für MVP: Nein (Client-Side mit qrcode.js in Epic 5), Epic 4 nur URL |
| **Q4**: Maximale Anzahl Links pro User? | Product | Open | Für MVP: Unbegrenzt (single-user), Multi-Tenant (Epic 8+) setzt Limit |
| **Q5**: Soll Token-Format konfigurierbar sein (Länge, Charset)? | Tech Lead | Closed | Nein, CUID2-Standard (25 chars) ist fix |
| **Q6**: Brauchen wir Link-Kategorien/Tags? | Product | Open | Growth-Feature, nicht für MVP |

## Test Strategy Summary

Epic 4 nutzt 4 Test-Ebenen: Unit, Integration, E2E und Security-Tests.

**Test-Coverage-Ziele:**
- Backend: >80% Code Coverage
- Frontend: >70% Code Coverage
- Critical Paths (Token-Validation, CV-Access): 100%

**Test-Ebenen:**

**1. Unit-Tests (Backend)**

```typescript
// InviteService.spec.ts
describe('InviteService', () => {
  describe('createInvite', () => {
    it('should generate CUID2 token with 25 chars', async () => {
      const dto = { personalizedMessage: 'Test' };
      const result = await service.createInvite(dto);
      expect(result.token).toHaveLength(25);
      expect(result.token).toMatch(/^[a-z0-9]+$/);
    });

    it('should reject expiresAt in the past', async () => {
      const dto = { expiresAt: new Date('2020-01-01') };
      await expect(service.createInvite(dto)).rejects.toThrow();
    });
  });

  describe('validateToken', () => {
    it('should return valid for active token', async () => {
      const invite = createTestInvite({ isActive: true });
      const result = await service.validateToken(invite.token);
      expect(result.isValid).toBe(true);
    });

    it('should increment visitCount on valid token', async () => {
      const invite = createTestInvite({ visitCount: 5 });
      await service.validateToken(invite.token);
      expect(invite.visitCount).toBe(6);
    });

    it('should return invalid for expired token', async () => {
      const invite = createTestInvite({ expiresAt: new Date('2020-01-01') });
      const result = await service.validateToken(invite.token);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('expired');
    });
  });
});
```

**2. Integration-Tests (Backend API)**

```typescript
// invite.e2e-spec.ts
describe('InviteController (e2e)', () => {
  describe('POST /api/admin/invite', () => {
    it('should create invite and return token', () => {
      return request(app.getHttpServer())
        .post('/api/admin/invite')
        .send({ personalizedMessage: 'Hi!' })
        .expect(201)
        .expect(res => {
          expect(res.body.token).toHaveLength(25);
          expect(res.body.url).toContain('/invite/');
        });
    });

    it('should validate personalizedMessage max length', () => {
      return request(app.getHttpServer())
        .post('/api/admin/invite')
        .send({ personalizedMessage: 'a'.repeat(6000) })
        .expect(400);
    });
  });

  describe('GET /api/invite/:token', () => {
    it('should validate existing token', async () => {
      const invite = await createTestInvite();
      return request(app.getHttpServer())
        .get(`/api/invite/${invite.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body.isValid).toBe(true);
        });
    });

    it('should return not_found for invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/invite/invalid-token-123')
        .expect(200)
        .expect(res => {
          expect(res.body.isValid).toBe(false);
          expect(res.body.reason).toBe('not_found');
        });
    });
  });

  describe('GET /api/cv/private/:token', () => {
    it('should return full CV for valid token', async () => {
      const invite = await createTestInvite();
      return request(app.getHttpServer())
        .get(`/api/cv/private/${invite.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body.basics.email).toBeDefined(); // ✅ Private data
          expect(res.body.basics.phone).toBeDefined();
        });
    });

    it('should return 401 for expired token', async () => {
      const invite = await createTestInvite({ expiresAt: new Date('2020-01-01') });
      return request(app.getHttpServer())
        .get(`/api/cv/private/${invite.token}`)
        .expect(401);
    });
  });
});
```

**3. E2E-Tests (Frontend + Backend)**

```typescript
// invite.e2e.spec.ts (Playwright)
test.describe('Personalized Link Flow', () => {
  test('should show personalized CV with contact info', async ({ page }) => {
    // Setup: Create invite link via API
    const response = await fetch('http://localhost:3000/api/admin/invite', {
      method: 'POST',
      body: JSON.stringify({ personalizedMessage: 'Hi Ruben!' }),
    });
    const { token } = await response.json();

    // Navigate to personalized link
    await page.goto(`http://localhost:5173/invite/${token}`);

    // Assertions
    await expect(page.locator('text=Hi Ruben!')).toBeVisible(); // Message banner
    await expect(page.locator('text=ruben@example.com')).toBeVisible(); // Email
    await expect(page.locator('text=+49 123 456789')).toBeVisible(); // Phone
    await expect(page.locator('text=Google Inc.')).toBeVisible(); // Real company (not "Confidential")
  });

  test('should show expired page for expired token', async ({ page }) => {
    const invite = await createTestInvite({ expiresAt: new Date('2020-01-01') });
    await page.goto(`http://localhost:5173/invite/${invite.token}`);
    await expect(page.locator('text=Dieser Link ist abgelaufen')).toBeVisible();
  });

  test('should track visit count', async ({ page }) => {
    const invite = await createTestInvite({ visitCount: 0 });
    await page.goto(`http://localhost:5173/invite/${invite.token}`);
    await page.waitForLoadState('networkidle');

    // Check DB
    const updated = await getInviteFromDB(invite.token);
    expect(updated.visitCount).toBe(1);
  });
});
```

**4. Security-Tests**

```typescript
// security.spec.ts
describe('Security Tests', () => {
  it('should sanitize XSS in personalizedMessage', async () => {
    const xssPayload = '<script>alert("XSS")</script>Hi!';
    const invite = await service.createInvite({ personalizedMessage: xssPayload });

    expect(invite.personalizedMessage).not.toContain('<script>');
    expect(invite.personalizedMessage).toBe('Hi!'); // Script stripped
  });

  it('should prevent SQL injection in token lookup', async () => {
    const sqlInjection = "' OR '1'='1";
    const result = await service.validateToken(sqlInjection);

    expect(result.isValid).toBe(false); // Not valid (safe query)
  });

  it('should enforce rate limiting on /api/invite/:token', async () => {
    const requests = Array(101).fill(null).map(() =>
      request(app.getHttpServer()).get('/api/invite/test-token')
    );

    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.status === 429);

    expect(tooManyRequests.length).toBeGreaterThan(0); // Some requests blocked
  });
});
```

**Test-Ausführung in CI/CD:**

```yaml
# .github/workflows/test.yml
name: Test Epic 4
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Unit Tests (Backend)
        run: pnpm --filter backend test

      - name: Integration Tests (Backend)
        run: pnpm --filter backend test:e2e

      - name: E2E Tests (Frontend + Backend)
        run: |
          pnpm --filter backend start:dev &
          pnpm --filter frontend start &
          sleep 10
          pnpm --filter frontend test:e2e

      - name: Security Scan (OWASP ZAP)
        run: |
          docker run -t owasp/zap2docker-stable zap-baseline.py \
            -t http://localhost:5173 \
            -r zap-report.html

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

**Manual Testing-Checklist:**

- [ ] Link erstellen mit personalizedMessage → Nachricht sichtbar in /invite/:token
- [ ] Link erstellen mit expiresAt → Nach Ablauf → ExpiredLinkPage
- [ ] Link deaktivieren (isActive: false) → InvalidLinkPage
- [ ] Repeat Visit → visitCount inkrement, lastVisitAt update
- [ ] Lighthouse-Test auf /invite/:token → Score >90
- [ ] XSS-Payload in Message → wird sanitized
- [ ] 101 Requests in 1 Minute → Rate-Limit greift
