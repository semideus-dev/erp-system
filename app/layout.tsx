import "./globals.css";
import type { Metadata } from "next";

import { primary } from "@/components/providers/font-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Prometheus",
  description: "A smart resource management system for colleges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={primary.className}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>{children}</ThemeProvider>
      </body>
    </html>
  );
}
