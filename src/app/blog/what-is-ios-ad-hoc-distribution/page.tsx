import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('what-is-ios-ad-hoc-distribution')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.metaDescription,
  keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  authors: [{ name: post.author }],
  openGraph: {
    title: post.title,
    description: post.metaDescription,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.metaDescription,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  },
};

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.h1,
  description: post.metaDescription,
  author: {
    '@type': 'Organization',
    name: post.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'BetaDrop',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
  },
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  },
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Ad Hoc distribution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ad Hoc distribution allows you to share your iOS app with a specific group of testers (up to 100 devices per device type) using their Unique Device Identifiers (UDIDs).',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need an Enterprise account for Ad Hoc?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Ad Hoc distribution is available with the standard Apple Developer Program membership ($99/year).',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does my Ad Hoc app not install?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most common reason is that the device\'s UDID was not added to the provisioning profile before the app was built/signed. The profile must include every specific device you want to install the app on.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Ad Hoc different from TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ad Hoc updates are instant and don\'t require Apple Review. TestFlight requires binary processing and sometimes beta review. However, Ad Hoc requires managing UDIDs, while TestFlight just needs an email address.',
      },
    },
  ],
};

export default function BlogPostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <BlogLayout post={post}>
        <p>
          Before TestFlight became the standard, <strong>Ad Hoc distribution</strong> was the primary way developers shared iOS betas. In 2026, it remains a critical tool for developers who need instant distribution without waiting for Apple's processing times.
        </p>

        <p>
          This article explains what iOS Ad Hoc distribution is, how it works, and when you should use it over TestFlight.
        </p>

        <h2>What is Ad Hoc Distribution?</h2>

        <p>
          Ad Hoc distribution is a method of releasing an iOS app to a limited number of registered devices. It uses a special "Ad Hoc" provisioning profile that includes a list of allowed device identifiers (UDIDs).
        </p>

        <p>
          When a user tries to install an Ad Hoc build, iOS checks if their device's UDID is present in the app's embedded provisioning profile. If it is, the app installs. If not, the installation fails.
        </p>

        <h2>The Pros and Cons</h2>

        <h3>Advantages</h3>
        <ul>
          <li><strong>Instant Updates:</strong> No waiting for "Processing" or Beta App Review.</li>
          <li><strong>Real Environment:</strong> Test the exact binary that you might resign for production later.</li>
          <li><strong>Stability:</strong> Builds don't expire as quickly as early TestFlight builds (Ad Hoc profiles last 1 year).</li>
        </ul>

        <h3>Disadvantages</h3>
        <ul>
          <li><strong>UDID Management:</strong> You must collect the UDID from every single tester.</li>
          <li><strong>Rebuilding Required:</strong> If you add a new tester, you must regenerate the profile and rebuild (or re-sign) the app.</li>
          <li><strong>Device Limit:</strong> Limited to 100 iPhones, 100 iPads, etc., per year.</li>
        </ul>

        <h2>How to Distribute an Ad Hoc Build</h2>

        <h3>1. Collect UDIDs</h3>
        <p>
          Ask your testers to send you their UDID. You can use a tool like <Link href="/" className="text-primary hover:underline">BetaDrop</Link> to send them a link that automatically extracts their UDID.
        </p>

        <h3>2. Register Devices in Apple Developer Portal</h3>
        <p>
          Go to <strong>Certificates, Identifiers & Profiles</strong> &rarr; <strong>Devices</strong>. Click the (+) button and enter the device name and UDID.
        </p>

        <h3>3. Create/Update Provisioning Profile</h3>
        <p>
          Go to <strong>Profiles</strong>, select your Ad Hoc profile (or create a new one), and ensure the new devices are checked in the list. Download the updated profile.
        </p>

        <h3>4. Build or Archive</h3>
        <p>
          In Xcode, Archive your app. Select <strong>Distribute App</strong> &rarr; <strong>Ad Hoc</strong>. Xcode should automatically fetch the updated profile if you're signed in.
        </p>

        <h3>5. Share the IPA</h3>
        <p>
          You'll get an <code>.ipa</code> file. You can install this using:
        </p>
        <ul>
          <li><strong>Apple Configurator 2</strong> (Wired)</li>
          <li><strong>Xcode Devices Window</strong> (Wired)</li>
          <li><strong>OTA Distribution</strong> (Wireless) - Using a service like BetaDrop.</li>
        </ul>

        <h2>When to Use Ad Hoc vs. TestFlight</h2>

        <p>
          <strong>Use Ad Hoc when:</strong>
        </p>
        <ul>
          <li>You are testing with a small, known internal team.</li>
          <li>You need to validate a build immediately (e.g., a hotfix) without waiting for Apple.</li>
          <li>You are testing features that might be rejected by TestFlight review (e.g., private APIs for internal tools).</li>
        </ul>

        <p>
          <strong>Use TestFlight when:</strong>
        </p>
        <ul>
          <li>You are running a public beta with unknown users.</li>
          <li>You have exceeded the 100 device limit.</li>
          <li>You don't want to deal with UDIDs.</li>
        </ul>

        <h2>Summary</h2>

        <p>
          Ad Hoc distribution is the "manual transmission" of iOS deployment. It gives you more control and speed but requires more hands-on management of devices. For small teams prioritizing iteration speed, it is often superior to TestFlight.
        </p>
      </BlogLayout>
    </>
  );
}
