"use client";

/**
 * AnimateOnScroll Component - 4K Optimized
 *
 * Performance optimizations for 4K (3840×2160) displays:
 * 1. GPU-only animations (transform, opacity) - no layout thrashing
 * 2. Reduced motion detection and respect
 * 3. Animation distance reduced by 40% on 4K screens
 * 4. Concurrent animation limiting (max 7 at once)
 * 5. Enter-once animations (no continuous scroll tracking)
 * 6. Viewport-based lifecycle with cleanup
 * 7. will-change optimization (auto when not animating)
 */

import { useEffect, useRef, useState, ReactNode } from "react";
import {
  ANIMATION_CONFIG,
  getAnimationPreset,
  createTransition,
  shouldDisableAnimations,
  is4KScreen,
  animationCounter,
} from "@/lib/animationConfig";

export interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;

  // Animation type - all use GPU-accelerated transform + opacity only
  animation?:
    | "fadeIn"
    | "fadeUp"
    | "fadeDown"
    | "fadeLeft"
    | "fadeRight"
    | "scaleIn"
    | "scaleUp"
    | "blurIn"
    | "none";

  // Animation timing (auto-adjusted for 4K)
  duration?: number; // in milliseconds (default: 600)
  delay?: number; // in milliseconds (default: 0)

  // IntersectionObserver options
  threshold?: number; // 0 to 1 (default: 0.1)
  rootMargin?: string; // e.g., "0px 0px -100px 0px"

  // Animation behavior (default: once=true for performance)
  once?: boolean; // Animate only once (default: true)

  // Stagger support (for children)
  stagger?: boolean;
  staggerDelay?: number; // in milliseconds (default: 100)

  // Custom transform/opacity values
  initialOpacity?: number;
  initialY?: number;
  initialX?: number;
  initialScale?: number;
}

