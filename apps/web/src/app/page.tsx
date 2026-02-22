import type { Metadata } from 'next';
import { WizardBuilder } from '@/components/wizard-builder';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cron Expression Builder',
  description:
    'Build cron expressions visually with an intuitive step-by-step wizard. Supports Unix and Quartz formats, timezone-aware next run calculation, and export to Kubernetes, GitHub Actions, systemd.',
  path: '/',
  keywords: ['cron builder', 'cron wizard', 'visual cron editor', 'schedule builder'],
});

export default function HomePage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Cron Builder', url: `${siteConfig.url}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Cron Expression Builder</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Generate, validate, and export cron expressions with an intuitive wizard.
            Supports Unix &amp; Quartz formats with timezone-aware scheduling.
          </p>
        </header>
        <WizardBuilder />
      </article>
    </>
  );
}
