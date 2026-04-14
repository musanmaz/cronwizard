import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CronWizard - Cron Expression Generator & Validator',
    short_name: 'CronWizard',
    description:
      'Free online cron expression generator, validator and explainer. Build cron schedules visually, convert between Unix and Quartz formats, and export to Kubernetes, GitHub Actions or systemd.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f1a',
    theme_color: '#494bd6',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['developer tools', 'utilities', 'productivity'],
  };
}
