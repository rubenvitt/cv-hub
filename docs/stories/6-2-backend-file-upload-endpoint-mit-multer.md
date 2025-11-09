# Story 6.2: Backend File-Upload-Endpoint mit Multer

Status: drafted

## Story

Als Backend-Entwickler,
möchte ich einen sicheren File-Upload-Endpoint mit Multer implementieren,
damit Admins CV-Dateien (PDF, Markdown, Plain Text) hochladen können und diese validiert sowie in-memory verarbeitet werden.

## Acceptance Criteria

1. **AC 6.2.1: POST /api/admin/cv/extract Endpoint erstellt**
   - Controller-Methode `extractCv()` in ExtractionController
   - Route: POST `/api/admin/cv/extract`
   - Request: multipart/form-data mit File-Field
   - Response: ExtractionResultDto (success/error structure)

2. **AC 6.2.2: AdminAuthGuard schützt Endpoint**
   - AdminAuthGuard als Guard auf Controller oder Methode angewandt
   - Session-basierte Auth-Prüfung (aus Epic 5)
   - Unauthenticated Request → 401 Unauthorized
   - Auth-Check läuft VOR File-Processing

3. **AC 6.2.3: Multer FileInterceptor konfiguriert**
   - `@UseInterceptors(FileInterceptor('file'))` auf Methode
   - Memory Storage (keine Disk-Persistenz)
   - Max File Size: 10MB (10485760 bytes)
   - Single file upload (nicht multiple)
   - File verfügbar via `@UploadedFile()` Decorator

4. **AC 6.2.4: Server-seitige MIME-Type-Validierung**
   - Allowed MIME Types: `application/pdf`, `text/markdown`, `text/plain`
   - MIME-Type-Check im Controller oder Custom Pipe
   - Nicht-erlaubter Type → 400 Bad Request mit klarer Error-Message
   - Error: "Invalid file type. Only PDF, Markdown, and Plain Text allowed."

5. **AC 6.2.5: File-Extension-Whitelist**
   - Allowed Extensions: `.pdf`, `.md`, `.txt`
   - Extension-Check zusätzlich zu MIME-Type (Security Layer)
   - Case-insensitive Check (`.PDF`, `.Pdf` etc. erlaubt)
   - Nicht-erlaubte Extension → 400 Bad Request
   - Error: "Invalid file extension. Only .pdf, .md, .txt allowed."

6. **AC 6.2.6: Rate-Limiting mit @nestjs/throttler**
   - Throttler Guard angewendet: 5 Requests pro Stunde pro Session
   - Rate-Limit-Scope: Session-ID (nicht IP)
   - 6. Request innerhalb 1 Stunde → 429 Too Many Requests
   - Error-Response mit Retry-After Header
   - Custom Throttler Config für diesen Endpoint

7. **AC 6.2.7: Error-Responses mit klaren HTTP-Status-Codes**
   - 400 Bad Request: Invalid file type/extension, file too large
   - 401 Unauthorized: Nicht eingeloggt, Session expired
   - 429 Too Many Requests: Rate-Limit überschritten
   - 500 Internal Server Error: Server-seitiger Fehler
   - Alle Errors mit strukturiertem Error-Body (Message, StatusCode, optional Details)

8. **AC 6.2.8: File wird in Memory gehalten**
   - Multer Storage: MemoryStorage (nicht DiskStorage)
   - File.buffer enthält Daten als Buffer
   - KEINE File-Speicherung auf Disk
   - File-Buffer kann an ExtractionService weitergereicht werden (Vorbereitung für Story 6.3)

## Tasks / Subtasks

- [ ] **Task 1: Extraction Module Setup** (AC: 6.2.1)
  - [ ] Module `apps/backend/src/modules/extraction/extraction.module.ts` erstellen
  - [ ] ExtractionController generieren (`nest g controller extraction`)
  - [ ] ExtractionService generieren (`nest g service extraction`)
  - [ ] Module in `app.module.ts` importieren
  - [ ] DTOs-Ordner erstellen: `modules/extraction/dto/`
  - [ ] Unit-Test: Module lädt korrekt, Controller/Service injectable

