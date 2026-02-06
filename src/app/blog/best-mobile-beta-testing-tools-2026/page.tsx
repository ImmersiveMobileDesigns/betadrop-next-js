import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('best-mobile-beta-testing-tools-2026')!;

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
      name: 'Is TestFlight free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, TestFlight is included with the Apple Developer Program membership ($99/year).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Firebase for iOS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Firebase App Distribution supports iOS (via Ad Hoc builds) and Android. However, iOS users must register their UDIDs manually.',
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
          Getting your app into the hands of real users is the only way to find bugs before launch. But email attachments don't work for apps. You need a platform.
        </p>

        <p>
          Here are the top 7 tools for mobile beta distribution in 2026.
        </p>

        <h3>1. TestFlight (iOS only)</h3>
        <p>
          The gold standard for iOS.
          <br /><strong>Pros:</strong> Built into iOS. Easy to install. No UDID management for external testers.
          <br /><strong>Cons:</strong> iOS only. Requires Apple Review for external beta.
        </p>

        <h3>2. Google Play Console (Android only)</h3>
        <p>
          The official way for Android.
          <br /><strong>Pros:</strong> Seamless transition to production. Auto-updates.
          <br /><strong>Cons:</strong> Testers need a Google account. Can be slow to process builds.
        </p>

        <h3>3. Firebase App Distribution</h3>
        <p>
          Google's cross-platform tool.
          <br /><strong>Pros:</strong> Fast. Free. Works for both iOS and Android. Great CLI integration.
          <br /><strong>Cons:</strong> For iOS, you still need to manage provisioning profiles (UDIDs).
        </p>

        <h3>4. BetaDrop</h3>
        <p>
          A fast, modern alternative focused on ease of use.
          <br /><strong>Pros:</strong> Instantly collects UDIDs. Generates landing pages for your apps. Supports both OTA iOS and Android.
          <br /><strong>Cons:</strong> Newer platform.
        </p>

        <h3>5. AppCenter (Microsoft)</h3>
        <p>
          Formerly HockeyApp.
          <br /><strong>Pros:</strong> Enterprise-grade. Good for huge teams.
          <br /><strong>Cons:</strong> UI is getting dated. Microsoft's focus has shifted elsewhere.
        </p>

        <h3>6. Diawi</h3>
        <p>
          The classic "drag and drop" tool.
          <br /><strong>Pros:</strong> incredibly simple for one-off shares.
          <br /><strong>Cons:</strong> Links expire quickly on the free plan.
        </p>

        <h3>7. TestFairy</h3>
        <p>
          Focused on recording sessions.
          <br /><strong>Pros:</strong> Videos of what users did before the crash.
          <br /><strong>Cons:</strong> Can be expensive.
        </p>

        <h2>Verdict</h2>
        <p>
          Use <strong>TestFlight</strong> and <strong>Play Console</strong> for your final release candidates. Use <strong>Firebase</strong> or <strong>BetaDrop</strong> for your nightly internal builds where speed matters.
        </p>
      </BlogLayout>
    </>
  );
}
