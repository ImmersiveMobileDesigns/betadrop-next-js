import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-share-android-apk-files-for-testing')!;

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
      name: 'How do I share an APK file with testers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can share APK files by direct file transfer, cloud storage links, or using a distribution platform like BetaDrop that provides direct download links.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do testers need to enable unknown sources?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Android requires enabling "Install from unknown sources" or granting permission to the browser/app to install APKs from outside the Play Store.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between APK and AAB?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'APK (Android Package) is the traditional installable format. AAB (Android App Bundle) is optimized for Play Store distribution and generates device-specific APKs. For direct testing, APK is recommended.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is sideloading APKs safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sideloading is safe when you trust the APK source. For internal testing with your own builds, it is completely safe. Android displays security warnings because it cannot verify the source.',
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
          <strong>Android makes app testing relatively simple compared to iOS.</strong> You can share APK files directly without complex signing requirements or device registration. But choosing the right method matters for tester experience and distribution efficiency.
        </p>

        <p>
          This guide covers every practical way to share Android APK files for testing—from quick file transfers to professional distribution platforms.
        </p>

        <h2>Understanding Android APK Distribution</h2>

        <p>
          Unlike iOS, Android allows installing apps from any source—a process called "sideloading." This flexibility means you have multiple options for sharing test builds.
        </p>

        <p>
          The only requirement: testers must enable "Install from unknown sources" (or grant install permission to the specific app they're using to download).
        </p>

        <h2>APK vs AAB: Which to Share?</h2>

        <p>
          Before sharing, understand the difference:
        </p>

        <ul>
          <li>
            <strong>APK (Android Package)</strong> — The traditional format. A single file that installs directly on any compatible device. Best for testing.
          </li>
          <li>
            <strong>AAB (Android App Bundle)</strong> — Google's newer format optimized for Play Store. Cannot be directly installed; Play Store generates device-specific APKs. Not ideal for direct testing.
          </li>
        </ul>

        <p>
          <strong>Recommendation:</strong> Always share APK files for testing. If you're building AABs for Play Store, generate APKs separately for test distribution.
        </p>

        <h2>Method 1: Direct File Transfer</h2>

        <p>
          The simplest approach—just send the APK file directly.
        </p>

        <h3>Via Email</h3>
        <ul>
          <li>Attach the APK to an email</li>
          <li>Tester opens email on their Android device</li>
          <li>Tap the attachment to download and install</li>
        </ul>

        <p><strong>Limitations:</strong> Email attachment size limits (usually 25MB), some email providers block APKs, gets messy with multiple builds.</p>

        <h3>Via Messaging Apps</h3>
        <ul>
          <li>Slack, Discord, WhatsApp, Telegram all support file sharing</li>
          <li>Send the APK directly in the chat</li>
          <li>Testers download and install</li>
        </ul>

        <p><strong>Limitations:</strong> File size limits vary, some apps compress or rename files, version tracking becomes difficult.</p>

        <h2>Method 2: Cloud Storage Links</h2>

        <p>
          Upload to Google Drive, Dropbox, or similar services and share the link.
        </p>

        <h3>Google Drive</h3>
        <ol>
          <li>Upload APK to Google Drive</li>
          <li>Right-click → Share → Get link</li>
          <li>Set permissions to "Anyone with the link"</li>
          <li>Share the link with testers</li>
        </ol>

        <p><strong>Pros:</strong> No file size issues, easy to update (just replace the file), familiar to most users.</p>

        <p><strong>Cons:</strong> Multiple clicks to download, testers may need Google account, no install analytics.</p>

        <h2>Method 3: Distribution Platform (Recommended)</h2>

        <p>
          Using a dedicated distribution platform like <Link href="/">BetaDrop</Link> provides the best tester experience.
        </p>

        <h3>How It Works</h3>
        <ol>
          <li>Upload your APK file</li>
          <li>Get a shareable install link</li>
          <li>Share link with testers</li>
          <li>Testers tap → download → install</li>
        </ol>

        <h3>Advantages</h3>
        <ul>
          <li><strong>Clean install experience</strong> — Dedicated install page, not a file manager</li>
          <li><strong>No account required</strong> — Testers just need the link</li>
          <li><strong>App metadata displayed</strong> — Icon, name, version shown automatically</li>
          <li><strong>Cross-platform</strong> — Same platform for iOS and Android</li>
          <li><strong>Version history</strong> — Track multiple builds easily</li>
        </ul>

        <p>
          <Link href="/">BetaDrop</Link> supports APK files up to 200MB and provides instant download links with no account required for testers.
        </p>

        <h2>Method 4: Play Store Internal Testing</h2>

        <p>
          Google Play Console offers testing tracks for distributing through the Play Store.
        </p>

        <h3>Internal Testing Track</h3>
        <ul>
          <li>Up to 100 internal testers</li>
          <li>Instant availability (no review)</li>
          <li>Testers must be added by email</li>
          <li>Requires Play Console access</li>
        </ul>

        <p>
          For a detailed comparison, read our guide on <Link href="/blog/apk-vs-play-store-internal-testing">APK vs Play Store Internal Testing</Link>.
        </p>

        <h2>Preparing Testers for APK Installation</h2>

        <p>
          First-time testers may need help enabling sideloading. Here's what to tell them:
        </p>

        <h3>For Android 8.0+ (Most Devices)</h3>
        <ol>
          <li>When prompted to install, Android asks for permission</li>
          <li>Tap "Settings" in the prompt</li>
          <li>Enable "Allow from this source" for the browser/app</li>
          <li>Go back and tap Install</li>
        </ol>

        <h3>For Older Android</h3>
        <ol>
          <li>Go to Settings → Security</li>
          <li>Enable "Unknown sources"</li>
          <li>Proceed with installation</li>
        </ol>

        <h2>Generating APK Files</h2>

        <h3>From Android Studio</h3>
        <ol>
          <li>Build → Build Bundle(s) / APK(s) → Build APK(s)</li>
          <li>Find the APK in <code>app/build/outputs/apk/</code></li>
        </ol>

        <h3>Debug vs Release APK</h3>
        <ul>
          <li><strong>Debug APK</strong> — Quick to build, larger size, has debugging enabled. Fine for early testing.</li>
          <li><strong>Release APK</strong> — Optimized, smaller, signed with your release key. Use for later-stage testing.</li>
        </ul>

        <h2>Best Practices for APK Testing</h2>

        <h3>1. Use Clear Versioning</h3>
        <p>
          Include version number and build date in your communications. Testers should always know which version they're testing.
        </p>

        <h3>2. Increment Version Codes</h3>
        <p>
          Always increment <code>versionCode</code> in your build.gradle. Android uses this to determine if an app can update over an existing installation.
        </p>

        <h3>3. Include Build Type Indicators</h3>
        <p>
          Modify your app name or icon for debug builds (e.g., "MyApp [DEBUG]"). This prevents confusion between production and test versions.
        </p>

        <h3>4. Provide Installation Instructions</h3>
        <p>
          Not all testers are technical. Include a quick guide with your shared link, especially for first-time sideloading.
        </p>

        <h3>5. Track Distribution</h3>
        <p>
          Know who has which version. Platforms like <Link href="/">BetaDrop</Link> show download counts. For manual distribution, maintain a simple spreadsheet.
        </p>

        <h2>Troubleshooting APK Installation</h2>

        <h3>"App not installed" Error</h3>
        <ul>
          <li><strong>Signature mismatch</strong> — Trying to update an app signed with a different key. Uninstall the old version first.</li>
          <li><strong>Insufficient storage</strong> — Device needs space for the app.</li>
          <li><strong>Corrupted file</strong> — Download again or try a different transfer method.</li>
        </ul>

        <h3>"Parse error" or "Package is invalid"</h3>
        <ul>
          <li>APK was corrupted during transfer</li>
          <li>APK targets a higher Android version than the device supports</li>
          <li>APK architecture doesn't match device (ARM vs x86)</li>
        </ul>

        <h3>Installation Blocked</h3>
        <ul>
          <li>Unknown sources not enabled for this app</li>
          <li>Corporate device policy blocking sideloading</li>
          <li>Play Protect flagging unknown app (can be bypassed)</li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        <h3>How do I share an APK file with testers?</h3>
        <p>
          The best methods are: 1) Use a distribution platform like <Link href="/">BetaDrop</Link> for the cleanest experience, 2) Share via cloud storage like Google Drive, or 3) Send directly through messaging apps or email.
        </p>

        <h3>Do testers need to enable unknown sources?</h3>
        <p>
          Yes. Android requires permission to install apps from outside the Play Store. On modern Android, this is done per-app when first installing.
        </p>

        <h3>What is the difference between APK and AAB?</h3>
        <p>
          APK is directly installable and best for testing. AAB is Google's format for Play Store that gets split into device-specific APKs during distribution.
        </p>

        <h3>Is sideloading APKs safe?</h3>
        <p>
          Yes, when you trust the source. Installing your own test builds is completely safe. Android's warnings exist because it can't verify the source like it can with Play Store apps.
        </p>

        <h3>Can I share the same APK with unlimited testers?</h3>
        <p>
          Yes. Unlike iOS, Android has no device registration limits. Anyone with the APK file or download link can install it.
        </p>

        <h2>Summary</h2>

        <p>
          Sharing Android APK files for testing is straightforward:
        </p>

        <ul>
          <li><strong>For quick, one-off shares:</strong> Direct file transfer or cloud storage links</li>
          <li><strong>For professional testing:</strong> Use <Link href="/">BetaDrop</Link> for clean install pages and download tracking</li>
          <li><strong>For Play Store prep:</strong> Use internal testing tracks (but with more overhead)</li>
        </ul>

        <p>
          The simplest approach for most teams: <strong><Link href="/">upload your APK on BetaDrop</Link></strong> and share the instant download link with your testers.
        </p>
      </BlogLayout>
    </>
  );
}
