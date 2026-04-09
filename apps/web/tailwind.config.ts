import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'surface-variant': 'var(--surface-variant)',
        outline: 'var(--outline)',
        secondary: 'var(--secondary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'on-secondary': 'var(--on-secondary)',
        'on-secondary-container': 'var(--on-secondary-container)',
        'primary-container': 'var(--primary-container)',
        'on-error-container': 'var(--on-error-container)',
        surface: 'var(--surface)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-high': 'var(--surface-container-high)',
        'on-background': 'var(--on-background)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-dim': 'var(--surface-dim)',
        tertiary: 'var(--tertiary)',
        'surface-bright': 'var(--surface-bright)',
        'surface-tint': 'var(--surface-tint)',
        'on-primary': 'var(--on-primary)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        'outline-variant': 'var(--outline-variant)',
        error: 'var(--error)',
        'on-primary-container': 'var(--on-primary-container)',
        'on-tertiary': 'var(--on-tertiary)',
        'error-container': 'var(--error-container)',
        'surface-container': 'var(--surface-container)',
        'on-surface': 'var(--on-surface)',
        'inverse-surface': 'var(--inverse-surface)',
        'inverse-on-surface': 'var(--inverse-on-surface)',
        'inverse-primary': 'var(--inverse-primary)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        label: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