- [ ] **Task 2: ExtractionController POST /api/admin/cv/extract Endpoint** (AC: 6.2.1)
  - [ ] Controller-Methode `extractCv()` erstellen
  - [ ] Route: `@Post('extract')` (Controller Prefix: `/api/admin/cv`)
  - [ ] Request-Handling: multipart/form-data
  - [ ] Response-Type: ExtractionResultDto (Placeholder für jetzt)
  - [ ] Swagger-Dekoration: `@ApiOperation`, `@ApiConsumes('multipart/form-data')`
  - [ ] Unit-Test: Route existiert, Methode aufrufbar

- [ ] **Task 3: AdminAuthGuard Integration** (AC: 6.2.2)
  - [ ] AdminAuthGuard aus `modules/admin/guards/` importieren
  - [ ] `@UseGuards(AdminAuthGuard)` auf Controller-Klasse anwenden
  - [ ] Session-basierte Auth-Prüfung (nutzt Passport Session Strategy)
  - [ ] Integration-Test: Unauthenticated Request → 401
  - [ ] Integration-Test: Authenticated Request mit gültiger Session → 200/400 (je nach File)

- [ ] **Task 4: Multer FileInterceptor Konfiguration** (AC: 6.2.3)
  - [ ] `@nestjs/platform-express` Dependency prüfen (sollte bereits installiert sein)
  - [ ] `@UseInterceptors(FileInterceptor('file', multerOptions))` auf `extractCv()` Methode
  - [ ] Multer Options konfigurieren:
    - `storage: memoryStorage()`
    - `limits: { fileSize: 10485760 }` (10MB)
  - [ ] `@UploadedFile()` Decorator für File-Parameter
  - [ ] File-Type: `Express.Multer.File`
  - [ ] Unit-Test: File-Interceptor ist konfiguriert (Mock File-Upload)

- [ ] **Task 5: Server-seitige MIME-Type-Validierung** (AC: 6.2.4)
  - [ ] Custom Validation Pipe: `ValidateFileMimeTypePipe` erstellen
  - [ ] Allowed MIME Types: `['application/pdf', 'text/markdown', 'text/plain']`
  - [ ] Pipe Logic: `file.mimetype` gegen Whitelist prüfen
  - [ ] Bei Mismatch: `throw new BadRequestException('Invalid file type. Only PDF, Markdown, and Plain Text allowed.')`
  - [ ] `@UploadedFile(ValidateFileMimeTypePipe)` anwenden
  - [ ] Unit-Test: Pipe rejected ungültige MIME-Types, akzeptiert valide

- [ ] **Task 6: File-Extension-Whitelist Validierung** (AC: 6.2.5)
  - [ ] Custom Validation Pipe erweitern: `ValidateFileExtensionPipe`
  - [ ] Allowed Extensions: `['.pdf', '.md', '.txt']`
  - [ ] Extension-Extraktion: `path.extname(file.originalname).toLowerCase()`
  - [ ] Case-insensitive Check (alles zu lowercase konvertieren)
  - [ ] Bei Mismatch: `throw new BadRequestException('Invalid file extension. Only .pdf, .md, .txt allowed.')`
  - [ ] Pipe kann mit MIME-Type-Pipe kombiniert werden (Validation Pipeline)
  - [ ] Unit-Test: Extension-Check funktioniert, Case-insensitiv

- [ ] **Task 7: Multer File-Size-Limit Handling** (AC: 6.2.3, 6.2.7)
  - [ ] Multer `limits.fileSize: 10485760` bereits in Task 4 konfiguriert
  - [ ] Exception-Filter für Multer Errors: `MulterExceptionFilter`
  - [ ] Multer Error-Code `LIMIT_FILE_SIZE` abfangen
  - [ ] Custom Error-Message: "File too large. Maximum size: 10MB"
  - [ ] HTTP-Status: 400 Bad Request
  - [ ] Filter auf Controller anwenden: `@UseFilters(MulterExceptionFilter)`
  - [ ] Integration-Test: 15MB File → 400 mit "File too large" Message

- [ ] **Task 8: Rate-Limiting mit @nestjs/throttler** (AC: 6.2.6)
  - [ ] `@nestjs/throttler` bereits installiert (Epic 5)
  - [ ] Custom Throttler Guard für Extraction: `ExtractionThrottlerGuard`
  - [ ] Throttler Config: `@Throttle({ default: { limit: 5, ttl: 3600000 } })` (5 req/hour)
  - [ ] Session-basiertes Tracking (nicht IP): Custom `getTracker()` implementieren
  - [ ] Guard auf `extractCv()` Methode anwenden
  - [ ] 429 Error mit `Retry-After` Header
  - [ ] Integration-Test: 6. Request in 1h → 429

