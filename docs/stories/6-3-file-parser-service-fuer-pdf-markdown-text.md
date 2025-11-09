# Story 6.3: File-Parser-Service für PDF/Markdown/Text

Status: drafted

## Story

Als Extraction-Service,
möchte ich Text aus verschiedenen File-Formaten (PDF, Markdown, Plain Text) extrahieren,
damit ich strukturierte Input-Daten für die LLM-basierte CV-Extraktion habe.

## Acceptance Criteria

1. **AC 6.3.1: FileParsersService Class erstellt**
   - Service-Klasse `FileParsersService` in `apps/backend/src/modules/extraction/services/file-parsers.service.ts`
   - Injectable als Provider im ExtractionModule
   - Hauptmethode: `parseFile(buffer: Buffer, mimetype: string): Promise<string>`
   - Mimetype-basiertes Routing zu spezialisierten Parser-Methoden
   - TypeScript-Typen: Input (Buffer, string), Output (Promise<string>)

2. **AC 6.3.2: PDF-Parser mit pdf-parse Library**
   - `parsePdf(buffer: Buffer): Promise<string>` Methode implementiert
   - pdf-parse (v2.4.5) als NPM-Dependency installiert
   - Extraktion: PDF.buffer → pdf-parse → text-only output
   - Metadaten ignoriert (nur text content)
   - Leere PDFs → Error: "PDF contains no extractable text"
   - Performance: <5s für 50-page PDF (messbar in Tests)

3. **AC 6.3.3: Markdown-Parser (Direct UTF-8 Read)**
   - `parseMarkdown(buffer: Buffer): Promise<string>` Methode implementiert
   - Buffer → UTF-8 String-Konvertierung (`buffer.toString('utf-8')`)
   - Keine Markdown-Parsing (Formatierung bleibt erhalten für LLM-Context)
   - Output: Raw Markdown als String

4. **AC 6.3.4: Plain Text-Parser (Direct UTF-8 Read)**
   - `parsePlainText(buffer: Buffer): Promise<string>` Methode implementiert
   - Buffer → UTF-8 String-Konvertierung
   - Encoding-Detection optional (UTF-8 als Default)
   - Output: Plain text string

5. **AC 6.3.5: Error-Handling für Edge-Cases**
   - Leere Files (0 bytes) → `BadRequestException('File is empty')`
   - Korrupte PDFs (pdf-parse wirft Error) → `BadRequestException('Unable to parse PDF. File may be corrupted.')`
   - Unsupported MIME-Type → `BadRequestException('Unsupported file type for parsing')`
   - Alle Parser-Errors enthalten Pino-Logs (Error-Level) mit Context

6. **AC 6.3.6: Unit-Tests mit Sample-Files**
   - Test-Fixtures: `apps/backend/test/fixtures/`
     - `sample-cv.pdf` (5-page Beispiel-CV)
     - `sample-cv.md` (Markdown-Format)
     - `sample-cv.txt` (Plain Text)
     - `empty.pdf` (0 bytes für Error-Test)
     - `corrupted.pdf` (invalid PDF für Error-Test)
   - Tests validieren: Success-Case (valider Text extrahiert), Error-Cases (klare Exceptions)
   - Code-Coverage: 100% für FileParsersService

7. **AC 6.3.7: Performance-Anforderung**
   - 50-page PDF: Parsing <5s (gemessen in Integration-Test)
   - 10MB Markdown/Text: Parsing <1s
   - Performance-Test als Teil der Unit-Test-Suite

8. **AC 6.3.8: Konsistentes Output-Format**
   - Output: Plain text string (keine HTML, kein Markup-Chaos)
   - Whitespace normalisiert (keine doppelten Newlines, Tabs → Spaces)
   - Keine Leading/Trailing Whitespace
   - Output mindestens 10 Zeichen (sonst "File appears to be empty or unreadable")

## Tasks / Subtasks

- [ ] **Task 1: NPM-Dependency Installation** (AC: 6.3.2)
  - [ ] `pnpm add pdf-parse@2.4.5` im backend workspace
  - [ ] Type-Definitions prüfen: `@types/pdf-parse` installieren falls nötig
  - [ ] Verify: `pnpm list pdf-parse` zeigt korrekte Version
  - [ ] Update `apps/backend/package.json` mit Dependency

