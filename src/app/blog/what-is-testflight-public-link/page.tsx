import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('what-is-testflight-public-link')!;

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
      name: 'How many testers can I invite via Public Link?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can invite up to 10,000 external testers per app using TestFlight Public Links.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do public link builds require Apple Review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Before you can enable a public link for a build, that specific build (or a previous one in the same version) must pass Beta App Review by Apple.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I disable the link later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can disable the public link at any time in App Store Connect. Anyone who has already installed the app can keep using it until the build expires (90 days).',
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
          Traditionally, beta testing on iOS meant collecting email addresses, adding them to App Store Connect, and waiting for users to accept invitations. Ideally, it was slow.
        </p>

        <p>
          Enter <strong>TestFlight Public Links</strong>.
        </p>

        <p>
          A Public Link allows you to create a unique URL for your app. Anyone with this link can install your beta version just by tapping it—no email invitation required. It effectively turns your closed beta into an <strong>Open Beta</strong>.
        </p>

        <h2>How to Create a Public Link</h2>

        <ol>
          <li>Log in to <strong>App Store Connect</strong>.</li>
          <li>Go to <strong>My Apps</strong> and select your app.</li>
          <li>Click on the <strong>TestFlight</strong> tab.</li>
          <li>In the left sidebar, click the <strong>(+)</strong> icon next to "External Testing" to create a new group (e.g., "Public Beta").</li>
          <li>Add a build to this group. <em>Note: This typically triggers a Beta App Review.</em></li>
          <li>Once the build is "Approved", go to the group settings.</li>
          <li>Scroll down to <strong>Public Link</strong> and click <strong>Enable Public Link</strong>.</li>
        </ol>

        <p>
          You will now see a URL like <code>https://testflight.apple.com/join/xxxxxx</code>. Copy this and share it anywhere!
        </p>

        <h2>Best Practices for Public Links</h2>

        <h3>1. Set a Tester Limit</h3>
        <p>
          You can capitalize the number of testers who can join via the link (e.g., first 1,000 users). This is great for creating exclusivity or managing server load.
        </p>

        <h3>2. Provide Clear Instructions</h3>
        <p>
          Don't just paste the link. Tell users:
          <br />"Step 1: Install the TestFlight app from the App Store."
          <br />"Step 2: Tap this link to join our beta."
        </p>

        <h3>3. Monitor Feedback</h3>
        <p>
          Since you don't collect emails upfront, you don't know who your testers are. Encourage them to send feedback through the TestFlight app (by taking a screenshot) or include a feedback form inside your app.
        </p>

        <h2>Limitations</h2>
        <ul>
          <li><strong>Anonymity:</strong> You won't see the email addresses of users who join via public link. They appear as "Anonymous" in your tester list.</li>
          <li><strong>Review Time:</strong> Every new version requires a Beta Review before the public link works for that version.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          TestFlight Public Links are the growth hack for iOS beta testing. They remove friction and allow you to share your beta on Twitter, Reddit, or your newsletter to get thousands of testers overnight.
        </p>
      </BlogLayout>
    </>
  );
}
