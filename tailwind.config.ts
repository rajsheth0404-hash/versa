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
        'base-void': '#080A08',
        'card-surface': '#0F1410',
        'card-hover': '#151D17',
        'border-subtle': '#1C271E',
        'text-primary': '#F0FDF4',
        'text-secondary': '#86998A',
        'brand-emerald': '#10B981',
        'brand-mint': '#34D399',
        'brand-lime': '#A3E635',
        'brand-lime-hover': '#BEF264',
        'tag-amber': '#F59E0B',
      },
    },
  },
  plugins: [],
};

export default config;
