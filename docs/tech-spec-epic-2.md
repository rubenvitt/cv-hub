# Epic Technical Specification: CV Data Foundation

Date: 2025-11-04
Author: Ruben
Epic ID: 2
Status: Draft

---

## Overview

Epic 2 etabliert das Herzstück von cv-hub: die strukturierte CV-Datenarchitektur mit Privacy-by-Design. Dieses Epic implementiert das JSON Resume Schema als Single Source of Truth für alle CV-Daten und schafft die API-Schicht, die öffentliche von privaten Daten trennt.

Das Besondere an dieser Epic: Die Privacy-Logik ist nicht nachträglich hinzugefügt, sondern von Anfang an in die Architektur eingebaut. Jedes Datenfeld im CV kann als "öffentlich" oder "privat" markiert werden, und die API-Endpoints filtern automatisch basierend auf dem Zugriffs-Kontext (public vs. token-basiert).

Epic 2 baut auf Epic 1 (Foundation) auf und nutzt die bereits etablierte NestJS-Backend-Infrastruktur, TypeORM-Integration und Zod-Validierung. Die CV-Daten werden in SQLite gespeichert, mit automatischer Versionierung für Rollback-Support.

## Objectives and Scope

### In Scope

**JSON Resume Schema Integration:**
- Implementierung des JSON Resume Standards (https://jsonresume.org/schema)
- Zod-Schema-Definitionen in `packages/shared-types`
- Schema-Extensions für cv-hub-spezifische Felder (isPrivate, metrics)
- TypeScript-Type-Inferenz aus Zod-Schemas

**CV Data Models (TypeORM Entities):**
- `CV` Entity: Haupt-CV-Daten (Single Row für MVP)
- `CVVersion` Entity: Versionierung mit Timestamps und Rollback-Support
- Migrations für Datenbank-Schema
- Seed-Data für lokale Entwicklung

**API Endpoints:**
- `GET /api/cv/public` - Öffentliche CV-Daten (gefiltert)
- `GET /api/cv/private/:token` - Vollständiger CV nach Token-Validierung
- `PATCH /api/admin/cv` - CV-Update (Admin-only, Epic 5 vorbereitet)
- `GET /api/admin/cv/versions` - Versionshistorie (Admin-only)
- `POST /api/admin/cv/rollback/:versionId` - Rollback zu vorheriger Version

**Privacy-Filtering Logic:**
- Service-Layer-Methode `getCV(context: 'public' | 'authenticated')`
- Automatisches Filtern von Feldern mit `isPrivate: true`
- Redaction von sensiblen Daten (Firmennamen, Metriken, Kontaktdaten)
- Public Subset: Skills (ohne Level), Projekte (gefiltert), Erfahrung (generisch)

**Versionierung:**
- Automatisches Backup bei jedem CV-Update
- Versionshistorie mit Status (`active`, `archived`)
- Rollback-Funktionalität
- Timestamped Backups

**API-Dokumentation:**
- Swagger/OpenAPI 3.0 Integration
- Interaktive API-Docs unter `/api/docs`
- Auto-generierte DTOs aus Zod-Schemas

**Seed Data:**
- Beispiel-CV basierend auf JSON Resume Schema
- Automatisches Seeding in Development-Environment
- Dokumentation für eigene CV-Daten

### Out of Scope

- KI-Extraktion (Epic 6)
- Frontend-Darstellung (Epic 3)
- Token-Generierung und Link-Management (Epic 4)
- Admin-Authentication (Epic 5)
- Production-Deployment (Epic 7)
- Multi-Language-Support (Future)

## System Architecture Alignment

Dieses Epic implementiert die in der Architecture definierten Data-Layer-Entscheidungen:

**JSON Resume Schema as Single Source of Truth** (Architecture: Architecture Patterns → Pattern 3)
- Zod-Schema in `packages/shared-types/cv-schema.ts`
- Shared zwischen Frontend, Backend und KI-Extraktion (Epic 6)
- Extensions für cv-hub: `isPrivate`, `metrics`, `entity`
- Type-Safety Ende-zu-Ende

**Privacy-First Data Filtering** (Architecture: Architecture Patterns → Pattern 1)
- Dynamic filtering basierend auf Authentication-Context
- Server-side Filtering (keine privaten Daten im Client)
- Granulare Kontrolle pro Datenfeld
- DSGVO-konform

**TypeORM Entities** (Architecture: Backend Stack → Database & ORM)
- `CV` Entity mit JSON-Column für Schema-Flexibilität
- `CVVersion` Entity für Immutable History
- SQLite als Persistence-Layer
- Migrations für Schema-Evolution

**API-First Architecture** (Architecture: API Design)
- RESTful Endpoints wie spezifiziert
- Zod-Validation für alle API-Inputs
- Swagger-Docs automatisch generiert
- Rate-Limiting vorbereitet (Epic 4)

**Constraints Enforced:**
- TypeScript End-to-End (Shared Types Package)
- Zod für Runtime-Validation
- Privacy-by-Design (kein Opt-in, sondern Default)
- Versionierung für Auditability

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs | Outputs | Owner |
|----------------|------------------|--------|---------|-------|
| **CV Module** | Root-Modul für CV-Funktionalität | - | CVController, CVService, Entities | Backend |
| **CV Controller** | HTTP-Endpoints für CV-Zugriff | HTTP Requests, DTOs | JSON Responses (CV Data) | Backend |
| **CV Service** | Business Logic: Filtering, Versionierung | Context (public/auth), Update DTOs | Filtered CV, Versions | Backend |
| **CV Repository** | Database-Zugriff via TypeORM | Entities, Query Params | CV, CVVersion Entities | Backend |
| **CV Entity** | Haupt-CV-Daten (Single Row) | - | TypeORM Entity Mapping | Backend |
| **CVVersion Entity** | Versionierungs-History | - | TypeORM Entity Mapping | Backend |
| **Shared Types Package** | Zod-Schemas, TypeScript Types | - | CVSchema, Skill, Project, etc. | Shared |
| **Privacy Filter Service** | Public/Private Data Filtering | CV Data, Context | Filtered CV Subset | Backend |
| **Swagger Module** | API-Dokumentation | Controller Decorators | OpenAPI 3.0 Spec | Backend |

**Module Interactions:**

```
CV Controller
    │
    ├─► CV Service
    │   │
    │   ├─► Privacy Filter Service (für Public-Requests)
    │   │
    │   └─► CV Repository (TypeORM)
    │       │
    │       └─► SQLite DB
    │
    └─► Zod Validation Pipe (shared-types)
```

**Detailed Module Responsibilities:**

**1. CV Service (Business Logic)**
- `getCV(context: 'public' | 'authenticated')` - Main method für CV-Abruf
- `updateCV(updateDto: Partial<CV>)` - CV-Update mit automatischer Versionierung
- `getVersions(limit, offset)` - Versionshistorie abrufen
- `rollback(versionId)` - Rollback zu vorheriger Version
- Error Handling für nicht-existente Versions

**2. Privacy Filter Service**
- `filterPublicSubset(cv: CV)` - Entfernt private Felder
- `redactSensitiveData(cv: CV)` - Ersetzt Firmennamen, Kontaktdaten
- `shouldIncludeField(field, context)` - Field-level Visibility Check
- Immutable Operations (keine Mutation des Original-CV)

**3. CV Repository (TypeORM)**
- `findActiveCV()` - Lädt aktuellen CV (id=1)
- `saveVersion(cv, status)` - Erstellt neue Version
- `findVersions(limit, offset)` - Versionshistorie
- `findVersionById(id)` - Spezifische Version laden
- Transaction-Support für Atomic Updates

### Data Models and Contracts

**1. CV Entity (TypeORM)**

```typescript
// apps/backend/src/modules/cv/entities/cv.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('cv')
export class CVEntity {
  @PrimaryGeneratedColumn()
  id: number; // Always 1 for MVP (single user)

  @Column({ type: 'text' })
  data: string; // JSON string (CVSchema serialized)

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**2. CV Version Entity (TypeORM)**

```typescript
// apps/backend/src/modules/cv/entities/cv-version.entity.ts
@Entity('cv_versions')
export class CVVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cvId: number; // Foreign key to cv.id (always 1)

  @Column({ type: 'text' })
  data: string; // JSON string (snapshot)

  @Column({ type: 'varchar', length: 20 })
  status: 'draft' | 'active' | 'archived';

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: 'manual' | 'api-update' | 'ai-extraction' | 'rollback' | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  fileHash: string | null; // SHA-256 (für Deduplication bei KI-Extraktion)

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CVEntity)
  @JoinColumn({ name: 'cvId' })
  cv: CVEntity;
}
```

**3. JSON Resume Schema (Zod - Shared Types)**

```typescript
// packages/shared-types/src/cv-schema.ts
import { z } from 'zod';

