import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('ipa-vs-apk-difference')!;

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
      name: 'Can I install an IPA on Android?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. IPA files are built specifically for iOS architecture and operating system. Android cannot read or run them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I install an APK on iPhone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. APK files are for Android. iOS devices cannot install Android apps.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I open these files on a computer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both IPA and APK files are actually ZIP archives. You can verify this by renaming the file extension to .zip and opening it. You will see the assets and compiled code inside.',
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
          If you are new to mobile development, you'll see these two acronyms everywhere.
        </p>

        <h2>IPA (iOS App Store Package)</h2>
        <p>
          <strong>Platform:</strong> iOS, iPadOS.
          <br /><strong>Structure:</strong> It is a zipped folder containing the compiled binary, an <code>Info.plist</code> file, app icons, and the provisioning profile (`embedded.mobileprovision`).
          <br /><strong>Encryption:</strong> IPAs downloaded from the App Store are encrypted with Apple's FairPlay DRM. You cannot just copy them to another computer. IPAs signed for Development or Ad Hoc are not encrypted in the same way.
        </p>

        <h2>APK (Android Package Kit)</h2>
        <p>
          <strong>Platform:</strong> Android.
          <br /><strong>Structure:</strong> Also a zipped folder. It contains <code>AndroidManifest.xml</code>, resources (`res/`), and the compiled code (`classes.dex`).
        </p>
        
        <h3>The Evolution: AAB</h3>
        <p>
          Modern Android development uses <strong>AAB (Android App Bundle)</strong> for uploading to Google Play. However, the AAB is not installable directly. Google Play takes the AAB and splits it into smaller, optimized APKs for the user's specific device.
        </p>

        <h2>Can you convert one to the other?</h2>
        <p>
          <strong>No.</strong>
        </p>
        <p>
          While frameworks like React Native or Flutter allow you to write ONE codebase that <em>exports</em> to both, the final files are completely different languages.
          <br />- Android uses Java/Kotlin (Dalvik Bytecode).
          <br />- iOS uses Objective-C/Swift (Native ARM Machine Code).
        </p>
        <p>
          You cannot run an APK on an iPhone any more than you can put a PlayStation disc into an Xbox.
        </p>
      </BlogLayout>
    </>
  );
}
