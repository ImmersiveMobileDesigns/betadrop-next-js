/**
 * Animation Configuration for 4K Display Optimization
 * 
 * This config provides centralized animation settings optimized for high-DPI displays.
 * Key optimizations:
 * - GPU-accelerated transforms only (transform, opacity)
 * - Reduced motion for 4K screens to maintain 60fps
 * - Smart detection of device capabilities
 * - Intersection Observer-based viewport detection
 */

// Detect if user is on a 4K or high-DPI screen
export const is4KScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.devicePixelRatio > 1.5 || window.innerWidth >= 3840;
};

// Detect if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation distance multiplier for 4K screens (40% reduction)
export const MOTION_SCALE_4K = 0.6;

// Maximum concurrent animations to prevent GPU overload
export const MAX_CONCURRENT_ANIMATIONS = 7;

/**
 * Base animation configuration
 * All durations in milliseconds
 */
export const ANIMATION_CONFIG = {
  // Duration settings (reduced by 40% for 4K)
  duration: {
    fast: 300,
    normal: 600,
    slow: 800,
    get4K: function(base: number) {
      return is4KScreen() ? Math.round(base * MOTION_SCALE_4K) : base;
    }
  },
  
  // Easing functions (optimized for performance)
  easing: {
    // Smooth cubic-bezier curves for better performance
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Linear for scrub animations (GSAP)
    linear: 'none',
  },
  
  // Transform distances (GPU-accelerated only)
  distance: {
    small: 20,
    medium: 30,
    large: 50,
    get4K: function(base: number) {
      return is4KScreen() ? Math.round(base * MOTION_SCALE_4K) : base;
    }
  },
  
  // Opacity values
  opacity: {
    hidden: 0,
    visible: 1,
    subtle: 0.6,
  },
  
  // IntersectionObserver thresholds
  threshold: {
    low: 0.1,
    medium: 0.2,
    high: 0.5,
  },
  
  // GPU acceleration hints
  gpu: {
    // Always use will-change: auto unless animating
    willChange: 'auto' as const,
    // Force GPU layer during animation
    willChangeActive: 'transform, opacity' as const,
    // Hardware acceleration
    transform3d: 'translateZ(0)',
  }
} as const;

/**
 * GSAP ScrollTrigger Configuration
 * Optimized for smooth scrolling and 4K displays
 */
export const GSAP_CONFIG = {
  // Scrub values for smooth scroll-linked animations
  scrub: {
    // Numeric values provide smoother feel than true
    smooth: is4KScreen() ? 0.6 : 0.4,  // Higher values for 4K = smoother
    fast: is4KScreen() ? 0.5 : 0.3,
    instant: 0.1,
  },
  
  // ScrollTrigger global settings
  scrollTrigger: {
    // Reduce callback frequency on 4K
    limitCallbacks: true,
    // Prevent recalc on mobile resize
    ignoreMobileResize: true,
    // Anticipate pin for smoother transitions
    anticipatePin: 1,
    // Prevent scroll conflicts
    preventOverlaps: true,
    // Fast scroll handling
    fastScrollEnd: true,
  }
} as const;

/**
 * Performance-optimized animation presets
 * Only transform and opacity (GPU-accelerated)
 * 
 * NOTE: These are getter functions to avoid hydration issues
 * (calling is4KScreen() during SSR would cause mismatches)
 */
