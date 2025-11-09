# Story 6.5: Extraction Orchestration mit Validation

Status: drafted

## Story

Als Backend-Entwickler,
möchte ich den vollständigen Extraction-Flow orchestrieren (File-Parse → LLM-Call → Validation → Draft-Save),
damit unstrukturierte CV-Uploads automatisch in validierte JSON Resume Drafts konvertiert werden.

## Acceptance Criteria

1. **AC 6.5.1: ExtractionService Orchestrierung**
   - Service-Klasse `ExtractionService` erstellt in `apps/backend/src/modules/extraction/services/extraction.service.ts`
   - Injectable als Provider im ExtractionModule
   - Constructor injiziert: FileParsersService, GeminiService, CVVersionRepository, PinoLogger
   - Hauptmethode: `async extractFromFile(file: Express.Multer.File): Promise<ExtractionResultDto>`
   - Orchestriert vollständigen Flow: Parse → LLM → Validate → Save Draft

2. **AC 6.5.2: File-Parsing Integration**
   - ExtractionService ruft `FileParsersService.parseFile(buffer, mimetype)` auf
   - Plain text wird extrahiert (siehe Story 6.3)
   - Error-Handling: Parsing-Fehler werden propagiert als `BadRequestException`
   - Log: "File parsing completed" mit Context: fileSize, mimeType, textLength

3. **AC 6.5.3: LLM-Extraction Integration**
   - ExtractionService ruft `GeminiService.extractCV(plainText)` auf
   - JSON string wird von Gemini API erhalten (siehe Story 6.4)
   - Error-Handling: LLM-Fehler werden propagiert (401, 429, 503, Timeout)
   - Log: "LLM extraction completed" mit Context: latency, inputTokens, outputTokens

4. **AC 6.5.4: JSON Schema Validation mit Zod**
   - JSON string wird geparst: `JSON.parse(jsonString)`
   - CVSchema validation: `CVSchema.safeParse(parsedJSON)`
   - **Bei Success (success: true):**
     - Valid CV-Daten extrahiert
     - ExtractionResultDto mit `success: true, data: CV`
   - **Bei Validation Errors (success: false):**
     - Zod errors werden formatiert
     - ExtractionResultDto mit `success: false, errors: ZodError[], rawData: parsedJSON`
     - Raw data wird trotzdem gespeichert (für manuelle Korrektur)

5. **AC 6.5.5: Draft Version Speicherung**
   - Bei validem JSON **oder** Validation Errors: Draft wird gespeichert
   - CVVersion entity erstellt:
     - `cvId: 1` (Single-User-System)
     - `data: JSON.stringify(parsedJSON)` (auch wenn invalid)
     - `status: 'draft'`
     - `source: 'ai-extraction'`
     - `fileHash: SHA-256(file.buffer)` für Deduplication
   - CVVersionRepository.save() speichert Entity
   - Draft-ID wird in ExtractionResultDto zurückgegeben

6. **AC 6.5.6: ExtractionResultDto Response-Typ**
   - **Success Case:**
     ```typescript
     {
       success: true,
       draftId: number,
       data: CV // Valid CVSchema
     }
     ```
   - **Validation Error Case:**
     ```typescript
     {
       success: false,
       errors: Array<{ path: string[], message: string, code: string }>,
       rawData: Record<string, any> // Partially valid JSON for manual editing
     }
     ```
   - Type-Safety: Zod schema für ExtractionResultDto (Discriminated Union)

7. **AC 6.5.7: File-Hash Deduplication Check**
   - Vor Extraktion: SHA-256 Hash des Uploads berechnen
   - CVVersionRepository query: Existiert bereits Draft mit gleichem fileHash?
   - **Falls Duplicate gefunden:**
     - Log: "File already extracted" mit Context: existingDraftId, fileHash
     - Option A: Existing draft zurückgeben (keine neue Extraktion)
     - Option B: User warnen "File already uploaded on [date]", trotzdem neu extrahieren
     - **MVP-Entscheidung:** Immer neu extrahieren (keine Duplicate-Blockierung), nur Warnung loggen
   - **Falls kein Duplicate:** Normal fortfahren