export const BasicsSchema = z.object({
  name: z.string(),
  label: z.string(), // "Senior Full-Stack Engineer"
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: z.object({
    address: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    countryCode: z.string().optional(),
    region: z.string().optional(),
  }).optional(),
  profiles: z.array(z.object({
    network: z.string(), // "LinkedIn", "GitHub"
    username: z.string(),
    url: z.string().url(),
  })).optional(),
});

export const WorkSchema = z.object({
  name: z.string().optional(), // Company name
  position: z.string(),
  url: z.string().url().optional(),
  startDate: z.string(), // ISO 8601: YYYY-MM-DD
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  // cv-hub extension
  isPrivate: z.boolean().default(false),
});

export const EducationSchema = z.object({
  institution: z.string(),
  url: z.string().url().optional(),
  area: z.string().optional(), // "Computer Science"
  studyType: z.string().optional(), // "Bachelor"
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

export const SkillSchema = z.object({
  name: z.string(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  keywords: z.array(z.string()).optional(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  highlights: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(), // Tech stack
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string().url().optional(),
  roles: z.array(z.string()).optional(),
  entity: z.string().optional(), // Company/Organization
  type: z.string().optional(), // "application", "website", "library"
  // cv-hub extensions
  isPrivate: z.boolean().default(false),
  metrics: z.string().optional(), // "100K+ users, 25% conversion"
});

export const VolunteerSchema = z.object({
  organization: z.string(),
  position: z.string(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const CVSchema = z.object({
  basics: BasicsSchema,
  work: z.array(WorkSchema).optional(),
  volunteer: z.array(VolunteerSchema).optional(),
  education: z.array(EducationSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  // Additional JSON Resume fields (awards, publications, languages, interests, references)
  // können bei Bedarf erweitert werden
});

// TypeScript Types (inferred from Zod)
export type CV = z.infer<typeof CVSchema>;
export type Basics = z.infer<typeof BasicsSchema>;
export type Work = z.infer<typeof WorkSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Volunteer = z.infer<typeof VolunteerSchema>;
```

**4. DTOs (API Request/Response)**

```typescript
// modules/cv/dto/get-cv-response.dto.ts
export class GetCVResponseDto {
  success: boolean;
  data: CV;
}

// modules/cv/dto/update-cv.dto.ts
export class UpdateCVDto {
  cv: Partial<CV>; // Partial updates erlaubt
}

// modules/cv/dto/cv-version-response.dto.ts
export class CVVersionResponseDto {
  id: number;
  data: CV;
  status: 'draft' | 'active' | 'archived';
  source: string;
  createdAt: string; // ISO 8601
}
```

**5. Privacy-Filtered Subsets**

```typescript
// Privacy Filter Logic Output
interface PublicCVSubset {
  basics: Pick<Basics, 'name' | 'label' | 'summary'> & {
    location?: Pick<Location, 'city' | 'countryCode'>; // No address
    profiles?: Array<Pick<Profile, 'network' | 'url'>>; // No username
  };
  work?: Array<Omit<Work, 'name' | 'highlights'> & {
    name: 'Confidential'; // Redacted
    highlights: string[]; // Shortened to 3 items max
  }>;
  education?: Education[]; // Usually public
  skills?: Array<Pick<Skill, 'name' | 'keywords'>>; // No level
  projects?: Array<Project & { isPrivate: false }>; // Only public projects
  volunteer?: Volunteer[]; // Usually public
}
```

**Schema Evolution Strategy:**

- Zod-Schemas sind versioniert (future: `CVSchemaV2`)
- Database speichert JSON → Schema-Changes non-breaking
- Migration-Script für Schema-Upgrades (future)
- Backwards-compatibility via Zod `.optional()` defaults

### APIs and Interfaces

**API Endpoints (Epic 2)**

| Method | Path | Description | Request Body | Response | Auth | Rate Limit |
|--------|------|-------------|--------------|----------|------|------------|
| GET | `/api/cv/public` | Öffentliche CV-Daten | - | `GetCVResponseDto` | None | 100/15min |
| GET | `/api/cv/private/:token` | Vollständiger CV | - | `GetCVResponseDto` | Token (Epic 4) | 50/15min |
| PATCH | `/api/admin/cv` | CV aktualisieren | `UpdateCVDto` | `GetCVResponseDto` | Session (Epic 5) | 50/15min |
| GET | `/api/admin/cv/versions` | Versionshistorie | Query: `?limit=10&offset=0` | `CVVersionResponseDto[]` | Session | 50/15min |
| POST | `/api/admin/cv/rollback/:versionId` | Rollback zu Version | - | `GetCVResponseDto` | Session | 10/hour |

**Detailed API Specifications:**

**1. GET /api/cv/public**

```typescript
// Request
GET /api/cv/public
Headers:
  Accept: application/json

// Response 200 OK
{
  "success": true,
  "data": {
    "basics": {
      "name": "Max Mustermann",
      "label": "Senior Full-Stack Engineer",
      "summary": "Passionate about building scalable web applications...",
      "location": {
        "city": "Berlin",
        "countryCode": "DE"
      },
      "profiles": [
        { "network": "GitHub", "url": "https://github.com/maxmustermann" },
        { "network": "LinkedIn", "url": "https://linkedin.com/in/maxmustermann" }
      ]
    },
    "work": [
      {
        "name": "Confidential", // Redacted
        "position": "Senior Engineer",
        "startDate": "2020-01",
        "endDate": "2023-12",
        "summary": "Led development team...",
        "highlights": [
          "Architected microservices platform",
          "Improved deployment speed by 50%",
          "Mentored 5 junior developers"
        ] // Max 3 items
      }
    ],
    "education": [...],
    "skills": [
      { "name": "TypeScript", "keywords": ["Frontend", "Backend"] }
      // No level field
    ],
    "projects": [
      // Only projects with isPrivate: false
      {
        "name": "Open Source CLI Tool",
        "description": "...",
        "keywords": ["TypeScript", "Node.js"],
        "url": "https://github.com/..."
        // No entity, no metrics
      }
    ],
    "volunteer": [...]
  }
}

// Response 304 Not Modified (if cached)
Headers:
  ETag: "abc123"
  Cache-Control: public, max-age=300

// Response 500 Internal Server Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to load CV data"
  }
}
```

**2. GET /api/cv/private/:token**

```typescript
// Request
GET /api/cv/private/abc123def456
Headers:
  Accept: application/json

// Response 200 OK (Full CV Data)
{
  "success": true,
  "data": {
    "basics": {
      "name": "Max Mustermann",
      "label": "Senior Full-Stack Engineer",
      "email": "max@example.com", // ✓ Included
      "phone": "+49 123 456789",  // ✓ Included
      "location": {
        "address": "Musterstraße 123", // ✓ Included
        "postalCode": "10115",
        "city": "Berlin",
        "countryCode": "DE"
      }
    },
    "work": [
      {
        "name": "ACME Corp", // ✓ Real company name
        "position": "Senior Engineer",
        "highlights": [...] // ✓ Full list (not shortened)
      }
    ],
    "skills": [
      {
        "name": "TypeScript",
        "level": "Expert", // ✓ Included
        "keywords": [...]
      }
    ],
    "projects": [
      // ✓ Includes private projects
      {
        "name": "Internal Dashboard",
        "isPrivate": true,
        "entity": "ACME Corp",
        "metrics": "50K+ daily users, 99.9% uptime"
      }
    ]
  }
}

// Response 403 Forbidden (Invalid/Expired Token)
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token is invalid or expired"
  }
}
```

**3. PATCH /api/admin/cv**

```typescript
// Request
PATCH /api/admin/cv
Headers:
  Content-Type: application/json
  Cookie: session=xyz...
Body:
{
  "cv": {
    "skills": [
      { "name": "Go", "level": "Intermediate", "keywords": ["Backend"] }
    ] // Partial update - merges with existing
  }
}

// Response 200 OK
{
  "success": true,
  "data": {
    // Full updated CV
  },
  "message": "CV updated successfully. Previous version archived."
}

// Response 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Admin session required"
  }
}

// Response 400 Bad Request (Validation Error)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "skills.0.name",
        "issue": "Required"
      }
    ]
  }
}
```

**4. GET /api/admin/cv/versions**

```typescript
// Request
GET /api/admin/cv/versions?limit=10&offset=0
Headers:
  Cookie: session=xyz...

