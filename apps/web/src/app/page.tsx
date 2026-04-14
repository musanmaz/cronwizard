import type { Metadata } from 'next';
import { WizardBuilder } from '@/components/wizard-builder';
import { buildMetadata, jsonLdBreadcrumb, jsonLdHowTo, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Free Cron Expression Generator & Builder Online',
  description:
    'Free online cron expression generator — build cron schedules visually in seconds. Supports Unix & Quartz formats, instant validation, next-run preview with timezone, and one-click export to Kubernetes, GitHub Actions & systemd.',
  path: '/',
  keywords: [
    'cron builder',
    'cron wizard',
    'visual cron editor',
    'schedule builder',
    'cron maker',
    'cron schedule generator',
    'crontab builder',
  ],
});

export default function HomePage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Cron Builder', url: `${siteConfig.url}/` },
  ]);
  const howTo = jsonLdHowTo();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <article className="max-w-5xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
            Cron Expression Generator &amp; Builder
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            Build cron expressions visually with an intuitive wizard. Get real-time human-readable
            translations, validate instantly, and export to Kubernetes, GitHub Actions or systemd.
          </p>
        </header>
        <WizardBuilder />
      </article>
    </>
  );
}
