import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-install-ipa-files-over-the-air-ota')!;

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
      name: 'What is OTA installation for iOS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OTA (Over-The-Air) installation allows iOS devices to download and install apps directly from a web server without using iTunes or a computer. It uses Apple\'s itms-services protocol to handle the installation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a manifest.plist file?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A manifest.plist is an XML file that iOS requires for OTA installation. It contains metadata about your app including the download URL for the IPA, bundle identifier, version, and title.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does OTA installation require HTTPS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apple requires HTTPS for security reasons. iOS will not install apps from HTTP URLs. Your manifest.plist and IPA files must be served over a valid SSL/TLS connection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I install any IPA over the air?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The IPA must be signed with an Ad Hoc or Enterprise provisioning profile. For Ad Hoc, the device UDID must be registered in the profile. Development-signed IPAs cannot be installed via OTA.',
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
          <strong>Installing IPA files over the air eliminates the need for iTunes or a Mac.</strong> Your testers can install your iOS app by simply tapping a link on their device. This guide explains exactly how OTA installation works and how to set it up.
        </p>

        <p>
          Whether you're doing this manually or using a platform like <Link href="/">BetaDrop</Link>, understanding the underlying process helps troubleshoot issues and make informed decisions.
        </p>

        <h2>What is OTA Installation?</h2>

        <p>
          OTA (Over-The-Air) installation is Apple's method for installing apps wirelessly without connecting to a computer. It's the same technology used by enterprise companies to distribute internal apps and by developers for beta testing.
        </p>

        <p>
          The technology relies on the <code>itms-services</code> protocol, which tells iOS to fetch an app's installation manifest and download the IPA file directly.
        </p>

        <h2>How OTA Installation Works</h2>

        <p>
          Here's the technical flow when a user installs an IPA over the air:
        </p>

        <ol>
          <li>
            <strong>User taps install link</strong> — A special URL starting with <code>itms-services://</code>
          </li>
          <li>
            <strong>iOS fetches manifest</strong> — The URL points to a manifest.plist file on your server
          </li>
          <li>
            <strong>Manifest parsed</strong> — iOS reads the app metadata and IPA download location
          </li>
          <li>
            <strong>IPA downloaded</strong> — iOS downloads the IPA from the URL specified in the manifest
          </li>
          <li>
            <strong>Installation prompt</strong> — User confirms they want to install the app
          </li>
          <li>
            <strong>App installed</strong> — The app appears on the home screen
          </li>
        </ol>

        <h2>Requirements for OTA Installation</h2>

        <h3>1. Properly Signed IPA</h3>

        <p>
          Your IPA must be signed with an <strong>Ad Hoc</strong> or <strong>Enterprise</strong> distribution profile. Development profiles won't work.
        </p>

        <ul>
          <li><strong>Ad Hoc</strong> — Requires device UDIDs in the provisioning profile. Limited to 100 devices per device type per year.</li>
          <li><strong>Enterprise</strong> — No device restrictions but requires Apple Developer Enterprise Program ($299/year).</li>
        </ul>

        <h3>2. HTTPS Server</h3>

        <p>
          Both your manifest.plist and IPA must be served over HTTPS with a valid SSL certificate. iOS rejects HTTP connections for security. This is non-negotiable.
        </p>

        <h3>3. Correct MIME Types</h3>

        <p>
          Your server must serve files with correct content types:
        </p>

        <ul>
          <li><code>.plist</code> → <code>application/xml</code> or <code>text/xml</code></li>
          <li><code>.ipa</code> → <code>application/octet-stream</code></li>
        </ul>

        <h2>The Manifest.plist File</h2>

        <p>
          The manifest is an XML property list that tells iOS about your app. Here's a complete example:
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
        <!-- Required: The IPA file -->
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>https://example.com/builds/myapp.ipa</string>
        </dict>
        
        <!-- Optional: Display icon -->
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>url</key>
          <string>https://example.com/icons/icon-57.png</string>
        </dict>
        
        <!-- Optional: Full-size icon -->
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>url</key>
          <string>https://example.com/icons/icon-512.png</string>
        </dict>
      </array>
      
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>com.yourcompany.appname</string>
        <key>bundle-version</key>
        <string>1.0.0</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>My App Name</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`}</code></pre>

        <h3>Required Manifest Fields</h3>

        <ul>
          <li><strong>software-package URL</strong> — Direct HTTPS link to your IPA file</li>
          <li><strong>bundle-identifier</strong> — Must match your app's bundle ID exactly</li>
          <li><strong>bundle-version</strong> — Must match the version in your IPA</li>
          <li><strong>kind</strong> — Always "software" for apps</li>
          <li><strong>title</strong> — Display name shown during installation</li>
        </ul>

        <h3>Optional Icon Fields</h3>

        <p>
          Including display-image (57x57) and full-size-image (512x512) shows your app icon in the installation prompt. Without these, users see a generic placeholder.
        </p>

        <h2>Creating the Install Link</h2>

        <p>
          The install link follows this format:
        </p>

        <pre><code>{`itms-services://?action=download-manifest&url=https://example.com/manifest.plist`}</code></pre>

        <p>
          Key points:
        </p>

        <ul>
          <li>The manifest URL must be HTTPS</li>
          <li>The URL should be properly URL-encoded if it contains special characters</li>
          <li>This link only works on iOS devices (Safari or compatible browsers)</li>
        </ul>

        <h2>Step-by-Step Manual Setup</h2>

        <h3>Step 1: Export Your IPA</h3>

        <p>
          In Xcode, archive your app and export with Ad Hoc or Enterprise distribution. Make sure to select "Export for OTA installation" if prompted.
        </p>

        <h3>Step 2: Prepare Your Server</h3>

        <p>
          Upload to any HTTPS-enabled server. Verify MIME types are configured correctly. Test that files are directly accessible.
        </p>

        <h3>Step 3: Create the Manifest</h3>

        <p>
          Use the template above. Replace all URLs with your actual file locations. Match bundle-identifier exactly.
        </p>

        <h3>Step 4: Upload Files</h3>

        <p>
          Upload both the manifest.plist and IPA file. Note the exact manifest URL.
        </p>

        <h3>Step 5: Create Install Link</h3>

        <p>
          Construct the itms-services link using your manifest URL. Share this link with testers.
        </p>

        <h2>The Easy Way: Use BetaDrop</h2>

        <p>
          Manual setup is error-prone and tedious for every build. <Link href="/">BetaDrop</Link> handles all of this automatically:
        </p>

        <ol>
          <li>Upload your IPA file</li>
          <li>We generate the manifest.plist automatically</li>
          <li>Everything is hosted on HTTPS</li>
          <li>Get your install link instantly</li>
        </ol>

        <p>
          No server configuration. No XML editing. No SSL certificates to manage.
        </p>

        <h2>Troubleshooting OTA Installation</h2>

        <h3>"Unable to Download App"</h3>

        <p>
          Common causes:
        </p>

        <ul>
          <li>IPA not signed with Ad Hoc/Enterprise profile</li>
          <li>Device UDID not in provisioning profile (Ad Hoc)</li>
          <li>SSL certificate issues on your server</li>
          <li>Incorrect MIME types</li>
          <li>Bundle identifier mismatch between manifest and IPA</li>
        </ul>

        <h3>"Cannot Connect to Server"</h3>

        <ul>
          <li>Manifest or IPA URL is not accessible</li>
          <li>Server is blocking iOS user agent</li>
          <li>HTTP instead of HTTPS</li>
        </ul>

        <h3>"Untrusted Developer"</h3>

        <p>
          For Enterprise and some Ad Hoc apps, users must trust the certificate: Settings → General → VPN & Device Management → [Your Certificate] → Trust.
        </p>

        <h3>Link Opens Browser Instead of Installing</h3>

        <p>
          Some apps use embedded browsers that don't support itms-services. Tell testers to open the link in Safari.
        </p>

        <h2>Frequently Asked Questions</h2>

        <h3>What is OTA installation for iOS?</h3>
        <p>
          OTA (Over-The-Air) installation lets iOS devices install apps directly from a web link without connecting to a computer. It uses Apple's itms-services protocol.
        </p>

        <h3>What is a manifest.plist file?</h3>
        <p>
          It's an XML configuration file that tells iOS where to download your app and provides metadata like bundle ID, version, and title.
        </p>

        <h3>Why does OTA installation require HTTPS?</h3>
        <p>
          Apple enforces HTTPS for security. iOS will not download apps from insecure HTTP connections.
        </p>

        <h3>Can I install any IPA over the air?</h3>
        <p>
          No. Only IPAs signed with Ad Hoc (with registered device UDIDs) or Enterprise distribution profiles work for OTA installation.
        </p>

        <h3>How long do OTA install links last?</h3>
        <p>
          As long as your files remain on the server and the signing certificate is valid. With <Link href="/">BetaDrop</Link>, we handle hosting indefinitely.
        </p>

        <h2>Summary</h2>

        <p>
          Installing IPA files over the air requires:
        </p>

        <ul>
          <li>A properly signed IPA (Ad Hoc or Enterprise)</li>
          <li>HTTPS hosting with valid SSL</li>
          <li>A correctly formatted manifest.plist</li>
          <li>An itms-services:// install link</li>
        </ul>

        <p>
          While you can set this up manually, <strong><Link href="/">BetaDrop</Link></strong> automates the entire process. Upload your IPA and get an install link in seconds—no server setup required.
        </p>

        <p>
          Need faster distribution? <strong><Link href="/">Upload your build on BetaDrop</Link></strong> and start sharing with testers immediately.
        </p>
      </BlogLayout>
    </>
  );
}
