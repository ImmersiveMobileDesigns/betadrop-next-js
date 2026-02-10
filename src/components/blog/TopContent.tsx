import Link from 'next/link';
import { BlogPost, formatDate } from '@/lib/blog';
import { TrendingUp, Eye } from 'lucide-react';

interface TopContentProps {
  posts: BlogPost[];
}

export default function TopContent({ posts }: TopContentProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6 text-primary-400">
        <TrendingUp className="w-5 h-5" />
        <h3 className="text-lg font-bold text-white">Top Content</h3>
      </div>
      
      <div className="space-y-6">
        {posts.map((post, index) => (
          <Link 
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 items-start"
          >
            <span className="text-2xl font-bold text-white/10 group-hover:text-primary-500/50 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </span>
            
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{formatDate(post.publishedAt)}</span>
                {post.views && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
