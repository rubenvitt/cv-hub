# Story 6.4: Gemini API Integration mit @google/genai SDK

Status: drafted

## Story

Als Backend-Entwickler,
möchte ich Google Gemini 2.0 Flash für CV-Extraktion nutzen,
damit unstrukturierte Text-Daten in strukturiertes JSON Resume Schema konvertiert werden.

## Acceptance Criteria

1. **AC 6.4.1: @google/genai Package Installation**
   - NPM-Package `@google/genai` Version >=1.28.0 in `apps/backend` installiert
   - Type-Definitions sind vorhanden (package beinhaltet TypeScript-Typen)
   - Verify: `pnpm list @google/genai` zeigt korrekte Version >=1.28.0
   - Package baut erfolgreich: `pnpm build` in backend workspace

2. **AC 6.4.2: GeminiService Class erstellt**
   - Service-Klasse `GeminiService` in `apps/backend/src/modules/extraction/services/gemini.service.ts`
   - Injectable als Provider im ExtractionModule
   - Constructor injiziert PinoLogger (`@InjectPinoLogger()`)
   - Hauptmethode: `async extractCV(plainText: string): Promise<string>` - Input: Plain text, Output: JSON string
   - TypeScript strict mode kompatibel

3. **AC 6.4.3: Gemini 2.0 Flash Model Konfiguration**
   - Model-ID: `gemini-2.0-flash-001` (neuestes Flash-Modell)
   - generationConfig konfiguriert:
     - `temperature: 0.2` (niedrig für konsistente Outputs)
     - `maxOutputTokens: 8192` (genug für komplexe CVs)
   - GoogleGenerativeAI Client initialisiert mit API-Key aus Environment
   - API-Key wird via ConfigService geladen: `GEMINI_API_KEY`

4. **AC 6.4.4: Environment-Variable Dokumentation**
   - `GEMINI_API_KEY` in `.env.example` dokumentiert mit Kommentar
   - Kommentar erklärt: Wo API-Key erhältlich (Google AI Studio), Format (String), Required
   - ConfigService validiert Existenz von `GEMINI_API_KEY` beim Startup
   - Fehlende API-Key → Startup-Fehler mit klarer Message: "GEMINI_API_KEY environment variable is required"

5. **AC 6.4.5: Prompt-Template für JSON Resume Schema-Extraktion**
   - Prompt-Template erstellt als private Methode: `private buildExtractionPrompt(plainText: string): string`
   - Template beinhaltet:
     - System-Instruction: "You are a CV data extractor. Convert unstructured CV text to JSON Resume Schema."
     - JSON Resume Schema-Definition (vollständiges Schema als Beispiel)
     - cv-hub Extensions dokumentiert: `isPrivate`, `metrics`, `entity`
     - Klarstellung: Nur extrahieren, NICHT erfinden
     - Output-Format: "Return ONLY valid JSON, no markdown, no explanations"
   - Plain text wird in Prompt eingebettet mit klar definierten Boundaries
   - Prompt-Template ist in separater Konstante (z.B. `EXTRACTION_PROMPT_TEMPLATE`) für Wartbarkeit

6. **AC 6.4.6: Timeout-Handling (60s Hard Timeout)**
   - Methode nutzt `AbortController` mit 60s Timeout
   - Wenn Gemini API nicht innerhalb 60s antwortet → Timeout-Error
   - Error-Type: `RequestTimeoutException` mit Message: "Gemini API request timed out after 60 seconds"
   - Timeout ist konfigurierbar via Environment-Variable: `GEMINI_TIMEOUT_MS` (default: 60000)

7. **AC 6.4.7: Retry-Logic mit Exponential Backoff**
   - Retry-Strategie: 3 Versuche total (1 initial + 2 retries)
   - Exponential Backoff: 1s, 2s, 4s (Delays zwischen Versuchen)
   - Retry-würdige Errors: 503 (Service Unavailable), 429 (Rate Limit), Network Errors
   - NICHT retry-würdig: 401 (Invalid API Key), 400 (Bad Request), Timeout-Errors
   - Implementierung via Helper-Funktion: `private async retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts: number): Promise<T>`
   - Logs zeigen Retry-Attempts: "Gemini API call failed, retrying... (attempt X/3)"

