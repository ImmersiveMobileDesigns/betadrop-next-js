import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('ios-provisioning-profiles-explained')!;

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
      name: 'Why did my app stop working after a year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Provisioning profiles expire. Development and Ad Hoc profiles are valid for 1 year. After that, you must regenerate the profile, re-sign the app, and reinstall it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I check which devices are in a profile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. On a Mac, you can press Spacebar on a .mobileprovision file to see a QuickLook preview that lists all included UDIDs. Or use a tool like BetaDrop to inspect the IPA.',
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
          "Valid signing identity not found."
        </p>
        <p>
          This error has haunted iOS developers for 15 years. The system Apple uses to secure apps is powerful but notoriously complex. It relies on a file called a <strong>Provisioning Profile</strong>.
        </p>

        <h2>What is a Provisioning Profile?</h2>
        <p>
          Think of a Provisioning Profile (`.mobileprovision`) as a VIP pass for your app. It ties together three things:
        </p>
        <ol>
          <li><strong>Who you are:</strong> Your Digital Certificate (p12).</li>
          <li><strong>What the app is:</strong> Comparison App ID (Bundle ID).</li>
          <li><strong>Where it can run:</strong> A list of device UDIDs (for Ad Hoc/Dev).</li>
        </ol>

        <h2>The Three Types of Profiles</h2>

        <h3>1. Development Profile</h3>
        <p>
          <strong>Use case:</strong> Debugging on your own phone while plugged into Xcode.
          <br /><strong>Capabilities:</strong> Includes your specific devices. Enables debugging features.
          <br /><strong>Expiration:</strong> 1 year.
        </p>

        <h3>2. Ad Hoc Distribution Profile</h3>
        <p>
          <strong>Use case:</strong> Sending a beta to a tester (QA team, client) using a service like BetaDrop.
          <br /><strong>Capabilities:</strong> Does NOT allow debugging (more secure). Requires you to add every single tester's UDID to the profile beforehand.
          <br /><strong>Expiration:</strong> 1 year (or sooner if your certificate expires).
        </p>

        <h3>3. App Store Distribution Profile</h3>
        <p>
          <strong>Use case:</strong> Uploading to TestFlight or the App Store.
          <br /><strong>Capabilities:</strong> Contains NO device UDIDs. It authorizes the app to run on *any* device, but only if downloaded through Apple's servers (which wrap it in their own DRM).
        </p>

        <h2>The "Missing Profile" Fix</h2>
        <p>
          If you are building an app and Xcode says "Profile missing", the easiest fix is usually enabling <strong>"Automatically Manage Signing"</strong> in your project settings. This lets Xcode talk to Apple's servers and generate a Development profile for you.
        </p>
        <p>
          However, for CI/CD builds (using Fastlane), you typically need to manage these files manually (Manual Signing) to ensure the build server uses the correct distribution certificate.
        </p>
      </BlogLayout>
    </>
  );
}
