'use client';

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'framer-motion';

// Register plugins if needed globally, mainly to access methods
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkPerformance = async () => {
      // 1. User Preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsLowPerformance(true);
        setIsReady(true);
        return;
      }

      // 2. Hardware Concurrency
      // @ts-ignore
      const concurrency = navigator.hardwareConcurrency;
      if (concurrency && concurrency <= 4) {
        setIsLowPerformance(true);
        setIsReady(true);
        return;
      }

      // 3. Device Memory
      // @ts-ignore
      const memory = navigator.deviceMemory;
      if (memory && memory <= 4) {
        setIsLowPerformance(true);
        setIsReady(true);
        return;
      }

      // 4. FPS Test
      const fps = await measureFPS();
      if (fps < 50) {
        setIsLowPerformance(true);
      }
      
      setIsReady(true);
    };

    const measureFPS = (): Promise<number> => {
      return new Promise((resolve) => {
        let frames = 0;
        let p0 = performance.now();
        
        const loop = () => {
          frames++;
          const p1 = performance.now();
          if (p1 - p0 >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(loop);
          }
        };
        requestAnimationFrame(loop);
      });
    };

    checkPerformance();
  }, []);

  useEffect(() => {
    if (isLowPerformance) {
      // Apply global class
      document.documentElement.classList.add('no-animations');

      // Disable GSAP
      gsap.ticker.sleep(); // Stops the GSAP ticker (requestAnimationFrame loop)
      gsap.globalTimeline.pause();
      // Revert ScrollTrigger changes (unpin, reset styles) so content is accessible
      ScrollTrigger.disable(true); 
      
      // Patch matchMedia for components that check it on mount (if they remount)
      const originalMatchMedia = window.matchMedia;
      // @ts-ignore
      window.matchMedia = (query: string) => {
        if (query === '(prefers-reduced-motion: reduce)') {
             // Mocking a MediaQueryList object
             return {
                 matches: true,
                 media: query,
                 onchange: null,
                 addListener: () => {}, 
                 removeListener: () => {},
                 addEventListener: () => {},
                 removeEventListener: () => {},
                 dispatchEvent: () => false,
             };
        }
        return originalMatchMedia(query);
      };
      
    }
  }, [isLowPerformance]);

  // If strict requirement: key change forces remount of children when mode changes
  // This ensures MacBookShowcase sees the patched matchMedia and renders "Mobile Mode"
  return (
    <MotionConfig reducedMotion={isLowPerformance ? "always" : "user"}>
        <div key={isLowPerformance ? 'low-perf' : 'high-perf'}>
            {children}
        </div>
    </MotionConfig>
  );
}