8. **AC 6.4.8: Error-Handling für verschiedene Failure-Cases**
   - **401 Unauthorized:** API-Key invalid → `UnauthorizedException("Invalid Gemini API key")`
   - **429 Rate Limit:** Quota exceeded → Retry mit Backoff, nach 3 Attempts → `TooManyRequestsException("Gemini API rate limit exceeded")`
   - **503 Service Unavailable:** Gemini down → Retry mit Backoff, nach 3 Attempts → `ServiceUnavailableException("Gemini API is temporarily unavailable")`
   - **Timeout:** >60s keine Response → `RequestTimeoutException("Gemini API request timed out")`
   - **Invalid JSON Response:** Gemini returned non-JSON → `BadRequestException("Gemini API returned invalid JSON")`
   - **Network Errors:** Connection issues → Retry, dann → `InternalServerErrorException("Network error contacting Gemini API")`
   - Alle Errors werden mit Pino Logger geloggt (Error-Level) mit Context: correlationId, model, attempt, error message

9. **AC 6.4.9: Structured Logging für Gemini API-Calls**
   - **Log beim Start:** Info-Level, Message: "Gemini API call started", Context: { correlationId, inputLength (chars), model: 'gemini-2.0-flash-001' }
   - **Log bei Success:** Info-Level, Message: "Gemini API call completed", Context: { correlationId, latency (ms), inputTokens, outputTokens, success: true }
   - **Log bei Error:** Error-Level, Message: "Gemini API call failed", Context: { correlationId, attempt, error, latency }
   - Latency-Messung: `performance.now()` vor/nach API-Call
   - Token-Counts aus Gemini-Response extrahieren: `response.usageMetadata.promptTokenCount`, `response.usageMetadata.candidatesTokenCount`

10. **AC 6.4.10: Unit-Tests mit Mock-Responses**
    - Test-File: `apps/backend/src/modules/extraction/services/gemini.service.spec.ts`
    - Mock-Setup: `GoogleGenerativeAI` Client wird gemockt
    - **Test: extractCV() - Success Case**
      - Input: Plain text (Beispiel-CV-Text)
      - Mock-Response: Valides JSON Resume (aus Fixture)
      - Assert: Output ist String, parst als JSON, matcht Expected-Structure
    - **Test: extractCV() - Timeout**
      - Mock: API-Call hängt >60s
      - Assert: Throws `RequestTimeoutException` mit korrekter Message
    - **Test: extractCV() - Invalid API Key (401)**
      - Mock: API returns 401 Error
      - Assert: Throws `UnauthorizedException` mit "Invalid Gemini API key"
    - **Test: extractCV() - Retry on 503**
      - Mock: First 2 calls return 503, 3rd call succeeds
      - Assert: Success nach 3 Attempts, Logs zeigen 2 Retries
    - **Test: extractCV() - Rate Limit Exhausted (429)**
      - Mock: All 3 calls return 429
      - Assert: Throws `TooManyRequestsException` nach 3 Attempts
    - **Test: extractCV() - Invalid JSON Response**
      - Mock: API returns "This is not JSON"
      - Assert: Throws `BadRequestException` mit "invalid JSON" Message
    - Code-Coverage: 100% für GeminiService

## Tasks / Subtasks

- [ ] **Task 1: NPM-Dependency Installation** (AC: 6.4.1)
  - [ ] `pnpm add @google/genai --filter @cv-hub/backend`
  - [ ] Verify: `pnpm list @google/genai` zeigt Version >=1.28.0
  - [ ] Check TypeScript-Types: Import `{ GoogleGenerativeAI }` ohne Errors
  - [ ] Update `apps/backend/package.json` mit Dependency

- [ ] **Task 2: GeminiService Class Setup** (AC: 6.4.2)
  - [ ] Service-File erstellen: `apps/backend/src/modules/extraction/services/gemini.service.ts`
  - [ ] `@Injectable()` Decorator anwenden
  - [ ] Constructor mit PinoLogger und ConfigService injizieren
  - [ ] TypeScript-Interface für Methoden-Signaturen definieren
  - [ ] Unit-Test: Service ist injectable (NestJS DI funktioniert)

- [ ] **Task 3: Gemini Client Initialisierung** (AC: 6.4.3)
  - [ ] Constructor: GoogleGenerativeAI Client instantiieren
  - [ ] API-Key laden: `this.configService.get<string>('GEMINI_API_KEY', { infer: true })`
  - [ ] Model-Instanz erstellen: `this.client.getGenerativeModel({ model: 'gemini-2.0-flash-001' })`
  - [ ] generationConfig setzen: `{ temperature: 0.2, maxOutputTokens: 8192 }`
  - [ ] Unit-Test: GoogleGenerativeAI wird mit korrektem API-Key initialisiert