8. **AC 6.5.8: Error-Handling & Partial Success**
   - **File-Parsing Error:**
     - Catch: BadRequestException von FileParsersService
     - Re-throw mit Message: "File parsing failed: {originalError}"
   - **LLM-Call Error:**
     - Catch: NestJS Exceptions (UnauthorizedException, TooManyRequestsException, etc.)
     - Log error mit correlationId
     - Re-throw (keine neue Wrapping)
   - **JSON Parse Error:**
     - Gemini returns non-JSON string
     - Catch SyntaxError: `JSON.parse()` fails
     - Throw: `BadRequestException("Gemini API returned invalid JSON")`
   - **Validation Errors (Zod):**
     - NICHT als Exception behandeln
     - Success: false in ExtractionResultDto
     - Draft wird trotzdem gespeichert (Partial success)
   - **Database Error:**
     - Catch: TypeORM errors bei CVVersionRepository.save()
     - Throw: `InternalServerErrorException("Failed to save extraction draft")`

9. **AC 6.5.9: Correlation-ID für End-to-End Tracing**
   - Correlation-ID wird aus Request-Context extrahiert (AsyncLocalStorage oder X-Correlation-ID Header)
   - **Falls nicht vorhanden:** Generiere neue CUID: `correlationId = cuid()`
   - Correlation-ID wird in allen Logs verwendet:
     - File-Parsing Log
     - LLM-Extraction Log
     - Validation Log
     - Draft-Save Log
   - Ermöglicht End-to-End Tracing: Upload → Parse → LLM → Validate → Save

10. **AC 6.5.10: Structured Logging für Extraction Flow**
    - **Log 1: Extraction Started**
      - Level: Info
      - Message: "CV extraction started"
      - Context: { correlationId, fileName, fileSize, mimeType }
    - **Log 2: File Parsing Completed**
      - Level: Info
      - Message: "File parsing completed"
      - Context: { correlationId, textLength, parsingLatency }
    - **Log 3: LLM Extraction Completed**
      - Level: Info
      - Message: "LLM extraction completed"
      - Context: { correlationId, latency, inputTokens, outputTokens }
    - **Log 4: Validation Result**
      - Level: Info (success) oder Warn (errors)
      - Message: "CV validation completed" oder "CV validation failed"
      - Context: { correlationId, success, errorCount, errorPaths }
    - **Log 5: Draft Saved**
      - Level: Info
      - Message: "Extraction draft saved"
      - Context: { correlationId, draftId, status: 'draft', source: 'ai-extraction' }
    - **Error Logs:**
      - Level: Error
      - Context: { correlationId, step: 'parse' | 'llm' | 'validate' | 'save', error }

11. **AC 6.5.11: Integration mit ExtractionController**
    - ExtractionController (Story 6.2) ruft `ExtractionService.extractFromFile(file)` auf
    - ExtractionResultDto wird als HTTP-Response zurückgegeben:
      - Success: `HTTP 200 OK` mit `{ success: true, draftId, data }`
      - Validation Errors: `HTTP 200 OK` mit `{ success: false, errors, rawData }`
      - Exceptions: `HTTP 4xx/5xx` mit NestJS Exception-Filter

12. **AC 6.5.12: Unit-Tests für ExtractionService**
    - Test-File: `apps/backend/src/modules/extraction/services/extraction.service.spec.ts`
    - Mock-Setup: FileParsersService, GeminiService, CVVersionRepository, PinoLogger
    - **Test: extractFromFile() - Happy Path**
      - Mock: File-Parsing → Plain text, LLM → Valid JSON, Validation → Success
      - Assert: ExtractionResultDto mit `success: true`, draftId vorhanden
    - **Test: extractFromFile() - Validation Errors**
      - Mock: LLM returns JSON mit fehlenden Required Fields
      - Assert: ExtractionResultDto mit `success: false`, errors array, rawData vorhanden
      - Assert: Draft wurde trotzdem gespeichert (CVVersionRepository.save() called)
    - **Test: extractFromFile() - File-Parsing Error**
      - Mock: FileParsersService throws BadRequestException
      - Assert: Exception wird propagiert
    - **Test: extractFromFile() - LLM Timeout**
      - Mock: GeminiService throws RequestTimeoutException
      - Assert: Exception wird propagiert, no draft saved
    - **Test: extractFromFile() - Database Error**
      - Mock: CVVersionRepository.save() throws Error
      - Assert: Throws InternalServerErrorException
    - **Test: extractFromFile() - File-Hash Deduplication**
      - Mock: Existing draft mit gleichem fileHash
      - Assert: Log enthält "File already extracted", new draft wird trotzdem erstellt
    - **Test: Correlation-ID Propagation**
      - Verify: Alle Log-Calls haben selbe correlationId
    - Code-Coverage: 100% für ExtractionService