- [ ] **Task 9: ExtractionResultDto Definition** (AC: 6.2.1, 6.2.7)
  - [ ] DTO-File: `dto/extraction-result.dto.ts` erstellen
  - [ ] Zod-Schema (Shared Types Package nutzen):
    ```typescript
    ExtractionResultDtoSchema = z.discriminatedUnion('success', [
      z.object({ success: z.literal(true), message: z.string() }),
      z.object({ success: z.literal(false), error: z.string() })
    ]);
    ```
  - [ ] TypeScript Type: `type ExtractionResultDto = z.infer<typeof ExtractionResultDtoSchema>`
  - [ ] Swagger-Dekoration: `@ApiProperty` für Schema-Generierung
  - [ ] Placeholder Response (Story 6.2): `{ success: true, message: 'File uploaded successfully' }`
  - [ ] Unit-Test: DTO validiert korrekt

- [ ] **Task 10: Error-Handling und strukturierte Error-Responses** (AC: 6.2.7)
  - [ ] Global Exception-Filter: NestJS default nutzen (HttpException → JSON)
  - [ ] Custom Error-Bodies:
    - 400: `{ statusCode: 400, message: 'Invalid file type...', error: 'Bad Request' }`
    - 401: `{ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }`
    - 429: `{ statusCode: 429, message: 'Too many requests', error: 'Too Many Requests' }`
  - [ ] Pino Logger Integration: Errors loggen mit Context (correlationId)
  - [ ] Unit-Test: Error-Responses haben erwartete Struktur

- [ ] **Task 11: Swagger API-Dokumentation** (AC: 6.2.1)
  - [ ] `@ApiOperation({ summary: 'Upload CV file for extraction' })` auf Methode
  - [ ] `@ApiConsumes('multipart/form-data')` für File-Upload
  - [ ] `@ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })`
  - [ ] `@ApiResponse({ status: 200, description: 'File uploaded successfully', type: ExtractionResultDto })`
  - [ ] `@ApiResponse({ status: 400, description: 'Invalid file type or size' })`
  - [ ] `@ApiResponse({ status: 401, description: 'Unauthorized' })`
  - [ ] `@ApiResponse({ status: 429, description: 'Rate limit exceeded' })`
  - [ ] Verify: Swagger UI zeigt Endpoint korrekt mit File-Upload-Interface

- [ ] **Task 12: Integration Tests** (AC: alle)
  - [ ] Test-Setup: Mock Admin-Session (authenticated requests)
  - [ ] Test 1: Authenticated, valid PDF → 200 OK
  - [ ] Test 2: Authenticated, valid Markdown → 200 OK
  - [ ] Test 3: Authenticated, .exe File → 400 (invalid type)
  - [ ] Test 4: Authenticated, 15MB PDF → 400 (file too large)
  - [ ] Test 5: Unauthenticated → 401 Unauthorized
  - [ ] Test 6: 6 Requests in 1 hour → 6th returns 429
  - [ ] Test 7: Invalid MIME-Type (application/exe) → 400
  - [ ] Test 8: Invalid Extension (.zip) → 400
  - [ ] Assert: File.buffer enthält Daten (Memory Storage funktioniert)

- [ ] **Task 13: Unit Tests** (AC: alle)
  - [ ] ExtractionController Unit-Test:
    - Mock AdminAuthGuard, Throttler, Pipes
    - Valid File → extractCv() returned success
    - Controller Method wirft keine Exceptions
  - [ ] ValidateFileMimeTypePipe Unit-Test:
    - Valid MIME-Types passieren
    - Invalid MIME-Types werfen BadRequestException
  - [ ] ValidateFileExtensionPipe Unit-Test:
    - Valid Extensions passieren (case-insensitive)
    - Invalid Extensions werfen BadRequestException
  - [ ] MulterExceptionFilter Unit-Test:
    - LIMIT_FILE_SIZE Error → 400 mit custom message

