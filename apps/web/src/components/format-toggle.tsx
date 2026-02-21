'use client';

import type { CronFormat } from '@cronwizard/shared';
import { cn } from '@/lib/utils';

interface FormatToggleProps {
  value: CronFormat;
  onChange: (format: CronFormat) => void;
}

export function FormatToggle({ value, onChange }: FormatToggleProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Format</label>
      <div className="flex rounded-md border overflow-hidden w-fit">
        {(['unix', 'quartz'] as const).map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition-colors',
              value === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
            )}
          >
            {f === 'unix' ? 'Unix (5-field)' : 'Quartz (6-field)'}
          </button>
        ))}
      </div>
    </div>
  );
}
