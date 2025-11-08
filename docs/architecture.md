# cv-hub Architecture Document

**Project:** cv-hub - Privacy-First CV Management System
**Level:** Level 2 (Multi-Epic Software Project)
**Author:** Winston (Architect Agent) + Ruben
**Date:** 2025-11-04
**Status:** Initial Architecture (Ready for Implementation)

---

## Executive Summary

cv-hub ist ein modernes, Privacy-fokussiertes CV-Management-System, das als persönliches Portfolio UND technisches Showcase dient. Das Besondere: Die Website selbst demonstriert technische Kompetenz durch ihre Qualität, Performance und Durchdachtheit.

**Kern-Differenziatoren:**
- **Privacy-First Token-System:** Granulare Kontrolle über CV-Datenweitergabe via personalisierte Links
- **KI-gestützte CV-Pflege:** Automatische Extraktion strukturierter Daten aus unstrukturierten Dateien
- **Performance als Feature:** Lighthouse >90, FCP <1.5s, technische Exzellenz spürbar
- **JSON Resume Standard:** Strukturierte, standardisierte CV-Daten

**Architektur-Prinzipien:**
1. **Privacy by Design:** Public/Private Datenfilterung, Token-basierte Zugriffskontrolle, DSGVO-konform
2. **Scale Adaptive:** Startet einfach (SQLite, Docker Compose), kann wachsen wenn nötig
3. **Developer Experience:** End-to-End Type Safety, moderne Tools, klare Patterns
4. **Quality First:** Accessibility (WCAG AA), Security (Helmet, Argon2), Performance (SSR, Caching)

