import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with the CronWizard team. Report bugs, request features, or ask questions about our free cron expression generator and validator.',
  path: '/contact',
  keywords: ['contact cronwizard', 'cronwizard support'],
});

export default function ContactPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Contact', url: `${siteConfig.url}/contact` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-3xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-a:text-primary">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
          Contact CronWizard
        </h1>

        <p>
          We love hearing from the CronWizard community. Whether you&apos;ve found a bug, want to
          request a feature, or have a question about cron scheduling, we&apos;re happy to help.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">GitHub (Preferred)</h2>
        <p>
          The fastest way to reach us is through our GitHub repository. Open an issue for bug
          reports or feature requests, or start a discussion for general questions.
        </p>
        <div className="not-prose mt-4">
          <a
            href="https://github.com/musanmaz/cronwizard/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Open an Issue on GitHub
          </a>
        </div>

        <h2 className="text-xl font-bold text-on-surface mt-10">Common Questions</h2>

        <h3 className="text-lg font-bold text-on-surface mt-6">
          The cron expression I generated isn&apos;t working on my server. What should I check?
        </h3>
        <p>
          First, verify that the format matches your target platform. Linux crontab and Kubernetes
          use the 5-field Unix format (no seconds), while Java Quartz and Spring Boot use 6-7
          fields (with seconds). Also double-check the timezone of your scheduler — many
          production issues come from the server running in UTC while the operator assumes local
          time.
        </p>

        <h3 className="text-lg font-bold text-on-surface mt-6">
          Can I use CronWizard commercially?
        </h3>
        <p>
          Yes. CronWizard is free to use for any purpose, including commercial projects. Please
          review our <Link href="/terms">Terms of Service</Link> for details.
        </p>

        <h3 className="text-lg font-bold text-on-surface mt-6">
          Do you collect my cron expressions?
        </h3>
        <p>
          No. CronWizard processes everything in your browser. Your cron expressions never leave
          your device. See the <Link href="/privacy">Privacy Policy</Link> for details.
        </p>

        <h3 className="text-lg font-bold text-on-surface mt-6">
          How do I report a security issue?
        </h3>
        <p>
          Please open a private security advisory on{' '}
          <a
            href="https://github.com/musanmaz/cronwizard/security"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{' '}
          rather than filing a public issue.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Advertising &amp; Partnerships</h2>
        <p>
          For advertising or partnership inquiries related to CronWizard, please open a GitHub
          issue labeled <code>partnership</code> describing your proposal, and we&apos;ll respond
          there.
        </p>

        <div className="not-prose mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-on-primary font-semibold text-sm hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all"
          >
            Back to Builder
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            About CronWizard
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-2.5 font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            Documentation
          </Link>
        </div>
      </article>
    </>
  );
}
