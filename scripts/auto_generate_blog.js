const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' }); // Try .env.local first
require('dotenv').config(); // Fallback to .env

// -- CONFIGURATION --
const BLOG_FILE_PATH = path.join(process.cwd(), 'src/lib/blog.ts');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog');

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error(`
❌ ERROR: Gemini API Key Missing

To use the AI blog generator, you need a free API key from Google.
1. Go to: https://aistudio.google.com/app/apikey
2. Create a new key.
3. Add it to your .env file:
   GEMINI_API_KEY=your_key_here
`);
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
// Free tier rate limits are strict.
// 'gemini-2.5-flash' (Good Balance)
// 'gemini-2.5-pro' (Best Quality, Very Strict Limits)
// 'gemini-2.0-flash-lite' (Fastest)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// -- SVG GENERATOR (Copied/Adapted from generate_blog_images.js) --
// -- SVG GENERATOR (Copied/Adapted from generate_blog_images.js) --
function escapeXML(str) {
  if (!str) return '';
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function generateSVG({ title, colors, icon }) {
  if (!colors || colors.length < 2) colors = ['#4F46E5', '#7C3AED']; // Default fallback

  const safeTitle = escapeXML(title.toUpperCase());
  const safeIcon = escapeXML(icon || '📝');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
    </linearGradient>
    <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#grad)" />
  
  <!-- Decorative Circles -->
  <circle cx="10%" cy="10%" r="200" fill="white" fill-opacity="0.05" />
  <circle cx="90%" cy="90%" r="300" fill="white" fill-opacity="0.05" />
  
  <!-- Glass Card -->
  <rect x="150" y="115" width="900" height="400" rx="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  
  <!-- Content -->
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" fill="white" filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.2))">
    ${safeIcon}
  </text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="white" font-weight="bold" letter-spacing="1">
    ${safeTitle}
  </text>
  
  <!-- Branding -->
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="rgba(255,255,255,0.6)" font-weight="medium">
    BETADROP.APP
  </text>
</svg>`;
}

// -- MAIN LOGIC --

async function getAppContext() {
  console.log('🔍 Gathering app context...');

  let context = '';

  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    context += `App Name: ${packageJson.name}\nDescription: ${packageJson.description || 'Beta App Distribution Platform'}\n`;
  } catch (e) {
    console.warn('⚠️ Could not read package.json');
  }

  try {
    const pageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/page.tsx'), 'utf8');
    // Extract a chunk of the landing page text to understand the vibe
    const simplerContent = pageContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 2000);
    context += `Landing Page Content Snippet: ${simplerContent}\n`;
  } catch (e) {
    console.warn('⚠️ Could not read src/app/page.tsx');
  }

  return context;
}

async function generateBlogContent(topicInput, context) {
  console.log(`🤖 Consulting Gemini for: ${topicInput || 'Automatic Topic'}...`);

  const existingSlugs = [];
  try {
    const blogFile = fs.readFileSync(BLOG_FILE_PATH, 'utf8');
    const slugRegex = /slug:\s*'([^']+)'/g;
    let match;
    while ((match = slugRegex.exec(blogFile)) !== null) {
      existingSlugs.push(match[1]);
    }
  } catch (e) { }

  const prompt = `
    You are an expert technical content writer for a developer-focused blog (BetaDrop).
    
    CONTEXT:
    ${context}
    
    TASK:
    ${topicInput
      ? `Write a blog post about: "${topicInput}"`
      : 'Generate a highly relevant, trending technical blog post topic for the IT industry, software development, and modern tech stacks. While BetaDrop is an app distribution platform, broaden the scope to include topics like Web Development (React, Next.js), Mobile Development (iOS, Android), DevOps, AI/ML trends, and Software Engineering Best Practices. Focus on providing value to developers and tech enthusiasts.'}
    
    REQUIREMENTS:
    1. Output MUST be valid JSON only. Do not wrap in markdown code blocks.
    2. JSON Structure:
    {
      "slug": "kebab-case-slug",
      "title": "Catchy Title (Max 60 chars)",
      "metaDescription": "SEO optimized description (150 chars)",
      "h1": "Main Header (Include primary keyword)",
      "primaryKeyword": "main keyword",
      "secondaryKeywords": ["kw1", "kw2"],
      "readTime": 5,
      "icon": "emoji or short text for image",
      "colors": ["#hex1", "#hex2"] (2 complimentary vivid gradient colors),
      "jsxContent": "The full blog post content as raw HTML/JSX string. Use <h3>, <p>, <ul>, <li>, <strong>, <a> tags. Do NOT use markdown. Do NOT use <h1> or <h2> (handled by layout). Ensure proper escaping of quotes.",
      "faqs": [
        { "question": "Q1", "answer": "A1" },
        { "question": "Q2", "answer": "A2" }
      ],
      "shortTitleForImage": "Short Title (Max 20 chars)"
    }
    3. Ensure 'slug' is unique and NOT in this list: ${existingSlugs.join(', ')}.
    4. Content Quality & SEO:
       - Length: Comprehensive (approx 800-1200 words).
       - Keywords: Use 'primaryKeyword' in H1, first paragraph, and naturally 2-3 times. Use 'secondaryKeywords' for semantic relevance.
       - Structure: Use clear <h3> headings for sections.
       - Internal Links: Where relevant, link to internal pages like '/' (Home), '/install' (Install Guide), or '/pricing' (Pricing). Use <Link href="..."> tag if possible, or standard <a href="...">.
       - External Links: Link to authoritative sources (Apple/Android docs) for credibility.
       - Tone: Professional, helpful, developer-to-developer.
    5. 'jsxContent' must be valid JSX to be injected into a React component.
  `;

  let retries = 3;
  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();

      // Clean up if Gemini adds markdown blocks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      return JSON.parse(text);
    } catch (error) {
      console.warn(`⚠️ API Error (Remaining retries: ${retries - 1}):`, error.message);
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        console.log('⏳ Rate limited. Waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
      } else {
        throw error;
      }
      retries--;
    }
  }
  throw new Error('Failed to generate content after retries.');
}

function updateBlogFile(newPost, imageFilename) {
  console.log('📝 Updating src/lib/blog.ts...');

  let content = fs.readFileSync(BLOG_FILE_PATH, 'utf8');

  // Create object string
  const newEntry = `
  {
    slug: '${newPost.slug}',
    title: "${newPost.title.replace(/"/g, '\\"')}",
    metaDescription: "${newPost.metaDescription.replace(/"/g, '\\"')}",
    h1: "${newPost.h1.replace(/"/g, '\\"')}",
    primaryKeyword: '${newPost.primaryKeyword}',
    secondaryKeywords: ${JSON.stringify(newPost.secondaryKeywords).replace(/"/g, "'")},
    publishedAt: '${new Date().toISOString().split('T')[0]}',
    updatedAt: '${new Date().toISOString().split('T')[0]}',
    readTime: ${newPost.readTime},
    author: 'BetaDrop Team',
    image: '/images/blog/${imageFilename}'
  },`;


  // Insert before the last closing bracket of the array
  // We look for the last property of the last item to find the end of the list safely
  // Or just find "];" and replace with our entry + "];"

  const insertionPoint = content.lastIndexOf('];');
  if (insertionPoint === -1) {
    throw new Error('Could not find end of blogPosts array in src/lib/blog.ts');
  }

  // Check if there is a trailing comma before ];
  const beforeEnd = content.slice(0, insertionPoint).trimEnd();
  const hasTrailingComma = beforeEnd.endsWith(',');

  // If there is a trailing comma, we don't need to add one.
  // But wait, my newEntry starts with a comma in the template string above?
  // Let's remove the comma from the template string and add it conditionally.

  const entryWithoutComma = newEntry.trim().replace(/^,/, '');

  const separator = hasTrailingComma ? '' : ',';

  const updatedContent = beforeEnd + separator + '\n' + entryWithoutComma + '\n' + content.slice(insertionPoint);

  fs.writeFileSync(BLOG_FILE_PATH, updatedContent);
  console.log(`✅ Added "${newPost.title}" to blog.ts`);
}

const axios = require('axios');

async function createBlogImage(newPost) {
  console.log('🎨 Generating cover image (SVG)...');

  try {
    const svgContent = generateSVG({
      title: newPost.shortTitleForImage || newPost.title.substring(0, 20),
      colors: newPost.colors,
      icon: newPost.icon
    });

    const fileName = `${newPost.slug}.svg`;
    const filePath = path.join(IMAGES_DIR, fileName);

    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Created SVG image: public/images/blog/${fileName}`);
    return fileName;

  } catch (error) {
    console.warn('⚠️ Failed to generate SVG image:', error.message);
    throw error;
  }
}

