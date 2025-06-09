// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P, Indie_Flower } from "next/font/google";
import ClientProviders from "./ClientProviders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400" });
const indie = Indie_Flower({ subsets: ["latin"], weight: "400" });

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
        className={`${pressStart.className} ${indie.className} w-screen h-screen overflow-hidden text-white text-lg font-bold pixelated`}
      >
        {/* Now SessionProvider is inside the client-only ClientProviders */}
        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
}
