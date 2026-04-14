import type { Metadata } from 'next';
import Link from 'next/link';
import { WizardBuilder } from '@/components/wizard-builder';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Free Online Cron Expression Generator',
  description:
    'Generate cron expressions online for free — use the visual wizard to create Unix or Quartz cron schedules in seconds. No signup required. Export to Kubernetes, GitHub Actions, systemd.',
  path: '/generator',
  keywords: [
    'cron expression generator',
    'cron expression generator online',
    'cron generator',
    'crontab generator',
    'cron schedule generator',
    'online cron generator',
    'free cron generator',
    'cron expression maker',
  ],
});

export default function GeneratorPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Cron Generator', url: `${siteConfig.url}/generator` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-5xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
            Free Online Cron Expression Generator
          </h1>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Create cron expressions visually — no syntax memorization needed. Select your schedule,
            see it in plain English, preview the next runs, and export with one click.
          </p>
        </header>

        <WizardBuilder />

        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">
            How to Use This Cron Generator
          </h2>
          <ol className="list-decimal pl-6 space-y-3 text-on-surface-variant text-sm leading-relaxed">
            <li>
              <strong className="text-on-surface">Choose your format</strong> — select Unix (5 fields)
              or Quartz (6-7 fields) depending on your platform.
            </li>
            <li>
              <strong className="text-on-surface">Set each field</strong> — use the visual selectors
              to configure minute, hour, day of month, month, and day of week.
            </li>
            <li>
              <strong className="text-on-surface">Review the expression</strong> — see the generated
              cron expression and its human-readable description in real time.
            </li>
            <li>
              <strong className="text-on-surface">Preview next runs</strong> — check the next scheduled
              run times with your preferred timezone to confirm the schedule is correct.
            </li>
            <li>
              <strong className="text-on-surface">Export or copy</strong> — copy the expression to your
              clipboard or export directly as a Kubernetes CronJob YAML, GitHub Actions workflow, or
              systemd timer unit.
            </li>
          </ol>

          <h2 className="font-headline text-xl font-bold text-on-surface mt-10 mb-4">
            Supported Platforms
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-on-surface-variant text-sm leading-relaxed">
            <li><strong className="text-on-surface">Linux / macOS crontab</strong> — standard 5-field Unix cron</li>
            <li><strong className="text-on-surface">Kubernetes CronJob</strong> — 5-field cron with YAML export</li>
            <li><strong className="text-on-surface">GitHub Actions</strong> — schedule trigger with cron syntax</li>
            <li><strong className="text-on-surface">systemd timers</strong> — OnCalendar export</li>
            <li><strong className="text-on-surface">Java Quartz / Spring Boot</strong> — 6-7 field Quartz format</li>
            <li><strong className="text-on-surface">Jenkins</strong> — Quartz-compatible cron triggers</li>
          </ul>

          <div className="flex gap-3 mt-10">
            <Link
              href="/advanced"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all"
            >
              Validate an Expression
            </Link>
            <Link
              href="/examples"
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              Browse Examples
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              Syntax Guide
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
