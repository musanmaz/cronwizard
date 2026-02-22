import type { Metadata } from 'next';

const SITE_NAME = 'CronWizard';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cronwizard.com';
const SITE_DESCRIPTION =
  'Free online cron expression generator, validator and explainer. Build cron schedules visually, convert between Unix and Quartz formats, calculate next run times, and export to Kubernetes, GitHub Actions or systemd.';

export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  keywords: [
    'cron',
    'cron expression',
    'cron generator',
    'cron validator',
    'crontab',
    'cron schedule',
    'cron builder',
    'quartz cron',
    'unix cron',
    'cron next run',
    'cron to human readable',
    'kubernetes cronjob',
    'github actions schedule',
    'systemd timer',
    'cron expression generator online',
    'crontab guru alternative',
  ],
} as const;

export function buildMetadata(page: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const title = page.title
    ? `${page.title} | ${SITE_NAME}`
    : `${SITE_NAME} - Cron Expression Generator & Validator`;
  const description = page.description ?? SITE_DESCRIPTION;
  const url = `${SITE_URL}${page.path ?? ''}`;
  const keywords = [...siteConfig.keywords, ...(page.keywords ?? [])];

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function jsonLdWebApp() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Cron expression generator',
      'Cron expression validator',
      'Human-readable cron descriptions',
      'Unix and Quartz format support',
      'Next run time calculator with timezone',
      'Kubernetes CronJob YAML export',
      'GitHub Actions schedule export',
      'systemd timer export',
    ],
  };
}

export function jsonLdFaqPage(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
