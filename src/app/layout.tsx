"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

// Initialize the Inter font with the Latin subset
const inter = Inter({ subsets: ["latin"] });

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <SessionProvider>
        <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`} suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="system"  enableSystem={false}>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
