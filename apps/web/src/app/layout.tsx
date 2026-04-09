import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { siteConfig, buildMetadata, jsonLdWebApp } from '@/lib/seo';
import { TopNav } from '@/components/top-nav';
import { ThemeToggle } from '@/components/theme-toggle';

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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp()) }}
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
            className="bg-surface-container-low w-full py-8 border-t border-outline-variant/20"
            role="contentinfo"
          >
            <div className="flex flex-col items-center gap-4 w-full">
              <span className="text-primary font-bold font-headline">CronWizard</span>
              <nav className="flex gap-8">
                <Link
                  href="/docs"
                  className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm tracking-wide"
                >
                  Documentation
                </Link>
                <a
                  href="https://github.com/musanmaz/cronwizard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant/60 hover:text-primary transition-colors font-body text-sm tracking-wide"
                >
                  GitHub
                </a>
              </nav>
              <p className="text-on-surface-variant/40 font-body text-sm tracking-wide">
                &copy; {new Date().getFullYear()} CronWizard
              </p>
            </div>
          </footer>
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
