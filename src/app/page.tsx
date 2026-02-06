import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';

export const metadata: Metadata = {
  title: 'BetaDrop - #1 Free iOS & Android Beta App Distribution Platform',
  description:
    'Distribute iOS IPA & Android APK beta apps securely with BetaDrop. The best free TestFlight alternative for OTA installation. No limits, no reviews.',
  keywords: [
    'beta app distribution', 
    'iOS OTA install', 
    'install IPA without computer', 
    'TestFlight alternative', 
    'Android APK distribution', 
    'beta testing platform',
    'free app hosting',
    'app distribution service',
    'share IPA for testing',
    'share IPA',
    'test IPA',
    'iOS app distribution',
    'IPA testing'
  ],
  authors: [{ name: 'imobile' }],
  openGraph: {
    title: 'BetaDrop - Free iOS & Android Beta App Distribution',
    description: 'The simplified way to share mobile apps. Upload IPA/APK and get an install link instantly.',
    type: 'website',
    url: 'https://betadrop.app',
    siteName: 'BetaDrop',
    locale: 'en_US',
    images: [
      {
        url: 'https://betadrop.app/og-image.png', // Placeholder
        width: 1200,
        height: 630,
        alt: 'BetaDrop Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetaDrop - Ship Mobile Apps Faster',
    description: 'Free OTA distribution for iOS and Android. No limits.',
    creator: '@betadrop', // Placeholder
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BetaDrop',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Android, iOS, Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description:
    'Free platform to share IPA for testing and distribute Android APK beta apps to testers with Over-The-Air (OTA) distribution support.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '150'
  },
  featureList: 'iOS OTA Installation, Android APK Hosting, Unlimited Uploads, Secure Links',
};

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is beta app distribution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Beta app distribution is the process of sharing pre-release iOS or Android apps with testers using secure installation links without publishing them to app stores.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install an IPA without TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can install IPA files without TestFlight using Over-The-Air (OTA) distribution. BetaDrop generates secure install links that work directly on iOS devices using the itms-services protocol.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is BetaDrop free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, BetaDrop is completely free. There are no paid plans, no hidden fees, and no limits on the number of builds or testers.',
      },
    },
    {
       '@type': 'Question',
       name: 'How long do builds last?',
       acceptedAnswer: {
          '@type': 'Answer',
          text: 'Builds are hosted securely. While we focus on beta distribution (temporary testing), we do not arbitrarily delete builds unless they violate our terms.',
       }
    }
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <HomePageClient />
    </>
  );
}