**Target Deployment:** Docker Compose auf eigener Domain, Let's Encrypt HTTPS, <50k requests/month

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet / Users                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Nginx Reverse Proxy (Docker)                    │
│           - SSL Termination (Let's Encrypt)                  │
│           - Rate Limiting (Tier 1)                           │
│           - Static Asset Serving                             │
└────────────────┬────────────────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│   Frontend      │   │   Backend       │
│ TanStack Start  │◄─►│   NestJS API    │
│   (Port 5173)   │   │  (Port 3000)    │
│                 │   │                 │
│ - SSR + CSR     │   │ - RESTful API   │
│ - React 19      │   │ - TypeORM       │
│ - TanStack Eco  │   │ - Passport      │
│ - shadcn/ui     │   │ - Rate Limit    │
└─────────────────┘   └────────┬────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │   SQLite DB     │
                      │   (Volume)      │
                      │                 │
                      │ - CV Data       │
                      │ - Links/Tokens  │
                      │ - Sessions      │
                      │ - Versions      │
                      └─────────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │  Google Gemini  │
                      │   API (External)│
                      │                 │
                      │ - CV Extraction │
                      └─────────────────┘
```

### System Boundaries

**In Scope:**
- Public CV presentation (SSR, SEO-optimized)
- Token-based personalized CV access
- Admin dashboard (link management, statistics)
- KI-powered CV extraction (PDF/Text → JSON Resume)
- Session-based admin authentication
- SQLite persistence with backups
- Docker Compose deployment

**Out of Scope (MVP):**
- Multi-user/Multi-tenant support
- Mobile native apps
- Real-time collaboration
- Advanced analytics/BI dashboards
- Third-party integrations (beyond Gemini)
- Horizontal scaling / Load balancing
- CDN for assets

### User Roles & Permissions

**1. Anonymous Public (Unrestricted)**
- Access: Public CV view (`/`)
- Data: Filtered subset (skills, generic projects, no contact info)
- Auth: None required

**2. Invited Viewer (Token-Based)**
- Access: Personalized CV view (`/invite/:token`)
- Data: Full CV + optional personal message
- Auth: Valid, non-expired token in URL
- Tracked: Visit count, last visit (anonymized)

**3. Admin (Session-Based)**
- Access: Admin dashboard (`/admin/*`)
- Data: Full CRUD on links, CV, statistics
- Auth: Username/Password + Session Cookie
- Capabilities: Link management, CV updates, KI extraction

---

## Technical Stack Decisions

### Frontend Stack

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Framework** | TanStack Start | RC → v1.0 | Full-document SSR, Type-safe Server Functions, Vite-powered |
| **UI Library** | React | 19 | Latest stable, TanStack Start compatible |
| **Router** | TanStack Router | v1 | File-based routing, Type-safe, SSR support |
| **Data Fetching** | TanStack Query | Latest | Server-state management, Caching, Optimistic updates |
| **Forms** | TanStack Form | Latest | Type-safe forms, Validation, UX-optimized |
| **Styling** | Tailwind CSS | v4 | Utility-first, Fast iteration, Production-optimized |
| **Components** | shadcn/ui | Latest | Radix UI primitives, Copy-paste ownership, Accessible |
| **Markdown** | react-markdown | v10 | Secure rendering (no dangerouslySetInnerHTML), Plugin support |
| **Validation** | Zod | v3 | TypeScript type inference, Runtime validation, DX |
| **Date/Time** | date-fns | Latest | Tree-shakable, Lightweight (18kb), Native Date objects |
| **Testing** | Vitest + RTL | Latest | 3-4x faster than Jest, Vite-native, React Testing Library |

**Why TanStack Start over Vite?**
- Built-in SSR/SSG (no custom Vite config)
- Type-safe Server Functions (Backend integration elegant)
- File-based routing optimized for TanStack Router
- Better DX for full-stack apps

**Why shadcn/ui?**
- Code ownership (copy-paste, visible in GitHub)
- Radix UI = WCAG AA compliance built-in
- Modern aesthetic fits "Beeindruckt & Überzeugt" emotion
- Full Tailwind customization possible

### Backend Stack

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Framework** | NestJS | v11 | Enterprise-grade, Modular architecture, Best TypeScript support |
| **Runtime** | Node.js | 20 LTS | Stable, Long-term support, Wide ecosystem |
| **Database** | SQLite | Latest | Simple, File-based, Perfect for <50k users, Easy backups |
| **ORM** | TypeORM | Latest | NestJS-native, Migrations support, TypeScript decorators |
| **Auth** | Passport.js | v0.7.0 | NestJS integration, Session strategy for admin |
| **Password** | Argon2 | Latest | Password Hashing Competition winner, GPU-resistant, Memory-hard |
| **Security** | Helmet | v8 | Security headers (CSP, HSTS, etc.) |
| **Rate Limit** | @nestjs/throttler | v6.4.0 | Official NestJS package, Guard-based, Flexible config |
| **File Upload** | Multer | Latest | NestJS-native (FileInterceptor), Mature, Validation support |
| **PDF Parse** | pdf-parse | v2.4.5 | Simple text extraction, Active (published 15 days ago), Fast |
| **LLM** | Google Gemini | v1.28.0 | Cost-effective, Gemini 2.0 Flash, Native TypeScript (@google/genai) |
| **Tokens** | CUID2 | Latest | Collision-resistant (4 quadrillion IDs), Multiple entropy sources |
| **Validation** | Zod | v3 | Shared with frontend, TypeScript inference, DTO validation |
| **Logging** | Pino (nestjs-pino) | v4.4.1 | Fastest async logger, Structured JSON, Request context |
| **API Docs** | Swagger | Latest | OpenAPI 3.0, Interactive UI, Code generation |

**Why NestJS?**
- Mature (v11), Battle-tested
- Modular architecture scales well
- Enterprise patterns (Guards, Interceptors, Pipes)
- Best-in-class TypeScript DX

**Why SQLite?**
- Simple deployment (single file)
- Zero config, no separate DB server
- Sufficient for <50k requests/month
- Easy backups (cp command)
- Can migrate to PostgreSQL if scale requires

**Why Argon2 over bcrypt?**
- Modern (2015 PHC winner vs bcrypt 1999)
- Memory-hard design (GPU/ASIC resistant)
- Faster (~150ms vs ~250ms for bcrypt)
- Industry best practice 2025

**Why Google Gemini?**
- User preference (cost-effective)
- Gemini Flash = fast + cheap for CV extraction
- New SDK (@google/genai) supports Gemini 2.0 features
- OLD SDK (@google/generative-ai) deprecated Nov 30, 2025!

### Deployment Stack

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Containerization** | Docker + Docker Compose | Simple multi-container orchestration, Dev/Prod parity |
| **Reverse Proxy** | Nginx | SSL termination, Static assets, Rate limiting (Tier 1) |
| **SSL/TLS** | Let's Encrypt (Certbot) | Free, Auto-renewal, Trusted CA |
| **Domain** | Custom domain | Professional presence, SEO benefits |
| **CI/CD** | GitHub Actions | Automated testing, Build, Deploy on push |
| **Hosting** | VPS (Hetzner/DigitalOcean) | Cost-effective, Full control, Simple setup |

**Why Docker Compose over Kubernetes?**
- Personal project, single instance sufficient
- Simpler operations (no K8s complexity)
- Easy local dev/prod parity
- Can migrate to K8s if scale requires

### Shared Technologies

**TypeScript Everywhere:**
- Frontend: TanStack Start (TSX)
- Backend: NestJS (TS)
- Shared: Zod schemas, Type definitions

**Monorepo Structure (pnpm workspaces):**
```
cv-hub/
├── apps/
│   ├── frontend/        # TanStack Start
│   └── backend/         # NestJS
├── packages/
│   ├── shared-types/    # Zod schemas, DTOs
│   └── config/          # Shared configs
├── docker-compose.yml
├── package.json         # Root workspace
└── pnpm-workspace.yaml
```

**Benefits:**
- Shared TypeScript types (JSON Resume, API DTOs)
- Consistent dependencies
- Single `pnpm install` für beide Apps
- Simplified Docker builds

---

## Architecture Patterns

### 1. Privacy-First Data Filtering

**Pattern:** Dynamic data filtering based on authentication context

```typescript
// Pseudocode
interface CVData {
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  contact?: ContactInfo;  // Only for authenticated
  personal?: PersonalInfo; // Only for authenticated
}

class CVService {
  async getCV(context: 'public' | 'authenticated'): Promise<CVData> {
    const fullCV = await this.repository.findOne();

    if (context === 'public') {
      return this.filterPublicSubset(fullCV);
    }

    return fullCV; // Full data for authenticated
  }

  private filterPublicSubset(cv: CVData): CVData {
    return {
      skills: cv.skills.map(s => ({ name: s.name })), // No experience levels
      projects: cv.projects
        .filter(p => !p.isPrivate)
        .map(p => ({
          ...p,
          company: undefined,    // Redact company names
          metrics: undefined     // Redact business metrics
        })),
      experience: cv.experience.map(e => ({
        ...e,
        company: 'Confidential',  // Generic label
        achievements: e.achievements.slice(0, 3) // Limit details
      })),
      // contact and personal omitted (undefined)
    };
  }
}
```

**Key Decisions:**
- Server-side filtering (never send private data to client)
- Same API endpoint (`/api/cv/:context`)
- Context determined by token validation
- Zod schemas for validation at boundaries

### 2. Token-Based Access Control

**Pattern:** Stateless token validation for invite links

```typescript
// Token Entity
interface InviteToken {
  id: string;              // CUID2
  token: string;           // CUID2 (URL-safe)
  recipientName?: string;  // Optional
  message?: string;        // Markdown, optional
  expiresAt?: Date;        // null = never expires
  isActive: boolean;       // Manual deactivation
  visitCount: number;      // Incremented on access
  lastVisitAt?: Date;      // Last access timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Validation Flow
class InviteGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    const invite = await this.inviteService.findByToken(token);

    // Validation checks
    if (!invite) return false;                              // Token not found
    if (!invite.isActive) return false;                     // Manually deactivated
    if (invite.expiresAt && invite.expiresAt < new Date()) return false; // Expired

    // Track visit (async, don't block)
    this.inviteService.recordVisit(invite.id).catch(err => this.logger.error(err));

    // Attach invite to request for downstream use
    request.invite = invite;
    return true;
  }
}
```

**Key Decisions:**
- CUID2 tokens (collision-resistant, secure)
- Expire via expiresAt field (DB query efficient)
- Visit tracking anonymized (no IP storage, DSGVO-compliant)
- Guards enforce validation at route level
- Graceful degradation (expired → friendly error page)

### 3. JSON Resume Schema as Single Source of Truth

**Pattern:** Zod schema as contract between frontend, backend, and external formats

```typescript
// packages/shared-types/cv-schema.ts
import { z } from 'zod';

// Based on https://jsonresume.org/schema
export const SkillSchema = z.object({
  name: z.string(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  keywords: z.array(z.string()).optional(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  highlights: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  startDate: z.string().optional(), // ISO 8601
  endDate: z.string().optional(),
  url: z.string().url().optional(),
  roles: z.array(z.string()).optional(),
  entity: z.string().optional(), // Company name
  type: z.string().optional(),
  // cv-hub extensions
  isPrivate: z.boolean().default(false),
  metrics: z.string().optional(), // "100K+ users, 25% conversion increase"
});

export const CVSchema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string(), // "Senior Full-Stack Engineer"
    image: z.string().url().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional(),
    summary: z.string().optional(),
    location: z.object({
      city: z.string().optional(),
      countryCode: z.string().optional(),
    }).optional(),
    profiles: z.array(z.object({
      network: z.string(), // "LinkedIn", "GitHub"
      username: z.string(),
      url: z.string().url(),
    })).optional(),
  }),
  work: z.array(z.object({
    name: z.string().optional(), // Company name
    position: z.string(),
    url: z.string().url().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    isPrivate: z.boolean().default(false), // cv-hub extension
  })).optional(),
  education: z.array(z.object({
    institution: z.string(),
    url: z.string().url().optional(),
    area: z.string().optional(), // "Computer Science"
    studyType: z.string().optional(), // "Bachelor"
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    score: z.string().optional(),
    courses: z.array(z.string()).optional(),
  })).optional(),
  skills: z.array(SkillSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  // ... other JSON Resume fields
});

export type CV = z.infer<typeof CVSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
```

**Usage Across Stack:**
```typescript
// Backend DTO
import { CVSchema } from '@cv-hub/shared-types';

export class UpdateCVDto {
  @IsZod(CVSchema) // Custom Zod validator decorator
  cv: CV;
}

// Frontend Form
import { CVSchema } from '@cv-hub/shared-types';

const form = useForm({
  defaultValues: cv,
  onSubmit: async (values) => {
    const parsed = CVSchema.parse(values); // Runtime validation
    await updateCV(parsed);
  },
});

// LLM Extraction
const extractedData = await gemini.generateContent(prompt);
const validated = CVSchema.safeParse(JSON.parse(extractedData));
if (!validated.success) {
  // Show validation errors in review UI
}
```

**Benefits:**
- Single schema definition (DRY)
- Compile-time + Runtime validation
- Frontend/Backend contract enforced
- LLM output validation automatic
- JSON Resume standard compliance

### 4. KI-Extraction with Review Loop

**Pattern:** Human-in-the-loop for AI-generated data

```
User uploads PDF/Text
        │
        ▼
Backend receives file (Multer)
        │
        ▼
Extract text (pdf-parse)
        │
        ▼
Send to Gemini API with prompt
        │
        ▼
Gemini returns JSON (structured)
        │
        ▼
Validate against CVSchema (Zod)
        │
        ├─► Valid   ─► Store as "draft" version
        │                   │
        └─► Invalid ─► Extract errors, send to frontend
                            │
                            ▼
                    Frontend shows:
                    - Diff view (current vs extracted)
                    - Validation errors highlighted
                    - Inline editing available
                            │
                            ▼
                    User reviews, edits, approves
                            │
                            ▼
                    Backend stores as "active" version
                    Previous version archived
```

**Key Implementation:**
```typescript
// Backend Service
class CVExtractionService {
  async extractFromFile(file: Express.Multer.File): Promise<ExtractionResult> {
    // 1. Parse file
    const text = await this.parseFile(file);

    // 2. Call Gemini
    const prompt = this.buildExtractionPrompt(text);
    const response = await this.gemini.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    const rawJSON = this.extractJSON(response.text);

    // 3. Validate with Zod
    const validation = CVSchema.safeParse(rawJSON);

    if (validation.success) {
      // Store as draft
      const draft = await this.cvVersionRepo.save({
        data: validation.data,
        status: 'draft',
        source: 'ai-extraction',
        fileHash: this.hashFile(file),
      });

      return {
        success: true,
        draftId: draft.id,
        data: validation.data,
      };
    } else {
      // Return errors for review
      return {
        success: false,
        errors: validation.error.issues,
        rawData: rawJSON,
      };
    }
  }

  private buildExtractionPrompt(text: string): string {
    return `
Extract CV information from the following text and return ONLY valid JSON matching this schema:

${JSON.stringify(CVSchema.shape, null, 2)}

Rules:
- Use ISO 8601 for dates (YYYY-MM-DD)
- Extract ALL skills, projects, and work experience
- For work experience, extract company names, roles, dates, achievements
- For projects, extract descriptions, tech stack, metrics if mentioned
- Infer skill levels from context if not explicit
- Return ONLY the JSON, no markdown code blocks

Text to extract:
---
${text}
---

JSON Output:`;
  }
}
```

**Frontend Review UI:**
```typescript
// Diff Viewer Component
<DiffViewer
  current={currentCV}
  extracted={extractedCV}
  errors={validationErrors}
  onApprove={async (edited) => {
    await publishCV(edited);
  }}
  onReject={() => {
    await deleteDraft(draftId);
  }}
/>
```

**Benefits:**
- AI acceleration (90% of data entry automated)
- Human validation (catch AI errors)
- Versionierung (rollback possible)
- Flexible (manual editing if AI fails)

### 5. Selective SSR for Performance

**Pattern:** SSR for public/invited views, CSR for admin dashboard

```typescript
// TanStack Router config
// apps/frontend/app/routes/__root.tsx

export const Route = createRootRoute({
  component: RootComponent,
});

// Public CV - SSR
// apps/frontend/app/routes/index.tsx
export const Route = createFileRoute('/')({
  loader: async () => {
    // Server-side data fetch
    const cv = await fetchCV('public');
    return { cv };
  },
  component: PublicCVPage,
  ssr: true, // Enable SSR for this route
});

// Invited CV - SSR
// apps/frontend/app/routes/invite/$token.tsx
export const Route = createFileRoute('/invite/$token')({
  loader: async ({ params }) => {
    const invite = await validateToken(params.token);
    if (!invite.valid) {
      throw redirect({ to: '/invite-invalid' });
    }
    const cv = await fetchCV('authenticated', params.token);
    return { cv, invite };
  },
  component: InvitedCVPage,
  ssr: true, // SSR for SEO (if recruiter shares link)
});

// Admin Dashboard - CSR
// apps/frontend/app/routes/admin/index.tsx
export const Route = createFileRoute('/admin/')({
  beforeLoad: async ({ context }) => {
    // Client-side auth check
    const session = await checkSession();
    if (!session) {
      throw redirect({ to: '/admin/login' });
    }
  },
  component: AdminDashboard,
  ssr: false, // No SSR for admin (CSR sufficient)
});
```

**Benefits:**
- Public/Invited: Fast FCP (<1.5s), SEO-optimized, Social sharing previews
- Admin: Interactive SPA, no SSR overhead, faster development
- Best of both worlds

---

## Component Architecture

### Frontend Component Structure

```
apps/frontend/
├── app/
│   ├── routes/                    # File-based routing
│   │   ├── __root.tsx             # Root layout
│   │   ├── index.tsx              # Public CV (/)
│   │   ├── invite/
│   │   │   ├── $token.tsx         # Invited CV (/invite/:token)
│   │   │   └── invalid.tsx        # Invalid token page
│   │   └── admin/
│   │       ├── index.tsx          # Dashboard
│   │       ├── login.tsx          # Login page
│   │       ├── links.tsx          # Link management
│   │       └── cv/
│   │           ├── extract.tsx    # CV upload/extract
│   │           └── versions.tsx   # Version history
│   ├── components/
│   │   ├── ui/                    # shadcn/ui (generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (16 components)
│   │   ├── custom/                # Custom components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StickyNav.tsx
│   │   │   ├── SkillTag.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   ├── PersonalMessageCard.tsx
│   │   │   ├── InvitedAccessBadge.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── LinkTableRow.tsx
│   │   │   ├── DiffViewer.tsx
│   │   │   ├── UploadZone.tsx
│   │   │   └── ProgressSteps.tsx
│   │   └── layouts/
│   │       ├── PublicLayout.tsx
│   │       ├── AdminLayout.tsx
│   │       └── InviteLayout.tsx
│   ├── lib/
│   │   ├── api.ts                 # API client (TanStack Query)
│   │   ├── utils.ts               # Utility functions
│   │   └── hooks/                 # Custom React hooks
│   ├── styles/
│   │   └── globals.css            # Tailwind imports, custom styles
│   ├── client.tsx                 # Client entry
│   ├── server.tsx                 # SSR entry
│   └── router.tsx                 # Router config
├── public/                        # Static assets
├── app.config.ts                  # TanStack Start config
└── package.json
```

**Key Component Patterns:**

**1. Custom Components = Project-Specific Logic**
```typescript
// components/custom/ProjectCard.tsx
interface ProjectCardProps {
  project: Project;
  variant: 'public' | 'authenticated';
}

export function ProjectCard({ project, variant }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        {variant === 'authenticated' && project.entity && (
          <Badge variant="secondary">{project.entity}</Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-zinc-600">{project.description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.keywords?.map(tech => (
            <SkillTag key={tech} name={tech} />
          ))}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 space-y-2">
            {project.highlights?.map((h, i) => (
              <li key={i} className="text-sm">{h}</li>
            ))}

            {variant === 'authenticated' && project.metrics && (
              <p className="text-sm text-orange-600 font-medium">
                📊 {project.metrics}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

**2. shadcn/ui Components = Primitives**
- Used as-is or extended
- Consistent design language
- Accessible by default (Radix)

**3. Layout Components = Page Structure**
```typescript
// components/layouts/PublicLayout.tsx
export function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <StickyNav variant="public" />
      <main className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// components/layouts/AdminLayout.tsx
export function AdminLayout({ children }: PropsWithChildren) {
  const { session } = useAuth();

  if (!session) {
    throw redirect({ to: '/admin/login' });
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNav user={session.user} />
      <aside className="w-64 fixed left-0 top-16 h-full border-r">
        <AdminSidebar />
      </aside>
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
```

### Backend Module Structure

```
apps/backend/
├── src/
│   ├── modules/
│   │   ├── cv/                    # CV Data Module
│   │   │   ├── cv.module.ts
│   │   │   ├── cv.controller.ts   # GET /api/cv/:context
│   │   │   ├── cv.service.ts      # Business logic
│   │   │   ├── entities/
│   │   │   │   ├── cv.entity.ts
│   │   │   │   └── cv-version.entity.ts
│   │   │   └── dto/
│   │   │       ├── get-cv.dto.ts
│   │   │       └── update-cv.dto.ts
│   │   ├── invite/                # Link Management Module
│   │   │   ├── invite.module.ts
│   │   │   ├── invite.controller.ts
│   │   │   ├── invite.service.ts
│   │   │   ├── entities/
│   │   │   │   └── invite.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-invite.dto.ts
│   │   │   │   └── update-invite.dto.ts
│   │   │   └── guards/
│   │   │       └── invite.guard.ts
│   │   ├── admin/                 # Admin Auth Module
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── local.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── admin-auth.guard.ts
│   │   │   └── dto/
│   │   │       └── login.dto.ts
│   │   └── extraction/            # KI Extraction Module
│   │       ├── extraction.module.ts
│   │       ├── extraction.controller.ts
│   │       ├── extraction.service.ts
│   │       ├── gemini.service.ts  # Gemini API wrapper
│   │       └── dto/
│   │           ├── extract.dto.ts
│   │           └── extraction-result.dto.ts
│   ├── common/                    # Shared code
│   │   ├── decorators/
│   │   │   └── zod-validation.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── throttler.guard.ts
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   └── pipes/
│   │       └── zod-validation.pipe.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── app.config.ts
│   │   └── gemini.config.ts
│   ├── database/
│   │   └── migrations/
│   ├── main.ts                    # Entry point
│   └── app.module.ts              # Root module
├── test/
│   ├── unit/
│   └── e2e/
└── package.json
```

**Key Module Patterns:**

**1. Feature-Based Modules**
- Each module = distinct domain (CV, Invite, Admin, Extraction)
- Self-contained (controller, service, entities, DTOs)
- Clear dependencies (e.g., Extraction depends on CV)

**2. Common Module = Shared Utilities**
- Decorators, Guards, Filters, Pipes
- Reusable across features
- No business logic

**3. TypeORM Entities = Database Schema**
```typescript
// modules/invite/entities/invite.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string; // CUID2

  @Column({ nullable: true })
  recipientName?: string;

  @Column({ type: 'text', nullable: true })
  message?: string; // Markdown

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  visitCount: number;

  @Column({ type: 'datetime', nullable: true })
  lastVisitAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**4. DTOs with Zod Validation**
```typescript
// modules/invite/dto/create-invite.dto.ts
import { z } from 'zod';

export const CreateInviteDtoSchema = z.object({
  recipientName: z.string().optional(),
  message: z.string().max(1000).optional(), // Limit markdown length
  expiresAt: z.string().datetime().optional(), // ISO 8601
  isActive: z.boolean().default(true),
});

export type CreateInviteDto = z.infer<typeof CreateInviteDtoSchema>;

// Usage in controller
@Post()
@UseGuards(AdminAuthGuard)
async create(@Body(new ZodValidationPipe(CreateInviteDtoSchema)) dto: CreateInviteDto) {
  return this.inviteService.create(dto);
}
```

---

## Data Architecture

### Database Schema (SQLite)

```sql
-- CV Data (Single Row - JSON Resume Schema)
CREATE TABLE cv (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,              -- JSON string (CVSchema)
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CV Versions (Backup & Rollback)
CREATE TABLE cv_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cv_id INTEGER NOT NULL,
  data TEXT NOT NULL,              -- JSON string
  status TEXT NOT NULL,            -- 'draft', 'active', 'archived'
  source TEXT,                     -- 'manual', 'ai-extraction', 'rollback'
  file_hash TEXT,                  -- SHA-256 of uploaded file (for dedup)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cv_id) REFERENCES cv(id)
);

-- Invite Links
CREATE TABLE invites (
  id TEXT PRIMARY KEY,             -- CUID2
  token TEXT UNIQUE NOT NULL,      -- CUID2 (URL-safe)
  recipient_name TEXT,
  message TEXT,                    -- Markdown
  expires_at DATETIME,
  is_active BOOLEAN DEFAULT 1,
  visit_count INTEGER DEFAULT 0,
  last_visit_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_expires_at ON invites(expires_at);

-- Admin Session (express-session + connect-sqlite3)
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,              -- JSON session data
  expired DATETIME NOT NULL
);

CREATE INDEX idx_sessions_expired ON sessions(expired);

-- Admin User (Single Row for MVP)
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,     -- Argon2
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- File Uploads (for CV extraction)
CREATE TABLE file_uploads (
  id TEXT PRIMARY KEY,             -- UUID
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  filepath TEXT NOT NULL,          -- /app/uploads/cv-imports/{stored_filename}
  mimetype TEXT NOT NULL,
  size INTEGER NOT NULL,           -- Bytes
  sha256 TEXT NOT NULL,            -- File hash for deduplication
  cv_version_id INTEGER,           -- Link to cv_versions if processed
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME,             -- Soft delete
  FOREIGN KEY (cv_version_id) REFERENCES cv_versions(id)
);

CREATE INDEX idx_file_uploads_cv_version ON file_uploads(cv_version_id);
CREATE INDEX idx_file_uploads_deleted_at ON file_uploads(deleted_at);
```

**Key Design Decisions:**

1. **Single CV Row:** Personal project, one user, simple
2. **CV Versions:** Immutable history, rollback support, AI draft storage
3. **Invite Tokens:** CUID2 for security, SQLite indexes for performance
4. **Session Storage:** File-based sessions via connect-sqlite3
5. **File Storage:** Local file system (Docker volume) with database metadata tracking
6. **No Migrations for MVP:** SQLite schema init on first run, migrations later

### Data Flow Diagrams

**Public CV Request:**
```
User → Nginx → Frontend (SSR) → Backend API → SQLite
                  ↓                    ↓
              TanStack Query      cv.service.getCV('public')
                  ↓                    ↓
              React Component     Filter private data
                  ↓                    ↓
              Browser (Hydration) Return public subset
```

**Invited CV Request:**
```
User clicks /invite/:token
        ↓
Frontend SSR loader validates token
        ↓
Backend /api/invite/:token validates
        ↓
SQLite: Check token exists, active, not expired
        ↓
If valid: Record visit (async)
        ↓
Backend /api/cv/private/:token returns full CV
        ↓
Frontend SSR renders with personal message
        ↓
Browser hydrates (interactive)
```

**KI Extraction Flow:**
```
Admin uploads PDF → Multer (Backend)
        ↓
pdf-parse extracts text
        ↓
Text → Gemini API (gemini-2.0-flash-001)
        ↓
Gemini returns JSON string
        ↓
Zod validates against CVSchema
        ↓
├─ Valid → Save as cv_version (status: 'draft')
│           ↓
│        Return draftId to frontend
│           ↓
│        Frontend: DiffViewer shows current vs draft
│           ↓
│        Admin reviews, edits inline, clicks "Publish"
│           ↓
│        Backend: Update cv.data, archive old version
│
└─ Invalid → Return Zod errors
            ↓
         Frontend: Highlight errors in UI
            ↓
         Admin can manually fix or retry
```

---

## File Storage Strategy

### Overview

**Approach:** Local file system storage within Docker volume for privacy-first architecture alignment.

**Key Principles:**
- **Privacy-First:** Files stored locally, no third-party cloud dependencies
- **Simple Operations:** Direct file system access, no S3/cloud SDK complexity
- **Docker-Native:** Volume persistence across container restarts
- **Development Parity:** Same storage mechanism in dev and production

### Storage Architecture

```
Docker Volume: cv-hub-uploads
├── /app/uploads/
│   ├── cv-imports/              # Uploaded CV files (PDF, DOCX, TXT)
│   │   └── {timestamp}-{hash}-{filename}
│   └── temp/                    # Temporary processing files
│       └── {uuid}-{filename}    # Cleaned up after processing
```

**Volume Configuration (docker-compose.yml):**
```yaml
volumes:
  cv-hub-uploads:
    driver: local

services:
  backend:
    volumes:
      - cv-hub-uploads:/app/uploads
```

### File Upload Implementation

**Technology:** Multer (NestJS native middleware)

**Configuration:**
```typescript
// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createHash } from 'crypto';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/cv-imports',
    filename: (req, file, callback) => {
      const timestamp = Date.now();
      const hash = createHash('md5')
        .update(file.originalname + timestamp)
        .digest('hex')
        .slice(0, 8);
      const ext = extname(file.originalname);
      const safeFilename = file.originalname
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .slice(0, 50);

      callback(null, `${timestamp}-${hash}-${safeFilename}${ext}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Allowed: PDF, DOCX, TXT'), false);
    }
  }
};
```

### File Metadata Tracking

**Entity:** FileUpload (TypeORM)

```typescript
@Entity('file_uploads')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalFilename: string;

  @Column()
  storedFilename: string; // Filename on disk

  @Column()
  filepath: string; // Full path: /app/uploads/cv-imports/{storedFilename}

  @Column()
  mimetype: string;

  @Column()
  size: number; // Bytes

  @Column()
  sha256: string; // File hash for deduplication

  @Column({ nullable: true })
  cvVersionId: number; // Link to cv_versions if processed

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date; // Soft delete
}
```

### Security Measures

1. **Filename Sanitization:**
   - Remove special characters
   - Add timestamp + hash to prevent collisions
   - Limit filename length (50 chars)

2. **MIME Type Validation:**
   - Whitelist: PDF, DOCX, TXT only
   - Server-side validation (not just extension check)

3. **File Size Limits:**
   - Max 10 MB per file
   - Prevents DoS via large uploads

4. **Path Traversal Prevention:**
   - No user input in file paths
   - Files stored in controlled directory

5. **Virus Scanning (Future):**
   - Post-MVP: Integrate ClamAV for production
   - For MVP: Manual review sufficient (single admin user)

### File Lifecycle

**Upload → Process → Retain/Delete:**

```typescript
// 1. Upload
POST /api/cv/upload
- Multer saves to disk
- FileUpload record created
- Returns fileId

// 2. Process (AI Extraction)
POST /api/cv/extract/:fileId
- Read file from disk
- Extract text → Gemini API
- Create cv_version draft
- Link FileUpload.cvVersionId

// 3. Cleanup (Background Job)
- Daily cron: Delete files older than 30 days with no cvVersionId
- Soft delete: Set deletedAt timestamp
- Hard delete: Remove from disk after 90 days
```

### Backup Strategy

**Files are backed up as part of Docker volume backups:**

```bash
# Backup script (Epic 7 - Production Deployment)
docker run --rm \
  -v cv-hub-uploads:/data \
  -v /backup:/backup \
  alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

**Backup Schedule:** Daily at 3 AM UTC
**Retention:** 30 days of daily backups
**Recovery:** Extract tar.gz to volume

### Migration Path (Future)

If project scales beyond single-instance deployment:

**Phase 1 (Current):** Local file system
**Phase 2 (Future):** S3-compatible storage (MinIO or AWS S3)

**Migration Strategy:**
1. Add S3 adapter alongside local storage
2. Run dual-write mode (local + S3) for 30 days
3. Migrate existing files to S3
4. Switch to S3-only mode
5. Deprecate local storage

**Code Impact:** Abstracted via FileStorageService interface (low refactor cost)

---

## API Design

### RESTful Endpoints

**Public API (No Auth):**
```
GET  /api/cv/public
- Returns: Public CV subset (CVSchema filtered)
- Cache: 5 minutes
- Rate Limit: 100 req/15min per IP

GET  /api/invite/:token
- Returns: { valid: boolean, invite?: { recipientName, message } }
- Validates: Token exists, active, not expired
- Side Effect: Records visit (async)
- Rate Limit: 50 req/15min per IP

GET  /api/cv/private/:token
- Returns: Full CV (CVSchema)
- Requires: Valid token (via InviteGuard)
- Rate Limit: 50 req/15min per token
```

**Admin API (Session Auth Required):**
```
POST /api/admin/auth/login
- Body: { username, password }
- Returns: { success: boolean, session?: { user } }
- Sets: HttpOnly session cookie
- Rate Limit: 5 req/15min per IP

POST /api/admin/auth/logout
- Destroys session
- Clears cookie

GET  /api/admin/auth/status
- Returns: { authenticated: boolean, user?: { username } }

--- Invites ---

GET  /api/admin/invites
- Returns: Array<Invite>
- Query: ?status=active|expired|all&search=name

POST /api/admin/invites
- Body: CreateInviteDto
- Returns: { invite: Invite, url: string }

GET  /api/admin/invites/:id
- Returns: Invite with detailed stats

PATCH /api/admin/invites/:id
- Body: UpdateInviteDto (partial)
- Returns: Updated Invite

DELETE /api/admin/invites/:id
- Soft delete (sets isActive=false)

--- CV Management ---

GET  /api/admin/cv
- Returns: Current CV (full CVSchema)

PATCH /api/admin/cv
- Body: Partial<CV>
- Returns: Updated CV
- Side Effect: Archives old version

GET  /api/admin/cv/versions
- Returns: Array<CVVersion>
- Query: ?limit=10&offset=0

POST /api/admin/cv/rollback/:versionId
- Restores CV from version
- Archives current as backup

--- Extraction ---

POST /api/admin/cv/extract
- Body: multipart/form-data (file)
- Accepts: .pdf, .txt, .md, .docx (max 10MB)
- Returns: { success, draftId?, data?, errors? }
- Rate Limit: 5 req/hour

GET  /api/admin/cv/extract/:draftId
- Returns: Draft version data

POST /api/admin/cv/extract/:draftId/publish
- Publishes draft as active CV
- Archives previous version
```

### API Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "message",
        "issue": "String must contain at most 1000 character(s)"
      }
    ]
  }
}
```

**Pagination:**
```json
{
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasNext": true
  }
}
```

### Swagger/OpenAPI Documentation

**Auto-Generated from NestJS:**
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('cv-hub API')
  .setDescription('Privacy-First CV Management System API')
  .setVersion('1.0')
  .addCookieAuth('session')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Accessible at:** `http://localhost:3000/api/docs`

**Benefits:**
- Interactive API testing
- Auto-generated client types (OpenAPI Generator)
- Documentation always in sync with code

---

## Security Architecture

### Authentication & Authorization

**Admin Authentication: Session-Based**
```typescript
// Passport Local Strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private adminService: AdminService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.adminService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Argon2 verification
    const isValid = await argon2.verify(user.passwordHash, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, username: user.username };
  }
}

// Session Configuration
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';

const SQLiteStoreSession = SQLiteStore(session);

app.use(
  session({
    store: new SQLiteStoreSession({ db: 'sessions.db' }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    },
  }),
);
```

**Token-Based Access: Invite Links**
```typescript
// Stateless validation (no session)
@Injectable()
export class InviteGuard implements CanActivate {
  constructor(private inviteService: InviteService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    const invite = await this.inviteService.findByToken(token);

    if (!invite || !invite.isActive) {
      throw new ForbiddenException('Invalid or inactive invite');
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new ForbiddenException('Invite has expired');
    }

    // Record visit (fire-and-forget)
    this.inviteService.recordVisit(invite.id).catch(err => {
      this.logger.error('Failed to record visit', err);
    });

    request.invite = invite;
    return true;
  }
}
```

### Security Headers (Helmet)

```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Tailwind inline styles
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"], // Gemini API
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' }, // No iframes
  noSniff: true,
  xssFilter: true,
}));
```

### CSRF Protection

```typescript
// CSRF Guard (Admin Routes Only)
import { csurf } from 'csurf';

// Apply to admin routes
app.use('/api/admin', csurf({ cookie: true }));

// Frontend must include CSRF token in headers
// Token available in cookie: XSRF-TOKEN
```

### Rate Limiting

```typescript
// Throttler Configuration
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'public',
        ttl: 60000 * 15, // 15 minutes
        limit: 100,
      },
      {
        name: 'admin',
        ttl: 60000 * 15,
        limit: 50,
      },
      {
        name: 'extraction',
        ttl: 60000 * 60, // 1 hour
        limit: 5,
      },
    ]),
  ],
})
export class AppModule {}

// Apply to routes
@Controller('api/admin/cv')
@UseGuards(ThrottlerGuard)
@Throttle({ default: { name: 'admin', ttl: 60000 * 15, limit: 50 } })
export class CVController { ... }

@Post('extract')
@Throttle({ default: { name: 'extraction', ttl: 60000 * 60, limit: 5 } })
async extract(@UploadedFile() file: Express.Multer.File) { ... }
```

### Data Validation & Sanitization

```typescript
// Zod Validation Pipe
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsed = this.schema.parse(value);
      return parsed;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.issues.map(issue => ({
              field: issue.path.join('.'),
              issue: issue.message,
            })),
          },
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

// Usage
@Post()
async create(@Body(new ZodValidationPipe(CreateInviteDtoSchema)) dto: CreateInviteDto) {
  // dto is validated and typed
}
```

### Password Security

**Argon2 Configuration:**
```typescript
import * as argon2 from 'argon2';

// Hash password (registration/update)
const hash = await argon2.hash(password, {
  type: argon2.argon2id, // Hybrid (memory + CPU)
  memoryCost: 65536,     // 64 MB
  timeCost: 3,           // 3 iterations
  parallelism: 4,        // 4 threads
});

// Verify password (login)
const isValid = await argon2.verify(hash, password);
```

**Benefits:**
- Memory-hard (GPU/ASIC resistant)
- 2015 Password Hashing Competition winner
- ~150ms hash time (good UX, secure)

### HTTPS & SSL

**Let's Encrypt (Certbot) in Docker:**
```yaml
# docker-compose.yml
services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"
```

**Nginx SSL Config:**
```nginx
server {
    listen 443 ssl http2;
    server_name cv-hub.example.com;

    ssl_certificate /etc/letsencrypt/live/cv-hub.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cv-hub.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Proxy to backend
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy to frontend
    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Privacy & GDPR Compliance

**Data Minimization:**
- No IP addresses stored (only visit count)
- No user tracking cookies (except admin session)
- Invite tokens = no PII (unless recipientName explicitly added)

**Data Retention:**
- CV versions: Unlimited (user-controlled)
- Invite links: User-controlled expiration
- Sessions: 7 days max
- Logs: 30 days retention

**Right to be Forgotten:**
- Delete invite link = deletes token, message, statistics
- Delete CV = deletes all versions
- Admin can export all data (JSON)

---

## Performance & Scalability

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **First Contentful Paint (FCP)** | <1.5s | Fast impression for recruiters |
| **Time to Interactive (TTI)** | <3.0s | Smooth interaction start |
| **Lighthouse Performance** | >90 | Industry best practice |
| **Lighthouse SEO** | >90 | Discoverability critical |
| **Lighthouse Accessibility** | >90 | WCAG AA compliance |
| **Bundle Size (Frontend)** | <200KB gzip | Fast load on mobile |
| **API Response Time (p95)** | <200ms | Perceived instant |
| **Database Query Time (p95)** | <50ms | SQLite fast for reads |

### Performance Optimizations

**Frontend:**
```typescript
// 1. Code Splitting (TanStack Router auto-splits by route)
// Each route is lazy-loaded

// 2. Image Optimization
import { Image } from '@tanstack/start';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  loading="lazy"
  placeholder="blur"
/>

// 3. Prefetching (TanStack Router)
<Link to="/invite/$token" params={{ token }} preload="intent">
  {/* Preloads on hover */}
