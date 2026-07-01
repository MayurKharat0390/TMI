import './globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat, Jost, Cormorant_Garamond, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { ScrollToTop } from '@/components/scroll-to-top';
import { InfoButton } from '@/components/info-button';
import { seoConfig } from '@/lib/seo';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.team-maverick-india.com'),
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

import PageTransition from '@/components/page-transition';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} ${montserrat.variable} ${jost.variable} ${poppins.variable} ${cormorantGaramond.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <InfoButton />
            <PageTransition />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
