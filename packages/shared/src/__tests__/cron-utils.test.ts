import { describe, it, expect } from 'vitest';
import {
  generateCron,
  describeCron,
  getNextRuns,
  validateCron,
  normalizeCron,
  unixToQuartz,
  quartzToUnix,
} from '../cron-utils';

describe('generateCron', () => {
  it('generates every N minutes', () => {
    expect(generateCron('minutes', { every: 10 }, 'unix')).toBe('*/10 * * * *');
  });

  it('generates hourly at specified minute', () => {
    expect(generateCron('hourly', { at: { hour: 0, minute: 30 } }, 'unix')).toBe('30 * * * *');
  });

  it('generates daily at specified time', () => {
    expect(generateCron('daily', { at: { hour: 9, minute: 0 } }, 'unix')).toBe('0 9 * * *');
  });

  it('generates weekly on specific days', () => {
    expect(generateCron('weekly', { at: { hour: 9, minute: 0 }, days: [1, 3, 5] }, 'unix')).toBe(
      '0 9 * * 1,3,5',
    );
  });

  it('generates monthly on specific day', () => {
    expect(generateCron('monthly', { at: { hour: 8, minute: 30 }, dayOfMonth: 15 }, 'unix')).toBe(
      '30 8 15 * *',
    );
  });

  it('generates yearly', () => {
    expect(
      generateCron('yearly', { at: { hour: 0, minute: 0 }, dayOfMonth: 1, month: 6 }, 'unix'),
    ).toBe('0 0 1 6 *');
  });

  it('generates quartz format', () => {
    const result = generateCron('daily', { at: { hour: 9, minute: 0 } }, 'quartz');
    expect(result).toMatch(/^0 /);
  });

  it('passes through advanced expression', () => {
    expect(generateCron('advanced', { expression: '5 4 * * *' }, 'unix')).toBe('5 4 * * *');
  });
});

describe('unixToQuartz / quartzToUnix', () => {
  it('converts unix to quartz', () => {
    expect(unixToQuartz('0 9 * * 1-5')).toBe('0 0 9 ? * 2-6');
  });

  it('converts quartz back to unix', () => {
    expect(quartzToUnix('0 0 9 ? * 2-6')).toBe('0 9 * * 1-5');
  });

  it('handles simple daily cron', () => {
    const quartz = unixToQuartz('0 0 * * *');
    expect(quartz).toBe('0 0 0 * * *');
  });
});

describe('describeCron', () => {
  it('describes every 5 minutes', () => {
    const desc = describeCron('*/5 * * * *');
    expect(desc.toLowerCase()).toContain('5');
  });

  it('describes daily at 9:00', () => {
    const desc = describeCron('0 9 * * *');
    expect(desc).toContain('09:00');
  });

  it('handles invalid cron', () => {
    expect(describeCron('not a cron')).toBe('Invalid cron expression');
  });
});

describe('getNextRuns', () => {
  it('returns correct number of runs', () => {
    const runs = getNextRuns('*/5 * * * *', { count: 3 });
    expect(runs).toHaveLength(3);
  });

  it('respects timezone (Europe/Istanbul)', () => {
    const runs = getNextRuns('0 9 * * *', {
      count: 1,
      timezone: 'Europe/Istanbul',
      startDate: '2026-01-01T00:00:00Z',
    });
    expect(runs).toHaveLength(1);
    expect(runs[0]).toBeInstanceOf(Date);
  });

  it('returns dates in chronological order', () => {
    const runs = getNextRuns('0 * * * *', { count: 5 });
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
    }
  });
});

describe('validateCron', () => {
  it('validates correct cron', () => {
    expect(validateCron('*/5 * * * *')).toEqual({ valid: true, errors: [] });
  });

  it('rejects invalid cron', () => {
    const result = validateCron('invalid');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('normalizeCron', () => {
  it('normalizes unix to both formats', () => {
    const result = normalizeCron('0 9 * * 1-5', 'unix');
    expect(result.unix).toBe('0 9 * * 1-5');
    expect(result.quartz).toContain('0 0 9');
  });
});
