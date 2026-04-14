import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdFaqPage, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cron Expression Examples — 25+ Ready-to-Use Schedules',
  description:
    'Copy-paste cron expression examples for every use case: every 5 minutes, daily at midnight, weekdays only, monthly, yearly, business hours, and more. Unix & Quartz formats.',
  path: '/examples',
  keywords: [
    'cron expression examples',
    'cron examples',
    'crontab examples',
    'cron job examples',
    'cron schedule examples',
    'common cron expressions',
  ],
});

const EXAMPLES: { expression: string; description: string; category: string }[] = [
  { expression: '* * * * *', description: 'Every minute', category: 'Basic Intervals' },
  { expression: '*/5 * * * *', description: 'Every 5 minutes', category: 'Basic Intervals' },
  { expression: '*/10 * * * *', description: 'Every 10 minutes', category: 'Basic Intervals' },
  { expression: '*/15 * * * *', description: 'Every 15 minutes', category: 'Basic Intervals' },
  { expression: '*/30 * * * *', description: 'Every 30 minutes', category: 'Basic Intervals' },
  { expression: '0 * * * *', description: 'Every hour at :00', category: 'Basic Intervals' },
  { expression: '0 */2 * * *', description: 'Every 2 hours', category: 'Basic Intervals' },
  { expression: '0 */6 * * *', description: 'Every 6 hours', category: 'Basic Intervals' },
  { expression: '0 0 * * *', description: 'Every day at midnight', category: 'Daily Schedules' },
  { expression: '0 6 * * *', description: 'Every day at 6:00 AM', category: 'Daily Schedules' },
  { expression: '0 12 * * *', description: 'Every day at noon', category: 'Daily Schedules' },
  { expression: '0 18 * * *', description: 'Every day at 6:00 PM', category: 'Daily Schedules' },
  { expression: '0 9,18 * * *', description: 'Twice a day (9:00 AM and 6:00 PM)', category: 'Daily Schedules' },
  { expression: '0 9 * * 1-5', description: 'Weekdays at 9:00 AM', category: 'Business Schedules' },
  { expression: '0 17 * * 1-5', description: 'Weekdays at 5:00 PM', category: 'Business Schedules' },
  { expression: '*/30 9-17 * * 1-5', description: 'Every 30 min during business hours (Mon-Fri)', category: 'Business Schedules' },
  { expression: '0 9-17 * * 1-5', description: 'Every hour during business hours (Mon-Fri)', category: 'Business Schedules' },
  { expression: '0 0 * * 0', description: 'Every Sunday at midnight', category: 'Weekly Schedules' },
  { expression: '0 0 * * 1', description: 'Every Monday at midnight', category: 'Weekly Schedules' },
  { expression: '0 0 * * 5', description: 'Every Friday at midnight', category: 'Weekly Schedules' },
  { expression: '0 0 * * 6,0', description: 'Weekends at midnight', category: 'Weekly Schedules' },
  { expression: '0 0 1 * *', description: 'First day of every month at midnight', category: 'Monthly & Yearly' },
  { expression: '0 0 15 * *', description: '15th of every month at midnight', category: 'Monthly & Yearly' },
  { expression: '0 0 1 1 *', description: 'January 1st at midnight (yearly)', category: 'Monthly & Yearly' },
  { expression: '0 0 1 */3 *', description: 'Every quarter (1st day)', category: 'Monthly & Yearly' },
  { expression: '0 2 * * *', description: 'Daily at 2:00 AM (database backup)', category: 'DevOps & Maintenance' },
  { expression: '*/5 * * * *', description: 'Health check every 5 minutes', category: 'DevOps & Maintenance' },
  { expression: '0 3 * * 0', description: 'Weekly maintenance (Sunday 3:00 AM)', category: 'DevOps & Maintenance' },
  { expression: '0 0 1 * *', description: 'Monthly log rotation', category: 'DevOps & Maintenance' },
];

const FAQ_DATA = [
  {
    question: 'What does */5 * * * * mean in cron?',
    answer:
      'The expression */5 * * * * means "every 5 minutes". The /5 is a step value applied to the minute field. The schedule fires at minutes 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, and 55 of every hour.',
  },
  {
    question: 'How do I run a cron job every hour?',
    answer:
      'Use 0 * * * * to run a cron job at the start of every hour (at minute 0). This means the job will execute at 00:00, 01:00, 02:00, and so on.',
  },
  {
    question: 'How do I schedule a cron job for weekdays only?',
    answer:
      'Use 1-5 in the day-of-week field (the 5th field). For example, 0 9 * * 1-5 runs the job at 09:00 Monday through Friday. In Unix cron, 1 = Monday and 5 = Friday.',
  },
  {
    question: 'How do I run a cron job on the first day of every month?',
    answer:
      'Use 0 0 1 * * to run at midnight on the 1st of every month. You can change the hour and minute fields to schedule it at a different time on the 1st.',
  },
  {
    question: 'What is the difference between * and */1 in cron?',
    answer:
      'There is no difference. Both * and */1 match every possible value for that field. */1 explicitly states a step of 1, which is the same as matching everything.',
  },
];

export default function ExamplesPage() {
  const faqJsonLd = jsonLdFaqPage(FAQ_DATA);
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Cron Examples', url: `${siteConfig.url}/examples` },
  ]);

  const categories = [...new Set(EXAMPLES.map((e) => e.category))];

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
      <article className="max-w-5xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
            Cron Expression Examples
          </h1>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto leading-relaxed">
            Ready-to-use cron expressions for common scheduling needs. Click any expression to
            try it in the builder or validator.
          </p>
        </header>

        {categories.map((category) => (
          <section key={category} className="mb-10">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-4">{category}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-surface-container-high">
                    <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">
                      Expression
                    </th>
                    <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">
                      Description
                    </th>
                    <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-on-surface-variant">
                  {EXAMPLES.filter((e) => e.category === category).map((example) => (
                    <tr key={`${example.expression}-${example.description}`}>
                      <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary text-sm">
                        {example.expression}
                      </td>
                      <td className="border border-outline-variant/20 px-4 py-3 text-sm">
                        {example.description}
                      </td>
                      <td className="border border-outline-variant/20 px-4 py-3 text-sm">
                        <Link
                          href="/"
                          className="text-primary hover:underline mr-3"
                        >
                          Build
                        </Link>
                        <Link
                          href="/advanced"
                          className="text-primary hover:underline"
                        >
                          Validate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">
            Frequently Asked Questions
          </h2>
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className="mt-6">
              <h3 className="text-lg font-bold text-on-surface">{faq.question}</h3>
              <p className="mt-2 text-on-surface-variant text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </section>

        <div className="flex gap-3 mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all"
          >
            Try the Builder
          </Link>
          <Link
            href="/advanced"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Advanced Editor
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Full Documentation
          </Link>
        </div>
      </article>
    </>
  );
}
