# Epic Technical Specification: Production Deployment & Operations

Date: 2025-11-05
Author: Ruben
Epic ID: 7
Status: Draft

---

## Overview

Epic 7 transformiert cv-hub von einem lokalen Entwicklungsprojekt in eine produktive, professionelle Online-Präsenz unter eigener Domain. Diese Epic bringt alle vorangegangenen Features (Epics 1-6) in die Produktion und macht cv-hub zur echten Visitenkarte - ohne Deployment bleibt alles nur ein Experiment.

Der Fokus liegt auf stabiler, wartbarer Production-Infrastruktur: Docker Compose orchestriert Frontend (TanStack Start), Backend (NestJS) und Nginx Reverse Proxy. HTTPS wird via Let's Encrypt automatisiert, Monitoring und strukturierte Logs ermöglichen proaktive Wartung, und automatische Backups schützen CV-Daten und Link-Statistiken. CI/CD via GitHub Actions automatisiert den Deployment-Prozess für zukünftige Updates.

## Objectives and Scope

### In Scope

**Production Deployment:**
- Docker Compose Setup mit Multi-Container-Orchestrierung (Frontend, Backend, Nginx, Certbot)
- Optimierte Production Docker Images (Multi-Stage Builds)
- Persistent Volumes für SQLite-DB, Uploads und CV-Backups
- Health-Checks und automatische Restart-Policies

**Domain & HTTPS:**
- Custom Domain-Konfiguration (DNS A/AAAA Records)
- Nginx Reverse Proxy (SSL Termination, Static Assets, Rate Limiting)
- Let's Encrypt SSL-Zertifikate via Certbot
- Automatische Zertifikat-Erneuerung
- HTTP → HTTPS Redirects
- Security Headers (Helmet.js: CSP, HSTS, X-Frame-Options)

**CI/CD Pipeline:**
- GitHub Actions Workflow (Lint, Test, Build, Deploy)
- Automatisches Deployment bei Git Push (main branch)
- Smoke-Tests nach Deployment
- Rollback-Mechanismus

**Monitoring & Logging:**
- Strukturierte Logs (Winston) mit Log-Rotation
- Error-Tracking und Alerting
- Uptime-Monitoring (optional: UptimeRobot, Better Uptime)
- Container Health-Checks (Docker)

**Backup-Strategie:**
- Automatische SQLite-DB-Backups (täglich via Cron)
- CV-JSON Versionierung (bereits in Epic 2/6)
- Backup-Retention-Policy (30 Tage)
- Restore-Dokumentation

**Security:**
- Firewall-Konfiguration (UFW: nur 22, 80, 443 offen)
- Rate-Limiting (Production-Level: 100 req/min public, 50 req/min admin)
- Secret-Management (Environment-Variablen, keine Secrets im Code)
- SSL Labs Score: A oder höher

### Out of Scope

**Growth Features (Future):**
- CDN für Assets (Cloudflare, Bunny CDN)
- Horizontal Scaling / Load Balancing (nicht nötig für <50k req/month)
- Kubernetes / Container-Orchestrierung (Docker Compose ist ausreichend)
- Advanced Monitoring (Grafana, Prometheus - optional für Post-MVP)
- Multi-Region Deployment (Single VPS ist ausreichend)

**Explizit nicht erforderlich:**
- Database-Clustering (SQLite reicht für Traffic-Level)
- Auto-Scaling (Traffic ist vorhersehbar und niedrig)
- Blue-Green Deployment (Downtime von <30s ist akzeptabel)

## System Architecture Alignment

Epic 7 implementiert das im Architecture Document definierte Deployment-Pattern:

**Alignment mit Architektur-Entscheidungen:**

- **Docker Compose Orchestrierung:** Implementiert Multi-Container-Setup (Nginx, Frontend, Backend, Certbot) wie in Architecture Deployment Stack spezifiziert
- **Nginx Reverse Proxy:** SSL-Termination, Rate-Limiting (Tier 1), Static Asset Serving gemäß System Overview
- **Let's Encrypt Integration:** Automatisierte SSL-Zertifikat-Verwaltung mit Certbot wie architektonisch geplant
- **VPS Hosting:** Single-Instance-Deployment auf Hetzner/DigitalOcean entspricht Scale-Adaptive-Prinzip (startet einfach, kann wachsen)
- **SQLite mit Volumes:** Persistent Storage für CV-Daten, Links, Sessions wie in Data Layer definiert
- **Monorepo-Struktur:** pnpm workspaces mit apps/frontend, apps/backend, packages/shared-types gemäß Architektur
- **CI/CD Pipeline:** GitHub Actions für automatisierte Tests und Deployments entspricht Architecture DevOps-Pattern

**Architektonische Constraints:**

- **Kein K8s:** Bewusste Entscheidung für Docker Compose (Einfachheit > Komplexität)
- **No CDN in MVP:** Assets werden von Nginx served (Performance-Targets mit SSR + Caching erfüllbar)
- **Single Region:** Keine Multi-Region-Strategie erforderlich bei < 50k req/month Target Load

**Komponenten-Referenzen:**

- **Frontend:** TanStack Start (SSR + Hydration) auf Port 5173
- **Backend:** NestJS API auf Port 3000 mit TypeORM + SQLite
- **Database:** SQLite file-based DB (cv-hub.db) in /data Volume
- **Reverse Proxy:** Nginx auf Ports 80/443 (public-facing)
- **SSL Management:** Certbot Container für Let's Encrypt Renewal

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs | Outputs | Owner |
|----------------|------------------|--------|---------|-------|
| **Nginx Reverse Proxy** | SSL Termination, Static Asset Serving, Rate Limiting (Tier 1), HTTP→HTTPS Redirect | HTTP/HTTPS Requests, Let's Encrypt Certs | Proxied Requests zu Frontend/Backend | DevOps |
| **Certbot Service** | SSL Certificate Acquisition, Automatic Renewal (12h Check-Interval) | Domain Config, Email | Let's Encrypt Certificates in `/etc/letsencrypt` | DevOps |
| **Frontend Container** | TanStack Start SSR Application (Production Build) | Environment Variables (`VITE_API_URL`) | Rendered HTML/SSR, Hydrated React App | Frontend |
| **Backend Container** | NestJS API (Production Build, TypeORM + SQLite) | Environment Variables (`DATABASE_URL`, `SESSION_SECRET`, `GEMINI_API_KEY`) | RESTful API Responses, SQLite Persistence | Backend |
| **Docker Compose Orchestrator** | Multi-Container Lifecycle Management, Volume Management, Network Config | `docker-compose.yml`, `.env` | Running Services, Persistent Volumes | DevOps |
| **GitHub Actions CI/CD** | Automated Testing, Building, Deployment Pipeline | Git Push (main branch) | Deployed Application, Test Reports | DevOps |
| **Backup Service (Cron)** | Daily SQLite DB Backups, Uploads Backup, Retention Management | SQLite DB File, Uploads Directory | Timestamped Backups (.tar.gz), 30-Day Retention | DevOps |
| **Winston Logger** | Structured Application Logs, Log Rotation, Error Tracking | Application Events (Backend + Frontend SSR) | JSON Log Files, Rotated Daily | Backend |
| **Health Check Service** | Container Health Monitoring, Readiness Checks | Periodic HTTP Requests (`/api/health`) | Docker Health Status (healthy/unhealthy) | Backend |

**Service Interactions:**
- Nginx terminates SSL und proxy requests zu Frontend (5173) und Backend (3000)
- Certbot erneuert Certificates automatisch, Nginx reloaded config bei Renewal
- Frontend (SSR) kommuniziert mit Backend API für Data-Fetching
- Backend persistiert in SQLite Volume (`/app/data`)
- GitHub Actions deployt via SSH zu VPS, triggert `docker-compose up -d --build`
- Backup-Cron läuft auf Host, sichert Docker Volumes täglich
- Winston Logger schreibt in Volume (`/app/logs`), Log-Rotation täglich

### Data Models and Contracts

**Epic 7 definiert primär Operations-Metadata, keine neuen Business-Domain-Models:**

**1. Deployment Metadata**
```typescript
// Deployment-Status (optional für GitHub Actions Artifact)
interface DeploymentRecord {
  deploymentId: string;        // ULID
  commitSha: string;           // Git Commit Hash
  deployedAt: Date;            // ISO 8601 Timestamp
  deployedBy: string;          // GitHub Actor
  status: 'success' | 'failed' | 'rolled-back';
  services: {
    frontend: { version: string; status: 'healthy' | 'unhealthy' };
    backend: { version: string; status: 'healthy' | 'unhealthy' };
  };
  smokeTestResult: boolean;    // Post-Deployment Health Check
}
```

**2. Backup Metadata**
```typescript
// Backup-Manifest (gespeichert in backup-manifest.json)
interface BackupManifest {
  backups: BackupEntry[];
}

interface BackupEntry {
  backupId: string;            // Format: YYYY-MM-DD-HHmmss
  createdAt: Date;             // ISO 8601
  type: 'database' | 'uploads' | 'full';
  filePath: string;            // Relativer Pfad zu Backup-File
  sizeBytes: number;           // File-Größe
  checksum: string;            // SHA-256 Hash
  retentionUntil: Date;        // Auto-Delete nach 30 Tagen
}
```

