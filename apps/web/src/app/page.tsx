import type { Metadata } from 'next';
import Link from 'next/link';
import { WizardBuilder } from '@/components/wizard-builder';
import { buildMetadata, jsonLdBreadcrumb, jsonLdHowTo, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Free Cron Expression Generator & Builder Online',
  description:
    'Free online cron expression generator — build cron schedules visually in seconds. Supports Unix & Quartz formats, instant validation, next-run preview with timezone, and one-click export to Kubernetes, GitHub Actions & systemd.',
  path: '/',
  keywords: [
    'cron builder',
    'cron wizard',
    'visual cron editor',
    'schedule builder',
    'cron maker',
    'cron schedule generator',
    'crontab builder',
  ],
});

export default function HomePage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Cron Builder', url: `${siteConfig.url}/` },
  ]);
  const howTo = jsonLdHowTo();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <article className="max-w-5xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
            Cron Expression Generator &amp; Builder
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            Build cron expressions visually with an intuitive wizard. Get real-time human-readable
            translations, validate instantly, and export to Kubernetes, GitHub Actions or systemd.
          </p>
        </header>
        <WizardBuilder />

        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What is a Cron Expression?
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
            A cron expression is a compact string of fields that defines when a recurring job
            should run. Originally introduced in Unix in 1975, cron has become the universal
            language of scheduling — powering everything from nightly database backups on a
            single Linux server to millions of scheduled tasks across modern Kubernetes clusters.
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
            The challenge with cron is that its syntax is dense. Five (or sometimes six or seven)
            fields separated by spaces encode minutes, hours, days, months and weekdays, each
            with its own range and special characters. A small mistake — a comma instead of a
            slash, a 0 instead of a 1 — can shift an entire schedule by hours or days.
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            CronWizard solves this by giving you a visual, step-by-step interface that generates
            correct cron expressions and explains them in plain English. You can copy the result
            directly into your crontab, Kubernetes manifest, GitHub Actions workflow, or systemd
            unit.
          </p>

          <h2 className="font-headline text-2xl font-bold text-on-surface mt-12 mb-4">
            Key Features
          </h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-base font-bold text-on-surface mb-1">Visual Step-by-Step Builder</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Pick the schedule you want — every minute, every weekday at 9 AM, the first of the
                month, or a custom pattern — without memorizing cron syntax. The builder
                generates the correct expression automatically.
              </p>
            </li>
            <li>
              <h3 className="text-base font-bold text-on-surface mb-1">Real-Time Human Translation</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Every expression is translated into clear English as you type. This catches
                mistakes before deployment and helps teammates understand a schedule at a glance
                during code review.
              </p>
            </li>
            <li>
              <h3 className="text-base font-bold text-on-surface mb-1">Unix and Quartz Support</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Switch between the classic 5-field Unix format (used by Linux cron, Kubernetes
                and GitHub Actions) and the 6-7 field Quartz format (used by Java Quartz
                Scheduler and Spring Boot). CronWizard highlights the differences so you never
                confuse the two.
              </p>
            </li>
            <li>
              <h3 className="text-base font-bold text-on-surface mb-1">Timezone-Aware Preview</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Preview the next scheduled runs in any IANA timezone. This is critical for
                catching timezone mismatches between your local machine and the production
                server, which is one of the most common sources of cron bugs.
              </p>
            </li>
            <li>
              <h3 className="text-base font-bold text-on-surface mb-1">One-Click Platform Export</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Export your cron expression as a ready-to-deploy Kubernetes CronJob YAML, GitHub
                Actions schedule trigger, or systemd <code>OnCalendar</code> timer unit. No more
                manual conversion between formats.
              </p>
            </li>
          </ul>

          <h2 className="font-headline text-2xl font-bold text-on-surface mt-12 mb-4">
            Common Use Cases
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Database Backups</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Nightly database dumps, weekly full backups, and monthly archive rotations are
                classic cron territory. Use <code>0 2 * * *</code> for daily 2 AM backups or{' '}
                <code>0 3 * * 0</code> for Sunday 3 AM weekly snapshots.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Scheduled Reports &amp; Emails</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Daily stand-up digests, weekly sales reports, and monthly invoices all benefit
                from predictable schedules. Weekday-only expressions like{' '}
                <code>0 9 * * 1-5</code> are particularly common here.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Cache Warming &amp; Data Refresh</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Refresh caches or materialized views every few minutes with{' '}
                <code>*/5 * * * *</code>, or run more expensive data aggregations hourly with{' '}
                <code>0 * * * *</code>.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Health Checks &amp; Monitoring</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Ping external services, check SSL certificate expiry, or verify backup integrity
                on a regular cadence. Short-interval schedules such as <code>*/10 * * * *</code>{' '}
                are typical for health checks.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Log Rotation &amp; Cleanup</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Delete old log files, archive completed jobs, or trim oversized tables on a
                monthly schedule with expressions like <code>0 0 1 * *</code> (first day of every
                month at midnight).
              </p>
            </div>
          </div>

          <h2 className="font-headline text-2xl font-bold text-on-surface mt-12 mb-4">
            Why Use a Visual Cron Generator?
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
            Even experienced developers make cron mistakes. The day-of-week field uses 0-6 in
            Unix cron (Sunday = 0) but 1-7 in Quartz (Sunday = 1). Kubernetes CronJobs default to
            the controller manager&apos;s timezone, which is usually UTC — not the timezone of
            the developer writing the manifest. The difference between <code>*/5</code> and{' '}
            <code>0/5</code> is subtle but real on some schedulers.
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
            A visual generator eliminates an entire category of these bugs. You pick the
            schedule you actually want, and the tool emits a syntactically correct, semantically
            explicit expression that matches the target platform. The human-readable translation
            serves as an instant sanity check.
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            For a deeper dive into cron syntax, see our{' '}
            <Link href="/docs" className="text-primary hover:underline">
              documentation
            </Link>
            . For ready-made patterns, browse the{' '}
            <Link href="/examples" className="text-primary hover:underline">
              examples library
            </Link>
            . For Quartz specifics, visit the{' '}
            <Link href="/quartz" className="text-primary hover:underline">
              Quartz cron guide
            </Link>
            . For Kubernetes, check the{' '}
            <Link href="/kubernetes" className="text-primary hover:underline">
              Kubernetes CronJob guide
            </Link>
            .
          </p>
        </section>
      </article>
    </>
  );
}