// Response 200 OK
{
  "success": true,
  "data": [
    {
      "id": 42,
      "status": "active",
      "source": "api-update",
      "createdAt": "2025-11-04T10:30:00Z",
      "data": { /* CV snapshot */ }
    },
    {
      "id": 41,
      "status": "archived",
      "source": "manual",
      "createdAt": "2025-11-03T15:20:00Z",
      "data": { /* CV snapshot */ }
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasNext": true
  }
}
```

**5. POST /api/admin/cv/rollback/:versionId**

```typescript
// Request
POST /api/admin/cv/rollback/41
Headers:
  Cookie: session=xyz...

// Response 200 OK
{
  "success": true,
  "data": { /* Restored CV */ },
  "message": "Successfully rolled back to version 41. Current version archived."
}

// Response 404 Not Found
{
  "success": false,
  "error": {
    "code": "VERSION_NOT_FOUND",
    "message": "Version 999 does not exist"
  }
}
```

**Swagger/OpenAPI Auto-Generated:**

```typescript
// Controller Decorators für Swagger
@Controller('api/cv')
@ApiTags('CV')
export class CVController {
  @Get('public')
  @ApiOperation({ summary: 'Get public CV data' })
  @ApiResponse({ status: 200, description: 'Public CV subset', type: GetCVResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error' })
  async getPublic(): Promise<GetCVResponseDto> { ... }

  @Get('private/:token')
  @ApiOperation({ summary: 'Get full CV with valid token' })
  @ApiParam({ name: 'token', description: 'Invite token' })
  @ApiResponse({ status: 200, description: 'Full CV data' })
  @ApiResponse({ status: 403, description: 'Invalid or expired token' })
  async getPrivate(@Param('token') token: string): Promise<GetCVResponseDto> { ... }
}
```

### Workflows and Sequencing

**1. Public CV Request Flow**

```
User → Frontend (SSR) → Backend /api/cv/public
                              │
                              ▼
                        CV Controller
                              │
                              ▼
                        CV Service.getCV('public')
                              │
                              ├─► Load CV from Database (TypeORM)
                              │   └─► SELECT * FROM cv WHERE id = 1
                              │
                              ▼
                        Privacy Filter Service.filterPublicSubset(cv)
                              │
                              ├─► Remove private fields:
                              │   - basics.email, basics.phone
                              │   - basics.location.address
                              │   - skills[].level
                              │   - projects where isPrivate=true
                              │   - work[].name → "Confidential"
                              │   - project.entity, project.metrics
                              │
                              ▼
                        Return filtered CV
                              │
                              ▼
                        Cache Response (5 min)
                              │
                              ▼
                        Frontend renders public view
```

**2. Authenticated CV Request Flow (Token-Based)**

```
User clicks /invite/:token → Frontend SSR
                                  │
                                  ▼
                            Backend /api/cv/private/:token
                                  │
                                  ▼
                            Invite Guard validates token
                                  │
                                  ├─► Check token exists in DB
                                  ├─► Check isActive = true
                                  ├─► Check expiresAt > now
                                  │
                                  ▼
                            [If Valid] → CV Controller
                                  │
                                  ▼
                            CV Service.getCV('authenticated')
                                  │
                                  ├─► Load CV from Database
                                  │   └─► SELECT * FROM cv WHERE id = 1
                                  │
                                  ▼
                            Return FULL CV (no filtering)
                                  │
                                  ▼
                            Async: Record visit
                                  ├─► UPDATE invites SET visitCount++
                                  └─► UPDATE invites SET lastVisitAt=now
                                  │
                                  ▼
                            Frontend renders personalized view
```

**3. CV Update Flow (Admin)**

```
Admin updates CV → Frontend sends PATCH /api/admin/cv
                            │
                            ▼
                      Admin Auth Guard (Session validation)
                            │
                            ▼
                      CV Controller.update(dto)
                            │
                            ▼
                      Zod Validation Pipe (CVSchema.parse)
                            │
                            ▼
                      CV Service.updateCV(dto)
                            │
                            ├─► Start Transaction
                            │
                            ├─► Archive current version:
                            │   INSERT INTO cv_versions (cvId, data, status, source)
                            │   VALUES (1, current_cv_json, 'archived', 'api-update')
                            │
                            ├─► Update main CV:
                            │   UPDATE cv SET data = new_cv_json WHERE id = 1
                            │
                            ├─► Commit Transaction
                            │
                            └─► Return updated CV
                                  │
                                  ▼
                            Frontend shows success toast
```

**4. Rollback Flow**

```
Admin clicks "Rollback to Version X"
        │
        ▼
POST /api/admin/cv/rollback/:versionId
        │
        ▼
CV Service.rollback(versionId)
        │
        ├─► Load version X from cv_versions
        │
        ├─► Start Transaction
        │
        ├─► Archive current CV:
        │   INSERT INTO cv_versions (cvId, data, status, source)
        │   VALUES (1, current_cv_json, 'archived', 'rollback')
        │
        ├─► Restore version X:
        │   UPDATE cv SET data = version_x_json WHERE id = 1
        │
        ├─► Commit Transaction
        │
        └─► Return restored CV
              │
              ▼
        Frontend reloads CV data
```

**5. Seed Data Init Flow (Development)**

```
npm run seed → Backend Script
        │
        ▼
Check if cv.id=1 exists
        │
        ├─► Exists → Skip seeding
        │
        └─► Not Exists:
              │
              ├─► Load example-cv.json
              │
              ├─► Validate against CVSchema
              │
              ├─► INSERT INTO cv (id, data) VALUES (1, cv_json)
              │
              └─► Log: "Seed data inserted"
```

**Sequence Diagrams (Textual)**

**Public CV Load:**
```
User -> Frontend: GET /
Frontend -> Backend: GET /api/cv/public
Backend -> Database: SELECT cv.data WHERE id=1
Database -> Backend: cv_json
Backend -> PrivacyFilter: filterPublicSubset(cv)
PrivacyFilter -> Backend: filtered_cv
Backend -> Frontend: JSON Response
Frontend -> User: Rendered Public CV Page
```

**Admin CV Update:**
```
Admin -> Frontend: Submit Update Form
Frontend -> Backend: PATCH /api/admin/cv
Backend -> Validator: Zod.parse(updateDto)
Validator -> Backend: Valid DTO
Backend -> Database: BEGIN TRANSACTION
Backend -> Database: INSERT cv_version (archived)
Backend -> Database: UPDATE cv SET data=new_cv
Backend -> Database: COMMIT
Database -> Backend: Success
Backend -> Frontend: Updated CV
Frontend -> Admin: Success Toast
```

## Non-Functional Requirements

### Performance

**API Response Time Targets:**

| Endpoint | Target (p95) | Rationale |
|----------|-------------|-----------|
| `GET /api/cv/public` | <100ms | Frequent access, cacheable, simple query |
| `GET /api/cv/private/:token` | <150ms | Token validation + DB query |
| `PATCH /api/admin/cv` | <300ms | Includes transaction (archive + update) |
| `GET /api/admin/cv/versions` | <200ms | Paginated, indexed query |
| `POST /api/admin/cv/rollback/:versionId` | <400ms | Transaction with 2 writes |

**Database Query Performance:**

- **CV Load:** Single row query by id=1 → <10ms (SQLite indexed primary key)
- **Version List:** Paginated query with LIMIT/OFFSET → <50ms
- **Version Insert:** Single INSERT → <20ms
- **CV Update:** Single UPDATE by id → <30ms

**Caching Strategy:**

```typescript
// Public CV - Cache 5 minutes
@UseInterceptors(CacheInterceptor)
@CacheTTL(300) // 5 minutes in seconds
@Get('public')
async getPublic() { ... }

// Cache Key: /api/cv/public
// Invalidation: On CV update (PATCH /api/admin/cv)
```

**Privacy Filter Performance:**

- Input: Full CV (~50KB JSON)
- Processing: Object filtering, field redaction
- Target: <10ms (in-memory operations)
- Optimization: Immutable operations (no deep cloning unless needed)

**Zod Validation Performance:**

- CV Schema validation: <50ms for full CV
- Partial update validation: <20ms
- Benchmarks based on Zod v3 performance (~100k validations/sec)

**Response Size Optimization:**

- Public CV: ~20KB JSON (gzipped: ~5KB)
- Full CV: ~50KB JSON (gzipped: ~15KB)
- Version list (10 items): ~500KB (snapshots included, acceptable for admin)

**Monitoring & Measurement:**

- Pino logger tracks response times per request
- Slow query threshold: >200ms logged as warning
- Performance baseline established in Epic 1 tests

### Security

**Privacy-by-Design Enforcement:**

1. **Server-Side Filtering Only:**
   - Private data NEVER sent to client in public context
   - Filtering happens in service layer before response serialization
   - Frontend cannot bypass filtering (no client-side logic)

2. **Field-Level Access Control:**
   ```typescript
   // Privacy Filter Logic
   const PRIVATE_FIELDS = {
     basics: ['email', 'phone', 'location.address', 'location.postalCode'],
     skills: ['level'],
     projects: ['entity', 'metrics'],
     work: ['name'] // Redacted to "Confidential"
   };
   ```

3. **Data Redaction Strategy:**
   - **Remove:** Email, phone, address (completely omitted)
   - **Redact:** Company names → "Confidential"
   - **Filter:** Projects with `isPrivate: true` → excluded
   - **Truncate:** Work highlights → max 3 items

**Input Validation:**

- **Zod Schema Validation:** All API inputs validated against CVSchema
- **SQL Injection:** TypeORM parameterized queries (no raw SQL)
- **XSS Prevention:** No HTML rendering (JSON API only), Frontend escapes in Epic 3
- **File Upload:** Not in Epic 2 (deferred to Epic 6)

**Authentication & Authorization:**

- **Public Endpoints:** No auth required (`GET /api/cv/public`)
- **Token Endpoints:** Invite token validation (Epic 4 dependency)
- **Admin Endpoints:** Session auth required (Epic 5 dependency)
- **Rate Limiting:** Configured in Epic 1, enforced per endpoint

**Data Storage Security:**

- **Passwords:** N/A for Epic 2 (Admin auth in Epic 5 uses Argon2)
- **Tokens:** N/A for Epic 2 (CUID2 tokens in Epic 4)
- **Database:** SQLite file permissions (600, root-only access in Docker)
- **Backups:** Encrypted at rest (Epic 7 production deployment)

**GDPR Compliance:**

- **Right to Access:** CV data exportable via admin API
- **Right to Erasure:** CV can be deleted (soft delete with versions)
- **Data Minimization:** Public API returns minimal subset
- **Purpose Limitation:** CV data only used for portfolio display
- **No Tracking:** No analytics in Epic 2 (deferred to Epic 7)

**Security Headers:**

- Configured in Epic 1 (Helmet)
- CSP, HSTS, X-Frame-Options already active
- No additional headers needed for Epic 2

**Audit Logging:**

- CV updates logged via Pino (who, when, what changed)
- Version history provides audit trail
- Admin actions logged with user context (Epic 5)

### Reliability/Availability

**Error Handling:**

1. **Database Errors:**
   ```typescript
   // CV Service error handling
   async getCV(context: string): Promise<CV> {
     try {
       const cvEntity = await this.cvRepository.findOne({ where: { id: 1 } });

       if (!cvEntity) {
         throw new NotFoundException('CV not found');
       }

       const cv = CVSchema.parse(JSON.parse(cvEntity.data));
       return context === 'public' ? this.privacyFilter.filter(cv) : cv;
     } catch (error) {
       if (error instanceof NotFoundException) {
         throw error; // Rethrow 404
       }
       if (error instanceof z.ZodError) {
         this.logger.error('CV data validation failed', error);
         throw new InternalServerErrorException('Invalid CV data');
       }
       this.logger.error('Failed to load CV', error);
       throw new InternalServerErrorException('Failed to load CV');
     }
   }
   ```

2. **Validation Errors:**
   - Zod validation errors → 400 Bad Request with field-level details
   - Malformed JSON → 400 Bad Request
   - Missing required fields → 400 Bad Request with error list

3. **Transaction Failures:**
   ```typescript
   // Rollback on error
   async updateCV(updateDto: Partial<CV>): Promise<CV> {
     const queryRunner = this.dataSource.createQueryRunner();
     await queryRunner.connect();
     await queryRunner.startTransaction();

     try {
       // Archive current version
       await queryRunner.manager.save(CVVersionEntity, { ... });

       // Update CV
       await queryRunner.manager.update(CVEntity, { id: 1 }, { ... });

       await queryRunner.commitTransaction();
       return updatedCV;
     } catch (error) {
       await queryRunner.rollbackTransaction();
       this.logger.error('CV update failed, transaction rolled back', error);
       throw new InternalServerErrorException('Failed to update CV');
     } finally {
       await queryRunner.release();
     }
   }
   ```

**Graceful Degradation:**

- **Cache Failure:** If cache unavailable, serve from DB directly (slower, but works)
- **Validation Failure:** Log error, return 500 (don't serve invalid data)
- **Privacy Filter Failure:** Fail closed (return error, not unfiltered data)

**Data Integrity:**

- **Versioning:** Every update creates backup before modifying
- **Atomic Updates:** Transactions ensure CV + Version consistency
- **Schema Validation:** Zod ensures data conforms to JSON Resume schema
- **Rollback Safety:** Archived versions immutable (no overwrite)

**Availability Targets:**

- **API Uptime:** 99.9% (inherits from Epic 1 backend uptime)
- **Database Availability:** 100% (SQLite file-based, no external dependency)
- **Recovery Time Objective (RTO):** <5 minutes (rollback to previous version)
- **Recovery Point Objective (RPO):** 0 (versions captured before update)

**Monitoring & Alerts:**

- **Health Check:** Existing `/api/health` endpoint checks DB connection
- **Error Rate:** Pino logs errors, reviewed manually (automated alerts in Epic 7)
- **Response Time:** Logged per request, threshold >500ms = warning

### Observability

**Structured Logging (Pino):**

```typescript
// Example log entries

// 1. CV Load (Public)
{
  "level": 30, // INFO
  "time": 1699012345678,
  "req": {
    "id": "req-uuid-123",
    "method": "GET",
    "url": "/api/cv/public"
  },
  "res": {
    "statusCode": 200
  },
  "responseTime": 45,
  "msg": "Public CV served from cache"
}

// 2. CV Update (Admin)
{
  "level": 30,
  "time": 1699012345678,
  "req": {
    "id": "req-uuid-456",
    "method": "PATCH",
    "url": "/api/admin/cv"
  },
  "userId": "admin-1", // Epic 5 context
  "cvVersionId": 42, // New version created
  "msg": "CV updated successfully, version 41 archived"
}

// 3. Validation Error
{
  "level": 40, // WARN
  "time": 1699012345678,
  "req": { "id": "req-uuid-789", "url": "/api/admin/cv" },
  "error": {
    "type": "ZodError",
    "issues": [
      { "field": "skills.0.name", "message": "Required" }
    ]
  },
  "msg": "CV validation failed"
}

// 4. Database Error
{
  "level": 50, // ERROR
  "time": 1699012345678,
  "req": { "id": "req-uuid-999", "url": "/api/cv/public" },
  "error": {
    "type": "QueryFailedError",
    "message": "SQLITE_BUSY: database is locked",
    "stack": "..."
  },
  "msg": "Failed to load CV from database"
}
```

**Log Levels:**

- **DEBUG (10):** Privacy filter operations, cache hits/misses
- **INFO (30):** Successful operations (CV loaded, updated, rolled back)
- **WARN (40):** Validation errors, slow queries (>200ms)
- **ERROR (50):** Database errors, transaction failures, unexpected exceptions

**Metrics Tracked (via Logs):**

- **Request Count:** Per endpoint, per status code
- **Response Time:** p50, p95, p99 (calculated from logs)
- **Error Rate:** 4xx vs 5xx per endpoint
- **Cache Hit Rate:** Cache hits vs misses for `/api/cv/public`
- **CV Update Frequency:** Count of PATCH requests per day/week

**Traceability:**

- **Request ID:** UUID per request, logged in all related operations
- **CV Version ID:** Logged on create/update/rollback
- **User Context:** Admin user ID logged (Epic 5)
- **Source Tracking:** Version `source` field (manual, api-update, rollback)

**Database Query Logging:**

```typescript
// TypeORM Query Logger (Development only)
{
  type: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  logger: 'advanced-console',
}

// Example logged query
{
  "level": 10, // DEBUG
  "query": "SELECT * FROM cv WHERE id = $1",
  "parameters": [1],
  "duration": 8,
  "msg": "Database query executed"
}
```

**Debugging Support:**

- **Error Stack Traces:** Full stack traces logged for 500 errors
- **Request Context:** All logs include request ID for correlation
- **Version Diffs:** Admin can compare versions via API (future enhancement)

**Production Observability (Epic 7):**

- Prometheus metrics export
- Grafana dashboards (response times, error rates, cache performance)
- Alerting on error rate spikes
- Log aggregation (Loki or similar)

## Dependencies and Integrations

**Epic Dependencies:**

| Epic | Dependency Type | Details |
|------|----------------|---------|
| **Epic 1** | **Hard Dependency (Must Complete First)** | NestJS backend, TypeORM setup, SQLite database, Pino logging, Zod validation infrastructure |
| **Epic 4** | **Soft Dependency (Forward Compatibility)** | Epic 2 API endpoint `/api/cv/private/:token` vorbereitet, aber ohne Token-Validation (placeholder Guard) |
| **Epic 5** | **Soft Dependency (Forward Compatibility)** | Admin endpoints implementiert, aber ohne Session-Auth (placeholder Guard) |

**NPM Package Dependencies:**

**Shared Types Package:**
```json
{
  "dependencies": {
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

**Backend (zusätzlich zu Epic 1):**
```json
{
  "dependencies": {
    "@nestjs/cache-manager": "^2.2.2",  // Response caching
    "cache-manager": "^5.7.6"           // Cache manager core
  }
}
```

**No New Dependencies:** Epic 2 nutzt hauptsächlich Epic 1 Infrastructure:
- TypeORM (bereits installiert)
- Zod (bereits in shared-types)
- NestJS Core (bereits installiert)
- Pino Logger (bereits installiert)

**External Integrations:**

- **None** in Epic 2 (KI-Integration in Epic 6)

**Database Schema Migrations:**

```sql
-- Migration: 002_create_cv_tables.sql

-- CV Main Table
CREATE TABLE IF NOT EXISTS cv (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CV Versions Table
CREATE TABLE IF NOT EXISTS cv_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cv_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK(status IN ('draft', 'active', 'archived')),
  source VARCHAR(50),
  file_hash VARCHAR(64),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cv_id) REFERENCES cv(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cv_versions_cv_id ON cv_versions(cv_id);
CREATE INDEX IF NOT EXISTS idx_cv_versions_status ON cv_versions(status);
CREATE INDEX IF NOT EXISTS idx_cv_versions_created_at ON cv_versions(created_at DESC);
```

**TypeORM Migration File:**

```typescript
// apps/backend/src/database/migrations/1699012345678-CreateCVTables.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCVTables1699012345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cv (
        id INTEGER PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cv_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cv_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        status VARCHAR(20) NOT NULL CHECK(status IN ('draft', 'active', 'archived')),
        source VARCHAR(50),
        file_hash VARCHAR(64),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cv_id) REFERENCES cv(id)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_cv_versions_cv_id ON cv_versions(cv_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cv_versions`);
    await queryRunner.query(`DROP TABLE IF EXISTS cv`);
  }
}
```

**Seed Data Script:**

```typescript
// apps/backend/src/database/seeds/cv.seed.ts
import { DataSource } from 'typeorm';
import { CVEntity } from '../../modules/cv/entities/cv.entity';
import { CVSchema } from '@cv-hub/shared-types';
import * as fs from 'fs';
import * as path from 'path';

export async function seedCV(dataSource: DataSource): Promise<void> {
  const cvRepository = dataSource.getRepository(CVEntity);

  // Check if CV already exists
  const existingCV = await cvRepository.findOne({ where: { id: 1 } });
  if (existingCV) {
    console.log('CV already seeded, skipping...');
    return;
  }

  // Load example CV
  const exampleCVPath = path.join(__dirname, '../../../seeds/example-cv.json');
  const exampleCVRaw = fs.readFileSync(exampleCVPath, 'utf-8');
  const exampleCV = JSON.parse(exampleCVRaw);

  // Validate against schema
  const validatedCV = CVSchema.parse(exampleCV);

  // Insert
  await cvRepository.save({
    id: 1,
    data: JSON.stringify(validatedCV),
  });

  console.log('✓ CV seed data inserted successfully');
}
```

**Cross-Epic Integration Points:**

1. **Epic 4 (Invite Links):**
   - Epic 2 provides: `/api/cv/private/:token` endpoint
   - Epic 4 provides: InviteGuard for token validation
   - Integration: Guard attaches `request.invite` context

2. **Epic 5 (Admin Dashboard):**
   - Epic 2 provides: Admin CV endpoints (PATCH, GET versions, POST rollback)
   - Epic 5 provides: AdminAuthGuard for session validation
   - Integration: Guard attaches `request.user` context

3. **Epic 6 (KI Extraction):**
   - Epic 2 provides: CVVersion entity with `draft` status
   - Epic 6 provides: File upload, Gemini extraction
   - Integration: Extraction service creates CVVersion (status='draft'), admin approves → PATCH /api/admin/cv

## Acceptance Criteria (Authoritative)

### AC-1: JSON Resume Schema ist implementiert und validiert

**Given:** Zod-Schemas für JSON Resume sind definiert
**When:** Ein CV wird validiert
**Then:**
- ✅ CVSchema existiert in `packages/shared-types/src/cv-schema.ts`
- ✅ Schema umfasst alle JSON Resume Core-Felder: `basics`, `work`, `education`, `skills`, `projects`, `volunteer`
- ✅ cv-hub Extensions sind vorhanden: `isPrivate`, `metrics`, `entity`
- ✅ TypeScript Types werden automatisch aus Zod inferiert: `type CV = z.infer<typeof CVSchema>`
- ✅ Zod-Validation funktioniert: `CVSchema.parse(validData)` returns CV
- ✅ Zod-Validation wirft Fehler bei Invalid Data: `CVSchema.parse(invalidData)` throws ZodError

**Verification:**
```bash
cd packages/shared-types
npm run build
npm run test # Unit tests für Schema-Validation
```

---

### AC-2: CV und CVVersion Entities sind implementiert

**Given:** TypeORM-Entities für CV-Daten existieren
**When:** Migrations werden ausgeführt
**Then:**
- ✅ `CVEntity` existiert in `apps/backend/src/modules/cv/entities/cv.entity.ts`
- ✅ `CVVersionEntity` existiert mit Feldern: id, cvId, data, status, source, fileHash, createdAt
- ✅ Database Migration erstellt Tabellen `cv` und `cv_versions`
- ✅ Indexes sind angelegt: `idx_cv_versions_cv_id`, `idx_cv_versions_status`, `idx_cv_versions_created_at`
- ✅ Foreign Key Constraint `cv_versions.cvId` → `cv.id` ist aktiv
- ✅ Check Constraint `status IN ('draft', 'active', 'archived')` ist enforced

**Verification:**
```bash
cd apps/backend
npm run migration:run
# Check SQLite DB
sqlite3 data/cv-hub.db ".schema cv"
sqlite3 data/cv-hub.db ".schema cv_versions"
```

---

### AC-3: GET /api/cv/public liefert gefilterte CV-Daten

**Given:** Backend läuft und CV-Seed-Data existiert
**When:** Public CV wird abgerufen
**Then:**
- ✅ `GET /api/cv/public` liefert HTTP 200
- ✅ Response enthält `success: true` und `data: CV`
- ✅ Private Felder sind entfernt:
  - ✅ `basics.email`, `basics.phone` sind undefined
  - ✅ `basics.location.address`, `basics.location.postalCode` sind undefined
  - ✅ `skills[].level` ist undefined
  - ✅ `projects` enthält nur Projekte mit `isPrivate: false`
  - ✅ `work[].name` ist "Confidential" (redacted)
  - ✅ `work[].highlights` enthält max 3 Items
  - ✅ `projects[].entity` ist undefined
  - ✅ `projects[].metrics` ist undefined
- ✅ Response ist gecached (5 Minuten)
- ✅ ETag Header ist gesetzt
- ✅ Response Time <100ms (p95)

**Verification:**
```bash
curl http://localhost:3000/api/cv/public | jq
# Verify no email/phone in response
curl http://localhost:3000/api/cv/public | jq '.data.basics.email'
# Should return: null
```

---

### AC-4: GET /api/cv/private/:token liefert vollständigen CV

**Given:** Ein gültiger Token existiert (Epic 4 Placeholder)
**When:** Authenticated CV wird abgerufen
**Then:**
- ✅ `GET /api/cv/private/:token` liefert HTTP 200
- ✅ Response enthält VOLLSTÄNDIGEN CV (keine Filterung)
- ✅ Private Felder sind enthalten:
  - ✅ `basics.email`, `basics.phone` vorhanden
  - ✅ `basics.location.address` vorhanden
  - ✅ `skills[].level` vorhanden
  - ✅ `projects` enthält auch `isPrivate: true` Projekte
  - ✅ `work[].name` zeigt echten Firmennamen
  - ✅ `work[].highlights` vollständig (nicht gekürzt)
  - ✅ `projects[].entity`, `projects[].metrics` vorhanden
- ✅ Response Time <150ms (p95)
- ✅ **Placeholder Guard:** Bei fehlendem Epic 4 gibt 501 Not Implemented oder bypassed validation

**Verification:**
```bash
# With Epic 4 implemented:
curl http://localhost:3000/api/cv/private/valid-token | jq '.data.basics.email'
# Should return: "max@example.com"

# Without Epic 4 (placeholder):
curl http://localhost:3000/api/cv/private/any-token
# Should return: 501 Not Implemented OR bypass and serve full CV
```

---

### AC-5: PATCH /api/admin/cv aktualisiert CV mit Versionierung

**Given:** Admin ist authentifiziert (Epic 5 Placeholder)
**When:** CV wird aktualisiert
**Then:**
- ✅ `PATCH /api/admin/cv` mit Valid DTO liefert HTTP 200
- ✅ Aktuelle Version wird archiviert:
  - ✅ `cv_versions` erhält neuen Eintrag mit `status: 'archived'`, `source: 'api-update'`
- ✅ CV-Daten werden aktualisiert: `cv.data` enthält neues JSON
- ✅ `cv.updated_at` wird aktualisiert
- ✅ Response enthält updated CV
- ✅ Transaktion ist atomar (Rollback bei Fehler)
- ✅ Zod-Validation läuft bei Partial Updates: `CVSchema.partial().parse(dto.cv)`
- ✅ Invalid Data → HTTP 400 mit Validation Errors
- ✅ Response Time <300ms (p95)
- ✅ **Placeholder Guard:** Bei fehlendem Epic 5 gibt 501 Not Implemented oder bypassed auth

**Verification:**
```bash
# Update CV
curl -X PATCH http://localhost:3000/api/admin/cv \
  -H "Content-Type: application/json" \
  -d '{"cv": {"basics": {"name": "Updated Name"}}}' | jq

# Verify version archived
sqlite3 data/cv-hub.db "SELECT COUNT(*) FROM cv_versions WHERE status='archived'"
# Should return: 1 (or more)
```

---

### AC-6: GET /api/admin/cv/versions liefert Versionshistorie

**Given:** Mehrere CV-Versionen existieren
**When:** Versionshistorie wird abgerufen
**Then:**
- ✅ `GET /api/admin/cv/versions?limit=10&offset=0` liefert HTTP 200
- ✅ Response enthält Array von `CVVersionResponseDto`
- ✅ Jede Version enthält: `id`, `status`, `source`, `createdAt`, `data`
- ✅ Versionen sind sortiert nach `createdAt DESC` (neueste zuerst)
- ✅ Pagination funktioniert: `limit` und `offset` Query-Params
- ✅ Response enthält `pagination` Object: `total`, `limit`, `offset`, `hasNext`
- ✅ Response Time <200ms (p95)

**Verification:**
```bash
curl http://localhost:3000/api/admin/cv/versions?limit=5 | jq '.data | length'
# Should return: 5 (or less if fewer versions exist)
```

---

### AC-7: POST /api/admin/cv/rollback/:versionId stellt vorherige Version wieder her

**Given:** Ein archiviertes Version existiert
**When:** Rollback wird ausgeführt
**Then:**
- ✅ `POST /api/admin/cv/rollback/:versionId` liefert HTTP 200
- ✅ Aktuelle CV wird archiviert mit `source: 'rollback'`
- ✅ CV-Daten werden auf Version X zurückgesetzt: `cv.data` = `version_x.data`
- ✅ Response enthält restored CV
- ✅ Transaktion ist atomar
- ✅ HTTP 404 bei nicht-existenter Version
- ✅ Response Time <400ms (p95)

**Verification:**
```bash
# Get version ID
VERSION_ID=$(curl -s http://localhost:3000/api/admin/cv/versions | jq '.data[1].id')

# Rollback
curl -X POST http://localhost:3000/api/admin/cv/rollback/$VERSION_ID | jq

# Verify CV data matches version
curl http://localhost:3000/api/cv/public | jq '.data.basics.name'
```

---

### AC-8: Privacy Filter entfernt sensible Daten korrekt

**Given:** Vollständiger CV mit privaten Daten
**When:** Privacy Filter wird angewendet
**Then:**
- ✅ PrivacyFilterService existiert in `apps/backend/src/modules/cv/services/privacy-filter.service.ts`
- ✅ Method `filterPublicSubset(cv: CV): CV` implementiert
- ✅ Filtering funktioniert für alle Private Fields (siehe AC-3)
- ✅ Immutable Operation (Original-CV nicht mutiert)
- ✅ Performance: <10ms für Filter-Operation
- ✅ Unit Tests vorhanden mit Assertions für alle Private Fields

**Verification:**
```bash
cd apps/backend
npm run test -- privacy-filter.service.spec.ts
# All tests passing
```

---

### AC-9: Seed Data lädt Beispiel-CV bei erster Initialisierung

**Given:** Leere Datenbank
**When:** Seed-Script wird ausgeführt
**Then:**
- ✅ Seed-Script existiert: `apps/backend/src/database/seeds/cv.seed.ts`
- ✅ Beispiel-CV existiert: `apps/backend/seeds/example-cv.json`
- ✅ Seed-Script validiert Beispiel-CV gegen CVSchema
- ✅ `cv` Tabelle enthält Entry mit `id: 1`
- ✅ Bei erneutem Run: Seeding wird übersprungen (idempotent)
- ✅ Command `npm run seed` funktioniert

**Verification:**
```bash
cd apps/backend
npm run seed
# Output: "✓ CV seed data inserted successfully"

npm run seed
# Output: "CV already seeded, skipping..."

sqlite3 data/cv-hub.db "SELECT id, json_extract(data, '$.basics.name') FROM cv"
# Should return: 1|Max Mustermann (or configured name)
```

---

### AC-10: Swagger API-Dokumentation ist generiert

**Given:** Backend läuft
**When:** Swagger Docs werden abgerufen
**Then:**
- ✅ `http://localhost:3000/api/docs` ist erreichbar
- ✅ Swagger UI zeigt alle CV-Endpoints
- ✅ Endpoints haben Descriptions, Request/Response Schemas
- ✅ DTOs sind dokumentiert mit Zod-Schema-Properties
- ✅ Beispiel-Requests sind verfügbar ("Try it out")

**Verification:**
```bash
curl http://localhost:3000/api/docs | grep "cv-hub API"
# Should return HTML with title
```

---

## Traceability Mapping

| AC | PRD Requirement | Architecture Section | Component/API | Test Type |
|----|-----------------|----------------------|---------------|-----------|
| **AC-1** | FR-2 (CV Data Model) | Architecture Patterns → Pattern 3 (JSON Resume Schema) | `packages/shared-types/cv-schema.ts` | Unit Tests (Zod Validation) |
| **AC-2** | FR-2 (CV Data Model) | Data Architecture → Database Schema | `CVEntity`, `CVVersionEntity`, Migrations | Migration Test, Schema Validation |
| **AC-3** | FR-1 (Public Portfolio), FR-2 (Privacy-First) | Architecture Patterns → Pattern 1 (Privacy Filtering) | `GET /api/cv/public`, PrivacyFilterService | Integration Test (API) |
| **AC-4** | FR-3 (Personalized CV), FR-4 (Token-Based Access) | Architecture Patterns → Pattern 2 (Token Access) | `GET /api/cv/private/:token`, InviteGuard | Integration Test (API) |
| **AC-5** | FR-5 (Admin CV Management) | API Design → Admin API | `PATCH /api/admin/cv`, CVService.updateCV | Integration Test (Transaction) |
| **AC-6** | FR-5 (Admin CV Management) | Data Architecture → CV Versions | `GET /api/admin/cv/versions` | Integration Test (Pagination) |
| **AC-7** | FR-5 (Admin CV Management) | Workflows → Rollback Flow | `POST /api/admin/cv/rollback/:versionId` | Integration Test (Transaction) |
| **AC-8** | FR-2 (Privacy-First) | Architecture Patterns → Pattern 1 | PrivacyFilterService | Unit Test (Privacy Logic) |
| **AC-9** | N/A (Dev Setup) | N/A | Seed Script | Manual Verification |
| **AC-10** | N/A (API Docs) | API Design → Swagger/OpenAPI | Swagger Module | Manual Verification |

### Requirement → Component Traceability

**PRD FR-2 (CV Data Model with Privacy) → Components:**
- Zod CVSchema (`packages/shared-types/cv-schema.ts`)
- PrivacyFilterService (`apps/backend/src/modules/cv/services/privacy-filter.service.ts`)
- CVEntity, CVVersionEntity
- `GET /api/cv/public` (filtered endpoint)

**PRD FR-3 (Personalized CV Access) → Components:**
- `GET /api/cv/private/:token` endpoint
- InviteGuard (placeholder in Epic 2, full implementation in Epic 4)
- CVService.getCV('authenticated')

**PRD FR-5 (Admin CV Management) → Components:**
- `PATCH /api/admin/cv` (update endpoint)
- `GET /api/admin/cv/versions` (history endpoint)
- `POST /api/admin/cv/rollback/:versionId` (rollback endpoint)
- CVService (updateCV, getVersions, rollback methods)
- AdminAuthGuard (placeholder in Epic 2, full implementation in Epic 5)

**Architecture Decision: JSON Resume Standard → Implementation:**
- CVSchema mit allen JSON Resume Core-Feldern
- cv-hub Extensions: `isPrivate`, `metrics`, `entity`
- Shared zwischen Frontend/Backend/KI

**Architecture Decision: Privacy-by-Design → Implementation:**
- Server-Side Filtering (PrivacyFilterService)
- Fail-Closed (Error bei Filter-Fehler, nicht ungefilter

te Daten)
- Field-Level Access Control

### Test Strategy per AC

| AC | Test Level | Test Tool | Coverage Target |
|----|------------|-----------|-----------------|
| AC-1 | Unit | Vitest (Shared Types) | 90%+ (Zod Schema Validation) |
| AC-2 | Integration | Jest + TypeORM | 100% (Migrations run successfully) |
| AC-3 | Integration | Jest + Supertest | 95%+ (API Endpoint + Privacy Filter) |
| AC-4 | Integration | Jest + Supertest | 90%+ (API Endpoint) |
| AC-5 | Integration | Jest + Supertest | 95%+ (Transaction Logic) |
| AC-6 | Integration | Jest + Supertest | 90%+ (Pagination) |
| AC-7 | Integration | Jest + Supertest | 95%+ (Rollback Transaction) |
| AC-8 | Unit | Jest | 100% (Privacy Filter Logic) |
| AC-9 | Manual | N/A | Seed script runs |
| AC-10 | Manual | Browser | Swagger UI accessible |

### Cross-Epic Dependencies

**Epic 2 Outputs consumed by:**
- **Epic 3 (Public Portfolio):** `GET /api/cv/public` endpoint
- **Epic 4 (Privacy Sharing):** `/api/cv/private/:token` endpoint, CVSchema
- **Epic 5 (Admin Dashboard):** Admin CV endpoints, CVVersionEntity
- **Epic 6 (KI Extraction):** CVSchema, CVVersionEntity (draft status)

**Epic 2 guarantees for downstream epics:**
- Stable JSON Resume Schema (breaking changes coordinated)
- Privacy-First API-Design (public endpoint safe for production)
- Versioning Infrastructure (rollback always available)
- Zod-Validation-First (alle API-Inputs validiert)

## Risks, Assumptions, Open Questions

### Risks

**RISK-1: JSON Resume Schema Alignment Breaking Changes**
- **Description:** JSON Resume Standard könnte Updates veröffentlichen, die Breaking Changes verursachen
- **Impact:** CV-Daten müssen migriert werden, Zod-Schemas angepasst
- **Probability:** Low (JSON Resume Standard ist seit Jahren stabil)
- **Mitigation:**
  - Pin JSON Resume Schema Version in Documentation
  - Versionierung der Zod-Schemas (future: `CVSchemaV2`)
  - Database speichert JSON (flexibel für Schema-Changes)
  - Migration-Script für Schema-Upgrades (future)
- **Owner:** Backend Team

**RISK-2: Privacy Filter Logic Fehler (Data Leak)**
- **Description:** Bug im PrivacyFilterService könnte private Daten leaken
- **Impact:** DSGVO-Verstoß, Vertrauensverlust, rechtliche Konsequenzen
- **Probability:** Medium (komplexe Filterlogik, viele Edge-Cases)
- **Mitigation:**
  - Umfangreiche Unit Tests für PrivacyFilterService (100% Coverage)
  - Integration Tests mit Assertions für alle Private Fields
  - Code Review mit Security-Fokus
  - Fail-Closed-Design (Error bei Filter-Fehler → kein ungefilterter CV)
  - Manual Audit der gefilterten Responses (vor Production)
- **Owner:** Backend Team, Security Review

**RISK-3: SQLite JSON Performance bei großen CVs**
- **Description:** Sehr große CVs (>500KB JSON) könnten SQLite-Performance beeinträchtigen
- **Impact:** Langsame Response Times, schlechte UX
- **Probability:** Low (typischer CV <100KB)
- **Mitigation:**
  - Performance Tests mit großen Seed-Daten
  - Monitoring von Response Times (Threshold >200ms)
  - Bei Performance-Problemen: PostgreSQL Migration (Epic 7)
- **Owner:** Backend Team

**RISK-4: Zod Validation Performance bei komplexen Schemas**
- **Description:** Zod-Validation von großen CVs könnte langsam sein (>100ms)
- **Impact:** Höhere Response Times, schlechte p95-Performance
- **Probability:** Low (Zod ist optimiert für Performance)
- **Mitigation:**
  - Benchmark Zod-Validation in Tests
  - Lazy Validation (nur bei Updates, nicht bei Reads)
  - Caching von validated CVs
  - Bei Problemen: Custom Validation-Logic
- **Owner:** Backend Team

**RISK-5: Placeholder Guards verwirren Developer in Epics 4/5**
- **Description:** Placeholder Guards (ohne Auth) könnten zu Security-Missverständnissen führen
- **Impact:** Developer implementieren Features ohne Auth-Check
- **Probability:** Medium (häufiger Fehler in Stacked Epics)
- **Mitigation:**
  - Klare Kommentare in Placeholder Guards: "TODO: Epic 4/5 implements real auth"
  - Placeholder Guards werfen 501 Not Implemented (statt Silent Pass)
  - Documentation in README: "Epic 2 admin endpoints require Epic 5 auth"
  - Epic 4/5 checklists: "Replace Placeholder Guards"
- **Owner:** Tech Lead, Code Reviews

### Assumptions

**ASSUMPTION-1: Epic 1 Foundation ist vollständig**
- NestJS Backend läuft stabil
- TypeORM + SQLite funktionieren
- Zod ist in shared-types verfügbar
- Pino Logging aktiv
- **Validation:** Epic 1 AC passing, Backend Health Check OK

**ASSUMPTION-2: Seed Data ist repräsentativ**
- Beispiel-CV deckt alle JSON Resume Felder ab
- Privacy-Test-Cases sind ausreichend (öffentlich vs. privat)
- **Fallback:** Custom Seed-Data kann via JSON-File bereitgestellt werden

**ASSUMPTION-3: Kein Multi-User Support erforderlich (MVP)**
- Nur 1 CV (id=1) in Datenbank
- Keine User-Trennung in Epic 2
- Multi-User später (Post-MVP)
- **Impact:** Vereinfachte Service-Logic, keine User-Context-Handling

**ASSUMPTION-4: Privacy-Filterung ist binär (public/private)**
- Keine Granularity-Levels (z.B. "recruiter" vs "public")
- Entweder vollständig oder gefiltert
- **Future Enhancement:** Role-based filtering (Post-MVP)

**ASSUMPTION-5: Versionierung ist immutable (append-only)**
- Versions werden nie gelöscht (nur status-change)
- Unbegrenzte History (kein Auto-Cleanup)
- **Future Enhancement:** Retention Policy (z.B. max 100 Versions) in Epic 7

**ASSUMPTION-6: Admin-Endpoints ohne Rate-Limiting (Epic 2)**
- Epic 1 Rate-Limiting gilt, aber keine Admin-spezifischen Limits
- Epic 5 kann strikte Limits hinzufügen
- **Rationale:** Single Admin-User (MVP), kein Abuse-Risk

### Open Questions

**QUESTION-1: Welche JSON Resume Felder sind MVP-critical?**
- **Status:** To be decided
- **Decision Needed:** Sollen `awards`, `publications`, `languages`, `interests`, `references` implementiert werden?
- **Options:**
  - A) Nur Core-Felder (`basics`, `work`, `education`, `skills`, `projects`)
  - B) Full JSON Resume Standard
- **Impact:** Schema-Complexity, Seed-Data-Erstellung, Privacy-Filter-Logic
- **Recommendation:** A - Core-Felder für MVP, Rest optional (`.optional()`) → Einfachere Implementation

**QUESTION-2: Wie umgehen mit veralteten CVVersion-Backups?**
- **Status:** Open
- **Decision Needed:** Soll es eine Retention-Policy für Versions geben?
- **Options:**
  - A) Unbegrenzt speichern (alle Versions)
  - B) Max 100 Versions (älteste auto-delete)
  - C) Time-based (>1 Jahr alt auto-delete)
