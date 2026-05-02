import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { siteConfig, buildMetadata, jsonLdWebApp, jsonLdOrganization, jsonLdSoftwareApp } from '@/lib/seo';
import { TopNav } from '@/components/top-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Analytics } from '@vercel/analytics/next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  ...buildMetadata({}),
  title: {
    default: `${siteConfig.name} - Cron Expression Generator & Validator`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

const ANTI_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3016597125971732"
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp()) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header
            className="bg-surface/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-outline-variant/20"
            role="banner"
          >
            <div className="flex justify-between items-center h-14 px-6 max-w-7xl mx-auto font-headline tracking-tight">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-xl font-bold text-primary"
                  aria-label="CronWizard Home"
                >
                  CronWizard
                </Link>
                <TopNav />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <a
                  href="https://github.com/musanmaz/cronwizard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors md:hidden"
                  aria-label="GitHub"
                >
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </a>
              </div>
            </div>
          </header>

          <main className="flex-grow pt-24 pb-16 px-6" role="main">
            {children}
          </main>

          <footer
            className="bg-surface-container-low w-full py-12 border-t border-outline-variant/20"
            role="contentinfo"
          >
            <div className="max-w-5xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-primary font-bold font-headline text-sm mb-3">Tools</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Cron Builder
                    </Link>
                    <Link href="/advanced" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Cron Validator
                    </Link>
                  </nav>
                </div>
                <div>
                  <h3 className="text-primary font-bold font-headline text-sm mb-3">Guides</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/docs" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Documentation
                    </Link>
                    <Link href="/examples" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Cron Examples
                    </Link>
                    <Link href="/best-practices" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Best Practices
                    </Link>
                    <Link href="/troubleshooting" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Troubleshooting
                    </Link>
                    <Link href="/quartz" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Quartz Cron
                    </Link>
                    <Link href="/kubernetes" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Kubernetes CronJob
                    </Link>
                  </nav>
                </div>
                <div>
                  <h3 className="text-primary font-bold font-headline text-sm mb-3">Formats</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/docs#unix-format" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Unix Cron
                    </Link>
                    <Link href="/quartz#quartz-format" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Quartz Cron
                    </Link>
                    <Link href="/docs#special-characters" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Special Characters
                    </Link>
                  </nav>
                </div>
                <div>
                  <h3 className="text-primary font-bold font-headline text-sm mb-3">Project</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/about" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      About
                    </Link>
                    <Link href="/contact" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm">
                      Contact
                    </Link>
                    <a
                      href="https://github.com/musanmaz/cronwizard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm"
                    >
                      GitHub
                    </a>
                  </nav>
                </div>
              </div>
              <div className="border-t border-outline-variant/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-primary font-bold font-headline">CronWizard</span>
                <nav className="flex gap-6 text-sm" aria-label="Legal">
                  <Link href="/privacy" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-on-surface-variant/60 hover:text-primary transition-colors font-body">
                    Terms of Service
                  </Link>
                </nav>
                <p className="text-on-surface-variant/40 font-body text-sm tracking-wide">
                  &copy; {new Date().getFullYear()} CronWizard
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
