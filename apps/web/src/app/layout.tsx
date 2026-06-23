import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import appFont from "@/lib/fonts";
import "react-phone-number-input/style.css";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "erp-system",
  description: "erp-system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${appFont.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
