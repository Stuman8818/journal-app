import type { Metadata } from 'next';
import './globals.css';
import { Press_Start_2P } from 'next/font/google';
import ClientProviders from './ClientProviders';

const pressStart = Press_Start_2P({
  weight: '400', // Press Start 2P only has 400 weight
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SNES-Style App',
  description: 'A retro SNES-inspired Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pressStart.className} w-screen h-screen overflow-hidden pixelated`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}