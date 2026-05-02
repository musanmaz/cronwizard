import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cron Job Best Practices for Production Systems',
  description:
    'Practical best practices for running cron jobs reliably in production: idempotency, locking, monitoring, timezones, alerting, retries and the difference between "the schedule fired" and "the job succeeded".',
  path: '/best-practices',
  keywords: [
    'cron best practices',
    'cron in production',
    'cron job reliability',
    'cron job monitoring',
    'cron idempotency',
    'cron locking',
    'cron alerting',
  ],
});

export default function BestPracticesPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Best Practices', url: `${siteConfig.url}/best-practices` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-3xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-surface-container-lowest prose-pre:border prose-pre:border-outline-variant/20">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
          Cron Job Best Practices for Production Systems
        </h1>
        <p>
          Cron is deceptively simple. The syntax fits in five fields, the daemon has been around
          for forty years, and a one-line crontab entry can keep an entire backup pipeline
          running. The trouble starts when that one-line entry silently stops working — the
          schedule still fires, the script still runs, but somewhere along the way the data is
          wrong, the lock file is stale, or the timezone has drifted by an hour.
        </p>
        <p>
          This guide collects the practical rules I rely on when putting cron jobs into
          production. None of them are exotic, but skipping any one of them is usually how a
          quiet 4 AM cron turns into a 4 PM incident.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">1. Make Every Job Idempotent</h2>
        <p>
          Idempotency means that running the job twice in a row produces the same result as
          running it once. This is the single most important property of a production cron job.
          Schedulers retry. Operators rerun jobs by hand to verify a fix. Container restarts
          reschedule pending jobs. If your job assumes &quot;exactly once&quot; semantics, all
          three of those situations will eventually corrupt your data.
        </p>
        <p>
          Concrete patterns that make jobs idempotent:
        </p>
        <ul>
          <li>
            Use upserts (<code>INSERT &hellip; ON CONFLICT</code> in PostgreSQL,{' '}
            <code>MERGE</code> in SQL Server) instead of plain inserts.
          </li>
          <li>
            Process from a queue and acknowledge messages only after success, so duplicates are
            impossible.
          </li>
          <li>
            Track per-row processing state (<code>processed_at</code>, <code>last_run_id</code>)
            and skip rows already handled.
          </li>
          <li>
            For file-processing jobs, move handled files to a <code>done/</code> directory or
            tag them with an extended attribute, so a second run sees them as already complete.
          </li>
        </ul>
        <p>
          When idempotency genuinely is impossible (sending an email, charging a card, posting
          to an external API), record the side effect under a deterministic idempotency key so
          you can detect duplicates downstream.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">2. Lock to Prevent Overlapping Runs</h2>
        <p>
          A 5-minute job that occasionally takes 10 minutes will overlap with itself. Two copies
          of the same backup script writing to the same destination is at best a waste, at worst
          data corruption. Always assume your job <em>can</em> overlap and decide explicitly
          what should happen.
        </p>
        <p>
          On Linux, the simplest defence is <code>flock</code>:
        </p>
        <pre>
{`* * * * * /usr/bin/flock -n /var/lock/my-job.lock /opt/bin/my-job.sh`}
        </pre>
        <p>
          The <code>-n</code> flag makes <code>flock</code> exit immediately if the lock is
          held, so the new instance is dropped rather than queued. On Kubernetes, set the
          CronJob&apos;s <code>concurrencyPolicy</code> to <code>Forbid</code> for jobs that
          must not overlap, or <code>Replace</code> for jobs where only the latest run matters.
          See the <Link href="/kubernetes">Kubernetes CronJob guide</Link> for the differences.
        </p>
        <p>
          For application-level locks, an advisory lock in PostgreSQL (<code>pg_try_advisory_lock</code>)
          or a TTL key in Redis works well across multiple replicas. Avoid file-based locks if
          your jobs run on more than one machine — they only protect against overlap on the
          same host.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">3. Always Pin the Timezone</h2>
        <p>
          The single most common cron bug I see in code review is a timezone mismatch. Cron
          interprets schedules in the timezone of the host process. On most Linux distributions
          that is whatever <code>/etc/timezone</code> says. In Docker containers it is usually
          UTC unless you override it. In Kubernetes 1.27+, you can pin a CronJob&apos;s
          timezone explicitly:
        </p>
        <pre>
{`apiVersion: batch/v1
kind: CronJob
spec:
  schedule: "0 9 * * 1-5"
  timeZone: "Europe/Istanbul"`}
        </pre>
        <p>
          Without that <code>timeZone</code> field, your &quot;9 AM on weekdays&quot; job runs
          at 9 AM UTC, which is noon in Istanbul. This kind of bug is invisible until daylight
          saving time changes — at which point your &quot;9 AM job&quot; suddenly fires at 8 AM
          (or 10 AM) for half the year.
        </p>
        <p>
          Always preview your schedule in the production timezone using a tool like{' '}
          <Link href="/">CronWizard&apos;s timezone-aware preview</Link> before deploying. Run a
          dry-run that prints the next ten execution times and read them in the timezone your
          users actually live in, not the timezone of your laptop.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">4. Monitor the Schedule, Not Just the Job</h2>
        <p>
          A job that fails loudly is easy to fix. A job that <em>silently stops running</em> is
          the dangerous one — the database backup that hasn&apos;t happened in three weeks
          because the container has been crash-looping in an unwatched namespace.
        </p>
        <p>
          The fix is a dead-man&apos;s switch: a small heartbeat the job emits when it
          completes successfully, and an alert that fires if no heartbeat arrives within the
          expected window. Common implementations:
        </p>
        <ul>
          <li>
            Hosted services like Healthchecks.io, Cronitor, or Better Stack. The job sends an
            HTTP <code>GET</code> to a unique URL on success; the service alerts if the ping
            doesn&apos;t arrive on schedule.
          </li>
          <li>
            A Prometheus counter incremented on success, paired with an alert rule like{' '}
            <code>increase(cron_job_completed_total[1h]) == 0</code>.
          </li>
          <li>
            For internal teams, a Slack or PagerDuty webhook called only on failure, plus a
            second alert if no message — success or failure — has arrived in N hours.
          </li>
        </ul>
        <p>
          Whichever tool you pick, the point is the same: your alert should depend on{' '}
          <em>positive evidence of execution</em>, not on the job process erroring out.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">5. Stagger Schedules to Avoid Thundering Herds</h2>
        <p>
          When a hundred CronJobs all run at <code>0 * * * *</code>, they all start at the same
          millisecond. They compete for database connections, fight for memory on the same
          node, and frequently overload the very service they depend on. This is the
          &quot;thundering herd&quot; pattern, and it is surprisingly common in larger
          Kubernetes clusters.
        </p>
        <p>
          A simple defence is to spread out start times deliberately:
        </p>
        <pre>
{`# instead of every job at minute 0:
0 * * * *  job-a
0 * * * *  job-b
0 * * * *  job-c

# stagger them across the hour:
3 * * * *  job-a
17 * * * *  job-b
31 * * * *  job-c`}
        </pre>
        <p>
          For a fleet of dynamically generated CronJobs, hash the job name to a minute between
          0 and 59 and use that as the start minute. The exact distribution is less important
          than the absence of correlation.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">6. Set Sensible Timeouts and Retries</h2>
        <p>
          A cron job that hangs forever does not just block its next run — it can hold open
          database connections, lock files, or external API quotas. Always wrap your jobs in an
          explicit timeout:
        </p>
        <pre>
{`*/5 * * * * timeout 240 /opt/bin/refresh-cache.sh`}
        </pre>
        <p>
          The <code>timeout</code> command (from coreutils) kills the process after the given
          number of seconds. Pick a value comfortably below your scheduling interval — a
          5-minute job timing out at 4 minutes leaves room for cleanup before the next
          invocation arrives.
        </p>
        <p>
          On Kubernetes, set <code>activeDeadlineSeconds</code> on the Job spec for the same
          effect. Combine it with <code>backoffLimit: 0</code> if the job is not safe to retry,
          or a larger value if a transient failure should trigger a re-run.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">7. Treat Logs as Forensics</h2>
        <p>
          When something goes wrong with a cron job, the only thing you have is the log line
          from a run that already finished. Make those log lines count:
        </p>
        <ul>
          <li>
            Log the start time, end time, duration, exit code, and a high-level summary of work
            done (rows processed, files touched, bytes transferred).
          </li>
          <li>
            Use a structured log format (JSON) so the lines are queryable later. Fields like{' '}
            <code>job_name</code>, <code>run_id</code>, and <code>environment</code> let you
            slice across runs.
          </li>
          <li>
            Capture both stdout and stderr. Plain crontab discards stderr by default unless you
            redirect it explicitly: <code>command 2&gt;&amp;1</code>.
          </li>
          <li>
            Forward logs to a central system (CloudWatch, Loki, Elastic). On a single host
            crontab, append to a file and rotate with <code>logrotate</code>.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-12">8. Keep Schedules in Version Control</h2>
        <p>
          Hand-edited crontabs on production hosts are the worst kind of operational secret.
          They drift, they vanish when the host is rebuilt, and they are invisible to code
          review. Every cron schedule in your stack should live in version control:
        </p>
        <ul>
          <li>Kubernetes CronJob YAML in your Helm chart or kustomize overlay.</li>
          <li>GitHub Actions <code>schedule</code> triggers in <code>.github/workflows</code>.</li>
          <li>
            Server crontabs deployed via Ansible, Chef, Puppet, or an Nx-style{' '}
            <code>crontab.d/</code> directory under <code>/etc/cron.d/</code> with the file
            committed in your infra repo.
          </li>
        </ul>
        <p>
          When schedules live in a repo, they get reviewed like code, recovered like code, and
          rolled back like code.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">9. Document Why, Not Just When</h2>
        <p>
          A cron expression is a <em>what</em> and a <em>when</em>. It is rarely a <em>why</em>.
          Six months from now you will not remember why <code>0 4 * * 1-5</code> was the right
          choice for the report job, only that someone set it. Add a comment:
        </p>
        <pre>
{`# weekday morning report — 4 AM Istanbul to land in inboxes
# before the European market opens at 5 AM Istanbul
0 4 * * 1-5 TZ=Europe/Istanbul /opt/bin/morning-report.sh`}
        </pre>
        <p>
          The same comment style applies to Kubernetes CronJob manifests, GitHub Actions
          workflows, and systemd unit descriptions. The cost of writing the comment is twenty
          seconds; the cost of guessing later is hours of archaeology.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">10. Verify Before You Trust</h2>
        <p>
          Before any new schedule reaches production, validate it explicitly:
        </p>
        <ul>
          <li>
            Run the schedule through a tool like{' '}
            <Link href="/">CronWizard&apos;s validator</Link> to confirm the human-readable
            description matches your intent.
          </li>
          <li>
            Print the next ten run times in the production timezone and read them out loud to
            yourself.
          </li>
          <li>
            Deploy to a staging environment first if at all possible. A staging CronJob with
            the same schedule is the cheapest insurance you can buy.
          </li>
          <li>
            For high-impact jobs (financial close, mass email), have a second engineer confirm
            the schedule before merging.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-12">Closing Thought</h2>
        <p>
          Cron is one of the most reliable pieces of software ever written. The failures
          attributed to it almost always come from how it is wrapped: missing locks, ambiguous
          timezones, silent monitoring gaps. Apply the practices above and your cron jobs
          become exactly what they were meant to be — boring, predictable, and the kind of
          infrastructure you forget about for years.
        </p>
        <p>
          For the other side of the coin — what to do when something is already broken — see
          our <Link href="/troubleshooting">cron troubleshooting guide</Link>. To explore
          common patterns, browse our annotated{' '}
          <Link href="/examples">cron expression examples</Link>.
        </p>

        <div className="not-prose mt-12 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all"
          >
            Open the Cron Builder
          </Link>
          <Link
            href="/troubleshooting"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Troubleshooting Guide
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Cron Examples
          </Link>
        </div>
      </article>
    </>
  );
}