- [ ] **Task 14: Logging und Observability** (AC: 6.2.7)
  - [ ] Pino Logger in ExtractionController injizieren
  - [ ] Log auf Info-Level: "File upload started" (File-Name, Size, MIME-Type)
  - [ ] Log auf Error-Level bei Validation-Failures (Error-Typ, Details)
  - [ ] Correlation-ID generieren für Request-Tracking (NestJS Request-Context)
  - [ ] Logs strukturiert (JSON): `{ level, timestamp, message, context: { fileName, fileSize, mimeType, correlationId } }`
  - [ ] Integration-Test: Logs enthalten erwartete Felder

## Dev Notes

### Architektur-Kontext

**Backend-Stack (aus architecture.md):**
- **Framework:** NestJS v11 (TypeScript, Modular Architecture)
- **File-Upload:** Multer (NestJS-native via `@nestjs/platform-express`)
- **Auth:** Passport.js + AdminAuthGuard (Session-basiert, Epic 5)
- **Rate-Limiting:** @nestjs/throttler v6.4.0
- **Logging:** Pino (nestjs-pino v4.4.1) - Structured JSON Logs
- **Validation:** Zod (Shared Types Package)
- **API-Docs:** Swagger (OpenAPI 3.0)

**Module-Struktur:**
```
apps/backend/src/modules/
├── extraction/               (NEU in Story 6.2)
│   ├── extraction.module.ts
│   ├── extraction.controller.ts
│   ├── extraction.service.ts (Placeholder für Story 6.3+)
│   ├── dto/
│   │   └── extraction-result.dto.ts
│   └── pipes/
│       ├── validate-file-mime-type.pipe.ts
│       └── validate-file-extension.pipe.ts
├── admin/                    (Epic 5)
│   └── guards/
│       └── admin-auth.guard.ts
└── cv/                       (Epic 2)
    └── entities/
        └── cv-version.entity.ts
```

**API-Endpoint:**
```
POST /api/admin/cv/extract
- Controller: ExtractionController
- Auth: AdminAuthGuard (Session-basiert)
- Rate-Limit: 5 requests/hour per session
- Request: multipart/form-data (Field: 'file')
- Response: ExtractionResultDto
```

### Multer Konfiguration

**Memory Storage (nicht Disk):**
```typescript
import { memoryStorage } from 'multer';

const multerOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10485760, // 10MB in bytes
  },
};

@UseInterceptors(FileInterceptor('file', multerOptions))
```

**Warum Memory Storage?**
- Keine Disk-Persistenz (File-Privacy)
- File-Buffer direkt verfügbar für Processing
- Einfacher (keine Cleanup-Logic für temp files)
- File-Size limitiert auf 10MB → RAM-Safe

**File-Object Structure:**
```typescript
interface Express.Multer.File {
  fieldname: string;        // 'file'
  originalname: string;     // 'my-cv.pdf'
  encoding: string;         // '7bit'
  mimetype: string;         // 'application/pdf'
  size: number;             // File size in bytes
  buffer: Buffer;           // File content (MemoryStorage)
}
```

### Validierungs-Pipeline

**Validation-Flow:**
```
1. Multer FileInterceptor
   ├─► Check: File size ≤ 10MB
   └─► Store: In memory (buffer)

2. ValidateFileMimeTypePipe
   ├─► Check: MIME-Type in whitelist
   └─► Throw: BadRequestException if invalid

3. ValidateFileExtensionPipe
   ├─► Check: Extension in whitelist (.pdf, .md, .txt)
   └─► Throw: BadRequestException if invalid

4. Controller Method (extractCv)
   ├─► Success: Return ExtractionResultDto
   └─► Error: Logged + Exception
```

**Custom Pipes Implementation:**

```typescript
// validate-file-mime-type.pipe.ts
@Injectable()
export class ValidateFileMimeTypePipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'application/pdf',
    'text/markdown',
    'text/plain',
  ];

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, Markdown, and Plain Text allowed.'
      );
    }

    return file;
  }
}
```

```typescript
// validate-file-extension.pipe.ts
import * as path from 'path';

@Injectable()
export class ValidateFileExtensionPipe implements PipeTransform {
  private readonly allowedExtensions = ['.pdf', '.md', '.txt'];

  transform(file: Express.Multer.File): Express.Multer.File {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        'Invalid file extension. Only .pdf, .md, .txt allowed.'
      );
    }

    return file;
  }
}
```

