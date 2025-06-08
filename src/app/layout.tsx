// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import ClientProviders from "./ClientProviders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route"

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNES-Style App",
  description: "A retro SNES-inspired Next.js app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${pressStart.className} w-screen h-screen overflow-hidden pixelated`}
      >
        {/* Now SessionProvider is inside the client-only ClientProviders */}
        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
}
