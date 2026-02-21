'use client';

import { useState, useCallback, useEffect } from 'react';
import type { CronFormat, WizardMode, WizardParams, GenerateResponse, NextRunsResponse } from '@cronwizard/shared';
import { clientGenerate, clientNextRuns, clientValidate } from '@/lib/cron-client';

const browserTimezone = typeof Intl !== 'undefined'
  ? Intl.DateTimeFormat().resolvedOptions().timeZone
  : 'UTC';

export interface CronWizardState {
  mode: WizardMode;
  params: WizardParams;
  format: CronFormat;
  timezone: string;
  result: GenerateResponse | null;
  nextRuns: NextRunsResponse | null;
  error: string | null;
}

export function useCronWizard() {
  const [mode, setMode] = useState<WizardMode>('daily');
  const [params, setParams] = useState<WizardParams>({ at: { hour: 9, minute: 0 } });
  const [format, setFormat] = useState<CronFormat>('unix');
  const [timezone, setTimezone] = useState(browserTimezone);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [nextRuns, setNextRuns] = useState<NextRunsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(() => {
    try {
      const gen = clientGenerate(mode, params, format);
      setResult(gen);
      setError(null);

      const validation = clientValidate(gen.cron, format);
      if (validation.valid) {
        const runs = clientNextRuns(gen.cron, format, timezone, 10);
        setNextRuns(runs);
      } else {
        setNextRuns(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult(null);
      setNextRuns(null);
    }
  }, [mode, params, format, timezone]);

  useEffect(() => {
    compute();
  }, [compute]);

  const updateParams = useCallback((patch: Partial<WizardParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
    mode, setMode,
    params, updateParams,
    format, setFormat,
    timezone, setTimezone,
    result, nextRuns, error,
  };
}
