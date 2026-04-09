'use client';

import type { CronFormat } from '@cronwizard/shared';
import { cn } from '@/lib/utils';

interface FormatToggleProps {
  value: CronFormat;
  onChange: (format: CronFormat) => void;
}

export function FormatToggle({ value, onChange }: FormatToggleProps) {
  return (
    <div className="space-y-3 md:col-span-2">
      <label className="block font-headline font-bold text-primary text-sm">Engine Format</label>
      <div className="bg-surface-container-lowest p-1 rounded-full flex max-w-xs">
        <button
          type="button"
          onClick={() => onChange('unix')}
          className={cn(
            'flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all',
            value === 'unix'
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant font-medium hover:text-on-surface',
          )}
        >
          Unix / Crontab
        </button>
        <button
          type="button"
          onClick={() => onChange('quartz')}
          className={cn(
            'flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all',
            value === 'quartz'
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant font-medium hover:text-on-surface',
          )}
        >
          Quartz Scheduler
        </button>
      </div>
    </div>
  );
}