**3. Health Check Response (erweitert für Production)**
```typescript
// Erweitert aus Epic 1, jetzt mit Deployment-Info
interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;           // ISO 8601
  uptime: number;              // Seconds seit Container-Start
  version: string;             // Git Commit SHA oder Semantic Version
  environment: 'production' | 'staging' | 'development';
  database: {
    status: 'connected' | 'disconnected';
    latency: number;           // Milliseconds
  };
  ssl: {
    expiresAt: Date;           // Certificate Expiry Date
    daysUntilExpiry: number;   // Warning wenn < 7 Tage
  };
}
```

**4. Nginx Configuration Contract**
```nginx
# Nginx Config Structure (nginx.conf)
server {
  listen 80;
  server_name cv-hub.example.com;

  # HTTP → HTTPS Redirect
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name cv-hub.example.com;

  # SSL Config (Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/cv-hub.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/cv-hub.example.com/privkey.pem;

  # Security Headers (Helmet.js enforcement)
  add_header X-Frame-Options "DENY";
  add_header X-Content-Type-Options "nosniff";
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

  # Rate Limiting (100 req/min)
  limit_req_zone $binary_remote_addr zone=general:10m rate=100r/m;
  limit_req zone=general burst=20;

  # Proxy to Backend API
  location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Proxy to Frontend
  location / {
    proxy_pass http://frontend:5173;
    proxy_set_header Host $host;
  }
}
```

**5. Environment Variables Contract**
```bash
# .env (Production)
# CRITICAL: Diese Variablen MÜSSEN gesetzt sein

# Backend
NODE_ENV=production                          # Required
DATABASE_URL=file:./data/cv-hub.db          # Required
SESSION_SECRET=<64-char-random-hex>         # Required (openssl rand -hex 32)
GEMINI_API_KEY=<google-gemini-api-key>      # Required (Epic 6)

# Admin Credentials
ADMIN_USERNAME=admin                         # Required
ADMIN_PASSWORD=<strong-password>             # Required (bcrypt-hashed)

# Domain
DOMAIN=cv-hub.example.com                    # Required für SSL
CERTBOT_EMAIL=admin@example.com              # Required für Let's Encrypt

# Ports (Internal, Docker Compose Network)
BACKEND_PORT=3000                            # Optional (default: 3000)
FRONTEND_PORT=5173                           # Optional (default: 5173)

# Logging
LOG_LEVEL=info                               # Optional (default: info)
LOG_RETENTION_DAYS=7                         # Optional (default: 7)

# Backup
BACKUP_RETENTION_DAYS=30                     # Optional (default: 30)
```

### APIs and Interfaces

**Epic 7 erweitert bestehende Endpoints mit Production-Features:**

**1. Health Check Endpoint (erweitert)**
```typescript
GET /api/health

// Response (200 OK)
{
  "status": "ok",
  "timestamp": "2025-11-05T14:30:00Z",
  "uptime": 86400,                      // 1 Tag
  "version": "abc123def",               // Git Commit SHA
  "environment": "production",
  "database": {
    "status": "connected",
    "latency": 12                       // ms
  },
  "ssl": {
    "expiresAt": "2026-02-01T00:00:00Z",
    "daysUntilExpiry": 88
  }
}

// Error Response (503 Service Unavailable)
{
  "status": "error",
  "timestamp": "2025-11-05T14:30:00Z",
  "uptime": 120,
  "database": {
    "status": "disconnected",
    "latency": null
  }
}
```

**2. Docker Health Check Interface**
```dockerfile
# Backend Dockerfile HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Frontend Dockerfile HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:5173 || exit 1
```

**3. Nginx Upstream Health Monitoring**
```nginx
# Nginx health checks (automatic retry on backend failure)
upstream backend {
  server backend:3000 max_fails=3 fail_timeout=30s;
}

upstream frontend {
  server frontend:5173 max_fails=3 fail_timeout=30s;
}
```

**4. Backup API (optional, Admin-only)**
```typescript
// Optional: Trigger Manual Backup via Admin API
POST /api/admin/backup/trigger
Authorization: Bearer <admin-session-token>

// Response (202 Accepted)
{
  "backupId": "2025-11-05-143000",
  "status": "in-progress",
  "estimatedDuration": 10       // seconds
}

// List Backups
GET /api/admin/backup/list
Authorization: Bearer <admin-session-token>

// Response (200 OK)
{
  "backups": [
    {
      "backupId": "2025-11-05-143000",
      "createdAt": "2025-11-05T14:30:00Z",
      "type": "full",
      "sizeBytes": 1024000,
      "retentionUntil": "2025-12-05T14:30:00Z"
    }
  ]
}
```

**5. Deployment Status Interface (GitHub Actions Webhook, optional)**
```typescript
// Optional: Deployment Status Endpoint für Monitoring
GET /api/deployment/status

// Response (200 OK)
{
  "lastDeployment": {
    "commitSha": "abc123def",
    "deployedAt": "2025-11-05T14:00:00Z",
    "deployedBy": "github-actions",
    "status": "success",
    "services": {
      "frontend": { "version": "1.0.0", "status": "healthy" },
      "backend": { "version": "1.0.0", "status": "healthy" }
    }
  }
}
```

**6. SSL Certificate Information (Nginx API, optional)**
```bash
# Certbot Certificate Info (CLI-Interface)
docker-compose exec certbot certbot certificates

# Output
Certificate Name: cv-hub.example.com
  Domains: cv-hub.example.com
  Expiry Date: 2026-02-01 00:00:00+00:00 (VALID: 88 days)
  Certificate Path: /etc/letsencrypt/live/cv-hub.example.com/fullchain.pem
  Private Key Path: /etc/letsencrypt/live/cv-hub.example.com/privkey.pem
```

### Workflows and Sequencing

**1. CI/CD Pipeline Sequence (GitHub Actions)**

```
┌─────────────────────────────────────────────────────────────────┐
│ Git Push (main branch)                                           │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Stage 1: Test                                                    │
│ - Checkout code                                                  │
│ - Install dependencies (pnpm)                                    │
│ - Run ESLint (Frontend + Backend)                               │
│ - Run TypeScript checks                                          │
│ - Run Vitest (Frontend unit tests)                              │
│ - Run Jest (Backend unit tests)                                 │
└────────────┬────────────────────────────────────────────────────┘
             │ (on success)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Stage 2: Build                                                   │
│ - Build Frontend (pnpm --filter frontend build)                 │
│ - Build Backend (pnpm --filter backend build)                   │
│ - Build Docker Images                                            │
│   - docker build -t cv-hub-backend ./apps/backend                │
│   - docker build -t cv-hub-frontend ./apps/frontend              │
└────────────┬────────────────────────────────────────────────────┘
             │ (on success)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Stage 3: Deploy (only on main branch)                           │
│ - SSH to VPS                                                     │
│ - cd /opt/cv-hub                                                 │
│ - git pull origin main                                           │
│ - docker-compose down                                            │
│ - docker-compose up -d --build                                   │
│ - Wait for services to be healthy (30s timeout)                 │
└────────────┬────────────────────────────────────────────────────┘
             │ (on success)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Stage 4: Smoke Tests                                             │
│ - curl https://cv-hub.example.com/api/health                     │
│ - Verify HTTP 200 OK                                             │
│ - Verify {"status": "ok"}                                        │
│ - curl https://cv-hub.example.com/ (Frontend)                    │
│ - Verify HTTP 200 OK                                             │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Deployment Complete ✅                                           │
│ - Notify (optional: Slack, Email)                               │
│ - Log deployment to manifest                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Rollback on Failure:**
```bash
# Automatic Rollback wenn Stage 4 (Smoke Tests) fehlschlägt
git log -1 --skip=1 --format="%H"  # Previous commit
git checkout <previous-commit>
docker-compose up -d --build
```

---

**2. SSL Certificate Renewal Workflow (Certbot)**

```
┌─────────────────────────────────────────────────────────────────┐
│ Certbot Container (12h Check-Interval)                          │
│ - Prüft Certificate Expiry via Let's Encrypt API                │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
        ┌─────────┐
        │ < 30d ? │───No───► Continue (nichts zu tun)
        └────┬────┘
             │ Yes
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Renew Certificate                                                │
│ - certbot renew                                                  │
│ - Webroot Challenge via /var/www/certbot                         │
│ - Let's Encrypt validates Domain ownership                       │
│ - New Certificate issued                                         │
└────────────┬────────────────────────────────────────────────────┘
             │ (on success)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Reload Nginx Config                                              │
│ - docker-compose exec nginx nginx -s reload                      │
│ - Nginx picks up new certificates                                │
│ - Zero-Downtime Reload                                           │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Certificate Renewed ✅                                           │
│ - New Expiry: +90 days                                           │
│ - Old Cert archived                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

**3. Daily Backup Workflow (Cron on Host)**

