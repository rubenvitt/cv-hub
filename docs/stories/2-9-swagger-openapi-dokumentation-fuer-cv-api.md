# Story 2.9: Swagger/OpenAPI-Dokumentation für CV-API

Status: drafted

## Story

Als **API-Nutzer oder Entwickler**,
möchte ich **interaktive API-Dokumentation unter `/api/docs` abrufen können**,
damit ich **alle verfügbaren CV-Endpoints, deren Request/Response-Schemas und Beispiel-Requests verstehen und testen kann**.

## Acceptance Criteria

1. **✅ Swagger UI ist erreichbar und funktional**
   - `GET http://localhost:3000/api/docs` lädt Swagger UI
   - UI zeigt vollständige OpenAPI 3.0 Spezifikation
   - "Try it out" Funktion ist aktiviert für alle Endpoints

2. **✅ Alle CV-Endpoints sind dokumentiert**
   - `GET /api/cv/public` - Öffentliche CV-Daten
   - `GET /api/cv/private/:token` - Vollständiger CV mit Token
   - `PATCH /api/admin/cv` - CV aktualisieren
   - `GET /api/admin/cv/versions` - Versionshistorie
   - `POST /api/admin/cv/rollback/:versionId` - Rollback zu Version

3. **✅ Endpoint-Dokumentation ist vollständig**
   - Summary und Description für jeden Endpoint
   - Request-Parameter dokumentiert (Path, Query, Body)
   - Response-Schemas für alle Status-Codes (200, 400, 403, 404, 500)
   - Beispiel-Request-Bodies vorhanden

4. **✅ DTOs sind aus Zod-Schemas auto-generiert**
   - `GetCVResponseDto` zeigt CVSchema-Properties
   - `UpdateCVDto` zeigt Partial<CV> Schema
   - `CVVersionResponseDto` dokumentiert Version-Felder
   - Zod-Validation-Regeln sind in Schema-Descriptions sichtbar

5. **✅ API-Tags für Gruppierung**
   - Endpoints sind nach Funktionalität gruppiert: "CV", "Admin CV", "Invite" (Epic 4)
   - Swagger UI zeigt Tags als Navigation

6. **✅ Security-Definitionen**
   - Admin-Endpoints zeigen "Session Auth Required" Badge
   - Token-Endpoints zeigen "Token Validation" Badge
   - Public Endpoints zeigen "No Auth Required"

## Tasks / Subtasks