export const getAnimationPreset = (animation: string) => {
  const presets = {
    fadeIn: {
      initial: { opacity: 0, transform: 'translateZ(0)' },
      animate: { opacity: 1, transform: 'translateZ(0)' },
    },
    
    fadeUp: {
      initial: { 
        opacity: 0, 
        transform: `translate3d(0, ${ANIMATION_CONFIG.distance.get4K(30)}px, 0)` 
      },
      animate: { 
        opacity: 1, 
        transform: 'translate3d(0, 0, 0)' 
      },
    },
    
    fadeDown: {
      initial: { 
        opacity: 0, 
        transform: `translate3d(0, -${ANIMATION_CONFIG.distance.get4K(30)}px, 0)` 
      },
      animate: { 
        opacity: 1, 
        transform: 'translate3d(0, 0, 0)' 
      },
    },
    
    fadeLeft: {
      initial: { 
        opacity: 0, 
        transform: `translate3d(${ANIMATION_CONFIG.distance.get4K(30)}px, 0, 0)` 
      },
      animate: { 
        opacity: 1, 
        transform: 'translate3d(0, 0, 0)' 
      },
    },
    
    fadeRight: {
      initial: { 
        opacity: 0, 
        transform: `translate3d(-${ANIMATION_CONFIG.distance.get4K(30)}px, 0, 0)` 
      },
      animate: { 
        opacity: 1, 
        transform: 'translate3d(0, 0, 0)' 
      },
    },
    
    scaleIn: {
      initial: { 
        opacity: 0, 
        transform: 'translate3d(0, 0, 0) scale(0.95)' 
      },
      animate: { 
        opacity: 1, 
        transform: 'translate3d(0, 0, 0) scale(1)' 
      },
    },
    
    scaleUp: {
      initial: { 
        opacity: 0, 
        transform: `translate3d(0, ${ANIMATION_CONFIG.distance.get4K(20)}px, 0) scale(0.95)` 
      },
      animate: { 
        opacity: 1, 
        transform: 'translate3d(0, 0, 0) scale(1)' 
      },
    },
  } as const;

  return presets[animation as keyof typeof presets] || presets.fadeUp;
};

/**
 * Image optimization for 4K displays
 */
export const IMAGE_CONFIG = {
  // Maximum width to prevent loading oversized images
  maxWidth: 1500,
  // Quality settings
  quality: {
    high: 80,
    medium: 70,
    low: 60,
  },
  // Recommended quality for 4K
  get4KQuality: () => is4KScreen() ? 70 : 80,
} as const;

/**
 * Disable expensive effects on 4K screens
 * Returns true if effect should be disabled
 */
export const shouldDisableEffect = (effect: 'blur' | 'shadow' | 'parallax'): boolean => {
  if (prefersReducedMotion()) return true;
  if (!is4KScreen()) return false;
  
  // Disable blur and heavy shadows on 4K
  if (effect === 'blur' || effect === 'shadow') return true;
  // Reduce parallax depth on 4K
  if (effect === 'parallax') return true;
  
  return false;
};

/**
 * Get optimal blur value (0 if should be disabled)
 */
export const getOptimalBlur = (baseBlur: number): number => {
  if (shouldDisableEffect('blur')) return 0;
  return is4KScreen() ? Math.round(baseBlur * 0.5) : baseBlur;
};

/**
 * Animation counter to limit concurrent animations
 */
class AnimationCounter {
  private count = 0;
  private readonly max = MAX_CONCURRENT_ANIMATIONS;
  
  canAnimate(): boolean {
    return this.count < this.max;
  }
  
  start(): void {
    if (this.count < this.max) {
      this.count++;
    }
  }
  
  end(): void {
    if (this.count > 0) {
      this.count--;
    }
  }
  
  reset(): void {
    this.count = 0;
  }
  
  getCount(): number {
    return this.count;
  }
}

export const animationCounter = new AnimationCounter();

/**
 * Helper to create optimized transition strings
 */
export function createTransition(
  duration: number,
  delay: number = 0,
  easing: string = ANIMATION_CONFIG.easing.easeOut
): string {
  const optimizedDuration = ANIMATION_CONFIG.duration.get4K(duration);
  return `opacity ${optimizedDuration}ms ${easing} ${delay}ms, transform ${optimizedDuration}ms ${easing} ${delay}ms`;
}

/**
 * Check if animations should be completely disabled
 */
export function shouldDisableAnimations(): boolean {
  return prefersReducedMotion();
}
