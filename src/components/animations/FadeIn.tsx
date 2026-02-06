"use client";

/**
 * FadeIn Component - 4K Optimized Framer Motion
 * 
 * Optimizations:
 * - useReducedMotion support (already implemented)
 * - 4K distance reduction (40%)
 * - Duration scaling for high-DPI
 * - GPU acceleration hints
 */

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { is4KScreen, ANIMATION_CONFIG } from "@/lib/animationConfig";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  fullWidth = false,
  once = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  // 4K Performance: Reduce animation distance by 40%
  const baseDistance = 16;
  const distance = is4KScreen() ? Math.round(baseDistance * 0.6) : baseDistance;

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  // 4K Performance: Reduce duration by 40%
  const optimizedDuration = is4KScreen() 
    ? duration * 0.6 
    : duration;

  const initial = {
    opacity: 0,
    ...(!shouldReduceMotion ? directions[direction] : {}),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration: optimizedDuration,
        delay,
        ease: "easeOut",
      }}
      className={cn(fullWidth ? "w-full" : "", className)}
      style={{
        // 4K Performance: GPU acceleration
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  );
}
