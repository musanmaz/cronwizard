import type { Preset } from './types';

export const presets: Preset[] = [
  {
    label: 'Every 5 minutes',
    cron: '*/5 * * * *',
    format: 'unix',
    description: 'Runs every 5 minutes',
  },
  {
    label: 'Every 15 minutes',
    cron: '*/15 * * * *',
    format: 'unix',
    description: 'Runs every 15 minutes',
  },
  {
    label: 'Every hour',
    cron: '0 * * * *',
    format: 'unix',
    description: 'Runs at the start of every hour',
  },
  {
    label: 'Every day at midnight',
    cron: '0 0 * * *',
    format: 'unix',
    description: 'Runs daily at 00:00',
  },
  {
    label: 'Weekdays at 09:00',
    cron: '0 9 * * 1-5',
    format: 'unix',
    description: 'Runs Monday to Friday at 09:00',
  },
  {
    label: '1st of every month',
    cron: '0 0 1 * *',
    format: 'unix',
    description: 'Runs at midnight on the 1st of every month',
  },
  {
    label: 'Every Sunday at 03:00',
    cron: '0 3 * * 0',
    format: 'unix',
    description: 'Runs every Sunday at 03:00',
  },
  {
    label: 'Twice a day (09:00 & 18:00)',
    cron: '0 9,18 * * *',
    format: 'unix',
    description: 'Runs at 09:00 and 18:00 daily',
  },
  {
    label: 'Every 30 minutes during business hours',
    cron: '*/30 9-17 * * 1-5',
    format: 'unix',
    description: 'Runs every 30 min, Mon-Fri 09-17',
  },
  {
    label: 'Yearly on Jan 1st',
    cron: '0 0 1 1 *',
    format: 'unix',
    description: 'Runs at midnight on January 1st',
  },
];
