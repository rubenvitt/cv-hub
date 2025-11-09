# @cv-hub/shared-types

Shared TypeScript types and Zod schemas for end-to-end type safety across the CV Hub monorepo.

## Features

- **Runtime Validation:** Zod schemas validate data at runtime (API boundaries, user input)
- **Compile-Time Safety:** TypeScript types generated via `z.infer<>` ensure type correctness
- **Single Source of Truth:** Schema definitions automatically generate types - no drift
- **Monorepo Integration:** Seamless sharing between backend (NestJS) and frontend (TanStack Start)

## Installation

This package is consumed via pnpm workspace protocol:

```json
{
  "dependencies": {
    "@cv-hub/shared-types": "workspace:*"
  }
}
```

## Usage

### Backend (NestJS)

```typescript
import { HealthCheckResponseSchema, HealthCheckResponse } from '@cv-hub/shared-types';

@Get()
async getHealth(): Promise<HealthCheckResponse> {
  const response = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: 'connected' as const,
      type: 'sqlite' as const,
    },
  };

  // Runtime validation (optional but recommended)
  return HealthCheckResponseSchema.parse(response);
}
```

### Frontend (TanStack Start)

```typescript
import { HealthCheckResponseSchema, HealthCheckResponse } from '@cv-hub/shared-types';

export async function checkHealth(): Promise<HealthCheckResponse> {
  const res = await fetch('/api/health');
  const data = await res.json();

  // Runtime validation ensures API contract compliance
  return HealthCheckResponseSchema.parse(data);
}
```

## Available Schemas

### Epic 1: Health Check

- `HealthCheckResponseSchema` - API health check response
- `HealthCheckResponse` - TypeScript type

### Future Epics

- Epic 2: CV Schemas
- Epic 4: Invite Schemas
- Epic 5: Admin Schemas

## Development

```bash
# Install dependencies
pnpm install

# Build package
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## Architecture

- **No Business Logic:** This package contains ONLY types and schemas
- **Framework Agnostic:** Schemas work with any TypeScript framework
- **Workspace Protocol:** Always uses latest local version via `workspace:*`