## Tasks / Subtasks

- [ ] **Task 1: ExtractionService Class Setup** (AC: 6.5.1)
  - [ ] Service-File erstellen: `apps/backend/src/modules/extraction/services/extraction.service.ts`
  - [ ] `@Injectable()` Decorator anwenden
  - [ ] Constructor Dependencies injizieren:
    - `@Inject(FileParsersService) private fileParsersService`
    - `@Inject(GeminiService) private geminiService`
    - `@Inject(CVVersionRepository) private cvVersionRepo`
    - `@InjectPinoLogger() private logger: PinoLogger`
  - [ ] Method-Signatur definieren: `async extractFromFile(file: Express.Multer.File): Promise<ExtractionResultDto>`
  - [ ] Unit-Test: Service ist injectable (DI funktioniert)

- [ ] **Task 2: ExtractionResultDto Zod Schema** (AC: 6.5.6)
  - [ ] File erstellen: `packages/shared-types/src/extraction/extraction-result.dto.ts`
  - [ ] Discriminated Union Schema:
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
        rawData: z.record(z.any()), // Partially valid JSON
      }),
    ]);
    export type ExtractionResultDto = z.infer<typeof ExtractionResultDtoSchema>;
    ```
  - [ ] Export in `packages/shared-types/src/index.ts`
  - [ ] Unit-Test: Schema validiert Success und Failure Cases

- [ ] **Task 3: File-Parsing Integration** (AC: 6.5.2)
  - [ ] extractFromFile() implementieren - Step 1: File-Parsing
    ```typescript
    const plainText = await this.fileParsersService.parseFile(
      file.buffer,
      file.mimetype
    );
    ```
  - [ ] Error-Handling: Catch FileParsersService errors
    ```typescript
    try {
      // Parse file
    } catch (error) {
      this.logger.error('File parsing failed', { correlationId, error });
      throw new BadRequestException(`File parsing failed: ${error.message}`);
    }
    ```
  - [ ] Log: "File parsing completed"
    ```typescript
    this.logger.info('File parsing completed', {
      correlationId,
      textLength: plainText.length,
      parsingLatency: Date.now() - startTime
    });
    ```
  - [ ] Unit-Test: FileParsersService.parseFile() wird aufgerufen

- [ ] **Task 4: LLM-Extraction Integration** (AC: 6.5.3)
  - [ ] extractFromFile() - Step 2: LLM-Extraction
    ```typescript
    const jsonString = await this.geminiService.extractCV(plainText);
    ```
  - [ ] Error-Handling: Propagate GeminiService exceptions (401, 429, 503, Timeout)
    - No wrapping - Re-throw as-is
  - [ ] Log: "LLM extraction completed"
    ```typescript
    this.logger.info('LLM extraction completed', {
      correlationId,
      latency: Date.now() - llmStartTime,
      // inputTokens/outputTokens logged by GeminiService
    });
    ```
  - [ ] Unit-Test: GeminiService.extractCV() wird aufgerufen mit plainText

- [ ] **Task 5: JSON Parsing & Validation** (AC: 6.5.4)
  - [ ] extractFromFile() - Step 3: JSON-Parsing
    ```typescript
    let parsedJSON: any;
    try {
      parsedJSON = JSON.parse(jsonString);
    } catch (error) {
      this.logger.error('Invalid JSON from Gemini API', { correlationId, jsonString: jsonString.substring(0, 100) });
      throw new BadRequestException('Gemini API returned invalid JSON');
    }
    ```
  - [ ] Step 4: CVSchema Validation
    ```typescript
    const validationResult = CVSchema.safeParse(parsedJSON);

    if (validationResult.success) {
      // Valid CV
      const validCV = validationResult.data;
    } else {
      // Validation errors
      const errors = validationResult.error.errors.map(err => ({
        path: err.path.map(String),
        message: err.message,
        code: err.code,
      }));
    }
    ```
  - [ ] Log: Validation result
    ```typescript
    if (validationResult.success) {
      this.logger.info('CV validation successful', { correlationId });
    } else {
      this.logger.warn('CV validation failed', {
        correlationId,
        errorCount: errors.length,
        errorPaths: errors.map(e => e.path.join('.')),
      });
    }
    ```
  - [ ] Unit-Test: CVSchema.safeParse() wird aufgerufen

- [ ] **Task 6: File-Hash Berechnung** (AC: 6.5.7)
  - [ ] Crypto-Import: `import { createHash } from 'crypto';`
  - [ ] File-Hash berechnen:
    ```typescript
    const fileHash = createHash('sha256')
      .update(file.buffer)
      .digest('hex');
    ```
  - [ ] Duplicate-Check:
    ```typescript
    const existingDraft = await this.cvVersionRepo.findOne({
      where: { fileHash, status: 'draft' },
      order: { createdAt: 'DESC' }
    });

    if (existingDraft) {
      this.logger.warn('File already extracted', {
        correlationId,
        existingDraftId: existingDraft.id,
        fileHash,
        createdAt: existingDraft.createdAt
      });
      // MVP: Continue anyway (no blocking)
    }
    ```
  - [ ] Unit-Test: File-Hash wird berechnet, Duplicate-Log wird ausgegeben

- [ ] **Task 7: Draft Version Speicherung** (AC: 6.5.5)
  - [ ] CVVersion Entity erstellen:
    ```typescript
    const draftVersion = this.cvVersionRepo.create({
      cvId: 1, // Single-user system
      data: JSON.stringify(parsedJSON), // Even if validation failed
      status: 'draft',
      source: 'ai-extraction',
      fileHash: fileHash,
    });
    ```
  - [ ] Save to DB:
    ```typescript
    const savedDraft = await this.cvVersionRepo.save(draftVersion);
    ```
  - [ ] Error-Handling:
    ```typescript
    try {
      const savedDraft = await this.cvVersionRepo.save(draftVersion);
    } catch (error) {
      this.logger.error('Failed to save extraction draft', { correlationId, error });
      throw new InternalServerErrorException('Failed to save extraction draft');
    }
    ```
  - [ ] Log: "Draft saved"
    ```typescript
    this.logger.info('Extraction draft saved', {
      correlationId,
      draftId: savedDraft.id,
      status: 'draft',
      source: 'ai-extraction',
    });
    ```
  - [ ] Unit-Test: CVVersionRepository.save() wird aufgerufen

- [ ] **Task 8: ExtractionResultDto Return Value** (AC: 6.5.6)
  - [ ] **Success Case:**
    ```typescript
    if (validationResult.success) {
      return {
        success: true,
        draftId: savedDraft.id,
        data: validationResult.data,
      };
    }
    ```
  - [ ] **Validation Error Case:**
    ```typescript
    return {
      success: false,
      errors: errors,
      rawData: parsedJSON,
    };
    ```
  - [ ] Unit-Test: Verify return type matches ExtractionResultDtoSchema

- [ ] **Task 9: Correlation-ID Implementation** (AC: 6.5.9)
  - [ ] Method: `private getCorrelationId(): string`
    ```typescript
    private getCorrelationId(): string {
      // Try to get from AsyncLocalStorage (Request-Context)
      // Fallback: Generate new CUID
      return this.requestContext?.correlationId || cuid();
    }
    ```
  - [ ] Alle Logs nutzen correlationId:
    ```typescript
    const correlationId = this.getCorrelationId();
    this.logger.info('CV extraction started', { correlationId, ... });
    ```
  - [ ] Unit-Test: Correlation-ID ist konsistent in allen Logs

- [ ] **Task 10: Structured Logging Implementation** (AC: 6.5.10)
  - [ ] **Log 1:** Extraction Started
  - [ ] **Log 2:** File Parsing Completed
  - [ ] **Log 3:** LLM Extraction Completed
  - [ ] **Log 4:** Validation Result
  - [ ] **Log 5:** Draft Saved
  - [ ] Error Logs: Mit Step-Context (parse, llm, validate, save)
  - [ ] Unit-Test: Logger.info/warn/error werden mit korrekten Context-Objekten aufgerufen

- [ ] **Task 11: Error-Handling für alle Failure-Cases** (AC: 6.5.8)
  - [ ] File-Parsing Error: Catch & Re-throw BadRequestException
  - [ ] LLM-Call Error: Propagate as-is (401, 429, 503, Timeout)
  - [ ] JSON Parse Error: Throw BadRequestException
  - [ ] Validation Errors: Return success: false (NOT exception)
  - [ ] Database Error: Throw InternalServerErrorException
  - [ ] Unit-Tests für jeden Error-Case

- [ ] **Task 12: ExtractionController Integration** (AC: 6.5.11)
  - [ ] ExtractionController.extract() ruft ExtractionService auf:
    ```typescript
    const result = await this.extractionService.extractFromFile(file);
    return result; // HTTP 200 OK
    ```
  - [ ] Exception-Filter mapped zu HTTP-Codes:
    - BadRequestException → 400
    - UnauthorizedException → 401
    - TooManyRequestsException → 429
    - InternalServerErrorException → 500
  - [ ] Unit-Test: Controller ruft Service auf, returned DTO

- [ ] **Task 13: Unit-Tests für ExtractionService** (AC: 6.5.12)
  - [ ] Test-File: `extraction.service.spec.ts`
  - [ ] Mock-Setup: FileParsersService, GeminiService, CVVersionRepository, PinoLogger
  - [ ] **Test: Happy Path**
    - Mock: File-Parsing → Plain text
    - Mock: Gemini → Valid JSON Resume
    - Mock: CVVersionRepository.save() → Saved draft
    - Assert: ExtractionResultDto mit success: true, draftId
  - [ ] **Test: Validation Errors**
    - Mock: Gemini → Invalid JSON (missing required fields)
    - Assert: ExtractionResultDto mit success: false, errors, rawData
    - Assert: CVVersionRepository.save() called (draft saved anyway)
  - [ ] **Test: File-Parsing Error**
    - Mock: FileParsersService throws BadRequestException
    - Assert: Exception propagated
  - [ ] **Test: LLM Timeout**
    - Mock: GeminiService throws RequestTimeoutException
    - Assert: Exception propagated, no draft saved
  - [ ] **Test: Database Error**
    - Mock: CVVersionRepository.save() throws Error
    - Assert: InternalServerErrorException thrown
  - [ ] **Test: File-Hash Deduplication**
    - Mock: Existing draft mit gleichem fileHash
    - Assert: Log "File already extracted", new draft created anyway
  - [ ] **Test: Correlation-ID Propagation**
    - Verify: Alle Logger.info/warn/error Calls haben selbe correlationId
  - [ ] Code-Coverage: 100%

- [ ] **Task 14: ExtractionModule Provider Registration** (AC: 6.5.1)
  - [ ] ExtractionModule: Add ExtractionService zu Providers
  - [ ] Verify: All dependencies (FileParsersService, GeminiService, CVVersionRepository) sind importiert
  - [ ] Module-Test: ExtractionService ist injectable
  - [ ] `pnpm build` läuft ohne Errors

## Dev Notes

### Architektur-Kontext

**Orchestration Pattern:**

ExtractionService implementiert das **Orchestrator-Pattern** für den Extraction-Flow:

```
┌─────────────────────────────────────────────────────────────┐
│ ExtractionService (Orchestrator)                            │
├─────────────────────────────────────────────────────────────┤
│ 1. File-Parsing    → FileParsersService.parseFile()         │
│ 2. LLM-Extraction  → GeminiService.extractCV()              │
│ 3. JSON-Parsing    → JSON.parse()                           │
│ 4. Validation      → CVSchema.safeParse()                   │
│ 5. Hash-Check      → CVVersionRepository.findOne()          │
│ 6. Draft-Save      → CVVersionRepository.save()             │
│ 7. Response        → ExtractionResultDto                    │
└─────────────────────────────────────────────────────────────┘
```

**Warum Orchestration?**

1. **Single Responsibility:** Jeder Service hat eine klare Aufgabe
   - FileParsersService: Buffer → Plain Text
   - GeminiService: Plain Text → JSON String
   - ExtractionService: Flow-Koordination + Validation + Persistence
2. **Testability:** Services können einzeln gemockt werden
3. **Flexibility:** LLM-Provider kann ausgetauscht werden (Gemini → OpenAI) ohne ExtractionService zu ändern
4. **Error-Handling:** Zentrale Fehlerbehandlung im Orchestrator

**Workflow-Position:**

Story 6.5 ist das **Kernelement** von Epic 6:
- ✅ Story 6.1: Upload-Interface (Frontend)
- ✅ Story 6.2: Backend Upload-Endpoint + Rate-Limiting
- ✅ Story 6.3: File-Parsers (PDF, Markdown, Text)
- ✅ Story 6.4: Gemini API-Integration
- **→ Story 6.5: Orchestration + Validation (CORE)**
- ⏸️ Story 6.6: Review-Interface (Frontend)
- ⏸️ Story 6.7-6.12: Weiteres (Versionierung, Rollback, etc.)

### Validation Strategy

**Partial Success Pattern:**

ExtractionService nutzt **Partial Success** für Validation-Errors:

- ❌ **NICHT:** Exception werfen bei Zod-Validation-Errors
- ✅ **STATTDESSEN:** Draft speichern + Errors in Response zurückgeben

**Warum?**

1. **User-Experience:** Gemini kann 90% korrekt extrahieren, aber 10% haben Fehler
   - User kann Errors manuell fixen statt komplett neu hochzuladen
2. **Kosten-Optimierung:** LLM-Call war teuer (Tokens), nicht verschwenden
3. **Iterative Verbesserung:** Draft ist Ausgangspunkt für manuelle Korrektur

**ExtractionResultDto Design:**

```typescript
// Discriminated Union ermöglicht Type-Safety
type ExtractionResultDto =
  | { success: true; draftId: number; data: CV }
  | { success: false; errors: ZodError[]; rawData: any };