</Link>

// 4. TanStack Query Caching
const { data: cv } = useQuery({
  queryKey: ['cv', 'public'],
  queryFn: fetchPublicCV,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});

// 5. Component Lazy Loading
const DiffViewer = lazy(() => import('@/components/custom/DiffViewer'));

// 6. Tailwind Purging (auto in production)
// Only used classes in bundle
```

**Backend:**
```typescript
// 1. Database Indexing (already defined in schema)
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_expires_at ON invites(expires_at);

// 2. Query Optimization
// Avoid N+1 queries
const invites = await this.inviteRepo.find({
  relations: ['visits'], // If relation exists
  where: { isActive: true },
});

// 3. Response Caching (Simple in-memory)
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({ ttl: 300 })], // 5 min
})
export class CVModule {}

@Controller('api/cv')
export class CVController {
  @Get('public')
  @UseInterceptors(CacheInterceptor)
  async getPublic() {
    return this.cvService.getCV('public');
  }
}

// 4. Async Operations
// Don't block response for visit tracking
async recordVisit(inviteId: string): Promise<void> {
  // Fire and forget
  setImmediate(async () => {
    await this.inviteRepo.increment({ id: inviteId }, 'visitCount', 1);
    await this.inviteRepo.update(inviteId, { lastVisitAt: new Date() });
  });
}

