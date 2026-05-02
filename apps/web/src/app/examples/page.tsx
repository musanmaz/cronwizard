import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdFaqPage, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cron Expression Examples Explained — Real-World Schedules',
  description:
    'In-depth cron expression examples with explanations of when, why and how to use each schedule. Cover backup jobs, business hours, monthly rotations, health checks and more.',
  path: '/examples',
  keywords: [
    'cron expression examples',
    'cron examples',
    'crontab examples',
    'cron job examples',
    'cron schedule examples',
    'common cron expressions',
    'cron tutorial examples',
  ],
});

const FAQ_DATA = [
  {
    question: 'What does */5 * * * * mean in cron?',
    answer:
      'The expression */5 * * * * means "every 5 minutes". The /5 is a step value applied to the minute field. The schedule fires at minutes 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, and 55 of every hour, regardless of the day, month, or weekday.',
  },
  {
    question: 'How do I run a cron job every hour at a specific minute?',
    answer:
      'Use the form M * * * * where M is the minute. For example, 15 * * * * runs at 00:15, 01:15, 02:15, and so on. Use 0 * * * * for the top of every hour.',
  },
  {
    question: 'How do I schedule a cron job for weekdays only?',
    answer:
      'Use 1-5 in the day-of-week field (the 5th field). For example, 0 9 * * 1-5 runs the job at 09:00 Monday through Friday. In Unix cron, 1 = Monday and 5 = Friday. In Quartz, weekday numbers shift by one (Sunday = 1).',
  },
  {
    question: 'How do I run a cron job on the first day of every month?',
    answer:
      'Use 0 0 1 * * to run at midnight on the 1st of every month. Note that this fires whether the 1st is a weekday or weekend. If you specifically need a weekday, use systemd timers or Quartz with the W modifier.',
  },
  {
    question: 'Why would I prefer */15 over 0,15,30,45?',
    answer:
      'Both expressions produce the same schedule, but */15 is shorter, easier to read, and signals intent more clearly: "every 15 minutes from the start of the hour". For irregular intervals (for example minute 7 and minute 23), the comma form is the only option.',
  },
];

