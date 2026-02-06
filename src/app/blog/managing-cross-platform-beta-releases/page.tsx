import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('managing-cross-platform-beta-releases')!;

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
      name: 'Should I release iOS and Android betas simultaneously?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ideally, yes. This keeps your testing cohort on the same feature set, simplifying feedback and bug tracking.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I handle version numbers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Maintain a single source of truth (like a JSON file) for your version number and build number, and have your build scripts inject this into both iOS (Info.plist) and Android (build.gradle) projects.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use one tool for both platforms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, platforms like Firebase App Distribution and BetaDrop allow you to upload both IPA and APK/AAB files to a single project, giving testers a unified destination.',
      },
    },
    {
      '@type': 'Question',
      name: 'What about React Native / Flutter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cross-platform frameworks benefit most from unified pipelines. Using tools like Fastlane, you can trigger a "build both" command that outputs artifacts for both platforms from a single codebase.',
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
          With frameworks like Flutter, React Native, and MAUI, building cross-platform apps is easier than ever. But <strong>distributing</strong> them for beta testing? That can still be a mess of disparate portals, inconsistent versions, and confused testers.
        </p>

        <p>
          This guide outlines how to streamline your release workflow to deliver iOS and Android betas in perfect sync in 2026.
        </p>

        <h2>The Goal: "One Click" Deployment</h2>

        <p>
          Your objective is simple: When you merge a PR to your <code>main</code> branch, both an iOS and an Android build should be generated and distributed automatically.
        </p>

        <h2>1. Unified Version Management</h2>

        <p>
          Stop manually editing <code>build.gradle</code> and project settings. Create a single file (e.g., <code>version.json</code>) in your project root:
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>{`{
  "version": "1.2.0",
  "build": 45
}`}</code>
        </pre>

        <p>
          Use a script (or Fastlane plugin) to read this file and apply it to both native projects during build time. This ensures iOS build 45 always corresponds to Android build 45.
        </p>

        <h2>2. Choosing the Right Distribution Platform</h2>

        <h3>Option A: The Native Routes (TestFlight + Play Console)</h3>
        <p>
          <strong>Pros:</strong> Greatest fidelity to production; pre-testing store review processes.<br/>
          <strong>Cons:</strong> Disconnected experiences. Testers need two invites. iOS reviews slow down the sync.
        </p>

        <h3>Option B: Firebase App Distribution</h3>
        <p>
          <strong>Pros:</strong> Supports both platforms. Good CLI tools.<br/>
          <strong>Cons:</strong> iOS setup is still complex (requires Ad Hoc/Enterprise profile management).
        </p>

        <h3>Option C: BetaDrop (Unified Link)</h3>
        <p>
          <strong>Pros:</strong> Upload both an IPA and APK. <Link href="/" className="text-primary hover:underline">BetaDrop</Link> gives you a single "magic link" that detects the user's OS and serves the correct file.<br/>
          <strong>Cons:</strong> iOS requires Ad Hoc/Enterprise signing.
        </p>

        <h2>3. Automating with Fastlane</h2>

        <p>
          Fastlane is the glue that holds cross-platform releases together. You can define a lane that builds both variants:
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>{`lane :beta_all do
  # 1. Update version from config
  update_versions

  # 2. Build Android
  gradle(task: "assembleRelease")
  supply(track: "internal") # or upload to other platform

  # 3. Build iOS
  gym(scheme: "MyApp")
  pilot # or upload to other platform
  
  # 4. Notify Team
  slack(message: "Cross-platform beta 1.2.0 (45) is live!")
end`}</code>
        </pre>

        <h2>Summary</h2>

        <p>
          Treat your cross-platform app as a single product, not two separate projects. By unifying your versioning and CI/CD pipeline, you reduce errors and ensure your testers are always comparing apples to apples (or rather, Pixels to iPhones).
        </p>
      </BlogLayout>
    </>
  );
}
