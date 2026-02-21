export type CronFormat = 'unix' | 'quartz';

export type WizardMode =
  | 'minutes'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'advanced';

export type ExportTarget = 'k8s' | 'gha' | 'systemd';

export interface GenerateRequest {
  mode: WizardMode;
  params: WizardParams;
  format: CronFormat;
}

export interface WizardParams {
  every?: number;
  at?: { hour: number; minute: number };
  days?: number[];
  month?: number;
  dayOfMonth?: number;
  expression?: string;
}

export interface GenerateResponse {
  cron: string;
  description: string;
  warnings: string[];
  normalized: {
    unix: string;
    quartz: string;
  };
}

export interface NextRunsRequest {
  cron: string;
  format: CronFormat;
  timezone: string;
  count: number;
  startDate?: string;
}

export interface NextRunsResponse {
  nextRuns: string[];
  human: string[];
}

export interface ValidateRequest {
  cron: string;
  format: CronFormat;
}

export interface ValidateResponse {
  valid: boolean;
  errors: string[];
  normalized?: string;
}

export interface ExportRequest {
  cron: string;
  format: CronFormat;
  target: ExportTarget;
  options?: ExportOptions;
}

export interface ExportOptions {
  name?: string;
  image?: string;
  command?: string;
  description?: string;
}

export interface ExportResponse {
  text: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Preset {
  label: string;
  cron: string;
  format: CronFormat;
  description: string;
}
