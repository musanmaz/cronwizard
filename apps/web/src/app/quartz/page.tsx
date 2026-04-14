import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdFaqPage, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Quartz Cron Expression Generator & Guide',
  description:
    'Generate and validate Quartz cron expressions online. Learn Quartz cron syntax (6-7 fields with seconds), day-of-week numbering (SUN=1), the ? wildcard, and key differences from Unix cron.',
  path: '/quartz',
  keywords: [
    'quartz cron expression',
    'quartz cron',
    'quartz scheduler cron',
    'quartz cron generator',
    'quartz cron syntax',
    'quartz cron format',
    'quartz cron maker',
    'quartz cronexpression',
    'java cron expression',
    'java cron',
    'spring cron expression',
  ],
});

const QUARTZ_EXAMPLES: { expression: string; description: string }[] = [
  { expression: '0 * * * * ?', description: 'Every minute' },
  { expression: '0 */5 * * * ?', description: 'Every 5 minutes' },
  { expression: '0 0 * * * ?', description: 'Every hour at :00' },
  { expression: '0 0 12 * * ?', description: 'Every day at noon' },
  { expression: '0 0 0 * * ?', description: 'Every day at midnight' },
  { expression: '0 0 9 ? * MON-FRI', description: 'Weekdays at 9:00 AM' },
  { expression: '0 0 17 ? * MON-FRI', description: 'Weekdays at 5:00 PM' },
  { expression: '0 */30 9-17 ? * MON-FRI', description: 'Every 30 min during business hours (Mon-Fri)' },
  { expression: '0 0 0 1 * ?', description: 'First day of every month at midnight' },
  { expression: '0 0 0 ? * SUN', description: 'Every Sunday at midnight' },
  { expression: '0 0 2 ? * SUN', description: 'Every Sunday at 2:00 AM' },
  { expression: '0 0 0 1 1 ?', description: 'January 1st at midnight' },
  { expression: '0 15 10 ? * *', description: 'Every day at 10:15 AM' },
  { expression: '0 0/30 8-10 * * ?', description: 'Every 30 min between 8:00-10:59' },
  { expression: '0 0 0 L * ?', description: 'Last day of every month at midnight' },
  { expression: '0 0 0 ? * 6L', description: 'Last Friday of every month at midnight' },
];

const FAQ_DATA = [
  {
    question: 'What is a Quartz cron expression?',
    answer:
      'A Quartz cron expression is a string of 6 or 7 fields that defines a schedule for the Quartz job scheduler used in Java applications. Unlike Unix cron (5 fields), Quartz adds a seconds field at the beginning and optionally a year field at the end.',
  },
  {
    question: 'What is the difference between Unix and Quartz cron?',
    answer:
      'The main differences are: (1) Quartz has a seconds field as the first field, (2) Quartz uses 1-7 for day of week where Sunday=1, while Unix uses 0-6 where Sunday=0, (3) Quartz supports the ? wildcard for day-of-month or day-of-week, (4) Quartz supports special characters like L (last), W (weekday), and # (nth day of month).',
  },
  {
    question: 'What does the ? character mean in Quartz cron?',
    answer:
      'The ? (question mark) means "no specific value" and can only be used in the day-of-month or day-of-week fields. It is required in one of these fields when the other is specified. For example, if you set day-of-week to MON, you must use ? for day-of-month.',
  },
  {
    question: 'How do I use the L character in Quartz cron?',
    answer:
      'L stands for "last". In the day-of-month field, L means the last day of the month (28, 29, 30, or 31). In the day-of-week field, L means Saturday (7). You can also combine it: 6L means "last Friday of the month".',
  },
  {
    question: 'Can I use Quartz cron expressions in Spring Boot?',
    answer:
      'Yes. Spring\'s @Scheduled annotation supports cron expressions using Quartz-style 6-field format (seconds, minutes, hours, day-of-month, month, day-of-week). Spring uses the same syntax as Quartz for scheduling tasks.',
  },
];