// Frontend kann Type-Guard nutzen:
if (result.success) {
  // TypeScript weiß: result.data ist CV
  const cv = result.data;
} else {
  // TypeScript weiß: result.errors ist ZodError[]
  const errors = result.errors;
}
```

### Zod Validation Details

**CVSchema.safeParse() vs parse():**

- ✅ **safeParse():** Returned `{ success: boolean, data?: CV, error?: ZodError }`
  - Wirft KEINE Exception
  - Ermöglicht Partial Success Pattern
- ❌ **parse():** Wirft Exception bei Validation-Error
  - Würde Draft-Speicherung verhindern

**Error-Formatting:**

Zod errors müssen für Frontend aufbereitet werden:

```typescript
const errors = validationResult.error.errors.map(err => ({
  path: err.path.map(String), // ['work', 0, 'startDate']
  message: err.message,        // "Invalid datetime string!"
  code: err.code,              // "invalid_string"
}));
```

**Warum wichtig:**

- Frontend DiffViewer (Story 6.6) muss Errors anzeigen
- Error-Path zeigt, welches Feld fehlerhaft ist
- Error-Message erklärt Problem
- Error-Code ermöglicht programmgesteuerte Behandlung

### File-Hash Deduplication

**SHA-256 Hash für Duplicate-Detection:**

```typescript
const fileHash = createHash('sha256')
  .update(file.buffer)
  .digest('hex');