- [ ] **Task 4: Environment-Variable Setup** (AC: 6.4.4)
  - [ ] `.env.example` update: `GEMINI_API_KEY=your_api_key_here # Get from https://aistudio.google.com/app/apikey`
  - [ ] ConfigModule Validation: `GEMINI_API_KEY` als required in `env.validation.ts`
  - [ ] Startup-Validation: Fehlende Key → Exception mit klarer Message
  - [ ] `.env.local` File für lokales Development: GEMINI_API_KEY eintragen (nicht committen!)

- [ ] **Task 5: Prompt-Template Design** (AC: 6.4.5)
  - [ ] Konstante definieren: `EXTRACTION_PROMPT_TEMPLATE` in separatem File (z.B. `prompts/extraction.prompt.ts`)
  - [ ] Template-String erstellen mit Placeholders: `{{plainText}}`
  - [ ] System-Instruction formulieren:
    - "You are a precise CV data extractor."
    - "Convert the following unstructured CV text into JSON Resume Schema format."
    - "ONLY extract information present in the text. Do NOT invent or assume data."
    - "Return ONLY valid JSON. No markdown, no code blocks, no explanations."
  - [ ] JSON Resume Schema-Beispiel in Prompt einbetten (vollständiges Schema mit allen Feldern)
  - [ ] cv-hub Extensions dokumentieren: `isPrivate` (boolean), `metrics` (string), `entity` (string)
  - [ ] Output-Format-Instruction: "Your response must be parseable by JSON.parse()."
  - [ ] Method `buildExtractionPrompt(plainText: string): string` implementieren
    - Template laden
    - `{{plainText}}` ersetzen mit actual Input
    - Return fertigen Prompt
  - [ ] Unit-Test: buildExtractionPrompt() produziert validen Prompt-String

- [ ] **Task 6: extractCV() Hauptmethode Implementation** (AC: 6.4.2, 6.4.6)
  - [ ] Method-Signatur: `async extractCV(plainText: string): Promise<string>`
  - [ ] Input-Validation: `if (!plainText || plainText.trim().length < 10)` → `BadRequestException('Input text too short')`
  - [ ] Prompt generieren: `const prompt = this.buildExtractionPrompt(plainText)`
  - [ ] AbortController setup für Timeout:
    ```typescript
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    ```
  - [ ] Gemini API-Call: `this.model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], signal: controller.signal })`
  - [ ] Timeout-Error catchen: `if (error.name === 'AbortError')` → `RequestTimeoutException`
  - [ ] Cleanup: `clearTimeout(timeoutId)` in finally-Block
  - [ ] Response-Extraktion: `const jsonString = response.response.text()`
  - [ ] Return: `jsonString`

- [ ] **Task 7: Retry-Logic mit Exponential Backoff** (AC: 6.4.7)
  - [ ] Helper-Method: `private async retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T>`
  - [ ] Loop: `for (let attempt = 1; attempt <= maxAttempts; attempt++)`
  - [ ] Try-Catch: Bei Error → Check if retry-worthy (503, 429, Network)
  - [ ] Backoff Delay: `const delay = Math.pow(2, attempt - 1) * 1000` (1s, 2s, 4s)
  - [ ] Sleep: `await new Promise(resolve => setTimeout(resolve, delay))`
  - [ ] Log Retry: `this.logger.warn('Retrying Gemini API call...', { attempt, maxAttempts })`
  - [ ] Letzter Attempt fehlschlägt → Re-throw Error
  - [ ] extractCV() nutzt retryWithBackoff: `return this.retryWithBackoff(() => this.callGeminiAPI(prompt))`
  - [ ] Unit-Test: Mock 503 → 503 → Success (2 Retries, dann Erfolg)

