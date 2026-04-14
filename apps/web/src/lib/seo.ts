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
    'cron wizard',
    'cron maker',
    'cron editor',
    'cron configurator',
    'quartz cron',
    'quartz cron expression',
    'unix cron',
    'cron next run',
    'cron to human readable',
    'cron expression explained',
    'cron expression syntax',
    'cron expression generator',
    'cron expression generator online',
    'cron expression builder',
    'crontab generator',
    'cronjob expression',
    'kubernetes cronjob',
    'github actions schedule',
    'systemd timer',
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
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Cron Expression Generator & Validator`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
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

export function jsonLdOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: ['https://github.com/musanmaz/cronwizard'],
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
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
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

export function jsonLdSoftwareApp() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
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
  };
}

export function jsonLdHowTo() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a Cron Expression',
    description:
      'Step-by-step guide to building a cron expression using CronWizard visual builder.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose your cron format',
        text: 'Select Unix (5 fields) or Quartz (6-7 fields) depending on your target platform.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Configure each time field',
        text: 'Use the visual selectors to set minute, hour, day of month, month, and day of week values.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Review the expression',
        text: 'See the generated cron expression and its human-readable translation in real time.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Preview next run times',
        text: 'Check the upcoming scheduled run times with your preferred timezone to verify correctness.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Export or copy',
        text: 'Copy the expression or export as Kubernetes CronJob YAML, GitHub Actions workflow, or systemd timer.',
      },
    ],
    tool: {
      '@type': 'HowToTool',
      name: 'CronWizard',
    },
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