- **Impact:** Disk-Space, Query-Performance (Versions-Liste)
- **Recommendation:** A für MVP, B in Epic 7 Production-Deployment

**QUESTION-3: Privacy-Filter: Highlights kürzen auf 3 oder komplett entfernen?**
- **Status:** Spec sagt "max 3 items"
- **Decision Needed:** Ist partial Highlights-Leak ein Privacy-Risk?
- **Options:**
  - A) Highlights kürzen auf 3 (wie spezifiziert)
  - B) Highlights komplett entfernen für public
  - C) Generic Highlights ("Led team", "Improved processes") ohne Details
- **Impact:** Public CV Aussagekraft vs. Privacy
- **Recommendation:** A - Max 3 Items (Balance zwischen Privacy und Showcase)

**QUESTION-4: Seed-Data: Generic oder Personal?**
- **Status:** Open
- **Decision Needed:** Soll Beispiel-CV generic ("Max Mustermann") oder personal (Ruben's CV) sein?
- **Options:**
  - A) Generic Placeholder-CV
  - B) Ruben's echtes CV (mit Privacy-Markierungen)
- **Impact:** Development-Experience, Testing-Realismus
- **Recommendation:** B - Ruben's CV (realistischer, direkt produktiv nutzbar)

**QUESTION-5: Zod `.parse()` vs `.safeParse()` in Production?**
- **Status:** To be decided
- **Decision Needed:** Sollen wir `safeParse` für besseres Error-Handling verwenden?
- **Options:**
  - A) `.parse()` → wirft Exception (wie spezifiziert)
  - B) `.safeParse()` → Returns `{ success, data, error }` (kein throw)