- [ ] **Task 8: Error-Handling für alle Failure-Cases** (AC: 6.4.8)
  - [ ] Try-Catch um Gemini API-Call
  - [ ] **401 Unauthorized:**
    - Check: `error.status === 401` oder `error.message.includes('API key')`
    - Throw: `new UnauthorizedException('Invalid Gemini API key. Please check GEMINI_API_KEY environment variable.')`
  - [ ] **429 Rate Limit:**
    - Check: `error.status === 429`
    - Retry mit Backoff
    - Nach 3 Attempts: `new TooManyRequestsException('Gemini API rate limit exceeded. Please try again later.')`
  - [ ] **503 Service Unavailable:**
    - Check: `error.status === 503`
    - Retry mit Backoff
    - Nach 3 Attempts: `new ServiceUnavailableException('Gemini API is temporarily unavailable.')`
  - [ ] **Timeout:**
    - Check: `error.name === 'AbortError'`
    - Throw: `new RequestTimeoutException('Gemini API request timed out after 60 seconds.')`
  - [ ] **Invalid JSON:**
    - Nach API-Response: Try `JSON.parse(jsonString)`
    - Catch SyntaxError → `new BadRequestException('Gemini API returned invalid JSON. Response: ' + jsonString.substring(0, 100))`
  - [ ] **Network Errors:**
    - Check: `error.code === 'ECONNREFUSED'` oder `error.message.includes('network')`
    - Retry mit Backoff
    - Nach 3 Attempts: `new InternalServerErrorException('Network error contacting Gemini API.')`
  - [ ] Default Case: `new InternalServerErrorException('Unexpected error during Gemini API call.')`
  - [ ] Alle Errors loggen: `this.logger.error('Gemini API call failed', { error, correlationId, attempt })`

- [ ] **Task 9: Structured Logging Integration** (AC: 6.4.9)
  - [ ] **Start-Log:** Vor API-Call
    ```typescript
    this.logger.info('Gemini API call started', {
      correlationId: this.getCorrelationId(),
      inputLength: plainText.length,
      model: 'gemini-2.0-flash-001'
    });
    ```
  - [ ] **Success-Log:** Nach erfolgreichem API-Call
    ```typescript
    this.logger.info('Gemini API call completed', {
      correlationId,
      latency: endTime - startTime,
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
      success: true
    });
    ```
  - [ ] **Error-Log:** In Catch-Block
    ```typescript
    this.logger.error('Gemini API call failed', {
      correlationId,
      attempt,
      error: error.message,
      latency: Date.now() - startTime
    });
    ```
  - [ ] Latency-Messung: `const startTime = performance.now(); ... const endTime = performance.now();`
  - [ ] Correlation-ID aus Request-Context extrahieren (AsyncLocalStorage oder Header)
  - [ ] Unit-Test: Logger wird mit korrekten Context-Objekten aufgerufen (Mock PinoLogger)

- [ ] **Task 10: Timeout-Configuration via Environment** (AC: 6.4.6)
  - [ ] `.env.example` update: `GEMINI_TIMEOUT_MS=60000 # Timeout in milliseconds (default: 60s)`
  - [ ] ConfigService laden: `const timeout = this.configService.get<number>('GEMINI_TIMEOUT_MS', 60000);`
  - [ ] setTimeout nutzt config: `setTimeout(() => controller.abort(), timeout);`
  - [ ] Unit-Test: Timeout respektiert Environment-Variable

- [ ] **Task 11: Unit-Tests für GeminiService** (AC: 6.4.10)
  - [ ] Test-File erstellen: `apps/backend/src/modules/extraction/services/gemini.service.spec.ts`
  - [ ] Test-Setup:
    - Mock GoogleGenerativeAI Client
    - Mock ConfigService (returns API-Key)
    - Mock PinoLogger
  - [ ] **Test: extractCV() - Success Case**
    - Setup: Mock `generateContent()` returns valides JSON Resume
    - Input: Plain text (Beispiel: "John Doe, Full-Stack Engineer...")
    - Expected: Output ist JSON-String, parst erfolgreich, enthält Expected-Felder
  - [ ] **Test: extractCV() - Timeout Error**
    - Setup: Mock hängt >60s (via AbortSignal)
    - Expected: Throws `RequestTimeoutException` mit Message "timed out after 60 seconds"
  - [ ] **Test: extractCV() - Invalid API Key (401)**
    - Setup: Mock throws Error mit status 401
    - Expected: Throws `UnauthorizedException` mit Message "Invalid Gemini API key"
  - [ ] **Test: extractCV() - Retry on 503**
    - Setup: Mock returns 503, 503, dann Success (3 Attempts total)
    - Expected: Success nach 3 Calls, Logs zeigen 2 Retry-Messages
  - [ ] **Test: extractCV() - Rate Limit Exhausted (429)**
    - Setup: Mock returns 429 for all 3 attempts
    - Expected: Throws `TooManyRequestsException` mit Message "rate limit exceeded"
  - [ ] **Test: extractCV() - Invalid JSON Response**
    - Setup: Mock returns "This is not JSON, just plain text"
    - Expected: Throws `BadRequestException` mit Message "invalid JSON"
  - [ ] **Test: buildExtractionPrompt() - Prompt Construction**
    - Input: Plain text "Sample CV Text"
    - Expected: Prompt enthält "Sample CV Text", JSON Resume Schema, System-Instructions
  - [ ] **Test: Logger Calls**
    - Verify: Logger.info() called mit "Gemini API call started"
    - Verify: Logger.info() called mit "Gemini API call completed" bei Success
    - Verify: Logger.error() called bei Failure
  - [ ] Code-Coverage: 100% für GeminiService (Jest Coverage-Report)

