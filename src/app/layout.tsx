import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import DeveloperBadge from '@/components/ui/DeveloperBadge';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { ToastProvider } from '@/components/ui/Toast';
import QueryProvider from '@/providers/QueryProvider';

import Script from 'next/script';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://betadrop.app'),
  title: {
    default: 'BetaDrop - Free iOS & Android Beta App Distribution',
    template: '%s | BetaDrop',
  },
  description:
    'The free, simple way to distribute iOS and Android beta apps. Upload IPA or APK files and share install links with your testers. No TestFlight required.',
  keywords: [
    'beta app distribution',
    'iOS beta testing',
    'Android beta testing',
    'IPA distribution',
    'APK distribution',
    'TestFlight alternative',
    'over the air install',
    'OTA app install',
    'free beta distribution',
    'app testing platform',
    'share IPA for testing',
    'share IPA',
    'test IPA',
    'iOS app distribution',
    'IPA testing',
  ],
  authors: [{ name: 'BetaDrop' }],
  creator: 'BetaDrop',
  publisher: 'BetaDrop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://betadrop.app',
    siteName: 'BetaDrop',
    title: 'BetaDrop - Free iOS & Android Beta App Distribution',
    description:
      'The free, simple way to distribute iOS and Android beta apps. No TestFlight required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BetaDrop - Beta App Distribution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetaDrop - Free Beta App Distribution',
    description:
      'Share iOS and Android beta apps with your testers for free. No TestFlight required.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: "/favicon.ico" }

    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Betadrop',
  },
  verification: {
    google: 'u9Lwtf9yIOaTSf7uSt93rfHH-bvAkZth2gi2UMULsfE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JJENE8575N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JJENE8575N');
          `}
        </Script>
        
        {/* Background decorations */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-grid fixed inset-0 z-0 pointer-events-none" />
        
        {/* Main content */}
        <div className="relative z-10">
            <QueryProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </QueryProvider>
        </div>
        
        {/* Global UI Components */}
        <ScrollToTop />
        <DeveloperBadge />
      </body>
    </html>
  );
}
