import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import type { CronFormat, WizardMode, WizardParams } from './types';

export function generateCron(
  mode: WizardMode,
  params: WizardParams,
  format: CronFormat,
): string {
  let unix: string;

  switch (mode) {
    case 'minutes':
      unix = `*/${params.every ?? 5} * * * *`;
      break;
    case 'hourly': {
      const min = params.at?.minute ?? 0;
      unix = `${min} * * * *`;
      break;
    }
    case 'daily': {
      const h = params.at?.hour ?? 0;
      const m = params.at?.minute ?? 0;
      unix = `${m} ${h} * * *`;
      break;
    }
    case 'weekly': {
      const h = params.at?.hour ?? 9;
      const m = params.at?.minute ?? 0;
      const days = params.days?.length ? params.days.join(',') : '1-5';
      unix = `${m} ${h} * * ${days}`;
      break;
    }
    case 'monthly': {
      const h = params.at?.hour ?? 0;
      const m = params.at?.minute ?? 0;
      const dom = params.dayOfMonth ?? 1;
      unix = `${m} ${h} ${dom} * *`;
      break;
    }
    case 'yearly': {
      const h = params.at?.hour ?? 0;
      const m = params.at?.minute ?? 0;
      const dom = params.dayOfMonth ?? 1;
      const mon = params.month ?? 1;
      unix = `${m} ${h} ${dom} ${mon} *`;
      break;
    }
    case 'advanced':
      unix = params.expression ?? '* * * * *';
      break;
    default:
      unix = '* * * * *';
  }

  return format === 'quartz' ? unixToQuartz(unix) : unix;
}

export function unixToQuartz(unix: string): string {
  const parts = unix.trim().split(/\s+/);
  if (parts.length === 6) return unix;
  if (parts.length !== 5) throw new Error(`Invalid unix cron: ${unix}`);
  const [minute, hour, dom, month, dow] = parts;
  const quartzDow = convertDowUnixToQuartz(dow);
  const quartzDom = dow !== '*' && dom === '*' ? '?' : dom;
  const quartzDowField = dom !== '*' && dow === '*' ? '?' : quartzDow;
  return `0 ${minute} ${hour} ${quartzDom} ${month} ${quartzDowField}`;
}

export function quartzToUnix(quartz: string): string {
  const parts = quartz.trim().split(/\s+/);
  if (parts.length !== 6 && parts.length !== 7) {
    throw new Error(`Invalid quartz cron: ${quartz}`);
  }
  const [, minute, hour, dom, month, dow] = parts;
  const unixDow = convertDowQuartzToUnix(dow);
  const unixDom = dom === '?' ? '*' : dom;
  const unixDowField = dow === '?' ? '*' : unixDow;
  return `${minute} ${hour} ${unixDom} ${month} ${unixDowField}`;
}

function convertDowUnixToQuartz(dow: string): string {
  if (dow === '*') return '*';
  return dow.replace(/\d/g, (d) => {
    const n = parseInt(d, 10);
    return String(n === 0 ? 1 : n + 1);
  });
}

function convertDowQuartzToUnix(dow: string): string {
  if (dow === '*' || dow === '?') return '*';
  const dayMap: Record<string, string> = {
    SUN: '0', MON: '1', TUE: '2', WED: '3', THU: '4', FRI: '5', SAT: '6',
  };
  let result = dow;
  for (const [name, num] of Object.entries(dayMap)) {
    result = result.replace(new RegExp(name, 'gi'), num);
  }
  result = result.replace(/\d/g, (d) => {
    const n = parseInt(d, 10);
    return String(n <= 1 ? 0 : n - 1);
  });
  return result;
}

export function describeCron(cron: string, format: CronFormat = 'unix'): string {
  try {
    const expr = format === 'quartz' ? quartzToUnix(cron) : cron;
    return cronstrue.toString(expr, { use24HourTimeFormat: true });
  } catch {
    return 'Invalid cron expression';
  }
}

export function getNextRuns(
  cron: string,
  options: { count?: number; timezone?: string; startDate?: string; format?: CronFormat } = {},
): Date[] {
  const { count = 5, timezone = 'UTC', startDate, format = 'unix' } = options;
  const expr = format === 'quartz' ? quartzToUnix(cron) : cron;

  const interval = CronExpressionParser.parse(expr, {
    currentDate: startDate ? new Date(startDate) : new Date(),
    tz: timezone,
  });

  const runs: Date[] = [];
  for (let i = 0; i < count; i++) {
    const next = interval.next();
    runs.push(next.toDate());
  }
  return runs;
}

export function validateCron(
  cron: string,
  format: CronFormat = 'unix',
): { valid: boolean; errors: string[] } {
  try {
    const expr = format === 'quartz' ? quartzToUnix(cron) : cron;
    CronExpressionParser.parse(expr);
    return { valid: true, errors: [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid cron expression';
    return { valid: false, errors: [message] };
  }
}

export function normalizeCron(cron: string, format: CronFormat): { unix: string; quartz: string } {
  if (format === 'quartz') {
    const unix = quartzToUnix(cron);
    return { unix, quartz: cron };
  }
  return { unix: cron, quartz: unixToQuartz(cron) };
}