- [ ] **Task 12: ExtractionModule Integration** (AC: 6.4.2)
  - [ ] `GeminiService` zu ExtractionModule Providers hinzufügen
  - [ ] Import in ExtractionService vorbereiten (Story 6.5 wird nutzen)
  - [ ] Module-Test: GeminiService ist injectable
  - [ ] Verify: `pnpm test` läuft ohne Import-Errors

- [ ] **Task 13: Integration-Test mit echtem API-Key (Optional, Lokal)** (AC: 6.4.10)
  - [ ] Integration-Test-File: `apps/backend/test/gemini-integration.spec.ts`
  - [ ] Skip in CI: `describe.skip('Gemini Integration', ...)` (nur lokal mit echtem API-Key)
  - [ ] Test: Real API-Call mit Sample-CV-Text
    - Verify: Response ist valides JSON
    - Verify: JSON enthält Expected-Felder (basics, work, skills)
  - [ ] Performance: Latency <30s für Standard-CV
  - [ ] Kosten-Tracking: Log Input/Output-Tokens (für Cost-Estimation)

## Dev Notes

### Architektur-Kontext

**Gemini 2.0 Flash Model Details:**
- **Model-ID:** `gemini-2.0-flash-001` (neuestes Flash-Modell, Nov 2024)
- **SDK:** @google/genai v1.28.0+ (neues offizielles SDK, altes SDK deprecated Nov 30, 2025)
- **Performance:** Gemini 2.0 Flash = schneller als 1.5 Pro, günstiger, ausreichend für CV-Extraktion
- **Latency:** Typisch <30s für Standard-CV (1-5 Seiten), max 60s Timeout
- **Token-Limits:** Input: 1M Tokens (mehr als genug für CVs), Output: 8192 Tokens konfiguriert
- **Pricing:** $0.075 per 1M input tokens, $0.30 per 1M output tokens (Flash ist 10x günstiger als Pro)

**Warum Gemini 2.0 Flash statt 1.5 Pro oder andere LLMs?**
1. ✅ **Kosteneffizient:** Flash ist günstiger als Pro, ausreichend für strukturierte Daten-Extraktion
2. ✅ **Schnell:** <30s typical latency vs. 1.5 Pro ~45s
3. ✅ **Neues SDK:** @google/genai ist das offizielle SDK (altes SDK wird deprecated)
4. ✅ **Google-Integration:** Kostenlose API-Quota (1500 requests/day free tier)
5. ❌ **Alternative:** OpenAI GPT-4o wäre akkurater, aber teurer ($0.15/1M input tokens)
6. ❌ **Alternative:** Claude 3.5 Sonnet wäre top-quality, aber noch teurer ($3/1M input tokens)

**Workflow-Position:**
Story 6.4 ist die **zweite Processing-Stage** nach File-Parsing:
1. ✅ File-Upload (Story 6.2): Buffer in Memory
2. ✅ File-Parsing (Story 6.3): Buffer → Plain Text
3. **→ LLM-Extraction (Story 6.4): Plain Text → JSON String**
4. ⏸️ Orchestration (Story 6.5): Full Flow (Parse → LLM → Validate → Save)

**Service-Integration:**
```
ExtractionController (Story 6.2)
   ↓ calls
ExtractionService (Story 6.5) → orchestriert Flow
   ↓ calls
FileParsersService (Story 6.3) → Output: Plain text
   ↓ passes to
GeminiService (Story 6.4) → Output: JSON string
   ↓ validates with
CVSchema.safeParse() (Story 6.5) → Output: Valid CV oder Errors
```

### @google/genai SDK Details

**Installation:**
```bash
pnpm add @google/genai --filter @cv-hub/backend
```

**Warum neues SDK?**
- Altes SDK (`@google/generative-ai`) wird deprecated am 30. Nov 2025
- Neues SDK (`@google/genai`) ist offizielles, maintained SDK
- Breaking Changes: API-Struktur leicht anders, Imports geändert

