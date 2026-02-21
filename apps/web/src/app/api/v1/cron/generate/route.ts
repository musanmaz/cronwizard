import { NextResponse } from 'next/server';
import {
  generateRequestSchema,
  generateCron,
  describeCron,
  normalizeCron,
  validateCron,
} from '@cronwizard/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { mode, params, format } = parsed.data;
    const cron = generateCron(mode, params, format);
    const description = describeCron(cron, format);
    const normalized = normalizeCron(cron, format);
    const validation = validateCron(cron, format);

    if (!validation.valid) {
      return NextResponse.json(
        { code: 'INVALID_GENERATED_CRON', message: 'Generated cron is invalid', details: validation.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ cron, description, warnings: [], normalized });
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
