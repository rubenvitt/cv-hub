# Docker Setup für CV Hub

Dieses Dokument beschreibt die Docker-Konfiguration für das CV Hub Monorepo-Projekt.

## Voraussetzungen

- Docker >= 20.10
- Docker Compose >= 2.0
- Git

## Schnellstart

### 1. Repository klonen und .env einrichten

```bash
# .env Datei erstellen (falls nicht vorhanden)
cp .env.example .env
```

### 2. Container starten

```bash
# Alle Services starten (mit Build)
docker-compose up --build

# Im Hintergrund starten
docker-compose up -d --build

# Logs anzeigen
docker-compose logs -f

# Nur Backend Logs
docker-compose logs -f backend

# Nur Frontend Logs
docker-compose logs -f frontend
```

### 3. Container stoppen

```bash
# Services stoppen und Container entfernen
docker-compose down

# Services stoppen, Container und Volumes entfernen
docker-compose down -v
```

## Services

### Backend (NestJS)

- **Container Name:** cv-hub-backend
- **Port:** 3000
- **Health-Check:** `curl -f http://localhost:3000/api/health`
- **Technologien:** NestJS, TypeORM, SQLite
- **Hot-Reload:** Aktiviert via Volume-Mounts

**Zugriff:**

```bash
# API Health-Check
curl http://localhost:3000/api/health

# Container Shell
docker-compose exec backend sh

# Logs
docker-compose logs -f backend
```

### Frontend (TanStack Start)

- **Container Name:** cv-hub-frontend
- **Port:** 5173
- **Technologien:** TanStack Start, React, Vite, Tailwind CSS
- **Hot-Reload:** Aktiviert via Volume-Mounts und `--host 0.0.0.0`

**Zugriff:**

```bash
# Frontend URL
http://localhost:5173

# Container Shell
docker-compose exec frontend sh

# Logs
docker-compose logs -f frontend
```

## Volumes

### SQLite Datenbank

Die SQLite-Datenbank wird persistent im Host-Verzeichnis `./data` gespeichert:

```bash
# Datenbank-Pfad auf Host
./data/cv-hub.sqlite

# Datenbank-Pfad im Container
/app/apps/backend/data/cv-hub.sqlite
```

**Wichtig:** Das `./data`-Verzeichnis ist in `.gitignore` und wird NICHT versioniert.

### Hot-Reload Volumes

Code-Änderungen werden automatisch in die Container synchronisiert:

- `./apps/backend` → `/app/apps/backend`
- `./apps/frontend` → `/app/apps/frontend`
- `./packages` → `/app/packages`

**Anonymous Volumes:** `node_modules` werden als Anonymous Volumes gemountet, um Host-Dependencies nicht zu überschreiben.

## Entwicklung

### pnpm-Befehle im Container ausführen

```bash
# Backend
docker-compose exec backend pnpm run <script>
docker-compose exec backend pnpm run build
docker-compose exec backend pnpm run test

# Frontend
docker-compose exec frontend pnpm run <script>
docker-compose exec frontend pnpm run build
docker-compose exec frontend pnpm run test
```

### Dependencies installieren

```bash
# Backend Dependencies hinzufügen
docker-compose exec backend pnpm add <package>

# Frontend Dependencies hinzufügen
docker-compose exec frontend pnpm add <package>

# Workspace Dependencies hinzufügen (im Root)
docker-compose exec backend pnpm add -w <package>

# Nach dependency changes: Rebuild
docker-compose up --build
```

### Datenbank-Migrationen

```bash
# Migration generieren
docker-compose exec backend pnpm run typeorm:migration:generate -- src/database/migrations/MigrationName

# Migration ausführen
docker-compose exec backend pnpm run typeorm:migration:run

# Migration rückgängig machen
docker-compose exec backend pnpm run typeorm:migration:revert
```

## Troubleshooting

### Port bereits belegt

```bash
# Prüfen, welcher Prozess Port 3000 belegt
lsof -i :3000

# Prüfen, welcher Prozess Port 5173 belegt
lsof -i :5173

# Prozess beenden
kill -9 <PID>
```

