import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  GenerateRequest,
  NextRunsRequest,
  ValidateRequest,
  ExportRequest,
  WizardParams,
  CronFormat,
  WizardMode,
  ExportTarget,
  ExportOptions,
} from '@cronwizard/shared';

class WizardParamsDto implements WizardParams {
  @ApiPropertyOptional({ example: 5 })
  every?: number;

  @ApiPropertyOptional({ example: { hour: 9, minute: 0 } })
  at?: { hour: number; minute: number };

  @ApiPropertyOptional({ example: [1, 3, 5] })
  days?: number[];

  @ApiPropertyOptional({ example: 1 })
  month?: number;

  @ApiPropertyOptional({ example: 15 })
  dayOfMonth?: number;

  @ApiPropertyOptional({ example: '*/5 * * * *' })
  expression?: string;
}

export class GenerateDto implements GenerateRequest {
  @ApiProperty({ enum: ['minutes', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'advanced'] })
  mode!: WizardMode;

  @ApiProperty({ type: WizardParamsDto })
  params!: WizardParams;

  @ApiProperty({ enum: ['unix', 'quartz'] })
  format!: CronFormat;
}

export class NextRunsDto implements NextRunsRequest {
  @ApiProperty({ example: '*/5 * * * *' })
  cron!: string;

  @ApiProperty({ enum: ['unix', 'quartz'] })
  format!: CronFormat;

  @ApiProperty({ example: 'Europe/Istanbul' })
  timezone!: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 50 })
  count!: number;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00Z' })
  startDate?: string;
}

export class ValidateDto implements ValidateRequest {
  @ApiProperty({ example: '0 9 * * 1-5' })
  cron!: string;

  @ApiProperty({ enum: ['unix', 'quartz'] })
  format!: CronFormat;
}

class ExportOptionsDto implements ExportOptions {
  @ApiPropertyOptional({ example: 'my-cronjob' })
  name?: string;

  @ApiPropertyOptional({ example: 'busybox:latest' })
  image?: string;

  @ApiPropertyOptional({ example: 'echo hello' })
  command?: string;

  @ApiPropertyOptional({ example: 'My scheduled task' })
  description?: string;
}

export class ExportDto implements ExportRequest {
  @ApiProperty({ example: '0 9 * * 1-5' })
  cron!: string;

  @ApiProperty({ enum: ['unix', 'quartz'] })
  format!: CronFormat;

  @ApiProperty({ enum: ['k8s', 'gha', 'systemd'] })
  target!: ExportTarget;

  @ApiPropertyOptional({ type: ExportOptionsDto })
  options?: ExportOptions;
}
