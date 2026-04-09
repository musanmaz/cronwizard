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
    mode,
    setMode,
    params,
    updateParams,
    format,
    setFormat,
    timezone,
    setTimezone,
    result,
    nextRuns,
    error,
  } = useCronWizard();

  const handlePreset = (m: WizardMode, p: WizardParams, f: CronFormat) => {
    setMode(m);
    updateParams(p);
    setFormat(f);
  };

  return (
    <div className="space-y-10">
      {/* Schedule Type */}
      <section>
        <ModeSelector value={mode} onChange={setMode} />
        <PresetList onSelect={handlePreset} />
      </section>

      {/* Configuration Parameters */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-grow bg-outline-variant/20" />
          <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-outline">
            Configuration Parameters
          </h2>
          <div className="h-px flex-grow bg-outline-variant/20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ParamForm mode={mode} params={params} onChange={updateParams} />
          <TimezoneSelect value={timezone} onChange={setTimezone} />
          <FormatToggle value={format} onChange={setFormat} />
        </div>
      </section>

      {/* Step 3: Output */}
      <section className="relative">
        <OutputCard result={result} nextRuns={nextRuns} format={format} error={error} />
      </section>
    </div>
  );
}
