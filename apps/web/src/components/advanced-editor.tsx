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
  { value: 'docker', label: 'Docker Compose' },
  { value: 'terraform', label: 'Terraform' },
  { value: 'crontab', label: 'Crontab' },
  { value: 'launchd', label: 'launchd' },
];

const inputClass =
  'flex-1 bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface font-mono text-base focus:ring-2 focus:ring-primary/20 transition-all outline-none';

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
        <label htmlFor="cron-input" className="block font-headline font-bold text-primary text-sm">
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
            className={`${inputClass} ${!validation.valid && expression ? 'ring-2 ring-error' : ''}`}
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => copy(expression, 'Expression')}
            className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            Copy
          </button>
        </div>
        {!validation.valid && validation.errors.length > 0 && (
          <p id="cron-error" className="text-sm text-error" role="alert">
            {validation.errors[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimezoneSelect value={timezone} onChange={setTimezone} />
        <FormatToggle value={format} onChange={setFormat} />
      </div>

      {validation.valid && description && (
        <section
          className="glass-panel rounded-xl border border-outline-variant/10 p-5"
          aria-label="Cron description"
        >
          <h2 className="font-headline font-semibold text-primary text-sm mb-3">Description</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
          {normalized && (
            <div className="grid grid-cols-2 gap-3 text-sm pt-4 mt-4 border-t border-outline-variant/20">
              <div>
                <span className="text-xs text-outline">Unix</span>
                <p className="font-mono text-on-surface mt-1">{normalized.unix}</p>
              </div>
              <div>
                <span className="text-xs text-outline">Quartz</span>
                <p className="font-mono text-on-surface mt-1">{normalized.quartz}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {nextRuns.length > 0 && (
        <section
          className="glass-panel rounded-xl border border-outline-variant/10 p-5"
          aria-label="Next run times"
        >
          <h2 className="font-headline font-semibold text-primary text-sm mb-3">
            Next {nextRuns.length} Runs
          </h2>
          <ol className="space-y-1 text-sm font-mono list-none">
            {nextRuns.map((run, i) => (
              <li key={i} className="flex gap-2 text-on-surface-variant">
                <span className="w-5 text-right text-outline text-xs">{i + 1}.</span>
                <span>{run}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {validation.valid && (
        <section
          className="glass-panel rounded-xl border border-outline-variant/10 p-5"
          aria-label="Export options"
        >
          <h2 className="font-headline font-semibold text-primary text-sm mb-3">Export</h2>
          <div className="flex flex-wrap gap-1.5">
            {EXPORT_TARGETS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleExport(t.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  exportTarget === t.value
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {exportText && (
            <div className="relative mt-3">
              <pre className="bg-surface-container-lowest rounded-lg p-3 text-xs overflow-x-auto whitespace-pre max-h-48 overflow-y-auto text-on-surface-variant">
                {exportText}
              </pre>
              <button
                type="button"
                onClick={() => copy(exportText, 'Export config')}
                className="absolute top-2 right-2 rounded-lg border border-outline-variant bg-surface-container-high px-2 py-1 text-xs text-on-surface-variant hover:bg-surface-container-highest transition-colors"
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
