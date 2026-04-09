'use client';

import { presets } from '@cronwizard/shared';
import type { CronFormat, WizardMode, WizardParams } from '@cronwizard/shared';

interface PresetListProps {
  onSelect: (mode: WizardMode, params: WizardParams, format: CronFormat) => void;
}

export function PresetList({ onSelect }: PresetListProps) {
  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-xs font-medium text-on-surface-variant">Quick Presets</h3>
      <div className="flex flex-wrap gap-1.5">
        {presets.slice(0, 6).map((p) => (
          <button
            key={p.cron}
            type="button"
            onClick={() => onSelect('advanced', { expression: p.cron }, p.format)}
            className="rounded-full border border-outline-variant/30 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            title={p.description}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
