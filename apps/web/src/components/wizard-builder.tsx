'use client';

import { useCronWizard } from '@/hooks/use-cron-wizard';
import { ModeSelector } from './mode-selector';
import { ParamForm } from './param-form';
import { OutputCard } from './output-card';
import { FormatToggle } from './format-toggle';
import { TimezoneSelect } from './timezone-select';
import { PresetList } from './preset-list';
import type { WizardMode, WizardParams, CronFormat } from '@cronwizard/shared';

export function WizardBuilder() {
  const {
    mode, setMode,
    params, updateParams,
    format, setFormat,
    timezone, setTimezone,
    result, nextRuns, error,
  } = useCronWizard();

  const handlePreset = (m: WizardMode, p: WizardParams, f: CronFormat) => {
    setMode(m);
    updateParams(p);
    setFormat(f);
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Mode */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </span>
          <h2 className="text-lg font-semibold">Choose Schedule Type</h2>
        </div>
        <ModeSelector value={mode} onChange={setMode} />
        <PresetList onSelect={handlePreset} />
      </section>

      {/* Step 2: Parameters */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            2
          </span>
          <h2 className="text-lg font-semibold">Configure Parameters</h2>
        </div>
        <div className="rounded-lg border p-4 space-y-4">
          <ParamForm mode={mode} params={params} onChange={updateParams} />
          <div className="flex flex-wrap gap-6 pt-2 border-t">
            <FormatToggle value={format} onChange={setFormat} />
            <TimezoneSelect value={timezone} onChange={setTimezone} />
          </div>
        </div>
      </section>

      {/* Step 3: Output */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            3
          </span>
          <h2 className="text-lg font-semibold">Result</h2>
        </div>
        <OutputCard result={result} nextRuns={nextRuns} format={format} error={error} />
      </section>
    </div>
  );
}
