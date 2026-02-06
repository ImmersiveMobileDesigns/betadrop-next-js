'use client';

/**
 * FloatingOrb Component - 4K Optimized
 * 
 * Performance optimizations for 4K displays:
 * 1. Blur disabled on 4K screens (major GPU performance gain)
 * 2. Animation distance reduced by 40% on 4K
 * 3. GPU-accelerated transforms only
 * 4. Conditional rendering based on reduced motion preference
 * 
 * HYDRATION FIX: Uses useState/useEffect to prevent SSR mismatch
 */

import { useState, useEffect } from 'react';
import { shouldDisableEffect, getOptimalBlur, is4KScreen, MOTION_SCALE_4K } from '@/lib/animationConfig';

export interface FloatingOrbProps {
  className?: string;
  size?: number;
  color?: string;
  blur?: number;
  speed?: number;  // Duration in seconds
  delay?: number;  // Delay in seconds
}

export function FloatingOrb({
  className = '',
  size = 200,
  color = 'rgba(59, 130, 246, 0.15)',
  blur = 60,
  speed = 8,
  delay = 0,
}: FloatingOrbProps) {
  // HYDRATION FIX: Use state to defer client-only checks
  const [shouldRender, setShouldRender] = useState(true); // Default to true for SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Client-side only: Check if we should disable blur effects
    setIsMounted(true);
    setShouldRender(!shouldDisableEffect('blur'));
  }, []);

  // During SSR and initial render, show the orb
  // After mount, respect the 4K detection
  if (isMounted && !shouldRender) {
    return null;
  }

  // 4K Performance: Reduce animation distance by 40%
  // Only calculate on client to avoid hydration issues
  const animationDistance = isMounted && is4KScreen() ? MOTION_SCALE_4K : 1;
  const moveX1 = Math.round(-8 * animationDistance);
  const moveY1 = Math.round(12 * animationDistance);
  const moveX2 = Math.round(12 * animationDistance);
  const moveY2 = Math.round(-8 * animationDistance);

  // 4K Performance: Get optimal blur value (0 on 4K, reduced otherwise)
  const optimizedBlur = isMounted ? getOptimalBlur(blur) : blur;

  return (
    <>
      <div
        className={`absolute rounded-full pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          background: color,
          // 4K Performance: Blur disabled on 4K screens
          filter: optimizedBlur > 0 ? `blur(${optimizedBlur}px)` : 'none',
          animation: `floatOrb ${speed}s ease-in-out ${delay}s infinite`,
          // GPU acceleration
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          // Prevent layout shifts
          contain: 'layout style paint',
          // Smooth transition when hiding on 4K
          opacity: isMounted && !shouldRender ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      />
      <style jsx>{`
        @keyframes floatOrb {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          33% {
            transform: translate3d(${moveX1}px, ${moveY1}px, 0);
          }
          66% {
            transform: translate3d(${moveX2}px, ${moveY2}px, 0);
          }
        }
      `}</style>
    </>
  );
}