// 5. Pagination
@Get('invites')
async findAll(
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
) {
  const [data, total] = await this.inviteRepo.findAndCount({
    take: limit,
    skip: offset,
  });

  return {
    data,
    pagination: { total, limit, offset, hasNext: offset + limit < total },
  };
}
```

### Scalability Considerations

**Current Architecture (MVP):**
- Single server (Docker Compose)
- SQLite (file-based)
- No load balancer
- Target: <50k requests/month, <1000 concurrent users

**Scale Path (if needed):**

**Phase 1: Vertical Scaling (10x capacity)**
- Upgrade VPS (more CPU, RAM)
- PostgreSQL migration (supports concurrent writes better)
- Redis for session storage + caching
- Nginx rate limiting tuning

**Phase 2: Horizontal Scaling (100x capacity)**
- Load balancer (Nginx/HAProxy)
- Multiple backend instances (stateless)
- PostgreSQL read replicas
- CDN for static assets (Cloudflare)
- Redis Cluster for distributed cache

**Phase 3: Microservices (1000x capacity)**
- Separate CV Service, Invite Service, Extraction Service
- Message queue for async tasks (BullMQ + Redis)
- S3 for file storage (PDFs, images)
- Kubernetes for orchestration

**Bottleneck Analysis:**
- **SQLite:** Limits ~100 concurrent writes/sec
  - **Solution:** PostgreSQL (10,000+ writes/sec)
- **Gemini API:** Rate limits TBD (check docs)
  - **Solution:** Request queuing, retry logic
- **File uploads:** Disk I/O on single server
  - **Solution:** S3 or Cloudflare R2

---

## Deployment Architecture

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  # Frontend (TanStack Start)
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://backend:3000
    expose:
      - "5173"
    restart: unless-stopped

  # Backend (NestJS)
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./data/cv-hub.db
      - SESSION_SECRET=${SESSION_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./data:/app/data         # SQLite DB + sessions
      - ./uploads:/app/uploads   # Uploaded files
    expose:
      - "3000"
    restart: unless-stopped

  # Certbot (SSL Renewal)
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  data:
  uploads:
```