### Container startet nicht

```bash
# Container-Logs prüfen
docker-compose logs backend
docker-compose logs frontend

# Container neu bauen (ohne Cache)
docker-compose build --no-cache
docker-compose up
```

### Hot-Reload funktioniert nicht

```bash
# Container neu starten
docker-compose restart

# Container stoppen, Volumes entfernen, neu starten
docker-compose down -v
docker-compose up --build
```

### node_modules-Konflikte

```bash
# Host node_modules entfernen (optional)
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Container neu bauen
docker-compose down -v
docker-compose up --build
```

### Datenbank zurücksetzen

```bash
# Container stoppen
docker-compose down

# SQLite Datenbank löschen
rm -rf ./data

# Container neu starten (Datenbank wird neu erstellt)
docker-compose up
```

## Architektur

### Monorepo-Struktur

```
lebenslauf/
├── docker-compose.yml          # Docker Compose Konfiguration
├── .env                        # Environment Variables (nicht versioniert)
├── .env.example                # Environment Template
├── apps/
│   ├── backend/
│   │   ├── Dockerfile          # Backend Build-Konfiguration
│   │   ├── .dockerignore       # Backend Ignore-Patterns
│   │   └── ...
│   └── frontend/
│       ├── Dockerfile          # Frontend Build-Konfiguration
│       ├── .dockerignore       # Frontend Ignore-Patterns
│       └── ...
├── packages/
│   └── shared-types/           # Shared TypeScript Types
├── data/                       # SQLite Datenbank (nicht versioniert)
└── pnpm-workspace.yaml         # pnpm Workspace Konfiguration
```

### Netzwerk

Alle Services laufen im gleichen Docker-Netzwerk (`cv-hub-network`):

- Services können sich gegenseitig über Service-Namen erreichen
- Frontend → Backend: `http://backend:3000`
- Backend → Frontend: `http://frontend:5173`

### Dependencies

Das Frontend startet erst, wenn das Backend healthy ist:

```yaml
depends_on:
  backend:
    condition: service_healthy
```

Der Backend Health-Check prüft alle 30 Sekunden:

```bash
curl -f http://localhost:3000/api/health
```

## Umgebungsvariablen

Siehe `.env.example` für alle verfügbaren Variablen:

### Backend

- `NODE_ENV` - Environment Mode (development/production/test)
- `PORT` - Server Port (default: 3000)
- `DATABASE_PATH` - SQLite Datenbank-Pfad
- `CORS_ORIGIN` - Erlaubte Frontend-Origin
- `LOG_LEVEL` - Logging-Level (debug/info/warn/error)

### Frontend

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Best Practices

1. **Nie .env committen** - Sensible Daten gehören nicht ins Repository
2. **Immer .env.example aktualisieren** - Template für andere Entwickler
3. **Anonymous Volumes nutzen** - Verhindert node_modules-Konflikte
4. **Health-Checks definieren** - Sicherstellt korrekte Service-Reihenfolge
5. **Hot-Reload für Development** - Schnellere Entwicklungszyklen
6. **Multi-Stage Builds für Production** - Kleinere Images, bessere Sicherheit

## Production Deployment

Für Production sollte eine separate `docker-compose.prod.yml` erstellt werden mit:

- Multi-Stage Dockerfiles (build + production)
- Optimierte Images (ohne Dev-Dependencies)
- Reverse Proxy (z.B. nginx)
- SSL/TLS-Terminierung
- Log-Aggregation
- Health-Monitoring
- Auto-Restart Policies

Beispiel:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Weitere Ressourcen

- [Docker Compose Dokumentation](https://docs.docker.com/compose/)
- [NestJS Docker Best Practices](https://docs.nestjs.com/recipes/docker)
- [Vite Docker Setup](https://vitejs.dev/guide/static-deploy.html)
- [pnpm Workspaces](https://pnpm.io/workspaces)
