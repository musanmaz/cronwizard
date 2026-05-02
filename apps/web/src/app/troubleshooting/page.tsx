import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdFaqPage, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cron Job Troubleshooting — Why Your Cron Job Is Not Running',
  description:
    'A practical troubleshooting guide for cron jobs that don\'t run, run too often, run at the wrong time, or fail silently. Covers PATH, timezone, environment, permissions, mail, and Kubernetes-specific issues.',
  path: '/troubleshooting',
  keywords: [
    'cron not running',
    'cron job not running',
    'cron troubleshooting',
    'cron debug',
    'why is my cron not working',
    'crontab not working',
    'kubernetes cronjob not running',
    'cron silent failure',
  ],
});

const FAQ_DATA = [
  {
    question: 'Why is my cron job not running at all?',
    answer:
      'The most common reasons are: (1) the cron daemon is not running on the host, (2) the crontab file has a syntax error and was rejected, (3) the user the crontab belongs to does not have permission to run the command, or (4) the schedule is correct but the timezone is different from what you expect. Check the system log (/var/log/syslog or journalctl -u cron) first — cron almost always logs the reason it skipped a run.',
  },
  {
    question: 'Why does my cron job work when I run it manually but not when cron runs it?',
    answer:
      'Cron runs your script with a minimal environment — no PATH, no shell aliases, no profile sourcing. Use absolute paths to every binary (/usr/bin/python3, not python3), set PATH explicitly at the top of your script or crontab, and source any required environment files (e.g. source /etc/environment) before doing anything else.',
  },
  {
    question: 'Why is my cron job running at the wrong time?',
    answer:
      'Almost always a timezone mismatch. Cron uses the system timezone of the host process, which in containers is usually UTC. If you wrote the schedule for your local timezone, you need to either change the host timezone (TZ environment variable, /etc/timezone) or convert the schedule to UTC. On Kubernetes 1.27+, set spec.timeZone on the CronJob.',
  },
  {
    question: 'Why is my Kubernetes CronJob suspended automatically?',
    answer:
      'Kubernetes auto-suspends CronJobs that miss too many start times (default startingDeadlineSeconds combined with a slow scheduler). Check the .status.lastScheduleTime and conditions on the CronJob. Common causes are a controller-manager outage, a CronJob with a startingDeadlineSeconds shorter than the schedule, or a resource quota that prevented Job creation.',
  },
  {
    question: 'Why did my cron job run twice within seconds?',
    answer:
      'A few possibilities: (1) you have the same crontab installed for two different users, (2) the schedule is duplicated across /etc/crontab and /etc/cron.d/, (3) on Kubernetes, concurrencyPolicy is Allow and a previous run was still in progress, or (4) you ran a manual invocation that overlapped with the scheduled one. Greppping the host for the script name usually finds the duplicate quickly.',
  },
];

