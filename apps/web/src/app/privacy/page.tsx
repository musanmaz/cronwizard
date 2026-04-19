import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'CronWizard privacy policy. Learn how we handle data, cookies, analytics, and advertising on our free cron expression generator and validator.',
  path: '/privacy',
  keywords: ['privacy policy', 'cronwizard privacy'],
});

export default function PrivacyPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', url: siteConfig.url },
    { name: 'Privacy Policy', url: `${siteConfig.url}/privacy` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="max-w-3xl mx-auto w-full prose dark:prose-invert prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface prose-a:text-primary">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">
          Privacy Policy
        </h1>
        <p className="text-on-surface-variant/70 text-sm">
          Last updated: April 14, 2026
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Overview</h2>
        <p>
          CronWizard (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates{' '}
          <a href={siteConfig.url}>{siteConfig.url}</a> (the &quot;Service&quot;). This Privacy
          Policy explains what information is collected when you use the Service, how it is used,
          and the choices you have.
        </p>
        <p>
          CronWizard is a free, client-side cron expression generator and validator. Cron
          expressions you build or validate are processed in your browser and are not stored on our
          servers.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Information We Collect</h2>

        <h3 className="text-lg font-bold text-on-surface mt-6">Information you provide</h3>
        <p>
          We do not require you to register, sign in, or submit personal information to use
          CronWizard. Cron expressions, schedules, and preferences you enter stay in your browser
          and are not transmitted to us.
        </p>

        <h3 className="text-lg font-bold text-on-surface mt-6">Automatically collected data</h3>
        <p>
          When you visit the Service, your browser automatically sends certain information such as
          your IP address, browser type, device type, operating system, referring URL, and pages
          visited. We use this information only in aggregate form to improve the Service.
        </p>

        <h3 className="text-lg font-bold text-on-surface mt-6">Local storage</h3>
        <p>
          CronWizard uses your browser&apos;s local storage to remember your preferences (for
          example, theme and timezone selection). This data never leaves your device.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Cookies and Analytics</h2>
        <p>
          We use the following third-party services that may set cookies or collect anonymized
          usage data:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vercel Analytics</strong> — privacy-friendly, cookie-less page view and
            performance metrics. Learn more at{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              vercel.com/legal/privacy-policy
            </a>
            .
          </li>
          <li>
            <strong>Google AdSense</strong> — displays advertisements on the Service. Google may
            use cookies to personalize ads and measure effectiveness. You can opt out of
            personalized advertising at{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              google.com/settings/ads
            </a>
            . See Google&apos;s advertising policies at{' '}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
              policies.google.com/technologies/ads
            </a>
            .
          </li>
          <li>
            <strong>Google Search Console</strong> — we use the Search Console verification tag to
            monitor our site&apos;s search performance. No personal data is shared with us from
            this service.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-on-surface mt-10">Third-Party Advertising</h2>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on your prior
          visits to this website and other websites on the internet. Google&apos;s use of
          advertising cookies enables it and its partners to serve ads to you based on your visit
          to our site and/or other sites on the Internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          . Alternatively, you can opt out of third-party vendor use of cookies for personalized
          advertising by visiting{' '}
          <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Data Sharing</h2>
        <p>
          We do not sell or rent personal information. We only share data with the third-party
          processors listed above (Vercel, Google) to operate the Service.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Children&apos;s Privacy</h2>
        <p>
          CronWizard is a developer tool not directed at children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Your Rights</h2>
        <p>
          Depending on your jurisdiction (for example, GDPR in the EU/UK or CCPA in California),
          you may have rights to access, correct, or delete information about you. Because
          CronWizard does not collect personally identifiable account data, these rights are
          primarily satisfied by clearing your browser&apos;s local storage and cookies.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at
          the top of the page reflects the most recent revision.
        </p>

        <h2 className="text-xl font-bold text-on-surface mt-10">Contact Us</h2>
        <p>
          For any questions about this Privacy Policy, please visit our{' '}
          <Link href="/contact">contact page</Link> or open an issue on our{' '}
          <a
            href="https://github.com/musanmaz/cronwizard"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>
      </article>
    </>
  );
}
