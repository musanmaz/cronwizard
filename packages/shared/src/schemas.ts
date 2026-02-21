import { z } from 'zod';

export const cronFormatSchema = z.enum(['unix', 'quartz']);

export const wizardModeSchema = z.enum([
  'minutes',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'advanced',
]);

export const exportTargetSchema = z.enum(['k8s', 'gha', 'systemd']);

export const wizardParamsSchema = z.object({
  every: z.number().int().min(1).max(59).optional(),
  at: z
    .object({
      hour: z.number().int().min(0).max(23),
      minute: z.number().int().min(0).max(59),
    })
    .optional(),
  days: z.array(z.number().int().min(0).max(6)).optional(),
  month: z.number().int().min(1).max(12).optional(),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  expression: z.string().optional(),
});

export const generateRequestSchema = z.object({
  mode: wizardModeSchema,
  params: wizardParamsSchema,
  format: cronFormatSchema,
});

export const nextRunsRequestSchema = z.object({
  cron: z.string().min(1),
  format: cronFormatSchema,
  timezone: z.string().min(1),
  count: z.number().int().min(1).max(50),
  startDate: z.string().datetime().optional(),
});

export const validateRequestSchema = z.object({
  cron: z.string().min(1),
  format: cronFormatSchema,
});

export const exportOptionsSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  command: z.string().optional(),
  description: z.string().optional(),
});

export const exportRequestSchema = z.object({
  cron: z.string().min(1),
  format: cronFormatSchema,
  target: exportTargetSchema,
  options: exportOptionsSchema.optional(),
});