- [ ] **Task 1: NestJS Swagger Module konfigurieren** (AC: #1, #5)
  - [ ] 1.1: `@nestjs/swagger` Package in backend installieren
  - [ ] 1.2: SwaggerModule in `main.ts` initialisieren
  - [ ] 1.3: DocumentBuilder konfigurieren: Title, Description, Version, Server-URL
  - [ ] 1.4: Swagger UI unter `/api/docs` mounten
  - [ ] 1.5: OpenAPI JSON unter `/api/docs-json` verfügbar machen

- [ ] **Task 2: CV Controller Endpoints dokumentieren** (AC: #2, #3)
  - [ ] 2.1: `@ApiTags('CV')` Decorator zu CVController hinzufügen
  - [ ] 2.2: `GET /api/cv/public` Endpoint annotieren:
    - `@ApiOperation({ summary, description })`
    - `@ApiResponse({ status: 200, type: GetCVResponseDto })`
    - `@ApiResponse({ status: 500, description: 'Internal error' })`
  - [ ] 2.3: `GET /api/cv/private/:token` Endpoint annotieren:
    - `@ApiParam({ name: 'token', description })`
    - `@ApiResponse({ status: 200, type: GetCVResponseDto })`
    - `@ApiResponse({ status: 403, description: 'Invalid token' })`

- [ ] **Task 3: Admin CV Controller Endpoints dokumentieren** (AC: #2, #3, #6)
  - [ ] 3.1: `@ApiTags('Admin CV')` Decorator hinzufügen
  - [ ] 3.2: `PATCH /api/admin/cv` Endpoint annotieren:
    - `@ApiOperation({ summary })`
    - `@ApiBody({ type: UpdateCVDto })`
    - `@ApiResponse({ status: 200, type: GetCVResponseDto })`
    - `@ApiResponse({ status: 400, description: 'Validation error' })`
    - `@ApiResponse({ status: 401, description: 'Unauthorized' })`
    - `@ApiBearerAuth()` oder `@ApiCookieAuth()` für Session
  - [ ] 3.3: `GET /api/admin/cv/versions` Endpoint annotieren:
    - `@ApiQuery({ name: 'limit', type: 'number', required: false })`
    - `@ApiQuery({ name: 'offset', type: 'number', required: false })`
    - `@ApiResponse({ status: 200, type: [CVVersionResponseDto] })`
  - [ ] 3.4: `POST /api/admin/cv/rollback/:versionId` Endpoint annotieren:
    - `@ApiParam({ name: 'versionId', type: 'number' })`
    - `@ApiResponse({ status: 200, type: GetCVResponseDto })`
    - `@ApiResponse({ status: 404, description: 'Version not found' })`

- [ ] **Task 4: DTOs mit Swagger Decorators annotieren** (AC: #4)
  - [ ] 4.1: `GetCVResponseDto` mit `@ApiProperty()` annotieren:
    - `success: boolean`
    - `data: CV` (CV-Schema aus Zod)
  - [ ] 4.2: `UpdateCVDto` mit `@ApiProperty()` annotieren:
    - `cv: Partial<CV>`
  - [ ] 4.3: `CVVersionResponseDto` annotieren:
    - `id: number`
    - `status: 'draft' | 'active' | 'archived'`
    - `source: string`
    - `createdAt: string`
    - `data: CV`
  - [ ] 4.4: Zod-to-OpenAPI Integration testen (automatische Schema-Generierung)

- [ ] **Task 5: Security Definitions konfigurieren** (AC: #6)
  - [ ] 5.1: Session/Cookie-Auth in SwaggerModule definieren:
    ```typescript
    .addCookieAuth('session', { type: 'apiKey', in: 'cookie', name: 'session' })
    ```
  - [ ] 5.2: Token-Auth als Bearer-Token definieren (Epic 4 vorbereitet):
    ```typescript
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Token' }, 'invite-token')
    ```
  - [ ] 5.3: Security-Decorators zu geschützten Endpoints hinzufügen

- [ ] **Task 6: Swagger UI Customization** (AC: #1)
  - [ ] 6.1: Custom CSS für Branding (optional)
  - [ ] 6.2: "Try it out" für alle Endpoints aktivieren
  - [ ] 6.3: Default Server-URL konfigurieren (localhost:3000 für Dev)
  - [ ] 6.4: CORS für Swagger UI sicherstellen

- [ ] **Task 7: Testing und Validierung** (AC: #1-6)
  - [ ] 7.1: Manueller Test: Swagger UI laden und alle Endpoints durchgehen
  - [ ] 7.2: "Try it out" für Public Endpoint testen
  - [ ] 7.3: Schema-Validierung prüfen (Request/Response-Schemas korrekt)
  - [ ] 7.4: Integration Test: Swagger JSON unter `/api/docs-json` abrufen und validieren
  - [ ] 7.5: OpenAPI Validator Tool nutzen (z.B. `swagger-cli validate`)

## Dev Notes

### Architektur-Kontext

**NestJS Swagger Module:**
- Package: `@nestjs/swagger` (bereits in Epic 1 Dependencies vorhanden oder neu hinzufügen)
- Integration: Decorators-basiert, automatische OpenAPI-Generierung
- Unterstützt Zod-to-OpenAPI via `nestjs-zod` (falls bereits verwendet)

**Zod-Schema-Integration:**
- CVSchema aus `@cv-hub/shared-types` ist bereits definiert
- DTOs sollten Zod-Schemas als Quelle nutzen
- Automatische Transformation zu OpenAPI 3.0 Schema

**Swagger UI Mounting:**
```typescript
// apps/backend/src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('cv-hub API')
  .setDescription('API für cv-hub - Privacy-first CV-Management')
  .setVersion('1.0')
  .addServer('http://localhost:3000', 'Local Development')
  .addCookieAuth('session', { type: 'apiKey', in: 'cookie', name: 'session' })
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Security-Definitionen:**
- Admin-Endpoints: Cookie-based Session Auth (Epic 5 implementiert Guards)
- Token-Endpoints: Bearer-Token (Epic 4 implementiert InviteGuard)
- Public-Endpoints: Keine Auth

### Testing-Strategie

**Manual Testing:**
1. Backend starten: `npm run start:dev`
2. Browser öffnen: `http://localhost:3000/api/docs`
3. Jeden Endpoint durchgehen:
   - Schema korrekt?
   - "Try it out" funktioniert?
   - Response-Beispiele vorhanden?

**Validation:**
- OpenAPI JSON validieren mit `swagger-cli validate http://localhost:3000/api/docs-json`
- Schema-Conformance prüfen (OpenAPI 3.0 Standard)

**Integration Test (Optional):**
```typescript
describe('Swagger Documentation (e2e)', () => {
  it('should serve Swagger UI at /api/docs', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('should provide OpenAPI JSON at /api/docs-json', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect((res) => {
        expect(res.body.openapi).toBe('3.0.0');
        expect(res.body.paths['/api/cv/public']).toBeDefined();
      });
  });
});
```

### Project Structure Notes

**Dateien zu ändern/erstellen:**
```
apps/backend/src/
├── main.ts                          # Swagger Module Setup
├── modules/cv/
│   ├── cv.controller.ts            # @ApiTags, @ApiOperation Decorators
│   ├── dto/
│   │   ├── get-cv-response.dto.ts  # @ApiProperty Decorators
│   │   ├── update-cv.dto.ts        # @ApiProperty Decorators
│   │   └── cv-version-response.dto.ts  # @ApiProperty Decorators
```

**Dependencies:**
```json
{
  "dependencies": {
    "@nestjs/swagger": "^7.1.0",  // OpenAPI Generation
    "swagger-ui-express": "^5.0.0"  // Swagger UI (auto-installed mit @nestjs/swagger)
  },
  "devDependencies": {
    "swagger-cli": "^4.0.4"  // Für Validation (optional)
  }
}
```

### Constraints und Risiken

**Constraint: Zod-Schema-Integration**
- Zod-Schemas müssen zu OpenAPI transformiert werden
- Option A: Manuelle Duplikation (DTO mit @ApiProperty)
- Option B: `nestjs-zod` Package für automatische Transformation
- Empfehlung: Option A für MVP (explizite Kontrolle), Option B für Growth

**Constraint: Security-Definitionen sind Placeholders**
- Epic 2 hat keine echte Admin-Auth (Epic 5)
- Security-Decorators vorbereiten, aber Guard-Implementation fehlt noch
- Swagger zeigt "Auth Required", aber Backend bypassed aktuell

**Risk: Schema-Drift zwischen Zod und OpenAPI**
- Zod ist Source of Truth, aber OpenAPI muss manuell synchronisiert werden
- Mitigation: Schema-Tests schreiben, die Zod-Schema gegen OpenAPI-Schema validieren

### References

**Tech Spec Sections:**
- [AC-10: Swagger API-Dokumentation ist generiert](docs/tech-spec-epic-2.md#AC-10)
- [APIs and Interfaces: Swagger/OpenAPI Auto-Generated](docs/tech-spec-epic-2.md#apis-and-interfaces)
- [Detailed API Specifications](docs/tech-spec-epic-2.md#detailed-api-specifications)

**PRD Sections:**
- [FR-2: RESTful API Backend → OpenAPI/Swagger-Dokumentation](docs/PRD.md#FR-2)
- [Web Application + API Backend Spezifikationen](docs/PRD.md#web-application-api-backend-spezifikationen)

**Architecture Patterns:**
- [API Design → RESTful Endpoints wie spezifiziert](docs/tech-spec-epic-2.md#system-architecture-alignment)
- [API-First Architecture](docs/tech-spec-epic-2.md#system-architecture-alignment)

**External References:**
- [NestJS Swagger Module Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)

## Change Log

- **2025-11-06:** Story 2.9 drafted (Status: backlog → drafted)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Agent model and version will be filled during implementation -->

### Debug Log References

<!-- Debug logs will be added during implementation -->

### Completion Notes List

<!-- Implementation notes will be added here by dev agent -->

### File List

<!-- Files created/modified will be listed here by dev agent -->