**Pipe Usage in Controller:**
```typescript
@Post('extract')
@UseInterceptors(FileInterceptor('file', multerOptions))
async extractCv(
  @UploadedFile(
    ValidateFileMimeTypePipe,
    ValidateFileExtensionPipe,
  ) file: Express.Multer.File,
): Promise<ExtractionResultDto> {
  // File ist validiert (MIME-Type, Extension, Size)
  // Placeholder Response für Story 6.2
  return {
    success: true,
    message: 'File uploaded successfully',
  };
}
```

### Rate-Limiting Strategie

**Throttler Konfiguration (Session-basiert):**

```typescript
// extraction-throttler.guard.ts
@Injectable()
export class ExtractionThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    // Track by Session-ID (nicht IP)
    return req.session?.id || req.ip;
  }
}
```

**Anwendung im Controller:**
```typescript
@Post('extract')
@Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 req/1h
@UseGuards(ExtractionThrottlerGuard)
async extractCv(...) { ... }
```

**Warum Session-basiert?**
- Fairer als IP-basiert (VPNs, Firewalls → gleiche IP)
- Admin ist authenticated → Session vorhanden
- Verhindert Missbrauch durch einzelnen Admin-User

**429 Error-Response:**
```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "error": "Too Many Requests"
}
```

### Error-Handling & Responses

**HTTP-Status-Codes:**
- **200 OK:** File erfolgreich hochgeladen (validiert)
- **400 Bad Request:** Invalid file type, extension, or size
- **401 Unauthorized:** Nicht eingeloggt, Session expired
- **429 Too Many Requests:** Rate-Limit überschritten (>5 in 1h)
- **500 Internal Server Error:** Server-Fehler

**Error-Response-Struktur (NestJS Default):**
```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only PDF, Markdown, and Plain Text allowed.",
  "error": "Bad Request"
}
```

**Multer File-Size Error-Handling:**
```typescript
// multer-exception.filter.ts
@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'LIMIT_FILE_SIZE') {
      return response.status(400).json({
        statusCode: 400,
        message: 'File too large. Maximum size: 10MB',
        error: 'Bad Request',
      });
    }

    // Other Multer errors
    return response.status(400).json({
      statusCode: 400,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
```

### Security Considerations

**File-Upload-Security (aus Tech Spec):**
1. **MIME-Type Validation:** Server-side (nicht nur client-side)
2. **Extension Whitelist:** Doppelte Validierung (Defense-in-Depth)
3. **File-Size Limit:** 10MB (DoS-Prevention)
4. **Memory Storage:** Keine Disk-Persistenz (File-Privacy)
5. **Rate-Limiting:** 5/hour (API-Missbrauch Prevention)
6. **Authentication:** AdminAuthGuard (nur authenticated Admins)

**OWASP File-Upload Best Practices:**
- ✅ Validate MIME-Type server-side
- ✅ Validate File-Extension
- ✅ Limit File-Size
- ✅ Use Memory Storage (kein direkter Disk-Access)
- ✅ Rate-Limiting
- ✅ Authentication required
- ⏸️ Virus-Scanning (Out of Scope MVP, Production: ClamAV)

**Potential Attack Vectors & Mitigations:**
1. **Malicious File Upload (.exe as .pdf):**
   - Mitigation: BEIDE Checks (MIME-Type UND Extension)
2. **File-Bomb (large file):**
   - Mitigation: Multer 10MB limit
3. **API-Abuse (spam requests):**
   - Mitigation: Rate-Limiting (5/hour)
4. **Unauthorized Access:**
   - Mitigation: AdminAuthGuard (Session-Check)

### Logging & Observability

**Structured Logs (Pino JSON):**

```typescript
// File upload started
{
  "level": "info",
  "timestamp": "2025-11-08T14:30:00Z",
  "message": "File upload started",
  "context": {
    "fileName": "my-cv.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "correlationId": "ext-abc123",
    "sessionId": "sess-xyz789"
  }
}
```

```typescript
// Validation error
{
  "level": "error",
  "timestamp": "2025-11-08T14:30:05Z",
  "message": "File validation failed",
  "context": {
    "fileName": "malicious.exe",
    "fileSize": 1024000,
    "mimeType": "application/exe",
    "error": "Invalid file type",
    "correlationId": "ext-abc123"
  }
}
```

**Metrics to Track:**
- File Upload Success Rate: (successful / total) * 100
- Average File Size: Track distribution (histogram)
- Validation Error Rate: % of files rejected (by reason)
- Rate-Limit Hit Rate: How often 429 occurs
- MIME-Type Distribution: Which file types are most common

