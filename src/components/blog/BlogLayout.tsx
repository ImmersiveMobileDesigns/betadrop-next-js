'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Header from '@/components/layout/Header';
import { BlogPost, formatDate, getRelatedPosts, getTopPosts } from '@/lib/blog';
import ShareButtons from './ShareButtons';
import LikeButton from './LikeButton';
import RelatedApps from './RelatedApps';
import TopContent from './TopContent';

interface BlogLayoutProps {
  post: BlogPost;
  children: React.ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const relatedPosts = getRelatedPosts(post.slug, 3);
  const topPosts = getTopPosts(5);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://betadrop.com'}/blog/${post.slug}`;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content + Sidebar Grid */}
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-16 relative z-10 flex flex-col lg:flex-row gap-12">
        
        {/* Main Article Content */}
        <main className="flex-1 w-full lg:max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.h1}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Keywords Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
                {post.primaryKeyword}
              </span>
              {post.secondaryKeywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/60 border border-white/10"
                >
                  {keyword}
                </span>
              ))}
            </div>
            {/* Featured Image */}
            {post.image && (
              <div className="mt-8 relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-primary-500/10">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </header>

          {/* Social Share & Like */}
          <div className="flex flex-wrap gap-4 items-center justify-between py-6 border-b border-white/10 mb-8 bg-white/[0.02] px-6 rounded-2xl">
            <ShareButtons url={shareUrl} title={post.title} />
            {/* <LikeButton slug={post.slug} initialLikes={post.likes || 0} /> */}
          </div>

          <article className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white prose-headings:scroll-mt-24
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:my-6 prose-ul:text-white/70
            prose-ol:my-6 prose-ol:text-white/70
            prose-li:my-2
            prose-code:text-primary-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-blockquote:border-l-primary-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-white/60
          ">
            {children}
          </article>

          {/* Related Apps Section */}
          {post.relatedApps && (
            <div className="mt-12">
              <RelatedApps apps={post.relatedApps} />
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-32 space-y-8">
            <TopContent posts={topPosts} />
            
            {/* Sidebar CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">BetaDrop</h3>
              <p className="text-sm text-white/60 mb-6">
                The easiest way to distribute iOS & Android apps to beta testers. No account required to start.
              </p>
              <Link 
                href="/" 
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
              >
                Upload App
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>

      </div>

      {/* Bottom CTA Section */}
      <section className="py-16 px-4 relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-primary-500/10 to-purple-500/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Distribute Your App?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Upload your IPA or APK file and get a shareable install link in seconds. 
              No account required. Completely free.
            </p>
            <Link
              href="/"
              className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/30 hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              Upload Your Build on BetaDrop
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 px-4 relative z-10 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="text-xs text-white/40 mb-3">
                  {formatDate(relatedPost.publishedAt)}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-white/50 line-clamp-2">
                  {relatedPost.metaDescription}
                </p>
                <div className="mt-4 text-sm text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 relative z-10 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="text-white/40 text-sm">Free iOS & Android beta distribution</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Upload App
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-white/30">
            © {new Date().getFullYear()} BetaDrop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