- [ ] **Task 2: FileParsersService Class Setup** (AC: 6.3.1)
  - [ ] Service-File erstellen: `apps/backend/src/modules/extraction/services/file-parsers.service.ts`
  - [ ] `@Injectable()` Decorator anwenden
  - [ ] Constructor mit PinoLogger injizieren (`@InjectPinoLogger()`)
  - [ ] TypeScript-Interface für Methoden-Signaturen definieren
  - [ ] Unit-Test: Service ist injectable (NestJS DI funktioniert)

- [ ] **Task 3: parseFile() Hauptmethode** (AC: 6.3.1)
  - [ ] Methode: `async parseFile(buffer: Buffer, mimetype: string): Promise<string>`
  - [ ] Switch-Case für MIME-Types:
    - `'application/pdf'` → `this.parsePdf(buffer)`
    - `'text/markdown'` → `this.parseMarkdown(buffer)`
    - `'text/plain'` → `this.parsePlainText(buffer)`
    - Default → throw `BadRequestException('Unsupported file type for parsing')`
  - [ ] Input-Validation: Buffer nicht null/undefined
  - [ ] Unit-Test: MIME-Type-Routing funktioniert korrekt

- [ ] **Task 4: parsePdf() Implementierung** (AC: 6.3.2)
  - [ ] Private Methode: `private async parsePdf(buffer: Buffer): Promise<string>`
  - [ ] pdf-parse Import: `import PDFParser from 'pdf-parse'`
  - [ ] PDF-Parsing: `const data = await PDFParser(buffer)`
  - [ ] Text-Extraktion: `data.text` (String)
  - [ ] Leere PDF-Check: `if (data.numpages === 0 || !data.text.trim())` → Exception
  - [ ] Error-Handling: pdf-parse Errors catchen → `BadRequestException('Unable to parse PDF. File may be corrupted.')`
  - [ ] Unit-Test: Valid PDF → Text extrahiert
  - [ ] Unit-Test: Leere PDF → Exception mit korrekter Message

- [ ] **Task 5: parseMarkdown() Implementierung** (AC: 6.3.3)
  - [ ] Private Methode: `private parseMarkdown(buffer: Buffer): string`
  - [ ] Buffer-to-String: `buffer.toString('utf-8')`
  - [ ] Return raw Markdown (keine Parsing-Library nötig)
  - [ ] Unit-Test: Markdown-Buffer → String korrekt konvertiert

- [ ] **Task 6: parsePlainText() Implementierung** (AC: 6.3.4)
  - [ ] Private Methode: `private parsePlainText(buffer: Buffer): string`
  - [ ] Buffer-to-String: `buffer.toString('utf-8')`
  - [ ] Encoding-Detection optional (UTF-8 Default ausreichend)
  - [ ] Unit-Test: Plain Text-Buffer → String korrekt konvertiert

- [ ] **Task 7: Error-Handling & Validation** (AC: 6.3.5)
  - [ ] Empty File Check: `if (buffer.length === 0)` → `BadRequestException('File is empty')`
  - [ ] Minimum Content-Check: Nach Parsing, `if (text.trim().length < 10)` → `BadRequestException('File appears to be empty or unreadable')`
  - [ ] Try-Catch um alle Parser-Methoden (Log Error + Re-throw mit klarer Message)
  - [ ] Unit-Test: 0-byte Buffer → Exception
  - [ ] Unit-Test: Korrupte PDF → Exception mit "corrupted" message

- [ ] **Task 8: Text-Normalisierung (Output-Cleanup)** (AC: 6.3.8)
  - [ ] Normalisierungs-Funktion: `private normalizeText(text: string): string`
  - [ ] Remove leading/trailing whitespace: `text.trim()`
  - [ ] Normalize whitespace: Replace multiple newlines `\n\n+` → `\n\n` (max 2)
  - [ ] Replace tabs mit spaces: `text.replace(/\t/g, ' ')`
  - [ ] Apply zu allen Parser-Outputs (parsePdf, parseMarkdown, parsePlainText)
  - [ ] Unit-Test: Text mit excess whitespace → normalized output