- **Impact:** Error-Handling-Complexity, Service-Logic
- **Recommendation:** B - `safeParse` für controlled Error-Handling (NestJS best practice)

## Test Strategy Summary

### Test Pyramid für Epic 2

```
         /\
        /  \      E2E Tests (Optional - Epic 3)
       /    \     - Frontend calls /api/cv/public
      /------\    - Verifies privacy filtering in browser
     /        \
    /  Integ.  \  Integration Tests (Primary Focus)
   /   Tests    \ - API Endpoints (Supertest)
  /--------------\- Database operations (TypeORM)
 /                \- Privacy Filter Service
/  Unit Tests      \ Unit Tests (Foundation)
--------------------\- Zod Schema validation
                     - Privacy Filter Logic
                     - Utility functions
```

### Test Levels

**1. Unit Tests**

- **Scope:** Zod Schemas, Privacy Filter Logic, Utility Functions
- **Tools:** Jest (Backend), Vitest (Shared Types)
- **Coverage Target:** 90%+ für kritische Logic

**Examples:**
```typescript
// packages/shared-types/src/cv-schema.spec.ts
describe('CVSchema', () => {
  it('should validate valid CV data', () => {
    const validCV = { basics: { name: 'Test', label: 'Engineer' }, ... };
    const result = CVSchema.safeParse(validCV);
    expect(result.success).toBe(true);
  });

  it('should reject invalid CV data', () => {
    const invalidCV = { basics: { name: 123 } }; // Wrong type
    const result = CVSchema.safeParse(invalidCV);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(['basics', 'name']);
  });
});

// apps/backend/src/modules/cv/services/privacy-filter.service.spec.ts
describe('PrivacyFilterService', () => {
  let service: PrivacyFilterService;

  beforeEach(() => {
    service = new PrivacyFilterService();
  });

  it('should remove private fields from CV', () => {
    const fullCV: CV = {
      basics: {
        name: 'Max',
        email: 'max@example.com', // Private
        phone: '+49 123', // Private
        location: { address: 'Street 1', city: 'Berlin' } // Partial private
      },
      skills: [{ name: 'TypeScript', level: 'Expert' }], // Level private
    };

    const filtered = service.filterPublicSubset(fullCV);

    expect(filtered.basics.email).toBeUndefined();
    expect(filtered.basics.phone).toBeUndefined();
    expect(filtered.basics.location?.address).toBeUndefined();
    expect(filtered.basics.location?.city).toBe('Berlin'); // Public
    expect(filtered.skills?.[0].level).toBeUndefined();
    expect(filtered.skills?.[0].name).toBe('TypeScript'); // Public
  });

  it('should redact company names in work experience', () => {
    const fullCV: CV = {
      work: [{ name: 'ACME Corp', position: 'Engineer', ... }]
    };

    const filtered = service.filterPublicSubset(fullCV);
    expect(filtered.work?.[0].name).toBe('Confidential');
  });

  it('should filter out private projects', () => {
    const fullCV: CV = {
      projects: [
        { name: 'Public Project', isPrivate: false },
        { name: 'Secret Project', isPrivate: true }
      ]
    };

    const filtered = service.filterPublicSubset(fullCV);
    expect(filtered.projects).toHaveLength(1);
    expect(filtered.projects?.[0].name).toBe('Public Project');
  });
});
```

