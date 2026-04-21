import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';

import { Providers } from './providers';

import './globals.css';

const sans = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
});

const serif = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Flashcard cards',
  description: 'Flashcard learning app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
