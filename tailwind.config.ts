import type { Config } from 'tailwindcss';
import { appConfig } from './config/app';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  theme: {
    extend: {
      colors: appConfig.colors,
      fontFamily: {
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
};

export default config;
