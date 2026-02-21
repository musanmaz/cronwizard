import { Injectable, BadRequestException } from '@nestjs/common';
import {
  generateCron,
  describeCron,
  getNextRuns,
  validateCron,
  normalizeCron,
  generateExport,
} from '@cronwizard/shared';
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

@Injectable()
export class CronService {
  generate(body: GenerateRequest): GenerateResponse {
    const cron = generateCron(body.mode, body.params, body.format);
    const description = describeCron(cron, body.format);
    const normalized = normalizeCron(cron, body.format);
    const validation = validateCron(cron, body.format);
    const warnings: string[] = [];

    if (!validation.valid) {
      throw new BadRequestException({
        code: 'INVALID_GENERATED_CRON',
        message: 'Generated cron expression is invalid',
        details: validation.errors,
      });
    }

    return { cron, description, warnings, normalized };
  }

  nextRuns(body: NextRunsRequest): NextRunsResponse {
    const validation = validateCron(body.cron, body.format);
    if (!validation.valid) {
      throw new BadRequestException({
        code: 'INVALID_CRON',
        message: validation.errors[0],
        details: validation.errors,
      });
    }

    const runs = getNextRuns(body.cron, {
      count: body.count,
      timezone: body.timezone,
      startDate: body.startDate,
      format: body.format,
    });

    return {
      nextRuns: runs.map((d) => d.toISOString()),
      human: runs.map((d) =>
        d.toLocaleString('en-US', {
          timeZone: body.timezone,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      ),
    };
  }

  validate(body: ValidateRequest): ValidateResponse {
    const result = validateCron(body.cron, body.format);
    return {
      ...result,
      normalized: result.valid ? normalizeCron(body.cron, body.format).unix : undefined,
    };
  }

  export(body: ExportRequest): ExportResponse {
    const validation = validateCron(body.cron, body.format);
    if (!validation.valid) {
      throw new BadRequestException({
        code: 'INVALID_CRON',
        message: validation.errors[0],
        details: validation.errors,
      });
    }

    const normalized = normalizeCron(body.cron, body.format);
    const text = generateExport(normalized.unix, body.target, body.options);
    return { text };
  }
}
