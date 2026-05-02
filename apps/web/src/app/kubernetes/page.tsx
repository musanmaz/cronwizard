import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdFaqPage, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Kubernetes CronJob Schedule Guide & Generator',
  description:
    'Learn how to write Kubernetes CronJob schedules. See YAML examples, cron syntax rules, timezone configuration, concurrency policies, and common patterns. Generate & export K8s CronJob YAML instantly.',
  path: '/kubernetes',
  keywords: [
    'kubernetes cronjob',
    'kubernetes cron schedule',
    'k8s cronjob',
    'kubernetes cronjob yaml',
    'kubernetes cronjob example',
    'kubernetes cron expression',
    'kubectl cronjob',
    'k8s cron schedule',
    'cronjob kubernetes schedule',
  ],
});

const K8S_EXAMPLES: { schedule: string; description: string; yaml: string }[] = [
  {
    schedule: '*/5 * * * *',
    description: 'Run every 5 minutes',
    yaml: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: health-check
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: health-check
            image: busybox:latest
            command: ["sh", "-c", "echo Health check at $(date)"]
          restartPolicy: OnFailure`,
  },
  {
    schedule: '0 0 * * *',
    description: 'Daily at midnight (database backup)',
    yaml: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: "0 0 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16
            command: ["pg_dump", "-h", "db-host", "-U", "admin", "mydb"]
          restartPolicy: OnFailure`,
  },
  {
    schedule: '0 2 * * 0',
    description: 'Weekly on Sunday at 2:00 AM (cleanup)',
    yaml: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: weekly-cleanup
spec:
  schedule: "0 2 * * 0"
  concurrencyPolicy: Replace
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cleanup
            image: alpine:latest
            command: ["sh", "-c", "find /data/logs -mtime +30 -delete"]
          restartPolicy: OnFailure`,
  },
];

const FAQ_DATA = [
  {
    question: 'What cron format does Kubernetes use?',
    answer:
      'Kubernetes CronJobs use the standard Unix 5-field cron format: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, Sunday=0). Quartz-style 6-7 field expressions are not supported.',
  },
  {
    question: 'What timezone do Kubernetes CronJobs use?',
    answer:
      'By default, Kubernetes CronJobs use the timezone of the kube-controller-manager, which is usually UTC. Starting with Kubernetes 1.27, you can set the .spec.timeZone field to specify a timezone like "America/New_York" or "Europe/London".',
  },
  {
    question: 'What is the concurrencyPolicy in a Kubernetes CronJob?',
    answer:
      'The concurrencyPolicy controls what happens when a new job is scheduled while the previous one is still running. Options are: Allow (default, runs concurrently), Forbid (skips the new job), and Replace (stops the old job and starts the new one).',
  },
  {
    question: 'How do I check CronJob history in Kubernetes?',
    answer:
      'Use "kubectl get cronjobs" to list CronJobs and "kubectl get jobs" to see completed/running jobs. Use successfulJobsHistoryLimit and failedJobsHistoryLimit in the CronJob spec to control how many completed jobs are kept.',
  },
  {
    question: 'Can I suspend a Kubernetes CronJob?',
    answer:
      'Yes. Set .spec.suspend to true in the CronJob manifest or run "kubectl patch cronjob <name> -p \'{"spec":{"suspend":true}}\'". While suspended, no new jobs will be created at scheduled times.',
  },
];

export default function KubernetesPage() {
  const faqJsonLd = jsonLdFaqPage(FAQ_DATA);
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Kubernetes CronJob', url: `${siteConfig.url}/kubernetes` },
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
          Kubernetes CronJob Schedule Guide
        </h1>

        <p>
          Kubernetes CronJobs are the cluster-native way to run scheduled work. They wrap the
          familiar Unix cron syntax in a Kubernetes resource that creates a fresh{' '}
          <code>Job</code> at every fire of the schedule, which in turn creates a fresh{' '}
          <code>Pod</code> to do the actual work. The model is straightforward, but a handful
          of details — concurrency policy, history limits, missed-deadline handling, and
          timezone behavior — turn out to matter a lot in production.
        </p>
        <p>
          The schedule itself is plain 5-field Unix cron. There is no support for the Quartz
          6-7 field format, so if you are migrating a schedule from a Java application, drop
          the seconds field. The most common conversion mistake is leaving the leading{' '}
          <code>0</code> in place: <code>0 0 9 * * ?</code> (Quartz, &quot;9 AM&quot;) becomes{' '}
          <code>0 9 * * *</code> in Kubernetes — not <code>0 0 9 * *</code>, which would be a
          syntax error.
        </p>
        <p>
          Below you will find the full schedule format, three production-grade YAML templates
          you can adapt, the rules around concurrency policies, and the timezone configuration
          introduced in Kubernetes 1.27. For the broader operational concerns of running cron
          jobs in production — locking, idempotency, monitoring — see the{' '}
          <Link href="/best-practices">cron best practices guide</Link>. If a schedule is
          firing but the Pod is silent, check the{' '}
          <Link href="/troubleshooting">troubleshooting guide</Link>.
        </p>

        <h2 id="cron-format" className="text-xl font-bold text-on-surface mt-10">
          Kubernetes Cron Schedule Format
        </h2>
        <p>
          Kubernetes uses the standard <strong>5-field Unix cron format</strong>. Quartz-style
          expressions (with seconds) are not supported.
        </p>
        <pre className="bg-surface-container-lowest rounded-xl p-6 not-prose text-sm font-mono text-on-surface-variant border border-outline-variant/20">
          {`┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sun=0)
│ │ │ │ │
* * * * *`}
        </pre>

        <h2 id="yaml-examples" className="text-xl font-bold text-on-surface mt-10">
          CronJob YAML Examples
        </h2>

        {K8S_EXAMPLES.map((example, i) => (
          <div key={i} className="mt-6">
            <h3 className="text-lg font-bold text-on-surface">
              {example.description} — <code>{example.schedule}</code>
            </h3>
            <pre className="bg-surface-container-lowest rounded-xl p-6 not-prose text-sm font-mono text-on-surface-variant border border-outline-variant/20 overflow-x-auto">
              {example.yaml}
            </pre>
          </div>
        ))}

        <h2 id="concurrency" className="text-xl font-bold text-on-surface mt-10">
          Concurrency Policies
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Policy</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Behavior</th>
                <th className="border border-outline-variant/20 px-4 py-3 text-left text-primary font-bold text-sm">Best For</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant text-sm">
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">Allow</td>
                <td className="border border-outline-variant/20 px-4 py-3">Runs new jobs even if previous ones are still active</td>
                <td className="border border-outline-variant/20 px-4 py-3">Independent, idempotent tasks</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">Forbid</td>
                <td className="border border-outline-variant/20 px-4 py-3">Skips new job if previous is still running</td>
                <td className="border border-outline-variant/20 px-4 py-3">Database backups, non-overlapping work</td>
              </tr>
              <tr>
                <td className="border border-outline-variant/20 px-4 py-3 font-mono text-primary">Replace</td>
                <td className="border border-outline-variant/20 px-4 py-3">Cancels running job and starts new one</td>
                <td className="border border-outline-variant/20 px-4 py-3">Cache refresh, latest-data-wins scenarios</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="timezone" className="text-xl font-bold text-on-surface mt-10">
          Setting a Timezone (Kubernetes 1.27+)
        </h2>
        <p>
          Starting with Kubernetes 1.27, you can set the <code>.spec.timeZone</code> field
          to any valid IANA timezone:
        </p>
        <pre className="bg-surface-container-lowest rounded-xl p-6 not-prose text-sm font-mono text-on-surface-variant border border-outline-variant/20 overflow-x-auto">
          {`apiVersion: batch/v1
kind: CronJob
metadata:
  name: timezone-example
spec:
  schedule: "0 9 * * 1-5"
  timeZone: "America/New_York"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: notify
            image: alpine:latest
            command: ["echo", "Good morning NYC!"]
          restartPolicy: OnFailure`}
        </pre>

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
            Generate CronJob Schedule
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Browse Examples
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
