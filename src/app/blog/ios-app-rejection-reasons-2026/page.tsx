import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('ios-app-rejection-reasons-2026')!;

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
      name: 'What happens if my app is rejected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apple will send you a message in Resolution Center explaining the guideline you violated. You can reply to clarify or submit a new build that fixes the issue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I appeal a rejection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If you believe your app complies with the guidelines and the reviewer made a mistake, you can submit an appeal to the App Review Board.',
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
          "Guideline 2.1 - Performance: App Completeness."
        </p>
        <p>
          If you've seen this message, you know the pain. Getting rejected by the App Store is a rite of passage for iOS developers. However, most rejections are avoidable if you know what to look for.
        </p>

        <p>
          Here are the top 10 reasons iOS apps are getting rejected in 2026.
        </p>

        <h3>1. Crashes and Bugs (Guideline 2.1)</h3>
        <p>
          The #1 reason. If your app crashes when the reviewer opens it, it's an instant rejection. <br />
          <strong>Fix:</strong> Test strictly on real devices, not just the simulator. Support IPv6 networks.
        </p>

        <h3>2. Broken Links / Placeholder Content</h3>
        <p>
          Do not submit an app with "Lorem Ipsum" text or "Coming Soon" buttons. Every button must work. Make sure your "Privacy Policy" and "Support" links in the metadata are active URLs.
        </p>

        <h3>3. Asking for Permissions Too Early (Guideline 5.1.1)</h3>
        <p>
          Don't ask for Camera, Location, or Notification permission as soon as the app launches. Users will deny it, and Apple will reject you.
          <br /><strong>Fix:</strong> Ask for permission <em>in context</em>, right when the user tries to use the feature.
        </p>

        <h3>4. Incomplete In-App Purchase Information</h3>
        <p>
          If you have subscriptions, you MUST disclose the price, duration, and cancellation terms clearly in the UI. Failing to include a "Restore Purchases" button is also a common rejection.
        </p>

        <h3>5. Web-Based Apps (Guideline 4.2)</h3>
        <p>
          "Your app is primarily a web view." Apple hates wrappers. If your app doesn't use native features (Push, Camera, Core Location) and just loads a website, use Safari instead.
        </p>

        <h3>6. User Generated Content (UGC) Violations</h3>
        <p>
          If users can post content, you MUST have:
          <br />- A block mechanism.
          <br />- A report mechanism.
          <br />- Terms of Service agreeing to no abusive content.
        </p>

        <h3>7. Misleading Metadata</h3>
        <p>
          Don't use screenshots from a different app. Don't mention "Android" or "Google" in your description. Don't promise features that aren't there.
        </p>

        <h3>8. Privacy Policy Issues</h3>
        <p>
          Your privacy policy must specifically state what data you collect and how you use it. It cannot be a generic template.
        </p>

        <h3>9. Submitting Test/Demo Mode Code</h3>
        <p>
          Don't leave "Debug Mode" enabled or have a "Test Login" button visible in the production build.
        </p>

        <h3>10. Account Deletion Requirement (Guideline 5.1.1(v))</h3>
        <p>
          Since 2022, if your app allows account creation, it MUST allow account deletion from within the app. Just a link to email support is often not enough; it needs to be an easy automated flow or a direct deep link.
        </p>

        <h2>Summary</h2>
        <p>
          Read the guidelines. Test on a real device. Be transparent about data. If you follow these three rules, your approval chances skyrocket.
        </p>
      </BlogLayout>
    </>
  );
}