```

**Warum SHA-256?**

- ✅ Kryptografisch sicher (Kollisionen praktisch unmöglich)
- ✅ Schnell (< 10ms für 10MB File)
- ✅ Standard (Node.js crypto builtin)

**Deduplication-Strategie (MVP):**

- **Check:** Existiert Draft mit gleichem fileHash?
- **Falls ja:** Log "File already extracted" → **Continue anyway**
- **Falls nein:** Normal fortfahren

**Warum nicht blockieren?**

1. User könnte absichtlich neu extrahieren (LLM-Modell verbessert)
2. Previous draft könnte Validation-Errors haben (User will re-try)
3. Complexity niedrig halten (keine UI für "Use existing draft?")

**Growth Feature:**

- Frontend zeigt Warnung: "You uploaded this file on [date]. Use existing draft?"
- User kann wählen: "Use existing" vs. "Extract again"

### Structured Logging & Tracing

**Correlation-ID Pattern:**

```
Upload Request (X-Correlation-ID: abc-123)
  ↓
ExtractionController
  ↓ correlationId: abc-123
ExtractionService
  ├─► FileParsersService (Log: correlationId: abc-123)
  ├─► GeminiService (Log: correlationId: abc-123)
  └─► CVVersionRepository (Log: correlationId: abc-123)
