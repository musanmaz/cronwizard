'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Generator' },
  { href: '/advanced', label: 'Advanced' },
  { href: '/docs', label: 'Docs' },
  { href: 'https://github.com/musanmaz/cronwizard', label: 'GitHub', external: true },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = !item.external && pathname === item.href;
        const className = isActive
          ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
          : 'text-on-surface-variant hover:text-on-surface transition-colors';

        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {item.label}
            </a>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
