'use client';

import type { WizardMode, WizardParams } from '@cronwizard/shared';

interface ParamFormProps {
  mode: WizardMode;
  params: WizardParams;
  onChange: (patch: Partial<WizardParams>) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ParamForm({ mode, params, onChange }: ParamFormProps) {
  const hour = params.at?.hour ?? 0;
  const minute = params.at?.minute ?? 0;

  const setTime = (h: number, m: number) => onChange({ at: { hour: h, minute: m } });

  switch (mode) {
    case 'minutes':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">Every</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={59}
              value={params.every ?? 5}
              onChange={(e) => onChange({ every: Math.max(1, Math.min(59, +e.target.value)) })}
              className="w-20 rounded-md border px-3 py-2 text-sm"
            />
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        </div>
      );

    case 'hourly':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">At minute</label>
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setTime(0, Math.max(0, Math.min(59, +e.target.value)))}
            className="w-20 rounded-md border px-3 py-2 text-sm"
          />
        </div>
      );

    case 'daily':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">At time</label>
          <TimeInput hour={hour} minute={minute} onChange={setTime} />
        </div>
      );

    case 'weekly':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day, i) => {
                const selected = params.days?.includes(i) ?? false;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      const days = params.days ?? [];
                      onChange({
                        days: selected ? days.filter((d) => d !== i) : [...days, i].sort(),
                      });
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">At time</label>
            <TimeInput hour={hour} minute={minute} onChange={setTime} />
          </div>
        </div>
      );

    case 'monthly':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Day of month</label>
            <input
              type="number"
              min={1}
              max={31}
              value={params.dayOfMonth ?? 1}
              onChange={(e) => onChange({ dayOfMonth: Math.max(1, Math.min(31, +e.target.value)) })}
              className="w-20 rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">At time</label>
            <TimeInput hour={hour} minute={minute} onChange={setTime} />
          </div>
        </div>
      );

    case 'yearly':
      return (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <select
                value={params.month ?? 1}
                onChange={(e) => onChange({ month: +e.target.value })}
                className="rounded-md border px-3 py-2 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('en', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Day</label>
              <input
                type="number"
                min={1}
                max={31}
                value={params.dayOfMonth ?? 1}
                onChange={(e) => onChange({ dayOfMonth: Math.max(1, Math.min(31, +e.target.value)) })}
                className="w-20 rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">At time</label>
            <TimeInput hour={hour} minute={minute} onChange={setTime} />
          </div>
        </div>
      );

    default:
      return null;
  }
}

function TimeInput({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min={0}
        max={23}
        value={String(hour).padStart(2, '0')}
        onChange={(e) => onChange(Math.max(0, Math.min(23, +e.target.value)), minute)}
        className="w-16 rounded-md border px-3 py-2 text-sm text-center"
      />
      <span className="text-lg font-bold">:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={String(minute).padStart(2, '0')}
        onChange={(e) => onChange(hour, Math.max(0, Math.min(59, +e.target.value)))}
        className="w-16 rounded-md border px-3 py-2 text-sm text-center"
      />
    </div>
  );
}
