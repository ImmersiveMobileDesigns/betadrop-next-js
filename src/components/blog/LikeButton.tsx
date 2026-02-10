'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  slug: string;
  initialLikes?: number;
}

export default function LikeButton({ slug, initialLikes = 0 }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const likedPosts = localStorage.getItem('liked_posts');
    if (likedPosts) {
      const parsed = JSON.parse(likedPosts);
      if (parsed.includes(slug)) {
        setHasLiked(true);
      }
    }
  }, [slug]);

  const toggleLike = () => {
    if (hasLiked) {
      // Typically we don't allow unlike in simple blog metrics, but let's allow it for UX
      setLikes(prev => prev - 1);
      setHasLiked(false);
      
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      const updated = likedPosts.filter((s: string) => s !== slug);
      localStorage.setItem('liked_posts', JSON.stringify(updated));
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      setAnimation(true);
      
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      if (!likedPosts.includes(slug)) {
        likedPosts.push(slug);
        localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
      }
      
      // Reset animation
      setTimeout(() => setAnimation(false), 1000);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`relative group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        hasLiked 
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
      }`}
      aria-label={hasLiked ? 'Unlike this post' : 'Like this post'}
    >
      <div className="relative">
        <Heart 
          className={`w-5 h-5 transition-transform duration-300 ${
            hasLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
          } ${animation ? 'animate-ping absolute inset-0 opacity-75' : ''}`} 
        />
        <Heart 
          className={`w-5 h-5 transition-transform duration-300 ${
            hasLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
          }`} 
        />
      </div>
      <span className="font-medium tabular-nums text-sm">
        {likes.toLocaleString()}
      </span>
      {hasLiked && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
      )}
    </button>
  );
}