```
┌─────────────────────────────────────────────────────────────────┐
│ Cron Job: Daily 02:00 UTC                                        │
│ - /opt/cv-hub-backups/backup.sh                                  │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Backup SQLite Database                                   │
│ - cp /opt/cv-hub/data/cv-hub.db                                  │
│      /opt/cv-hub-backups/cv-hub-2025-11-05.db                    │
│ - Calculate SHA-256 Checksum                                     │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Backup Uploads Directory                                 │
│ - tar -czf /opt/cv-hub-backups/uploads-2025-11-05.tar.gz         │
│         /opt/cv-hub/uploads/                                     │
│ - Calculate SHA-256 Checksum                                     │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Update Backup Manifest                                   │
│ - Append BackupEntry to backup-manifest.json                     │
│ - Record: backupId, createdAt, sizeBytes, checksum               │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Cleanup Old Backups (30-Day Retention)                  │
│ - Find backups older than 30 days                                │
│ - Delete files: rm /opt/cv-hub-backups/*-2025-10-05.*            │
│ - Update backup-manifest.json (remove expired entries)           │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Backup Complete ✅                                               │
│ - Log to syslog                                                  │
│ - Optional: Notify on failure (email/slack)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

**4. Initial Deployment Workflow (First-Time Setup)**

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: VPS Provisioning                                         │
│ - Provision VPS (Hetzner/DigitalOcean)                           │
│ - Install Docker + Docker Compose                                │
│ - Configure Firewall (UFW: allow 22, 80, 443)                   │
│ - Create /opt/cv-hub directory                                   │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Clone Repository                                         │
│ - git clone https://github.com/username/cv-hub.git /opt/cv-hub   │
│ - cd /opt/cv-hub                                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Configure Environment                                    │
│ - cp .env.example .env                                           │
│ - Edit .env (SESSION_SECRET, GEMINI_API_KEY, DOMAIN, etc.)      │
│ - Validate all required variables set                            │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Configure DNS                                            │
│ - Add A Record: cv-hub.example.com → VPS IP                      │
│ - Wait for DNS propagation (max 24h, usually <1h)               │
│ - Verify: dig cv-hub.example.com                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Initial SSL Certificate (HTTP Challenge)                │
│ - docker-compose up -d nginx                                     │
│ - docker-compose run --rm certbot certonly --webroot             │
│     --webroot-path=/var/www/certbot                              │
│     -d cv-hub.example.com                                        │
│     --email admin@example.com --agree-tos                        │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: Start All Services                                       │
│ - docker-compose up -d                                           │
│ - Wait for health checks (docker-compose ps)                     │
│ - Verify all services: healthy                                   │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 7: Post-Deployment Verification                             │
│ - curl https://cv-hub.example.com/api/health                     │
│ - curl https://cv-hub.example.com/                               │
│ - Test Admin Login: https://cv-hub.example.com/admin/login       │
│ - Run Lighthouse Audit (Performance, SEO, Accessibility)         │
│ - Run SSL Labs Test: https://www.ssllabs.com/ssltest/           │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Deployment Complete 🚀                                           │
│ - cv-hub is LIVE!                                                │
│ - Monitor logs: docker-compose logs -f                           │
└─────────────────────────────────────────────────────────────────┘
```

**Sequencing Notes:**
- CI/CD Pipeline runs on every main branch push (3-5 minutes total)
- SSL Renewal läuft automatisch alle 12h (nur renewal wenn < 30 Tage)
- Backups laufen täglich um 02:00 UTC (niedrige Traffic-Zeit)
- Initial Deployment ist manuell, danach alles automatisiert

## Non-Functional Requirements

### Performance

**Production Performance Targets (identisch mit PRD):**