**Dockerfile (Backend):**
```dockerfile
# apps/backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/backend/ ./apps/backend/
COPY packages/ ./packages/

# Build
RUN pnpm --filter backend build

# Production image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy built files
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./

# Create data directory
RUN mkdir -p /app/data /app/uploads

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Dockerfile (Frontend):**
```dockerfile
# apps/frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

COPY apps/frontend/ ./apps/frontend/
COPY packages/ ./packages/

# Build for production (SSR)
RUN pnpm --filter frontend build

# Production image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/frontend/.output ./output
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5173

CMD ["node", "./output/server/index.mjs"]
```

### Environment Variables

**`.env` (root):**
```bash
# Backend
NODE_ENV=production
DATABASE_URL=file:./data/cv-hub.db
SESSION_SECRET=<generate-with-openssl-rand-hex-32>
GEMINI_API_KEY=<your-google-gemini-api-key>

# Admin Credentials (set on first run)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong-password>

# Domain
DOMAIN=cv-hub.example.com

# Ports (internal)
BACKEND_PORT=3000
FRONTEND_PORT=5173
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Test Backend
        run: pnpm --filter backend test

      - name: Test Frontend
        run: pnpm --filter frontend test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Build
        run: pnpm run build

      - name: Build Docker Images
        run: |
          docker build -t cv-hub-backend ./apps/backend
          docker build -t cv-hub-frontend ./apps/frontend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/cv-hub
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose logs -f --tail=100
```

### Deployment Checklist

**Pre-Deploy:**
- [ ] Environment variables set in `.env`
- [ ] Domain DNS configured (A record → VPS IP)
- [ ] SSL certificate obtained (Certbot)
- [ ] Admin password generated
- [ ] Gemini API key obtained
- [ ] Database backed up (if migrating)

**Deploy:**
```bash
# On VPS
cd /opt
git clone https://github.com/username/cv-hub.git
cd cv-hub