**2. Integration Tests**

- **Scope:** API Endpoints, Database Operations, Transactions
- **Tools:** Jest + Supertest (HTTP Assertions)
- **Coverage Target:** 95%+ für API-Endpoints

**Examples:**
```typescript
// apps/backend/test/cv.e2e-spec.ts
describe('CV API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/cv/public', () => {
    it('should return public CV subset', () => {
      return request(app.getHttpServer())
        .get('/api/cv/public')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.basics.name).toBeDefined();
          expect(res.body.data.basics.email).toBeUndefined(); // Private
          expect(res.body.data.basics.phone).toBeUndefined(); // Private
        });
    });

    it('should cache response', async () => {
      const res1 = await request(app.getHttpServer()).get('/api/cv/public');
      const res2 = await request(app.getHttpServer()).get('/api/cv/public');

      expect(res1.headers['etag']).toBeDefined();
      expect(res1.headers['etag']).toBe(res2.headers['etag']);
    });
  });

  describe('PATCH /api/admin/cv', () => {
    it('should update CV and create version', async () => {
      const updateDto = { cv: { basics: { name: 'Updated Name' } } };

      const res = await request(app.getHttpServer())
        .patch('/api/admin/cv')
        .send(updateDto)
        .expect(200);

      expect(res.body.data.basics.name).toBe('Updated Name');

      // Verify version created
      const versionsRes = await request(app.getHttpServer())
        .get('/api/admin/cv/versions?limit=1')
        .expect(200);

      expect(versionsRes.body.data).toHaveLength(1);
      expect(versionsRes.body.data[0].status).toBe('archived');
    });

    it('should rollback on transaction failure', async () => {
      // Mock database error
      jest.spyOn(cvRepository, 'save').mockRejectedValueOnce(new Error('DB Error'));

      await request(app.getHttpServer())
        .patch('/api/admin/cv')
        .send({ cv: { basics: { name: 'Fail' } } })
        .expect(500);

      // Verify CV not updated
      const res = await request(app.getHttpServer()).get('/api/cv/public');
      expect(res.body.data.basics.name).not.toBe('Fail');
    });
  });
});
```