```

**Implementierung:**

1. **Request-Context:** NestJS AsyncLocalStorage oder Custom Interceptor
2. **Header-Fallback:** X-Correlation-ID Header (falls gesetzt)
3. **Auto-Generate:** CUID falls nicht vorhanden

**Log-Beispiele:**

```json
// Log 1: Extraction Started
{
  "level": "info",
  "timestamp": "2025-11-08T10:30:00Z",
  "message": "CV extraction started",
  "context": {
    "correlationId": "abc-123",
    "fileName": "john-doe-cv.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf"
  }
}

// Log 2: File Parsing Completed
{
  "level": "info",
  "timestamp": "2025-11-08T10:30:02Z",
  "message": "File parsing completed",
  "context": {
    "correlationId": "abc-123",
    "textLength": 5000,
    "parsingLatency": 2000
  }
}

// Log 3: LLM Extraction Completed
{
  "level": "info",
  "timestamp": "2025-11-08T10:30:28Z",
  "message": "LLM extraction completed",
  "context": {
    "correlationId": "abc-123",
    "latency": 26000,
    "inputTokens": 5000,
    "outputTokens": 3200
  }
}

// Log 4: Validation Failed
{
  "level": "warn",
  "timestamp": "2025-11-08T10:30:28Z",
  "message": "CV validation failed",
  "context": {
    "correlationId": "abc-123",
    "success": false,
    "errorCount": 3,
    "errorPaths": ["work.0.startDate", "skills.2.name", "basics.email"]
  }
}

