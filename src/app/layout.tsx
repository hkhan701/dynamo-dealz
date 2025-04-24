import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/sonner"

const Etna = localFont({
  src: './etna.otf',
  variable: '--font-etna'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oh Canada Deals",
  description: "Find the best deals in Canada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Etna.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-blush`}
      >
        {children}
        <Footer />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
