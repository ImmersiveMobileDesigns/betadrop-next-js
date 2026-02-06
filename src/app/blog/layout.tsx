import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - iOS & Android App Distribution Tips | BetaDrop',
  description: 'Learn about beta app distribution, iOS OTA installation, TestFlight alternatives, and best practices for sharing mobile apps with testers.',
  keywords: [
    'beta app distribution blog',
    'iOS distribution guide',
    'Android APK sharing',
    'TestFlight alternative tips',
    'mobile app testing blog',
    'OTA installation guide',
  ],
  openGraph: {
    title: 'BetaDrop Blog - App Distribution Tips & Guides',
    description: 'Expert guides on iOS and Android beta app distribution. Learn how to share apps with testers efficiently.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
