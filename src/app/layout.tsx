import './globals.css';
import { Inter } from 'next/font/google';

// Initialize the Inter font with the Latin subset
const inter = Inter({ subsets: ['latin'] });

// Export metadata using Next.js Metadata API for SEO and page settings
export const metadata = {
  title: 'Etomovich Journal App',
  description: 'A fullstack personal journaling application built with Next.js',
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
