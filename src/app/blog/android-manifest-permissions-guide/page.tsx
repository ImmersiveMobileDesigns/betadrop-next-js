import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('android-manifest-permissions-guide')!;

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
      name: 'What are dangerous permissions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dangerous permissions cover areas where the app could affect the user\'s private data (contacts, camera, location). You must request these at runtime, and the user can deny them.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I forget to declare a permission?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The app will crash with a SecurityException when you try to perform the action that requires that permission.',
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
          The <code>AndroidManifest.xml</code> is the passport of your Android app. It tells the system what your app is, what components it has, and most importantly, what it is allowed to do.
        </p>

        <h2>Declaring Permissions</h2>
        <p>
          Every permission your app needs must be declared in the manifest.
        </p>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-white">
          {`<manifest ... >
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <application ... >
        ...
    </application>
</manifest>`}
        </pre>

        <h2>Install-Time vs. Runtime Permissions</h2>
        
        <h3>Normal Permissions (Install-Time)</h3>
        <p>
          These are granted automatically when the user installs the app because they are considered low-risk.
          <br />Examples:
          <br />- <code>INTERNET</code>
          <br />- <code>ACCESS_NETWORK_STATE</code>
          <br />- <code>VIBRATE</code>
        </p>

        <h3>Dangerous Permissions (Runtime)</h3>
        <p>
          Since Android 6.0 (Marshmallow), critical permissions must be requested <strong>while the app is running</strong>. Even if you declare them in the manifest, you cannot use them until the user taps "Allow" on the system dialog.
          <br />Examples:
          <br />- <code>CAMERA</code>
          <br />- <code>READ_CONTACTS</code>
          <br />- <code>ACCESS_FINE_LOCATION</code>
        </p>

        <h2>Best Practices</h2>
        <ol>
          <li><strong>Request Later:</strong> Don't ask for everything on startup. Wait until the user taps the camera button to ask for Camera permission.</li>
          <li><strong>Explain Why:</strong> If a user denies a permission, show a UI explaining why the feature won't work without it.</li>
          <li><strong>Handle Denial:</strong> Your app shouldn't crash if the user says "No". It should gracefully disable that specific feature.</li>
        </ol>
      </BlogLayout>
    </>
  );
}
