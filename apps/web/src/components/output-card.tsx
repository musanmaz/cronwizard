'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { CronFormat, GenerateResponse, NextRunsResponse, ExportTarget } from '@cronwizard/shared';
import { clientExport } from '@/lib/cron-client';

interface OutputCardProps {
  result: GenerateResponse | null;
  nextRuns: NextRunsResponse | null;
  format: CronFormat;
  error: string | null;
}

const EXPORT_TARGETS: { value: ExportTarget; label: string }[] = [
  { value: 'k8s', label: 'Kubernetes CronJob' },
  { value: 'gha', label: 'GitHub Actions' },
  { value: 'systemd', label: 'systemd Timer' },
];

export function OutputCard({ result, nextRuns, format, error }: OutputCardProps) {
  const [exportTarget, setExportTarget] = useState<ExportTarget | null>(null);
  const [exportText, setExportText] = useState<string | null>(null);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
        <p className="text-sm text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleExport = (target: ExportTarget) => {
    try {
      const text = clientExport(result.cron, format, target);
      setExportTarget(target);
      setExportText(text);
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <output className="block space-y-4" aria-live="polite">
      <section className="rounded-lg border bg-card p-4 space-y-3" aria-label="Generated cron expression">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Cron Expression</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium uppercase">
            {format}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-2xl font-mono font-bold tracking-wider">{result.cron}</code>
          <button
            onClick={() => copy(result.cron, 'Cron expression')}
            className="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{result.description}</p>

        {result.warnings.length > 0 && (
          <div className="text-sm text-yellow-600 bg-yellow-50 rounded p-2" role="alert">
            {result.warnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border bg-card p-4 space-y-2" aria-label="Normalized formats">
        <h2 className="text-sm font-medium text-muted-foreground">Normalized Formats</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-muted-foreground">Unix</span>
            <div className="font-mono flex items-center gap-2">
              <span>{result.normalized.unix}</span>
              <button
                onClick={() => copy(result.normalized.unix, 'Unix cron')}
                className="text-xs text-primary hover:underline"
              >
                copy
              </button>
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Quartz</span>
            <div className="font-mono flex items-center gap-2">
              <span>{result.normalized.quartz}</span>
              <button
                onClick={() => copy(result.normalized.quartz, 'Quartz cron')}
                className="text-xs text-primary hover:underline"
              >
                copy
              </button>
            </div>
          </div>
        </div>
      </section>

      {nextRuns && nextRuns.nextRuns.length > 0 && (
        <section className="rounded-lg border bg-card p-4 space-y-2" aria-label="Next run times">
          <h2 className="text-sm font-medium text-muted-foreground">
            Next {nextRuns.nextRuns.length} Runs
          </h2>
          <ol className="space-y-1 text-sm font-mono list-none">
            {nextRuns.human.map((run, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-5 text-right text-muted-foreground text-xs">{i + 1}.</span>
                <time>{run}</time>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-lg border bg-card p-4 space-y-3" aria-label="Export options">
        <h2 className="text-sm font-medium text-muted-foreground">Export</h2>
        <div className="flex flex-wrap gap-2">
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
              className="absolute top-2 right-2 rounded border bg-background px-2 py-1 text-xs hover:bg-muted transition-colors"
            >
              Copy
            </button>
          </div>
        )}
      </section>
    </output>
  );
}
