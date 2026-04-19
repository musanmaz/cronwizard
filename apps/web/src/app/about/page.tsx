import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About CronWizard',
  description:
    'Learn about CronWizard — a free, open-source cron expression generator and validator built for developers who need reliable, visual scheduling tools.',
  path: '/about',
  keywords: ['about cronwizard', 'cron wizard about', 'cron expression tool'],
});

export default function AboutPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'About', url: `${siteConfig.url}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-3xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-a:text-primary">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
          About CronWizard
        </h1>

        <p>
          CronWizard is a free, open-source tool that makes working with cron expressions simple,
          visual, and reliable. Whether you are scheduling a Kubernetes CronJob, a GitHub Actions
          workflow, a systemd timer, or a classic Linux crontab entry, CronWizard helps you build
          the right expression the first time.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Our Mission</h2>
        <p>
          Cron has been around for over four decades and remains one of the most widely used
          scheduling mechanisms in software. Yet its terse syntax still causes mistakes — even
          for experienced engineers. A single off-by-one in the day-of-week field can delay a
          backup by a day; a misplaced asterisk can silently overload a service.
        </p>
        <p>
          CronWizard was built to eliminate that friction. By translating cron expressions into
          plain English in real time, showing the next scheduled runs with timezone support, and
          providing one-click exports for popular platforms, we want to make scheduling obvious
          and confident.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">What Makes CronWizard Different</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Visual, step-by-step builder</strong> — choose minute, hour, day, month and
            weekday from intuitive UI controls instead of memorising syntax.
          </li>
          <li>
            <strong>Instant human-readable translation</strong> — every expression is described in
            plain English as you edit it.
          </li>
          <li>
            <strong>Unix and Quartz format support</strong> — toggle between the 5-field Unix cron
            format and the 6-7 field Quartz format used by Java schedulers.
          </li>
          <li>
            <strong>Timezone-aware next run preview</strong> — see the next execution times in any
            IANA timezone before you deploy.
          </li>
          <li>
            <strong>Platform-ready exports</strong> — generate production-ready Kubernetes CronJob
            YAML, GitHub Actions workflows, or systemd timer units.
          </li>
          <li>
            <strong>Client-side processing</strong> — every calculation runs in your browser, so
            your schedules never leave your device.
          </li>
          <li>
            <strong>Open source</strong> — review the code, report issues, or contribute on{' '}
            <a
              href="https://github.com/musanmaz/cronwizard"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-10">Who It&apos;s For</h2>
        <p>CronWizard is built for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>DevOps and SRE engineers</strong> who manage CronJobs in Kubernetes clusters
            and want a trusted reference for schedule syntax.
          </li>
          <li>
            <strong>Backend developers</strong> using Quartz, Spring Boot scheduled tasks, or
            classic Unix cron to run background jobs.
          </li>
          <li>
            <strong>System administrators</strong> who need to set up cron jobs on Linux, macOS or
            BSD systems.
          </li>
          <li>
            <strong>CI/CD engineers</strong> configuring GitHub Actions, GitLab CI, or Jenkins
            scheduled builds.
          </li>
          <li>
            <strong>Anyone learning cron</strong> — the human-readable translations make
            CronWizard an excellent learning aid.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-10">Built With</h2>
        <p>
          CronWizard is built with modern, reliable open-source technology: Next.js 14, React,
          TypeScript, Tailwind CSS, and the excellent{' '}
          <code>cron-parser</code> and <code>cronstrue</code> libraries for parsing and
          descriptions. The user interface is designed to be fast, accessible, and readable in
          both light and dark themes.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Free Forever</h2>
        <p>
          CronWizard is and will remain free to use. The project is supported by tasteful, non
          intrusive advertising through Google AdSense, which keeps the lights on without
          compromising user experience. There are no paywalls, no &quot;pro&quot; tiers, and no
          required sign-ups.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Get Started</h2>
        <p>Explore the tool or dive straight into the docs:</p>
        <div className="not-prose mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all"
          >
            Open the Builder
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Read the Docs
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Browse Examples
          </Link>
        </div>
      </article>
    </>
  );
}
