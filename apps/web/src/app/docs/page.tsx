import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdFaqPage, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cron Expression Documentation & Guide',
  description:
    'Learn cron syntax: Unix vs Quartz format differences, special characters (*, /, -, ,), common examples, and frequent mistakes. A complete cron reference guide.',
  path: '/docs',
  keywords: [
    'cron syntax',
    'cron format',
    'cron documentation',
    'crontab syntax',
    'quartz vs unix cron',
    'cron special characters',
    'cron examples',
    'how to write cron expression',
  ],
});

const FAQ_DATA = [
  {
    question: 'What is a cron expression?',
    answer:
      'A cron expression is a string of 5 (Unix) or 6-7 (Quartz) fields separated by spaces that defines a recurring schedule. Each field represents a time unit: minute, hour, day of month, month, and day of week.',
  },
  {
    question: 'What is the difference between Unix and Quartz cron?',
    answer:
      'Unix cron has 5 fields (minute, hour, day of month, month, day of week). Quartz adds a seconds field at the beginning (6 or 7 fields) and uses 1-7 for day of week (Sunday=1) instead of 0-6 (Sunday=0). Quartz also supports the ? wildcard.',
  },
  {
    question: 'What does */5 * * * * mean?',
    answer:
      'The expression */5 * * * * means "every 5 minutes". The /5 is a step value that divides the range. So */5 in the minute field means at minutes 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, and 55.',
  },
  {
    question: 'How do I schedule a cron job for weekdays only?',
    answer:
      'Use 1-5 in the day-of-week field (the 5th field in Unix cron). For example, 0 9 * * 1-5 runs at 09:00 every Monday through Friday.',
  },
  {
    question: 'What timezone does cron use?',
    answer:
      "By default, cron runs in the server's system timezone. In Kubernetes CronJobs, the timezone defaults to the kube-controller-manager timezone (usually UTC). Always check your platform's documentation and use CronWizard's timezone selector to preview schedules.",
  },
];

export default function DocsPage() {
  const faqJsonLd = jsonLdFaqPage(FAQ_DATA);
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Documentation', url: `${siteConfig.url}/docs` },
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
      <article className="max-w-5xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-surface-container-lowest prose-pre:border prose-pre:border-outline-variant/20">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
          Cron Expression Documentation
        </h1>

        <h2 id="what-is-cron" className="text-xl font-bold text-on-surface mt-10">
          What is Cron?
        </h2>
        <p>
          Cron is a time-based job scheduler used in Unix-like operating systems. A cron
          expression is a string that defines when a task should run.
        </p>

        <h2 id="unix-format" className="text-xl font-bold text-on-surface mt-10">
          Unix Cron Format (5 fields)
        </h2>
        <pre className="bg-surface-container-lowest rounded-xl p-6 not-prose text-sm font-mono text-on-surface-variant border border-outline-variant/20">
          {`┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sun=0)
│ │ │ │ │
* * * * *`}
        </pre>

        <h2 id="quartz-format" className="text-xl font-bold text-on-surface mt-10">
          Quartz Cron Format (6-7 fields)
        </h2>
        <p>
          Used by Java-based schedulers like Quartz. Adds a seconds field at the beginning
          and uses 1-7 for day of week (SUN=1).
        </p>
        <pre className="bg-surface-container-lowest rounded-xl p-6 not-prose text-sm font-mono text-on-surface-variant border border-outline-variant/20">
          {`┌───────────── second (0-59)
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (1-7, SUN=1)
│ │ │ │ │ │
0 * * * * *`}
        </pre>

        <h2 id="unix-vs-quartz" className="text-xl font-bold text-on-surface mt-10">
          Key Differences: Unix vs Quartz
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Feature
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Unix
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Quartz
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Fields</td>
                <td className="border border-outline-variant/20 px-4 py-3">5</td>
                <td className="border border-outline-variant/20 px-4 py-3">6-7</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Seconds</td>
                <td className="border border-outline-variant/20 px-4 py-3">No</td>
                <td className="border border-outline-variant/20 px-4 py-3">Yes (first field)</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Day of Week</td>
                <td className="border border-outline-variant/20 px-4 py-3">0-6 (Sun=0)</td>
                <td className="border border-outline-variant/20 px-4 py-3">1-7 (Sun=1) or SUN-SAT</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">? wildcard</td>
                <td className="border border-outline-variant/20 px-4 py-3">No</td>
                <td className="border border-outline-variant/20 px-4 py-3">Yes (DOM or DOW)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="special-characters" className="text-xl font-bold text-on-surface mt-10">
          Special Characters
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Character
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Meaning
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    *
                  </code>
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Every value</td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    * * * * *
                  </code>{' '}
                  = every minute
                </td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    ,
                  </code>
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">List</td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    0 9,18 * * *
                  </code>{' '}
                  = 09:00 and 18:00
                </td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    -
                  </code>
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Range</td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    0 9 * * 1-5
                  </code>{' '}
                  = weekdays at 09:00
                </td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    /
                  </code>
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Step</td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                    */15 * * * *
                  </code>{' '}
                  = every 15 min
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="examples" className="text-xl font-bold text-on-surface mt-10">
          Common Examples
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Expression
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  */5 * * * *
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Every 5 minutes</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  0 * * * *
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Every hour at :00</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  0 0 * * *
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Every day at midnight</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  0 9 * * 1-5
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">Weekdays at 09:00</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  0 0 1 * *
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  1st of every month at midnight
                </td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  0 0 1 1 *
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  Every January 1st at midnight
                </td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                  */30 9-17 * * 1-5
                </td>
                <td className="border border-outline-variant/20 px-4 py-3">
                  Every 30 min during business hours (Mon-Fri)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="common-mistakes" className="text-xl font-bold text-on-surface mt-10">
          Common Mistakes
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-on-surface">Day of week numbering:</strong> In Unix, Sunday = 0. In
            Quartz, Sunday = 1. Mixing these up shifts your schedule by a day.
          </li>
          <li>
            <strong className="text-on-surface">Forgetting timezone:</strong> Cron typically runs in the
            server&apos;s timezone. Always verify which timezone your scheduler uses.
          </li>
          <li>
            <strong className="text-on-surface">Using 6 fields in Unix cron:</strong> Standard Unix cron
            has 5 fields. Adding a seconds field will cause errors on most Unix systems.
          </li>
          <li>
            <strong className="text-on-surface">Month/day ranges:</strong>{' '}
            <code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
              0 0 31 2 *
            </code>{' '}
            will never run because February never has 31 days.
          </li>
        </ul>

        <h2 id="faq" className="text-xl font-bold text-on-surface mt-10">
          Frequently Asked Questions
        </h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i} className="mt-6">
            <h3 className="text-xl font-bold text-on-surface">{faq.question}</h3>
            <p className="mt-2">{faq.answer}</p>
          </div>
        ))}

        <div className="not-prose mt-10 flex gap-3">
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
        </div>
      </article>
    </>
  );
}
