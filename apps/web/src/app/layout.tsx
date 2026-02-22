import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { siteConfig, buildMetadata, jsonLdWebApp } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  ...buildMetadata({}),
  title: {
    default: `${siteConfig.name} - Cron Expression Generator & Validator`,
    template: `%s | ${siteConfig.name}`,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp()) }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50" role="banner">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg" aria-label="CronWizard Home">
                <span className="text-primary">Cron</span>
                <span>Wizard</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
                <Link href="/" className="hover:text-primary transition-colors">
                  Builder
                </Link>
                <Link href="/advanced" className="hover:text-primary transition-colors">
                  Advanced
                </Link>
                <Link href="/docs" className="hover:text-primary transition-colors">
                  Docs
                </Link>
                <a
                  href="https://github.com/musanmaz/cronwizard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1" role="main">{children}</main>

          <footer className="border-t py-6 text-center text-sm text-muted-foreground" role="contentinfo">
            <div className="container mx-auto px-4">
              CronWizard v2.0.0 &middot; MIT License &middot;{' '}
              <a
                href="https://github.com/musanmaz/cronwizard"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </footer>
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
