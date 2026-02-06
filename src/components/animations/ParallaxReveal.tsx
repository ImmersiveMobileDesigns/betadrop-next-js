"use client";

/**
 * ParallaxReveal Component - 4K Optimized
 * 
 * 4K Performance Notes:
 * - Deep parallax (depth > 1) DISABLED on 4K screens
 * - useReducedMotion support (already implemented)
 * - Reduced motion distances (40%)
 * - Simplified to basic fade on 4K for GPU efficiency
 */

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { shouldDisableEffect, is4KScreen } from "@/lib/animationConfig";

interface ParallaxRevealProps {
  children: ReactNode;
  className?: string;
  /** Speed of parallax effect. Positive = moves up as you scroll down, Negative = moves down */
  speed?: number;
  /** Initial Y offset before scroll */
  initialY?: number;
  /** Enable floating animation after reveal */
  float?: boolean;
  /** Rotation on reveal (degrees) */
  rotateOnScroll?: number;
  /** Scale effect based on scroll */
  scaleRange?: [number, number];
  /** Opacity range based on scroll position */
  opacityRange?: [number, number];
  /** Z-depth layer (higher = moves faster, feels closer) */
  depth?: 1 | 2 | 3;
  /** Delay before animation starts */
  delay?: number;
}

export function ParallaxReveal({
  children,
  className,
  speed = 0.5,
  initialY = 60,
  float = false,
  rotateOnScroll = 0,
  scaleRange = [0.95, 1],
  opacityRange = [0, 1],
  depth = 2,
  delay = 0,
}: ParallaxRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // 4K Performance: Disable deep parallax on 4K screens
  const disableParallax = shouldDisableEffect('parallax');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 4K Performance: Reduce motion distance by 40%
  const scaledInitialY = is4KScreen() ? Math.round(initialY * 0.6) : initialY;
  const scaledSpeed = is4KScreen() ? speed * 0.6 : speed;

  // Adjust speed based on depth layer
  const depthMultiplier = { 1: 0.5, 2: 1, 3: 1.5 }[depth];
  const adjustedSpeed = scaledSpeed * depthMultiplier;

  // Smooth spring physics for parallax movement
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [scaledInitialY, -scaledInitialY * adjustedSpeed]),
    springConfig
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [opacityRange[0], opacityRange[1], opacityRange[1], opacityRange[0]]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [scaleRange[0], scaleRange[1], scaleRange[1], scaleRange[0]]);
  const rotate = useTransform(scrollYProgress, [0, 1], [rotateOnScroll, -rotateOnScroll]);

  // 4K Performance: Disable float animation on 4K (continuous animation)
  const floatAnimation = float && !is4KScreen()
    ? {
        y: [0, -8, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const,
        },
      }
    : undefined;

  // 4K Performance: If parallax disabled, just show content with fade
  if (shouldReduceMotion || disableParallax) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        opacity,
        scale,
        rotate,
      }}
      animate={floatAnimation}
      initial={{ opacity: 0 }}
      transition={{ delay }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

// Lightweight variant for simple parallax without reveal animation
interface SimpleParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function SimpleParallax({
  children,
  className,
  speed = 0.3,
  direction = "up",
}: SimpleParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // 4K Performance: Disable parallax on 4K screens
  const disableParallax = shouldDisableEffect('parallax');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  // 4K Performance: Reduce parallax distance
  const scaledSpeed = is4KScreen() ? speed * 0.6 : speed;
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * scaledSpeed * multiplier]);

  if (shouldReduceMotion || disableParallax) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
