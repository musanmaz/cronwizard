'use client';

import type { WizardMode } from '@cronwizard/shared';
import { cn } from '@/lib/utils';

const modes: {
  value: WizardMode;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    value: 'minutes',
    label: 'Minutes',
    desc: 'Run every X minutes or at specific minute marks.',
    icon: 'schedule',
  },
  {
    value: 'hourly',
    label: 'Hourly',
    desc: 'Execute at set intervals throughout the day.',
    icon: 'hourglass_empty',
  },
  {
    value: 'daily',
    label: 'Daily',
    desc: 'Daily recurrence at a specific time signature.',
    icon: 'calendar_today',
  },
  {
    value: 'weekly',
    label: 'Weekly',
    desc: 'Choose specific days of the week to execute.',
    icon: 'view_week',
  },
  {
    value: 'monthly',
    label: 'Monthly',
    desc: 'Recurring monthly execution on set dates.',
    icon: 'calendar_month',
  },
  {
    value: 'yearly',
    label: 'Yearly',
    desc: 'Annual tasks triggered by specific date marks.',
    icon: 'event_repeat',
  },
  {
    value: 'advanced',
    label: 'Custom',
    desc: 'Enter any cron expression directly.',
    icon: 'edit_note',
  },
];

interface ModeSelectorProps {
  value: WizardMode;
  onChange: (mode: WizardMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {modes.map((m) => {
        const isSelected = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={cn(
              'group p-4 rounded-lg text-left transition-all duration-200 border',
              isSelected
                ? 'bg-surface-container-high ring-2 ring-primary'
                : 'bg-surface-container-low hover:bg-surface-container-high border-transparent hover:border-primary/20',
            )}
          >
            <span
              className={cn(
                'material-symbols-outlined text-primary mb-2 block text-[20px] transition-transform',
                isSelected ? '' : 'group-hover:scale-105',
              )}
              style={
                isSelected && m.icon === 'hourglass_empty'
                  ? { fontVariationSettings: '"FILL" 1' }
                  : undefined
              }
            >
              {m.icon}
            </span>
            <h3 className="font-headline text-base font-semibold text-on-surface mb-0.5">{m.label}</h3>
            <p className="text-xs text-on-surface-variant/80 leading-snug">{m.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
