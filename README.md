# CronWizard

Cron expression generator, validator ve scheduler toolkit. Monorepo yapısında Next.js frontend + NestJS backend.

## Gereksinimler

| Araç   | Minimum Versiyon |
|--------|-----------------|
| Node.js | >= 20           |
| pnpm    | >= 9            |

pnpm kurulu değilse:

```bash
npm install -g pnpm
```

## Kurulum

```bash
# Repo'yu klonla
git clone <repo-url> && cd cronwizard

# Tüm bağımlılıkları yükle
pnpm install

# Shared paketi build et (API ve Web buna bağımlı)
pnpm build:shared
```

## Proje Yapısı

```
cronwizard/
├── apps/
│   ├── api/          # NestJS backend  (port 4000)
│   └── web/          # Next.js frontend (port 3000)
├── packages/
│   └── shared/       # Ortak tipler, zod şemaları, cron yardımcıları
├── package.json      # Root workspace scripts
└── pnpm-workspace.yaml
```

## Çalıştırma

### Hepsini birden (API + Web)

```bash
pnpm dev
```

### Sadece API

```bash
pnpm dev:api
```

API varsayılan olarak `http://localhost:4000` adresinde çalışır.
Swagger dokümantasyonu: `http://localhost:4000/docs`

### Sadece Web

```bash
pnpm dev:web
```

Web varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Build

```bash
# Tümünü build et (önce shared, sonra apps)
pnpm build

# Tek tek build
pnpm build:shared
pnpm build:api
pnpm build:web
```

## Test

```bash
# Tüm testleri çalıştır
pnpm test

# Sadece shared paket testleri
pnpm --filter @cronwizard/shared test

# Sadece API testleri
pnpm --filter @cronwizard/api test
```

## API Endpoint'leri

Tüm endpoint'ler `/v1` prefix'i altında. Base URL: `http://localhost:4000`

| Method | Endpoint            | Açıklama                                     |
|--------|---------------------|----------------------------------------------|
| POST   | `/v1/cron/generate` | Wizard parametrelerinden cron üret            |
| POST   | `/v1/cron/next`     | Cron ifadesi için gelecek çalışma zamanları   |
| POST   | `/v1/cron/validate` | Cron ifadesini doğrula                        |
| POST   | `/v1/cron/export`   | k8s / GitHub Actions / systemd formatında export |
| GET    | `/healthz`          | Liveness probe                                |
| GET    | `/readyz`           | Readiness probe                               |

### Örnek: Cron Üretme

```bash
curl -X POST http://localhost:4000/v1/cron/generate \
  -H "Content-Type: application/json" \
  -d '{"mode": "daily", "params": {"at": {"hour": 9, "minute": 0}}, "format": "unix"}'
```

### Örnek: Sonraki Çalışma Zamanları

```bash
curl -X POST http://localhost:4000/v1/cron/next \
  -H "Content-Type: application/json" \
  -d '{"cron": "0 9 * * 1-5", "format": "unix", "timezone": "Europe/Istanbul", "count": 5}'
```

### Örnek: Export (Kubernetes CronJob)

```bash
curl -X POST http://localhost:4000/v1/cron/export \
  -H "Content-Type: application/json" \
  -d '{"cron": "0 9 * * 1-5", "format": "unix", "target": "k8s", "options": {"name": "my-job", "image": "alpine:latest", "command": "echo hello"}}'
```

## Ortam Değişkenleri

| Değişken      | Varsayılan               | Açıklama                     |
|---------------|--------------------------|------------------------------|
| `PORT`        | `4000`                   | API sunucu portu             |
| `CORS_ORIGIN` | `http://localhost:3000`  | İzin verilen origin'ler (virgülle ayır) |

## Kullanışlı Komutlar

```bash
pnpm format          # Prettier ile formatla
pnpm format:check    # Format kontrolü
pnpm lint            # ESLint çalıştır
pnpm clean           # Build çıktılarını temizle
```

## Teknoloji Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: NestJS 10 + TypeScript + Swagger
- **Shared**: Zod şemaları + cron-parser + cronstrue
- **Test**: Vitest + Supertest
- **Güvenlik**: Helmet + Rate Limiting (60 req/dk)

## Lisans

MIT
