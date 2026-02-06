import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('android-app-signing-explained')!;

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
      name: 'What is a keystore file?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A keystore is a binary file that contains one or more private keys used to sign your Android application. It acts as a digital identity for the developer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I lose my signing key?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you use Play App Signing, you can contact Google support to reset your upload key. If you manage your own app signing key and lose it, you cannot update your existing app on the Play Store and must publish a new package name.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between V1 and V2 signing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'V1 (JAR signing) protects parts of the APK but is slower. V2 (Full APK Signature) protects the entire APK binary and is faster to verify. Modern Android versions prefer V2/V3.',
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
          For many new Android developers, the final step of "signing" an APK or App Bundle can feel like a cryptic ritual. You generate a keystore, type in a password, and hope the build succeeds. But what is confusingly happening under the hood?
        </p>

        <p>
          This guide breaks down the complex world of Android App Signing, keystores, and signature schemes so you can publish with confidence.
        </p>

        <h2>Why Sign an App?</h2>
        <p>
          Android requires all apps to be signed with a digital certificate before they can be installed. This serves two main purposes:
        </p>
        <ul>
          <li><strong>Identity:</strong> It proves that the app came from a specific developer.</li>
          <li><strong>Integrity:</strong> It ensures the app code hasn't been tampered with since it was signed.</li>
        </ul>

        <h2>The Key Players: Keystores and Keys</h2>
        <p>
          Your digital identity lives in a <strong>Keystore</strong> file (usually `.jks` or `.keystore`). Inside this file is a <strong>Key Alias</strong>, which is the specific key used for signing.
        </p>
        
        <h3>Debug vs. Release Keys</h3>
        <p>
          When you just hit "Run" in Android Studio, the IDE signs your app automatically with a <strong>Debug Key</strong>. This is insecure and meant only for testing. You cannot upload a debug-signed APK to the Play Store.
        </p>
        <p>
          For production, you must generate a <strong>Release Key</strong>. This key is precious. If you lose it, you lose the ability to update your app forever (unless you use Play App Signing).
        </p>

        <h2>Signature Schemes Explained (V1, V2, V3, V4)</h2>
        <p>
          Android has evolved its signing mechanism over the years to be more secure and efficient.
        </p>

        <h3>V1 Scheme (JAR Signing)</h3>
        <p>
          The original method. It signs each file inside the APK individually.
          <br /><strong>Pros:</strong> Compatible with all Android versions.
          <br /><strong>Cons:</strong> Slower verification; doesn't protect the APK metadata.
        </p>

        <h3>V2 Scheme (Full APK Signature)</h3>
        <p>
          Introduced in Android 7.0 (Nougat). It signs the entire binary of the APK file.
          <br /><strong>Pros:</strong> Much faster install times; detects any unauthorized modification to the APK file.
          <br /><strong>Cons:</strong> Only works on Android 7+.
        </p>

        <h3>V3 Scheme (Key Rotation)</h3>
        <p>
          Introduced in Android 9.0 (Pie). It adds support for <strong>Key Rotation</strong>. This allows you to change your signing key in future updates (e.g., if one gets compromised) by including a proof-of-rotation in the signature.
        </p>

        <h2>Play App Signing</h2>
        <p>
          Google now highly recommends (and mandates for new apps) <strong>Play App Signing</strong>. 
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol>
          <li>You generate an <strong>Upload Key</strong> and a <strong>App Signing Key</strong>.</li>
          <li>You give the App Signing Key to Google (securely).</li>
          <li>You sign your updates with the Upload Key.</li>
          <li>Google verifies your upload, removes your signature, and re-signs the APK with the App Signing Key for distribution.</li>
        </ol>
        <p>
          <strong>Benefit:</strong> If you lose your Upload Key, you can just ask Google to reset it. Your App Signing Key stays safe on Google's servers.
        </p>

        <h2>Best Practices</h2>
        <ul>
          <li><strong>Never commit keystores to Git:</strong> Add `*.jks` and `*.keystore` to your `.gitignore`.</li>
          <li><strong>Use strong passwords:</strong> Protect both the keystore and the key alias.</li>
          <li><strong>Back up your keys:</strong> Store a copy in a secure, offline location or a password manager.</li>
        </ul>

      </BlogLayout>
    </>
  );
}
