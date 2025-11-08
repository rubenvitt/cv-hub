# Epic Technical Specification: Link Management Dashboard

Date: 2025-11-04
Author: Bob (Scrum Master) + Ruben
Epic ID: 5
Status: Ready for Review

---

## Overview

Epic 5 implementiert das Admin-Dashboard für lebenslauf - das zentrale Management-Interface für personalisierte Links, Besuchsstatistiken und CV-Verwaltung. Ohne dieses Dashboard wäre die Nutzung von Epic 4 (Privacy-First Sharing System) unpraktisch, da Administratoren direkt auf die Datenbank zugreifen müssten.

Das Dashboard ermöglicht es dem Admin, in wenigen Klicks neue personalisierte Links mit optionalen Nachrichten zu erstellen, bestehende Links zu verwalten (aktivieren/deaktivieren/löschen), Besuchsstatistiken einzusehen und die gesamte Link-Verwaltung effizient zu steuern. Dies macht lebenslauf zur praktisch nutzbaren Lösung für Privacy-First CV-Sharing mit professioneller Kontrolle.

## Objectives and Scope

**In Scope:**
- Admin-Authentifizierung (Username/Password mit Session-basierter Auth)
- Session-Management (HTTP-only Cookies, CSRF-Protection)
- Dashboard-Overview mit Statistiken (aktive Links, Gesamtbesuche, kürzlich erstellt)
- Link-Management-Interface (CRUD-Operationen):
  - Liste aller Links mit Sortierung und Filterung
  - Link-Erstellung mit Formular (personalisierte Nachricht, Ablaufdatum, Status)
  - Link-Bearbeitung und Löschung (soft delete)
  - Quick-Actions (Kopieren, Deaktivieren)
- Besuchsstatistiken pro Link (Anzahl, letzter Besuch)
- Admin-spezifische API-Endpoints (Login, Logout, Status, Invite CRUD)
- Frontend-Komponenten: Login-Seite, Dashboard, Link-Liste, Link-Formular

**Out of Scope:**
- Multi-User-Support (nur 1 Admin-User)
- Erweiterte Analytics mit Charts/Visualisierungen (Growth-Feature)
- Email-Benachrichtigungen bei neuen Besuchen
- Bulk-Operationen (mehrere Links gleichzeitig bearbeiten)
- Export-Funktionalität (CSV/JSON)
- Mobile Native App

## System Architecture Alignment

Epic 5 integriert sich nahtlos in die bestehende Architektur:

**Backend-Module (NestJS):**
- **Admin Module** (neu): Authentifizierung, Session-Management, Admin Guards
  - Passport.js Local Strategy für Username/Password-Login
  - express-session + connect-sqlite3 für Session-Speicherung
  - AdminAuthGuard für geschützte Routen
- **Invite Module** (erweitert aus Epic 4): Admin-spezifische CRUD-Endpoints
  - Bestehende Token-Logik wird wiederverwendet
  - Neue Admin-Controller-Methods für Management-Funktionalität

**Frontend-Architektur (TanStack Start):**
- **Admin-Routes** (`/admin/*`): Client-Side Rendering (CSR), kein SSR
  - `/admin/login` - Login-Seite
  - `/admin/dashboard` - Dashboard-Overview
  - `/admin/links` - Link-Management-Liste
- **Custom Components**: AdminLayout, AdminNav, AdminSidebar, StatsCard, LinkTableRow, ProgressSteps
- **shadcn/ui Components**: Button, Card, Dialog, Form, Input, Table, Badge, Tooltip

**Database (SQLite):**
- **admin_users Table**: Admin-Credentials (Argon2-gehashed)
- **sessions Table**: Session-Storage (express-session)
- **invites Table**: Bestehende Struktur aus Epic 4 (keine Änderungen)

**Security-Constraints:**
- HTTPS-only in Production (Nginx SSL-Termination)
- CSRF-Protection via NestJS Guards
- Rate-Limiting: 5 req/15min für Login, 50 req/15min für Admin-API
- Argon2 für Password-Hashing (statt bcrypt)

