import type {
  GenerateRequest,
  GenerateResponse,
  NextRunsRequest,
  NextRunsResponse,
  ValidateRequest,
  ValidateResponse,
  ExportRequest,
  ExportResponse,
} from '@cronwizard/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function post<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'API request failed');
  }
  return res.json();
}

export const api = {
  generate: (body: GenerateRequest) => post<GenerateRequest, GenerateResponse>('/v1/cron/generate', body),
  nextRuns: (body: NextRunsRequest) => post<NextRunsRequest, NextRunsResponse>('/v1/cron/next', body),
  validate: (body: ValidateRequest) => post<ValidateRequest, ValidateResponse>('/v1/cron/validate', body),
  export: (body: ExportRequest) => post<ExportRequest, ExportResponse>('/v1/cron/export', body),
};