**API-Usage:**
```typescript
import { GoogleGenerativeAI } from '@google/genai';

// Client initialisieren
const genAI = new GoogleGenerativeAI(apiKey);

// Model instanziieren
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-001',
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 8192,
  },
});

// Content generieren
const result = await model.generateContent({
  contents: [{
    role: 'user',
    parts: [{ text: prompt }]
  }]
});

const jsonString = result.response.text();
```

**Response-Struktur:**
```typescript
{
  response: {
    text(): string,           // Extrahierter Text
    usageMetadata: {
      promptTokenCount: number,     // Input-Tokens
      candidatesTokenCount: number, // Output-Tokens
      totalTokenCount: number
    }
  }
}
```

**Error-Handling:**
- `status: 401` → Invalid API-Key
- `status: 429` → Rate Limit (60 req/min free tier, 15 burst)
- `status: 503` → Service Down (transient, retry-worthy)
- `error.name === 'AbortError'` → Timeout

### Prompt-Engineering für JSON Resume Extraktion

**Prompt-Strategie:**
1. **Clear System-Instruction:** LLM weiß genau was zu tun ist
2. **Schema-Example:** JSON Resume Schema als Beispiel einbetten → LLM kennt Struktur
3. **No Invention:** Explizit sagen "DO NOT invent data" → verhindert Halluzinationen
4. **Output-Format:** "ONLY JSON, no markdown" → verhindert ```json``` Code-Blocks
5. **Temperature 0.2:** Niedrig für konsistente, deterministische Outputs

**Prompt-Template Beispiel:**
```
You are a precise CV data extractor specialized in converting unstructured CV text into JSON Resume Schema format.

**Instructions:**
1. Convert the following CV text into valid JSON Resume Schema.
2. ONLY extract information explicitly present in the text.
3. DO NOT invent, assume, or fabricate any data.
4. If a field is not mentioned, omit it or set to null.
5. Return ONLY valid JSON. No markdown, no code blocks, no explanations.

**JSON Resume Schema (Example):**
{
  "basics": {
    "name": "John Doe",
    "label": "Software Engineer",
    "email": "john@example.com",
    ...
  },
  "work": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}

**cv-hub Extensions:**
- "isPrivate": boolean (default false for public projects)
- "metrics": string (quantitative achievements)
- "entity": string (company name for projects)

**CV Text:**
{{plainText}}

**Your JSON Resume Output:**
```

**Warum diese Struktur?**
- **Klare Boundaries:** "CV Text:" und "Your JSON Output:" signalisieren Input/Output
- **Schema als Beispiel:** LLM lernt Struktur aus Beispiel
- **Wiederholte Instructions:** "ONLY JSON" mehrfach → erhöht Compliance
- **Extensions dokumentiert:** cv-hub-spezifische Felder werden erklärt

### Retry-Logic & Error-Recovery

**Retry-Strategie:**
```typescript
private async retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if retry-worthy
      const isRetryable = this.isRetryableError(error);
      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      this.logger.warn(`Retrying Gemini API call...`, {
        attempt,
        maxAttempts,
        delay,
        error: error.message
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

private isRetryableError(error: any): boolean {
  // Retry auf 503, 429, Network-Errors
  return (
    error.status === 503 ||
    error.status === 429 ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT' ||
    error.message?.includes('network')
  );
}
```

**Warum Exponential Backoff?**
- **1s Delay:** Schnelle Recovery bei kurzen Ausfällen
- **2s, 4s:** Progressiv längere Delays reduzieren Last auf API
- **Max 3 Attempts:** Balance zwischen Reliability und Latency (total max ~7s Retry-Overhead)
- **Keine Retries bei:** 401 (Fix API-Key, kein Retry hilft), Timeouts (schon 60s gewartet)

### Timeout-Handling mit AbortController

**Implementierung:**
```typescript
async extractCV(plainText: string): Promise<string> {
  const timeout = this.configService.get<number>('GEMINI_TIMEOUT_MS', 60000);

  // AbortController für Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    this.logger.warn('Gemini API call timed out', { timeout });
  }, timeout);

  try {
    const result = await this.model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: this.buildExtractionPrompt(plainText) }]
      }],
      signal: controller.signal // Pass AbortSignal
    });

    return result.response.text();

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new RequestTimeoutException(
        `Gemini API request timed out after ${timeout}ms`
      );
    }
    throw this.handleGeminiError(error);

  } finally {
    clearTimeout(timeoutId); // Cleanup
  }
}
```