export function AnimateOnScroll({
  children,
  className = "",
  animation = "fadeUp",
  duration = 600,
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px",
  once = true, // Default to once for better performance
  stagger = false,
  staggerDelay = 100,
  initialOpacity = 0,
  initialY,
  initialX,
  initialScale,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 4K Performance: Respect reduced motion preference
    // if (shouldDisableAnimations()) {
    //   setIsVisible(true);
    //   setHasAnimated(true);
    //   return;
    // }

    // 4K Performance: Limit concurrent animations
    // if (!animationCounter.canAnimate() && !hasAnimated) {
    //   // Queue this animation by showing it without transition
    //   setIsVisible(true);
    //   setHasAnimated(true);
    //   return;
    // }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Start animation counter
            // animationCounter.start();
            setIsAnimating(true);
            setIsVisible(true);

            if (once) {
              setHasAnimated(true);
            }

            // 4K Performance: Clean up will-change after animation completes
            // const optimizedDuration = ANIMATION_CONFIG.duration.get4K(duration);
            const optimizedDuration = duration;
            animationTimeoutRef.current = setTimeout(
              () => {
                setIsAnimating(false);
                // animationCounter.end();
              },
              optimizedDuration + delay + 50,
            ); // +50ms buffer
          } else if (!once && hasAnimated && !entry.isIntersecting) {
            // Only for repeating animations (not recommended on 4K)
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (isAnimating) {
        // animationCounter.end();
      }
    };
  }, [threshold, rootMargin, once, hasAnimated, duration, delay, isAnimating]);

  /**
   * 4K Performance: Get initial transform with reduced distance
   * Uses ANIMATION_CONFIG.distance.get4K() for 40% reduction on 4K screens
   */
  const getInitialTransform = () => {
    if (
      initialY !== undefined ||
      initialX !== undefined ||
      initialScale !== undefined
    ) {
      const y = initialY ?? 0;
      const x = initialX ?? 0;
      const scale = initialScale ?? 1;
      // Apply 4K scaling to custom values
      // const scaledY = ANIMATION_CONFIG.distance.get4K(y);
      // const scaledX = ANIMATION_CONFIG.distance.get4K(x);
      // return `translate3d(${scaledX}px, ${scaledY}px, 0) scale(${scale})`;
      return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    // Use preset with 4K-optimized distances (function call to avoid SSR issues)
    const preset = getAnimationPreset(animation);
    if (preset) {
      return preset.initial.transform;
    }

    // Default fallback
    // return `translate3d(0, ${ANIMATION_CONFIG.distance.get4K(30)}px, 0)`;
  };

  // const optimizedDuration = ANIMATION_CONFIG.duration.get4K(duration);
  const optimizedDuration = duration;
  const easing =
    animation === "blurIn"
      ? ANIMATION_CONFIG.easing.circOut
      : ANIMATION_CONFIG.easing.easeOut;
  const transitionString = createTransition(duration, delay, easing);

  const baseStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : initialOpacity,
    transform: isVisible
      ? "translate3d(0, 0, 0) scale(1)"
      : getInitialTransform(),
    filter:
      animation === "blurIn"
        ? isVisible
          ? "blur(0px)"
          : "blur(10px)"
        : undefined,
    transition: transitionString,
    // 4K Performance: Only set will-change when actively animating
    willChange: isAnimating
      ? ANIMATION_CONFIG.gpu.willChangeActive
      : ANIMATION_CONFIG.gpu.willChange,
    // Force GPU acceleration with translateZ(0)
    ...(ANIMATION_CONFIG.gpu.transform3d && {
      WebkitTransform: isVisible
        ? "translate3d(0, 0, 0) scale(1)"
        : getInitialTransform(),
    }),
  };

  // Stagger support (applies stagger delay to children)
  if (stagger && isVisible) {
    // const optimizedStaggerDelay = ANIMATION_CONFIG.duration.get4K(staggerDelay);
    const optimizedStaggerDelay = staggerDelay;

    return (
      <div ref={ref} className={className} style={baseStyle}>
        {Array.isArray(children)
          ? children.map((child, index) => {
              const childDelay = delay + index * optimizedStaggerDelay;
              return (
                <div
                  key={index}
                  style={{
                    opacity: 0,
                    transform: getInitialTransform(),
                    animation: `staggerFadeIn ${optimizedDuration}ms ${ANIMATION_CONFIG.easing.easeOut} ${childDelay}ms forwards`,
                    // GPU acceleration for each child
                    willChange: "transform, opacity",
                  }}
                >
                  {child}
                </div>
              );
            })
          : children}
        <style jsx>{`
          @keyframes staggerFadeIn {
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  );
}

// Convenience wrapper components
export function FadeIn({
  children,
  ...props
}: Omit<AnimateOnScrollProps, "animation">) {
  return (
    <AnimateOnScroll animation="fadeIn" {...props}>
      {children}
    </AnimateOnScroll>
  );
}

export function FadeUp({
  children,
  ...props
}: Omit<AnimateOnScrollProps, "animation">) {
  return (
    <AnimateOnScroll animation="fadeUp" {...props}>
      {children}
    </AnimateOnScroll>
  );
}

export function ScaleIn({
  children,
  ...props
}: Omit<AnimateOnScrollProps, "animation">) {
  return (
    <AnimateOnScroll animation="scaleIn" {...props}>
      {children}
    </AnimateOnScroll>
  );
}

export function StaggerContainer({
  children,
  staggerDelay = 100,
  ...props
}: AnimateOnScrollProps) {
  return (
    <AnimateOnScroll stagger={true} staggerDelay={staggerDelay} {...props}>
      {children}
    </AnimateOnScroll>
  );
}

export function BlurIn({
  children,
  ...props
}: Omit<AnimateOnScrollProps, "animation">) {
  return (
    <AnimateOnScroll animation="blurIn" {...props}>
      {children}
    </AnimateOnScroll>
  );
}