export default function TroubleshootingPage() {
  const faqJsonLd = jsonLdFaqPage(FAQ_DATA);
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Troubleshooting', url: `${siteConfig.url}/troubleshooting` },
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
      <article className="max-w-3xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-surface-container-lowest prose-pre:border prose-pre:border-outline-variant/20">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
          Cron Job Troubleshooting Guide
        </h1>
        <p>
          Cron jobs fail in spectacular and quiet ways. The spectacular failures — a missing
          binary, a syntax error in the crontab, a Kubernetes pod that won&apos;t schedule —
          are easy to find because something obviously went wrong. The quiet failures are
          worse: the job &quot;runs&quot;, the exit code is 0, but the actual work didn&apos;t
          happen. This guide walks through the categories of cron problems I have debugged most
          often, with the diagnostic steps that usually surface the root cause.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">My Cron Job Doesn&apos;t Run At All</h2>
        <p>
          Start by confirming that cron itself is even attempting to fire your schedule. On
          most Linux distributions, cron logs every job invocation to syslog:
        </p>
        <pre>
{`# Debian / Ubuntu
grep CRON /var/log/syslog | tail -50

# RHEL / Amazon Linux / CentOS
grep CROND /var/log/cron | tail -50

# systemd-based distros
journalctl -u cron --since "1 hour ago"`}
        </pre>
        <p>
          If you see lines like <code>(USER) CMD (/path/to/script.sh)</code> at the expected
          times, cron is firing your job and the problem lies inside the script. If those lines
          are missing, cron is not seeing the schedule at all. The most common reasons:
        </p>
        <ul>
          <li>
            <strong>The cron daemon is stopped.</strong> Check with{' '}
            <code>systemctl status cron</code> (Debian) or{' '}
            <code>systemctl status crond</code> (RHEL). On a fresh container image, the daemon
            often isn&apos;t enabled by default.
          </li>
          <li>
            <strong>The crontab has a syntax error.</strong>{' '}
            <code>crontab -l</code> will show what cron actually loaded. Any line cron rejects
            is logged with the parsing error.
          </li>
          <li>
            <strong>The schedule is in the wrong field.</strong> A typo like{' '}
            <code>0 * 9 * 1-5</code> instead of <code>0 9 * * 1-5</code> moves the &quot;9&quot;
            into the day-of-month slot, which means the job runs at minute 0 of every hour, but
            only on the 9th of the month. Validate every new schedule against{' '}
            <Link href="/">CronWizard&apos;s human-readable translation</Link> before deploying.
          </li>
          <li>
            <strong>You edited the wrong crontab.</strong>{' '}
            <code>crontab -e</code> as root edits root&apos;s crontab; as a regular user, it
            edits that user&apos;s. <code>/etc/crontab</code> and{' '}
            <code>/etc/cron.d/*</code> require an extra user field. Confirm{' '}
            <code>whoami</code> matches the crontab you intended to edit.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-12">It Works When I Run It Manually but Not From Cron</h2>
        <p>
          This is by far the most common failure mode in practice. Cron does not run your job
          in your interactive shell. It runs it with a minimal environment that contains
          almost nothing. Variables you take for granted — <code>PATH</code>,{' '}
          <code>HOME</code>, <code>LANG</code>, anything sourced from{' '}
          <code>~/.bashrc</code> — are not set.
        </p>
        <p>
          The fix is to make the script self-sufficient:
        </p>
        <pre>
{`#!/bin/bash
set -euo pipefail

# Pin PATH explicitly. Cron's default is often just /usr/bin:/bin
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Source the env file your application uses
set -a
source /opt/myapp/.env
set +a

# Use absolute paths for every binary
/usr/bin/python3 /opt/myapp/jobs/daily_report.py`}
        </pre>
        <p>
          A useful debugging trick is to dump the cron environment to a file once and inspect
          it:
        </p>
        <pre>
{`* * * * * env > /tmp/cron-env.txt 2>&1`}
        </pre>
        <p>
          Wait a minute, then <code>cat /tmp/cron-env.txt</code>. The difference between that
          file and <code>env</code> in your interactive shell is the gap your script has to
          fill in.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">It Runs at the Wrong Time</h2>
        <p>
          This always — always — turns out to be a timezone problem. Cron does not have an
          opinion about timezones; it uses whatever the host&apos;s system timezone is. There
          are several layers where that can be set:
        </p>
        <ol>
          <li>
            The <code>TZ</code> environment variable in the crontab line itself, which takes
            precedence: <code>TZ=Europe/Istanbul 0 9 * * 1-5 /opt/bin/job.sh</code>.
          </li>
          <li>
            The crontab&apos;s <code>CRON_TZ</code> directive at the top of the file:{' '}
            <code>CRON_TZ=UTC</code> applies to all subsequent entries.
          </li>
          <li>
            The host&apos;s system timezone (<code>/etc/timezone</code> on Debian, the{' '}
            <code>/etc/localtime</code> symlink on most distros).
          </li>
          <li>
            For Kubernetes CronJobs (1.27+), the <code>.spec.timeZone</code> field. Without it,
            the cluster-wide controller-manager timezone is used, which is almost always UTC.
          </li>
        </ol>
        <p>
          Diagnose by running <code>date</code> inside the same context as the cron job:
        </p>
        <pre>
{`* * * * * date >> /tmp/cron-date.log`}
        </pre>
        <p>
          If <code>date</code> reports a different timezone than you expected, that is the
          source of the wrong-time bug. Once you know what cron <em>thinks</em> the time is,
          adjusting the schedule (or pinning a timezone) is mechanical.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">It Runs but the Output Is Lost</h2>
        <p>
          By default, cron emails the output of every job to the user&apos;s local mailbox.
          Most modern systems don&apos;t have a working mail transfer agent, which means the
          output is silently dropped. To capture output explicitly, redirect both stdout and
          stderr to a log file:
        </p>
        <pre>
{`0 2 * * * /opt/bin/backup.sh >> /var/log/myapp/backup.log 2>&1`}
        </pre>
        <p>
          The <code>2&gt;&amp;1</code> is the critical part. Without it, anything written to
          stderr (which is where most error messages go) vanishes. Pair the log file with{' '}
          <code>logrotate</code> so it doesn&apos;t grow forever.
        </p>
        <p>
          On Kubernetes, container logs are captured automatically by the kubelet; just make
          sure your job writes to stdout/stderr instead of an in-container log file that gets
          discarded when the pod terminates.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-12">It Runs Twice (or More)</h2>
        <p>
          Duplicate runs usually fall into one of these categories:
        </p>
        <ul>
          <li>
            <strong>The same schedule installed twice.</strong> Check{' '}
            <code>crontab -l</code> for every user, plus <code>/etc/crontab</code>,{' '}
            <code>/etc/cron.d/</code>, and <code>/etc/cron.{`{hourly,daily,weekly,monthly}`}/</code>.
            Old deployments left behind in <code>/etc/cron.d/</code> are a classic source of
            mystery duplicates.
          </li>
          <li>
            <strong>Multiple replicas without locking.</strong> If you run cron inside a
            Kubernetes Deployment with replicas &gt; 1, every replica fires the schedule
            independently. The right tool for this is a Kubernetes CronJob (which schedules
            one Job per fire) plus <code>concurrencyPolicy: Forbid</code>.
          </li>
          <li>
            <strong>A long-running job overlapping itself.</strong> A 5-minute schedule that
            takes 7 minutes will overlap. See the{' '}
            <Link href="/best-practices">best practices guide</Link> for locking patterns that
            prevent this.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-12">Kubernetes CronJob-Specific Failures</h2>
        <p>
          Kubernetes CronJobs add their own layer of failure modes. The diagnostic flow is:
        </p>
        <ol>
          <li>
            <code>kubectl get cronjob &lt;name&gt;</code> — confirm{' '}
            <code>LAST SCHEDULE</code> matches what you expect.
          </li>
          <li>
            <code>kubectl describe cronjob &lt;name&gt;</code> — look at{' '}
            <code>Events</code>. Most scheduling failures (quota, missing service account,
            invalid pod spec) appear here.
          </li>
          <li>
            <code>kubectl get jobs --selector=cronjob-name=&lt;name&gt;</code> — list the Job
            objects the CronJob created. Each one corresponds to one schedule fire.
          </li>
          <li>
            <code>kubectl logs job/&lt;job-name&gt;</code> — read the actual container logs.
          </li>
        </ol>
        <p>
          A common silent failure is hitting the <code>successfulJobsHistoryLimit</code> or{' '}
          <code>failedJobsHistoryLimit</code> defaults (3 and 1 respectively). After three
          successful runs, the oldest Job is garbage-collected, taking its logs with it. For
          jobs you actually need to debug after the fact, raise these limits or ship logs to a
          long-term store.
        </p>
        <p>
          For a deeper dive into Kubernetes CronJob behavior, including the
          <code>concurrencyPolicy</code>, <code>startingDeadlineSeconds</code>, and timezone
          handling, see the dedicated <Link href="/kubernetes">Kubernetes CronJob guide</Link>.
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
            Validate a Cron Expression
          </Link>
          <Link
            href="/best-practices"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Best Practices
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
