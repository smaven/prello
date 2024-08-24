import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Pacifico } from 'next/font/google';
import { theme } from '../config/theme';
import './globals.css';

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata = {
  title: 'Prello',
  description: "Trello's little cousin",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className={`${pacifico.variable}`}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
