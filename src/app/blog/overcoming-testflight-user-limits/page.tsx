import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('overcoming-testflight-user-limits')!;

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
      name: 'What is the limit for TestFlight external testers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The limit is 10,000 external testers per app ID.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the limit for internal testers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can have up to 100 internal testers. These must be members of your App Store Connect team with a specific role.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does deleting a tester free up a spot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if you remove a tester from a group, that spot becomes available for someone new immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I pay for more TestFlight slots?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Apple does not offer an option to purchase additional TestFlight tester slots.',
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
          Apple's TestFlight is the gold standard for iOS beta testing. It's built right into the ecosystem and easy for users. But it has a hard ceiling: <strong>10,000 external testers</strong>.
        </p>

        <p>
          For most apps, this is plenty. But for viral hits or large-scale open betas, hitting this wall can stop your momentum cold. Here is how to manage and overcome these limits.
        </p>

        <h2>Understanding the Limits</h2>

        <ul>
          <li><strong>Internal Testers:</strong> Max 100. No review required. Must be in your App Store Connect team.</li>
          <li><strong>External Testers:</strong> Max 10,000. Setup via email or Public Link. Requires Beta App Review for the first build of a version.</li>
        </ul>

        <h2>Strategy 1: Pruning Inactive Testers</h2>

        <p>
          The 10k limit is for <em>active</em> slots, not lifetime adds. Many users install a beta and never open it again. You should aggressively prune these users to make room for fresh testers.
        </p>

        <p>
          <strong>How to prune:</strong>
        </p>
        <ol>
          <li>Go to App Store Connect &rarr; TestFlight.</li>
          <li>Select your External Group.</li>
          <li>Sort by <strong>Status</strong> or <strong>Sessions</strong>.</li>
          <li>Select users who haven't installed or have 0 sessions in 30 days.</li>
          <li>Click <strong>Delete</strong>.</li>
        </ol>

        <p>
          <em>Pro Tip:</em> You can automate this using <code>fastlane pilot</code> scripts to remove testers who haven't launched the latest build.
        </p>

        <h2>Strategy 2: Use Enterprise Distribution</h2>

        <p>
          If your goal is to test internally with a massive organization (e.g., a company with 50,000 employees), TestFlight isn't the right tool. Use the <strong>Apple Developer Enterprise Program</strong>.
        </p>

        <p>
          This allows unlimited distribution to devices owned by your organization, bypassing the 10,000 user limit entirely.
        </p>

        <h2>Strategy 3: Apple Business Manager (Custom Apps)</h2>

        <p>
          For B2B apps where you are distributing to specific partners or clients, use <strong>Apple Business Manager</strong>. This allows you to privately distribute specific apps to another organization's VPP (Volume Purchase Program) account. The receiving organization then distributes the app to their users via MDM.
        </p>

        <h2>Strategy 4: "Rolling" Betas</h2>

        <p>
          If you have a waiting list, create a "churn" system. Invite 1,000 users, give them 2 weeks to test, and then remove them to invite the next 1,000. This keeps feedback fresh and allows you to test with far more than 10k unique users over time.
        </p>

        <h2>The "Nuclear Option": Multiple App IDs</h2>

        <p>
          Technically, the limit is per App ID (Bundle ID). You <em>could</em> create <code>com.app.beta1</code>, <code>com.app.beta2</code>, etc., each with its own TestFlight group.
        </p>

        <p>
          <strong>Warning:</strong> This separates your analytics, crash reports, and requires managing multiple app records. It is messy and generally not recommended unless absolutely necessary.
        </p>

        <h2>Summary</h2>

        <p>
          Hitting the 10,000 user limit is a "good problem" to have—it means your app is popular! Start by cleaning up inactive users, and if you truly need massive scale, consider if you are actually ready for the App Store production release instead of a beta.
        </p>
      </BlogLayout>
    </>
  );
}