# Copy environment template
cp .env.example .env
nano .env  # Fill in secrets

# Initial setup
docker-compose up -d

# Check logs
docker-compose logs -f

# Obtain SSL (first time)
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d cv-hub.example.com \
  --email your-email@example.com \
  --agree-tos
```

**Post-Deploy Verification:**
- [ ] HTTPS works (https://cv-hub.example.com)
- [ ] Public CV loads (`/`)
- [ ] Admin login works (`/admin/login`)
- [ ] Test invite link creation
- [ ] Test CV extraction (upload PDF)
- [ ] Lighthouse audit (>90 all categories)
- [ ] SSL Labs test (A or A+ rating)

### Backup Strategy

**Automated Backups (Daily):**
```bash
# Backup script (cron daily)
#!/bin/bash
BACKUP_DIR="/opt/cv-hub-backups"
DATE=$(date +%Y-%m-%d)

# Backup SQLite DB
cp /opt/cv-hub/data/cv-hub.db "$BACKUP_DIR/cv-hub-$DATE.db"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" /opt/cv-hub/uploads

# Keep last 30 days
find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/cv-hub-$DATE.db" s3://cv-hub-backups/
```

**Recovery:**
```bash
# Restore from backup
docker-compose down
cp /opt/cv-hub-backups/cv-hub-2025-11-03.db /opt/cv-hub/data/cv-hub.db
docker-compose up -d
```

---

## Testing Strategy

### Testing Pyramid

```
         ┌─────────────┐
         │  E2E Tests  │  (10%) - Critical paths
         │   Playwright│
         └──────┬──────┘
                │
      ┌─────────┴─────────┐
      │ Integration Tests │  (30%) - API + DB
      │    Jest + Supertest│
      └─────────┬─────────┘
                │
    ┌───────────┴───────────┐
    │    Unit Tests         │  (60%) - Pure logic
    │   Vitest (FE), Jest (BE)│
    └───────────────────────┘
```

### Unit Tests

**Frontend (Vitest):**
```typescript
// apps/frontend/app/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { filterPublicCV } from './utils';

describe('filterPublicCV', () => {
  it('should remove contact info from CV', () => {
    const fullCV = {
      basics: { name: 'John Doe', email: 'john@example.com' },
      skills: [{ name: 'React' }],
    };

    const publicCV = filterPublicCV(fullCV);

    expect(publicCV.basics.email).toBeUndefined();
    expect(publicCV.skills).toHaveLength(1);
  });
});
```

**Backend (Jest):**
```typescript
// apps/backend/src/modules/invite/invite.service.spec.ts
import { Test } from '@nestjs/testing';
import { InviteService } from './invite.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invite } from './entities/invite.entity';

