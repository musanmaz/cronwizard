import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl prose prose-neutral">
      <h1>Cron Expression Documentation</h1>

      <h2>What is Cron?</h2>
      <p>
        Cron is a time-based job scheduler used in Unix-like operating systems.
        A cron expression is a string that defines when a task should run.
      </p>

      <h2>Unix Cron Format (5 fields)</h2>
      <pre className="bg-muted rounded-md p-4 not-prose text-sm">
{`┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sun=0)
│ │ │ │ │
* * * * *`}
      </pre>

      <h2>Quartz Cron Format (6-7 fields)</h2>
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

      <h2>Key Differences: Unix vs Quartz</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Unix</th>
            <th>Quartz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fields</td>
            <td>5</td>
            <td>6-7</td>
          </tr>
          <tr>
            <td>Seconds</td>
            <td>No</td>
            <td>Yes (first field)</td>
          </tr>
          <tr>
            <td>Day of Week</td>
            <td>0-6 (Sun=0)</td>
            <td>1-7 (Sun=1) or SUN-SAT</td>
          </tr>
          <tr>
            <td>? wildcard</td>
            <td>No</td>
            <td>Yes (DOM or DOW)</td>
          </tr>
        </tbody>
      </table>

      <h2>Special Characters</h2>
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

      <h2>Common Examples</h2>
      <table>
        <thead>
          <tr>
            <th>Expression</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>*/5 * * * *</code></td>
            <td>Every 5 minutes</td>
          </tr>
          <tr>
            <td><code>0 * * * *</code></td>
            <td>Every hour</td>
          </tr>
          <tr>
            <td><code>0 0 * * *</code></td>
            <td>Every day at midnight</td>
          </tr>
          <tr>
            <td><code>0 9 * * 1-5</code></td>
            <td>Weekdays at 09:00</td>
          </tr>
          <tr>
            <td><code>0 0 1 * *</code></td>
            <td>1st of every month</td>
          </tr>
          <tr>
            <td><code>0 0 1 1 *</code></td>
            <td>Every January 1st</td>
          </tr>
          <tr>
            <td><code>*/30 9-17 * * 1-5</code></td>
            <td>Every 30 min during business hours</td>
          </tr>
        </tbody>
      </table>

      <h2>Common Mistakes</h2>
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
          Advanced Mode
        </Link>
      </div>
    </div>
  );
}
