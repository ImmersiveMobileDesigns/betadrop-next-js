import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-capture-ios-device-logs')!;

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
      name: 'Do I need Xcode to see logs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The easiest way is using the "Console" app on macOS, which doesn\'t require opening the full Xcode IDE, though it handles the connection drivers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I view logs on Windows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is harder. You can use third-party tools like iMazing or 3uTools to view the realtime system console of a connected iOS device on Windows.',
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
          "It crashes on startup."
        </p>
        <p>
          This is the most useless feedback a beta tester can give. To fix the bug, you need the stack trace. But how do you get logs from an iPhone that isn't connected to your debugger?
        </p>

        <h2>Method 1: Console.app (macOS)</h2>
        <p>
          This is the standard way to view real-time logs from any iOS device.
        </p>
        <ol>
          <li>Connect your iPhone to your Mac via USB.</li>
          <li>Open the <strong>Console</strong> app (press Cmd+Space and type "Console").</li>
          <li>In the sidebar, select your iPhone under "Devices".</li>
          <li>Click <strong>Start</strong> (or verify it's already streaming).</li>
        </ol>
        <p>
          You will see thousands of messages flying by. To find your app:
          <br />- Type your app's name in the <strong>Search</strong> bar.
          <br />- Or filter by "Process" to only show your executable.
        </p>

        <h2>Method 2: Sysdiagnose (No Computer)</h2>
        <p>
          If a tester is out in the wild, they can trigger a sysdiagnose.
        </p>
        <ol>
          <li>Press and hold <strong>both Volume buttons + Power button</strong> for 1-1.5 seconds. You should feel a short vibration.</li>
          <li>Wait about 10 minutes (it takes time to gather logs).</li>
          <li>Go to <strong>Settings &gt; Privacy &gt; Analytics &amp; Improvements &gt; Analytics Data</strong>.</li>
          <li>Scroll down to find the <code>sysdiagnose_...</code> file.</li>
          <li>Tap share and Airdrop/Email it to the developer.</li>
        </ol>
        <p>
          <em>Note: This is heavy and contains logs for the entire system.</em>
        </p>

        <h2>Method 3: In-App Logging Tools</h2>
        <p>
          Smart developers embed logging tools into the beta build. Services like <strong>Bugsnag</strong>, <strong>Sentry</strong>, or <strong>Firebase Crashlytics</strong> automatically upload crash reports the next time the app launches. This is far more reliable than asking users to capture logs manually.
        </p>
      </BlogLayout>
    </>
  );
}
