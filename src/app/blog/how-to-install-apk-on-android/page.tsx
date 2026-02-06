import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-install-apk-on-android')!;

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
      name: 'Is it safe to install APK files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the source. Installing APKs from trusted developers or known websites (like APKMirror) is generally safe. However, installing random APKs can expose your device to malware.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does "unknown sources" mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'By default, Android only allows apps from the Google Play Store. "Unknown sources" refers to any other location (like your browser or file manager). You must grant permission to these apps to install APKs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I update an APK app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To update an app installed via APK, you simply download the newer version of the APK file and install it again. It will overwrite the old version while keeping your data.',
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
          Android is famous for its openness, and one of the best features is the ability to install apps from anywhere—not just the Google Play Store. This process is called <strong>sideloading</strong>.
        </p>

        <p>
          Whether you are a beta tester trying out a new app from a developer, or you want to install an app that isn't available in your country, knowing how to install an APK file is an essential Android skill.
        </p>

        <h2>What is an APK?</h2>
        <p>
          APK stands for <strong>Android Package Kit</strong>. It is the file format used by Android to distribute and install applications. Think of it like an <code>.exe</code> file on Windows or a <code>.dmg</code> on Mac.
        </p>

        <h2>Step 1: Download the APK</h2>
        <p>
          First, you need the file. You might get it from:
        </p>
        <ul>
          <li>A developer's website or email.</li>
          <li>A beta testing platform like <strong>BetaDrop</strong>.</li>
          <li>A third-party app store like APKMirror or F-Droid.</li>
        </ul>
        <p>
          <em>Warning: Be careful where you download from! Malicious APKs can steal your data.</em>
        </p>

        <h2>Step 2: Enable "Install from Unknown Sources"</h2>
        <p>
          For security, Android prevents your browser (e.g., Chrome) or file manager from installing apps by default. You need to authorize it.
        </p>
        
        <p><strong>On Android 8.0 (Oreo) and newer:</strong></p>
        <ol>
          <li>Tap on the downloaded APK file notification.</li>
          <li>A popup will appear saying "For your security, your phone is not allowed to install unknown apps from this source."</li>
          <li>Tap <strong>Settings</strong>.</li>
          <li>Toggle on <strong>Allow from this source</strong>.</li>
          <li>Go back and tap <strong>Install</strong>.</li>
        </ol>

        <p><strong>On Android 7.0 and older:</strong></p>
        <ol>
          <li>Go to <strong>Settings &gt; Security</strong>.</li>
          <li>Check the box for <strong>Unknown Sources</strong>.</li>
          <li>confirm the warning.</li>
        </ol>

        <h2>Step 3: Install the App</h2>
        <p>
          Once you've granted permission, the installation screen will appear. It will show you the app's name and icon.
        </p>
        <ol>
          <li>Tap <strong>Install</strong> at the bottom right.</li>
          <li>Wait for the progress bar to finish.</li>
          <li>Tap <strong>Open</strong> to launch the app immediately, or <strong>Done</strong> to close the installer.</li>
        </ol>

        <h2>Troubleshooting Installation Errors</h2>
        
        <h3>"App not installed" Error</h3>
        <p>This is the most common error. It usually happens because:</p>
        <ul>
          <li><strong>Corrupted File:</strong> The download didn't finish. Try downloading it again.</li>
          <li><strong>Incompatible Version:</strong> The app requires a newer version of Android than you have.</li>
          <li><strong>Signature Conflict:</strong> You already have the app installed, but signed with a different key (e.g., Play Store version vs. Beta version). You must uninstall the existing version first.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          Installing APKs gives you freedom and access to a wider world of apps. Just remember the golden rule: only install files from sources you trust.
        </p>
      </BlogLayout>
    </>
  );
}
