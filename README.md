# CronWizard

Cron expression generator, validator, and scheduler toolkit. Monorepo with a Next.js frontend and NestJS backend.

## Requirements

| Tool    | Minimum Version |
|---------|----------------|
| Node.js | >= 20          |
| pnpm    | >= 9           |

If pnpm is not installed:

```bash
npm install -g pnpm
```

## Setup

```bash
# Clone the repo
git clone <repo-url> && cd cronwizard

# Install all dependencies
pnpm install

# Build the shared package (API and Web depend on it)
pnpm build:shared
```

## Project Structure

```
cronwizard/
├── apps/
│   ├── api/          # NestJS backend  (port 4000)
│   └── web/          # Next.js frontend (port 3000)
├── packages/
│   └── shared/       # Shared types, Zod schemas, cron helpers
├── package.json      # Root workspace scripts
└── pnpm-workspace.yaml
```

## Running

### All at once (API + Web)

```bash
pnpm dev
```

### API only

```bash
pnpm dev:api
```

The API runs at `http://localhost:4000` by default.
Swagger docs: `http://localhost:4000/docs`

### Web only

```bash
pnpm dev:web
```

The web app runs at `http://localhost:3000` by default.

## Build

```bash
# Build everything (shared first, then apps)
pnpm build

# Build individually
pnpm build:shared
pnpm build:api
pnpm build:web
```

## Test

```bash
# Run all tests
pnpm test

# Shared package tests only
pnpm --filter @cronwizard/shared test

# API tests only
pnpm --filter @cronwizard/api test
```

## API Endpoints

All endpoints are under the `/v1` prefix. Base URL: `http://localhost:4000`

| Method | Endpoint            | Description                                    |
|--------|---------------------|------------------------------------------------|
| POST   | `/v1/cron/generate` | Generate a cron expression from wizard params  |
| POST   | `/v1/cron/next`     | Get upcoming run times for a cron expression   |
| POST   | `/v1/cron/validate` | Validate a cron expression                     |
| POST   | `/v1/cron/export`   | Export in k8s / GitHub Actions / systemd format|
| GET    | `/healthz`          | Liveness probe                                 |
| GET    | `/readyz`           | Readiness probe                                |

### Example: Generate a Cron Expression

```bash
curl -X POST http://localhost:4000/v1/cron/generate \
  -H "Content-Type: application/json" \
  -d '{"mode": "daily", "params": {"at": {"hour": 9, "minute": 0}}, "format": "unix"}'
```

### Example: Get Next Run Times

```bash
curl -X POST http://localhost:4000/v1/cron/next \
  -H "Content-Type: application/json" \
  -d '{"cron": "0 9 * * 1-5", "format": "unix", "timezone": "Europe/Istanbul", "count": 5}'
```

### Example: Export (Kubernetes CronJob)

```bash
curl -X POST http://localhost:4000/v1/cron/export \
  -H "Content-Type: application/json" \
  -d '{"cron": "0 9 * * 1-5", "format": "unix", "target": "k8s", "options": {"name": "my-job", "image": "alpine:latest", "command": "echo hello"}}'
```

## Environment Variables

| Variable      | Default                  | Description                          |
|---------------|--------------------------|--------------------------------------|
| `PORT`        | `4000`                   | API server port                      |
| `CORS_ORIGIN` | `http://localhost:3000`  | Allowed origins (comma-separated)    |

## Useful Commands

```bash
pnpm format          # Format with Prettier
pnpm format:check    # Check formatting
pnpm lint            # Run ESLint
pnpm clean           # Remove build artifacts
```

## Deploy to Vercel

This project is configured for a single Vercel deployment.
Next.js API Route Handlers eliminate the need for a separate backend server.

### Steps

1. [Vercel Dashboard](https://vercel.com/new) → "Import Git Repository"
2. Select the repo
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: set to `apps/web`
5. Build & install commands are managed automatically by `apps/web/vercel.json`:
   - Install: `cd ../.. && pnpm install`
   - Build: `cd ../.. && pnpm build:shared && pnpm build:web`
6. Deploy

### Environment Variables (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Use an external API server (default: `/api`, i.e. same Vercel deployment) |

### Architecture

On Vercel, Next.js API Route Handlers run as serverless functions:

| Endpoint | Type |
|----------|------|
| `/api/v1/cron/generate` | Serverless Function |
| `/api/v1/cron/next` | Serverless Function |
| `/api/v1/cron/validate` | Serverless Function |
| `/api/v1/cron/export` | Serverless Function |
| `/api/healthz` | Static (edge) |

> **Note**: The standalone NestJS API (`apps/api`) can also be run via Docker or on your own server.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: NestJS 10 + TypeScript + Swagger
- **Shared**: Zod schemas + cron-parser + cronstrue
- **Testing**: Vitest + Supertest
- **Security**: Helmet + Rate Limiting (60 req/min)

## License

MIT
