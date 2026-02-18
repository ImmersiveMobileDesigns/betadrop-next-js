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

/**
 * Fixes invalid JSON escape sequences that Gemini sometimes produces.
 *
 * JSON only allows these escape sequences inside strings:
 *   \" \\ \/ \b \f \n \r \t \uXXXX
 *
 * Gemini occasionally emits:
 *   \'  →  '   (apostrophe — valid in JS strings but NOT in JSON)
 *   \`  →  `   (backtick)
 *   \-  →  -   (hyphen)
 *   \(  →  (   etc.
 *   A lone \ at end of string
 *
 * This function walks the raw text character-by-character, only touching
 * characters that are inside JSON string values, and replaces bad escapes
 * with their literal character (or removes the backslash).
 */
function fixBadJsonEscapes(text) {
  const VALID_ESCAPES = new Set(['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u']);
  let result = '';
  let inString = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (!inString) {
      if (ch === '"') inString = true;
      result += ch;
      i++;
      continue;
    }

    // Inside a JSON string
    if (ch === '\\') {
      const next = text[i + 1];
      if (next === undefined) {
        // Lone backslash at end — drop it
        i++;
        continue;
      }
      if (VALID_ESCAPES.has(next)) {
        // Valid escape: keep both characters
        if (next === 'u') {
          // \uXXXX — keep all 6 chars
          result += text.slice(i, i + 6);
          i += 6;
        } else {
          result += ch + next;
          i += 2;
        }
      } else {
        // Invalid escape: drop the backslash, keep the literal character
        result += next;
        i += 2;
      }
      continue;
    }

    if (ch === '"') {
      inString = false;
    }

    result += ch;
    i++;
  }

  return result;
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

  // Curated pool of 60+ trending 2026 tech topics for automatic selection
  const trendingTopicPool = [
    // AI & Machine Learning
    'Building AI Agents with LangChain and Next.js in 2026',
    'On-Device AI: Running LLMs Locally on Mobile with Core ML and TensorFlow Lite',
    'Retrieval-Augmented Generation (RAG) for Mobile Apps: A Practical Guide',
    'AI Code Review Tools: GitHub Copilot vs Cursor vs Gemini Code Assist Compared',
    'Fine-Tuning Open-Source LLMs (Llama 3, Mistral) for Your Application',
    'Multimodal AI in Mobile Apps: Vision, Audio, and Text Combined',
    'AI-Powered App Personalization: Recommender Systems for Mobile Developers',
    'Prompt Engineering Best Practices for Developers in 2026',
    'Vector Databases Explained: Pinecone, Weaviate and pgvector for Developers',
    'Building a Real-Time AI Chatbot with Gemini API and React',
    // Web Development
    'Next.js 15 App Router: Complete Guide to Server Components and Server Actions',
    'React 19 New Features Every Developer Must Know in 2026',
    'Bun vs Node.js vs Deno: Which JavaScript Runtime to Choose in 2026',
    'Web Performance Optimization: Core Web Vitals Complete Guide for 2026',
    'TypeScript 5 Advanced Patterns: Decorators, Satisfies and Template Literals',
    'Building Offline-First Web Apps with Service Workers and IndexedDB',
    'Edge Computing with Vercel Edge Functions and Cloudflare Workers',
    'Micro-Frontends Architecture: Scaling Large React Applications',
    'WebAssembly (WASM) in 2026: Real-World Use Cases for Web Developers',
    'Astro 5 vs Next.js: Which Framework for Content-Heavy Sites in 2026',
    'tRPC with Next.js: End-to-End Type Safety Without REST or GraphQL',
    'CSS in 2026: Container Queries, Cascade Layers and the has Selector',
    'Zustand vs Redux Toolkit vs Jotai: State Management Showdown 2026',
    'Shadcn UI and Tailwind CSS: Building a Production-Ready Design System',
    // Mobile Development
    'React Native New Architecture: Fabric and JSI Explained for Developers',
    'Flutter vs React Native: Which Cross-Platform Framework to Choose in 2026',
    'Swift 6 Concurrency: Async Await and Actors for iOS Developers',
    'Jetpack Compose vs SwiftUI: Cross-Platform UI Comparison 2026',
    'Building iOS Widgets with WidgetKit and SwiftUI Step by Step',
    'Android 16 New Features: What Mobile Developers Need to Know',
    'Deep Linking and Universal Links: Complete Guide for iOS and Android',
    'Mobile App Accessibility: WCAG 2.2 for iOS and Android Developers',
    'Offline-First Mobile Apps: SQLite, Room and Core Data Strategies',
    'Push Notifications in 2026: FCM, APNs and Rich Notifications Complete Guide',
    'Building a Cross-Platform App with Expo SDK 52',
    'Kotlin Multiplatform (KMP) in 2026: Share Code Between iOS and Android',
    // DevOps & Cloud
    'GitHub Actions vs GitLab CI vs Bitrise: Mobile CI/CD Comparison 2026',
    'Docker and Kubernetes for Mobile Backend: A Practical Developer Guide',
    'Infrastructure as Code with Terraform: Beginner to Advanced Guide',
    'GitOps with ArgoCD: Automated Kubernetes Deployments Explained',
    'Monitoring Mobile Apps with OpenTelemetry, Grafana and Prometheus',
    'Serverless Architecture in 2026: AWS Lambda vs Cloudflare Workers',
    'Platform Engineering: Building Internal Developer Platforms (IDPs)',
    'FinOps for Developers: Reducing Cloud Costs Without Sacrificing Performance',
    'Secrets Management Best Practices: HashiCorp Vault, AWS Secrets Manager and Doppler',
    'Blue-Green vs Canary Deployments: Zero-Downtime Release Strategies',
    // Security
    'OAuth 2.1 and PKCE: Secure Authentication for Mobile Apps in 2026',
    'Software Supply Chain Security: SBOM, Sigstore and Dependency Scanning',
    'Mobile App Penetration Testing: Tools and Techniques for Developers',
    'API Security Best Practices: Rate Limiting, JWT and mTLS in 2026',
    'OWASP Mobile Top 10 2026: Critical Vulnerabilities Every Developer Must Fix',
    // Software Engineering
    'Domain-Driven Design (DDD) for Modern Microservices Architecture',
    'Test-Driven Development (TDD) in 2026: Practical Guide with Real Examples',
    'Event-Driven Architecture with Kafka and RabbitMQ for Developers',
    'SOLID Principles in TypeScript: Real-World Practical Examples',
    'Monorepo vs Polyrepo: Nx, Turborepo and pnpm Workspaces Compared',
    'API Design Best Practices: REST vs GraphQL vs gRPC in 2026',
    'Database Sharding and Partitioning: Scaling PostgreSQL for High Traffic',
    'WebSockets vs Server-Sent Events vs Long Polling: Real-Time Tech Compared',
    'Code Review Best Practices: How Top Engineering Teams Ship Faster',
    'Technical Debt: How to Measure, Prioritize and Pay It Down Effectively',
  ];

  const prompt = `
    You are an expert technical content writer for a developer-focused blog (BetaDrop).
    
    CONTEXT:
    ${context}
    
    TASK:
    ${topicInput
      ? `Write a comprehensive, SEO-optimized blog post about: "${topicInput}"`
      : `From the following list of trending 2026 tech topics, pick the SINGLE BEST topic that:
         1. Is NOT already covered by the existing slugs: [${existingSlugs.join(', ')}]
         2. Has the highest search volume potential and trending interest in early 2026
         3. Provides maximum value to developers and tech enthusiasts
         4. Aligns well with a developer-focused platform like BetaDrop
         
         TRENDING TOPIC POOL (choose one and write a full post about it):
         ${trendingTopicPool.map((t, i) => `${i + 1}. ${t}`).join('\n         ')}`}
    
    REQUIREMENTS:
    1. Output MUST be valid JSON only. Do not wrap in markdown code blocks.
    2. JSON Structure:
    {
      "slug": "kebab-case-slug",
      "title": "Catchy SEO Title (Max 60 chars)",
      "metaDescription": "Compelling SEO meta description (150-160 chars, include primary keyword)",
      "h1": "Main Header (Include primary keyword naturally)",
      "primaryKeyword": "main target keyword phrase",
      "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
      "readTime": 7,
      "icon": "single relevant emoji",
      "colors": ["#hex1", "#hex2"],
      "jsxContent": "Full blog post as HTML/JSX string (900-1200 words). Use <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <code>, <a> tags. NO markdown. NO <h1> or <h2>. Escape all double quotes inside the string as backslash-quote. Include at least one practical code example.",
      "faqs": [
        { "question": "Specific FAQ Q1?", "answer": "Detailed A1" },
        { "question": "Specific FAQ Q2?", "answer": "Detailed A2" },
        { "question": "Specific FAQ Q3?", "answer": "Detailed A3" }
      ],
      "shortTitleForImage": "Short Title (Max 20 chars)"
    }
    3. Ensure 'slug' is unique and NOT in this list: ${existingSlugs.join(', ')}.
    4. Content Quality & SEO:
       - Length: Comprehensive (approx 900-1200 words of actual content).
       - Keywords: Use 'primaryKeyword' in H1, first paragraph, and naturally 3-4 times. Use 'secondaryKeywords' throughout for semantic relevance.
       - Structure: Use 4-6 clear <h3> headings to organize sections logically.
       - Code Examples: Include at least one practical, real-world code snippet using <code> tags inline or wrapped in a <pre> block.
       - Internal Links: Link to '/' (BetaDrop Home) or '/blog' where contextually relevant using <a href="/">.
       - External Links: Link to 2-3 authoritative sources (official docs, MDN, GitHub) for credibility.
       - Tone: Professional, helpful, developer-to-developer. Avoid fluff. Be specific and actionable.
       - CTA: End with a brief call-to-action paragraph relevant to developers.
    5. 'jsxContent' must be valid JSX injectable into a React component. Escape all double quotes inside the string.
    6. 'colors' must be 2 vivid, complementary hex colors matching the topic theme (AI=purple/blue, Security=red/orange, Web=green/teal, Mobile=indigo/cyan, DevOps=orange/yellow).
  `;

  let retries = 3;
  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();

      // Step 1: Strip markdown code fences Gemini sometimes adds
      text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

      // Step 2: Extract the outermost JSON object (handles leading/trailing prose)
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        text = text.slice(firstBrace, lastBrace + 1);
      }

      // Step 3: Fix bad escape sequences that Gemini sometimes emits inside
      // JSON strings (e.g. \' which is invalid in JSON, or lone backslashes).
      // We sanitize only the string values, not the structural characters.
      text = fixBadJsonEscapes(text);

      return JSON.parse(text);
    } catch (error) {
      console.warn(`⚠️ API Error (Remaining retries: ${retries - 1}):`, error.message);
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        console.log('⏳ Rate limited. Waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
      } else if (retries > 1) {
        // For JSON parse errors or other transient issues, wait briefly and retry
        console.log('⏳ Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
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

/**
 * Transforms raw AI-generated HTML/JSX string into valid, compilable JSX.
 * Fixes the most common issues that cause Next.js build errors:
 *  1. Unescaped apostrophes in text nodes  → &apos;
 *  2. class= attributes                   → className=
 *  3. Raw & in text nodes                 → &amp;
 *  4. <code> blocks wrapped in {`...`}    so inner chars don't need escaping
 *  5. Strips stray markdown code fences   (```jsx / ``` etc.)
 *  6. Removes self-closing <br/> issues   → <br />
 */
function sanitizeJsxContent(html) {
  if (!html) return '';

  // 1. Strip any markdown code fences the AI may have accidentally added
  html = html.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');

  // 2. Fix class= → className= (but not inside code blocks)
  html = html.replace(/\bclass=/g, 'className=');

  // 3. Fix <br> and <br/> → <br />
  html = html.replace(/<br\s*\/?>/gi, '<br />');

  // 4. Fix <hr> → <hr />
  html = html.replace(/<hr\s*\/?>/gi, '<hr />');

  // 5. Fix <img ...> (no closing slash) → <img ... />
  html = html.replace(/<img([^>]*[^/])>/gi, '<img$1 />');

  // 6. Wrap <pre><code>...</code></pre> blocks in {`...`} template literals
  //    so all special characters inside are safe without escaping.
  //    We do this BEFORE the apostrophe fix so code content is untouched.
  html = html.replace(
    /<pre>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (match, codeContent) => {
      // Decode any HTML entities already in the code block
      const decoded = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'");
      // Escape backticks and ${} inside the template literal
      const escaped = decoded
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
      return `<pre><code>{\`${escaped}\`}</code></pre>`;
    }
  );

  // 7. Also wrap inline <code>...</code> that contain JSX-breaking chars
  //    Only wrap if the content contains < > { } or backticks
  html = html.replace(
    /<code>([^<]*[<>{}][^<]*)<\/code>/g,
    (match, codeContent) => {
      const decoded = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      const escaped = decoded
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
      return `<code>{\`${escaped}\`}</code>`;
    }
  );

  // 8. Fix unescaped apostrophes in TEXT nodes only (not inside attributes or code blocks)
  //    Strategy: split on JSX expressions/attributes and only fix bare text segments
  //    Simple approach: replace ' that is NOT inside an HTML tag or already escaped
  html = html.replace(/(?<=>|^)([^<]*)(?=<|$)/g, (match) => {
    // Replace bare apostrophes in text content (not already &apos; or &#39;)
    return match.replace(/(?<!&\w{1,6})'/g, '&apos;');
  });

  // 9. Fix bare & in text nodes that aren't already HTML entities
  html = html.replace(/(?<=>|^)([^<]*)(?=<|$)/g, (match) => {
    return match.replace(/&(?![a-zA-Z]{2,8};|#[0-9]{1,6};)/g, '&amp;');
  });

  // 10. Remove stray <p> tags that immediately precede block-level elements.
  //     e.g. <p><h3>Conclusion</h3> → <h3>Conclusion</h3>
  //     A <p> cannot contain block-level elements in HTML/JSX; the AI sometimes
  //     wraps a heading or list inside a <p>, leaving it unclosed and causing
  //     "JSX element 'p' has no corresponding closing tag" compile errors.
  const BLOCK_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'pre', 'blockquote', 'div', 'table'];
  BLOCK_TAGS.forEach(tag => {
    // Remove <p> that is immediately followed by a block-level opening tag
    html = html.replace(new RegExp(`<p>\\s*(?=<${tag}[\\s>])`, 'gi'), '');
    // Remove </p> that is immediately preceded by a block-level closing tag
    html = html.replace(new RegExp(`(?<=</${tag}>)\\s*</p>`, 'gi'), '');
  });

  return html;
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
        ${sanitizeJsxContent(newPost.jsxContent)}
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
