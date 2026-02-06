import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('how-to-send-beta-apps-to-testers-instantly')!;

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
      name: 'How can I send a beta app to testers instantly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use an OTA distribution platform like BetaDrop. Upload your IPA or APK file and receive a shareable install link immediately—no review process or delays.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does TestFlight take so long?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestFlight requires Apple review for external testing, which takes 24-48 hours. This is to ensure apps meet basic guidelines before external distribution.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the fastest way to share an iOS app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OTA (Over-The-Air) distribution is fastest. Upload your IPA to a platform like BetaDrop and share the instant link—testers can install within seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do testers need to install anything to receive beta apps?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With OTA distribution platforms like BetaDrop, testers only need to tap a link. No additional apps required. TestFlight requires installing the TestFlight app.',
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
          <strong>Time kills momentum.</strong> When you're iterating on a mobile app, every hour waiting for builds to reach testers is an hour of delayed feedback. Traditional distribution methods—TestFlight reviews, Play Store processing—add friction that slows your development cycle.
        </p>

        <p>
          This guide shows you exactly how to send beta apps to testers instantly, for both iOS and Android.
        </p>

        <h2>The Problem with Traditional Beta Distribution</h2>

        <p>
          Standard beta testing channels were designed for formal releases, not rapid iteration:
        </p>

        <ul>
          <li><strong>TestFlight</strong> — 24-48 hour review for external testing</li>
          <li><strong>Play Store closed testing</strong> — Hours to process, plus review time</li>
          <li><strong>Enterprise MDM</strong> — Complex setup, slow deployment</li>
        </ul>

        <p>
          These work for scheduled releases but create friction when you need to test a quick fix or show a stakeholder the latest build.
        </p>

        <h2>The Solution: OTA Distribution</h2>

        <p>
          Over-The-Air (OTA) distribution bypasses review processes entirely. You upload a build, get a link, and testers install immediately.
        </p>

        <h3>How It Works</h3>

        <ol>
          <li><strong>Upload your build</strong> — IPA for iOS, APK for Android</li>
          <li><strong>Get instant link</strong> — Available within seconds</li>
          <li><strong>Share with testers</strong> — Any messaging channel works</li>
          <li><strong>Testers install</strong> — Tap link, confirm install, done</li>
        </ol>

        <p>
          Total time from build completion to tester installation: under 2 minutes.
        </p>

        <h2>Fastest iOS Distribution: BetaDrop</h2>

        <p>
          For iOS, <Link href="/">BetaDrop</Link> provides the fastest path from build to tester.
        </p>

        <h3>Step-by-Step Process</h3>

        <ol>
          <li>
            <strong>Build your IPA</strong>
            <p>In Xcode: Product → Archive → Export with Ad Hoc distribution</p>
          </li>
          <li>
            <strong>Upload to BetaDrop</strong>
            <p>Drag the IPA file to the upload area on <Link href="/">betadrop.com</Link></p>
          </li>
          <li>
            <strong>Copy the install link</strong>
            <p>Link is generated immediately after upload completes</p>
          </li>
          <li>
            <strong>Share with testers</strong>
            <p>Send via Slack, email, WhatsApp—any channel</p>
          </li>
          <li>
            <strong>Testers tap and install</strong>
            <p>No TestFlight app needed. Just tap the link on their device.</p>
          </li>
        </ol>

        <h3>Requirements</h3>
        <ul>
          <li>IPA signed with Ad Hoc or Enterprise provisioning</li>
          <li>Tester device UDIDs in the provisioning profile (for Ad Hoc)</li>
        </ul>

        <p>
          For detailed OTA setup, see our guide on <Link href="/blog/how-to-install-ipa-files-over-the-air-ota">installing IPA files over the air</Link>.
        </p>

        <h2>Fastest Android Distribution</h2>

        <p>
          Android is even simpler—no provisioning profiles or device registration needed.
        </p>

        <h3>Using BetaDrop</h3>
        <ol>
          <li>Build your APK in Android Studio</li>
          <li>Upload to <Link href="/">BetaDrop</Link></li>
          <li>Share the instant download link</li>
          <li>Testers download and install</li>
        </ol>

        <h3>Direct Sharing</h3>
        <p>
          For quick one-offs, you can also share APK files directly via messaging apps or cloud storage. See our complete guide on <Link href="/blog/how-to-share-android-apk-files-for-testing">sharing Android APK files</Link>.
        </p>

        <h2>Comparison: Distribution Speed</h2>

        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>iOS Time</th>
              <th>Android Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>BetaDrop</strong></td>
              <td>&lt;1 minute</td>
              <td>&lt;1 minute</td>
            </tr>
            <tr>
              <td>TestFlight (external)</td>
              <td>24-48 hours</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>TestFlight (internal)</td>
              <td>10-30 minutes</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>Play Store internal</td>
              <td>N/A</td>
              <td>5-15 minutes</td>
            </tr>
            <tr>
              <td>Firebase</td>
              <td>5-10 minutes</td>
              <td>5-10 minutes</td>
            </tr>
          </tbody>
        </table>

        <h2>Best Practices for Instant Distribution</h2>

        <h3>1. Prepare Your Build Environment</h3>
        <p>
          Have your provisioning profiles and signing certificates ready. For iOS, this is often the bottleneck—not the distribution itself.
        </p>

        <h3>2. Use Automation</h3>
        <p>
          Set up CI/CD to automatically build and upload. Tools like Fastlane can export IPA/APK and upload to distribution platforms in one command.
        </p>

        <h3>3. Create a Distribution Channel</h3>
        <p>
          Have a dedicated Slack channel or group chat for sharing builds. Testers know where to look for new versions.
        </p>

        <h3>4. Include Version Context</h3>
        <p>
          When sharing links, always include:
        </p>
        <ul>
          <li>Version number or build number</li>
          <li>What changed since the last build</li>
          <li>Specific areas to test</li>
        </ul>

        <h3>5. Keep Tester Devices Ready</h3>
        <p>
          For iOS Ad Hoc distribution, ensure all tester UDIDs are in your provisioning profile before you need to send a quick build.
        </p>

        <h2>Use Cases for Instant Distribution</h2>

        <h3>Bug Fix Validation</h3>
        <p>
          Tester reports a bug at 10 AM. You fix it by 10:30 AM. With instant distribution, they're testing the fix by 10:35 AM.
        </p>

        <h3>Stakeholder Demos</h3>
        <p>
          Product manager asks to see the latest feature. Upload the current build and send a link—they're seeing it on their device in under a minute.
        </p>

        <h3>Daily Builds</h3>
        <p>
          Share a fresh build with your QA team every morning. No waiting, no scheduling around review times.
        </p>

        <h3>Client Reviews</h3>
        <p>
          Client wants to see progress. Send an instant install link instead of scheduling a screen share or recording a video.
        </p>

        <h2>Setting Up for Success</h2>

        <h3>For iOS Development</h3>
        <ol>
          <li>
            <strong>Register all tester devices</strong>
            <p>Add UDIDs to Apple Developer portal and include in provisioning profile</p>
          </li>
          <li>
            <strong>Use Ad Hoc for testing</strong>
            <p>Development builds can't be distributed via OTA</p>
          </li>
          <li>
            <strong>Bookmark your distribution platform</strong>
            <p>Quick access means faster distribution</p>
          </li>
        </ol>

        <h3>For Android Development</h3>
        <ol>
          <li>
            <strong>Enable debug builds</strong>
            <p>Faster to compile than release builds for daily testing</p>
          </li>
          <li>
            <strong>Configure Gradle for APK output</strong>
            <p>Ensure you're building APK, not just AAB</p>
          </li>
          <li>
            <strong>Brief testers on sideloading</strong>
            <p>First-time Android testers may need guidance on enabling unknown sources</p>
          </li>
        </ol>

        <h2>Frequently Asked Questions</h2>

        <h3>How can I send a beta app to testers instantly?</h3>
        <p>
          Use an OTA distribution platform like <Link href="/">BetaDrop</Link>. Upload your IPA or APK and receive a shareable install link immediately—no review process required.
        </p>

        <h3>Why does TestFlight take so long?</h3>
        <p>
          TestFlight requires Apple review for external testing, which typically takes 24-48 hours. This ensures apps meet basic guidelines before reaching external users.
        </p>

        <h3>What is the fastest way to share an iOS app?</h3>
        <p>
          OTA distribution is fastest. Upload your Ad Hoc-signed IPA to <Link href="/">BetaDrop</Link> and share the instant link. Testers install within seconds.
        </p>

        <h3>Do testers need to install anything to receive beta apps?</h3>
        <p>
          With OTA platforms like BetaDrop, testers just tap a link to install. No additional apps needed. TestFlight requires installing Apple's TestFlight app first.
        </p>

        <h3>Can I send instant builds to hundreds of testers?</h3>
        <p>
          For Android, yes—no limits. For iOS with Ad Hoc distribution, you're limited to 100 registered devices per device type. Enterprise distribution removes this limit.
        </p>

        <h2>Summary</h2>

        <p>
          Sending beta apps to testers instantly requires bypassing traditional review processes:
        </p>

        <ul>
          <li><strong>For iOS</strong> — Use OTA distribution with Ad Hoc signing. Upload to <Link href="/">BetaDrop</Link> for instant links.</li>
          <li><strong>For Android</strong> — Direct APK distribution. Upload and share—no delays.</li>
        </ul>

        <p>
          The faster you can get builds to testers, the faster you can iterate. Stop waiting for reviews.
        </p>

        <p>
          Ready to speed up your testing cycle? <strong><Link href="/">Upload your build on BetaDrop</Link></strong> and share it with your testers in seconds.
        </p>
      </BlogLayout>
    </>
  );
}
