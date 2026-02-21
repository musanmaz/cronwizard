'use client';

import type { WizardMode } from '@cronwizard/shared';
import { cn } from '@/lib/utils';

const modes: { value: WizardMode; label: string; desc: string }[] = [
  { value: 'minutes', label: 'Minutes', desc: 'Every N minutes' },
  { value: 'hourly', label: 'Hourly', desc: 'At specific minute' },
  { value: 'daily', label: 'Daily', desc: 'At specific time' },
  { value: 'weekly', label: 'Weekly', desc: 'On specific days' },
  { value: 'monthly', label: 'Monthly', desc: 'On specific date' },
  { value: 'yearly', label: 'Yearly', desc: 'Once a year' },
];

interface ModeSelectorProps {
  value: WizardMode;
  onChange: (mode: WizardMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            'rounded-lg border-2 p-3 text-left transition-all hover:border-primary/50',
            value === m.value
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:bg-muted/50',
          )}
        >
          <div className="font-medium text-sm">{m.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
        </button>
      ))}
    </div>
  );
}