**Warum AbortController?**
- ✅ **Standard Web API:** Native JS, kein externes Package nötig
- ✅ **Signal-basiert:** Gemini SDK unterstützt AbortSignal
- ✅ **Cleanup:** clearTimeout() verhindert Memory-Leaks
- ❌ **Alternative:** Promise.race() ist weniger sauber (kein echtes Abort)

### Structured Logging & Observability

**Log-Events für Gemini API-Call:**

**1. Start-Event:**
```typescript
this.logger.info('Gemini API call started', {
  level: 'info',
  timestamp: new Date().toISOString(),
  message: 'Gemini API call started',
  context: {
    correlationId: this.getCorrelationId(),
    model: 'gemini-2.0-flash-001',
    inputLength: plainText.length, // Characters
    service: 'GeminiService'
  }
});
```

**2. Success-Event:**
```typescript
this.logger.info('Gemini API call completed', {
  level: 'info',
  timestamp: new Date().toISOString(),
  message: 'Gemini API call completed',
  context: {
    correlationId,
    model: 'gemini-2.0-flash-001',
    latency: endTime - startTime, // ms
    inputTokens: response.usageMetadata?.promptTokenCount || 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
    totalTokens: response.usageMetadata?.totalTokenCount || 0,
    success: true
  }
});
```

**3. Error-Event:**
```typescript
this.logger.error('Gemini API call failed', {
  level: 'error',
  timestamp: new Date().toISOString(),
  message: 'Gemini API call failed',
  context: {
    correlationId,
    model: 'gemini-2.0-flash-001',
    attempt,
    error: error.message,
    errorCode: error.status || error.code,
    latency: Date.now() - startTime,
    success: false
  }
});
```

**Warum Correlation-ID?**
- **End-to-End Tracing:** Gleiche correlationId durch Upload → Parse → LLM → Validate → Save
- **Debugging:** Alle Logs eines Extraction-Flows sind verknüpfbar
- **Implementierung:** AsyncLocalStorage (NestJS Request-Context) oder X-Correlation-ID Header

**Metrics-Tracking:**
- **Latency:** P50, P95, P99 für Performance-Monitoring
- **Token-Counts:** Input/Output-Tokens für Cost-Tracking
- **Success-Rate:** (Successful / Total) * 100% für Quality-Monitoring
- **Error-Rate:** Nach Error-Type (401, 429, 503, Timeout) für Alerting

### Error-Handling & Security

**Exception-Hierarchie:**
```
BadRequestException (400)
├─► "Input text too short" (plainText < 10 chars)
└─► "Gemini API returned invalid JSON" (JSON.parse fehlschlägt)

UnauthorizedException (401)
└─► "Invalid Gemini API key" (401 von API)

TooManyRequestsException (429)
└─► "Gemini API rate limit exceeded" (429 nach 3 Retries)

RequestTimeoutException (408)
└─► "Gemini API request timed out after 60 seconds" (AbortError)

ServiceUnavailableException (503)
└─► "Gemini API is temporarily unavailable" (503 nach 3 Retries)

InternalServerErrorException (500)
└─► "Network error contacting Gemini API" (ECONNREFUSED, ETIMEDOUT)
└─► "Unexpected error during Gemini API call" (Fallback)
```

**Security-Considerations:**
1. **API-Key-Protection:**
   - API-Key NIEMALS im Code hardcoden
   - Nur via Environment-Variable laden
   - `.env` in `.gitignore` (niemals committen)
   - Separate Keys für Dev/Prod (Key-Rotation möglich)

2. **Input-Sanitization:**
   - Plain text ist bereits "safe" (keine Code-Injection möglich in LLM-Prompt)
   - ABER: Prompt-Injection-Versuche möglich ("Ignore previous instructions...")
   - Mitigation: LLM-Output wird sowieso validiert (CVSchema), Prompt-Injection führt zu Invalid JSON → wird abgelehnt

3. **Rate-Limiting:**
   - Gemini Free Tier: 60 requests/minute, 1500 requests/day
   - Story 6.2 implementiert bereits Backend Rate-Limit: 5 extractions/hour pro Session
   - Verhindert API-Cost-Abuse

4. **Error-Messages:**
   - Keine sensitive Informationen in Error-Messages (API-Key, User-Data)
   - Generic Errors für Production: "Gemini API error" statt detaillierter Stack-Traces
   - Detaillierte Errors nur in Logs (für Debugging)