**3. Database Migration Tests**

```typescript
// apps/backend/test/migrations.spec.ts
describe('CV Migrations', () => {
  it('should create cv and cv_versions tables', async () => {
    await dataSource.runMigrations();

    const cvTable = await dataSource.query("SELECT name FROM sqlite_master WHERE type='table' AND name='cv'");
    const versionsTable = await dataSource.query("SELECT name FROM sqlite_master WHERE type='table' AND name='cv_versions'");

    expect(cvTable).toHaveLength(1);
    expect(versionsTable).toHaveLength(1);
  });

  it('should enforce status check constraint', async () => {
    await expect(
      dataSource.query("INSERT INTO cv_versions (cv_id, data, status) VALUES (1, '{}', 'invalid')")
    ).rejects.toThrow(); // Check constraint violation
  });
});
```

### Test Execution Strategy

**Local Development:**
```bash
# Unit Tests (watch mode)
cd packages/shared-types
npm run test:watch

cd apps/backend
npm run test:watch

# Integration Tests (single run)
cd apps/backend
npm run test:e2e

# Full Test Suite
pnpm -r test
```

**CI/CD (GitHub Actions):**
```yaml
# Parallel Execution
jobs:
  test-shared-types:
    runs-on: ubuntu-latest
    steps:
      - run: cd packages/shared-types && npm test

  test-backend-unit:
    runs-on: ubuntu-latest
    steps:
      - run: cd apps/backend && npm test

  test-backend-e2e:
    runs-on: ubuntu-latest
    steps:
      - run: cd apps/backend && npm run test:e2e
```

