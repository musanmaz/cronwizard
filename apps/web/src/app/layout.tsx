import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CronWizard - Cron Expression Generator',
  description: 'Generate, validate, and explain cron expressions with an intuitive wizard interface.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <span className="text-primary">Cron</span>
                <span>Wizard</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm">
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

          <main className="flex-1">{children}</main>

          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
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
