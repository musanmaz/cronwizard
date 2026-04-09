'use client';

import type { WizardMode, WizardParams } from '@cronwizard/shared';

const inputClass =
  'w-full bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface font-mono text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none';

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

  const timeValue = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = (e.target.value || '00:00').split(':').map(Number);
    setTime(h ?? 0, m ?? 0);
  };

  switch (mode) {
    case 'minutes':
      return (
        <div className="space-y-3">
          <label className="block font-headline font-bold text-primary text-sm">Every</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={59}
              value={params.every ?? 5}
              onChange={(e) => onChange({ every: Math.max(1, Math.min(59, +e.target.value)) })}
              className={`${inputClass} w-24`}
            />
            <span className="text-sm text-on-surface-variant">minutes</span>
          </div>
        </div>
      );

    case 'hourly':
      return (
        <div className="space-y-3">
          <label className="block font-headline font-bold text-primary text-sm">At minute</label>
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setTime(0, Math.max(0, Math.min(59, +e.target.value)))}
            className={`${inputClass} w-24`}
          />
        </div>
      );

    case 'daily':
      return (
        <div className="space-y-3">
          <label className="block font-headline font-bold text-primary text-sm">
            Execution Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className={inputClass}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-[18px]">
              schedule
            </span>
          </div>
        </div>
      );

    case 'weekly':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block font-headline font-bold text-primary text-sm">Days</label>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map((day, i) => {
                const selected = params.days?.includes(i) ?? false;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const days = params.days ?? [];
                      onChange({
                        days: selected ? days.filter((d) => d !== i) : [...days, i].sort(),
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selected
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <label className="block font-headline font-bold text-primary text-sm">
              Execution Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className={inputClass}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-[18px]">
                schedule
              </span>
            </div>
          </div>
        </div>
      );

    case 'monthly':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block font-headline font-bold text-primary text-sm">
              Day of month
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={params.dayOfMonth ?? 1}
              onChange={(e) => onChange({ dayOfMonth: Math.max(1, Math.min(31, +e.target.value)) })}
              className={`${inputClass} w-24`}
            />
          </div>
          <div className="space-y-3">
            <label className="block font-headline font-bold text-primary text-sm">
              Execution Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className={inputClass}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-[18px]">
                schedule
              </span>
            </div>
          </div>
        </div>
      );

    case 'yearly':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <label className="block font-headline font-bold text-primary text-sm">Month</label>
              <select
                value={params.month ?? 1}
                onChange={(e) => onChange({ month: +e.target.value })}
                className={`${inputClass} appearance-none`}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('en', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block font-headline font-bold text-primary text-sm">Day</label>
              <input
                type="number"
                min={1}
                max={31}
                value={params.dayOfMonth ?? 1}
                onChange={(e) =>
                  onChange({ dayOfMonth: Math.max(1, Math.min(31, +e.target.value)) })
                }
                className={`${inputClass} w-full`}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="block font-headline font-bold text-primary text-sm">
              Execution Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className={inputClass}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-[18px]">
                schedule
              </span>
            </div>
          </div>
        </div>
      );

    case 'advanced':
      return (
        <div className="space-y-3 md:col-span-2">
          <label className="block font-headline font-bold text-primary text-sm">
            Cron Expression
          </label>
          <input
            type="text"
            value={params.expression ?? ''}
            onChange={(e) => onChange({ expression: e.target.value })}
            placeholder="* * * * *"
            spellCheck={false}
            className={inputClass}
          />
        </div>
      );

    default:
      return null;
  }
}
