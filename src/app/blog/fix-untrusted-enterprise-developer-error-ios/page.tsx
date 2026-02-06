import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('fix-untrusted-enterprise-developer-error-ios')!;

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
      name: 'Why am I seeing Untrusted Enterprise Developer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This error appears because you are trying to open an app distributed outside the App Store (via an Enterprise Certificate) that you haven\'t manually trusted in Settings yet. It is a security feature to prevent unauthorized apps from running.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to trust an Enterprise Developer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You should only trust developers you know and expect to receive apps from, such as your employer or a known software beta program. Trusting unknown certificates can expose your device to malware.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is the Profiles or Device Management menu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to Settings > General > VPN & Device Management. On older iOS versions, it might be labeled as "Profiles & Device Management" or just "Profiles".',
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
          If you've ever tried to install an iOS app from a source outside of the App Store—perhaps a beta version from your company or a specialized internal tool—you've likely encountered the intimidating <strong>"Untrusted Enterprise Developer"</strong> popup.
        </p>

        <p>
          This scary-looking message stops you from opening the app, but it doesn't mean the app is broken. It simply means Apple requires you to manually verify that you trust the organization that created the app. In this guide, we'll walk you through exactly how to fix this in under a minute.
        </p>

        <h2>What Causes This Error?</h2>

        <p>
          Apple has a strict "Walled Garden" approach to security. Normally, apps are vetted by Apple and downloaded from the App Store. However, corporations often need to distribute proprietary apps to their employees without making them public. To do this, they use the <strong>Apple Enterprise Developer Program</strong>.
        </p>
        
        <p>
          When you install one of these enterprise apps, the certificate used to sign it isn't arguably "trusted" by your specific iPhone by default. This is a deliberate security layer to prevent malicious websites from tricking users into installing spyware.
        </p>

        <h2>Step-by-Step Fix</h2>

        <p>
          To run the app, you need to tell your iPhone to trust the certificate belonging to the developer.
        </p>

        <h3>1. Dismiss the Message</h3>
        <p>
          Tap <strong>Cancel</strong> on the popup error. You cannot verify the app directly from the error message.
        </p>

        <h3>2. Open Settings</h3>
        <p>
          Go to your device's <strong>Settings</strong> app and tap on <strong>General</strong>.
        </p>

        <h3>3. Find Device Management</h3>
        <p>
          Scroll down and look for a menu item labeled <strong>VPN & Device Management</strong>.
          <br />
          <em>Note: On older iOS versions (iOS 14 or earlier), this might be called "Profiles & Device Management" or simply "Profiles".</em>
        </p>

        <h3>4. Select the Enterprise App</h3>
        <p>
          Under the section header <strong>ENTERPRISE APP</strong>, you will see the name of the developer profile (e.g., "Acme Corp Inc."). Tap on it.
        </p>

        <h3>5. Trust the Developer</h3>
        <p>
          Tap the blue link that says <strong>Trust "[Developer Name]"</strong>.
        </p>

        <h3>6. Confirm</h3>
        <p>
          A dialog will appear asking you to confirm. Tap <strong>Trust</strong>.
        </p>

        <p>
          Once done, you can go back to your home screen and open the app immediately. You won't have to do this again for any other apps from the same developer.
        </p>

        <h2>Is It Safe?</h2>

        <p>
          Ideally, yes—if you know where the app came from.
        </p>
        <ul>
          <li><strong>Safe:</strong> Downloading an internal HR app from your company's official download portal.</li>
          <li><strong>Risky:</strong> Downloading a "Free Paid Games" app from a random 3rd party website.</li>
        </ul>

        <p>
          Enterprise certificates are powerful permissions. If you trust a malicious profile, that app could potentially access sensitive data. Always verify the source before tapping "Trust".
        </p>

        <h2>Conclusion</h2>

        <p>
          The "Untrusted Enterprise Developer" error is just a speed bump, not a roadblock. It's there to ensure you are making a conscious decision to install software from outside the official App Store. Once tailored, you can enjoy your beta apps and internal tools seamlessly.
        </p>
      </BlogLayout>
    </>
  );
}
