'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top on page load/reload
  useEffect(() => {
    // Use setTimeout to ensure this runs after the page is fully loaded
    const scrollToTopOnLoad = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Run immediately on mount
    scrollToTopOnLoad();
    
    // Also run when history state changes (for browser back/forward)
    window.history.scrollRestoration = 'manual';
  }, []);

  // Check visibility based on scroll position
  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    // Use GSAP for smooth scrolling which handles pinned sections much better
    // than native behavior: 'smooth'
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0.1, 
      ease: "power4.out"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-8 right-8 z-[100]
        w-14 h-14 rounded-full
        flex items-center justify-center
        transition-all duration-500 ease-out
        group cursor-pointer
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-20 opacity-0 scale-75 pointer-events-none'
        }
      `}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300" />
      
      {/* Glass Background */}
      <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 group-hover:bg-black/80 group-hover:border-white/20 transition-all duration-300" />

      {/* Gradient Border Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
      <div className="absolute inset-[2px] rounded-full bg-black/80" />

      {/* Ripple Animation on Hover */}
      <div className="absolute inset-0 rounded-full">
        <span className="absolute inset-0 rounded-full animate-ping opacity-0 group-hover:opacity-30 bg-gradient-to-r from-blue-500 to-purple-600" style={{ animationDuration: '1.5s' }} />
      </div>

      {/* Arrow Icon */}
      <ArrowUp className="relative z-10 w-5 h-5 text-white group-hover:text-blue-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />

      {/* Tooltip */}
      <span className="
        absolute right-full mr-3 px-3 py-1.5
        bg-black/80 backdrop-blur-sm text-white text-xs font-medium
        rounded-lg border border-white/10
        opacity-0 group-hover:opacity-100 
        translate-x-2 group-hover:translate-x-0
        transition-all duration-300
        pointer-events-none whitespace-nowrap
      ">
        Back to top
      </span>
    </button>
  );
}
