import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('safe-android-sideloading-guide')!;

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
      name: 'Is sideloading illegal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, sideloading is a core feature of the Android operating system. It simply means installing software from a source other than the official Google Play Store.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does sideloading void my warranty?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Generally, no. Installing an app does not void your hardware warranty. However, if a malicious app causes software damage, that specific issue might not be covered.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Google Play Protect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google Play Protect is Google\'s built-in malware scanner for Android. It scans both Play Store apps and sideloaded apps to ensure they are safe.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I enable unknown sources?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On modern Android (10+), you grant permission to the specific app (e.g., Chrome or Files) that is trying to install the APK, rather than a global "Unknown Sources" switch.',
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
          "Sideloading" sounds hacker-ish, but for Android developers and beta testers, it's just Tuesday. Sideloading is the process of installing an application package (APK) directly, bypassing the Google Play Store.
        </p>

        <p>
          While it gives you freedom, it also opens up security risks. This guide will teach you how to sideload apps safely for testing in 2026.
        </p>

        <h2>How to Enable Sideloading (Android 14+)</h2>

        <p>
          Google has moved away from the global "Allow Unknown Sources" switch. Now, permission is granted on a per-app basis.
        </p>

        <ol>
          <li>Download the APK (e.g., from Chrome or <Link href="/" className="text-primary hover:underline">BetaDrop</Link>).</li>
          <li>Tap the downloaded file notification.</li>
          <li>A popup will warn: "For your security, your phone is not allowed to install unknown apps from this source."</li>
          <li>Tap <strong>Settings</strong> in the popup.</li>
          <li>Toggle on <strong>Allow from this source</strong> for the specific app (e.g., Chrome).</li>
          <li>Go back and tap <strong>Install</strong>.</li>
        </ol>

        <h2>Safety Checklist Before Installing</h2>

        <h3>1. Verify the Source</h3>
        <p>
          Only install APKs from developers or platforms you trust. If you are a tester, ensure the link came directly from the company via an official channel (Slack, Email). Avoid random "Mod APK" sites.
        </p>

        <h3>2. Check App Permissions</h3>
        <p>
          When you install (or first run) the app, pay close attention to permission requests. Does a flashlight app need access to your Contacts? Probably not.
        </p>

        <h3>3. Keep Google Play Protect On</h3>
        <p>
          Google Play Protect scans apps even if they come from outside the store. Never disable this feature "to make an app work" unless you are absolutely certain of what you are doing.
        </p>

        <h2>Scanning APKs for Malware</h2>

        <p>
          If you received an APK from a questionable source (which we don't recommend), you can scan it before installation:
        </p>

        <ul>
          <li><strong>VirusTotal:</strong> Upload the APK file to VirusTotal.com to scan it against 70+ antivirus engines.</li>
          <li><strong>Hash Check:</strong> If the developer provided an MD5 or SHA-256 hash, verify that your downloaded file matches exactly to ensure it hasn't been tampered with.</li>
        </ul>

        <h2>Post-Installation Hygiene</h2>

        <p>
          For maximum security, revoke the installation permission after you are done.
        </p>

        <ol>
          <li>Go to <strong>Settings</strong> &rarr; <strong>Apps</strong> &rarr; <strong>Special App Access</strong>.</li>
          <li>Tap <strong>Install unknown apps</strong>.</li>
          <li>Find the browser or file manager you used (e.g., Chrome).</li>
          <li>Toggle <strong>OFF</strong>.</li>
        </ol>

        <h2>Summary</h2>

        <p>
          Sideloading is essential for beta testing and open ecosystems. By following basic security hygiene—verifying sources and managing permissions—you can test apps safely without exposing your device to malware.
        </p>
      </BlogLayout>
    </>
  );
}
