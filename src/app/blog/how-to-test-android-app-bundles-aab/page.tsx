import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-test-android-app-bundles-aab')!;

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
      name: 'Can I install an AAB file directly on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Android devices cannot install .aab files directly. You must convert the AAB into an APK set using a tool like bundletool or download the generated APK from the Google Play Console.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the format difference between AAB and APK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An APK is an installable package containing all resources for a specific device configuration. An AAB (Android App Bundle) is a publishing format that contains all your app\'s compiled code and resources, which Google Play uses to generate optimized APKs for each user\'s device.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is bundletool free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, bundletool is an open-source command-line tool provided by Google to manipulate Android App Bundles.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I share an AAB with testers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best way is to upload the AAB to Google Play Console (Internal Testing track) or use Internal App Sharing. Alternatively, extract the universal APK using bundletool and share that file directly.',
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
          Since Google made the Android App Bundle (AAB) the mandatory standard for new apps on the Play Store, developers have faced a common headache: <strong>How do you test an AAB file?</strong>
        </p>

        <p>
          Unlike the traditional APK, you can't just drag and drop an <code>.aab</code> file onto your phone to install it. This guide explores the most effective ways to test Android App Bundles in 2026, ensuring what you ship is exactly what your users get.
        </p>

        <h2>What is an Android App Bundle (AAB)?</h2>

        <p>
          An AAB is a publishing format, not an install format. It contains all your app's compiled code and resources but defers the APK generation and signing to Google Play.
        </p>

        <p>
          <strong>Why the switch?</strong> Size savings. Google Play uses the AAB to generate optimized APKs that only contain the resources (language, screen density, CPU architecture) needed for a specific user's device.
        </p>

        <h2>Method 1: Google Play Internal App Sharing (Recommended)</h2>

        <p>
          The easiest way to test an AAB is to let Google do the heavy lifting using <strong>Internal App Sharing</strong>.
        </p>

        <ol>
          <li>Open the Google Play Console.</li>
          <li>Navigate to <strong>Setup</strong> -&gt; <strong>Internal App Sharing</strong>.</li>
          <li>Upload your <code>.aab</code> file.</li>
          <li>Copy the generated link and share it with your testers.</li>
        </ol>

        <p>
          <strong>Pros:</strong> mimics the real Play Store installation process exactly.<br/>
          <strong>Cons:</strong> requires Play Console access and waiting for upload processing.
        </p>

        <h2>Method 2: Using Bundletool (Command Line)</h2>

        <p>
          If you want to test locally without uploading to Google servers, you need <strong>bundletool</strong>. This is the official tool Google uses under the hood.
        </p>

        <h3>Step 1: Install Bundletool</h3>
        <p>
          Download the latest <code>bundletool-all-[version].jar</code> from the <a href="https://github.com/google/bundletool/releases" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a>.
        </p>

        <h3>Step 2: Generate APKs from AAB</h3>
        <p>
          Run the following command in your terminal to create an <code>.apks</code> archive (note the 's'):
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>java -jar bundletool.jar build-apks \
--bundle=path/to/your/app.aab \
--output=path/to/your/app.apks \
--ks=path/to/keystore.jks \
--ks-pass=pass:your_keystore_password \
--ks-key-alias=your_key_alias \
--key-pass=pass:your_key_password</code>
        </pre>

        <h3>Step 3: Install on Connected Device</h3>
        <p>
          Connect your Android device via USB (with USB Debugging enabled) and run:
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>java -jar bundletool.jar install-apks --apks=path/to/app.apks</code>
        </pre>

        <p>
          This will push the correct configuration APKs for that specific connected device.
        </p>

        <h2>Method 3: Extract Universal APK</h2>

        <p>
          Sometimes you just want a single APK file to share via <Link href="/" className="text-primary hover:underline">BetaDrop</Link> or email. You can force bundletool to create a "universal" APK that contains resources for all devices (like the old days).
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>java -jar bundletool.jar build-apks \
--mode=universal \
--bundle=path/to/app.aab \
--output=path/to/universal.apks \
--ks=...</code>
        </pre>

        <p>
          Once generated, you can unzip the <code>universal.apks</code> file to find a standard <code>universal.apk</code> inside. You can distribute this file normally.
        </p>

        <h2>Summary</h2>

        <p>
          While AABs add a slight layer of complexity to the testing process, tools like Internal App Sharing and bundletool make it manageable.
        </p>

        <ul>
          <li><strong>For Quick Team Sharing:</strong> Use a Universal APK (extracted via bundletool).</li>
          <li><strong>For Final QA:</strong> Use Internal App Sharing to ensure dynamic delivery works correctly.</li>
          <li><strong>For Local Debugging:</strong> Use bundletool <code>install-apks</code> directly to your device.</li>
        </ul>

      </BlogLayout>
    </>
  );
}