### Test Coverage Goals

| Component | Unit | Integration | Total Target |
|-----------|------|-------------|--------------|
| CVSchema (Shared Types) | 95% | - | 95% |
| PrivacyFilterService | 100% | - | 100% |
| CV Module (Controller + Service) | 60% | 95% | 90% |
| CV Repository (TypeORM) | - | 90% | 90% |
| API Endpoints | - | 95% | 95% |
| **Overall Epic 2** | **80%** | **95%** | **90%** |

### Test Data Management

**Fixtures:**
```typescript
// test/fixtures/cv.fixtures.ts
export const validCV: CV = {
  basics: {
    name: 'Test User',
    label: 'Test Engineer',
    email: 'test@example.com',
    phone: '+49 123',
    location: { city: 'Berlin', countryCode: 'DE' }
  },
  work: [
    { name: 'Test Corp', position: 'Engineer', startDate: '2020-01', isPrivate: false }
  ],
  skills: [
    { name: 'TypeScript', level: 'Expert', keywords: ['Backend'] }
  ],
  projects: [
    { name: 'Public Project', description: 'Test', isPrivate: false },
    { name: 'Private Project', description: 'Secret', isPrivate: true }
  ]
};

export const publicCVSubset = {
  // Expected public subset (for assertions)
};
```

**Database Seeding (Test):**
```typescript
beforeEach(async () => {
  await dataSource.query('DELETE FROM cv_versions');
  await dataSource.query('DELETE FROM cv');

  await cvRepository.save({
    id: 1,
    data: JSON.stringify(validCV)
  });
});
```

### Definition of Done (DoD) for Epic 2

Epic 2 ist **Done** wenn:
- ✅ Alle 10 Acceptance Criteria erfüllt
- ✅ CI/CD-Pipeline grün (alle Tests passing)
- ✅ Test-Coverage >= 90% (Overall)
- ✅ Swagger API-Docs generiert und manuell geprüft
- ✅ Code-Review abgeschlossen
- ✅ Keine kritischen Security-Vulnerabilities (`pnpm audit`)
- ✅ Privacy-Filter manuell verifiziert (keine Leaks)
- ✅ Seed-Data lädt erfolgreich
- ✅ Sprint-Status aktualisiert (Epic 2: backlog → in-progress → done)
- ✅ Documentation aktualisiert (README, inline comments)
