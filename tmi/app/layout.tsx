import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { ScrollToTop } from '@/components/scroll-to-top';
import { InfoButton } from '@/components/info-button';
import { seoConfig } from '@/lib/seo';
import { CustomCursor } from '@/components/custom-cursor';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: seoConfig.title,
    template: `%s | ${seoConfig.title}`,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  icons: {
    icon: seoConfig.logo,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <CustomCursor />
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <InfoButton />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
