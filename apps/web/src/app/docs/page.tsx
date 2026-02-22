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
      'By default, cron runs in the server\'s system timezone. In Kubernetes CronJobs, the timezone defaults to the kube-controller-manager timezone (usually UTC). Always check your platform\'s documentation and use CronWizard\'s timezone selector to preview schedules.',
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
      <article className="container mx-auto px-4 py-8 max-w-3xl prose prose-neutral">
        <h1>Cron Expression Documentation</h1>

        <h2 id="what-is-cron">What is Cron?</h2>
        <p>
          Cron is a time-based job scheduler used in Unix-like operating systems.
          A cron expression is a string that defines when a task should run.
        </p>

        <h2 id="unix-format">Unix Cron Format (5 fields)</h2>
        <pre className="bg-muted rounded-md p-4 not-prose text-sm">
{`┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sun=0)
│ │ │ │ │
* * * * *`}
        </pre>

        <h2 id="quartz-format">Quartz Cron Format (6-7 fields)</h2>
        <p>
          Used by Java-based schedulers like Quartz. Adds a seconds field at the beginning
          and uses 1-7 for day of week (SUN=1).
        </p>
        <pre className="bg-muted rounded-md p-4 not-prose text-sm">
{`┌───────────── second (0-59)
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (1-7, SUN=1)
│ │ │ │ │ │
0 * * * * *`}
        </pre>

        <h2 id="unix-vs-quartz">Key Differences: Unix vs Quartz</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Unix</th>
              <th>Quartz</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Fields</td><td>5</td><td>6-7</td></tr>
            <tr><td>Seconds</td><td>No</td><td>Yes (first field)</td></tr>
            <tr><td>Day of Week</td><td>0-6 (Sun=0)</td><td>1-7 (Sun=1) or SUN-SAT</td></tr>
            <tr><td>? wildcard</td><td>No</td><td>Yes (DOM or DOW)</td></tr>
          </tbody>
        </table>

        <h2 id="special-characters">Special Characters</h2>
        <table>
          <thead>
            <tr>
              <th>Character</th>
              <th>Meaning</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>*</code></td>
              <td>Every value</td>
              <td><code>* * * * *</code> = every minute</td>
            </tr>
            <tr>
              <td><code>,</code></td>
              <td>List</td>
              <td><code>0 9,18 * * *</code> = 09:00 and 18:00</td>
            </tr>
            <tr>
              <td><code>-</code></td>
              <td>Range</td>
              <td><code>0 9 * * 1-5</code> = weekdays at 09:00</td>
            </tr>
            <tr>
              <td><code>/</code></td>
              <td>Step</td>
              <td><code>*/15 * * * *</code> = every 15 min</td>
            </tr>
          </tbody>
        </table>

        <h2 id="examples">Common Examples</h2>
        <table>
          <thead>
            <tr>
              <th>Expression</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>*/5 * * * *</code></td><td>Every 5 minutes</td></tr>
            <tr><td><code>0 * * * *</code></td><td>Every hour at :00</td></tr>
            <tr><td><code>0 0 * * *</code></td><td>Every day at midnight</td></tr>
            <tr><td><code>0 9 * * 1-5</code></td><td>Weekdays at 09:00</td></tr>
            <tr><td><code>0 0 1 * *</code></td><td>1st of every month at midnight</td></tr>
            <tr><td><code>0 0 1 1 *</code></td><td>Every January 1st at midnight</td></tr>
            <tr><td><code>*/30 9-17 * * 1-5</code></td><td>Every 30 min during business hours (Mon-Fri)</td></tr>
          </tbody>
        </table>

        <h2 id="common-mistakes">Common Mistakes</h2>
        <ul>
          <li>
            <strong>Day of week numbering:</strong> In Unix, Sunday = 0.
            In Quartz, Sunday = 1. Mixing these up shifts your schedule by a day.
          </li>
          <li>
            <strong>Forgetting timezone:</strong> Cron typically runs in the server&apos;s
            timezone. Always verify which timezone your scheduler uses.
          </li>
          <li>
            <strong>Using 6 fields in Unix cron:</strong> Standard Unix cron has 5 fields.
            Adding a seconds field will cause errors on most Unix systems.
          </li>
          <li>
            <strong>Month/day ranges:</strong> <code>0 0 31 2 *</code> will never run because
            February never has 31 days.
          </li>
        </ul>

        <h2 id="faq">Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <div className="not-prose mt-8 flex gap-4">
          <Link
            href="/"
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Try the Builder
          </Link>
          <Link
            href="/advanced"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Advanced Editor
          </Link>
        </div>
      </article>
    </>
  );
}