function createBlogPage(newPost) {
  console.log('📄 Generating page.tsx...');

  const dirPath = path.join(process.cwd(), 'src/app/blog', newPost.slug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const faqs = newPost.faqs || [];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const fileContent = `
import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const post = getBlogPost('${newPost.slug}')!;

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
    url: \`\${process.env.NEXT_PUBLIC_APP_URL}/blog/\${post.slug}\`,
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.metaDescription,
  },
  alternates: {
    canonical: \`\${process.env.NEXT_PUBLIC_APP_URL}/blog/\${post.slug}\`,
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
      url: \`\${process.env.NEXT_PUBLIC_APP_URL}/logo.png\`,
    },
  },
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': \`\${process.env.NEXT_PUBLIC_APP_URL}/blog/\${post.slug}\`,
  },
};

const faqStructuredData = ${JSON.stringify(faqSchema, null, 2)};

export default function BlogPostPage() {
  const articleJson = JSON.stringify(articleStructuredData);
  const faqJson = JSON.stringify(faqStructuredData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJson }}
      />

      <BlogLayout post={post}>
        ${newPost.jsxContent}
      </BlogLayout>
    </>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), fileContent.trim());
  console.log(`✅ Created page: src/app/blog/${newPost.slug}/page.tsx`);
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const userTopic = args.length > 0 ? args.join(' ') : null;

    const context = await getAppContext();
    const newPost = await generateBlogContent(userTopic, context);

    console.log(`✨ Generated Topic: ${newPost.title} `);

    const imageFilename = await createBlogImage(newPost);
    updateBlogFile(newPost, imageFilename);
    createBlogPage(newPost);

    console.log('🎉 Blog post generation complete!');
    if (!userTopic) {
      console.log(`Run 'npm run dev' to see "${newPost.title}" in your blog list.`);
    }

  } catch (error) {
    console.error('❌ Failed to generate blog post:', error);
    process.exit(1);
  }
}

main();