- **Lighthouse Score:** >90 in allen Kategorien (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint (FCP):** <1.5s
- **Time to Interactive (TTI):** <3s
- **Largest Contentful Paint (LCP):** <2.5s
- **Cumulative Layout Shift (CLS):** <0.1
- **Bundle Size:** <200KB (gzipped, initial load)

**Production-Specific Performance Requirements:**

1. **Server Response Times:**
   - API Health Check: <50ms (p95)
   - API CV Data: <100ms (p95)
   - SSR Rendering: <500ms (p95)
   - Static Assets (via Nginx): <20ms (p95)

2. **Database Performance:**
   - SQLite Query Latency: <10ms (p95)
   - Database File Size: <50MB (growth-controlled via retention)
   - Connection Pool: 5 concurrent connections (ausreichend für Traffic)

3. **Container Resource Limits:**
   ```yaml
   # Docker Compose Resource Constraints
   backend:
     deploy:
       resources:
         limits:
           cpus: '1.0'
           memory: 512M
         reservations:
           cpus: '0.5'
           memory: 256M

   frontend:
     deploy:
       resources:
         limits:
           cpus: '0.5'
           memory: 256M
         reservations:
           cpus: '0.25'
           memory: 128M

   nginx:
     deploy:
       resources:
         limits:
           cpus: '0.25'
           memory: 128M
   ```

4. **Network Performance:**
   - Total Page Weight: <2MB (unkomprimiert)
   - Gzip Compression: Enabled (Nginx) für alle text-based assets
   - HTTP/2: Enabled via Nginx
   - Keep-Alive: 30s timeout

5. **Caching Strategy:**
   - Static Assets: `Cache-Control: public, max-age=31536000, immutable`
   - API Responses: `Cache-Control: private, no-cache` (wegen personalisierter Daten)
   - HTML (SSR): `Cache-Control: private, max-age=0, must-revalidate`

**Monitoring & Alerting:**
- Health Check fehlschlägt 3x consecutive → Alert
- Response Time >1s (p95) → Alert
- Container Memory Usage >80% → Alert
- Disk Space <10% free → Alert

### Security

**Production Security Requirements:**

1. **SSL/TLS Configuration:**
   - TLS 1.2+ only (TLS 1.0/1.1 disabled)
   - Strong Cipher Suites (Mozilla Modern Profile)
   - HSTS Header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - SSL Labs Score: **A oder höher** (Ziel: A+)
   - Certificate Auto-Renewal via Let's Encrypt

2. **Security Headers (Nginx + Helmet.js):**
   ```nginx
   # Nginx Security Headers
   add_header X-Frame-Options "DENY";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Referrer-Policy "strict-origin-when-cross-origin";
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
   ```

3. **Firewall Configuration (UFW auf VPS):**
   ```bash
   # Allow SSH (22), HTTP (80), HTTPS (443)
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP (redirect to HTTPS)
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```

4. **Rate Limiting (Production-Level):**
   - Public Endpoints: 100 requests/minute pro IP
   - Admin Endpoints: 50 requests/minute pro Session
   - Login Endpoint: 5 requests/minute pro IP (Brute-Force Protection)
   - CV Extraction: 5 requests/hour (ressourcenintensiv)

5. **Secret Management:**
   - Alle Secrets in `.env` File (nicht im Git-Repo)
   - SESSION_SECRET: 64 Zeichen Random Hex (openssl rand -hex 32)
   - ADMIN_PASSWORD: Bcrypt-hashed (Cost Factor 12)
   - GEMINI_API_KEY: Google API Key (rotierbar)
   - File Permissions: `.env` → 600 (nur Owner read/write)

6. **Container Security:**
   - Non-Root User in allen Containern
   - Read-Only Root Filesystem (wo möglich)
   - No Privileged Containers
   - Seccomp Profiles: Docker Default
   - AppArmor/SELinux: Host-Level-Enforcement

7. **Database Security:**
   - SQLite File Permissions: 600 (nur Backend-Container)
   - No Network-Exposed Database (nur File-based)
   - Regular Backups (täglich, encrypted in Transit wenn remote)

8. **Vulnerability Management:**
   - `npm audit` in CI/CD Pipeline (fails on critical)
   - Dependabot Auto-PRs für Security-Updates
   - Docker Image Scanning (Trivy oder Snyk)
   - Quarterly Security Review

**Security Audit Checklist (Pre-Launch):**
- [ ] SSL Labs Test: A oder höher
- [ ] Security Headers Check: securityheaders.com
- [ ] OWASP Top 10 Review
- [ ] npm audit: 0 critical/high vulnerabilities
- [ ] Firewall configured correctly
- [ ] No secrets in Git history

### Reliability/Availability

**Availability Targets:**
- **Uptime:** 99.5% (ca. 3.6h Downtime pro Monat akzeptabel)
- **Planned Maintenance Window:** Dienstags 02:00-04:00 UTC (niedrige Traffic-Zeit)
- **Recovery Time Objective (RTO):** <15 Minuten (Zeit bis Service wieder online)
- **Recovery Point Objective (RPO):** <24 Stunden (max. Datenverlust bei Disaster)

**High Availability Maßnahmen:**

1. **Container Auto-Restart:**
   ```yaml
   # Docker Compose
   services:
     backend:
       restart: unless-stopped  # Auto-restart on failure
     frontend:
       restart: unless-stopped
     nginx:
       restart: unless-stopped
   ```

2. **Health Checks & Auto-Recovery:**
   - Docker Health Checks: Alle 30s
   - Unhealthy → Automatic Container Restart (nach 3 failed checks)
   - Nginx Upstream Health Monitoring (max_fails=3, fail_timeout=30s)

3. **Graceful Degradation:**
   - Backend-Ausfall → Nginx 503 mit Custom Error Page
   - Database-Latency → Timeout nach 5s, Error Response statt Hang
   - Gemini API-Ausfall → Manual JSON Editing weiterhin möglich

4. **Data Durability:**
   - SQLite auf Persistent Volume (survives container restarts)
   - Daily Backups mit 30-Tage-Retention
   - Backup-Checksums (SHA-256) für Integrity-Verification
   - Backup-Location: Separate Disk/Volume (nicht auf OS-Disk)

5. **Rollback Strategy:**
   - Git-basiertes Rollback (previous commit deployment)
   - Database-Migration-Rollback (falls Schema-Änderungen)
   - Automated Rollback bei Smoke-Test-Failure (CI/CD)

6. **Monitoring & Alerting:**
   - Uptime-Monitoring: UptimeRobot oder Better Uptime (optional)
   - Health Check API: `/api/health` (alle 60s extern gechecked)
   - Alert Channels: Email (minimum), Slack (optional)
   - Alert on: 3x consecutive failures, >1s response time, Memory >80%

**Disaster Recovery Procedure:**

```bash
# Scenario: VPS Total Failure
# 1. Provision new VPS
# 2. Install Docker + Docker Compose
# 3. Clone Repository
git clone https://github.com/username/cv-hub.git /opt/cv-hub

# 4. Restore Backup
cp /backup-location/cv-hub-2025-11-05.db /opt/cv-hub/data/cv-hub.db
tar -xzf /backup-location/uploads-2025-11-05.tar.gz -C /opt/cv-hub/uploads/

# 5. Configure Environment
cp .env.example .env
# Edit .env with secrets

# 6. Deploy
docker-compose up -d

# 7. Verify
curl https://cv-hub.example.com/api/health
# Expected: {"status": "ok"}

# Total Recovery Time: ~15 Minuten
```

**Expected Downtime Scenarios:**
- **Deployment:** <30s (docker-compose down → up)
- **SSL Renewal:** 0s (Nginx reload, kein Downtime)
- **Backup:** 0s (runs on host, read-only access)
- **VPS Restart:** <2min (Docker auto-starts all services)
- **Total Disaster (VPS verloren):** <15min (mit Backup-Restore)

### Observability

**Logging Strategy:**

1. **Structured Logging (Winston):**
   ```typescript
   // Backend Logging Format (JSON)
   {
     "timestamp": "2025-11-05T14:30:00.123Z",
     "level": "info",
     "message": "API request",
     "context": {
       "method": "GET",
       "path": "/api/cv/public",
       "statusCode": 200,
       "responseTime": 45,      // ms
       "userAgent": "Mozilla/5.0...",
       "ip": "xxx.xxx.xxx.xxx"  // anonymized (last octet removed)
     },
     "correlationId": "req-abc123"  // Request tracing
   }
   ```

2. **Log Levels:**
   - **ERROR:** System failures, uncaught exceptions, failed requests (4xx/5xx)
   - **WARN:** Rate-limit exceeded, slow queries (>1s), deprecated API usage
   - **INFO:** API requests, deployments, backups, SSL renewals
   - **DEBUG:** Development-only (disabled in production)

3. **Log Rotation:**
   ```yaml
   # Winston Log Rotation (daily-rotate-file)
   - Rotation: Daily at midnight UTC
   - Retention: 7 Tage
   - Max File Size: 20MB
   - Compression: gzip (alte Logs)
   - Location: /app/logs/ (Docker Volume)
   ```

4. **Log Access:**
   ```bash
   # View Logs via Docker
   docker-compose logs -f backend       # Backend live logs
   docker-compose logs -f frontend      # Frontend live logs
   docker-compose logs --tail=100 nginx # Last 100 nginx lines

   # On Host
   tail -f /opt/cv-hub/data/logs/backend-2025-11-05.log
   ```

**Metrics Collection:**

1. **Application Metrics (via Health Check API):**
   - Uptime (seconds seit Container-Start)
   - Database latency (ms)
   - SSL Certificate expiry (days until expiry)
   - Request count (optional: expose via `/api/metrics`)

2. **Container Metrics (Docker Stats):**
   ```bash
   docker stats cv-hub-backend cv-hub-frontend cv-hub-nginx
   # Output: CPU%, Memory Usage, Network I/O, Block I/O
   ```

3. **System Metrics (VPS-Level):**
   - CPU Usage
   - Memory Usage
   - Disk Space (/, /opt/cv-hub, /opt/cv-hub-backups)
   - Network Bandwidth
   - Load Average

**Tracing:**

1. **Request Correlation IDs:**
   - Alle API-Requests erhalten Correlation-ID (Header: `X-Request-ID`)
   - Propagiert durch alle Logs eines Requests
   - Ermöglicht End-to-End Request-Tracing

2. **Error Tracking:**
   - Uncaught Exceptions werden logged (Winston)
   - Optional: Sentry Integration für Error Aggregation
   - Stack Traces in Logs (nur ERROR-Level)

**Monitoring Signals (Required):**

1. **Health Check Endpoint:**
   - URL: `GET /api/health`
   - Response: `{"status": "ok", ...}`
   - Frequency: Alle 60s (externer Monitor)
   - Alert on: 3x consecutive failures

2. **Performance Signals:**
   - Response Time (p95): <1s
   - Database Latency: <10ms
   - SSR Rendering Time: <500ms

3. **Error Signals:**
   - 5xx Error Rate: <0.1%
   - 4xx Error Rate: <5%
   - Uncaught Exceptions: 0 per hour

4. **Resource Signals:**
   - Container Memory Usage: <80%
   - Disk Space: >10% free
   - CPU Usage: <70% sustained

**Alerting Channels:**

1. **Email Alerts (Minimum):**
   - 3x consecutive health check failures
   - Disk space <10%
   - Backup failures

2. **Slack/Webhook Alerts (Optional):**
   - Deployment notifications
   - SSL Certificate expiry warnings (<7 Tage)
   - High error rates

**Observability Tools:**

- **Logs:** Winston (structured JSON logs)
- **Metrics:** Docker Stats + Health Check API
- **Uptime:** UptimeRobot oder Better Uptime (optional)
- **Dashboards:** Optional - Grafana + Prometheus (Growth-Feature)
- **Error Tracking:** Optional - Sentry (Growth-Feature)

## Dependencies and Integrations

**Epic 7 hat keine neuen Application-Level Dependencies, sondern Infrastructure-Dependencies:**

### Infrastructure Dependencies

**1. Docker & Docker Compose**
- **Version:** Docker 24.x+, Docker Compose 2.x+
- **Purpose:** Container-Orchestrierung, Multi-Service-Management
- **Installation:** VPS muss Docker + Docker Compose haben
- **Critical:** Ja - ohne Docker läuft nichts

**2. Nginx (Containerized)**
- **Image:** `nginx:alpine`
- **Version:** Latest stable (Alpine-based für kleine Image-Size)
- **Purpose:** Reverse Proxy, SSL Termination, Static Assets
- **Configuration:** Custom `nginx.conf` (in Repository)

**3. Certbot (Let's Encrypt Client)**
- **Image:** `certbot/certbot`
- **Version:** Latest stable
- **Purpose:** SSL Certificate Acquisition + Auto-Renewal
- **Rate Limits:** Let's Encrypt: 50 certificates/domain/week (mehr als ausreichend)

**4. VPS Provider (Hetzner oder DigitalOcean)**
- **Requirements:**
  - 2 vCPU, 2GB RAM (minimum)
  - 40GB SSD Storage
  - 1TB Transfer/month
  - Static IP Address
  - Ubuntu 22.04 LTS oder Debian 12
- **Cost:** ~€5-10/month
- **Alternatives:** Hetzner CX21, DigitalOcean Droplet ($12/month)

**5. Domain Name & DNS**
- **Provider:** Beliebig (Namecheap, CloudFlare, etc.)
- **DNS Records:**
  - A Record: `cv-hub.example.com` → VPS IP (IPv4)
  - AAAA Record (optional): IPv6
- **TTL:** 300s (5min) für schnelle Änderungen
- **Critical:** Ja - ohne Domain kein SSL

**6. GitHub (Code Hosting + CI/CD)**
- **Repository:** Public oder Private
- **GitHub Actions:** Free Tier ausreichend (2000 minutes/month)
- **Secrets:** VPS_HOST, VPS_USER, VPS_SSH_KEY (in Repo Settings)

### External Service Dependencies

**1. Let's Encrypt (SSL/TLS)**
- **API:** ACME v2 Protocol
- **Rate Limits:**
  - 50 certificates per registered domain per week
  - 5 duplicate certificates per week
  - 300 pending authorizations per account
- **Uptime:** 99.9% (Let's Encrypt SLA)
- **Failure Mode:** Certificate nicht erneuerbar → Manual Renewal möglich

**2. Google Gemini API (für Epic 6 - CV Extraction)**
- **Already integrated in Epic 6**
- **API Key:** Required in `.env`
- **Rate Limits:** 60 requests/minute (Free Tier)
- **Failure Mode:** CV Extraction nicht verfügbar → Manual JSON Editing weiterhin möglich

### Build-Time Dependencies

**Backend (NestJS) - Unchanged from Epic 1:**
```json
{
  "dependencies": {
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.0",
    "sqlite3": "^5.1.0",
    "helmet": "^8.0.0",
    "express-rate-limit": "^7.0.0",
    "winston": "^3.11.0",
    "argon2": "^0.31.0",
    "passport": "^0.7.0",
    "dotenv": "^16.3.0"
  }
}
```

**Frontend (TanStack Start) - Unchanged from Epic 3:**
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-router": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

**Nginx - Runtime Configuration (keine npm-Dependencies):**
- Nginx Alpine Image beinhaltet alle erforderlichen Module
- Keine zusätzlichen Plugins erforderlich

### Integration Points

**1. VPS SSH Access (GitHub Actions → VPS)**
```yaml
# GitHub Actions SSH Deployment
- name: Deploy to VPS
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    script: |
      cd /opt/cv-hub
      git pull origin main
      docker-compose up -d --build
```

**2. Let's Encrypt ACME Challenge (Certbot ↔ Nginx)**
```nginx
# Nginx serves ACME challenge files
location /.well-known/acme-challenge/ {
  root /var/www/certbot;
}
```

**3. Docker Network (Internal Communication)**
```yaml
# Docker Compose Network
networks:
  default:
    name: cv-hub-network
    driver: bridge

# All services communicate via service names:
# - backend:3000 (Frontend → Backend)
# - frontend:5173 (Nginx → Frontend)
```

**4. Volume Mounts (Host ↔ Containers)**
```yaml
volumes:
  # SQLite Database
  - ./data:/app/data

  # Logs
  - ./logs:/app/logs

  # Uploads (Epic 6)
  - ./uploads:/app/uploads

  # SSL Certificates
  - ./certbot/conf:/etc/letsencrypt:ro
  - ./certbot/www:/var/www/certbot:ro
```

### Dependency Risks & Mitigations

**Risk: Docker Hub Rate Limiting**
- **Mitigation:** Use Docker's authenticated pulls, oder self-host images

**Risk: Let's Encrypt Outage**
- **Mitigation:** Certificates valid for 90 days, Renewal 30 days before expiry (60-day buffer)

**Risk: VPS Provider Outage**
- **Mitigation:** Daily Backups, documented Disaster Recovery Procedure (<15min Recovery Time)

**Risk: GitHub Actions Outage**
- **Mitigation:** Manual Deployment via SSH weiterhin möglich

**Risk: DNS Provider Outage**
- **Mitigation:** Cached DNS (TTL), Service bleibt erreichbar für cached clients

### Version Constraints

**Docker:**
- Minimum: 24.0.0 (für BuildKit multi-platform support)
- Recommended: Latest stable

**Docker Compose:**
- Minimum: 2.0.0 (neue Compose-Spec-Format)
- Recommended: 2.20+

**Node.js (in Containers):**
- Version: 20 LTS (frozen via Dockerfile `FROM node:20-alpine`)
- No host Node.js required

**Nginx:**
- Version: Latest Alpine (auto-updated via `nginx:alpine` tag)
- Locked to major version in production (optional: pin to `nginx:1.25-alpine`)

**Operating System (VPS):**
- Ubuntu 22.04 LTS (supported until 2027)
- Debian 12 (supported until 2028)
- Firewall: UFW (Ubuntu) oder iptables (Debian)

## Acceptance Criteria (Authoritative)

**Diese Acceptance Criteria sind autoritativ und müssen vollständig erfüllt sein für Epic 7 Completion:**

### AC-1: Docker Compose Production Setup

**Criteria:**
- [ ] `docker-compose.yml` existiert mit allen Services (nginx, frontend, backend, certbot)
- [ ] Alle Services haben `restart: unless-stopped` Policy
- [ ] Persistent Volumes konfiguriert für: `/app/data`, `/app/logs`, `/app/uploads`, `/etc/letsencrypt`
- [ ] Resource Limits definiert (Backend: 512M RAM, Frontend: 256M, Nginx: 128M)
- [ ] Health Checks konfiguriert für Backend und Frontend
- [ ] `docker-compose up -d` startet alle Services erfolgreich
- [ ] `docker-compose ps` zeigt alle Services als "healthy"

**Verification:**
```bash
docker-compose up -d
docker-compose ps
# Expected: All services "Up (healthy)"
```

---

### AC-2: HTTPS & SSL Configuration

**Criteria:**
- [ ] Domain ist konfiguriert (DNS A Record → VPS IP)
- [ ] Let's Encrypt Certificate erfolgreich acquired
- [ ] HTTPS funktioniert: `https://cv-hub.example.com` lädt ohne Warnung
- [ ] HTTP → HTTPS Redirect funktioniert
- [ ] SSL Labs Test: Score A oder höher
- [ ] Certificate Auto-Renewal läuft (Certbot Container aktiv)
- [ ] Security Headers gesetzt (HSTS, X-Frame-Options, CSP, etc.)

**Verification:**
```bash
curl -I https://cv-hub.example.com
# Expected: HTTP/2 200, Strict-Transport-Security header present

# SSL Labs Test
https://www.ssllabs.com/ssltest/analyze.html?d=cv-hub.example.com
# Expected: A or A+ rating
```

---

### AC-3: CI/CD Pipeline Operational

**Criteria:**
- [ ] GitHub Actions Workflow existiert (`.github/workflows/deploy.yml`)
- [ ] Workflow hat 4 Stages: Test, Build, Deploy, Smoke Tests
- [ ] Git Push auf main branch triggert Workflow
- [ ] Tests laufen durch (ESLint, TypeScript, Vitest, Jest)
- [ ] Docker Images werden gebaut
- [ ] Deployment via SSH funktioniert
- [ ] Smoke Tests validieren Health Check und Frontend
- [ ] Deployment dauert <5 Minuten (end-to-end)
- [ ] Rollback funktioniert bei Smoke-Test-Failure

**Verification:**
```bash
git push origin main
# Wait for GitHub Actions
# Check: https://github.com/username/cv-hub/actions
# Expected: ✅ All checks passed
```

---

### AC-4: Monitoring & Logging Active

**Criteria:**
- [ ] Winston Logger aktiv (strukturierte JSON Logs)
- [ ] Logs werden geschrieben: `/app/logs/backend-YYYY-MM-DD.log`
- [ ] Log Rotation funktioniert (täglich, 7 Tage Retention)
- [ ] Health Check Endpoint funktioniert: `GET /api/health` → 200 OK
- [ ] Health Check Response enthält: status, uptime, version, database, ssl
- [ ] Logs sind zugreifbar: `docker-compose logs -f backend`
- [ ] Correlation IDs in Logs vorhanden (Request Tracing)

**Verification:**
```bash
curl https://cv-hub.example.com/api/health
# Expected: {"status": "ok", "uptime": 3600, ...}

docker-compose logs --tail=50 backend | grep '"level":"info"'
# Expected: JSON-formatted logs with correlationId
```

---

### AC-5: Backup Strategy Implemented

**Criteria:**
- [ ] Backup-Script existiert: `/opt/cv-hub-backups/backup.sh`
- [ ] Cron-Job konfiguriert (täglich 02:00 UTC)
- [ ] Backup erstellt SQLite-DB-Copy mit Timestamp
- [ ] Backup erstellt tar.gz von Uploads-Directory
- [ ] Backup-Manifest wird aktualisiert (`backup-manifest.json`)
- [ ] SHA-256 Checksums werden berechnet
- [ ] Old Backups werden gelöscht (>30 Tage)
- [ ] Backup-Restore dokumentiert und getestet

**Verification:**
```bash
# Trigger manual backup
/opt/cv-hub-backups/backup.sh

# Check backup files
ls -lh /opt/cv-hub-backups/
# Expected: cv-hub-YYYY-MM-DD.db, uploads-YYYY-MM-DD.tar.gz

# Check manifest
cat /opt/cv-hub-backups/backup-manifest.json
# Expected: JSON with backup entries
```

---

### AC-6: Security Hardening Complete

**Criteria:**
- [ ] Firewall aktiv (UFW): nur Ports 22, 80, 443 offen
- [ ] Alle Secrets in `.env` (nicht im Git-Repo)
- [ ] `.env` File Permissions: 600 (nur Owner read/write)
- [ ] SESSION_SECRET ist 64-Zeichen Random Hex
- [ ] ADMIN_PASSWORD ist Bcrypt-hashed
- [ ] Rate-Limiting aktiv (Nginx: 100 req/min)
- [ ] Security Headers gesetzt (Helmet.js + Nginx)
- [ ] No privileged Docker Containers
- [ ] npm audit: 0 critical/high vulnerabilities

**Verification:**
```bash
# Check Firewall
sudo ufw status
# Expected: Status: active, Ports 22,80,443 ALLOW

# Check .env permissions
ls -la /opt/cv-hub/.env
# Expected: -rw------- 1 user user (600)

# Check secrets not in Git
git log --all --full-history -- "*env*" | head
# Expected: No .env files committed

# Security Audit
pnpm audit --audit-level=high
# Expected: 0 vulnerabilities
```

---

### AC-7: Performance Targets Met

**Criteria:**
- [ ] Lighthouse Score >90 (alle Kategorien)
- [ ] First Contentful Paint (FCP) <1.5s
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] Time to Interactive (TTI) <3s
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] API Health Check Response Time <50ms (p95)
- [ ] Static Assets served mit Gzip Compression

**Verification:**
```bash
# Run Lighthouse
lighthouse https://cv-hub.example.com --output=json --quiet

# Expected:
# Performance: >90
# Accessibility: >90
# Best Practices: >90
# SEO: >90

# Check Response Time
curl -w "@curl-format.txt" -o /dev/null -s https://cv-hub.example.com/api/health
# Expected: time_total < 0.05s (50ms)
```

---

### AC-8: Post-Deployment Verification Checklist

**Criteria:**
- [ ] Public CV Page loads: `https://cv-hub.example.com/`
- [ ] Admin Login works: `https://cv-hub.example.com/admin/login`
- [ ] Test Invite Link Creation (Admin Dashboard)
- [ ] Personalized Link works: `https://cv-hub.example.com/invite/{token}`
- [ ] CV Extraction works (Upload PDF → Extract → Save)
- [ ] All Docker Containers healthy: `docker-compose ps`
- [ ] No errors in logs: `docker-compose logs --tail=100`
- [ ] SSL Certificate valid (Browser shows padlock)

**Verification:**
```bash
# Full E2E Test
curl -I https://cv-hub.example.com/
# Expected: HTTP/2 200

curl -I https://cv-hub.example.com/admin/login
# Expected: HTTP/2 200

docker-compose ps
# Expected: All services "Up (healthy)"

docker-compose logs --tail=100 | grep -i error
# Expected: No critical errors
```

---

### AC-9: Documentation Complete

**Criteria:**
- [ ] README enthält Production Deployment Instructions
- [ ] Environment Variables dokumentiert (`.env.example`)
- [ ] Disaster Recovery Procedure dokumentiert
- [ ] Backup/Restore Procedure dokumentiert
- [ ] Monitoring & Alerting Setup dokumentiert
- [ ] Troubleshooting Guide vorhanden
- [ ] Architecture Diagram aktualisiert (mit Production-Setup)

**Verification:**
- README.md contains "Production Deployment" section
- .env.example contains all required variables with comments
- docs/ directory contains operational runbooks

---

### AC-10: Go-Live Readiness

**Criteria:**
- [ ] Alle vorangegangenen AC (AC-1 bis AC-9) erfüllt
- [ ] VPS läuft stabil (Uptime >24h ohne Restart)
- [ ] Kein Memory Leak (Container Memory stabil über 24h)
- [ ] No Critical Bugs in Logs (24h observation period)
- [ ] External Monitoring aktiv (UptimeRobot oder äquivalent)
- [ ] Alerting funktioniert (Test-Alert versendet und empfangen)
- [ ] Backup-Restore getestet (Restore von gestern funktioniert)
- [ ] Team-Walkthrough abgeschlossen (alle Features demonstriert)

**Verification:**
- 24h Stability Test passed
- All monitoring alerts configured and tested
- Disaster Recovery tested successfully

## Traceability Mapping

**Diese Tabelle mapped Acceptance Criteria → PRD Requirements → Architecture Sections → Components/Services → Test-Ideen:**

| AC | PRD Requirement | Architecture Section | Components/Services | Test Idea |
|----|----------------|---------------------|---------------------|-----------|
| **AC-1** | FR-7.1 (Docker Compose Setup) | Deployment Architecture → Docker Compose Setup | docker-compose.yml, Dockerfile (Backend/Frontend), Volume Mounts | Integration Test: `docker-compose up -d && docker-compose ps` → All healthy |
| **AC-2** | FR-7.6 (HTTPS-Support) | Deployment Architecture → SSL/TLS, Nginx Config | Nginx Reverse Proxy, Certbot Service, Let's Encrypt | Manual Test: SSL Labs Test → A+ Rating, `curl -I https://...` → HSTS header present |
| **AC-3** | FR-7.3 (CI/CD-Pipeline) | Deployment Architecture → CI/CD Pipeline | GitHub Actions Workflow, SSH Deployment, Smoke Tests | E2E Test: Git push → Wait for Actions → Verify deployment success |
| **AC-4** | FR-7.4 (Monitoring & Logging) | Non-Functional → Observability | Winston Logger, Health Check Service, Log Rotation | Integration Test: `curl /api/health` → 200 OK, Check logs contain correlationId |
| **AC-5** | FR-7.5 (Backup-Strategie) | Deployment Architecture → Backup Strategy | Backup Service (Cron), Backup Script, Backup Manifest | Manual Test: Run backup.sh → Verify files created → Test restore |
| **AC-6** | NFR-Security (Firewall, Secrets) | Non-Functional → Security | UFW Firewall, .env Secret Management, Rate Limiting (Nginx) | Manual Test: `ufw status`, `ls -la .env`, `npm audit`, SSL Labs |
| **AC-7** | NFR-Performance (Lighthouse >90) | Non-Functional → Performance | Nginx (Gzip, Caching), Frontend (SSR), Backend (Response Times) | Automated Test: Lighthouse CI → Score >90, Performance monitoring |
| **AC-8** | FR-1 to FR-6 (All Features Work) | System Overview → Full Stack | All Services (Frontend, Backend, Nginx, Database) | E2E Test: Manual walkthrough of all features (Public CV, Admin, Invite Links) |
| **AC-9** | Implicit (Documentation) | N/A (Project Documentation) | README.md, .env.example, docs/runbooks | Manual Review: Verify all docs exist and are up-to-date |
| **AC-10** | NFR-Reliability (Uptime 99.5%) | Non-Functional → Reliability/Availability | All Services, Monitoring, Alerting | 24h Stability Test: Monitor uptime, memory, logs → No critical issues |

---

### Detailed Traceability: AC → Spec Sections → Components

**AC-1: Docker Compose Production Setup**
- **PRD:** FR-7.1 (Docker Compose Setup)
- **Architecture:** Deployment Architecture → Docker Compose Setup (Lines 1925-1987)
- **Spec Sections:**
  - Services and Modules → Docker Compose Orchestrator
  - Workflows and Sequencing → Initial Deployment Workflow (Step 6)
- **Components:** docker-compose.yml, Dockerfile (Backend), Dockerfile (Frontend), Volumes
- **APIs:** N/A (Infrastructure)
- **Test:** `docker-compose up -d && docker-compose ps` → All services "Up (healthy)"

---

**AC-2: HTTPS & SSL Configuration**
- **PRD:** FR-7.6 (HTTPS-Support), NFR-Security (SSL Labs Score A+)
- **Architecture:** Deployment Architecture → Nginx Config, SSL/TLS (Lines 1693-1700)
- **Spec Sections:**
  - Services and Modules → Nginx Reverse Proxy, Certbot Service
  - Data Models → Nginx Configuration Contract, Environment Variables Contract
  - Workflows and Sequencing → SSL Certificate Renewal Workflow
- **Components:** Nginx (nginx.conf), Certbot Container, Let's Encrypt API
- **APIs:** Let's Encrypt ACME v2 Protocol
- **Test:** SSL Labs Test → A or A+, `curl -I https://...` → Security headers present

---

**AC-3: CI/CD Pipeline Operational**
- **PRD:** FR-7.3 (CI/CD-Pipeline)
- **Architecture:** Deployment Architecture → CI/CD Pipeline (Lines 2092-2163)
- **Spec Sections:**
  - Services and Modules → GitHub Actions CI/CD
  - Workflows and Sequencing → CI/CD Pipeline Sequence (4 Stages)
  - APIs and Interfaces → Deployment Status Interface (optional)
- **Components:** GitHub Actions Workflow, SSH Deployment, Smoke Tests, Rollback Script
- **APIs:** GitHub Actions API, SSH
- **Test:** Git push → GitHub Actions → All stages pass → Deployment successful

---

**AC-4: Monitoring & Logging Active**
- **PRD:** FR-7.4 (Monitoring & Logging)
- **Architecture:** Non-Functional Requirements → Observability (Lines 2209+)
- **Spec Sections:**
  - Services and Modules → Winston Logger, Health Check Service
  - APIs and Interfaces → Health Check Endpoint (extended)
  - Non-Functional Requirements → Observability (Logging Strategy)
- **Components:** Winston Logger, Health Check Endpoint, Log Rotation, Correlation IDs
- **APIs:** `GET /api/health`
- **Test:** `curl /api/health` → 200 OK with full response, Logs contain structured JSON

---

**AC-5: Backup Strategy Implemented**
- **PRD:** FR-7.5 (Backup-Strategie)
- **Architecture:** Deployment Architecture → Backup Strategy (Lines 2209-2222)
- **Spec Sections:**
  - Services and Modules → Backup Service (Cron)
  - Data Models → Backup Metadata, Backup Manifest
  - Workflows and Sequencing → Daily Backup Workflow
- **Components:** Backup Script (backup.sh), Cron Job, Backup Manifest (JSON)
- **APIs:** N/A (File-based)
- **Test:** Run backup.sh → Verify files created → Test restore from backup

---

**AC-6: Security Hardening Complete**
- **PRD:** NFR-Security (All Security Requirements)
- **Architecture:** Non-Functional Requirements → Security (Lines 1690+)
- **Spec Sections:**
  - Non-Functional Requirements → Security (SSL/TLS, Firewall, Rate Limiting, Secrets)
  - Data Models → Environment Variables Contract (Secrets Management)
- **Components:** UFW Firewall, .env File, Nginx Rate Limiting, Helmet.js, Argon2
- **APIs:** N/A (Security Configuration)
- **Test:** `ufw status`, `ls -la .env`, `npm audit`, SSL Labs Test, Security Headers Check

---

**AC-7: Performance Targets Met**
- **PRD:** NFR-Performance (Lighthouse >90, FCP <1.5s)
- **Architecture:** Non-Functional Requirements → Performance (Lines 2270+)
- **Spec Sections:**
  - Non-Functional Requirements → Performance (Lighthouse Targets, Response Times)
  - Data Models → Nginx Configuration Contract (Caching, Gzip)
- **Components:** Nginx (Caching, Gzip), Frontend (SSR), Backend (Optimized Queries)
- **APIs:** All API Endpoints (Response Time <100ms p95)
- **Test:** Lighthouse CI → Score >90, Performance monitoring (p95 metrics)

---

**AC-8: Post-Deployment Verification Checklist**
- **PRD:** FR-1 to FR-6 (All Functional Requirements)
- **Architecture:** System Overview → High-Level Architecture
- **Spec Sections:**
  - All Services and Modules
  - All APIs and Interfaces
- **Components:** All Services (Frontend, Backend, Nginx, Database, Certbot)
- **APIs:** All API Endpoints (CV, Invite, Admin, Health)
- **Test:** Manual E2E Walkthrough (Public CV, Admin Login, Invite Link, CV Extraction)

---

**AC-9: Documentation Complete**
- **PRD:** Implicit (Documentation Best Practice)
- **Architecture:** N/A (Project Documentation)
- **Spec Sections:** N/A (External Documentation)
- **Components:** README.md, .env.example, docs/runbooks, Architecture Diagram
- **APIs:** N/A (Documentation)
- **Test:** Manual Review → Verify all required docs exist and are complete

---

**AC-10: Go-Live Readiness**
- **PRD:** NFR-Reliability (Uptime 99.5%)
- **Architecture:** Non-Functional Requirements → Reliability/Availability
- **Spec Sections:**
  - Non-Functional Requirements → Reliability (Uptime Targets, RTO/RPO)
  - All Acceptance Criteria (AC-1 to AC-9)
- **Components:** All Services, Monitoring, Alerting, Backup/Restore
- **APIs:** All APIs (Health Check, Monitoring)
- **Test:** 24h Stability Test, Disaster Recovery Drill, Monitoring Alerts Test

---

### Cross-Reference: Epic 7 Dependencies on Previous Epics

| Epic 7 Component | Depends on Epic | Reason |
|------------------|----------------|---------|
| Docker Compose (Backend) | Epic 1 | Backend Foundation muss existieren |
| Docker Compose (Frontend) | Epic 3 | Frontend mit SSR muss existieren |
| SQLite Volume | Epic 2 | CV-Daten müssen existieren |
| Uploads Volume | Epic 6 | KI-Extraktion erstellt Uploads |
| Admin Authentication | Epic 5 | Session-based Auth für Admin |
| Invite Links | Epic 4 | Personalisierte Links müssen funktionieren |
| Health Check API | Epic 1 | Basic Health Check erweitert für Production |
| Monitoring (Winston) | Epic 1 | Logging Foundation erweitert für Production |

**Kritische Pfad:** Epic 1 → Epic 2 → Epic 3 → Epic 7 (MVP Go-Live)
**Optional aber empfohlen:** Epic 4 + Epic 5 + Epic 6 vor Epic 7 (Full-Feature Launch)

## Risks, Assumptions, Open Questions

### Risks

**Risk 1: VPS Provider Outage**
- **Severity:** High
- **Probability:** Low (99.9% SLA)
- **Impact:** Complete service unavailable
- **Mitigation:**
  - Daily Backups mit 30-Tage-Retention
  - Documented Disaster Recovery Procedure (<15min Recovery)
  - Alternative: Multi-Cloud-Setup (Growth-Feature)
- **Contingency:** Restore to new VPS from backup

**Risk 2: Let's Encrypt API Outage**
- **Severity:** Medium
- **Probability:** Very Low (99.9% uptime)
- **Impact:** Certificate renewal fails, site unavailable nach 60-90 Tagen
- **Mitigation:**
  - Certificates valid for 90 days
  - Renewal 30 days before expiry (60-day buffer)
  - Alert on certificate expiry <7 days
- **Contingency:** Manual certificate renewal oder alternative CA

**Risk 3: Docker Hub Rate Limiting**
- **Severity:** Low
- **Probability:** Medium (für unauthenticated pulls)
- **Impact:** Image pulls fehlschlagen, Deployment blockiert
- **Mitigation:**
  - Use authenticated Docker Hub pulls (free account)
  - Optional: Self-host images in GitHub Container Registry
- **Contingency:** Wait for rate limit reset (6 hours)

**Risk 4: SSL Certificate Acquisition Failure (Initial Setup)**
- **Severity:** High (blocks Go-Live)
- **Probability:** Medium (DNS propagation issues)
- **Impact:** HTTPS nicht verfügbar, Deployment blockiert
- **Mitigation:**
  - Verify DNS propagation before Certbot run (`dig cv-hub.example.com`)
  - Use staging environment für Let's Encrypt testing
  - Manual fallback: Self-signed cert für testing
- **Contingency:** Debug DNS, wait for propagation, retry Certbot

**Risk 5: GitHub Actions Outage**
- **Severity:** Low
- **Probability:** Low (99.9% SLA)
- **Impact:** Automated deployment nicht möglich
- **Mitigation:**
  - Manual deployment via SSH weiterhin möglich
  - Documented manual deployment procedure
- **Contingency:** SSH manually, run `git pull && docker-compose up -d --build`

**Risk 6: Data Loss (VPS Disk Failure)**
- **Severity:** Critical
- **Probability:** Low (mit SSD RAID)
- **Impact:** Alle CV-Daten, Links, Statistiken verloren
- **Mitigation:**
  - Daily Backups zu separate Location
  - Backup-Checksums (SHA-256) für Integrity
  - Test restore procedure (AC-5)
- **Contingency:** Restore from latest backup (RPO: <24h)

**Risk 7: Memory Leak (Container Resource Exhaustion)**
- **Severity:** Medium
- **Probability:** Low (mit TypeScript/NestJS)
- **Impact:** Container crashes, service unavailable
- **Mitigation:**
  - Container Memory Limits (Backend: 512M, Frontend: 256M)
  - Auto-restart on failure (`restart: unless-stopped`)
  - Monitoring & Alerting (Memory >80%)
  - 24h Stability Test (AC-10)
- **Contingency:** Container restarts automatically, investigate logs

**Risk 8: SQL Injection / Security Vulnerability**
- **Severity:** Critical
- **Probability:** Low (mit TypeORM parameterized queries)
- **Impact:** Data breach, unauthorized access
- **Mitigation:**
  - TypeORM parameterized queries (no string concatenation)
  - Input validation (Zod schemas)
  - npm audit in CI/CD (fails on critical)
  - Regular security reviews
- **Contingency:** Patch immediately, rotate secrets, notify users

### Assumptions

**Assumption 1: Single-Region Deployment Sufficient**
- **Assumption:** <50k requests/month, primär deutsche/europäische User
- **Validation:** Monitor traffic patterns first 3 months
- **Impact if wrong:** Higher latency für non-EU users
- **Mitigation:** Add CDN oder Multi-Region wenn Traffic >50k/month

**Assumption 2: SQLite Performance Adequate**
- **Assumption:** <10k CV data records, <1k concurrent users
- **Validation:** Monitor DB latency (target: <10ms p95)
- **Impact if wrong:** Slow queries, degraded performance
- **Mitigation:** Migrate to PostgreSQL wenn Latency >50ms sustained

**Assumption 3: Docker Compose Sufficient (No K8s)**
- **Assumption:** Single-instance deployment adequate für Traffic-Level
- **Validation:** Monitor resource usage, uptime
- **Impact if wrong:** Scalability issues bei hohem Traffic
- **Mitigation:** Migrate to Kubernetes wenn horizontal scaling erforderlich

**Assumption 4: Manual Backup to VPS is Sufficient**
- **Assumption:** Daily backups auf separate Disk/Volume ausreichend
- **Validation:** Test restore procedure (AC-5)
- **Impact if wrong:** Backups unrecoverable bei catastrophic failure
- **Mitigation:** Add remote backup (S3, Backblaze) wenn critical

**Assumption 5: GitHub Actions Free Tier Sufficient**
- **Assumption:** 2000 minutes/month ausreichend für CI/CD
- **Validation:** Monitor GitHub Actions usage
- **Impact if wrong:** CI/CD blocked nach Free Tier exhausted
- **Mitigation:** Optimize workflow, oder upgrade to paid plan ($4/month)

**Assumption 6: No DDoS Protection Required**
- **Assumption:** Personal CV site kein attraktives DDoS-Ziel
- **Validation:** Monitor for unusual traffic patterns
- **Impact if wrong:** Service unavailable bei DDoS-Angriff
- **Mitigation:** Add Cloudflare (Free Tier) für DDoS protection

### Open Questions

**Question 1: Welche Domain soll verwendet werden?**
- **Status:** Open (User muss entscheiden)
- **Blocker:** Ja (für SSL-Setup)
- **Action:** User kauft Domain, konfiguriert DNS vor Step 5 (Initial Deployment)

**Question 2: VPS Provider Preference (Hetzner vs. DigitalOcean)?**
- **Status:** Open (User Preference)
- **Blocker:** Nein (beide funktionieren)
- **Recommendation:** Hetzner (€5/month vs. $12/month, gleiche Specs)

**Question 3: Backup Remote Location (S3, Backblaze, etc.)?**
- **Status:** Open (Optional Growth-Feature)
- **Blocker:** Nein (lokale Backups für MVP ausreichend)
- **Recommendation:** Evaluate nach 3 Monaten Production

**Question 4: External Monitoring Service (UptimeRobot vs. Better Uptime)?**
- **Status:** Open (Optional aber empfohlen)
- **Blocker:** Nein (Health Check API funktioniert ohne)
- **Recommendation:** UptimeRobot Free Tier (5min checks, Email alerts)

**Question 5: Email-Provider für Alerting (SendGrid, Mailgun, SMTP)?**
- **Status:** Open (Required für Production Alerts)
- **Blocker:** Nein (kann post-deployment konfiguriert werden)
- **Recommendation:** Gmail SMTP (free) oder SendGrid (free tier 100 emails/day)

**Question 6: CDN für Static Assets (Cloudflare, Bunny CDN)?**
- **Status:** Open (Growth-Feature)
- **Blocker:** Nein (Nginx serving ausreichend für MVP)
- **Decision:** Re-evaluate wenn Lighthouse Performance <90

## Test Strategy Summary

### Test Levels

**1. Unit Tests (Epic 1 Foundation)**
- **Scope:** Individual functions, services, components
- **Framework:** Vitest (Frontend), Jest (Backend)
- **Coverage Target:** >80% für Business Logic
- **Execution:** CI/CD Pipeline (Stage 1: Test)
- **Epic 7 Relevance:** Keine neuen Unit Tests (Infrastructure-fokussiert)

**2. Integration Tests**
- **Scope:** Service-to-Service Communication, API Endpoints, Database
- **Framework:** Jest (Backend), React Testing Library (Frontend)
- **Coverage:**
  - Backend API Endpoints (alle `/api/*` routes)
  - Database Queries (TypeORM)
  - Docker Network Communication (backend:3000, frontend:5173)
- **Execution:** CI/CD Pipeline (Stage 1: Test)
- **Epic 7 Specific:**
  - Health Check API (`GET /api/health`) mit SSL info
  - Docker Compose multi-service startup
  - Volume persistence (SQLite, Logs, Uploads)

**3. System Tests (E2E)**
- **Scope:** Complete User Journeys, Full-Stack Workflows
- **Framework:** Manual Testing (AC-8 Checklist)
- **Coverage:**
  - Public CV Page loads
  - Admin Login → Dashboard → Link Creation
  - Personalized Link Creation → Token Validation → CV Display
  - CV Extraction (Upload PDF → Extract → Save)
- **Execution:** Post-Deployment (AC-8)
- **Epic 7 Specific:**
  - Full deployment workflow (CI/CD → VPS → Live)
  - HTTPS functioning end-to-end
  - All Docker containers healthy

**4. Performance Tests**
- **Scope:** Response Times, Lighthouse Scores, Load Handling
- **Tools:**
  - Lighthouse CI (automated)
  - curl benchmarking (response time)
  - Apache Bench (optional: load testing)
- **Targets:**
  - Lighthouse >90 (all categories)
  - API Response Time <100ms (p95)
  - FCP <1.5s, LCP <2.5s
- **Execution:** Post-Deployment (AC-7)
- **Epic 7 Specific:**
  - Nginx Gzip compression effectiveness
  - Static asset caching verification
  - Container resource usage monitoring

**5. Security Tests**
- **Scope:** Vulnerabilities, SSL Configuration, Attack Vectors
- **Tools:**
  - npm audit (CI/CD)
  - SSL Labs Test (manual)
  - Security Headers Check (securityheaders.com)
  - OWASP ZAP (optional: penetration testing)
- **Coverage:**
  - Dependency vulnerabilities (0 critical/high)
  - SSL/TLS configuration (A or A+ rating)
  - Security headers present (HSTS, CSP, X-Frame-Options)
  - Rate limiting functional
  - Secret management (no .env in Git)
- **Execution:** Pre-Deployment (AC-6), Post-Deployment
- **Epic 7 Specific:**
  - SSL certificate validity
  - Firewall configuration (UFW)
  - .env file permissions (600)

**6. Operational Tests**
- **Scope:** Deployment, Backups, Monitoring, Disaster Recovery
- **Tools:** Manual procedures, scripts
- **Coverage:**
  - CI/CD Pipeline (git push → deployment)
  - Backup creation and restore
  - Log rotation and accessibility
  - Health check monitoring
  - Container auto-restart
- **Execution:** Pre-Go-Live (AC-1 to AC-5, AC-10)
- **Epic 7 Specific:**
  - Docker Compose startup/shutdown cycles
  - Certbot certificate renewal (dry-run)
  - Backup script execution
  - Disaster Recovery procedure (full restore)

---

### Test Execution Plan

**Phase 1: CI/CD Pipeline (Automated)**
```yaml
# GitHub Actions - Stage 1: Test
- ESLint (Frontend + Backend)
- TypeScript compilation
- Unit Tests (Vitest + Jest)
- Integration Tests (API, Database)
- npm audit (fail on critical/high)

# Pass Criteria: All tests green, 0 critical vulnerabilities
```

**Phase 2: Build Validation (Automated)**
```yaml
# GitHub Actions - Stage 2: Build
- Build Frontend (pnpm --filter frontend build)
- Build Backend (pnpm --filter backend build)
- Build Docker Images (backend, frontend)

# Pass Criteria: All builds successful, Docker images created
```

**Phase 3: Deployment Validation (Automated)**
```yaml
# GitHub Actions - Stage 3: Deploy
- SSH to VPS
- Git pull
- docker-compose down
- docker-compose up -d --build
- Wait for containers healthy (30s timeout)

# Pass Criteria: All containers healthy
```

**Phase 4: Smoke Tests (Automated)**
```yaml
# GitHub Actions - Stage 4: Smoke Tests
- curl https://cv-hub.example.com/api/health → 200 OK
- curl https://cv-hub.example.com/ → 200 OK
- Verify {"status": "ok"} in health response

# Pass Criteria: All endpoints respond successfully
# Failure: Automatic rollback to previous commit
```

**Phase 5: Post-Deployment Manual Tests (AC-8)**
```bash
# Manual Checklist (10-15 minutes)
1. Public CV Page loads
2. Admin Login works
3. Create test invite link
4. Verify personalized link works
5. Test CV extraction (upload PDF)
6. Check all containers healthy
7. Review logs for errors
8. Verify SSL certificate (browser padlock)

# Pass Criteria: All features functional
```

**Phase 6: Security & Performance Audits (AC-6, AC-7)**
```bash
# Security Tests
- SSL Labs Test → A or A+
- Security Headers Check → All present
- npm audit → 0 critical/high
- Firewall check → Only 22,80,443 open

# Performance Tests
- Lighthouse → >90 all categories
- Response Time → <100ms (p95)
- Load Test (optional) → 100 concurrent users

# Pass Criteria: All targets met
```

**Phase 7: Operational Readiness (AC-10)**
```bash
# 24h Stability Test
- Monitor uptime
- Check memory usage (no leaks)
- Review logs (no critical errors)
- Verify monitoring/alerting active

# Disaster Recovery Drill
- Trigger test backup
- Simulate VPS failure
- Restore from backup
- Verify data integrity

# Pass Criteria: 24h stable, DR successful
```

---

### Test Coverage Matrix

| Test Type | Epic 7 Coverage | Tools | Pass Criteria |
|-----------|----------------|-------|---------------|
| **Unit** | N/A (no new business logic) | Vitest, Jest | >80% coverage (inherited from Epic 1-6) |
| **Integration** | Health Check API, Docker Network, Volumes | Jest, Docker | All services communicate correctly |
| **System (E2E)** | Full deployment workflow, All features work | Manual Checklist | AC-8 checklist complete |
| **Performance** | Lighthouse, Response Times, Resource Usage | Lighthouse CI, curl | AC-7 targets met (>90, <100ms) |
| **Security** | SSL, Firewall, Secrets, Vulnerabilities | SSL Labs, npm audit | AC-6 criteria met (A+, 0 vulns) |
| **Operational** | CI/CD, Backups, Monitoring, DR | Scripts, Manual | AC-1 to AC-5, AC-10 complete |

---

### Edge Cases & Boundary Tests

**1. SSL Certificate Expiry**
- **Test:** Set system date to 7 days before expiry
- **Expected:** Alert triggered, Certbot renewal attempted
- **Validation:** Certificate renewed automatically

**2. Container Crash & Auto-Restart**
- **Test:** `docker kill cv-hub-backend`
- **Expected:** Container restarts automatically within 30s
- **Validation:** Service available, no data loss

**3. Disk Space Exhaustion**
- **Test:** Fill disk to >90%
- **Expected:** Alert triggered, backup cleanup runs
- **Validation:** Old backups deleted, space recovered

**4. High Traffic Load**
- **Test:** Apache Bench 100 concurrent users, 1000 requests
- **Expected:** Rate limiting kicks in, no 5xx errors
- **Validation:** 429 responses for excessive requests, service stable

**5. Backup Corruption**
- **Test:** Corrupt backup file (modify checksum)
- **Expected:** Restore detects checksum mismatch, fails gracefully
- **Validation:** Error logged, restore aborted

**6. DNS Propagation Delay**
- **Test:** Change DNS, run Certbot immediately
- **Expected:** ACME challenge fails, retry after delay
- **Validation:** Error handled, retry logic works

---

### Regression Testing

**Post-Deployment Regression Suite:**
- All Epic 1-6 features must continue working
- Run Epic 2-6 test suites post-Epic-7-deployment
- Verify no breaking changes in API contracts
- Confirm all previous AC still met

**Automated Regression (CI/CD):**
- Unit + Integration Tests (all previous epics)
- API Contract Tests (Pact or similar)
- Performance Benchmarks (baseline comparison)

---

### Test Environment Strategy

**Local Development:**
- Docker Compose (dev setup from Epic 1)
- `docker-compose up` → All services locally
- Hot-reload for rapid testing

**Staging (Optional):**
- Separate VPS or Docker Compose instance
- Mirrors production setup
- Let's Encrypt staging certificates
- Full deployment workflow testing

**Production:**
- Final E2E tests post-deployment
- Smoke tests automated (GitHub Actions)
- 24h stability test
- Go-Live checklist (AC-10)

---

### Definition of Done (Epic 7)

**Epic 7 is DONE when:**
- ✅ All 10 Acceptance Criteria (AC-1 to AC-10) erfüllt
- ✅ CI/CD Pipeline läuft grün (all stages pass)
- ✅ SSL Labs Test: A oder höher
- ✅ Lighthouse Score: >90 (alle Kategorien)
- ✅ 24h Stability Test passed
- ✅ Disaster Recovery Drill successful
- ✅ All Documentation complete
- ✅ cv-hub läuft unter eigener Domain mit HTTPS
- ✅ No critical bugs, no critical vulnerabilities
- ✅ Team-Walkthrough abgeschlossen (alle Features demonstriert)

**Go-Live Approval:**
- Product Owner: Ruben ✅
- Tech Lead: Ruben ✅
- Operations: Ruben ✅

🚀 **LAUNCH!**
