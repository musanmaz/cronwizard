import { NextResponse } from 'next/server';
import {
  exportRequestSchema,
  validateCron,
  normalizeCron,
  generateExport,
} from '@cronwizard/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = exportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { cron, format, target, options } = parsed.data;
    const validation = validateCron(cron, format);

    if (!validation.valid) {
      return NextResponse.json(
        { code: 'INVALID_CRON', message: validation.errors[0], details: validation.errors },
        { status: 400 },
      );
    }

    const normalized = normalizeCron(cron, format);
    const text = generateExport(normalized.unix, target, options);

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