// Log 5: Draft Saved
{
  "level": "info",
  "timestamp": "2025-11-08T10:30:29Z",
  "message": "Extraction draft saved",
  "context": {
    "correlationId": "abc-123",
    "draftId": 42,
    "status": "draft",
    "source": "ai-extraction"
  }
}
```

**Warum wichtig:**

- **Debugging:** Bei Error → Alle Logs eines Flows filtern nach correlationId
- **Performance-Analysis:** Latency pro Step (File-Parse: 2s, LLM: 26s, Validation: <1s)
- **Cost-Tracking:** Input/Output-Tokens für Gemini API
- **Reliability-Monitoring:** Success-Rate, Error-Rate pro Step

### Error-Handling Strategy

**Error-Kategorien:**

| Error-Type | Source | Action | HTTP-Code | Draft-Saved? |
|------------|--------|--------|-----------|--------------|
| **File-Parsing Error** | FileParsersService | Re-throw BadRequestException | 400 | ❌ No |
| **LLM-API Error (401)** | GeminiService | Propagate UnauthorizedException | 401 | ❌ No |
| **LLM-API Error (429)** | GeminiService | Propagate TooManyRequestsException | 429 | ❌ No |
| **LLM-Timeout** | GeminiService | Propagate RequestTimeoutException | 408 | ❌ No |
| **Invalid JSON** | JSON.parse() | Throw BadRequestException | 400 | ❌ No |
| **Validation Errors** | CVSchema.safeParse() | Return success: false | 200 OK | ✅ **Yes** |
| **Database Error** | CVVersionRepository | Throw InternalServerErrorException | 500 | ❌ No |

**Warum Validation Errors NICHT als Exception?**

- **Partial Success:** Draft ist trotzdem wertvoll (90% korrekt)
- **User-Friendly:** User kann Errors fixen statt komplett neu hochzuladen
- **HTTP 200:** Request war erfolgreich (Extraktion lief durch), nur Validation fehlgeschlagen

**Exception-Hierarchie:**

```
NestJS HttpException
├─► BadRequestException (400)
│   ├─► "File parsing failed: {error}"
│   └─► "Gemini API returned invalid JSON"
│
├─► UnauthorizedException (401)
│   └─► "Invalid Gemini API key" (von GeminiService)
│
├─► RequestTimeoutException (408)
│   └─► "Gemini API request timed out" (von GeminiService)
│
├─► TooManyRequestsException (429)
│   └─► "Gemini API rate limit exceeded" (von GeminiService)
│
└─► InternalServerErrorException (500)
    └─► "Failed to save extraction draft"
