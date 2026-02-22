import type { Metadata } from 'next';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';
import { AdvancedEditor } from '@/components/advanced-editor';

export const metadata: Metadata = buildMetadata({
  title: 'Advanced Cron Editor',
  description:
    'Enter any cron expression to instantly validate, describe in plain English, see next run times with timezone support, and export to Kubernetes, GitHub Actions or systemd.',
  path: '/advanced',
  keywords: [
    'cron validator',
    'cron tester',
    'cron parser online',
    'cron expression tester',
    'validate crontab',
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
      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Cron Editor</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter a cron expression directly to validate, describe in plain English, and export.
          </p>
        </header>
        <AdvancedEditor />
      </article>
    </>
  );
}
