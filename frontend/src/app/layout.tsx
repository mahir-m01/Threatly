import type { Metadata } from "next";
import clsx from "clsx";
import { DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Threatly - Secure Flaws Fast",
  description: "Scan, analyze, and secure your projects with Threatly",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(dmSans.className, 'antialiased')}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

