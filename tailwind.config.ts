import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--bg-app)',
        'card-bg': 'var(--bg-card)',
        'card-hover': 'var(--bg-card-hover)',
        'border-subtle': 'var(--border-subtle)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'link-drive': 'var(--link-drive)',
        'link-drive-hover': 'var(--link-drive-hover)',
        'badge-drive-bg': 'var(--badge-drive-bg)',
        'badge-drive-text': 'var(--badge-drive-text)',
        'brand-accent': 'var(--brand-accent)',
      },
    },
  },
  plugins: [],
};

export default config;