export default function ExamplesPage() {
  const faqJsonLd = jsonLdFaqPage(FAQ_DATA);
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Cron Examples', url: `${siteConfig.url}/examples` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-3xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
          Cron Expression Examples Explained
        </h1>
        <p>
          Reference tables of cron expressions are everywhere on the web. The problem is that
          they rarely tell you <em>when</em> to use a particular schedule, <em>why</em> it&apos;s
          structured the way it is, or <em>what can go wrong</em>. This guide walks through the
          most common cron patterns I have used and reviewed in production over the past decade,
          with the context that turns each expression from a copy-paste snippet into a
          deliberate scheduling decision.
        </p>
        <p>
          All examples use the standard 5-field Unix cron format (minute, hour, day-of-month,
          month, day-of-week), which is what Linux crontab, Kubernetes CronJobs, and GitHub
          Actions accept. If you are working with Java Quartz or Spring Boot, see the{' '}
          <Link href="/quartz">Quartz cron guide</Link> for the 6-7 field variant.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">Short-Interval Polling Schedules</h2>
        <p>
          Short intervals are useful when you need to react quickly to external state changes —
          health checks, queue draining, cache refreshes, or webhook retries. The trade-off is
          load: a job that runs every minute generates 1,440 invocations per day, so even small
          per-run costs add up.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Expression</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Description</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">* * * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every minute</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">*/5 * * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every 5 minutes</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">*/10 * * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every 10 minutes</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">*/15 * * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every 15 minutes</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">*/30 * * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every 30 minutes</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          A common mistake with short intervals is forgetting that all minute marks fire at the
          same wall-clock instant across every host. If you have ten replicas of a CronJob, all
          ten will start at exactly :00 of each minute, often hammering the same downstream
          service. For high-frequency polling, prefer a queue worker, an event-driven trigger,
          or jitter the schedule with sleep at the start of the script.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">Daily Maintenance Schedules</h2>
        <p>
          Most production cron jobs run once a day during off-peak hours. The exact time matters
          more than people realize: in a global SaaS, &quot;midnight&quot; in your timezone
          might be peak traffic in another region. A reliable rule of thumb is to schedule
          maintenance jobs during your application&apos;s lowest-traffic window, not during your
          team&apos;s sleeping hours.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Expression</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Description</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every day at midnight (server timezone)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 2 * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every day at 2:00 AM (typical backup window)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 6 * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every day at 6:00 AM (morning batch ready)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 12 * * *</td><td className="border border-outline-variant/20 px-4 py-3">Every day at noon</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 9,18 * * *</td><td className="border border-outline-variant/20 px-4 py-3">Twice daily — 9:00 AM and 6:00 PM</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Daily backups are the canonical example. <code>0 2 * * *</code> at 2:00 AM is popular
          because it sits after most US/EU traffic dies down but before European workers start.
          On Kubernetes, double-check your <code>.spec.timeZone</code> value (introduced in 1.27)
          — without it, jobs run in the kube-controller-manager timezone, which is almost
          always UTC. A schedule of <code>0 2 * * *</code> in UTC is 6:00 AM Istanbul time, which
          is far from off-peak.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">Business-Hours Schedules</h2>
        <p>
          Business-hours schedules combine the day-of-week and hour fields. The pattern{' '}
          <code>* * * * 1-5</code> means &quot;Monday through Friday&quot; (the 1-5 range maps
          to Mon-Fri in standard Unix cron). Use these for jobs that should only operate during
          office hours: email digests, internal reports, on-call notifications, or anything that
          would be wasted CPU on a weekend.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Expression</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Description</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 9 * * 1-5</td><td className="border border-outline-variant/20 px-4 py-3">Weekdays at 9:00 AM (morning standup digest)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 17 * * 1-5</td><td className="border border-outline-variant/20 px-4 py-3">Weekdays at 5:00 PM (end-of-day summary)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 9-17 * * 1-5</td><td className="border border-outline-variant/20 px-4 py-3">Hourly during business hours, weekdays only</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">*/30 9-17 * * 1-5</td><td className="border border-outline-variant/20 px-4 py-3">Every 30 minutes between 9 AM and 5 PM, weekdays</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          A subtle gotcha: <code>0 9-17 * * 1-5</code> fires at 9:00, 10:00, &hellip;, 17:00.
          That includes 5:00 PM on the dot, which might be after your team has logged off. To
          stop at 4:00 PM, use the upper bound <code>9-16</code>. Cron ranges are{' '}
          <em>inclusive on both ends</em>, which catches everyone off guard the first time.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">Weekly &amp; Monthly Rotations</h2>
        <p>
          Weekly and monthly schedules are great for heavier work that doesn&apos;t need to run
          daily — full database backups, log archives, certificate renewals, or report
          generation. Be careful with <code>0 0 1 * *</code> (first of every month): it will not
          fire on February 29 if you change it to <code>0 0 29 * *</code>, and it will silently
          skip months that don&apos;t have a 31st if you use <code>0 0 31 * *</code>.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Expression</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Description</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 * * 0</td><td className="border border-outline-variant/20 px-4 py-3">Every Sunday at midnight</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 3 * * 0</td><td className="border border-outline-variant/20 px-4 py-3">Sunday at 3:00 AM (weekly maintenance window)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 * * 6,0</td><td className="border border-outline-variant/20 px-4 py-3">Weekends at midnight</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 1 * *</td><td className="border border-outline-variant/20 px-4 py-3">First of every month at midnight</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 15 * *</td><td className="border border-outline-variant/20 px-4 py-3">15th of every month at midnight (mid-month billing)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 1 */3 *</td><td className="border border-outline-variant/20 px-4 py-3">First day of every quarter</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 1 1 *</td><td className="border border-outline-variant/20 px-4 py-3">January 1st at midnight (annual reset)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          The Unix cron interpretation of day-of-month and day-of-week is unusual: when both are
          set to specific values (anything other than <code>*</code>), the schedule fires when{' '}
          <em>either</em> matches, not both. So <code>0 0 13 * 5</code> fires on the 13th of
          every month <em>and</em> every Friday — usually not what people expect when reading
          &quot;Friday the 13th&quot;. To require both, you need Quartz with the <code>?</code>{' '}
          wildcard or post-process in your script.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">DevOps &amp; Site Reliability Schedules</h2>
        <p>
          The patterns below come up constantly in DevOps work — health checks, log rotation,
          certificate monitoring, deployment freezes, and so on. They are simple expressions but
          carry a lot of operational weight. A misfired backup or a stuck health check can
          cascade into real outages.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Expression</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Use case</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">*/5 * * * *</td><td className="border border-outline-variant/20 px-4 py-3">External health check / uptime probe</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 2 * * *</td><td className="border border-outline-variant/20 px-4 py-3">Nightly database backup (off-peak)</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 3 * * 0</td><td className="border border-outline-variant/20 px-4 py-3">Weekly full backup &amp; archive rotation</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 1 * *</td><td className="border border-outline-variant/20 px-4 py-3">Monthly log compaction &amp; cleanup</td></tr>
              <tr><td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">0 0 * * 1</td><td className="border border-outline-variant/20 px-4 py-3">Weekly metric snapshot for capacity planning</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Always pair production cron jobs with monitoring. A schedule firing successfully is
          not the same as a job <em>completing</em> successfully. Consider a dead-man&apos;s
          switch (Healthchecks.io, Cronitor, or a simple metric increment) so that you get
          paged when a job <em>fails to run</em>, not just when it errors. For a deeper dive
          into running cron jobs in production, see our{' '}
          <Link href="/best-practices">cron best practices guide</Link> and{' '}
          <Link href="/troubleshooting">troubleshooting reference</Link>.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i} className="mt-6">
            <h3 className="text-lg font-bold text-on-surface">{faq.question}</h3>
            <p className="mt-2 leading-relaxed">{faq.answer}</p>
          </div>
        ))}

        <div className="not-prose mt-12 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all"
          >
            Build a Cron Expression
          </Link>
          <Link
            href="/best-practices"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Production Best Practices
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Cron Syntax Documentation
          </Link>
        </div>
      </article>
    </>
  );
}
