# Epic Technical Specification: Intelligent CV Maintenance (KI-Extraktion)

Date: 2025-11-05
Author: Ruben
Epic ID: 6
Status: Draft

---

## Overview

Epic 6 führt **KI-gestützte CV-Wartung** ein, die den Wartungsaufwand von Stunden auf Minuten reduziert. Statt HTML-Pflege oder manuellem JSON-Editing ermöglicht diese Epic das Hochladen unstrukturierter CV-Dateien (PDF, Markdown, Plain Text), die automatisch per LLM in das JSON Resume Schema extrahiert werden.

Das Kernfeature ist der **Review-Loop**: KI-Extraktion liefert einen Entwurf, den der Admin vor dem Speichern validiert und bei Bedarf korrigiert. Dies kombiniert AI-Beschleunigung (90% Automatisierung) mit menschlicher Qualitätskontrolle (Fehlerfreiheit).

Diese Epic baut auf Epic 2 (CV Data Foundation) und Epic 5 (Admin Dashboard) auf und integriert sich nahtlos in die bestehende Architektur. Die Implementierung nutzt **Google Gemini 2.0 Flash** für kosteneffiziente, schnelle Extraktion mit dem neuen @google/genai SDK.

## Objectives and Scope

**In Scope:**
- File-Upload-Interface im Admin-Dashboard (Drag & Drop)
- Unterstützte Formate: PDF, Markdown (.md), Plain Text (.txt)
- File-Size-Limit: 10MB
- LLM-Integration: Google Gemini 2.0 Flash über @google/genai SDK
- Prompt-Engineering für JSON Resume Schema-Extraktion
- Timeout-Handling (60s), Retry-Logic (3 Versuche), Rate-Limiting (5 requests/hour)
- Review-Interface mit Live-Preview des extrahierten JSONs
- Manuelles Editing vor Speichern (inline Editor)
- Diff-View: Vergleich mit bestehendem CV
- JSON Schema Validation (Zod-basiert)
- Versionierung: Automatisches Backup vor Überschreiben
- Versionshistorie-Liste im Admin-Dashboard (`/admin/cv/versions`)
- Rollback-Funktionalität zu vorherigen Versionen
- API-Endpoints: POST /api/admin/cv/extract, GET /api/admin/cv/versions, POST /api/admin/cv/rollback/:version

**Out of Scope:**
- Automatische Skill-Extraktion aus Projektbeschreibungen (Growth Feature)
- Multi-Source-Aggregation (GitHub, Blog etc. - Vision)
- OCR für gescannte PDFs (nur text-basierte PDFs)
- Batch-Upload (nur single file)
- Custom Schema-Definitionen (nur JSON Resume Standard)
- Alternative LLM-Provider (nur Gemini im MVP)

## System Architecture Alignment

Epic 6 integriert sich in die bestehende NestJS-Backend-Architektur als **Extraction Module** und erweitert das Admin-Dashboard (TanStack Start Frontend).

**Backend-Komponenten:**
- **Extraction Module** (neu): `apps/backend/src/modules/extraction/`
  - ExtractionController: POST /api/admin/cv/extract
  - ExtractionService: Orchestriert File-Parse → LLM-Call → Validation
  - GeminiService: Wrapper für @google/genai SDK
- **CV Module** (erweitert):
  - Neue Endpoints: GET /api/admin/cv/versions, POST /api/admin/cv/rollback/:version
  - CVVersionRepository: Verwaltung von cv_versions Tabelle
- **Admin Module** (genutzt): AdminAuthGuard schützt alle Extraction-Endpoints

**Frontend-Komponenten:**
- **Admin Routes** (erweitert):
  - `/admin/cv/extract` (neu): Upload & Review Interface
  - `/admin/cv/versions` (neu): Versionshistorie
- **Custom Components** (neu):
  - UploadZone: Drag & Drop + File-Picker
  - DiffViewer: Side-by-Side Vergleich (current vs extracted)
  - ProgressSteps: Upload → Extract → Review → Save
  - JSONEditor: Inline-Editing mit Syntax-Highlighting

**Externe Dependencies:**
- Google Gemini API (gemini-2.0-flash-001 Modell)
- @google/genai NPM-Package (v1.28.0+, neues SDK)
- pdf-parse (v2.4.5) für PDF-Text-Extraktion

**Datenbankschema:**
- Nutzt bestehende `cv` und `cv_versions` Tabellen (aus Epic 2)
- Neue Spalten: `source` ('manual' | 'ai-extraction' | 'rollback'), `file_hash` (SHA-256 für Deduplizierung)

**Architektur-Pattern:**
- KI-Extraction mit Review-Loop (Pattern 4 aus Architecture Doc)
- JSON Resume Schema als Single Source of Truth (Pattern 3)
- Zod-Validation für Runtime Type-Safety
- Human-in-the-loop für AI-Quality-Control

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Inputs | Outputs | Owner |
|----------------|----------------|--------|---------|-------|
| **ExtractionController** | HTTP-Endpoints für File-Upload und Extraktion | Multipart/form-data (file), Auth-Session | ExtractionResultDto, HTTP 200/400/500 | Backend |
| **ExtractionService** | Orchestriert File-Parse → LLM-Call → Validation → Versionierung | File (Buffer), mimetype | { success: bool, data?: CV, errors?: ZodError[] } | Backend |
| **GeminiService** | Wrapper für @google/genai SDK, Prompt-Management | Plain text (extracted from file) | Raw JSON string (AI response) | Backend |
| **FileParsers** | Text-Extraktion aus verschiedenen Formaten | File Buffer + mimetype | Plain text string | Backend |
| **CVVersionRepository** | CRUD für cv_versions Tabelle | CVVersion entity | Saved entity, Version list | Backend |
| **CVController** (erweitert) | Endpoints für Versionsverwaltung | version_id (für Rollback) | CVVersion[], success status | Backend |
| **UploadZone Component** | Drag & Drop + File-Picker UI | User file selection | File object (Frontend state) | Frontend |
| **DiffViewer Component** | Side-by-Side JSON-Vergleich mit Highlighting | currentCV, extractedCV, errors | Edited CV (nach User-Review) | Frontend |
| **ProgressSteps Component** | Workflow-Visualisierung (Upload → Extract → Review → Save) | currentStep: 'upload' \| 'extracting' \| 'review' \| 'saving' | Visual feedback | Frontend |
| **JSONEditor Component** | Inline JSON-Editing mit Syntax-Highlighting | JSON object, schema (Zod) | Edited JSON object | Frontend |

### Data Models and Contracts

**CVVersion Entity (TypeORM):**
```typescript
@Entity('cv_versions')
export class CVVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cvId: number; // Foreign key to cv.id (always 1 for single-user system)

  @Column('text')
  data: string; // JSON.stringify(CV) - JSON Resume Schema

  @Column()
  status: 'draft' | 'active' | 'archived';

  @Column({ nullable: true })
  source: 'manual' | 'ai-extraction' | 'rollback';

  @Column({ nullable: true })
  fileHash: string; // SHA-256 of uploaded file (for deduplication)

  @CreateDateColumn()
  createdAt: Date;
}
```

