'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, Search, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Header from '@/components/layout/Header';
import { getAllBlogPosts, formatDate } from '@/lib/blog';
import ClawdBotTrending from '@/components/blog/ClawdBotTrending';

const SCROLL_POSITION_KEY = 'blog-scroll-position';

const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'BetaDrop Blog',
  description: 'Expert guides and tips on iOS and Android beta app distribution',
  url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://betadrop.com'}/blog`,
  publisher: {
    '@type': 'Organization',
    name: 'BetaDrop',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://betadrop.com'}/logo.png`,
    },
  },
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const allPosts = getAllBlogPosts();
  
  const posts = useMemo(() => {
    if (!searchQuery) return allPosts;
    const query = searchQuery.toLowerCase();
    
    // specialized mapping for ClawdBot topics
    let effectiveQuery = query;
    if (query === 'ios distribution') effectiveQuery = 'ios';
    if (query === 'android testing') effectiveQuery = 'android';
    if (query === 'beta tools') effectiveQuery = 'beta';
    if (query === 'enterprise security') effectiveQuery = 'security'; // or enterprise or untrusted
    if (query === 'global release') effectiveQuery = 'distribute'; // or release
    if (query === 'ai testing') effectiveQuery = 'ai';
    if (query === 'ci/cd pipelines') effectiveQuery = 'cicd'; // matches 'mobile cicd automation' etc
    if (query === 'crash reporting') effectiveQuery = 'crash'; // matches 'crash logs', 'bug triage'
    if (query === 'app store tips') effectiveQuery = 'store'; // matches 'app store', 'play store'

    return allPosts.filter(post => 
      post.title.toLowerCase().includes(effectiveQuery) || 
      post.metaDescription.toLowerCase().includes(effectiveQuery) ||
      post.primaryKeyword.toLowerCase().includes(effectiveQuery) ||
      (post.secondaryKeywords && post.secondaryKeywords.some(k => k.toLowerCase().includes(effectiveQuery)))
    );
  }, [searchQuery, allPosts]);

  // Restore scroll position on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(0, position);
      });
      // Clear after restoring
      sessionStorage.removeItem(SCROLL_POSITION_KEY);
    }
  }, []);

  // Save scroll position before navigating
  const saveScrollPosition = useCallback(() => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-300 mb-8">
            <Search className="w-4 h-4" />
            Developer Resources & Guides
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            BetaDrop{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              Blog
            </span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Expert guides on iOS and Android beta app distribution.
            Learn how to share apps efficiently with your testers.
          </p>
        </div>
      </section>

      {/* ClawdBot Trending Topics */}
      <ClawdBotTrending 
        onTopicSelect={(topic) => {
          setSearchQuery(topic);
          // Small delay to ensure state update before scroll
          setTimeout(() => {
            document.getElementById('blog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }} 
      />

      {/* Blog Posts Grid */}
      <section id="blog-grid" className="pb-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {searchQuery && (
            <div className="mb-8 flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-white">
                <Search className="w-4 h-4 text-primary-400" />
                <span>
                  Showing results for: <span className="font-bold text-primary-300">"{searchQuery}"</span>
                  <span className="ml-2 text-white/40 text-sm">({posts.length} posts)</span>
                </span>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                <Search className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                We couldn't find any articles matching "{searchQuery}". Try selecting a different topic or clearing your search.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-primary px-6 py-2"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid gap-8">
            {/* Featured Post (First One) */}
            {posts.length > 0 && (
              <>
              <Link
                href={`/blog/${posts[0].slug}`}
                onClick={saveScrollPosition}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-white/10 hover:border-white/20 transition-all duration-300 min-h-[400px] flex flex-col justify-end"
              >
                {/* Background Image for Featured Post */}
                {posts[0].image && (
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={posts[0].image} 
                      alt={posts[0].title}
                      fill
                      priority
                      className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                  </div>
                )}

                <div className="relative z-10 p-8 md:p-12">
                  <div className="absolute top-4 right-4 md:top-8 md:right-8 px-3 py-1 rounded-full bg-primary-500/20 backdrop-blur-md border border-white/10 text-primary-300 text-xs font-medium">
                    Featured
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-end">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(posts[0].publishedAt)}
                        </div>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                        {posts[0].title}
                      </h2>
                      <p className="text-white/70 text-lg mb-6 line-clamp-2 max-w-2xl">
                        {posts[0].metaDescription}
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary-400 font-medium group-hover:gap-3 transition-all">
                        Read Article <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

            {/* Other Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={saveScrollPosition}
                  className="group flex flex-col h-full rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 overflow-hidden"
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden bg-white/5">
                    {post.image ? (
                      <>
                        <Image 
                          src={post.image} 
                          alt={post.title} 
                          fill
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Logo className="w-12 h-12 opacity-20" asLink={false} />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors line-clamp-2 flex-grow-0">
                      {post.title}
                    </h2>
                    
                    <p className="text-sm text-white/50 mb-4 line-clamp-3 flex-grow">
                      {post.metaDescription}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-primary-400 mt-auto pt-4 border-t border-white/5 group-hover:gap-3 transition-all">
                      Read more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            </>
          )}
        </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Share Your Beta App?
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            Stop reading, start shipping. Upload your IPA or APK and get a shareable link in seconds.
          </p>
          <Link
            href="/"
            className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/30 hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            Upload Your Build on BetaDrop
            <ArrowRight className="w-5 h-5" />
          </Link>
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
              <Link href="/blog" className="text-white hover:text-primary-400 transition-colors">
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
    </>
  );
}