```

### Performance Considerations

**Latency-Budget:**

| Step | Typical | Max | Target |
|------|---------|-----|--------|
| **File-Parsing** | <2s | 5s | P95 < 3s |
| **LLM-Extraction** | 15-30s | 60s | P95 < 30s |
| **Validation** | <100ms | 500ms | P95 < 200ms |
| **Draft-Save** | <100ms | 500ms | P95 < 200ms |
| **TOTAL** | ~20s | 60s | **P95 < 45s** |

**Warum wichtig:**

- User-Erfahrung: 45s ist akzeptabel für automatische Extraktion (vs. Stunden manuell)
- LLM ist Bottleneck (15-30s typical)
- File-Parsing optimiert (pdf-parse ist schnell)

**Optimierung (Growth):**

- **Streaming:** Gemini streaming für frühere UI-Feedback
- **Caching:** Hash-Check könnte Draft zurückgeben (skip LLM)
- **Async Processing:** Job-Queue für LLM-Calls (user-friendly status updates)

### Integration Points

**Upstream (Consumer):**

- **ExtractionController (Story 6.2):**
  - Ruft `ExtractionService.extractFromFile(file)` auf
  - Erhält ExtractionResultDto
  - Returned als HTTP-Response

**Downstream (Dependencies):**

- **FileParsersService (Story 6.3):**
  - Input: File buffer + mimetype
  - Output: Plain text string
  - Errors: BadRequestException

- **GeminiService (Story 6.4):**
  - Input: Plain text
  - Output: JSON string
  - Errors: UnauthorizedException, TooManyRequestsException, RequestTimeoutException

- **CVVersionRepository (TypeORM):**
  - Input: CVVersion entity
  - Output: Saved entity mit ID
  - Errors: TypeORM exceptions

**CVSchema (Zod):**
  - Input: Parsed JSON object
  - Output: `{ success: boolean, data?: CV, error?: ZodError }`
  - No exceptions

### Learnings from Previous Story

**From Story 6-4 (Gemini API Integration):**

Story 6-4 ist "drafted" (noch nicht implementiert).

**Relevant Context für Story 6.5:**

**1. GeminiService Interface:**

- Methode: `async extractCV(plainText: string): Promise<string>`
- Input: Plain text (von FileParsersService)
- Output: JSON string (für JSON.parse())
- Exceptions: UnauthorizedException (401), TooManyRequestsException (429), RequestTimeoutException (60s), InternalServerErrorException

**2. Error-Handling etabliert:**

- GeminiService wirft spezifische NestJS Exceptions
- ExtractionService sollte diese propagieren (keine neue Wrapping)
- Nur bei JSON.parse() Error → neue BadRequestException

**3. Logging-Pattern:**

- GeminiService logged bereits:
  - "Gemini API call started"
  - "Gemini API call completed"
  - "Gemini API call failed"
- ExtractionService fügt hinzu:
  - "CV extraction started"
  - "File parsing completed"
  - "CV validation completed"
  - "Extraction draft saved"

**4. Correlation-ID:**

- GeminiService nutzt bereits correlationId in Logs
- ExtractionService muss selbe correlationId weitergeben
- AsyncLocalStorage oder Method-Parameter

**5. Retry-Logic:**

- GeminiService hat bereits Retry (3 Attempts) bei 503, 429
- ExtractionService muss **keine** zusätzliche Retry-Logik implementieren
- Timeouts (60s) sind in GeminiService handled

**6. Token-Tracking:**

- GeminiService logged inputTokens, outputTokens
- ExtractionService muss diese Metrics **nicht** erneut loggen
- Nur "LLM extraction completed" Log mit Latency

### References

- [Source: docs/tech-spec-epic-6.md - Section: Services and Modules - ExtractionService]
- [Source: docs/tech-spec-epic-6.md - Section: Workflows and Sequencing - Workflow 1: CV Extraction]
- [Source: docs/tech-spec-epic-6.md - Section: Acceptance Criteria - AC-2.x: LLM Extraction Funktionalität]
- [Source: docs/tech-spec-epic-6.md - Section: Data Models and Contracts - ExtractionResultDto]
- [Source: docs/tech-spec-epic-6.md - Section: Data Models and Contracts - CVVersion Entity]
- [Source: docs/PRD.md - FR-5: KI-gestützte CV-Daten-Extraktion]
- [Source: docs/architecture.md - Backend Stack - NestJS, TypeORM, Zod]
- [Source: docs/stories/6-4-gemini-api-integration-mit-google-genai-sdk.md - GeminiService Interface]
- [Source: packages/shared-types/src/cv/cv.schema.ts - CVSchema (Zod)]
- [Source: Node.js crypto - createHash() für SHA-256]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

**Learnings from Previous Story:**

Story 6-4 (gemini-api-integration-mit-google-genai-sdk) ist im Status "drafted" - noch nicht implementiert.

**Relevant für Story 6.5:**

- **GeminiService Interface:** `extractCV(plainText: string): Promise<string>` - Input: Plain text, Output: JSON string
- **Error-Handling:** GeminiService wirft NestJS Exceptions (UnauthorizedException, TooManyRequestsException, RequestTimeoutException) - ExtractionService sollte diese propagieren ohne Wrapping
- **Logging-Pattern:** GeminiService logged bereits API-Calls mit correlationId - ExtractionService fügt Orchestration-Logs hinzu
- **Retry-Logic:** GeminiService implementiert bereits Retry (3 Attempts) - ExtractionService muss keine zusätzliche Retry-Logik implementieren
- **Performance:** GeminiService Latency: <30s typical, 60s max Timeout - ExtractionService Total-Latency-Ziel: <45s P95

### File List
