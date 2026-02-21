import { NextResponse } from 'next/server';
import { validateRequestSchema, validateCron, normalizeCron } from '@cronwizard/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { cron, format } = parsed.data;
    const result = validateCron(cron, format);

    return NextResponse.json({
      ...result,
      normalized: result.valid ? normalizeCron(cron, format).unix : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
