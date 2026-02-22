'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { CronFormat, ExportTarget } from '@cronwizard/shared';
import { clientValidate, clientNextRuns, clientExport } from '@/lib/cron-client';
import { describeCron, normalizeCron } from '@cronwizard/shared';
import { FormatToggle } from '@/components/format-toggle';
import { TimezoneSelect } from '@/components/timezone-select';

const browserTz =
  typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

const EXPORT_TARGETS: { value: ExportTarget; label: string }[] = [
  { value: 'k8s', label: 'Kubernetes' },
  { value: 'gha', label: 'GitHub Actions' },
  { value: 'systemd', label: 'systemd' },
];

export function AdvancedEditor() {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const [format, setFormat] = useState<CronFormat>('unix');
  const [timezone, setTimezone] = useState(browserTz);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({
    valid: true,
    errors: [],
  });
  const [description, setDescription] = useState('');
  const [normalized, setNormalized] = useState<{ unix: string; quartz: string } | null>(null);
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [exportTarget, setExportTarget] = useState<ExportTarget | null>(null);
  const [exportText, setExportText] = useState('');

  const compute = useCallback(() => {
    const result = clientValidate(expression, format);
    setValidation(result);

    if (result.valid) {
      setDescription(describeCron(expression, format));
      setNormalized(normalizeCron(expression, format));
      try {
        const runs = clientNextRuns(expression, format, timezone, 10);
        setNextRuns(runs.human);
      } catch {
        setNextRuns([]);
      }
    } else {
      setDescription('');
      setNormalized(null);
      setNextRuns([]);
    }
  }, [expression, format, timezone]);

  useEffect(() => {
    const timer = setTimeout(compute, 400);
    return () => clearTimeout(timer);
  }, [compute]);

  const handleExport = (target: ExportTarget) => {
    try {
      const text = clientExport(expression, format, target);
      setExportTarget(target);
      setExportText(text);
    } catch {
      toast.error('Export failed');
    }
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="cron-input" className="text-sm font-medium">
          Cron Expression
        </label>
        <div className="flex gap-2">
          <input
            id="cron-input"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            aria-invalid={!validation.valid && !!expression}
            aria-describedby={!validation.valid ? 'cron-error' : undefined}
            className={`flex-1 rounded-md border px-4 py-3 font-mono text-lg ${
              !validation.valid && expression ? 'border-destructive' : ''
            }`}
            spellCheck={false}
          />
          <button
            onClick={() => copy(expression, 'Expression')}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Copy
          </button>
        </div>
        {!validation.valid && validation.errors.length > 0 && (
          <p id="cron-error" className="text-sm text-destructive" role="alert">
            {validation.errors[0]}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <FormatToggle value={format} onChange={setFormat} />
        <TimezoneSelect value={timezone} onChange={setTimezone} />
      </div>

      {validation.valid && description && (
        <section className="rounded-lg border bg-card p-4 space-y-2" aria-label="Cron description">
          <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
          <p className="text-lg">{description}</p>
          {normalized && (
            <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t">
              <div>
                <span className="text-xs text-muted-foreground">Unix</span>
                <p className="font-mono">{normalized.unix}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Quartz</span>
                <p className="font-mono">{normalized.quartz}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {nextRuns.length > 0 && (
        <section className="rounded-lg border bg-card p-4 space-y-2" aria-label="Next run times">
          <h2 className="text-sm font-medium text-muted-foreground">
            Next {nextRuns.length} Runs
          </h2>
          <ol className="space-y-1 text-sm font-mono list-none">
            {nextRuns.map((run, i) => (
              <li key={i} className="flex gap-2">
                <span className="w-5 text-right text-muted-foreground text-xs">{i + 1}.</span>
                <span>{run}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {validation.valid && (
        <section className="rounded-lg border bg-card p-4 space-y-3" aria-label="Export options">
          <h2 className="text-sm font-medium text-muted-foreground">Export</h2>
          <div className="flex gap-2">
            {EXPORT_TARGETS.map((t) => (
              <button
                key={t.value}
                onClick={() => handleExport(t.value)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  exportTarget === t.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {exportText && (
            <div className="relative">
              <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto whitespace-pre max-h-64 overflow-y-auto">
                {exportText}
              </pre>
              <button
                onClick={() => copy(exportText, 'Export config')}
                className="absolute top-2 right-2 rounded border bg-background px-2 py-1 text-xs hover:bg-muted"
              >
                Copy
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