describe('InviteService', () => {
  let service: InviteService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        InviteService,
        { provide: getRepositoryToken(Invite), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(InviteService);
  });

  it('should validate active token', async () => {
    const invite = { token: 'abc123', isActive: true, expiresAt: null };
    mockRepo.findOne.mockResolvedValue(invite);

    const result = await service.validateToken('abc123');

    expect(result.valid).toBe(true);
  });

  it('should reject expired token', async () => {
    const invite = {
      token: 'abc123',
      isActive: true,
      expiresAt: new Date('2025-01-01'),
    };
    mockRepo.findOne.mockResolvedValue(invite);

    const result = await service.validateToken('abc123');

    expect(result.valid).toBe(false);
  });
});
```

### Integration Tests

**Backend (Jest + Supertest):**
```typescript
// apps/backend/test/invite.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('InviteController (e2e)', () => {
  let app: INestApplication;
  let sessionCookie: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get session
    const res = await request(app.getHttpServer())
      .post('/api/admin/auth/login')
      .send({ username: 'admin', password: 'test' });

    sessionCookie = res.headers['set-cookie'];
  });

  it('/api/admin/invites (POST) should create invite', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/admin/invites')
      .set('Cookie', sessionCookie)
      .send({ recipientName: 'John Doe' })
      .expect(201);

    expect(res.body.invite).toHaveProperty('token');
    expect(res.body.url).toContain('/invite/');
  });

  it('/api/invite/:token (GET) should validate token', async () => {
    // Create invite first
    const createRes = await request(app.getHttpServer())
      .post('/api/admin/invites')
      .set('Cookie', sessionCookie)
      .send({});

    const token = createRes.body.invite.token;

    // Validate
    const res = await request(app.getHttpServer())
      .get(`/api/invite/${token}`)
      .expect(200);

    expect(res.body.valid).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### E2E Tests

**Frontend (Playwright):**
```typescript
// apps/frontend/e2e/public-cv.spec.ts
import { test, expect } from '@playwright/test';

test('Public CV loads and is accessible', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check hero section
  await expect(page.locator('h1')).toContainText('Ruben');

  // Check skills section
  const skills = page.locator('[data-testid="skill-tag"]');
  await expect(skills).toHaveCount(20); // Assuming 20 skills

  // Check projects section
  const projects = page.locator('[data-testid="project-card"]');
  await expect(projects.first()).toBeVisible();

  // Test "Show More" expansion
  await projects.first().locator('button', { hasText: 'Show More' }).click();
  await expect(projects.first().locator('[data-testid="project-details"]')).toBeVisible();

  // Lighthouse audit
  const accessibility = await page.accessibility.snapshot();
  expect(accessibility).toBeDefined();
});

test('Invite link flow', async ({ page, context }) => {
  // Admin creates link
  await page.goto('http://localhost:5173/admin/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'test');
  await page.click('button[type="submit"]');

  await page.goto('http://localhost:5173/admin/links');
  await page.click('button', { hasText: 'Create Link' });
  await page.fill('input[name="recipientName"]', 'John Doe');
  await page.fill('textarea[name="message"]', '# Hello John\nHere is my CV.');
  await page.click('button', { hasText: 'Generate Link' });

  // Copy token
  const url = await page.locator('[data-testid="invite-url"]').textContent();
  const token = url.split('/').pop();

  // Open invite link in new context (simulate different user)
  const invitePage = await context.newPage();
  await invitePage.goto(`http://localhost:5173/invite/${token}`);

  // Check personalized message
  await expect(invitePage.locator('[data-testid="personal-message"]')).toContainText('Hello John');

  // Check "Invited Access" badge
  await expect(invitePage.locator('[data-testid="invited-badge"]')).toBeVisible();

  // Check contact info visible (not in public view)
  await expect(invitePage.locator('[data-testid="contact-email"]')).toBeVisible();
});
```

### Test Coverage Goals

| Layer | Coverage Target |
|-------|----------------|
| Unit Tests (Backend) | >80% |
| Unit Tests (Frontend) | >70% |
| Integration Tests (API) | >60% |
| E2E Tests (Critical Paths) | 100% |

**Critical Paths:**
1. Public CV loads
2. Invite link creation → validation → personalized view
3. Admin login → dashboard
4. CV extraction → review → publish

---

## Development Workflow

### Local Development Setup

**Prerequisites:**
- Node.js 20 LTS
- pnpm 8+
- Docker + Docker Compose (optional, for local DB consistency)

**Setup:**
```bash
# Clone repo
git clone https://github.com/username/cv-hub.git
cd cv-hub

# Install dependencies (monorepo)
pnpm install

# Setup environment
cp .env.example .env
nano .env  # Fill in secrets

# Start backend (development)
pnpm --filter backend dev

# Start frontend (development)
pnpm --filter frontend dev

# Or use Docker Compose for full stack
docker-compose -f docker-compose.dev.yml up
```

**`docker-compose.dev.yml` (Development):**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./apps/backend/src:/app/src
      - ./data:/app/data
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./data/cv-hub.db
    command: pnpm dev

  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./apps/frontend/app:/app/app
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:3000
    command: pnpm dev
```

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fixes

**Commit Convention (Conventional Commits):**
```
feat(invite): add token expiration validation
fix(cv): correct public data filtering
docs(architecture): update deployment section
test(invite): add e2e tests for link flow
refactor(cv): extract filtering logic to service
```

**Pull Request Process:**
1. Create feature branch from `develop`
2. Implement feature with tests
3. Run `pnpm run lint` and `pnpm test`
4. Open PR to `develop` (not `main`)
5. CI runs tests, linting
6. Code review (optional for personal project)
7. Merge to `develop`
8. Periodic release: Merge `develop` → `main` → Deploys

### Code Quality Tools

**ESLint + Prettier:**
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off"
  }
}
```

**Husky Pre-Commit Hook:**
```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
pnpm test --run
```

### Development Commands

**Monorepo Scripts:**
```json
// package.json (root)
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter backend dev\" \"pnpm --filter frontend dev\"",
    "build": "pnpm --filter backend build && pnpm --filter frontend build",
    "test": "pnpm --filter backend test && pnpm --filter frontend test",
    "lint": "pnpm --filter backend lint && pnpm --filter frontend lint",
    "type-check": "pnpm --filter backend tsc --noEmit && pnpm --filter frontend tsc --noEmit"
  }
}
```

**Backend Scripts:**
```json
// apps/backend/package.json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "migrate": "typeorm migration:run -d src/config/database.config.ts"
  }
}
```

**Frontend Scripts:**
```json
// apps/frontend/package.json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Epic 1) - Week 1-2

**Goal:** Lokales Development-Environment steht

**Tasks:**
1. ✅ Monorepo Setup (pnpm workspaces)
   - Root package.json, pnpm-workspace.yaml
   - shared-types package

2. ✅ Backend Setup (NestJS)
   ```bash
   nest new cv-hub-backend --strict --package-manager=pnpm
   ```
   - Basic module structure (cv, invite, admin, extraction)
   - TypeORM + SQLite configuration
   - Swagger setup
   - Logging (Pino)

3. ✅ Frontend Setup (TanStack Start)
   ```bash
   pnpm create @tanstack/start@latest cv-hub-frontend
   ```
   - Tailwind CSS v4 setup
   - shadcn/ui installation
   - Basic routing structure
   - TanStack Query setup

4. ✅ Docker Compose (Development)
   - docker-compose.dev.yml
   - Dockerfiles for hot-reload

5. ✅ CI/CD Pipeline (GitHub Actions)
   - Linting, testing on PR
   - Basic deploy script

**Deliverables:**
- ✅ Backend läuft auf `localhost:3000`
- ✅ Frontend läuft auf `localhost:5173`
- ✅ CI/CD-Pipeline erfolgreich
- ✅ README mit Setup-Anleitung

---

### Phase 2: Data Layer (Epic 2) - Week 3-4

**Goal:** CV-Daten strukturiert und API verfügbar

**Tasks:**
1. ✅ JSON Resume Schema (Zod)
   - Define CVSchema in shared-types
   - Frontend + Backend import

2. ✅ CV Module (Backend)
   - CV Entity (TypeORM)
   - CVVersion Entity
   - CV Service (CRUD + Filtering)
   - CV Controller (Public/Private endpoints)

3. ✅ Seed Data
   - Example CV in JSON Resume format
   - Database seeding script

4. ✅ API Testing
   - Unit tests (Service)
   - Integration tests (Controller)

**Deliverables:**
- ✅ `GET /api/cv/public` - Public subset
- ✅ `GET /api/cv/private/:token` - Full CV (mocked token)
- ✅ Swagger docs visible
- ✅ Privacy filtering works

---

### Phase 3: Public Experience (Epic 3) - Week 5-7

**Goal:** Öffentliche CV-Seite live und begeisternd

**Tasks:**
1. ✅ Custom Components (Frontend)
   - HeroSection
   - StickyNav
   - SkillTag
   - ProjectCard
   - ExperienceCard

2. ✅ Public CV Page (SSR)
   - Route: `/` (index.tsx)
   - Server-side loader (fetch public CV)
   - Layout with sections (Hero, Skills, Projects, Experience, CTA)

3. ✅ SEO Optimization
   - Meta tags (Title, Description, OG, Twitter)
   - JSON-LD structured data (JSON Resume)
   - Sitemap.xml

4. ✅ Performance Optimization
   - Code splitting (auto)
   - Image optimization
   - Lighthouse audit (>90 target)

5. ✅ Accessibility
   - WCAG AA compliance
   - Keyboard navigation
   - Screen reader testing

**Deliverables:**
- ✅ Öffentliche Seite unter `/` erreichbar
- ✅ Lighthouse Score >90 (alle Kategorien)
- ✅ First Contentful Paint <1.5s
- ✅ Responsive (Mobile, Tablet, Desktop)

---

### Phase 4: Privacy Sharing (Epic 4) - Week 7-9