export default function QuartzPage() {
  const faqJsonLd = jsonLdFaqPage(FAQ_DATA);
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Quartz Cron', url: `${siteConfig.url}/quartz` },
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
          Quartz Cron Expression Generator &amp; Guide
        </h1>

        <p>
          Quartz is the most popular job scheduling library for Java. It uses an extended cron
          format with 6 or 7 fields, adding a seconds field and supporting special characters
          like <code>?</code>, <code>L</code>, <code>W</code>, and <code>#</code>.
        </p>

        <h2 id="quartz-format" className="text-xl font-bold text-on-surface mt-10">
          Quartz Cron Format (6-7 fields)
        </h2>
        <pre className="bg-surface-container-lowest rounded-xl p-6 not-prose text-sm font-mono text-on-surface-variant border border-outline-variant/20">
          {`┌───────────── second (0-59)
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12 or JAN-DEC)
│ │ │ │ │ ┌───────────── day of week (1-7 or SUN-SAT, SUN=1)
│ │ │ │ │ │ ┌───────────── year (optional, 1970-2099)
│ │ │ │ │ │ │
0 * * * * ? *`}
        </pre>

        <h2 id="special-characters" className="text-xl font-bold text-on-surface mt-10">
          Quartz Special Characters
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">
                  Character
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">
                  Meaning
                </th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">
                  Allowed In
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">?</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">No specific value</td>
                <td className="border border-outline-variant/20 px-4 py-3">Day of month, Day of week</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">L</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">Last day/weekday</td>
                <td className="border border-outline-variant/20 px-4 py-3">Day of month, Day of week</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">W</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">Nearest weekday</td>
                <td className="border border-outline-variant/20 px-4 py-3">Day of month</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">#</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">Nth day of month (e.g. 6#3 = third Friday)</td>
                <td className="border border-outline-variant/20 px-4 py-3">Day of week</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">*</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">Every value</td>
                <td className="border border-outline-variant/20 px-4 py-3">All fields</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">,</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">List of values</td>
                <td className="border border-outline-variant/20 px-4 py-3">All fields</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">-</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">Range</td>
                <td className="border border-outline-variant/20 px-4 py-3">All fields</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3"><code className="bg-surface-container-high px-2 py-0.5 rounded text-primary">/</code></td>
                <td className="border border-outline-variant/20 px-4 py-3">Step/increment</td>
                <td className="border border-outline-variant/20 px-4 py-3">All fields</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="unix-vs-quartz" className="text-xl font-bold text-on-surface mt-10">
          Unix vs Quartz Cron — Key Differences
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Feature</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Unix Cron</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Quartz Cron</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Fields</td>
                <td className="border border-outline-variant/20 px-4 py-3">5</td>
                <td className="border border-outline-variant/20 px-4 py-3">6-7 (seconds + optional year)</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Seconds</td>
                <td className="border border-outline-variant/20 px-4 py-3">Not supported</td>
                <td className="border border-outline-variant/20 px-4 py-3">Yes (first field)</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Day of Week</td>
                <td className="border border-outline-variant/20 px-4 py-3">0-6 (Sunday=0)</td>
                <td className="border border-outline-variant/20 px-4 py-3">1-7 (Sunday=1) or SUN-SAT</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">? wildcard</td>
                <td className="border border-outline-variant/20 px-4 py-3">Not supported</td>
                <td className="border border-outline-variant/20 px-4 py-3">Required (DOM or DOW)</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">L, W, #</td>
                <td className="border border-outline-variant/20 px-4 py-3">Not supported</td>
                <td className="border border-outline-variant/20 px-4 py-3">Supported</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3">Used By</td>
                <td className="border border-outline-variant/20 px-4 py-3">Linux crontab, Kubernetes, GitHub Actions</td>
                <td className="border border-outline-variant/20 px-4 py-3">Java Quartz, Spring Boot, Jenkins</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="examples" className="text-xl font-bold text-on-surface mt-10">
          Quartz Cron Expression Examples
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Expression</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Description</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              {QUARTZ_EXAMPLES.map((example) => (
                <tr key={example.expression}>
                  <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">
                    {example.expression}
                  </td>
                  <td className="border border-outline-variant/20 px-4 py-3">{example.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="faq" className="text-xl font-bold text-on-surface mt-10">
          Frequently Asked Questions
        </h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i} className="mt-6">
            <h3 className="text-lg font-bold text-on-surface">{faq.question}</h3>
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
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            More Examples
          </Link>
        </div>
      </article>
    </>
  );
}
