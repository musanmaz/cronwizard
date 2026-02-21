import {
  generateCron,
  describeCron,
  getNextRuns,
  validateCron,
  normalizeCron,
  generateExport,
} from '@cronwizard/shared';
import type {
  CronFormat,
  WizardMode,
  WizardParams,
  ExportTarget,
  ExportOptions,
  GenerateResponse,
  NextRunsResponse,
  ValidateResponse,
} from '@cronwizard/shared';

export function clientGenerate(
  mode: WizardMode,
  params: WizardParams,
  format: CronFormat,
): GenerateResponse {
  const cron = generateCron(mode, params, format);
  const description = describeCron(cron, format);
  const normalized = normalizeCron(cron, format);
  const validation = validateCron(cron, format);
  return {
    cron,
    description,
    warnings: validation.valid ? [] : validation.errors,
    normalized,
  };
}

export function clientNextRuns(
  cron: string,
  format: CronFormat,
  timezone: string,
  count: number,
): NextRunsResponse {
  const runs = getNextRuns(cron, { count, timezone, format });
  return {
    nextRuns: runs.map((d) => d.toISOString()),
    human: runs.map((d) =>
      d.toLocaleString('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    ),
  };
}

export function clientValidate(cron: string, format: CronFormat): ValidateResponse {
  const result = validateCron(cron, format);
  return {
    ...result,
    normalized: result.valid ? normalizeCron(cron, format).unix : undefined,
  };
}

export function clientExport(
  cron: string,
  format: CronFormat,
  target: ExportTarget,
  options?: ExportOptions,
): string {
  const normalized = normalizeCron(cron, format);
  return generateExport(normalized.unix, target, options);
}