**ExtractionResultDto (Zod-basiert):**
```typescript
export const ExtractionResultDtoSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    draftId: z.number(),
    data: CVSchema, // Valid JSON Resume
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.object({
      path: z.array(z.string()),
      message: z.string(),
      code: z.string(),
    })),
    rawData: z.record(z.any()), // Invalid JSON (for manual fixing)
  }),
]);

export type ExtractionResultDto = z.infer<typeof ExtractionResultDtoSchema>;
```

**ExtractCVDto (Request DTO):**
```typescript
export const ExtractCVDtoSchema = z.object({
  // File handled by Multer FileInterceptor, not in DTO
  // DTO only for additional metadata if needed
});
```

**CVVersionListDto (Response for /api/admin/cv/versions):**
```typescript
export const CVVersionListDtoSchema = z.object({
  versions: z.array(z.object({
    id: z.number(),
    status: z.enum(['draft', 'active', 'archived']),
    source: z.enum(['manual', 'ai-extraction', 'rollback']),
    createdAt: z.string().datetime(), // ISO 8601
    dataPreview: z.string().optional(), // First 100 chars of data
  })),
});
```

**RollbackDto (Request for /api/admin/cv/rollback/:version):**
```typescript
export const RollbackDtoSchema = z.object({
  versionId: z.number(),
});
```

**File Upload Constraints:**
- Max file size: 10MB (Multer config)
- Allowed MIME types: `application/pdf`, `text/markdown`, `text/plain`
- File extension validation: `.pdf`, `.md`, `.txt`

### APIs and Interfaces

**POST /api/admin/cv/extract**
- **Auth:** AdminAuthGuard (Session-based)
- **Rate Limit:** 5 requests/hour per session
- **Content-Type:** multipart/form-data
- **Request Body:**
  - `file`: File (PDF, Markdown, Plain Text, max 10MB)
- **Response (200 OK - Success):**
  ```json
  {
    "success": true,
    "draftId": 42,
    "data": { /* Valid CVSchema JSON */ }
  }
  ```
- **Response (200 OK - Validation Errors):**
  ```json
  {
    "success": false,
    "errors": [
      {
        "path": ["work", 0, "startDate"],
        "message": "Invalid datetime string! must be UTC",
        "code": "invalid_string"
      }
    ],
    "rawData": { /* Partially valid JSON for manual fixing */ }
  }
  ```
- **Error Codes:**
  - 400: Invalid file format, file too large
  - 401: Unauthorized (not logged in)
  - 429: Rate limit exceeded
  - 500: LLM API error, extraction failed
  - 504: Timeout (>60s)

**GET /api/admin/cv/versions**
- **Auth:** AdminAuthGuard
- **Query Params:**
  - `limit` (optional, default 50)
  - `status` (optional, filter by 'draft' | 'active' | 'archived')
- **Response (200 OK):**
  ```json
  {
    "versions": [
      {
        "id": 42,
        "status": "draft",
        "source": "ai-extraction",
        "createdAt": "2025-11-05T14:30:00Z",
        "dataPreview": "{\"basics\":{\"name\":\"Ruben\",\"label\":\"Full-Stack Engineer\"}..."
      }
    ]
  }
  ```
- **Error Codes:**
  - 401: Unauthorized

**POST /api/admin/cv/rollback/:versionId**
- **Auth:** AdminAuthGuard
- **Path Params:** `versionId` (number)
- **Request Body:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "CV rolled back to version 42",
    "newActiveVersion": {
      "id": 43,
      "status": "active",
      "source": "rollback",
      "createdAt": "2025-11-05T15:00:00Z"
    }
  }
  ```
- **Error Codes:**
  - 400: Version not found
  - 401: Unauthorized
  - 500: Rollback failed

**POST /api/admin/cv/publish-draft**
- **Auth:** AdminAuthGuard
- **Request Body:**
  ```json
  {
    "draftId": 42,
    "editedData": { /* CVSchema JSON (potentially manually edited) */ }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "activeVersionId": 43,
    "message": "CV updated successfully"
  }
  ```
- **Error Codes:**
  - 400: Invalid CVSchema, Draft not found
  - 401: Unauthorized
  - 500: Database error

**Gemini API Integration (External):**
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent`
- **SDK:** @google/genai (v1.28.0+)
- **Request:**
  ```typescript
  {
    model: 'gemini-2.0-flash-001',
    contents: [{
      role: 'user',
      parts: [{ text: extractionPrompt }]
    }],
    generationConfig: {
      temperature: 0.2, // Low for consistency
      maxOutputTokens: 8192,
    }
  }
  ```
- **Timeout:** 60s
- **Retry Logic:** 3 attempts with exponential backoff (1s, 2s, 4s)

### Workflows and Sequencing

**Workflow 1: CV Extraction (Happy Path)**

```
1. User (Admin) navigates to /admin/cv/extract
2. UploadZone Component renders (Drag & Drop UI)
3. User drops PDF file (or selects via file picker)
   │
   ├─► Frontend validates file (size, type)
   │   ├─► Invalid → Show error toast
   │   └─► Valid → Continue
   │
4. Frontend shows ProgressSteps: "Uploading..."
5. Frontend: POST /api/admin/cv/extract (multipart/form-data)
   │
6. Backend: ExtractionController receives file
   │
7. Backend: Multer saves file to memory (10MB limit)
   │
8. Backend: FileParsers extract text
   │   ├─► PDF: pdf-parse library
   │   ├─► Markdown: Direct read (UTF-8)
   │   └─► Plain Text: Direct read (UTF-8)
   │
9. Backend: ExtractionService.extractFromFile(file)
   │
10. Backend: GeminiService.generateContent(prompt + extracted text)
    │   - Timeout: 60s
    │   - Retry: 3 attempts
    │
11. Backend: Gemini returns JSON string
    │
12. Backend: Parse JSON, validate with CVSchema.safeParse()
    │   ├─► Valid → Continue to step 13
    │   └─► Invalid → Return { success: false, errors, rawData }
    │
13. Backend: Save as draft version (status='draft', source='ai-extraction')
    │
14. Backend: Return { success: true, draftId, data }
    │
15. Frontend: ProgressSteps updates to "Review"
    │
16. Frontend: DiffViewer renders
    │   - Left side: Current CV
    │   - Right side: Extracted CV (with inline edit)
    │   - Highlights: Added/Removed/Changed fields
    │
17. User reviews, optionally edits extracted data
    │
18. User clicks "Approve & Publish"
    │
19. Frontend: POST /api/admin/cv/publish-draft
    │   - Body: { draftId, editedData }
    │
20. Backend: CVService.publishDraft()
    │   - Archive current active version (status='archived')
    │   - Set edited draft as active (status='active')
    │
21. Backend: Return success
    │
22. Frontend: Show success toast, redirect to /admin/dashboard
```

**Workflow 2: Extraction Failure Handling**

