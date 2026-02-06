"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion, Variants } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingRevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the element floats from */
  direction?: "up" | "down" | "left" | "right";
  /** Distance to travel during reveal (pixels) */
  distance?: number;
  /** Duration of reveal animation */
  duration?: number;
  /** Delay before animation */
  delay?: number;
  /** Enable continuous floating after reveal */
  float?: boolean;
  /** Float intensity (pixels) */
  floatIntensity?: number;
  /** Float duration (seconds) */
  floatDuration?: number;
  /** Whether to trigger once or every time in view */
  once?: boolean;
  /** Add a glow effect during reveal */
  glow?: boolean;
  /** Glow color */
  glowColor?: string;
}

export function FloatingReveal({
  children,
  className,
  direction = "up",
  distance = 80,
  duration = 0.8,
  delay = 0,
  float = true,
  floatIntensity = 10,
  floatDuration = 4,
  once = true,
  glow = false,
  glowColor = "rgba(59, 130, 246, 0.3)",
}: FloatingRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const initial = {
    opacity: 0,
    ...directions[direction],
    scale: 0.9,
    filter: glow ? "blur(10px)" : "blur(0px)",
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  };

  // Continuous floating animation
  const floatVariants: Variants = float
    ? {
        float: {
          y: [-floatIntensity / 2, floatIntensity / 2, -floatIntensity / 2],
          transition: {
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      }
    : {};

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      whileInView={animate}
      animate={float ? "float" : undefined}
      variants={floatVariants}
      viewport={{ once, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth float
      }}
      className={cn("will-change-transform", className)}
      style={{
        boxShadow: glow ? `0 0 40px ${glowColor}` : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

// Anti-gravity container that applies parallax based on scroll position
interface AntigravityContainerProps {
  children: ReactNode;
  className?: string;
  /** Intensity of the antigravity effect */
  intensity?: number;
}

export function AntigravityContainer({
  children,
  className,
  intensity = 1,
}: AntigravityContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 50, damping: 20 };

  // As user scrolls past, elements rise up (anti-gravity)
  const y = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [40 * intensity, 0, -40 * intensity]),
    springConfig
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

// Stagger reveal with floating effect
interface FloatingStaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function FloatingStaggerContainer({
  children,
  className,
  staggerDelay = 0.12,
  delayChildren = 0,
}: FloatingStaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FloatingStaggerItemProps {
  children?: ReactNode;
  className?: string;
  float?: boolean;
  floatDelay?: number;
}

export function FloatingStaggerItem({
  children,
  className,
  float = true,
  floatDelay = 0,
}: FloatingStaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={cn("will-change-transform", className)}
      whileInView={
        float && !shouldReduceMotion
          ? {
              y: [0, -6, 0],
              transition: {
                duration: 3 + floatDelay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: floatDelay,
              },
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
