import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('internal-app-distribution-for-startups')!;

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
      name: 'How can a startup distribute apps internally without enterprise certificates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Startups can use Ad Hoc distribution (iOS) or direct APK sharing (Android). Platforms like BetaDrop automate this process without requiring enterprise program membership.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do startups need an Apple Enterprise account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Apple Enterprise Program ($299/year) is for large organizations distributing to employees. Startups can use Ad Hoc distribution with a standard $99/year developer account.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I share iOS apps with my team without TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use Ad Hoc distribution through an OTA platform like BetaDrop. Register team device UDIDs in your provisioning profile, upload the IPA, and share the install link.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the limits on internal app distribution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For iOS Ad Hoc, you can register 100 devices per device type per year. Android has no device limits for APK distribution. Enterprise distribution removes iOS limits.',
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
          <strong>Startups move fast.</strong> You're iterating daily, showing builds to investors, sharing with early users, and testing across your team. Traditional enterprise app distribution wasn't designed for this pace.
        </p>

        <p>
          This guide covers practical approaches to internal app distribution that work for startups—without enterprise costs or complex infrastructure.
        </p>

        <h2>The Startup Distribution Challenge</h2>

        <p>
          Startups face unique constraints:
        </p>

        <ul>
          <li><strong>Small budget</strong> — Enterprise programs and MDM solutions are expensive</li>
          <li><strong>Rapid iteration</strong> — Builds change multiple times per day</li>
          <li><strong>Mixed audiences</strong> — Developers, designers, founders, investors, early users</li>
          <li><strong>Minimal IT infrastructure</strong> — No dedicated DevOps for distribution</li>
          <li><strong>Both platforms</strong> — Usually building iOS and Android simultaneously</li>
        </ul>

        <p>
          The good news: you don't need enterprise tools to solve these problems.
        </p>

        <h2>Understanding Your Options</h2>

        <h3>For iOS Distribution</h3>

        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Cost</th>
              <th>Device Limit</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ad Hoc + OTA</strong></td>
              <td>$99/year</td>
              <td>100 per type</td>
              <td>Teams &lt;50 people</td>
            </tr>
            <tr>
              <td>TestFlight (internal)</td>
              <td>$99/year</td>
              <td>100 users</td>
              <td>Quick team shares</td>
            </tr>
            <tr>
              <td>TestFlight (external)</td>
              <td>$99/year</td>
              <td>10,000 users</td>
              <td>Large beta groups</td>
            </tr>
            <tr>
              <td>Enterprise</td>
              <td>$299/year</td>
              <td>Unlimited</td>
              <td>Large organizations</td>
            </tr>
          </tbody>
        </table>

        <h3>For Android Distribution</h3>

        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Cost</th>
              <th>Device Limit</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Direct APK</strong></td>
              <td>Free</td>
              <td>Unlimited</td>
              <td>Any team size</td>
            </tr>
            <tr>
              <td>Play Console internal</td>
              <td>$25 one-time</td>
              <td>100 testers</td>
              <td>Pre-launch testing</td>
            </tr>
            <tr>
              <td>Firebase</td>
              <td>Free</td>
              <td>Unlimited</td>
              <td>Firebase users</td>
            </tr>
          </tbody>
        </table>

        <h2>Recommended Setup for Startups</h2>

        <h3>Simple Approach: BetaDrop</h3>

        <p>
          <Link href="/">BetaDrop</Link> handles both iOS and Android distribution with zero infrastructure:
        </p>

        <ol>
          <li>Upload IPA or APK</li>
          <li>Get shareable install link</li>
          <li>Share with your team</li>
          <li>Testers install instantly</li>
        </ol>

        <p>
          No accounts for testers. No app downloads. No waiting. Works for both platforms from one place.
        </p>

        <h3>iOS-Specific Requirements</h3>

        <h4>Get an Apple Developer Account</h4>
        <p>
          The standard $99/year account is sufficient. You don't need Enterprise unless you have 100+ employees with iOS devices.
        </p>

        <h4>Register Team Devices</h4>
        <p>
          Collect device UDIDs from your team. Add them to Apple Developer Portal under Devices. Include them in your Ad Hoc provisioning profile.
        </p>

        <p>
          <strong>Pro tip:</strong> Create a shared UDID collection link. When new team members join, they visit the link, you collect their UDID, and add it to the profile.
        </p>

        <h4>Export with Ad Hoc Distribution</h4>
        <p>
          In Xcode, archive and export with Ad Hoc distribution. This creates an IPA that works with registered devices.
        </p>

        <h3>Android-Specific Requirements</h3>

        <p>
          Android is simpler—no device registration needed:
        </p>

        <ol>
          <li>Build your APK (debug for daily work, release for formal testing)</li>
          <li>Upload to distribution platform or share directly</li>
          <li>Team members install by enabling "Unknown sources"</li>
        </ol>

        <p>
          For details, see our guide on <Link href="/blog/how-to-share-android-apk-files-for-testing">sharing Android APK files</Link>.
        </p>

        <h2>Distribution Workflows for Startups</h2>

        <h3>Daily Development Builds</h3>
        <ol>
          <li>Developer finishes feature or fix</li>
          <li>CI builds and uploads to <Link href="/">BetaDrop</Link></li>
          <li>Link shared in team Slack channel</li>
          <li>Team installs and tests immediately</li>
        </ol>

        <h3>Investor/Client Demos</h3>
        <ol>
          <li>Create a polished build</li>
          <li>Upload and get install link</li>
          <li>Email link directly to recipient</li>
          <li>They install without any setup</li>
        </ol>

        <h3>Early User Testing</h3>
        <ol>
          <li>Collect device UDIDs from interested users (iOS only)</li>
          <li>Add to provisioning profile, rebuild</li>
          <li>Upload and share exclusive install link</li>
          <li>Users get same-day access to new features</li>
        </ol>

        <h2>Managing Device Registration (iOS)</h2>

        <p>
          The 100-device limit per type (iPhone, iPad, etc.) is per developer account, per year. Here's how to manage it efficiently:
        </p>

        <h3>Track Registered Devices</h3>
        <p>
          Maintain a spreadsheet: device owner, UDID, device type, registration date. Apple doesn't show this context in the portal.
        </p>

        <h3>Prioritize Active Testers</h3>
        <p>
          Don't register devices for people who might test. Register devices for people actively testing this week.
        </p>

        <h3>Annual Reset</h3>
        <p>
          Device slots reset yearly with your membership. Plan your testing cycles around this if you're near the limit.
        </p>

        <h3>Consider Multiple Accounts</h3>
        <p>
          Multiple team members with developer accounts effectively multiply your device slots. Use for important projects if needed.
        </p>

        <h2>Growing Beyond Ad Hoc</h2>

        <p>
          When might a startup need to upgrade?
        </p>

        <h3>Signs You've Outgrown Ad Hoc</h3>
        <ul>
          <li>More than 100 team members with iOS devices</li>
          <li>Frequent device slot exhaustion</li>
          <li>Distributing apps that won't be on App Store</li>
          <li>Need to distribute to contractors/partners at scale</li>
        </ul>

        <h3>Next Steps</h3>
        <ul>
          <li><strong>TestFlight external</strong> — For large beta user groups (10,000 users)</li>
          <li><strong>Enterprise Program</strong> — For internal apps at scale (requires application)</li>
          <li><strong>MDM solutions</strong> — When you need device management beyond just app distribution</li>
        </ul>

        <h2>Cost Comparison</h2>

        <table>
          <thead>
            <tr>
              <th>Solution</th>
              <th>Annual Cost</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>BetaDrop + Apple Dev</strong></td>
              <td>$99</td>
              <td>Best for most startups</td>
            </tr>
            <tr>
              <td>Firebase + Apple Dev</td>
              <td>$99</td>
              <td>Good if using Firebase</td>
            </tr>
            <tr>
              <td>TestFlight + Apple Dev</td>
              <td>$99</td>
              <td>Review delays for external</td>
            </tr>
            <tr>
              <td>Enterprise Program</td>
              <td>$299</td>
              <td>Hard to qualify; overkill</td>
            </tr>
            <tr>
              <td>MDM Solutions</td>
              <td>$1,000+</td>
              <td>Enterprise scale only</td>
            </tr>
          </tbody>
        </table>

        <p>
          For Android, add $25 one-time for Play Console if using their testing tracks.
        </p>

        <h2>Common Startup Distribution Mistakes</h2>

        <h3>1. Waiting for Enterprise Approval</h3>
        <p>
          Apple Enterprise program applications take weeks and often get rejected for startups. Don't wait—Ad Hoc works fine.
        </p>

        <h3>2. Over-Engineering Distribution</h3>
        <p>
          You don't need a custom build server with artifact management. Upload to <Link href="/">BetaDrop</Link> and share the link.
        </p>

        <h3>3. Using TestFlight for Internal Builds</h3>
        <p>
          TestFlight reviews add unnecessary delay for internal testing. OTA is instant.
        </p>

        <h3>4. Not Collecting UDIDs Early</h3>
        <p>
          Request UDIDs from team members when they join, not when you need to send a build.
        </p>

        <h3>5. Mixing Debug and Release Builds</h3>
        <p>
          Be clear about which build type you're sharing. Different builds for different purposes.
        </p>

        <p>
          See more pitfalls in our guide on <Link href="/blog/common-mistakes-in-beta-app-distribution">common mistakes in beta distribution</Link>.
        </p>

        <h2>Frequently Asked Questions</h2>

        <h3>How can a startup distribute apps internally without enterprise certificates?</h3>
        <p>
          Use Ad Hoc distribution for iOS (register device UDIDs) and direct APK sharing for Android. Platforms like <Link href="/">BetaDrop</Link> automate OTA distribution without enterprise requirements.
        </p>

        <h3>Do startups need an Apple Enterprise account?</h3>
        <p>
          No. The Enterprise Program ($299/year) is designed for large organizations distributing to employees. A standard $99/year developer account with Ad Hoc distribution serves most startups.
        </p>

        <h3>How do I share iOS apps with my team without TestFlight?</h3>
        <p>
          Register team device UDIDs in your Apple Developer account. Export with Ad Hoc distribution. Upload to <Link href="/">BetaDrop</Link> and share the instant install link.
        </p>

        <h3>What are the limits on internal app distribution?</h3>
        <p>
          iOS Ad Hoc: 100 devices per device type per year. Android APK: no limits. iOS Enterprise: unlimited devices.
        </p>

        <h3>How do I distribute to both iOS and Android from one place?</h3>
        <p>
          Use a cross-platform distribution service like <Link href="/">BetaDrop</Link>. Upload IPA and APK separately, get separate install links, share both with your team.
        </p>

        <h2>Summary</h2>

        <p>
          Internal app distribution for startups doesn't require enterprise programs or complex infrastructure:
        </p>

        <ul>
          <li><strong>iOS</strong> — Standard developer account ($99) + Ad Hoc distribution + OTA platform</li>
          <li><strong>Android</strong> — Direct APK sharing + distribution platform</li>
          <li><strong>Both</strong> — <Link href="/">BetaDrop</Link> handles either from one place</li>
        </ul>

        <p>
          Focus on building your product, not your distribution infrastructure.
        </p>

        <p>
          Ready to simplify your distribution? <strong><Link href="/">Upload your build on BetaDrop</Link></strong> and start sharing with your team in seconds.
        </p>
      </BlogLayout>
    </>
  );
}