```
Step 12 (Validation fails):
│
Backend returns { success: false, errors, rawData }
│
Frontend: DiffViewer shows:
  - Validation errors highlighted (red borders)
  - Error messages per field (tooltip or inline)
  - JSONEditor for manual fixing
│
User has options:
  1. Edit rawData manually → Re-validate → Publish
  2. Cancel → Delete draft → Try different file
  3. Save as draft → Come back later
```

**Workflow 3: Rollback to Previous Version**

```
1. User navigates to /admin/cv/versions
2. Frontend: GET /api/admin/cv/versions
3. Backend returns list of versions
4. Frontend renders version history table
   │
5. User clicks "Rollback" on version 42
   │
6. Frontend shows confirmation dialog
   │
7. User confirms
   │
8. Frontend: POST /api/admin/cv/rollback/42
   │
9. Backend: CVService.rollback(42)
   │   - Load version 42 data
   │   - Archive current active version
   │   - Create new version (status='active', source='rollback', data=version 42)
   │
10. Backend: Return success
    │
11. Frontend: Show success toast, refresh version list
```

**Sequence Diagram (Text-Based):**
```
User          Frontend         ExtractionController    ExtractionService    GeminiService    Database
 │                │                     │                      │                  │             │
 │── Upload PDF ──►                     │                      │                  │             │
 │                │── POST /extract ───►│                      │                  │             │
 │                │                     │── extractFromFile ──►│                  │             │
 │                │                     │                      │── parse PDF ────►│             │
 │                │                     │                      │                  │             │
 │                │                     │                      │── generateContent────────────► │
 │                │                     │                      │◄── JSON response ──────────── │
 │                │                     │                      │                  │             │
 │                │                     │                      │── validate (Zod)              │
 │                │                     │                      │                  │             │
 │                │                     │                      │──── save draft ─────────────► │
 │                │                     │◄── ExtractionResult ──│                  │             │
 │                │◄── 200 OK (data) ───│                      │                  │             │
 │◄── Show Diff ──│                     │                      │                  │             │
 │                │                     │                      │                  │             │
 │── Approve ────►│                     │                      │                  │             │
 │                │── POST /publish-draft──►                   │                  │             │
 │                │                     │──── publish() ───────────────────────────────────────►│
 │                │◄── 200 OK ──────────│                      │                  │             │
 │◄── Success ────│                     │                      │                  │             │
```

## Non-Functional Requirements

### Performance

**Extraction Performance Targets:**
- File Upload: <2s für 10MB File (network dependent)
- PDF Text Extraction: <5s für 50-page PDF (pdf-parse)
- LLM API Call: <30s typical, 60s max (Gemini 2.0 Flash)
- Total Extraction Time: <45s für Standard-CV (1-5 pages)
- Validation (Zod): <100ms für komplexes JSON Resume
- Database Write (draft save): <500ms

**UI Responsiveness:**
- File validation (client-side): Instant (<50ms)
- Drag & Drop feedback: <16ms (60fps)
- DiffViewer rendering: <1s für 500KB JSON
- JSONEditor syntax highlighting: <500ms initial render

**Rate Limiting:**
- 5 extractions per hour per session (prevent API cost abuse)
- Gemini API quota: 60 requests/minute (default free tier)
- File upload concurrent limit: 1 (sequential processing)

**Warum wichtig:**
- LLM API-Calls sind teuer → Rate-Limiting essentiell
- User-Experience: 45s ist akzeptabel für automatische Extraktion (vs. hours of manual entry)
- Timeout bei 60s verhindert hanging requests

**Messbare Kriterien:**
- 95% der Extractions unter 45s (P95 latency)
- 0 timeouts bei <50 page PDFs
- Rate-Limit funktioniert (429 after 5 requests/hour)

### Security

**Authentication & Authorization:**
- AdminAuthGuard schützt ALLE Extraction-Endpoints (Session-based)
- Keine anonymen Uploads möglich
- Session-Validation bei jedem Request

**File Upload Security:**
- MIME-Type Validation: Nur `application/pdf`, `text/markdown`, `text/plain`
- File Extension Whitelist: `.pdf`, `.md`, `.txt`
- File Size Limit: 10MB (DoS-Prevention)
- Virus Scanning: Optional (ClamAV für Production, nicht MVP)
- No executable files: Reject .exe, .sh, .bat etc.

**Input Sanitization:**
- Extracted text sanitized vor LLM-Prompt (prevent prompt injection)
- JSON validation mit Zod (prevent code injection)
- Markdown-Content rendered mit react-markdown (XSS-safe)

**API Key Management:**
- Gemini API Key in Environment-Variable (GEMINI_API_KEY)
- Nie im Code hardcoded
- Key rotation possible without code change
- Separate keys für Dev/Prod

**Data Privacy:**
- Uploaded files NOT persisted to disk (memory-only, Multer)
- File hash stored (SHA-256) für Deduplication, nicht Original-File
- CV-Daten bleiben in Database (SQLite, nicht exposed)
- No logging of CV content (only metadata: file size, MIME type)

**Rate Limiting:**
- Prevents API abuse (cost control)
- Protects Gemini API quota
- Per-session limit (5/hour)

**Error Handling:**
- No sensitive data in error messages
- Generic errors for auth failures ("Unauthorized")
- Detailed errors nur für validation (safe to expose)

**Warum wichtig:**
- File uploads sind Angriffsvektoren (malware, XSS)
- API-Keys dürfen nicht leaked werden
- DSGVO: CV-Daten sind personenbezogen

**Messbare Kriterien:**
- 0 file uploads bypass MIME-Type validation
- 0 API keys in Git history (pre-commit hook)
- Rate-Limit blocks after 5 requests (tested)

### Reliability/Availability

**Fault Tolerance:**
- Gemini API Retry Logic: 3 attempts mit exponential backoff (1s, 2s, 4s)
- Timeout Handling: 60s hard timeout (prevent hanging)
- Graceful Degradation: LLM failure → User kann manuell JSON editieren
- Database Transaction: Rollback bei publish-draft failure

**Error Recovery:**
- Draft-System: Partial success wird gespeichert (auch bei Validation Errors)
- User kann später zurückkommen und Draft weiter bearbeiten
- Rollback-Funktionalität: Fehlerhafte Version kann rückgängig gemacht werden
- Version History: Keine Daten gehen verloren (max 50 versions archiviert)

**Availability Targets:**
- Extraction Feature: 99% uptime (abhängig von Gemini API SLA)
- Gemini API SLA: 99.5% (Google Cloud Platform)
- Fallback bei API outage: Manual JSON editing immer verfügbar
- Planned Downtime: None für Extraction (stateless service)

**Data Integrity:**
- Atomare Database Operations (TypeORM transactions)
- Backup vor Publish: Alte Version wird IMMER archiviert
- No data loss: cv_versions table hat unbegrenzte Retention (oder configurable)
- File Hash Deduplication: Prevent doppelte Extractions vom selben File

**Monitoring & Alerting:**
- Gemini API Error Rate: >5% → Alert
- Extraction Timeout Rate: >10% → Alert
- Database Write Failures: >0 → Immediate alert
- Rate Limit Hit Rate: Track (no alert, expected behavior)

