import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-find-iphone-udid-for-beta-testing')!;

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
      name: 'What is a UDID?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UDID stands for Unique Device Identifier. It is a 40-character (older devices) or 25-character (newer devices) alphanumeric string that uniquely identifies a specific Apple device.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to share my UDID?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is generally safe to share your UDID with developers you trust. A UDID cannot be used to steal your data or control your phone; it is only used to authorize app installations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is UDID the same as Serial Number?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, they are different. While both are unique, the UDID is specifically required for provisioning profiles and Ad Hoc distribution, whereas the serial number is for warranty and support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I find my UDID without a computer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can use a mobile configuration profile service (like BetaDrop provides) to extract your UDID directly from your device settings without needing a Mac or PC.',
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
          If you've ever been invited to beta test an iOS app legally without TestFlight, the developer probably asked for your <strong>UDID</strong>.
        </p>

        <p>
          This mysterious string of characters is the key to Ad Hoc distribution. This guide will show you exactly how to find it on any iPhone or iPad in 2026.
        </p>

        <h2>What is a UDID?</h2>

        <p>
          UDID stands for <strong>Unique Device Identifier</strong>. It's a permanent, unique serial code hardwired into every Apple device.
        </p>

        <ul>
          <li><strong>Old Format (iPhone 8 and earlier):</strong> 40-character hex string (e.g., <code>2b6f0...</code>)</li>
          <li><strong>New Format (iPhone XS and later):</strong> 25-character string with a hyphen (e.g., <code>00008030-001...</code>)</li>
        </ul>

        <h2>Method 1: The Easiest Way (No Computer)</h2>

        <p>
          You don't need a cable or computer. You can use a secure web tool that installs a temporary profile to read the UDID.
        </p>

        <ol>
          <li>Navigate to a trusted UDID finder tool (like <Link href="/" className="text-primary hover:underline">BetaDrop's tool</Link>).</li>
          <li>Tap "Get UDID".</li>
          <li>Allow the download of the configuration profile.</li>
          <li>Go to iOS <strong>Settings</strong> -&gt; <strong>Profile Downloaded</strong>.</li>
          <li>Tap <strong>Install</strong>. (This profile is temporary and only reads device info).</li>
          <li>You will be redirected back to the website with your UDID displayed.</li>
        </ol>

        <h2>Method 2: Using Finder (macOS Catalina and later)</h2>

        <p>
          If you have a Mac, this is the official method.
        </p>

        <ol>
          <li>Connect your iPhone to your Mac using a USB cable.</li>
          <li>Open <strong>Finder</strong>.</li>
          <li>Select your device from the sidebar.</li>
          <li>Click on the text under your device's name (where it says "iPhone 15 Pro" or the storage capacity).</li>
          <li>The text will cycle through information. Click until you see <strong>UDID</strong>.</li>
          <li>Right-click (or Control-click) the UDID and select <strong>Copy UDID</strong>.</li>
        </ol>

        <h2>Method 3: Using Windows</h2>

        <p>
          On Windows, you can still use iTunes or third-party tools.
        </p>

        <ol>
          <li>Open iTunes (if installed) or "Apple Devices" app.</li>
          <li>Connect your iPhone via USB.</li>
          <li>Click the secure <strong>Phone icon</strong>.</li>
          <li>Click on the <strong>Serial Number</strong> field. It will toggle to show the UDID.</li>
          <li>Right-click to copy.</li>
        </ol>

        <h2>Why do developers need this?</h2>

        <p>
          Apple's security model (walled garden) requires that every single device running a beta app (outside TestFlight) must be explicitly "allow-listed" by the developer. This is done by adding your unique UDID to the app's internal "provisioning profile".
        </p>

        <p>
          Without your UDID, the developer literally cannot permit your specific phone to run their app.
        </p>

        <h2>Summary</h2>

        <p>
          Finding your UDID is a simple 2-minute process. Once you share it with a developer, they can send you custom builds of their apps that you can install instantly!
        </p>
      </BlogLayout>
    </>
  );
}