## Detailed Design

### Services and Modules

| Module/Service | Responsibility | Inputs | Outputs | Owner |
|---------------|----------------|---------|---------|-------|
| **AdminModule** (Backend) | Admin authentication, session management, user CRUD | Login credentials, Session cookie | Session token, User info | Backend |
| **AdminService** | Business logic for admin operations, password validation | Username, Password | Admin user object | Backend |
| **AdminController** | HTTP endpoints for auth (login, logout, status) | HTTP requests (POST /login, etc.) | JSON responses | Backend |
| **LocalStrategy** (Passport) | Username/password authentication strategy | Username, Password | Validated user or rejection | Backend |
| **AdminAuthGuard** | Protects admin routes, validates session | HTTP request with session cookie | true/false (access granted/denied) | Backend |
| **InviteController** (Admin methods) | Admin-specific invite CRUD operations | Invite DTOs, Session | Invite objects, Success/Error | Backend |
| **InviteService** (extended) | Enhanced with admin-specific query methods | Query filters (status, search) | Paginated invite list | Backend |
| **AdminLayout** (Frontend) | Layout wrapper for admin pages | React children | Rendered admin UI with nav/sidebar | Frontend |
| **AdminDashboard** | Dashboard overview page with stats | None (fetches on load) | Dashboard UI with cards | Frontend |
| **LinkManagement** | Link list and CRUD operations UI | Invite list from API | Interactive link table | Frontend |
| **LinkForm** (TanStack Form) | Form for creating/editing links | Invite data (optional for edit) | Form submission → API | Frontend |
| **StatsCard** | Reusable stat display component | Stat value, label, icon | Styled card | Frontend |
| **LinkTableRow** | Table row for single link | Invite object | Rendered row with actions | Frontend |

### Data Models and Contracts

**Admin User Entity (TypeORM):**
```typescript
@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string; // Argon2

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Session Storage (express-session + connect-sqlite3):**
```sql
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,              -- JSON session data
  expired DATETIME NOT NULL
);
CREATE INDEX idx_sessions_expired ON sessions(expired);
```

**Admin Login DTO (Zod Schema):**
```typescript
export const LoginDtoSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(128),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
```

**Create Invite DTO (Extended from Epic 4):**
```typescript
export const CreateInviteDtoSchema = z.object({
  recipientName: z.string().optional(),
  message: z.string().max(1000).optional(), // Markdown
  expiresAt: z.string().datetime().optional(), // ISO 8601
  isActive: z.boolean().default(true),
});

