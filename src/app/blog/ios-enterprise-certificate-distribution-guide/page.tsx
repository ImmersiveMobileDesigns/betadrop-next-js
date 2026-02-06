import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('ios-enterprise-certificate-distribution-guide')!;

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
      name: 'What is the Apple Developer Enterprise Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Apple Developer Enterprise Program allows organizations to distribute proprietary, in-house apps to their employees without using the App Store. It costs $299 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a device limit for Enterprise distribution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, unlike Ad Hoc distribution which is limited to 100 devices per type, Enterprise distribution has no hard limit on the number of devices, provided they are owned or controlled by the organization.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do Enterprise apps expire?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the provisioning profile for Enterprise apps expires after 12 months. You must renew the certificate and rebuild/re-sign the app before it expires.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I sell Enterprise apps to other companies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The Enterprise Program is strictly for internal use within your own organization. Distributing enterprise apps to the public or other companies is a violation of Apple\'s terms.',
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
          For large organizations, distributing internal tools and beta builds via the public App Store or even TestFlight isn't always feasible. Enter the <strong>Apple Developer Enterprise Program</strong>.
        </p>

        <p>
          This guide provides a comprehensive look at iOS Enterprise Certificate distribution in 2026, helping you understand how to securely distribute in-house apps to your employees without the strict review process of the App Store.
        </p>

        <h2>What is iOS Enterprise Distribution?</h2>

        <p>
          iOS Enterprise Distribution allows companies to distribute proprietary "in-house" apps directly to their employees' devices. These apps effectively bypass the public App Store review process, giving you total control over release timing and device availability.
        </p>
        
        <p>
          To use this, you must be enrolled in the <strong>Apple Developer Enterprise Program</strong>, which is separate from the standard Apple Developer Program. It costs <strong>$299 USD per year</strong>.
        </p>

        <h2>Key Benefits vs. Standard Developer Program</h2>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Feature</th>
                <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Standard Program ($99/yr)</th>
                <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Enterprise Program ($299/yr)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-2">Distribution Audience</td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">Public (App Store), Limited Beta (TestFlight/Ad Hoc)</td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">Internal Employees Only</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-2">Device Limit</td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">100/device type (Ad Hoc)</td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">Unlimited (Internal Devices)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-2">App Review</td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">Required for App Store & External TestFlight</td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">No App Review</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>How to Create and Distribute an Enterprise App</h2>

        <h3>1. Create an In-House Distribution Certificate</h3>
        <p>
          Log in to your Apple Enterprise Developer account. Go to <strong>Certificates, Identifiers & Profiles</strong> &rarr; <strong>Certificates</strong> and create a new "In-House and Ad Hoc" production certificate. This certificate is used to sign your apps.
        </p>

        <h3>2. Register an App ID</h3>
        <p>
          Create an explicit App ID for your internal app (e.g., <code>com.yourcompany.internal.tool</code>). Avoid wildcards if you plan to use capabilities like Push Notifications.
        </p>

        <h3>3. Create a Provisioning Profile</h3>
        <p>
          Create a new Provisioning Profile specifically for "In-House" distribution and link it to your App ID and Distribution Certificate.
        </p>

        <h3>4. Archive and Export from Xcode</h3>
        <p>
          When archiving your app in Xcode, select <strong>Distribute App</strong> &rarr; <strong>Enterprise</strong>. Xcode will sign the app with your Enterprise certificate and profile.
        </p>

        <h3>5. Distribute via OTA (Over-The-Air)</h3>
        <p>
          Similar to Ad Hoc distribution, you can distribute Enterprise apps wirelessly. You'll need:
        </p>
        <ul>
          <li>The signed <strong>.ipa file</strong></li>
          <li>A <strong>manifest.plist</strong> file</li>
          <li>An HTTPS-enabled web server</li>
        </ul>

        <p>
          Or, simply use <Link href="/" className="text-primary hover:underline">BetaDrop</Link> to host your Enterprise build. Just upload the IPA, and we generate the secure installation link for your employees.
        </p>

        <h2>Trusting the Enterprise Developer</h2>

        <p>
          When an employee installs an Enterprise app for the first time, they will see an "Untrusted Enterprise Developer" error. This is a security feature.
        </p>
        
        <p>To fix this, the user must:</p>
        <ol>
          <li>Open <strong>Settings</strong> on their iOS device.</li>
          <li>Go to <strong>General</strong> &rarr; <strong>VPN & Device Management</strong>.</li>
          <li>Tap the name of the <strong>Enterprise Certificate</strong> (your company name).</li>
          <li>Tap <strong>Trust "Your Company Name"</strong>.</li>
        </ol>

        <h2>Important Considerations & Risks</h2>

        <h3>Strict Eligibility</h3>
        <p>
          Apple has become much stricter about who qualifies for the Enterprise Program. You must be a legal entity with a D-U-N-S number and demonstrate a clear need for internal-only distribution.
        </p>

        <h3>Certificate Expiration</h3>
        <p>
          Your distribution certificate expires every 3 years, and provisioning profiles expire every 12 months. <strong>Warning:</strong> If your certificate expires or is revoked, the app will instantly stop working on <em>all</em> employee devices.
        </p>

        <h3>Revocation Risks</h3>
        <p>
          If you are caught distributing Enterprise apps to the public (non-employees), Apple will revoke your certificate and potentially ban your account. This is a "death sentence" for your internal apps, as they will all stop launching immediately.
        </p>

        <h2>Summary</h2>

        <p>
          iOS Enterprise Distribution is a powerful tool for large organizations needing to deploy internal mobile solutions. By bypassing the App Store, you gain agility and control. However, with great power comes the responsibility of managing certificates and ensuring strict internal-only usage.
        </p>

        <p>
          Ready to share your Enterprise build? <Link href="/" className="text-primary hover:underline">Upload your IPA to BetaDrop</Link> for instant, secure link generation.
        </p>
      </BlogLayout>
    </>
  );
}
