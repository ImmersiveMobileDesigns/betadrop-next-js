import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-clear-app-cache-mobile')!;

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
      name: 'Does offloading an app delete my data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On iOS, "Offloading" deletes the app binary but keeps your documents and data. When you reinstall it, your data is restored.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does "Clear Data" do on Android?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '"Clear Data" resets the app to its fresh state. It deletes all accounts, settings, and databases locally. "Clear Cache" only deletes temporary files.',
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
          "Have you tried turning it off and on again?"
        </p>
        <p>
          When that doesn't work, the next step in mobile troubleshooting is usually clearing the cache. Beta apps, by nature, are buggy. They might corrupt their local database or get stuck in a weird login state. Here is how to wipe the slate clean without uninstalling the app.
        </p>

        <h2>How to Clear Cache on Android</h2>
        
        <p>Android gives you granular control.</p>
        
        <ol>
          <li>Open <strong>Settings</strong>.</li>
          <li>Go to <strong>Apps</strong> or <strong>Application Manager</strong>.</li>
          <li>Find the app in the list and tap it.</li>
          <li>Tap <strong>Storage & Cache</strong>.</li>
          <li>You will see two buttons:
            <ul>
              <li><strong>Clear Cache:</strong> Safe. Deletes temporary images and files. Does not log you out.</li>
              <li><strong>Clear Storage (or Clear Data):</strong> Drastic. Resets the app completely. You will lose unsaved data and be logged out.</li>
            </ul>
          </li>
        </ol>

        <h2>How to Clear Cache on iOS (iPhone/iPad)</h2>
        
        <p>iOS is more restrictive. It generally manages cache automatically.</p>

        <h3>Method 1: The App's Settings</h3>
        <p>
          Some well-behaved apps (like TikTok or Snapchat) include a "Clear Cache" button inside their own settings menu. Always check there first.
        </p>

        <h3>Method 2: Offloading (Keeps Data)</h3>
        <ol>
          <li>Go to <strong>Settings &gt; General &gt; iPhone Storage</strong>.</li>
          <li>Scroll to the app and tap it.</li>
          <li>Tap <strong>Offload App</strong>.</li>
          <li>Wait a moment, then tap <strong>Reinstall App</strong>.</li>
        </ol>
        <p>
          This clears the binary cache but keeps your login and settings.
        </p>

        <h3>Method 3: The Nuclear Option (Uninstall)</h3>
        <p>
          If the app is truly stuck, the only way to fully clear all data on iOS is to delete the app and redownload it from the App Store or TestFlight.
        </p>

        <h2>Why Clear Cache?</h2>
        <ul>
          <li><strong>Fix Crashes:</strong> Corrupted temp files often cause startup crashes.</li>
          <li><strong>Free Up Space:</strong> Social media apps can hoard gigabytes of image cache.</li>
          <li><strong>Force Update Content:</strong> Sometimes an app doesn't realize there is new data on the server; clearing logs forces a re-fetch.</li>
        </ul>
      </BlogLayout>
    </>
  );
}