export type CreateInviteDto = z.infer<typeof CreateInviteDtoSchema>;
```

**Update Invite DTO:**
```typescript
export const UpdateInviteDtoSchema = z.object({
  recipientName: z.string().optional(),
  message: z.string().max(1000).optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateInviteDto = z.infer<typeof UpdateInviteDtoSchema>;
```

**Invite List Query DTO:**
```typescript
export const InviteQueryDtoSchema = z.object({
  status: z.enum(['active', 'expired', 'inactive', 'all']).default('all'),
  search: z.string().optional(), // Search in recipientName
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'visitCount', 'expiresAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type InviteQueryDto = z.infer<typeof InviteQueryDtoSchema>;
```

**Relationships:**
- `AdminUser` has no direct relations (single admin, no FK needed)
- `Session` links to admin via session.user.id (in-memory, no DB FK)
- `Invite` entity unchanged from Epic 4 (no admin_id FK needed for single-admin MVP)

### APIs and Interfaces

**Authentication Endpoints:**
```
POST /api/admin/auth/login
Request Body:
{
  "username": "admin",
  "password": "SecurePassword123!"
}

Response (Success - 200):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
Sets: HttpOnly session cookie

Response (Error - 401):
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials"
  }
}

---

POST /api/admin/auth/logout
Requires: Session cookie

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
Clears: Session cookie

---

GET /api/admin/auth/status
Requires: Session cookie (optional)

Response (200):
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Invite Management Endpoints:**
```
GET /api/admin/invites
Requires: Session auth
Query Params: ?status=active&search=john&limit=10&offset=0&sortBy=createdAt&sortOrder=desc

Response (200):
{
  "data": [
    {
      "id": "cm3k5x...",
      "token": "cm3k5y...",
      "recipientName": "John Doe",
      "message": "# Welcome John",
      "expiresAt": "2025-12-31T23:59:59Z",
      "isActive": true,
      "visitCount": 5,
      "lastVisitAt": "2025-11-03T14:30:00Z",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-03T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasNext": true
  }
}

---

POST /api/admin/invites
Requires: Session auth
Request Body:
{
  "recipientName": "John Doe",        // Optional
  "message": "# Welcome John",        // Optional, Markdown
  "expiresAt": "2025-12-31T23:59:59Z", // Optional, ISO 8601
  "isActive": true                     // Default true
}

Response (201):
{
  "success": true,
  "invite": {
    "id": "cm3k5x...",
    "token": "cm3k5y...",
    ...
  },
  "url": "https://lebenslauf.example.com/invite/cm3k5y..."
}

---

GET /api/admin/invites/:id
Requires: Session auth

Response (200):
{
  "id": "cm3k5x...",
  "token": "cm3k5y...",
  "recipientName": "John Doe",
  "message": "# Welcome John",
  "expiresAt": "2025-12-31T23:59:59Z",
  "isActive": true,
  "visitCount": 5,
  "lastVisitAt": "2025-11-03T14:30:00Z",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-03T14:30:00Z"
}

---

PATCH /api/admin/invites/:id
Requires: Session auth
Request Body (partial update):
{
  "isActive": false  // Deactivate link
}

Response (200):
{
  "success": true,
  "invite": { ... updated invite ... }
}

---

DELETE /api/admin/invites/:id
Requires: Session auth

Response (200):
{
  "success": true,
  "message": "Invite deactivated successfully"
}
Note: Soft delete (sets isActive=false for statistics history)
```

**Error Codes:**
- `400` - Validation error (Zod schema)
- `401` - Unauthorized (no session or invalid credentials)
- `403` - Forbidden (CSRF token missing)
- `404` - Invite not found
- `429` - Rate limit exceeded
- `500` - Internal server error

### Workflows and Sequencing

**Login Flow:**
```
User navigates to /admin/login
        ↓
Frontend renders login form
        ↓
User enters username + password
        ↓
Frontend: POST /api/admin/auth/login
        ↓
Backend: LocalStrategy validates credentials
        ↓
├─ Valid → Argon2 verify password
│          ↓
│       Create session (express-session)
│          ↓
│       Set HttpOnly cookie
│          ↓
│       Return { success: true, user }
│          ↓
│       Frontend redirects to /admin/dashboard
│
└─ Invalid → Return 401 Unauthorized
           ↓
        Frontend shows error message
```

**Dashboard Load Flow:**
```
User navigates to /admin/dashboard
        ↓
Frontend: Check session via beforeLoad hook
        ↓
├─ No session → Redirect to /admin/login
│
└─ Session valid → Proceed
           ↓
        Parallel API calls:
        - GET /api/admin/invites?status=active (count)
        - GET /api/admin/invites?limit=5&sortBy=createdAt (recent)
           ↓
        Aggregate stats:
        - Total active links
        - Total visits (sum visitCount)
        - Recent links list
           ↓
        Render dashboard with StatsCard components
```

**Link Creation Flow:**
```
User clicks "Create Link" button
        ↓
Dialog opens with LinkForm (TanStack Form)
        ↓
User fills form:
  - Recipient Name (optional)
  - Personalized Message (optional, Markdown preview)
  - Expiration Date (optional, Datepicker)
  - Active Status (Toggle, default: true)
        ↓
User clicks "Generate Link"
        ↓
Frontend validates form (Zod)
        ↓
├─ Invalid → Show validation errors inline
│
└─ Valid → POST /api/admin/invites
           ↓
        Backend: AdminAuthGuard checks session
           ↓
        Backend: Zod validates DTO
           ↓
        Backend: InviteService.create()
           - Generate CUID2 token
           - Save to DB
           ↓
        Backend returns invite + URL
           ↓
        Frontend: Optimistic UI update (TanStack Query)
           - Add new invite to cache
           - Close dialog
           - Show success toast
           - Display generated URL (with copy button)
```

**Link Deactivation Flow:**
```
User clicks "Deactivate" on LinkTableRow
        ↓
Confirmation Dialog: "Deactivate this link?"
        ↓
User confirms
        ↓
Frontend: PATCH /api/admin/invites/:id { isActive: false }
        ↓
Backend: AdminAuthGuard validates session
        ↓
Backend: Update invite.isActive = false
        ↓
Backend returns updated invite
        ↓
Frontend: Optimistic UI update
        - Update invite in cache
        - Row badge changes to "Inactive"
        - Show success toast
```

**Link Filtering & Sorting Flow:**
```
User selects filter dropdown: "Active"
        ↓
Frontend updates query params
        ↓
Frontend: GET /api/admin/invites?status=active&sortBy=visitCount&sortOrder=desc
        ↓
Backend: InviteService applies filters
        - WHERE isActive = true
        - WHERE expiresAt IS NULL OR expiresAt > NOW()
        - ORDER BY visitCount DESC
        ↓
Backend returns filtered + sorted list
        ↓
Frontend: TanStack Query updates cache
        ↓
Table re-renders with new data
```

## Non-Functional Requirements

### Performance

**Targets:**
- **Admin Dashboard Load Time:** <2s (Time to Interactive)
- **Login Response Time:** <500ms (p95)
- **API Response Time (Admin):** <200ms (p95) for GET requests, <300ms for POST/PATCH
- **Link Creation:** <1s end-to-end (including token generation + DB write)
- **Table Sorting/Filtering:** <100ms (client-side if data cached, server-side if new query)

**Optimizations:**
- **TanStack Query Caching:** Admin dashboard data cached for 5 minutes (staleTime)
- **Pagination:** Default 10 items per page, max 100 (prevents large result sets)
- **Optimistic Updates:** Immediate UI feedback for create/update/delete operations
- **Database Indexes:**
  - `idx_invites_token` for token lookup
  - `idx_invites_expires_at` for filtering expired links
  - `idx_invites_created_at` for sorting by date
  - `idx_sessions_expired` for session cleanup
- **Lazy Loading:** LinkForm dialog only loaded when opened (React.lazy)
- **Debounced Search:** 300ms delay for search input to reduce API calls

**Measurement:**
- Backend: Pino logger with response time interceptor
- Frontend: React DevTools Profiler for component render times
- CI/CD: Lighthouse audit for admin pages (target: >80 Performance score)

### Security

**Authentication & Sessions:**
- **Password Hashing:** Argon2 (argon2id, 64MB memory, 3 iterations, 4 threads)
- **Session Storage:** SQLite-backed sessions (connect-sqlite3)
- **Session Cookie:** HttpOnly, Secure (HTTPS-only), SameSite=Lax, Max-Age=7 days
- **Session Secret:** 32-byte random string (generated with `openssl rand -hex 32`)
- **Brute Force Protection:** Rate limiting on login endpoint (5 attempts per 15 minutes per IP)

**CSRF Protection:**
- **csurf Middleware:** Applied to all admin routes
- **Token in Cookie:** XSRF-TOKEN cookie (read by frontend)
- **Header Validation:** Frontend must send X-CSRF-Token header with requests
- **Double Submit Cookie Pattern:** Compare cookie token with header token

**Input Validation:**
- **Zod Schemas:** All DTOs validated at API boundary
- **SQL Injection:** TypeORM parameterized queries (no raw SQL)
- **XSS Prevention:**
  - React escapes JSX by default
  - react-markdown for safe Markdown rendering (no dangerouslySetInnerHTML)
  - CSP headers via Helmet

**Authorization:**
- **AdminAuthGuard:** Validates session on every admin route
- **Guard Execution Order:** ThrottlerGuard → AdminAuthGuard → CSRF Guard
- **Session Validation:** Check session.user exists and session not expired

**Security Headers (Helmet):**
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: no-referrer

**Password Requirements:**
- Minimum 8 characters
- Maximum 128 characters (prevent DoS via long inputs)
- No specific complexity rules (Argon2 makes brute force infeasible)

### Reliability/Availability

**Session Persistence:**
- **SQLite Storage:** Sessions survive backend restarts (file-based)
- **Session Cleanup:** Expired sessions auto-deleted daily (cron job)
- **Session Expiry:** 7 days inactivity → auto-logout

**Error Handling:**
- **Graceful Degradation:** Frontend shows friendly error messages on API failures
- **Retry Logic (Frontend):** TanStack Query automatic retry for failed requests (3 attempts, exponential backoff)
- **Transaction Safety:** DB writes wrapped in transactions (TypeORM)
- **Logging:** All errors logged with stack traces (Pino)

**Database Reliability:**
- **SQLite WAL Mode:** Write-Ahead Logging for concurrent read/write
- **Daily Backups:** Automated backup of SQLite DB (cron job, retained 30 days)
- **Soft Deletes:** Invites deactivated, not deleted (statistics history preserved)

**Availability Target:**
- **Uptime:** >99% (minimal downtime for updates)
- **Deployment Strategy:** Rolling update (docker-compose up -d --no-deps --build)
- **Rollback:** Keep previous Docker image for quick rollback

**Failure Scenarios:**
- **Backend Down:** Frontend shows "Service unavailable" message
- **Session Expired:** Frontend redirects to /admin/login with "Session expired" message
- **Database Locked:** TypeORM retry with timeout (5s max)

### Observability

**Logging (Pino):**
- **Structured JSON Logs:** All logs in JSON format for parsing
- **Log Levels:** Debug (dev), Info (prod), Warn, Error
- **Request Logging:**
  - Method, Path, Status Code, Response Time
  - Exclude sensitive data (passwords, session tokens)
- **Error Logging:**
  - Stack traces
  - Request context (user ID, endpoint)
- **Log Rotation:** Daily rotation, 30-day retention

**Metrics:**
- **Login Attempts:** Count of successful/failed logins
- **Session Creation/Expiry:** Track session lifecycle
- **API Response Times:** p50, p95, p99 for admin endpoints
- **Database Query Times:** Slow query log (>100ms)

**Monitoring:**
- **Health Check Endpoint:** `GET /api/health` (checks DB connection)
- **Uptime Monitoring:** Optional integration (UptimeRobot, Better Uptime)
- **Error Tracking:** Optional Sentry integration (log errors with context)

**Debugging:**
- **Request IDs:** Unique ID per request (for tracing across logs)
- **Debug Mode:** Enable via DEBUG=* environment variable (development only)
- **Swagger UI:** Interactive API testing at `/api/docs` (admin-auth protected in prod)

## Dependencies and Integrations

**Backend Dependencies:**
```json
{
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/platform-express": "^11.0.0",
  "@nestjs/throttler": "^6.4.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.20",
  "sqlite3": "^5.1.7",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "express-session": "^1.18.0",
  "connect-sqlite3": "^0.9.13",
  "argon2": "^0.41.1",
  "csurf": "^1.11.0",
  "helmet": "^8.0.0",
  "zod": "^3.23.0",
  "cuid2": "^2.0.0",
  "nestjs-pino": "^4.4.1",
  "pino": "^9.5.0"
}
```

**Frontend Dependencies:**
```json
{
  "@tanstack/start": "latest",
  "@tanstack/react-router": "^1.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-form": "^0.36.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "zod": "^3.23.0",
  "tailwindcss": "^4.0.0",
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.0",
  "date-fns": "^4.0.0",
  "react-markdown": "^10.0.0"
}
```

**Integration Points:**
- **Epic 4 (Invite Module):** Reuses Invite entity and token validation logic
- **SQLite Database:** Shared database for invites and sessions
- **Nginx:** Reverse proxy routes `/api/admin/*` to backend
- **Docker Compose:** Backend and Frontend containers communicate via internal network

**External Dependencies:** None (Epic 5 is fully self-contained)

## Acceptance Criteria (Authoritative)

**AC-1: Admin Authentication**
- ✅ Admin can log in with username and password
- ✅ Successful login creates session and sets HttpOnly cookie
- ✅ Failed login shows "Invalid credentials" error message
- ✅ Session persists across browser reloads (7 days max)
- ✅ Logout clears session and redirects to login page
- ✅ Unauthorized access to admin routes redirects to login
- ✅ Rate limiting prevents brute force (max 5 attempts per 15 min)

**AC-2: Admin Dashboard Overview**
- ✅ Dashboard shows total active links count
- ✅ Dashboard shows total visits across all links
- ✅ Dashboard shows 5 most recently created links
- ✅ Dashboard loads in <2 seconds
- ✅ Stats update automatically when links are created/modified

**AC-3: Link Management - List View**
- ✅ Table displays all links with: Recipient, Token (shortened), Status, Visits, Created Date
- ✅ Links can be sorted by: Created Date, Visit Count, Expiration Date
- ✅ Links can be filtered by: Active, Inactive, Expired, All
- ✅ Search filters by recipient name (case-insensitive)
- ✅ Pagination works (10 items per page, max 100)
- ✅ Quick actions visible: Copy URL, Deactivate, Delete

**AC-4: Link Creation**
- ✅ "Create Link" button opens dialog with form
- ✅ Form fields: Recipient Name (optional), Message (optional, Markdown), Expiry Date (optional), Active Status (toggle)
- ✅ Form validates inputs (Zod schema)
- ✅ Markdown preview updates live as user types
- ✅ Generated URL displayed immediately after creation with copy button
- ✅ Link appears in table without page reload (optimistic update)
- ✅ Success toast notification shown
- ✅ Token is unique (CUID2) and collision-resistant

**AC-5: Link Editing**
- ✅ Click on link row opens edit dialog
- ✅ All fields editable except token
- ✅ Changes saved immediately on submit
- ✅ Table row updates without page reload
- ✅ Success toast notification shown

**AC-6: Link Deactivation**
- ✅ "Deactivate" button shows confirmation dialog
- ✅ Confirmed deactivation sets isActive=false (soft delete)
- ✅ Deactivated link no longer accessible via `/invite/:token`
- ✅ Deactivated link remains in table with "Inactive" badge
- ✅ Visit statistics preserved after deactivation
- ✅ Link can be reactivated by editing and toggling status

**AC-7: Visit Statistics**
- ✅ Each link shows visit count
- ✅ Each link shows last visit timestamp (or "Never" if 0 visits)
- ✅ Stats update in real-time when invite link is accessed
- ✅ Stats are DSGVO-compliant (no IP addresses stored)

**AC-8: CSRF Protection**
- ✅ All admin POST/PATCH/DELETE requests require CSRF token
- ✅ Missing CSRF token returns 403 Forbidden
- ✅ CSRF token automatically included by frontend (cookie-based)

**AC-9: Performance**
- ✅ Login response time <500ms (p95)
- ✅ Dashboard load time <2s (Time to Interactive)
- ✅ Link creation <1s end-to-end
- ✅ Table sorting/filtering <100ms

**AC-10: Security**
- ✅ Passwords hashed with Argon2
- ✅ Session cookies are HttpOnly and Secure (HTTPS)
- ✅ Rate limiting active on login endpoint
- ✅ Admin routes protected by AdminAuthGuard
- ✅ Input validation prevents SQL injection and XSS

## Traceability Mapping

| Acceptance Criteria | Spec Section | Components/APIs | Test Idea |
|---------------------|--------------|-----------------|-----------|
| AC-1: Admin Auth | Security (Authentication) | AdminController, LocalStrategy, AdminAuthGuard | E2E test: Login flow, Session persistence, Unauthorized redirect |
| AC-2: Dashboard | Services (AdminDashboard) | AdminDashboard, StatsCard, GET /api/admin/invites | Integration test: Stats calculation, Dashboard data fetch |
| AC-3: List View | Services (LinkManagement), APIs (GET /api/admin/invites) | LinkManagement, LinkTableRow, InviteController | E2E test: Sorting, Filtering, Pagination, Search |
| AC-4: Link Creation | APIs (POST /api/admin/invites), Data Models (DTOs) | LinkForm, InviteService, CreateInviteDto | Integration test: Form validation, Token generation, DB insert |
| AC-5: Link Editing | APIs (PATCH /api/admin/invites/:id) | LinkForm (edit mode), InviteService.update() | E2E test: Edit flow, Optimistic update |
| AC-6: Deactivation | APIs (PATCH /api/admin/invites/:id) | LinkTableRow, InviteService.update() | Integration test: Soft delete, Link inaccessible after |
| AC-7: Visit Stats | Data Models (Invite entity), APIs (GET /api/admin/invites) | LinkTableRow, InviteService.findAll() | Integration test: Visit tracking, Stats accuracy |
| AC-8: CSRF | Security (CSRF Protection) | csurf middleware, Frontend headers | Unit test: CSRF token validation, 403 on missing token |
| AC-9: Performance | Performance (NFRs) | All components, Pino logger | Load test: Response times, Dashboard load time |
| AC-10: Security | Security (All subsections) | Argon2, AdminAuthGuard, Throttler | Security test: Password hashing, Rate limiting, Session security |

## Risks, Assumptions, Open Questions

**Risks:**

1. **Risk:** Session hijacking via stolen session cookie
   - **Severity:** High
   - **Mitigation:** HttpOnly + Secure cookies, HTTPS-only, SameSite=Lax, Short session expiry (7 days), CSRF protection

2. **Risk:** Brute force password attack
   - **Severity:** Medium
   - **Mitigation:** Rate limiting (5 attempts per 15 min), Argon2 password hashing, Strong password requirements, Optional: CAPTCHA after 3 failed attempts (Growth feature)

3. **Risk:** CSRF token bypass
   - **Severity:** Medium
   - **Mitigation:** csurf middleware with double-submit cookie pattern, Test coverage for CSRF validation

4. **Risk:** Database lock under concurrent writes
   - **Severity:** Low (single admin user)
   - **Mitigation:** SQLite WAL mode, TypeORM retry logic, Timeout handling

5. **Risk:** Session store performance degradation
   - **Severity:** Low
   - **Mitigation:** Expired session cleanup cron job, Session table indexing, Monitor session table size

**Assumptions:**

1. **Single Admin User:** MVP assumes only one admin. Multi-user support deferred to Growth phase.
2. **HTTPS in Production:** Secure cookies require HTTPS (handled by Nginx + Let's Encrypt in Epic 7).
3. **Low Concurrent Writes:** SQLite sufficient for single admin (< 10 concurrent requests).
4. **Session Storage Acceptable:** SQLite-backed sessions are performant enough (<1000 active sessions expected).
5. **Modern Browser Support:** Assumes modern browsers with JavaScript enabled (no IE11 support).

**Open Questions:**

1. **Question:** Should we implement 2FA (Two-Factor Authentication) in MVP?
   - **Answer:** No, deferred to Growth phase. Single admin + strong password + rate limiting sufficient for MVP.

2. **Question:** Should admin be able to reset their own password via email?
   - **Answer:** No, MVP uses environment variable for initial password. Manual reset via DB/SSH if needed. Growth feature: Password reset flow.

3. **Question:** Should we log all admin actions (audit trail)?
   - **Answer:** Partial: Pino logs requests, but no dedicated audit log table in MVP. Growth feature: Audit log for compliance.

4. **Question:** Should deactivated links be hard-deleted after X days?
   - **Answer:** No, soft delete only. Statistics preserved indefinitely. Growth feature: Configurable retention policy.

## Test Strategy Summary

**Testing Layers:**

**1. Unit Tests (Backend - Jest)**
- **AdminService:** Password validation, User creation/lookup
- **InviteService:** CRUD operations, Token generation, Filtering logic
- **LocalStrategy:** Passport authentication flow
- **AdminAuthGuard:** Session validation, Unauthorized handling
- **Zod Validators:** DTO validation (LoginDto, CreateInviteDto, UpdateInviteDto)
- **Target Coverage:** >80%

**2. Unit Tests (Frontend - Vitest)**
- **LinkForm:** Form validation, Markdown preview
- **AdminDashboard:** Stats calculation logic
- **LinkTableRow:** Action button handlers, Status badge display
- **API Client:** TanStack Query hooks, Error handling
- **Target Coverage:** >70%

**3. Integration Tests (Backend - Jest + Supertest)**
- **Login Flow:** POST /api/admin/auth/login → Session creation → Cookie set
- **Protected Routes:** GET /api/admin/invites with/without valid session
- **CRUD Operations:** Create, Read, Update, Delete invites via API
- **Filtering & Sorting:** Query params processed correctly
- **Rate Limiting:** Login endpoint throttled after 5 attempts
- **CSRF Protection:** POST/PATCH/DELETE rejected without token
- **Target Coverage:** >60%

**4. E2E Tests (Frontend - Playwright)**
- **Login Flow:** Navigate to /admin/login → Enter credentials → Redirect to dashboard
- **Dashboard Load:** Stats displayed correctly, Recent links visible
- **Link Creation:** Click "Create" → Fill form → Link generated → Appears in table
- **Link Deactivation:** Click "Deactivate" → Confirm → Link marked inactive → Not accessible
- **Link Editing:** Click link → Edit form → Save → Updates reflected
- **Filtering & Sorting:** Select filter → Table updates → Sort column → Order changes
- **Session Persistence:** Reload page → Still logged in (within 7 days)
- **Session Expiry:** Wait 7 days (simulated) → Redirect to login
- **Target Coverage:** 100% of critical paths

**5. Performance Tests (k6 or Artillery)**
- **Login Endpoint:** Measure response time under load (target: <500ms p95)
- **Dashboard Load:** Concurrent requests, cache behavior
- **Link Creation:** Token generation performance, DB write time
- **Pagination:** Large result sets (100+ links), query performance

**6. Security Tests (Manual + npm audit)**
- **Session Security:** Cookie flags (HttpOnly, Secure, SameSite)
- **CSRF Validation:** Missing token → 403, Invalid token → 403
- **Rate Limiting:** Brute force attempt → 429 after 5 attempts
- **Input Validation:** SQL injection, XSS attempts → Rejected
- **Password Hashing:** Argon2 verification, Timing attack resistance
- **Dependency Scan:** npm audit for vulnerabilities

**Test Data:**
- **Seed Data:** 50 sample invite links (various states: active, inactive, expired)
- **Admin User:** username=admin, password=test123 (Argon2 hashed)
- **Mock Data:** Generated via Faker.js for consistent test runs

**CI/CD Integration:**
- **Pre-Merge:** Unit + Integration tests run on PR
- **Pre-Deploy:** E2E tests run on staging environment
- **Post-Deploy:** Smoke tests verify production deployment
