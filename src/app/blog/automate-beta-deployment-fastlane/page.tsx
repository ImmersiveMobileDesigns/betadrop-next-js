import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('automate-beta-deployment-fastlane')!;

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
      name: 'What is Fastlane?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fastlane is an open-source tool suite that automates tedious tasks for iOS and Android developers, such as generating screenshots, dealing with code signing, and releasing apps.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Fastlane free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Fastlane is completely free and open source (MIT License).',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Fastlane run on CI/CD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Fastlane requires no UI and is designed to run perfectly on CI services like GitHub Actions, CircleCI, Bitrise, and Jenkins.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Fastlane upload to TestFlight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the `pilot` action in Fastlane automates uploading builds to TestFlight and managing testers.',
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
          Manually archiving, signing, and uploading apps is a waste of developer time. In 2026, if you aren't automating your mobile release pipeline, you're doing it wrong.
        </p>

        <p>
          This guide shows you how to use <strong>Fastlane</strong> to automate your beta deployment from "git push" to "ready for testers".
        </p>

        <h2>What is Fastlane?</h2>

        <p>
          Fastlane is a collection of tools (actions) that handle specific mobile development tasks. You define "lanes" (workflows) in a <code>Fastfile</code> (Ruby script).
        </p>

        <h2>Key Components</h2>

        <ul>
          <li><strong>scan</strong> - Automates running tests.</li>
          <li><strong>match</strong> - Automates certificates and profiles (syncing them via Git/Cloud).</li>
          <li><strong>gym</strong> - Builds and archives your app (IPA/APK).</li>
          <li><strong>pilot</strong> - Uploads to TestFlight.</li>
          <li><strong>supply</strong> - Uploads metadata and binaries to Google Play.</li>
        </ul>

        <h2>Step 1: Installation</h2>

        <p>
          If you have Ruby installed:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>gem install fastlane</code>
        </pre>
        <p>
          Navigate to your project folder and run <code>fastlane init</code>.
        </p>

        <h2>Step 2: Defining a Beta Lane</h2>

        <p>
          Here is a typical <code>Fastfile</code> setup for distributing an iOS beta to TestFlight:
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>{`default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # 1. Ensure clean git status
    ensure_git_status_clean

    # 2. Increment build number
    increment_build_number(xcodeproj: "MyApp.xcodeproj")

    # 3. Sync certificates (Codesigning)
    match(type: "appstore")

    # 4. Build the app
    gym(scheme: "MyApp")

    # 5. Upload to TestFlight
    pilot(skip_waiting_for_build_processing: true)
    
    # 6. Notify team on Slack
    slack(
      message: "New Beta Build Uploaded! 🚀",
      slack_url: "https://hooks.slack.com/..."
    )
  end
end`}</code>
        </pre>

        <h2>Alternative: Ad Hoc Distribution Lane</h2>

        <p>
          If you avoid TestFlight (e.g., using <Link href="/" className="text-primary hover:underline">BetaDrop</Link>), you can swap <code>pilot</code> for a custom upload script or S3 upload.
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>{`lane :adhoc do
  match(type: "adhoc")
  gym(scheme: "MyApp", export_method: "ad-hoc")
  
  # Custom script to upload to BetaDrop or S3
  sh "curl -F 'file=@./MyApp.ipa' https://api.betadrop.com/upload"
end`}</code>
        </pre>

        <h2>Integrating with CI/CD</h2>

        <p>
          Fastlane runs seamlessly in CI. For GitHub Actions, your valid workflow file might look like this:
        </p>

        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code>{`name: Deploy Beta
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Fastlane
        run: fastlane beta
        env:
          MATCH_PASSWORD: \${{ secrets.MATCH_PASSWORD }}
          APP_STORE_CONNECT_API_KEY: \${{ secrets.API_KEY }}`}</code>
        </pre>

        <h2>Summary</h2>

        <p>
          Fastlane transforms a 30-minute manual headache into a hands-off background process. Start simple with build automation, then add signing (Match) and deployment layers.
        </p>
      </BlogLayout>
    </>
  );
}
