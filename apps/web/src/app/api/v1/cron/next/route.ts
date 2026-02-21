import { NextResponse } from 'next/server';
import { nextRunsRequestSchema, validateCron, getNextRuns } from '@cronwizard/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = nextRunsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { cron, format, timezone, count, startDate } = parsed.data;
    const validation = validateCron(cron, format);

    if (!validation.valid) {
      return NextResponse.json(
        { code: 'INVALID_CRON', message: validation.errors[0], details: validation.errors },
        { status: 400 },
      );
    }

    const runs = getNextRuns(cron, { count, timezone, startDate, format });

    return NextResponse.json({
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
          second: '2-digit',
          hour12: false,
        }),
      ),
    });
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