**Warum wichtig:**
- LLM API-Calls können fehlschlagen (network, quota, timeout)
- User-Investment: 45s Wartezeit → Frustration bei Failure
- Data Integrity: CV-Daten sind kritisch, kein Datenverlust akzeptabel

**Messbare Kriterien:**
- Retry logic tested (mock API failures)
- Rollback funktioniert (E2E test)
- 0 data loss bei Extraction failures (drafts gespeichert)

### Observability

**Logging (Pino - Structured JSON):**

**Extraction Flow Logs:**
```json
{
  "level": "info",
  "timestamp": "2025-11-05T15:30:00Z",
  "message": "CV extraction started",
  "context": {
    "userId": "admin",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "correlationId": "ext-abc123"
  }
}
```

**LLM API Call Logs:**
```json
{
  "level": "info",
  "timestamp": "2025-11-05T15:30:15Z",
  "message": "Gemini API call completed",
  "context": {
    "correlationId": "ext-abc123",
    "model": "gemini-2.0-flash-001",
    "latency": 28400, // ms
    "inputTokens": 5000,
    "outputTokens": 3200,
    "success": true
  }
}
```

**Error Logs:**
```json
{
  "level": "error",
  "timestamp": "2025-11-05T15:30:45Z",
  "message": "Extraction failed: Validation errors",
  "context": {
    "correlationId": "ext-abc123",
    "errorCount": 5,
    "errorPaths": ["work.0.startDate", "skills.2.name"],
    "draftId": 42
  }
}
```

**Metrics to Track:**
- Extraction Success Rate: (successful / total) * 100
- Average Extraction Time: P50, P95, P99 latency
- Gemini API Latency: Track separately (external dependency)
- Validation Error Rate: % of extractions with Zod errors
- File Upload Size Distribution: Histogram (detect large files)
- Rate Limit Hit Rate: How often users hit 5/hour limit
- Rollback Frequency: How often users rollback (indicates quality issues)

**Tracing:**
- Correlation ID durch gesamten Extraction Flow (Upload → Parse → LLM → Validate → Save)
- Request ID im Header für End-to-End debugging
- Timing Logs für jeden Step (identify bottlenecks)

**Dashboards (Optional for Production):**
- Extraction Funnel: Upload → Extract → Review → Publish (conversion rates)
- API Health: Gemini API error rate, latency trends
- User Activity: Extractions per day/week

**Alerts:**
- Gemini API Error Rate >5%: Warning
- Extraction Timeout Rate >10%: Warning
- Database Write Failure: Critical (immediate)

**Warum wichtig:**
- LLM-Integration ist Black-Box → Logging critical für debugging
- Performance bottlenecks identifizieren (PDF parse vs LLM vs DB)
- Cost Tracking: LLM API tokens usage

**Messbare Kriterien:**
- Correlation ID vorhanden in allen Logs eines Extraction Flows
- Metrics dashboard zeigt Success Rate (manual verification)
- Error logs enthalten genug Context für debugging (no "Unknown error")

## Dependencies and Integrations

### NPM Dependencies (Backend)

**New Dependencies für Epic 6:**

| Package | Version | Purpose | Why Chosen |
|---------|---------|---------|------------|
| **@google/genai** | ^1.28.0 | Google Gemini SDK (neue API) | Offizielle SDK, Gemini 2.0 Flash support, altes SDK deprecated 11/2025 |
| **pdf-parse** | ^2.4.5 | PDF-Text-Extraktion | Simple, aktiv maintained (published 15 days ago), 0 dependencies, fast |
| **crypto** | Node.js builtin | SHA-256 File-Hashing | Builtin, keine externe Dependency nötig |

**Existing Dependencies (genutzt von Epic 6):**

| Package | Version | Purpose | Used In Epic 6 |
|---------|---------|---------|----------------|
| **@nestjs/common** | ^11.x | NestJS Core | Controllers, Guards, Decorators |
| **@nestjs/platform-express** | ^11.x | Express Integration | Multer FileInterceptor |
| **@nestjs/throttler** | ^6.4.0 | Rate Limiting | 5 extractions/hour limit |
| **typeorm** | Latest | ORM | CVVersion Entity, Repositories |
| **zod** | ^3.x | Schema Validation | CVSchema validation, DTO validation |
| **class-validator** | Latest | DTO Validation | Request validation decorators |
| **class-transformer** | Latest | DTO Transformation | JSON → Class instances |
| **nestjs-pino** | ^4.4.1 | Structured Logging | Extraction flow logging, correlation IDs |

### NPM Dependencies (Frontend)

**New Dependencies für Epic 6:**

| Package | Version | Purpose | Why Chosen |
|---------|---------|---------|------------|
| **react-dropzone** | ^14.x | Drag & Drop File Upload | Popular (10M/week), accessible, customizable |
| **@monaco-editor/react** | ^4.x | JSON Editor mit Syntax Highlighting | Monaco = VSCode Editor, excellent TypeScript support |
| **react-diff-viewer** | ^3.x | Side-by-Side Diff Component | Mature, good UX, syntax highlighting support |

**Existing Dependencies (genutzt von Epic 6):**

| Package | Version | Purpose | Used In Epic 6 |
|---------|---------|---------|----------------|
| **@tanstack/react-router** | ^1.x | Routing | /admin/cv/extract, /admin/cv/versions routes |
| **@tanstack/react-query** | Latest | Data Fetching | POST /extract, GET /versions API calls |
| **@tanstack/react-form** | Latest | Form Management | Upload form, publish form |
| **zod** | ^3.x | Schema Validation | CVSchema, Frontend validation |
| **react-markdown** | ^10.x | Markdown Rendering | Personalized message preview (if needed) |
| **shadcn/ui** | Latest | UI Components | Button, Card, Dialog, Progress, Toast |

### External Service Integrations

**Google Gemini API:**
- **Service:** Google Generative AI (Gemini 2.0 Flash)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent`
- **Authentication:** API Key (Header: `x-goog-api-key`)
- **SDK:** @google/genai v1.28.0+
- **Rate Limits:** 60 requests/minute (free tier), 15 requests/minute (burst)
- **Quotas:** 1500 requests/day (free tier)
- **Pricing (wenn exceeded):** $0.075 per 1M input tokens, $0.30 per 1M output tokens (Flash)
- **SLA:** 99.5% uptime (GCP standard)
- **Dependency Risk:** CRITICAL - ohne Gemini API keine Extraction möglich
- **Fallback:** Manual JSON editing (User kann immer manuell arbeiten)

**API Key Management:**
- Environment Variable: `GEMINI_API_KEY`
- Required für Epic 6 Functionality
- Separate keys empfohlen: Dev vs Prod
- Key Rotation: Simple (update ENV, restart service)

### Integration Points mit bestehenden Epics

**Epic 2 (CV Data Foundation):**
- **Dependency:** CVSchema (Zod), CV Entity, CVVersion Entity
- **Integration:** ExtractionService nutzt CVSchema für Validation
- **Data Flow:** Extracted CV → Validate → Save to cv_versions table
- **Breaking Changes Risk:** LOW (schema extension backward-compatible)

**Epic 5 (Admin Dashboard):**
- **Dependency:** AdminAuthGuard, Admin Layout, Admin Navigation
- **Integration:** Neue Routes in Admin-Dashboard (/admin/cv/extract, /admin/cv/versions)
- **Data Flow:** Admin UI → Extraction API → Response → UI Update
- **Breaking Changes Risk:** NONE (additive changes only)

### Database Schema Extensions

**cv_versions Table (erweitert aus Epic 2):**

```sql
ALTER TABLE cv_versions
ADD COLUMN source TEXT CHECK(source IN ('manual', 'ai-extraction', 'rollback'));