### Testing-Strategie

**Unit-Tests (Jest):**
- **GeminiService:**
  - Mock: GoogleGenerativeAI Client, ConfigService, PinoLogger
  - Test: Jede Error-Case (401, 429, 503, Timeout, Invalid JSON)
  - Test: Retry-Logic (Mock 503 → 503 → Success)
  - Test: Prompt-Building (buildExtractionPrompt)
  - Coverage: 100% für Service

**Integration-Tests (Optional, Lokal):**
- **Real API-Call:**
  - Skip in CI (`describe.skip`)
  - Nur lokal mit echtem API-Key
  - Verify: Response ist valides JSON
  - Performance: Latency <30s
  - Cost-Tracking: Log Token-Counts

**Mock-Responses:**
```typescript
// Fixtures für Tests
const MOCK_VALID_RESPONSE = {
  response: {
    text: () => JSON.stringify({
      basics: { name: 'John Doe', label: 'Engineer' },
      work: [],
      skills: []
    }),
    usageMetadata: {
      promptTokenCount: 1000,
      candidatesTokenCount: 500,
      totalTokenCount: 1500
    }
  }
};

const MOCK_INVALID_JSON_RESPONSE = {
  response: {
    text: () => 'This is not JSON, just plain text',
    usageMetadata: { promptTokenCount: 500, candidatesTokenCount: 100, totalTokenCount: 600 }
  }
};
```

### Learnings from Previous Story

**From Story 6-3 (File-Parser-Service):**
Story 6-3 ist "drafted" (noch nicht implementiert).

**Relevant Context für Story 6.4:**

**1. FileParsersService liefert Plain Text:**
- Output-Format: Plain text string (keine HTML, kein Markup)
- Whitespace normalisiert (max 2 newlines, tabs → spaces)
- Mindestens 10 Zeichen (sonst Error "File appears to be empty")
- GeminiService erhält diesen Plain text als Input

**2. Error-Handling-Pattern etabliert:**
- Story 6.3 nutzt `BadRequestException` für Parser-Errors
- Konsistenz: Story 6.4 sollte ebenfalls NestJS Exception-Classes nutzen
- Error-Messages müssen klar und actionable sein (Frontend zeigt sie dem User)

**3. Logging-Setup bereits vorhanden:**
- Pino Logger in ExtractionController genutzt (Story 6.2)
- Structured Logs mit Context (correlationId, fileName, fileSize)
- GeminiService sollte gleiches Logging-Pattern nutzen

**4. Integration-Points:**
- **Input:** ExtractionService (Story 6.5) ruft `GeminiService.extractCV(plainText)` auf
- **Input-Format:** Plain text string (von FileParsersService)
- **Output:** JSON string (für CVSchema.safeParse() in Story 6.5)
- **Error-Propagation:** Exceptions werden von ExtractionController gefangen

**5. Service ist Stateless:**
- GeminiService hat **keine Instanz-Variablen** außer Client, Config, Logger
- Methode `extractCV()` ist **idempotent** (gleicher Input → gleicher Output, modulo LLM-Varianz)
- No side-effects (keine Disk-I/O, keine DB-Calls)

**6. Performance-Requirements:**
- File-Parsing: <5s für 50-page PDF (Story 6.3)
- LLM-Extraction: <30s typical, 60s max (Story 6.4)
- **Total Extraction Time:** <45s für Standard-CV (Story 6, Tech Spec NFR)
- GeminiService muss <30s P95 latency erreichen

### References

- [Source: docs/tech-spec-epic-6.md - Section: Services and Modules - GeminiService]
- [Source: docs/tech-spec-epic-6.md - Section: Workflows and Sequencing - Workflow 1, Step 10-11]
- [Source: docs/tech-spec-epic-6.md - Section: Non-Functional Requirements - Performance - LLM API Call]
- [Source: docs/tech-spec-epic-6.md - Section: Dependencies and Integrations - @google/genai Package]
- [Source: docs/epics.md - Epic 6, Story 6.4]
- [Source: docs/architecture.md - Backend Stack - NestJS, Error-Handling]
- [Source: docs/stories/6-3-file-parser-service-fuer-pdf-markdown-text.md - Integration Points]
- [Source: npm:@google/genai@1.28.0+ - https://www.npmjs.com/package/@google/genai]
- [Source: Google AI Studio - https://aistudio.google.com/app/apikey]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
