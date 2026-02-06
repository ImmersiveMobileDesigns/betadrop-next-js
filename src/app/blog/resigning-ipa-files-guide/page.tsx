import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('resigning-ipa-files-guide')!;

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
      name: 'Why would I need to resign an IPA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common reasons include: the original certificate expired, you need to add new device UDIDs to the provisioning profile, or you want to change the distribution method (e.g., from Ad Hoc to Enterprise).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I resign an App Store IPA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. IPAs downloaded from the App Store are encrypted (DRM) and cannot be resigned or installed on other devices. You can only resign IPAs you have built yourself or non-encrypted builds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a Mac to resign iOS apps?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, resigning typically requires macOS because it uses Apple\'s codesign tool. However, there are some cloud-based services and specific Linux tools that can achieve this with varying degrees of success.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if resigning fails?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The app will simply crash on launch or fail to install. This usually indicates a mismatch between the entitlements in the provisioning profile and the app binary.',
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
          You have a perfectly good IPA file, but it's refusing to install. Maybe the certificate expired, or maybe you forgot to add a new tester's UDID.
        </p>

        <p>
          Instead of rebuilding the entire project from Xcode (which might take hours or require source code you don't have handy), you can just <strong>resign the IPA</strong>. This guide walks you through the process of swapping out the signature and provisioning profile of an existing iOS app.
        </p>

        <h2>Prerequisites</h2>

        <ul>
          <li>A macOS computer (required for standard tools).</li>
          <li>The <code>.ipa</code> file you want to resign.</li>
          <li>A valid <strong>Distribution Certificate</strong> (installed in Keychain).</li>
          <li>A matching <strong>Provisioning Profile</strong> (<code>.mobileprovision</code>).</li>
        </ul>

        <h2>Method 1: Using Fastlane (Recommended)</h2>

        <p>
          If you have <strong>fastlane</strong> installed (and you should), this is the easiest CLI method.
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>fastlane sigh resign ./path/to/app.ipa \
--signing_identity "Apple Distribution: Your Company (ID)" \
--provisioning_profile ./path/to/profile.mobileprovision</code>
        </pre>

        <p>
          Fastlane automatically handles expanding the IPA, replacing the profile, resigning the binary, and zipping it back up.
        </p>

        <h2>Method 2: iOS App Signer (GUI)</h2>

        <p>
          If you prefer a visual interface, "iOS App Signer" is an excellent open-source tool.
        </p>

        <ol>
          <li>Download <strong>iOS App Signer</strong> from GitHub.</li>
          <li>Open the app.</li>
          <li><strong>Input File:</strong> Browse and select your IPA.</li>
          <li><strong>Signing Certificate:</strong> Select your valid certificate from the dropdown.</li>
          <li><strong>Provisioning Profile:</strong> Select your new profile (or choose "Re-Sign Only" if just updating cert).</li>
          <li>Click <strong>Start</strong>.</li>
          <li>Save your new IPA.</li>
        </ol>

        <h2>Method 3: Terminal (The Hard Way)</h2>
        
        <p>
          For those who want to understand exactly what's happening under the hood:
        </p>

        <ol>
          <li>Unzip the IPA: <code>unzip App.ipa</code></li>
          <li>Remove old signature: <code>rm -rf Payload/App.app/_CodeSignature</code></li>
          <li>Replace profile: <code>cp new.mobileprovision Payload/App.app/embedded.mobileprovision</code></li>
          <li>Resign: <code>codesign -f -s "Certificate Name" Payload/App.app</code></li>
          <li>Zip it back: <code>zip -qr Resigned.ipa Payload</code></li>
        </ol>

        <h2>Common Pitfalls</h2>

        <h3>Entitlement Mismatches</h3>
        <p>
          The most common error. If your original app was built with "Push Notifications" entitlement but your new mobileprovision doesn't have it, the resign will technically succeed, but the app will crash on launch.
        </p>

        <h3>Keychain Issues</h3>
        <p>
          Ensure the specific private key for your signing certificate is present in your Keychain. having the public certificate is not enough.
        </p>

        <h2>Summary</h2>

        <p>
          Resigning is a vital skill for iOS release managers. It allows you to fix expiration issues and add testers without touching the source code.
        </p>
      </BlogLayout>
    </>
  );
}
