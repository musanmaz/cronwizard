'use client';

import { presets } from '@cronwizard/shared';
import type { CronFormat, WizardMode, WizardParams } from '@cronwizard/shared';

interface PresetListProps {
  onSelect: (mode: WizardMode, params: WizardParams, format: CronFormat) => void;
}

export function PresetList({ onSelect }: PresetListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Quick Presets</h3>
      <div className="flex flex-wrap gap-2">
        {presets.slice(0, 6).map((p) => (
          <button
            key={p.cron}
            onClick={() =>
              onSelect('advanced', { expression: p.cron }, p.format)
            }
            className="rounded-full border px-3 py-1 text-xs hover:bg-muted transition-colors"
            title={p.description}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
