import type { Metadata } from 'next';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';
import { AdvancedEditor } from '@/components/advanced-editor';

export const metadata: Metadata = buildMetadata({
  title: 'Free Cron Expression Validator & Tester Online',
  description:
    'Validate any cron expression instantly — get plain-English descriptions, preview the next 10 run times with timezone support, and export to Kubernetes, GitHub Actions or systemd. Free online cron tester.',
  path: '/advanced',
  keywords: [
    'cron validator',
    'cron tester',
    'cron parser online',
    'cron expression tester',
    'validate crontab',
    'cron checker',
    'cron expression validator',
    'test cron expression',
  ],
});

export default function AdvancedPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Advanced Editor', url: `${siteConfig.url}/advanced` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-5xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
            Cron Expression Validator &amp; Tester
          </h1>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto leading-relaxed">
            Paste any cron expression to instantly validate, get a plain-English description,
            preview next run times, and export to Kubernetes, GitHub Actions or systemd.
          </p>
        </header>
        <AdvancedEditor />
      </article>
    </>
  );
}