### Testing-Strategie

**Unit Tests (Jest):**
- **ExtractionController:**
  - Mock: AdminAuthGuard, Throttler, Pipes, ExtractionService
  - Test: extractCv() returns success DTO
  - Test: Exceptions propagate correctly
- **ValidateFileMimeTypePipe:**
  - Test: Valid MIME-Types pass
  - Test: Invalid MIME-Types throw BadRequestException
  - Test: Missing file throws Exception
- **ValidateFileExtensionPipe:**
  - Test: Valid extensions pass (.pdf, .md, .txt)
  - Test: Case-insensitive (.PDF, .Pdf)
  - Test: Invalid extensions throw BadRequestException
- **MulterExceptionFilter:**
  - Test: LIMIT_FILE_SIZE → 400 with custom message
  - Test: Other Multer errors → generic 400

**Integration Tests (Supertest):**
- **Setup:**
  - Test DB (SQLite in-memory)
  - Mock Admin Session (authenticated requests)
  - Mock Throttler (reset limits between tests)
- **Test Cases:**
  1. POST /api/admin/cv/extract (valid PDF, authenticated) → 200
  2. POST /api/admin/cv/extract (valid .md, authenticated) → 200
  3. POST /api/admin/cv/extract (.exe file) → 400 (invalid type)
  4. POST /api/admin/cv/extract (15MB PDF) → 400 (file too large)
  5. POST /api/admin/cv/extract (unauthenticated) → 401
  6. POST /api/admin/cv/extract (6 requests in 1h) → 6th returns 429
  7. POST /api/admin/cv/extract (invalid MIME-Type) → 400
  8. POST /api/admin/cv/extract (invalid extension .zip) → 400
- **Assert:**
  - Response Status-Codes korrekt
  - Error-Messages klar und actionable
  - File.buffer enthält Daten (Memory Storage)

**E2E Tests (Out of Scope für Story 6.2):**
- E2E wird in Story 6.14 (Integration Tests und CI/CD für Epic 6) implementiert
- Story 6.2 fokussiert auf Unit + Integration Tests

### Learnings from Previous Story

**From Story 6-1 (File-Upload-Interface mit Drag & Drop):**
Story 6-1 ist "drafted" (noch nicht implementiert).

**Relevant Context für Story 6.2:**
- **Frontend Validation:** Story 6-1 implementiert client-seitige Validierung (MIME-Type, Size)
- **Server-seitige Validierung ERFORDERLICH:** Client-Validierung kann umgangen werden → Server MUSS nochmal prüfen
- **Same Constraints:** Beide Stories nutzen selbe Limits (10MB, PDF/MD/TXT)
- **File-Field-Name:** Frontend sendet als 'file' → Backend erwartet 'file' (FileInterceptor)

**Integration Points:**
- Frontend (Story 6-1) sendet POST /api/admin/cv/extract mit multipart/form-data
- Backend (Story 6-2) empfängt File, validiert, returned ExtractionResultDto
- Story 6-1 zeigt Success-State basierend auf 200-Response
- Story 6-1 zeigt Error-Toasts basierend auf 400/401/429-Responses

**Wichtig:**
- Backend-Validierung ist NICHT optional (Security Layer)
- Error-Messages müssen klar sein (Frontend zeigt sie dem User)
- Rate-Limiting muss funktionieren (Frontend hat kein Client-Side Rate-Limit)

### References

- [Source: docs/tech-spec-epic-6.md - Section: APIs and Interfaces - POST /api/admin/cv/extract]
- [Source: docs/tech-spec-epic-6.md - Section: Services and Modules - ExtractionController]
- [Source: docs/tech-spec-epic-6.md - Section: Security - File Upload Security]
- [Source: docs/tech-spec-epic-6.md - Section: NPM Dependencies - Multer, @nestjs/throttler]
- [Source: docs/epics.md - Epic 6, Story 6.2]
- [Source: docs/architecture.md - Backend Stack - NestJS, Multer, Passport.js]
- [Source: docs/architecture.md - Security Patterns - AdminAuthGuard, Rate-Limiting]
- [Source: docs/PRD.md - FR-5: KI-gestützte CV-Daten-Extraktion - Upload-Interface]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
