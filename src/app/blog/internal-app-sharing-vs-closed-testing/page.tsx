import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('internal-app-sharing-vs-closed-testing')!;

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
      name: 'Does Internal App Sharing require app review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Builds uploaded to Internal App Sharing are available immediately for download via the link. There is no review process.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I promote a build from Internal App Sharing to Production?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Internal App Sharing artifacts are temporary. To release to production, you must upload the AAB to a formal track (Internal, Closed, Open, or Production) with a higher version code.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who can download from Internal App Sharing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anyone with the link, provided you have authorized their email list in the settings, OR if you have enabled "Allow anyone with the link to download" in the Play Console.',
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
          The Google Play Console offers a confusing array of testing tracks: Internal, Closed, Open, and a separate tool called <strong>Internal App Sharing</strong>.
        </p>

        <p>
          Many developers confuse the "Internal Testing Track" with "Internal App Sharing". They sound similar, but they serve completely different purposes. This guide clarifies when to use which.
        </p>

        <h2>1. Internal App Sharing</h2>
        <p>
          Think of this as <strong>"Quick &amp; Dirty"</strong> distribution.
        </p>
        <ul>
          <li><strong>Purpose:</strong> Sharing ad-hoc builds with QA or fellow developers instantly.</li>
          <li><strong>Speed:</strong> Instant. No processing time. No review.</li>
          <li><strong>Versioning:</strong> Version codes don't matter. You can upload the same version code twice.</li>
          <li><strong>Requirement:</strong> Useful for checking a specific bug fix (e.g., "Hey, does this APK fix the login crash?").</li>
        </ul>

        <h2>2. Closed Testing (Alpha/Beta)</h2>
        <p>
          Think of this as <strong>"Formal Staging"</strong>.
        </p>
        <ul>
          <li><strong>Purpose:</strong> Testing a release candidate with a trusted group of users before production.</li>
          <li><strong>Speed:</strong> Slower. Builds must be reviewed by Google (though usually faster than production review).</li>
          <li><strong>Versioning:</strong> Strict unique version codes required.</li>
          <li><strong>Requirement:</strong> Useful for end-to-end testing of the actual release artifact.</li>
        </ul>

        <h2>Key Differences Table</h2>
        
        <div className="overflow-x-auto my-8">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4 font-semibold">Feature</th>
                <th className="py-2 px-4 font-semibold">Internal App Sharing</th>
                <th className="py-2 px-4 font-semibold">Closed Testing Track</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4">Google Review</td>
                <td className="py-2 px-4">None (Instant)</td>
                <td className="py-2 px-4">Required</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4">User Limit</td>
                <td className="py-2 px-4">100 downloads</td>
                <td className="py-2 px-4">Typically 2,000+ (per list)</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4">Promote to Prod?</td>
                <td className="py-2 px-4">No</td>
                <td className="py-2 px-4">Yes</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4">Config</td>
                <td className="py-2 px-4">Upload via Web</td>
                <td className="py-2 px-4">Upload via Console or API</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Workflow Recommendation</h2>
        <p>
          <strong>For Daily Development:</strong> Use Internal App Sharing. It’s fast and doesn't clutter your release tracks.
        </p>
        <p>
          <strong>For Release Candidates:</strong> Once you think a build is "Gold", upload it to the Closed Testing track. Let your QA team verify it there. If it passes, you can click "Promote to Production" with one button, ensuring the exact same binary goes live.
        </p>
      </BlogLayout>
    </>
  );
}
