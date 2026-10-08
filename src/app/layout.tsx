import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B2B — Real Connections. Verified Profiles. | Private Adult Companion Platform",
  description: "B2B is a private, modern social connection and companion discovery platform for consenting adult Indian individuals. Meet verified profiles with safe, transparent on-demand access.",
  keywords: ["B2B", "B2B Dating", "Adult Companion Discovery", "Verified Profiles India", "Private Social Platform"],
  authors: [{ name: "B2B Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6C3BFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F7FF] text-[#17152A]">
        {children}
      </body>
    </html>
  );
}
