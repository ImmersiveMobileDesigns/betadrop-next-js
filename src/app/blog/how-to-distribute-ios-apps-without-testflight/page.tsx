import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-distribute-ios-apps-without-testflight')!;

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
      name: 'Can I distribute iOS apps without TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can distribute iOS apps without TestFlight using Over-The-Air (OTA) distribution. This method uses Apple\'s itms-services protocol to install apps directly from a web link.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do I need to distribute iOS apps without TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need an IPA file signed with an Ad Hoc or Enterprise provisioning profile, a web server with HTTPS, a manifest.plist file, and the device UDIDs registered in your profile (for Ad Hoc distribution).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is OTA distribution legal for iOS apps?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, OTA distribution is completely legal. Apple provides the itms-services protocol specifically for this purpose. It\'s commonly used for enterprise apps, beta testing, and internal distribution.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many testers can I have without TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With Ad Hoc distribution, you can register up to 100 devices per year per device type. Enterprise distribution has no device limit but requires an Apple Developer Enterprise Program membership.',
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
          <strong>TestFlight isn't always the answer.</strong> Apple's official beta testing platform has its limitations—24-hour review times, 90-day build expirations, and the requirement for testers to install yet another app. If you're looking for faster, more flexible iOS app distribution, you have options.
        </p>

        <p>
          This guide covers everything you need to know about distributing iOS apps without TestFlight. We'll explore Over-The-Air (OTA) distribution, the technical requirements, and practical solutions that work in 2026.
        </p>

        <h2>Why Skip TestFlight for iOS Distribution?</h2>

        <p>
          TestFlight is excellent for public beta testing, but it's not always the right fit. Here's when you might want alternatives:
        </p>

        <ul>
          <li><strong>Speed matters</strong> — TestFlight reviews can take 24-48 hours. OTA distribution is instant.</li>
          <li><strong>Internal builds</strong> — Sharing quick iterations with your team shouldn't require Apple approval.</li>
          <li><strong>No app installs for testers</strong> — Your testers don't need to download TestFlight.</li>
          <li><strong>Build lifespan</strong> — TestFlight builds expire after 90 days. OTA links can last indefinitely.</li>
          <li><strong>Privacy concerns</strong> — Some teams prefer not to route builds through Apple's servers.</li>
        </ul>

        <h2>Understanding iOS OTA Distribution</h2>

        <p>
          Over-The-Air (OTA) distribution uses Apple's <code>itms-services</code> protocol. When a user taps an installation link, iOS reads a manifest.plist file that points to your IPA. The device downloads and installs the app directly—no computer needed.
        </p>

        <p>
          The technical flow works like this:
        </p>

        <ol>
          <li>User taps a special <code>itms-services://</code> link on their iOS device</li>
          <li>iOS fetches the <code>manifest.plist</code> file from your HTTPS server</li>
          <li>The manifest contains your app's metadata and IPA download URL</li>
          <li>iOS downloads the IPA and prompts the user to install</li>
        </ol>

        <h2>Requirements for OTA Distribution</h2>

        <h3>1. A Signed IPA File</h3>

        <p>
          Your IPA must be signed with either an <strong>Ad Hoc</strong> or <strong>Enterprise</strong> provisioning profile. Development profiles won't work for OTA installation.
        </p>

        <ul>
          <li><strong>Ad Hoc</strong> — Allows up to 100 devices per device type. Each device UDID must be registered in your Apple Developer account.</li>
          <li><strong>Enterprise</strong> — Unlimited devices but requires a $299/year Apple Developer Enterprise Program membership.</li>
        </ul>

        <h3>2. HTTPS Hosting</h3>

        <p>
          Apple requires that both your manifest.plist and IPA file are served over HTTPS. This isn't optional—HTTP links simply won't work. You'll need valid SSL certificates on your hosting server.
        </p>

        <h3>3. Manifest.plist File</h3>

        <p>
          The manifest file tells iOS where to find your app and provides essential metadata:
        </p>

        <pre><code>{`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" 
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>https://yourserver.com/app.ipa</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>com.yourcompany.app</string>
        <key>bundle-version</key>
        <string>1.0.0</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>Your App Name</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`}</code></pre>

        <h2>Method 1: Manual OTA Setup</h2>

        <p>
          You can set up OTA distribution yourself with any web server. Here's the process:
        </p>

        <ol>
          <li>Export your IPA from Xcode with Ad Hoc or Enterprise distribution</li>
          <li>Upload the IPA to your HTTPS server</li>
          <li>Create the manifest.plist with your app details</li>
          <li>Upload the manifest.plist to your server</li>
          <li>Create an install link: <code>itms-services://?action=download-manifest&url=https://yourserver.com/manifest.plist</code></li>
        </ol>

        <p>
          The downside? This is tedious for every build, error-prone, and requires server maintenance.
        </p>

        <h2>Method 2: Use BetaDrop (Recommended)</h2>

        <p>
          <Link href="/">BetaDrop</Link> automates the entire OTA process. Upload your IPA, and we generate the manifest, host everything over HTTPS, and give you a shareable link—instantly.
        </p>

        <p>
          Here's how it works:
        </p>

        <ol>
          <li>Drag and drop your IPA file to BetaDrop</li>
          <li>We extract app metadata automatically</li>
          <li>Get your install link in seconds</li>
          <li>Share with testers via any channel</li>
        </ol>

        <p>
          No server setup. No manifest files to maintain. No HTTPS certificates to manage. Just upload and share.
        </p>

        <h2>Registering Device UDIDs</h2>

        <p>
          For Ad Hoc distribution, tester devices must be registered in your Apple Developer account. Here's how to get a device UDID:
        </p>

        <ul>
          <li><strong>On Mac</strong> — Connect the device, open Finder, click the device, and click the serial number until UDID appears</li>
          <li><strong>On the device</strong> — Use a UDID lookup website or app</li>
          <li><strong>Via BetaDrop</strong> — Share a UDID collection link with testers</li>
        </ul>

        <p>
          Once you have UDIDs, add them in the Apple Developer portal under Devices, then regenerate your provisioning profile.
        </p>

        <h2>Common OTA Installation Issues</h2>

        <h3>Unable to Install Error</h3>

        <p>
          This usually means the device isn't registered in your provisioning profile (for Ad Hoc) or your IPA isn't properly signed.
        </p>

        <h3>Untrusted Developer</h3>

        <p>
          For Enterprise and some Ad Hoc builds, users need to trust your developer certificate. Go to Settings → General → VPN & Device Management → tap your certificate → Trust.
        </p>

        <h3>Link Opens Safari Instead of Installing</h3>

        <p>
          The <code>itms-services://</code> link must be opened on Safari or another iOS browser. Some apps (like Slack) open links in embedded browsers that don't handle this protocol.
        </p>

        <h2>Frequently Asked Questions</h2>

        <h3>Can I distribute iOS apps without TestFlight?</h3>
        <p>
          Yes. Over-The-Air (OTA) distribution using the itms-services protocol is Apple's supported method for distributing apps outside TestFlight and the App Store.
        </p>

        <h3>What do I need to distribute iOS apps without TestFlight?</h3>
        <p>
          You need an IPA signed with Ad Hoc or Enterprise provisioning, HTTPS hosting, a properly formatted manifest.plist, and registered device UDIDs (for Ad Hoc).
        </p>

        <h3>Is OTA distribution legal for iOS apps?</h3>
        <p>
          Absolutely. Apple explicitly provides the itms-services protocol for this purpose. It's the standard method for enterprise apps and internal beta testing.
        </p>

        <h3>How many testers can I have without TestFlight?</h3>
        <p>
          Ad Hoc distribution allows 100 devices per device type annually. Enterprise distribution has no device limits but requires the Enterprise Program membership.
        </p>

        <h3>Do testers need to install anything?</h3>
        <p>
          No additional apps required. Testers just tap the install link on their iOS device. They may need to trust your developer certificate the first time.
        </p>

        <h2>Summary</h2>

        <p>
          Distributing iOS apps without TestFlight is straightforward with OTA distribution. Whether you set it up manually or use a platform like <Link href="/">BetaDrop</Link>, you can bypass TestFlight's limitations and get builds to testers instantly.
        </p>

        <p>
          The key requirements are:
        </p>

        <ul>
          <li>A properly signed IPA (Ad Hoc or Enterprise)</li>
          <li>HTTPS hosting for your files</li>
          <li>A valid manifest.plist</li>
          <li>Registered device UDIDs (for Ad Hoc)</li>
        </ul>

        <p>
          For the fastest workflow, <strong><Link href="/">upload your build on BetaDrop</Link></strong> and get a shareable install link in seconds—no server setup required.
        </p>
      </BlogLayout>
    </>
  );
}
