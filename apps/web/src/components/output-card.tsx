'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type {
  CronFormat,
  GenerateResponse,
  NextRunsResponse,
  ExportTarget,
} from '@cronwizard/shared';
import { clientExport } from '@/lib/cron-client';
import { cn } from '@/lib/utils';

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
  { value: 'docker', label: 'Docker Compose' },
  { value: 'terraform', label: 'Terraform' },
  { value: 'crontab', label: 'Crontab' },
  { value: 'launchd', label: 'macOS launchd' },
];

export function OutputCard({ result, nextRuns, format, error }: OutputCardProps) {
  const [exportTarget, setExportTarget] = useState<ExportTarget | null>(null);
  const [exportText, setExportText] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  if (error) {
    return (
      <div className="glass-panel rounded-xl border border-outline-variant/10 p-5">
        <p className="text-sm text-error font-medium">{error}</p>
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
    <output className="block space-y-6" aria-live="polite">
      {/* Main glass panel - prototype style */}
      <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 shadow-[0_16px_32px_rgba(0,0,0,0.3)] relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            <h2 className="font-headline text-base font-semibold text-on-surface">Generated Expression</h2>
          </div>
          <span
            className={cn(
              'text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold tracking-wider uppercase',
              result.warnings.length > 0
                ? 'bg-tertiary/20 text-tertiary'
                : 'bg-surface-bright text-primary',
            )}
          >
            {result.warnings.length > 0 ? 'Warning' : 'Valid'}
          </span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg mb-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <code className="font-mono text-2xl md:text-3xl font-bold tracking-wide text-on-surface">
            {result.cron}
          </code>
          <button
            type="button"
            onClick={() => copy(result.cron, 'Cron expression')}
            className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            Copy
          </button>
        </div>
        <div className="flex items-start gap-3 p-4 bg-surface-container-high/40 rounded-lg">
          <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">description</span>
          <div>
            <p className="font-headline font-semibold text-on-surface text-sm mb-0.5">Human Readable</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              &quot;{result.description}&quot;
            </p>
          </div>
        </div>
        {result.warnings.length > 0 && (
          <div
            className="mt-3 text-xs text-tertiary bg-tertiary/10 rounded-lg p-3"
            role="alert"
          >
            {result.warnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
        )}
        {/* Decoration elements */}
        <div className="absolute -z-10 -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute -z-10 -top-20 -left-20 w-64 h-64 bg-tertiary/5 blur-[100px] rounded-full" />
      </div>

      {/* Expandable details */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-xs font-medium"
      >
        <span
          className={cn(
            'material-symbols-outlined transition-transform',
            showDetails && 'rotate-180',
          )}
        >
          expand_more
        </span>
        {showDetails ? 'Hide' : 'Show'} Normalized Formats, Next Runs & Export
      </button>

      {showDetails && (
        <div className="space-y-3">
          <section
            className="glass-panel rounded-xl border border-outline-variant/10 p-5"
            aria-label="Normalized formats"
          >
            <h2 className="font-headline font-semibold text-primary text-sm mb-3">
              Normalized Formats
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-on-surface-variant">Unix</span>
                <div className="font-mono flex items-center gap-2 mt-1">
                  <span className="text-on-surface">{result.normalized.unix}</span>
                  <button
                    type="button"
                    onClick={() => copy(result.normalized.unix, 'Unix cron')}
                    className="text-xs text-primary hover:underline"
                  >
                    copy
                  </button>
                </div>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant">Quartz</span>
                <div className="font-mono flex items-center gap-2 mt-1">
                  <span className="text-on-surface">{result.normalized.quartz}</span>
                  <button
                    type="button"
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
            <section
              className="glass-panel rounded-xl border border-outline-variant/10 p-5"
              aria-label="Next run times"
            >
              <h2 className="font-headline font-semibold text-primary text-sm mb-3">
                Next {nextRuns.nextRuns.length} Runs
              </h2>
              <ol className="space-y-1 text-sm font-mono list-none">
                {nextRuns.human.map((run, i) => (
                  <li key={i} className="flex items-center gap-2 text-on-surface-variant">
                    <span className="w-5 text-right text-outline text-xs">{i + 1}.</span>
                    <time>{run}</time>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section
            className="glass-panel rounded-xl border border-outline-variant/10 p-5"
            aria-label="Export options"
          >
            <h2 className="font-headline font-semibold text-primary text-sm mb-3">Export</h2>
            <div className="flex flex-wrap gap-2">
              {EXPORT_TARGETS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleExport(t.value)}
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                    exportTarget === t.value
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {exportText && (
              <div className="relative mt-4">
                <pre className="bg-surface-container-lowest rounded-xl p-4 text-xs overflow-x-auto whitespace-pre max-h-64 overflow-y-auto text-on-surface-variant">
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
        </div>
      )}
    </output>
  );
}