- [ ] **Task 9: Test-Fixtures erstellen** (AC: 6.3.6)
  - [ ] Ordner erstellen: `apps/backend/test/fixtures/`
  - [ ] `sample-cv.pdf`: 5-page Beispiel-CV (kann generiert oder echtes CV sein)
  - [ ] `sample-cv.md`: Markdown-CV (ca. 2-3KB)
  - [ ] `sample-cv.txt`: Plain Text-CV (ca. 1-2KB)
  - [ ] `empty.pdf`: 0-byte File für Error-Test
  - [ ] `corrupted.pdf`: Invalid PDF-Header für Corrupted-Test
  - [ ] Fixtures zu Git hinzufügen (`.gitignore` prüfen, fixtures NICHT ignorieren)

- [ ] **Task 10: Unit-Tests für FileParsersService** (AC: 6.3.6)
  - [ ] Test-File: `apps/backend/src/modules/extraction/services/file-parsers.service.spec.ts`
  - [ ] Test-Setup: Load fixtures as Buffers (`fs.readFileSync()`)
  - [ ] **Test: parsePdf() - Valid PDF**
    - Input: sample-cv.pdf Buffer
    - Assert: Output ist String, length > 100, contains "expected text"
  - [ ] **Test: parsePdf() - Empty PDF**
    - Input: empty.pdf Buffer
    - Assert: Throws BadRequestException mit "no extractable text"
  - [ ] **Test: parsePdf() - Corrupted PDF**
    - Input: corrupted.pdf Buffer
    - Assert: Throws BadRequestException mit "corrupted"
  - [ ] **Test: parseMarkdown() - Valid Markdown**
    - Input: sample-cv.md Buffer
    - Assert: Output ist String, contains Markdown syntax (# headers)
  - [ ] **Test: parsePlainText() - Valid Text**
    - Input: sample-cv.txt Buffer
    - Assert: Output ist String, matches expected content
  - [ ] **Test: parseFile() - MIME-Type Routing**
    - Input: Buffer + 'application/pdf' → calls parsePdf
    - Input: Buffer + 'text/markdown' → calls parseMarkdown
    - Input: Buffer + 'text/plain' → calls parsePlainText
    - Input: Buffer + 'application/exe' → throws BadRequestException
  - [ ] **Test: normalizeText() - Whitespace Cleanup**
    - Input: "  text\n\n\n\nmore  \t  text  "
    - Expected: "text\n\nmore text"
  - [ ] Code-Coverage: 100% für FileParsersService (Jest Coverage-Report)

- [ ] **Task 11: Performance-Tests** (AC: 6.3.7)
  - [ ] Performance-Test: 50-page PDF parsing
    - Generate/use large-cv.pdf fixture (50 pages, ~5MB)
    - Measure time: `performance.now()` before/after
    - Assert: Time < 5000ms
  - [ ] Performance-Test: 10MB Markdown parsing
    - Generate large-cv.md (10MB Text)
    - Assert: Time < 1000ms
  - [ ] Mark als `@slow` Test (optional skip in fast test runs)

- [ ] **Task 12: ExtractionModule Integration** (AC: 6.3.1)
  - [ ] `FileParsersService` zu ExtractionModule Providers hinzufügen
  - [ ] Import in ExtractionService (vorbereitet für Story 6.5)
  - [ ] Module-Test: FileParsersService ist injectable in ExtractionService
  - [ ] Verify: `pnpm test` läuft ohne Import-Errors

- [ ] **Task 13: Logging & Observability** (AC: 6.3.5)
  - [ ] Log auf Info-Level: "Parsing file" (MIME-Type, Buffer-Size)
  - [ ] Log auf Debug-Level: "PDF parsing completed" (Text-Length, Pages)
  - [ ] Log auf Error-Level bei Exceptions: Error-Message, MIME-Type, Stack-Trace
  - [ ] Correlation-ID aus Request-Context (NestJS AsyncLocalStorage)
  - [ ] Structured Logs: `{ level, timestamp, message, context: { mimetype, bufferSize, textLength } }`
  - [ ] Unit-Test: Logger wird korrekt aufgerufen (Mock PinoLogger)

## Dev Notes

### Architektur-Kontext

**Backend-Stack (aus architecture.md):**
- **Framework:** NestJS v11 (TypeScript, Modular Architecture)
- **File-Processing:** pdf-parse v2.4.5 (PDF-Text-Extraktion)
- **Logging:** Pino (nestjs-pino v4.4.1) - Structured JSON Logs
- **Error-Handling:** NestJS Exception-Filters (HttpException)

**Module-Struktur:**
```
apps/backend/src/modules/extraction/
├── extraction.module.ts       (Story 6.2: erstellt, Story 6.3: erweitert)
├── extraction.controller.ts   (Story 6.2: erstellt)
├── extraction.service.ts      (Story 6.2: Placeholder, Story 6.5: erweitert)
├── services/                  (Story 6.3: NEU)
│   └── file-parsers.service.ts (Story 6.3: erstellt)
├── dto/
│   └── extraction-result.dto.ts
└── pipes/
    ├── validate-file-mime-type.pipe.ts
    └── validate-file-extension.pipe.ts
```

**Service-Integration:**
```
ExtractionController (Story 6.2)
   ↓ calls
ExtractionService (Story 6.5)
   ↓ calls
FileParsersService (Story 6.3) → Output: Plain text string
   ↓ calls
GeminiService (Story 6.4) → Output: JSON Resume
```

**Workflow-Position:**
Story 6.3 ist die **erste Processing-Stage** nach File-Upload:
1. ✅ File-Upload (Story 6.2): Buffer in Memory
2. **→ File-Parsing (Story 6.3): Buffer → Plain Text**
3. ⏸️ LLM-Extraction (Story 6.4): Text → JSON
4. ⏸️ Orchestration (Story 6.5): Full Flow

### pdf-parse Library Details

**Installation:**
```bash
pnpm add pdf-parse@2.4.5 --filter @cv-hub/backend
pnpm add @types/pdf-parse --filter @cv-hub/backend --save-dev
```

**API-Usage:**
```typescript
import PDFParser from 'pdf-parse';

async function parsePdf(buffer: Buffer): Promise<string> {
  const data = await PDFParser(buffer);

  // Available properties:
  // data.numpages: number (PDF page count)
  // data.text: string (extracted text)
  // data.info: Object (PDF metadata - unused)

  return data.text;
}
```

**Performance-Charakteristik:**
- Small PDFs (1-5 pages): ~100-500ms
- Medium PDFs (10-20 pages): ~1-2s
- Large PDFs (50+ pages): ~3-5s
- Memory: ~2-3x File-Size in RAM während Parsing

**Error-Cases:**
- Korrupte PDF → Error: "Failed to read PDF file"
- Passwort-geschützte PDF → Error: "Encrypted PDFs are not supported"
- Leere PDF (0 pages) → data.numpages === 0
- PDF ohne Text (nur Bilder/Scans) → data.text === ""

**Warum pdf-parse?**
- ✅ Einfache API (nur 1 Funktion)
- ✅ Keine Disk-I/O (arbeitet mit Buffers)
- ✅ Stabile, mature Library (v1+ seit 2018)
- ✅ MIT-License (kommerziell nutzbar)
- ❌ Kein OCR (nur text-basierte PDFs)
- ❌ Formatierung geht verloren (nur Plain Text)

### FileParsersService Implementation

**Service-Struktur:**
```typescript
@Injectable()
export class FileParsersService {
  constructor(@InjectPinoLogger(FileParsersService.name) private readonly logger: PinoLogger) {}

  async parseFile(buffer: Buffer, mimetype: string): Promise<string> {
    this.logger.info(`Parsing file: ${mimetype}, size: ${buffer.length} bytes`);

    // Empty file check
    if (buffer.length === 0) {
      throw new BadRequestException('File is empty');
    }

    // Route to specialized parser
    let text: string;
    switch (mimetype) {
      case 'application/pdf':
        text = await this.parsePdf(buffer);
        break;
      case 'text/markdown':
        text = this.parseMarkdown(buffer);
        break;
      case 'text/plain':
        text = this.parsePlainText(buffer);
        break;
      default:
        throw new BadRequestException('Unsupported file type for parsing');
    }

    // Normalize and validate output
    const normalized = this.normalizeText(text);

    if (normalized.length < 10) {
      throw new BadRequestException('File appears to be empty or unreadable');
    }

    this.logger.debug(`Parsing completed: ${normalized.length} characters extracted`);
    return normalized;
  }

  private async parsePdf(buffer: Buffer): Promise<string> {
    try {
      const data = await PDFParser(buffer);

      if (data.numpages === 0 || !data.text.trim()) {
        throw new BadRequestException('PDF contains no extractable text');
      }

      return data.text;
    } catch (error) {
      this.logger.error(`PDF parsing failed: ${error.message}`);
      throw new BadRequestException('Unable to parse PDF. File may be corrupted.');
    }
  }

  private parseMarkdown(buffer: Buffer): string {
    return buffer.toString('utf-8');
  }

  private parsePlainText(buffer: Buffer): string {
    return buffer.toString('utf-8');
  }

  private normalizeText(text: string): string {
    return text
      .trim()                           // Remove leading/trailing whitespace
      .replace(/\t/g, ' ')              // Replace tabs with spaces
      .replace(/\n{3,}/g, '\n\n');      // Max 2 consecutive newlines
  }
}
```

### Text-Normalisierung Rationale

**Warum Normalisierung?**
- LLMs sind sensitiv auf excess whitespace (kann Token-Count erhöhen)
- PDFs enthalten oft chaotische Formatierung (Tabs, multiple Newlines)
- Konsistenter Output → bessere LLM-Performance

**Normalisierungs-Regeln:**
1. **Trim:** Leading/Trailing Whitespace entfernen
2. **Tabs → Spaces:** Tabs sind in Plain Text inkonsistent
3. **Max 2 Newlines:** Multiple Newlines (Paragraphen-Spacing) auf max 2 reduzieren
4. **Preserve Content:** Keine Text-Entfernung, nur Whitespace-Cleanup

**NICHT normalisiert:**
- ❌ Encoding-Konvertierung (UTF-8 ist Standard)
- ❌ Special Characters entfernen (können relevant sein)
- ❌ HTML-Entity-Decoding (kein HTML in PDFs erwartet)
- ❌ Lowercase-Konvertierung (Case kann wichtig sein)

### Error-Handling & Security

**Exception-Hierarchie:**
```
BadRequestException (400)
├─► "File is empty" (0-byte File)
├─► "File appears to be empty or unreadable" (<10 chars nach Parsing)
├─► "PDF contains no extractable text" (Leere PDF)
├─► "Unable to parse PDF. File may be corrupted." (pdf-parse Error)
└─► "Unsupported file type for parsing" (Invalid MIME-Type)
```

**Security-Considerations:**
- **No Disk-I/O:** Alle Operationen auf Buffers (Memory-Only)
- **MIME-Type already validated:** Story 6.2 hat MIME-Type geprüft
- **File-Size already limited:** 10MB Limit via Multer (Story 6.2)
- **No Code-Execution:** pdf-parse ist pure data-processing (kein eval/exec)
- **Error-Messages safe:** Keine sensitive Informationen in Error-Messages

**Potential Attack Vectors & Mitigations:**
1. **PDF-Bomb (large file decompressed):**
   - Mitigation: Multer 10MB limit (compressed size)
   - Additional: Timeout nach 5s (Performance-Requirement)
2. **Malicious PDF (exploit pdf-parse):**
   - Mitigation: pdf-parse ist mature, stable library
   - Production: Consider sandboxing (Docker Container Isolation)
3. **Encoding-Attacks (non-UTF-8):**
   - Mitigation: Buffer.toString('utf-8') ist safe (replaces invalid bytes)

### Testing-Strategie

**Unit-Tests (Jest):**
- **FileParsersService:**
  - Mock: PinoLogger (nur verify calls)
  - Test: Jede Parser-Methode (PDF, Markdown, Text)
  - Test: MIME-Type-Routing (Switch-Case)
  - Test: Error-Cases (Empty, Corrupted, Unsupported)
  - Test: Normalisierung (Whitespace-Cleanup)
  - Coverage: 100% für Service

**Test-Fixtures:**
```
apps/backend/test/fixtures/
├── sample-cv.pdf       (5 pages, ~500KB, valid CV)
├── sample-cv.md        (Markdown CV, ~2KB)
├── sample-cv.txt       (Plain Text CV, ~1KB)
├── empty.pdf           (0 bytes)
├── corrupted.pdf       (Invalid PDF header: %PD-1.4 statt %PDF-1.4)
├── large-cv.pdf        (50 pages, ~5MB, für Performance-Test)
└── large-cv.md         (10MB Text, für Performance-Test)
```

**Fixture-Generation:**
- `sample-cv.pdf`: Echtes CV-PDF oder generiert via LaTeX/Pandoc
- `empty.pdf`: `touch empty.pdf` (0-byte File)
- `corrupted.pdf`: Text-File mit "%PD-1.4" Header (statt %PDF-1.4)
- `large-cv.pdf`: Multi-CV konkateniert oder generiert via LaTeX-Loop
- `large-cv.md`: Markdown-Content x1000 kopiert

**Performance-Tests:**
```typescript
describe('FileParsersService - Performance', () => {
  it('should parse 50-page PDF in <5s', async () => {
    const buffer = fs.readFileSync('test/fixtures/large-cv.pdf');
    const start = performance.now();

    const text = await service.parseFile(buffer, 'application/pdf');

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5000); // 5s
    expect(text.length).toBeGreaterThan(1000);
  });

  it('should parse 10MB Markdown in <1s', async () => {
    const buffer = fs.readFileSync('test/fixtures/large-cv.md');
    const start = performance.now();

    const text = await service.parseFile(buffer, 'text/markdown');

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1000); // 1s
    expect(text.length).toBeGreaterThan(10000000); // 10MB
  });
});
```

### Learnings from Previous Story

**From Story 6-2 (Backend File-Upload-Endpoint mit Multer):**
Story 6-2 ist "drafted" (noch nicht implementiert).

**Relevant Context für Story 6.3:**

**1. File wird bereits als Buffer in Memory gehalten:**
- Multer MemoryStorage konfiguriert (Story 6.2, Task 4)
- File-Object-Struktur bekannt: `{ buffer: Buffer, mimetype: string, originalname: string, size: number }`
- FileParsersService erhält `file.buffer` und `file.mimetype` als Input

**2. MIME-Type und Extension bereits validiert:**
- `ValidateFileMimeTypePipe` prüft MIME-Type: `application/pdf`, `text/markdown`, `text/plain`
- `ValidateFileExtensionPipe` prüft Extension: `.pdf`, `.md`, `.txt`
- FileParsersService kann davon ausgehen, dass MIME-Type korrekt ist
- Trotzdem: Switch-Case mit Default-Error als zusätzliche Safety-Layer

**3. File-Size bereits limitiert:**
- Multer Limit: 10MB (10485760 bytes)
- FileParsersService muss keine Size-Validation durchführen
- Performance-Requirement (<5s für 50-page PDF) ist realistisch bei 10MB Limit

**4. ExtractionModule und ExtractionService existieren bereits:**
- ExtractionModule erstellt (Story 6.2, Task 1)
- ExtractionService als Placeholder existiert (Story 6.2, Task 1)
- FileParsersService muss zu ExtractionModule Providers hinzugefügt werden (Story 6.3, Task 12)

**5. Error-Handling-Pattern etabliert:**
- Story 6.2 nutzt `BadRequestException` für File-Validierung
- Konsistenz: Story 6.3 sollte ebenfalls `BadRequestException` für Parser-Errors nutzen
- Error-Messages müssen klar und actionable sein (Frontend zeigt sie dem User)

**6. Logging-Setup bereits vorhanden:**
- Pino Logger in ExtractionController genutzt (Story 6.2, Task 14)
- Structured Logs mit Context (correlationId, fileName, fileSize)
- FileParsersService sollte gleiches Logging-Pattern nutzen

**Integration-Points:**
- **Input:** ExtractionService (Story 6.5) ruft `FileParsersService.parseFile()` auf
- **Input-Format:** `file.buffer` (Buffer) + `file.mimetype` (string)
- **Output:** Plain text string (für GeminiService in Story 6.4)
- **Error-Propagation:** BadRequestException werden von ExtractionController gefangen

**Wichtig:**
- FileParsersService ist **stateless** (keine Instanz-Variablen außer Logger)
- Alle Parser-Methoden sind **idempotent** (gleicher Input → gleicher Output)
- No side-effects (keine Disk-I/O, keine DB-Calls)

### References

- [Source: docs/tech-spec-epic-6.md - Section: Services and Modules - FileParsers]
- [Source: docs/tech-spec-epic-6.md - Section: Workflows and Sequencing - Workflow 1, Step 8]
- [Source: docs/tech-spec-epic-6.md - Section: Non-Functional Requirements - Performance]
- [Source: docs/epics.md - Epic 6, Story 6.3]
- [Source: docs/architecture.md - Backend Stack - NestJS, Logging]
- [Source: docs/stories/6-2-backend-file-upload-endpoint-mit-multer.md - Integration Points]
- [Source: npm:pdf-parse@2.4.5 - https://www.npmjs.com/package/pdf-parse]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
