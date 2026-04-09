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
      <article className="max-w-5xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
            Precision Schedule Builder
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            Configure cron expressions with real-time human translation and zero-config deployment.
          </p>
        </header>
        <WizardBuilder />
      </article>
    </>
  );
}