**Goal:** Personalisierte Links funktionieren

**Tasks:**
1. ✅ Invite Module (Backend)
   - Invite Entity (TypeORM)
   - Invite Service (CRUD, Token generation with CUID2)
   - Invite Controller (Public validation, Admin CRUD)
   - Invite Guard (Token validation)

2. ✅ Invite Page (Frontend)
   - Route: `/invite/:token`
   - Token validation in loader
   - PersonalMessageCard component
   - InvitedAccessBadge component
   - Full CV display

3. ✅ Visit Tracking
   - Async visit increment (fire-and-forget)
   - DSGVO-compliant (no IP storage)

4. ✅ Error Handling
   - Invalid token → Friendly error page
   - Expired token → Friendly error page
   - Deactivated token → Friendly error page

**Deliverables:**
- ✅ Token-Generierung funktioniert (CUID2)
- ✅ Link-Validierung korrekt
- ✅ Personalisierte Ansicht zeigt vollständigen CV
- ✅ Besuchsstatistiken werden getrackt
- ✅ Privacy-Compliance (keine IP-Speicherung)

---

### Phase 5: Admin Dashboard (Epic 5) - Week 9-11

**Goal:** Admin-Interface für Link-Verwaltung

**Tasks:**
1. ✅ Admin Auth Module (Backend)
   - Admin User Entity
   - Passport Local Strategy
   - Session configuration (express-session + connect-sqlite3)
   - Admin Guards

2. ✅ Admin Auth Pages (Frontend)
   - Route: `/admin/login`
   - Login form (username/password)
   - Session handling

3. ✅ Admin Dashboard (Frontend)
   - Route: `/admin` (overview)
   - StatsCard components (Total Links, Active, Visits)
   - Quick actions

4. ✅ Link Management (Frontend)
   - Route: `/admin/links`
   - LinkTableRow component
   - Create Link Dialog
   - Edit/Delete actions

5. ✅ Link Statistics
   - Visit count display
   - Last visit timestamp
   - Detail view (optional)

**Deliverables:**
- ✅ Admin kann sich einloggen
- ✅ Dashboard zeigt Übersicht
- ✅ Links können erstellt, bearbeitet, gelöscht werden
- ✅ Besuchsstatistiken sichtbar
- ✅ UI effizient bedienbar

---

### Phase 6: KI Maintenance (Epic 6) - Week 11-13

**Goal:** KI-Extraktion reduziert Wartungsaufwand

**Tasks:**
1. ✅ Extraction Module (Backend)
   - Gemini Service (@google/genai)
   - Extraction Service (File → Text → Gemini → Validation)
   - Extraction Controller (Upload endpoint)

2. ✅ File Handling (Backend)
   - Multer configuration (10MB limit, .pdf/.txt/.md/.docx)
   - pdf-parse integration
   - File validation

3. ✅ CV Upload (Frontend)
   - Route: `/admin/cv/extract`
   - UploadZone component (Drag & Drop)
   - ProgressSteps component

4. ✅ Review Interface (Frontend)
   - DiffViewer component (current vs extracted)
   - Inline editing (optional)
   - Validation errors display

5. ✅ Versionierung (Backend)
   - CVVersion Entity (already exists)
   - Draft status
   - Publish endpoint
   - Rollback endpoint

**Deliverables:**
- ✅ File-Upload funktioniert (Drag & Drop)
- ✅ LLM-Extraktion liefert valides JSON Resume
- ✅ Review-Interface zeigt extrahierte Daten
- ✅ Versionierung mit Backup funktioniert
- ✅ Rollback möglich

---

### Phase 7: Production Launch (Epic 7) - Week 14-15

**Goal:** cv-hub läuft produktiv unter eigener Domain

**Tasks:**
1. ✅ Docker Compose (Production)
   - Optimized Dockerfiles (multi-stage)
   - Nginx configuration
   - SSL setup (Let's Encrypt)

2. ✅ Domain Setup
   - DNS configuration (A record)
   - SSL certificate (Certbot)

3. ✅ Deployment
   - VPS provisioning (Hetzner/DigitalOcean)
   - Initial deploy
   - Smoke tests

4. ✅ Monitoring & Logging
   - Structured logs (Pino)
   - Log rotation
   - Health checks (optional)

5. ✅ Backups
   - Automated daily backups (cron)
   - Backup retention policy

6. ✅ Security Hardening
   - Firewall configuration
   - Rate limiting (production-level)
   - Security headers (Helmet)

**Deliverables:**
- ✅ cv-hub läuft unter eigener Domain
- ✅ HTTPS funktioniert (Let's Encrypt)
- ✅ SSL Labs Score: A oder höher
- ✅ CI/CD deployt automatisch
- ✅ Backups laufen automatisch
- ✅ **Go-Live!** 🚀

---

### Post-Launch (Optional Enhancements)

**Not in MVP, but good future ideas:**
- Advanced Analytics Dashboard (Charts, Graphs)
- Multi-language CV support
- PDF Export (generate PDF from JSON Resume)
- Email notifications (new invite visitor)
- Custom themes (Dark mode, Color schemes)
- Blog integration (Write about projects)
- GitHub integration (Sync repos as projects)

---

## Risks & Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Gemini API Rate Limits** | High | Medium | Request queue, Retry logic, Fallback to manual entry |
| **SQLite Performance at Scale** | Medium | Low | Monitor query times, Migrate to PostgreSQL if needed |
| **TanStack Start RC Bugs** | Medium | Medium | Active monitoring, Quick rollback to stable version |
| **CUID2 Token Collisions** | High | Very Low | 4 quadrillion IDs buffer, Monitor duplicate constraint errors |
| **SSR Performance Issues** | Medium | Low | Caching, Profiling, Selective SSR (Admin as CSR) |

### Security Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Session Hijacking** | High | Low | HttpOnly cookies, Secure flag, SameSite=Lax, Short expiry |
| **Brute Force Admin Login** | High | Medium | Rate limiting (5 req/15min), Strong password enforcement, Consider 2FA later |
| **XSS via Markdown** | High | Low | react-markdown (safe by default), CSP headers |
| **SQL Injection** | High | Very Low | TypeORM parameterized queries, Zod input validation |
| **File Upload Exploits** | Medium | Low | File type validation, Size limits, Malware scanning (optional) |

### Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **VPS Downtime** | High | Low | Backups, Monitoring, Quick restore procedure |
| **SSL Certificate Expiry** | Medium | Very Low | Certbot auto-renewal, Monitoring |
| **Database Corruption** | High | Very Low | Daily backups, Tested restore process |
| **Lost Admin Password** | Medium | Low | Password reset script (manual), Document process |

---

## Appendix

### Related Documents

- **Product Requirements:** [PRD.md](./PRD.md)
- **Epic Breakdown:** [epics.md](./epics.md)
- **UX Design Specification:** [ux-design-specification.md](./ux-design-specification.md)
- **Product Brief:** [product-brief-cv-hub-2025-11-03.md](./product-brief-cv-hub-2025-11-03.md)

### Technology References

**TanStack Start:**
- Docs: https://tanstack.com/start/latest
- GitHub: https://github.com/TanStack/router

**NestJS:**
- Docs: https://docs.nestjs.com
- GitHub: https://github.com/nestjs/nest

**Google Gemini:**
- Docs: https://ai.google.dev/gemini-api/docs
- SDK: https://github.com/googleapis/js-genai

**JSON Resume:**
- Standard: https://jsonresume.org/schema
- Community: https://jsonresume.org

### Glossary

- **CV:** Curriculum Vitae (Lebenslauf)
- **SSR:** Server-Side Rendering
- **CSR:** Client-Side Rendering
- **CUID:** Collision-resistant Unique IDentifier
- **WCAG:** Web Content Accessibility Guidelines
- **DSGVO:** Datenschutz-Grundverordnung (GDPR in German)
- **FCP:** First Contentful Paint
- **TTI:** Time to Interactive
- **DTO:** Data Transfer Object
- **ORM:** Object-Relational Mapping

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-04 | 1.0 | Initial Architecture Document | Winston (Architect Agent) + Ruben |

---

**Architecture Status:** ✅ Ready for Implementation

**Next Steps:**
1. Review this architecture document
2. If approved: Start Epic 1 (Foundation) implementation
3. Use `/bmad:bmm:workflows:create-story` to generate implementation stories

**Questions or Clarifications?** → Discuss with Architect Agent (`/bmad:bmm:agents:architect`)

---

*This Architecture Document was created through collaborative design and research, incorporating PRD requirements, UX specifications, and latest technology best practices for 2025. All technology versions and decisions were verified via web research on 2025-11-04.*