ALTER TABLE cv_versions
ADD COLUMN file_hash TEXT;

CREATE INDEX idx_cv_versions_source ON cv_versions(source);
CREATE INDEX idx_cv_versions_file_hash ON cv_versions(file_hash);
```

**Migration Notes:**
- Existing rows: `source` will be NULL or default to 'manual'
- Backward compatible (nullable columns)
- No data migration needed

### Dependency Constraints & Version Locking

**Critical Version Constraints:**

1. **@google/genai >= 1.28.0**
   - WHY: Gemini 2.0 Flash support, neue API
   - OLD SDK (@google/generative-ai) deprecated Nov 30, 2025
   - Breaking: Cannot use older versions

2. **pdf-parse ^2.4.5**
   - WHY: Recent bug fixes (published 15 days ago)
   - Stable, 0 breaking changes expected
   - Alternative: pdf.js (too heavy, 2MB bundle size)

3. **react-dropzone ^14.x**
   - WHY: React 19 compatibility
   - v13 has React 18 peer dependency warnings

4. **zod ^3.x**
   - WHY: Shared between Frontend/Backend (monorepo)
   - Must be same major version (type inference breaks otherwise)

**Transitive Dependency Risks:**
- @google/genai → google-auth-library (managed by Google, low risk)
- pdf-parse → NO transitive dependencies (0 deps)
- @monaco-editor/react → monaco-editor (large bundle ~3MB, lazy load recommended)

### Integration Testing Requirements

**Gemini API Integration:**
- Mock Gemini API responses für Unit Tests (avoid real API calls)
- E2E Test mit real API (1x per deployment, not in CI)
- Test API Key validation (invalid key → graceful error)
- Test Timeout Handling (mock 60s+ response)
- Test Retry Logic (mock transient failures)

**Epic 2 Integration:**
- Test CVSchema validation (valid JSON → success, invalid → errors)
- Test CVVersion creation (draft → active transition)
- Test Rollback (load old version, archive current, create new active)

**Epic 5 Integration:**
- Test AdminAuthGuard (unauthenticated → 401, authenticated → proceed)
- Test Rate Limiting (6th request → 429)
- Test UI Navigation (Admin Dashboard → Extract Page)

## Acceptance Criteria (Authoritative)

Diese Acceptance Criteria sind die **autoritäre Quelle** für Epic 6 Completion. Alle müssen erfüllt sein für "Done".

### AC-1: File Upload Funktionalität

**AC-1.1:** User kann Dateien per Drag & Drop auf UploadZone Component ziehen
- **Given:** User ist auf /admin/cv/extract Seite
- **When:** User zieht PDF-Datei auf Upload-Zone
- **Then:** Upload-Zone zeigt visuelles Feedback (highlight border)

**AC-1.2:** User kann Dateien per File-Picker auswählen
- **Given:** User ist auf /admin/cv/extract Seite
- **When:** User klickt "Select File" Button
- **Then:** System öffnet File-Browser Dialog

**AC-1.3:** System validiert File-Type vor Upload
- **Given:** User wählt .exe Datei
- **When:** File-Selection abgeschlossen
- **Then:** System zeigt Error: "Invalid file type. Only PDF, Markdown, and Plain Text allowed."

**AC-1.4:** System validiert File-Size vor Upload
- **Given:** User wählt 15MB PDF
- **When:** File-Selection abgeschlossen
- **Then:** System zeigt Error: "File too large. Maximum size: 10MB"

**AC-1.5:** System accepted valide Files (PDF, MD, TXT <10MB)
- **Given:** User wählt 5MB PDF
- **When:** File-Validation durchgeführt
- **Then:** System zeigt "Ready to upload" Status

### AC-2: LLM Extraction Funktionalität

**AC-2.1:** System extrahiert Text aus PDF
- **Given:** User uploaded 3-page PDF CV
- **When:** Extraction startet
- **Then:** Backend extrahiert plain text via pdf-parse

**AC-2.2:** System sendet Extraction-Prompt an Gemini API
- **Given:** Text wurde aus PDF extrahiert
- **When:** ExtractionService.extractFromFile() aufgerufen
- **Then:** Gemini API erhält Prompt mit extracted text + JSON Resume Schema

**AC-2.3:** System validiert Gemini Response gegen CVSchema
- **Given:** Gemini returns JSON
- **When:** Response empfangen
- **Then:** CVSchema.safeParse() wird aufgerufen

**AC-2.4:** System speichert valides Extraction Result als Draft
- **Given:** Validation erfolgreich (success: true)
- **When:** Draft gespeichert wird
- **Then:** cv_versions table enthält neuen Row mit status='draft', source='ai-extraction'

**AC-2.5:** System returned Validation Errors bei invalidem JSON
- **Given:** Gemini returns invalid JSON (missing required fields)
- **When:** CVSchema.safeParse() fehlschlägt
- **Then:** Response enthält { success: false, errors: [...], rawData: {...} }

### AC-3: Review Interface Funktionalität

**AC-3.1:** DiffViewer zeigt Current CV und Extracted CV side-by-side
- **Given:** Extraction erfolgreich (draft created)
- **When:** Review-Interface rendered
- **Then:** Left panel zeigt current CV, Right panel zeigt extracted CV

**AC-3.2:** DiffViewer highlighted Added/Removed/Changed fields
- **Given:** Extracted CV hat neue Skills
- **When:** DiffViewer rendered
- **Then:** Neue Skills sind grün markiert (added)

**AC-3.3:** Validation Errors werden in UI angezeigt
- **Given:** Extracted CV hat Validation Errors (z.B. invalid date)
- **When:** Review-Interface rendered
- **Then:** Fehlerhafte Felder haben roten Border + Error-Tooltip

**AC-3.4:** User kann extrahierte Daten inline editieren
- **Given:** User sieht Validation Error bei work[0].startDate
- **When:** User klickt auf Feld
- **Then:** JSONEditor wird geöffnet, User kann Wert ändern

**AC-3.5:** User kann editierte Daten re-validieren
- **Given:** User hat Fehler korrigiert
- **When:** User klickt "Validate"
- **Then:** System führt CVSchema.safeParse() erneut aus, zeigt Ergebnis

### AC-4: Publish Funktionalität

**AC-4.1:** System erstellt Backup vor Publish
- **Given:** User klickt "Approve & Publish"
- **When:** Publish-Prozess startet
- **Then:** Current active CV wird archiviert (status='archived')

**AC-4.2:** System setzt Draft als aktive Version
- **Given:** Draft ist valide
- **When:** Publish erfolgreich
- **Then:** Draft-Row wird updated: status='active'

**AC-4.3:** System redirected zu Dashboard nach erfolgreichem Publish
- **Given:** Publish-Prozess abgeschlossen
- **When:** Success-Response empfangen
- **Then:** User wird zu /admin/dashboard redirected, Success-Toast angezeigt

### AC-5: Versionierung & Rollback

**AC-5.1:** System zeigt Versionshistorie in /admin/cv/versions
- **Given:** User navigiert zu /admin/cv/versions
- **When:** GET /api/admin/cv/versions aufgerufen
- **Then:** Tabelle zeigt alle Versions (ID, Status, Source, Created Date)

**AC-5.2:** System erlaubt Rollback zu vorheriger Version
- **Given:** User klickt "Rollback" bei Version 42
- **When:** Rollback-Confirmation bestätigt
- **Then:** POST /api/admin/cv/rollback/42 wird aufgerufen

**AC-5.3:** Rollback erstellt neue aktive Version basierend auf alter Version
- **Given:** Rollback zu Version 42
- **When:** Rollback-Prozess läuft
- **Then:** Neue Version wird erstellt (status='active', source='rollback', data=version 42 data)

**AC-5.4:** Current active Version wird archiviert bei Rollback
- **Given:** Version 50 ist aktuell aktiv
- **When:** Rollback zu Version 42
- **Then:** Version 50 status wird 'archived'

### AC-6: Rate Limiting & Security

**AC-6.1:** System limitiert Extractions auf 5 pro Stunde
- **Given:** User hat bereits 5 Extractions in letzter Stunde gemacht
- **When:** User versucht 6. Extraction
- **Then:** API returned 429 Too Many Requests

**AC-6.2:** System blockiert unauthenticated Requests
- **Given:** User ist nicht eingeloggt
- **When:** POST /api/admin/cv/extract aufgerufen
- **Then:** API returned 401 Unauthorized

**AC-6.3:** System validiert MIME-Type server-side
- **Given:** User manipuliert Frontend, sendet .exe als 'application/pdf'
- **When:** Backend empfängt File
- **Then:** Multer FileInterceptor rejected file (validation error)

### AC-7: Error Handling & Resilience

**AC-7.1:** System retried Gemini API bei transient errors
- **Given:** Gemini API returned 503 (temporary error)
- **When:** First attempt fehlschlägt
- **Then:** System retried 2 weitere Male (exponential backoff)

**AC-7.2:** System showed Timeout Error nach 60s
- **Given:** Gemini API responded nicht innerhalb 60s
- **When:** Timeout erreicht
- **Then:** Frontend zeigt "Extraction timeout. Please try again." Error

**AC-7.3:** System erlaubt Manual Editing bei LLM Failure
- **Given:** Alle 3 Gemini Retry-Attempts fehlgeschlagen
- **When:** Error zurück zu Frontend
- **Then:** UI zeigt "Extraction failed. You can manually enter CV data" + Link zu Manual Editor

**AC-7.4:** System speichert Partial Extraction als Draft
- **Given:** Gemini returns JSON mit Validation Errors
- **When:** Draft gespeichert wird
- **Then:** Draft wird trotzdem gespeichert (status='draft'), User kann später korrigieren

### AC-8: Logging & Observability

**AC-8.1:** System logged Extraction Flow mit Correlation ID
- **Given:** Extraction startet
- **When:** Logs generiert werden
- **Then:** Alle Logs (Upload → Extract → Validate → Save) haben selbe correlationId

**AC-8.2:** System logged Gemini API Latency
- **Given:** Gemini API Call abgeschlossen
- **When:** Log-Entry erstellt
- **Then:** Log enthält latency (ms), inputTokens, outputTokens

**AC-8.3:** System logged Validation Errors
- **Given:** CVSchema Validation fehlschlägt
- **When:** Error-Log erstellt
- **Then:** Log enthält errorCount, errorPaths, draftId

## Traceability Mapping

Diese Tabelle mappt jedes Acceptance Criterion zu Spec-Sections, Komponenten/APIs und Test-Ideas.

| AC ID | Spec Section | Components/APIs | Test Idea |
|-------|-------------|-----------------|-----------|
| **AC-1.1** | Services: UploadZone | UploadZone Component (react-dropzone) | E2E: Simulate drag event, verify highlight CSS class |
| **AC-1.2** | Services: UploadZone | UploadZone Component (file input) | E2E: Click button, verify file dialog opens |
| **AC-1.3** | APIs: POST /extract validation | Frontend validation, Multer | Unit: Upload .exe, expect error toast |
| **AC-1.4** | APIs: POST /extract validation | Frontend validation, Multer 10MB limit | Unit: Upload 15MB file, expect error toast |
| **AC-1.5** | APIs: POST /extract validation | Frontend validation | Unit: Upload 5MB PDF, expect success state |
| **AC-2.1** | Services: FileParsers | pdf-parse library | Unit: Mock PDF, verify text extraction |
| **AC-2.2** | Services: GeminiService | @google/genai SDK | Unit: Mock Gemini API, verify prompt structure |
| **AC-2.3** | Data Models: CVSchema | Zod CVSchema.safeParse() | Unit: Valid JSON → success, Invalid → errors |
| **AC-2.4** | Data Models: CVVersion | CVVersionRepository.save() | Integration: Verify DB insert with status='draft' |
| **AC-2.5** | Services: ExtractionService | ExtractionResultDto (failure case) | Unit: Mock invalid Gemini response, verify errors returned |
| **AC-3.1** | Services: DiffViewer | DiffViewer Component (react-diff-viewer) | E2E: Verify left/right panels render correctly |
| **AC-3.2** | Services: DiffViewer | react-diff-viewer highlighting | E2E: Verify added fields green, removed red |
| **AC-3.3** | Services: DiffViewer | Error highlighting logic | E2E: Inject validation errors, verify red borders |
| **AC-3.4** | Services: JSONEditor | @monaco-editor/react | E2E: Click field, verify editor opens |
| **AC-3.5** | Workflows: Review → Validate | Frontend CVSchema validation | E2E: Edit field, click validate, verify result |
| **AC-4.1** | Workflows: Publish Draft | CVService.publishDraft() | Integration: Verify old version archived before new active |
| **AC-4.2** | Data Models: CVVersion | CVVersionRepository.update() | Integration: Verify draft status → 'active' |
| **AC-4.3** | Workflows: Publish → Redirect | Frontend routing (TanStack Router) | E2E: Verify redirect to /admin/dashboard + toast |
| **AC-5.1** | APIs: GET /versions | CVController.getVersions() | Integration: Verify API returns all versions |
| **AC-5.2** | APIs: POST /rollback/:id | CVController.rollback() | Integration: Verify rollback endpoint called |
| **AC-5.3** | Workflows: Rollback | CVService.rollback() | Integration: Verify new version created with source='rollback' |
| **AC-5.4** | Workflows: Rollback | CVVersionRepository.update() | Integration: Verify current active → 'archived' |
| **AC-6.1** | NFR: Rate Limiting | @nestjs/throttler (5/hour) | E2E: Make 6 requests, expect 429 on 6th |
| **AC-6.2** | NFR: Security | AdminAuthGuard | Integration: Request without session, expect 401 |
| **AC-6.3** | NFR: Security | Multer MIME-type validation | Unit: Mock malicious file, verify rejection |
| **AC-7.1** | NFR: Reliability | GeminiService retry logic | Unit: Mock 503 error, verify 3 attempts |
| **AC-7.2** | NFR: Reliability | GeminiService timeout (60s) | Unit: Mock hanging response, verify timeout error |
| **AC-7.3** | Workflows: LLM Failure Fallback | Frontend error handling | E2E: Mock API failure, verify manual editor link |
| **AC-7.4** | Workflows: Partial Extraction | ExtractionService.extractFromFile() | Integration: Mock invalid JSON, verify draft saved |
| **AC-8.1** | NFR: Observability | Pino logger + correlationId | Integration: Verify all logs have same correlationId |
| **AC-8.2** | NFR: Observability | GeminiService logging | Unit: Mock API response, verify latency logged |
| **AC-8.3** | NFR: Observability | ExtractionService error logging | Unit: Mock validation errors, verify errorPaths logged |

**Coverage Analysis:**
- **Services/Modules:** 10/10 covered (ExtractionController, ExtractionService, GeminiService, FileParsers, CVVersionRepository, CVController, UploadZone, DiffViewer, ProgressSteps, JSONEditor)
- **APIs:** 4/4 covered (POST /extract, GET /versions, POST /rollback, POST /publish-draft)
- **Workflows:** 3/3 covered (Extraction, Rollback, Publish)
- **NFRs:** 4/4 covered (Performance, Security, Reliability, Observability)

**Traceability to PRD FR-5:**
- PRD FR-5.1 (Upload Interface) → AC-1.x (File Upload)
- PRD FR-5.2 (LLM Integration) → AC-2.x (LLM Extraction)
- PRD FR-5.3 (Review Interface) → AC-3.x (Review UI)
- PRD FR-5.4 (Versionierung) → AC-5.x (Versions & Rollback)
- PRD FR-5.5 (Validierung) → AC-2.3, AC-2.5, AC-3.3 (Validation)
- PRD FR-5.6 (Fehlerbehandlung) → AC-7.x (Error Handling)

## Risks, Assumptions, Open Questions

### Risks

**RISK-1: Gemini API Quotas & Costs [HIGH]**
- **Description:** Free tier: 1500 requests/day, 60/minute. Bei Überschreitung → kostenpflichtig ($0.075/1M input tokens)
- **Likelihood:** MEDIUM (personal project, low volume expected)
- **Impact:** HIGH (unerwartete Kosten, Feature blockiert)
- **Mitigation:**
  - Rate Limiting: 5 extractions/hour (max 120/day bei 24h usage)
  - Monitor quota usage via Gemini API dashboard
  - Set billing alerts at $10, $50 thresholds
  - Fallback: Manual JSON editing immer verfügbar

**RISK-2: LLM Extraction Quality [MEDIUM]**
- **Description:** Gemini könnte falsche/unvollständige Daten extrahieren (Halluzinationen, Parsing-Fehler)
- **Likelihood:** MEDIUM (CV-Formate variieren stark)
- **Impact:** MEDIUM (User muss manuell korrigieren, aber nicht blockierend)
- **Mitigation:**
  - Human-in-the-loop Review Interface (User validiert IMMER vor Publish)
  - Zod Validation fängt strukturelle Fehler
  - Diff-Viewer zeigt Changes klar (User kann Fehler erkennen)
  - Rollback-Funktionalität bei fehlerhafter Publish

**RISK-3: PDF Parsing Limitations [MEDIUM]**
- **Description:** pdf-parse funktioniert nur bei text-basierten PDFs, nicht bei gescannten (OCR erforderlich)
- **Likelihood:** LOW (moderne CVs sind meist text-basiert)
- **Impact:** MEDIUM (Extraction schlägt fehl, User muss Manual Editing nutzen)
- **Mitigation:**
  - Clear Error Message: "PDF appears to be scanned. Please use text-based PDF or manually enter data."
  - Future Enhancement: OCR Integration (Growth Feature)
  - Alternative: User kann Markdown/Plain Text stattdessen nutzen

**RISK-4: Large Bundle Size (Monaco Editor) [LOW]**
- **Description:** @monaco-editor/react = ~3MB bundle, könnte Performance beeinträchtigen
- **Likelihood:** LOW (nur Admin-Dashboard, nicht SEO-kritisch)
- **Impact:** LOW (längere Load-Zeit für Admin, aber einmalig)
- **Mitigation:**
  - Lazy Loading: Monaco erst laden wenn JSONEditor geöffnet wird
  - Code Splitting: Separate Chunk für /admin/cv/extract Route
  - Admin-Dashboard = CSR (kein SSR overhead)

**RISK-5: Breaking Changes in @google/genai SDK [LOW]**
- **Description:** Neues SDK (v1.28.0), könnte breaking changes in zukünftigen Versionen haben
- **Likelihood:** LOW (Google SDK, semver-compliant expected)
- **Impact:** MEDIUM (Extraction Feature bricht)
- **Mitigation:**
  - Pin version: @google/genai@^1.28.0 (minor updates OK, majors manual)
  - Wrapper GeminiService abstrahiert SDK (leichter zu migrieren)
  - Monitor SDK changelog bei Updates

### Assumptions

**ASSUMPTION-1:** Admin hat Zugriff auf Gemini API Key
- **Validation:** Setup-Dokumentation mit API Key Anleitung
- **If False:** Feature kann nicht genutzt werden (Manual Editing Fallback)

**ASSUMPTION-2:** CV-Dateien sind in unterstützten Formaten (PDF, Markdown, Plain Text)
- **Validation:** File-Upload validiert MIME-Type
- **If False:** User erhält klare Error Message + alternative Formats

**ASSUMPTION-3:** SQLite cv_versions table existiert bereits (aus Epic 2)
- **Validation:** Database Migration prüft Schema
- **If False:** Migration erstellt fehlende Tabelle + Columns

**ASSUMPTION-4:** Admin-Dashboard Authentication funktioniert (aus Epic 5)
- **Validation:** Integration Tests prüfen AdminAuthGuard
- **If False:** Extraction Endpoints sind ungeschützt (Security Risk)

**ASSUMPTION-5:** JSON Resume Schema bleibt stabil
- **Validation:** CVSchema (Zod) ist versioniert in shared-types package
- **If False:** Schema-Migration erforderlich (aber backward-compatible möglich)

**ASSUMPTION-6:** Gemini 2.0 Flash bleibt kosteneffizient
- **Validation:** Monitor Pricing-Änderungen in Gemini API docs
- **If False:** Migration zu alternative LLM (OpenAI, Claude) oder lokales Modell

### Open Questions

**QUESTION-1:** Soll OCR-Support für gescannte PDFs im MVP sein?
- **Status:** DEFERRED to Growth Phase
- **Reason:** Komplexität hoch, Use-Case niedrig (moderne CVs sind text-basiert)
- **Future:** Integration von Tesseract.js oder Google Cloud Vision API

**QUESTION-2:** Welche Version History Retention Policy?
- **Current:** Unbegrenzte Retention (alle Versions bleiben in DB)
- **Alternative:** Nur letzte 50 Versions behalten, ältere archivieren
- **Decision Needed:** MVP = unbegrenzt, später configurable

**QUESTION-3:** Soll System mehrere CVs supporten (Multi-CV per Admin)?
- **Status:** OUT OF SCOPE for MVP
- **Reason:** Persönliches Projekt, Single-User-System
- **Future:** Multi-CV könnte als Growth Feature kommen (z.B. DE/EN Versions)

**QUESTION-4:** Gemini 2.0 Flash vs. 1.5 Pro - welches Modell für bessere Extraction?
- **Current Decision:** Gemini 2.0 Flash (kosteneffizient, schnell)
- **Alternative:** 1.5 Pro für höhere Qualität (aber 10x teurer)
- **Recommendation:** MVP mit Flash starten, bei Quality-Problemen zu Pro upgraden

**QUESTION-5:** Soll System File-Deduplizierung anzeigen (file_hash check)?
- **Current:** file_hash wird gespeichert, aber keine UI-Benachrichtigung
- **Proposal:** "You already uploaded this file on [date]. Use existing draft?"
- **Decision Needed:** Nice-to-have für MVP, nicht kritisch

## Test Strategy Summary

### Test Levels & Coverage Targets

**Unit Tests (70% Coverage Target):**
- **Backend Services:**
  - ExtractionService: Mock Gemini API, test extraction logic
  - GeminiService: Mock HTTP client, test prompt generation, retry logic
  - FileParsers: Test PDF/Markdown/Text extraction with sample files
  - CVVersionRepository: Test CRUD operations (in-memory SQLite)
- **Frontend Components:**
  - UploadZone: Test drag events, file validation
  - DiffViewer: Test diff rendering, error highlighting
  - JSONEditor: Test editing, validation
  - ProgressSteps: Test state transitions
- **Validation Logic:**
  - CVSchema (Zod): Test valid/invalid JSON Resume inputs

**Integration Tests (50% Coverage Target):**
- **API Endpoints:**
  - POST /api/admin/cv/extract (with mocked Gemini API)
  - GET /api/admin/cv/versions
  - POST /api/admin/cv/rollback/:id
  - POST /api/admin/cv/publish-draft
- **Database Integration:**
  - TypeORM Repositories with real SQLite DB (test mode)
  - Test transactions, rollbacks, version history
- **Auth Integration:**
  - AdminAuthGuard with mock sessions
  - Rate Limiting with @nestjs/throttler

**E2E Tests (Critical Paths - 5 Scenarios):**
1. **Happy Path Extraction:**
   - Upload PDF → Extract → Review → Approve → Publish
   - Verify: Draft created, Active version updated, Toast shown
2. **Validation Errors Flow:**
   - Upload PDF → Extract returns errors → Manual Edit → Re-validate → Publish
   - Verify: Errors shown, Editing works, Validation re-runs
3. **Rollback Flow:**
   - Navigate to /admin/cv/versions → Select version → Rollback
   - Verify: New active version created, old archived
4. **Rate Limiting:**
   - Make 6 extraction requests in quick succession
   - Verify: 6th request returns 429
5. **LLM Failure Fallback:**
   - Mock Gemini API failure → Verify error message + Manual Editor link

**Test Frameworks & Tools:**

| Layer | Framework | Purpose |
|-------|-----------|---------|
| **Backend Unit** | Jest + ts-jest | NestJS default, TypeScript support |
| **Backend Integration** | Supertest | HTTP endpoint testing |
| **Frontend Unit** | Vitest + React Testing Library | Fast, Vite-native, React components |
| **E2E** | Playwright | Cross-browser, fast, reliable |
| **Mocking** | Mock Service Worker (MSW) | API mocking for frontend tests |
| **Database** | SQLite (in-memory) | Fast, disposable test DB |

### Test Data & Fixtures

**Sample CV Files (Fixtures):**
- `sample-cv.pdf` (3 pages, text-based, valid)
- `scanned-cv.pdf` (image-based, should fail with clear error)
- `large-cv.pdf` (15MB, should fail size validation)
- `sample-cv.md` (Markdown format)
- `sample-cv.txt` (Plain text format)

**Mock Gemini Responses:**
- `valid-extraction.json` (perfect JSON Resume schema)
- `invalid-extraction.json` (missing required fields)
- `partial-extraction.json` (some fields valid, some invalid)

**Database Seed Data:**
- Existing CV (version 1, status='active')
- 5 archived versions (for rollback testing)
- 2 draft versions (for review testing)

### Edge Cases to Test

1. **Empty PDF:** PDF with no extractable text → Error message
2. **Non-English CV:** CV in German/French → Gemini should still extract
3. **Very Long CV:** 20+ pages → Timeout risk, verify retry logic
4. **Malformed JSON from Gemini:** Invalid JSON string → Graceful error handling
5. **Concurrent Extractions:** 2 requests at same time → Rate limit works
6. **Expired Session during Extraction:** Session expires mid-extraction → 401 error
7. **Network Timeout:** Gemini API doesn't respond for 65s → Timeout error shown

### Performance Tests

**Load Testing (Optional for Production):**
- Tool: k6 or Artillery
- Scenario: 10 concurrent extractions (simulating multiple admin sessions)
- Goal: Verify Rate Limiting works, no DB deadlocks

**Gemini API Latency Tracking:**
- Log P50, P95, P99 latencies
- Goal: <30s P95 for standard CVs

### Test Automation & CI/CD Integration

**GitHub Actions Workflow:**
```yaml
name: Epic 6 Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies (pnpm)
      - Run unit tests (Jest)
      - Run integration tests (Supertest)
      - Upload coverage to Codecov

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies (pnpm)
      - Run unit tests (Vitest)
      - Upload coverage to Codecov

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies (pnpm)
      - Start backend (test mode)
      - Start frontend (test mode)
      - Run Playwright tests
      - Upload test artifacts (videos, screenshots)
```

**Test Coverage Requirements:**
- **Unit Tests:** ≥70% line coverage
- **Integration Tests:** All API endpoints covered
- **E2E Tests:** 5 critical paths covered
- **Blocker:** <70% coverage fails CI/CD pipeline

### Manual Testing Checklist (Pre-Release)

- [ ] Upload real CV PDF, verify extraction accuracy
- [ ] Test with German and English CVs
- [ ] Verify Diff Viewer UX (readability, highlighting)
- [ ] Test Monaco Editor: Syntax highlighting, editing, save
- [ ] Verify Rate Limiting: Hit limit, wait 1 hour, verify reset
- [ ] Test Rollback: Multiple versions, verify data integrity
- [ ] Check Logs: Correlation IDs present, latency logged
- [ ] Verify MIME-Type validation: Try uploading .exe (should fail)
- [ ] Test Session Expiry: Start extraction, logout, verify 401
- [ ] Performance: Upload 10MB PDF, verify <45s total time
